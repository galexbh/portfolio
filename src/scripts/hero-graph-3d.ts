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
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  MathUtils,
  type Material,
} from 'three';

export interface HeroGraphNode {
  label: string;
  detail: string;
  x: number;
  y: number;
}

interface NodeRig {
  position: Vector3;
  dotMaterial: LineBasicMaterial;
  haloMaterial: LineBasicMaterial;
  edgeMaterial: LineDashedMaterial;
  edgeGeometry: BufferGeometry;
  edgeVertexCount: number;
}

const VIEWBOX_WIDTH = 460;
const VIEWBOX_HEIGHT = 600;
const ROOT_X = 110;
const ROOT_Y = 300;
const NODE_RADIUS = 8;
const HALO_RADIUS = 15;
const EDGE_SEGMENTS = 32;
const DRAW_DURATION = 1.6;
const SWAY_AMPLITUDE = 0.025;
const SWAY_PERIOD = 16;
const PARALLAX_MAX = 0.035;
const PARALLAX_LERP = 0.06;
const CAMERA_Z = 100;
const DEPTH_RANGE = 42;
const DEPTH_OFFSETS = [18, -16, 24, -22, 10];

function makeCircleLoopGeometry(radius: number, segments = 48): BufferGeometry {
  const points: Vector3[] = [];
  for (let i = 0; i < segments; i += 1) {
    const t = (i / segments) * Math.PI * 2;
    points.push(new Vector3(Math.cos(t) * radius, Math.sin(t) * radius, 0));
  }
  return new BufferGeometry().setFromPoints(points);
}

function cssColor(element: HTMLElement, property: string, fallback: string): string {
  return getComputedStyle(element).getPropertyValue(property).trim() || fallback;
}

export function initHeroGraph3D(
  mount: HTMLElement,
  nodesInput: HeroGraphNode[],
  onReady: () => void,
  onFail: () => void
): (() => void) | null {
  const nodes = nodesInput.filter((node) => Number.isFinite(node.x) && Number.isFinite(node.y));
  if (!nodes.length) {
    onFail();
    return null;
  }

  let canvas: HTMLCanvasElement;
  let renderer: WebGLRenderer;

  try {
    canvas = document.createElement('canvas');
    canvas.className = 'graph-3d-canvas';
    mount.appendChild(canvas);
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  } catch {
    onFail();
    return null;
  }

  const accent = cssColor(mount, '--accent', '#5eead4');
  const background = cssColor(mount, '--bg', '#090c0f');
  const scene = new Scene();
  const camera = new OrthographicCamera(0, VIEWBOX_WIDTH, 0, VIEWBOX_HEIGHT, 0.1, 300);
  camera.position.set(0, 0, CAMERA_Z);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);

  const group = new Group();
  group.position.set(ROOT_X, ROOT_Y, 0);
  scene.add(group);

  const rigs: NodeRig[] = nodes.map((node, i) => {
    const position = new Vector3(
      node.x - ROOT_X,
      node.y - ROOT_Y,
      DEPTH_OFFSETS[i % DEPTH_OFFSETS.length]
    );

    const edgePoints: Vector3[] = [];
    for (let segment = 0; segment <= EDGE_SEGMENTS; segment += 1) {
      edgePoints.push(position.clone().multiplyScalar(segment / EDGE_SEGMENTS));
    }
    const edgeGeometry = new BufferGeometry().setFromPoints(edgePoints);
    const edgeMaterial = new LineDashedMaterial({
      color: accent,
      dashSize: 6,
      gapSize: 4,
      transparent: true,
      opacity: 0.55,
    });
    const edgeLine = new Line(edgeGeometry, edgeMaterial);
    edgeLine.computeLineDistances();
    edgeGeometry.setDrawRange(0, 0);
    group.add(edgeLine);

    const backing = new Mesh(
      new CircleGeometry(NODE_RADIUS, 32),
      new MeshBasicMaterial({ color: background, transparent: true, opacity: 0.94 })
    );
    backing.position.copy(position);
    group.add(backing);

    const dotMaterial = new LineBasicMaterial({ color: accent, transparent: true, opacity: 0.85 });
    const ring = new LineLoop(makeCircleLoopGeometry(NODE_RADIUS), dotMaterial);
    ring.position.copy(position);
    group.add(ring);

    const haloMaterial = new LineBasicMaterial({ color: accent, transparent: true, opacity: 0.18 });
    const halo = new LineLoop(makeCircleLoopGeometry(HALO_RADIUS), haloMaterial);
    halo.position.copy(position);
    group.add(halo);

    return {
      position,
      dotMaterial,
      haloMaterial,
      edgeMaterial,
      edgeGeometry,
      edgeVertexCount: EDGE_SEGMENTS + 1,
    } satisfies NodeRig;
  });

  let lastWidth = 0;
  let lastHeight = 0;
  function resize(): boolean {
    const { clientWidth, clientHeight } = mount;
    if (!clientWidth || !clientHeight) return false;
    if (clientWidth === lastWidth && clientHeight === lastHeight) return true;
    lastWidth = clientWidth;
    lastHeight = clientHeight;
    renderer.setSize(clientWidth, clientHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return true;
  }

  const resizeObserver = new ResizeObserver(() => {
    if (resize()) requestFrame();
  });
  resizeObserver.observe(mount);

  let targetTiltX = 0;
  let targetTiltY = 0;
  let tiltX = 0;
  let tiltY = 0;
  function onPointerMove(event: PointerEvent) {
    const bounds = mount.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const nx = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    const ny = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
    targetTiltY = MathUtils.clamp(nx, -1, 1) * PARALLAX_MAX;
    targetTiltX = -MathUtils.clamp(ny, -1, 1) * PARALLAX_MAX * 0.6;
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  let pageVisible = document.visibilityState === 'visible';
  let inViewport = true;
  let raf = 0;
  let disposed = false;
  let ready = false;
  const worldPosition = new Vector3();

  function shouldAnimate() {
    return !disposed && pageVisible && inViewport;
  }

  function requestFrame() {
    if (!raf && shouldAnimate()) raf = requestAnimationFrame(frame);
  }

  function onVisibility() {
    pageVisible = document.visibilityState === 'visible';
    if (!pageVisible && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      requestFrame();
    }
  }
  document.addEventListener('visibilitychange', onVisibility);

  const viewportObserver = new IntersectionObserver((entries) => {
    inViewport = entries.some((entry) => entry.isIntersecting);
    if (!inViewport && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else {
      requestFrame();
    }
  }, { rootMargin: '120px' });
  viewportObserver.observe(mount);

  function frame() {
    raf = 0;
    if (!shouldAnimate() || !resize()) return;

    const elapsed = performance.now() / 1000;
    tiltX += (targetTiltX - tiltX) * PARALLAX_LERP;
    tiltY += (targetTiltY - tiltY) * PARALLAX_LERP;
    const sway = Math.sin((elapsed / SWAY_PERIOD) * Math.PI * 2) * SWAY_AMPLITUDE;
    group.rotation.y = sway + tiltY;
    group.rotation.x = tiltX;
    group.updateMatrixWorld(true);

    rigs.forEach((rig, i) => {
      const delay = i * 0.15;
      const progress = MathUtils.clamp((elapsed - delay) / DRAW_DURATION, 0, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      rig.edgeGeometry.setDrawRange(0, Math.max(0, Math.round(eased * rig.edgeVertexCount)));

      worldPosition.copy(rig.position).applyMatrix4(group.matrixWorld);
      const depth = MathUtils.clamp((worldPosition.z + DEPTH_RANGE) / (DEPTH_RANGE * 2), 0, 1);
      rig.edgeMaterial.opacity = MathUtils.lerp(0.34, 0.55, depth);
      rig.dotMaterial.opacity = MathUtils.lerp(0.66, 0.9, depth);
      rig.haloMaterial.opacity = MathUtils.lerp(0.1, 0.22, depth);
    });

    renderer.render(scene, camera);

    if (!ready) {
      ready = true;
      requestAnimationFrame(() => {
        if (!disposed) onReady();
      });
    }

    requestFrame();
  }

  let contextLost = false;
  function handleContextLost(event: Event) {
    event.preventDefault();
    contextLost = true;
    dispose();
    onFail();
  }
  canvas.addEventListener('webglcontextlost', handleContextLost);

  function dispose() {
    if (disposed) return;
    disposed = true;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    resizeObserver.disconnect();
    viewportObserver.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibility);
    if (!contextLost) canvas.removeEventListener('webglcontextlost', handleContextLost);

    scene.traverse((object) => {
      if (object instanceof Mesh || object instanceof Line || object instanceof LineLoop) {
        object.geometry?.dispose();
        const material = object.material as Material | Material[];
        if (Array.isArray(material)) material.forEach((item) => item.dispose());
        else material?.dispose();
      }
    });
    renderer.dispose();
    canvas.remove();
  }

  requestFrame();
  return dispose;
}
