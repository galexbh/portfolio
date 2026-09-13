/**
 * Geometría del grafo del hero, compartida entre el SVG server-rendered
 * (src/components/Hero.astro) y el render 3D en three.js
 * (src/scripts/hero-graph-3d.ts). Antes estos mismos números vivían
 * duplicados y sin relación entre los dos archivos — root, viewBox, radios
 * de nodo/halo y el stagger de la animación — que es lo que hizo falta
 * retocar, uno a la vez y a mano, en la seguidilla de "fix hero 3D" del
 * historial. Cambiar la geometría del grafo ahora es cambiarla aquí.
 */

export const ROOT = { x: 110, y: 300 };
export const VIEWBOX = { width: 460, height: 600 };
export const RADIUS = 250;
export const ANGLES_DEG = [-70, -35, 0, 35, 70];

export const NODE_RADIUS = 8;
export const HALO_RADIUS = 15;

/** Duración del trazo de cada arista, en segundos. */
export const DRAW_DURATION = 1.6;
/** Retraso entre el inicio del trazo de un nodo y el siguiente, en segundos. */
export const STAGGER = 0.15;

/**
 * Duración del easter egg del grafo (clic oculto sobre el avatar), en
 * segundos. Compartida entre el efecto en three.js (hero-graph-3d.ts) y su
 * respaldo en CSS puro para cuando el 3D no está activo (Hero.astro).
 */
export const PULSE_DURATION = 1.4;

export interface HeroGraphPoint {
  x: number;
  y: number;
}

/** Ubica `count` nodos alrededor de ROOT, a RADIUS, usando ANGLES_DEG en orden. */
export function layoutNodes(count: number): HeroGraphPoint[] {
  return Array.from({ length: count }, (_, i) => {
    const rad = (ANGLES_DEG[i] * Math.PI) / 180;
    return {
      x: ROOT.x + RADIUS * Math.cos(rad),
      y: ROOT.y + RADIUS * Math.sin(rad),
    };
  });
}
