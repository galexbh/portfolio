import {
  BufferGeometry,
  CircleGeometry,
  Group,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  LineLoop,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  MathUtils,
  type Material,
} from 'three';

export interface HeroGraphNode {
  label: string;
  detail: string;
}

interface NodeRig {
  position: Vector3;
  dotMaterial: LineBasicMaterial;
  edgeMaterial: LineDashedMaterial;
  edgeGeometry: BufferGeometry;
  edgeSegments: number;
  labelEl: HTMLDivElement;
}

const MINT = 0x5eead4;
const BG = 0x090c0f;
// Node distance from root. Checked against the camera/FOV/aspect below: at
// CAMERA_Z=8, CAMERA_FOV=42 and the container's 460/600 aspect, the closest
// node to the camera (angle 0, depth +0.45) stays within the frustum up to
// WORLD_R ≈ 2.18 (including the ±9° sway); 1.9 keeps a comfortable margin
// while spacing the fan out closer to the flat SVG's original spread.
const WORLD_R = 1.9;
const NODE_RADIUS = 0.1;
const EDGE_SEGMENTS = 32;
const DRAW_DURATION = 1.6; // seconds, matches the SVG's edge draw-in
// The group sways gently back and forth instead of spinning continuously.
// A full unbounded rotation eventually swings every node's azimuth past the
// root's own screen position (and past each other), causing a periodic,
// fully deterministic overlap — verified: at BASE_ROTATION_SPEED = 0.06 rad/s
// the closest node crosses the root's projection at ~16.5s of elapsed time.
// A bounded sway keeps the "alive" motion and the depth/parallax cue while
// staying far inside every node's crossing threshold (smallest is ~0.99 rad
// for this node layout) — SWAY_AMPLITUDE below has a wide safety margin.
const SWAY_AMPLITUDE = 0.16; // rad, ~9°
const SWAY_PERIOD = 16; // seconds for a full back-and-forth cycle
const PARALLAX_MAX = 0.22; // rad
const PARALLAX_LERP = 0.06;
const CAMERA_Z = 8;
const CAMERA_FOV = 42;

// Same fan angles as the flat SVG graph, plus a per-node depth offset so the
// nodes genuinely sit at different distances from the camera instead of on a
// flat disc — that depth is the one thing this rendition can do that the SVG
// version cannot. Kept modest so perspective doesn't push any node's apparent
// radius past the container bounds (verified against CAMERA_Z/CAMERA_FOV below).
const ANGLES_DEG = [-70, -35, 0, 35, 70];
const DEPTH_OFFSETS = [0.35, -0.3, 0.45, -0.4, 0.2];

function makeCircleLoopGeometry(radius: number, segments = 48): BufferGeometry {
  const points: Vector3[] = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    points.push(new Vector3(Math.cos(t) * radius, Math.sin(t) * radius, 0));
  }
  return new BufferGeometry().setFromPoints(points);
}

export function initHeroGraph3D(
  mount: HTMLElement,
  nodesInput: HeroGraphNode[],
  onFail: () => void
): (() => void) | null {
  let canvas: HTMLCanvasElement;
  let renderer: WebGLRenderer;

  try {
    canvas = document.createElement('canvas');
    canvas.className = 'graph-3d-canvas';
    mount.appendChild(canvas);
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    onFail();
    return null;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);
  camera.position.set(0, 0, CAMERA_Z);
  camera.lookAt(0, 0, 0);

  const group = new Group();
  scene.add(group);

  const rigs: NodeRig[] = nodesInput.map((node, i) => {
    const angle = (ANGLES_DEG[i] * Math.PI) / 180;
    const position = new Vector3(
      Math.cos(angle) * WORLD_R,
      -Math.sin(angle) * WORLD_R,
      DEPTH_OFFSETS[i] ?? 0
    );

    // Edge: root -> node, subdivided so drawRange can animate a progressive reveal.
    const edgePoints: Vector3[] = [];
    for (let s = 0; s <= EDGE_SEGMENTS; s += 1) {
      edgePoints.push(new Vector3().lerpVectors(new Vector3(0, 0, 0), position, s / EDGE_SEGMENTS));
    }
    const edgeGeometry = new BufferGeometry().setFromPoints(edgePoints);
    const edgeMaterial = new LineDashedMaterial({
      color: MINT,
      dashSize: 0.09,
      gapSize: 0.06,
      transparent: true,
      opacity: 0.55,
    });
    const edgeLine = new Line(edgeGeometry, edgeMaterial);
    edgeLine.computeLineDistances();
    edgeGeometry.setDrawRange(0, 0);
    group.add(edgeLine);

    // Node: hollow ring (always a true hairline, unlike a perspective-distorted torus)
    // plus a solid backing disc in the canvas background color, to occlude edges
    // that pass behind it — the same visual trick the flat SVG uses.
    const backing = new Mesh(
      new CircleGeometry(NODE_RADIUS, 32),
      new MeshBasicMaterial({ color: BG, transparent: true, opacity: 0.92 })
    );
    backing.position.copy(position);
    backing.lookAt(camera.position);
    group.add(backing);

    const dotMaterial = new LineBasicMaterial({ color: MINT, transparent: true, opacity: 0.85 });
    const ring = new LineLoop(makeCircleLoopGeometry(NODE_RADIUS), dotMaterial);
    ring.position.copy(position);
    group.add(ring);

    const labelEl = document.createElement('div');
    labelEl.className = 'graph-3d-label mono';
    labelEl.innerHTML = `<span class="graph-3d-label-title">${node.label}</span><span class="graph-3d-label-detail">${node.detail}</span>`;
    mount.appendChild(labelEl);

    return {
      position,
      dotMaterial,
      edgeMaterial,
      edgeGeometry,
      edgeSegments: EDGE_SEGMENTS,
      labelEl,
    } satisfies NodeRig;
  });

  function resize() {
    const { clientWidth, clientHeight } = mount;
    if (!clientWidth || !clientHeight) return;
    renderer.setSize(clientWidth, clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(mount);

  // Pointer parallax: lerp toward a small tilt based on cursor position within the viewport.
  let targetTiltX = 0;
  let targetTiltY = 0;
  let tiltX = 0;
  let tiltY = 0;
  function onPointerMove(e: PointerEvent) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetTiltY = nx * PARALLAX_MAX;
    targetTiltX = -ny * PARALLAX_MAX * 0.6;
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  let visible = true;
  function onVisibility() {
    visible = document.visibilityState === 'visible';
  }
  document.addEventListener('visibilitychange', onVisibility);

  const startTime = performance.now();
  let raf = 0;
  let disposed = false;

  function frame() {
    if (disposed) return;
    raf = requestAnimationFrame(frame);
    if (!visible) return;

    const elapsed = (performance.now() - startTime) / 1000;

    tiltX += (targetTiltX - tiltX) * PARALLAX_LERP;
    tiltY += (targetTiltY - tiltY) * PARALLAX_LERP;
    const sway = Math.sin((elapsed / SWAY_PERIOD) * Math.PI * 2) * SWAY_AMPLITUDE;
    group.rotation.y = sway + tiltY;
    group.rotation.x = tiltX;

    rigs.forEach((rig, i) => {
      // Draw-in reveal, staggered like the SVG's --delay: i * 0.15s.
      const delay = i * 0.15;
      const t = Math.min(Math.max((elapsed - delay) / DRAW_DURATION, 0), 1);
      const eased = 1 - (1 - t) * (1 - t); // ease-out
      rig.edgeGeometry.setDrawRange(0, Math.round(eased * rig.edgeSegments));

      // Depth-based tonal opacity instead of glow: farther nodes read dimmer.
      // Text stays legible regardless of depth — only the graphic elements
      // (dots/edges) get the full dim range; a 0.35 floor on actual label
      // text made distant nodes nearly unreadable on desktop.
      const worldPos = rig.position.clone().applyMatrix4(group.matrixWorld);
      const viewPos = worldPos.clone().applyMatrix4(camera.matrixWorldInverse);
      const depth01 = MathUtils.clamp((viewPos.z + WORLD_R) / (WORLD_R * 2), 0, 1);
      const opacity = MathUtils.lerp(0.35, 0.9, depth01);
      const labelOpacity = MathUtils.lerp(0.8, 1, depth01);
      rig.edgeMaterial.opacity = opacity * 0.6;
      rig.dotMaterial.opacity = opacity;
      rig.labelEl.style.opacity = String(labelOpacity);

      // Project to screen space for the DOM label.
      const ndc = worldPos.clone().project(camera);
      const screenX = ((ndc.x + 1) / 2) * mount.clientWidth;
      const screenY = ((1 - ndc.y) / 2) * mount.clientHeight;
      rig.labelEl.style.transform = `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`;
    });

    renderer.render(scene, camera);
  }

  let contextLost = false;
  function handleContextLost(e: Event) {
    e.preventDefault();
    contextLost = true;
    dispose();
    onFail();
  }
  canvas.addEventListener('webglcontextlost', handleContextLost);

  raf = requestAnimationFrame(frame);

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibility);
    if (!contextLost) canvas.removeEventListener('webglcontextlost', handleContextLost);
    rigs.forEach((rig) => {
      rig.edgeGeometry.dispose();
      rig.edgeMaterial.dispose();
      rig.labelEl.remove();
    });
    scene.traverse((obj) => {
      if (obj instanceof Mesh || obj instanceof Line || obj instanceof LineLoop) {
        obj.geometry?.dispose();
        const mat = obj.material as Material | Material[];
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      }
    });
    renderer.dispose();
    canvas.remove();
  }

  return dispose;
}
