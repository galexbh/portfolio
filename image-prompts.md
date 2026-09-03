# Prompts de imagen para Codex

Assets visuales adicionales del portafolio, para generar externamente (Codex / cualquier
generador de imágenes) y colocar luego en `public/img/`. El sitio ya funciona sin ellos —
son mejoras opcionales que refuerzan el mundo visual "mapa de topología de red / dependencias
de servicio" ya construido en el hero (grafo SVG en vivo, sin foto genérica de stock).

Paleta del sitio (usar exactamente estos valores en cada prompt):
- Fondo casi negro: `#090c0f` / `#0f1418`
- Líneas/bordes finos: blanco al 8–18% de opacidad
- Acento vivo (estado "healthy"/activo): mint `#5eead4`
- Acento secundario: cian `#22d3ee`
- Estado "en progreso": ámbar `#f5b942`
- Tipografía de referencia (no se renderiza texto real en las imágenes, solo se sugiere el
  carácter): Overpass (grotesk técnico/señalética) para cualquier texto simulado, JetBrains
  Mono para etiquetas tipo código.

Estilo general en todos los prompts: minimalista, geométrico, línea fina (1–1.5px), fondo
oscuro casi negro, sin gradientes vistosos, sin glassmorphism, sin iconografía genérica de
"IA" (sin cerebros, sin circuitos brillantes cliché) — se trata de diagramas de topología de
red / dependencias de servicio reales, tipo mapa de service mesh o dashboard de observabilidad,
no arte fantástico.

---

## 1. Textura de fondo del Hero — `hero-grid-texture.webp`

**Propósito y ubicación:** capa de fondo muy sutil detrás del grafo de topología en el Hero
(primer viewport). Debe quedar casi imperceptible, solo aporta profundidad técnica.

**Prompt:**
> Ultra-subtle dark technical background texture, almost pure black (#090c0f), with a faint
> engineering grid of thin 1px lines (white at 4-6% opacity) spaced like a blueprint or
> schematic sheet, plus a few even fainter curved dotted "connection" traces suggesting a
> network topology map, no nodes, no icons, no text, no vignette, perfectly tileable
> horizontally, extremely low contrast so UI text stays fully readable on top. Flat, minimal,
> technical — like the background layer of a network observability dashboard, not decorative
> art.

**Estilo:** minimalista, geométrico, técnico/infraestructura, fondo oscuro coherente.
**Paleta:** `#090c0f` base, líneas blancas 4-6% opacidad, sin acentos de color.
**Dimensiones:** 1920×1080 (o 2560×1440 para retina), tileable horizontalmente.

---

## 2. Divisor de sección — `section-divider.svg` (o `.webp`)

**Propósito y ubicación:** motivo decorativo muy fino para reforzar el límite entre secciones
del scroll (actualmente es solo un `border-bottom` de 1px); esta versión añade 2-3 "nodos"
de circuito discretos a lo largo de la línea, coherente con el grafo del hero.

**Prompt:**
> A thin horizontal line divider in the style of a circuit trace or network link, almost
> black background transparent, single 1px line in muted white (12% opacity) running edge to
> edge, interrupted by 2-3 small hollow circle "nodes" (outlined in mint #5eead4, 1.5px
011 stroke, transparent fill) placed asymmetrically along the line, one node filled solid mint
> to suggest an "active" state. No glow, no gradient, flat vector line art, extremely minimal,
> matches a network topology diagram aesthetic.

**Estilo:** lineart técnico, coherente con los nodos del hero.
**Paleta:** línea blanca ~12% opacidad, nodos en mint `#5eead4`.
**Dimensiones:** 1600×60 (banda horizontal delgada), fondo transparente.

---

## 3. Set de íconos de categoría — `icon-cloud.svg`, `icon-cicd.svg`, `icon-observability.svg`, `icon-containers.svg`, `icon-automation.svg`, `icon-security.svg`

**Propósito y ubicación:** íconos de línea para encabezar cada tarjeta de la sección Skills
(actualmente son solo chips de texto); reemplazan el texto plano por un ícono + label,
manteniendo el vocabulario de "nodo de grafo" del hero (círculo hueco con trazo, nunca un
icono relleno tipo "flat design" genérico).

**Prompt (plantilla, repetir cambiando el concepto entre corchetes):**
> A single minimal line-art icon representing [cloud infrastructure / CI-CD pipeline
> automation / observability monitoring dashboard / container orchestration / infrastructure
> automation script / network security firewall], drawn as a network-topology node: a hollow
> circle (mint #5eead4, 1.5px stroke) as the icon's anchor point with 2-4 short straight or
> orthogonal connector lines radiating from it, terminating in smaller nodes, all on a
> transparent background, 1.5px uniform stroke weight, no fill except the single accent
> node, no shading, no 3D, no gradient — pure technical schematic linework, consistent
> stroke weight and node size across the whole icon set.

**Estilo:** lineart geométrico consistente, mismo lenguaje visual que los nodos del hero.
**Paleta:** mint `#5eead4` sobre transparente (para poder tintar/reusar sobre fondo oscuro).
**Dimensiones:** 64×64 (viewBox cuadrado), exportar como SVG idealmente, o PNG 256×256 si
solo hay generador raster.

---

## 4. Imagen social / Open Graph — `og-cover.webp`

**Propósito y ubicación:** miniatura que aparece al compartir el link del portafolio en
LinkedIn, WhatsApp o Twitter/X (`<meta property="og:image">`).

**Prompt:**
> A dark technical cover image, 1200x630px, near-black background (#090c0f), featuring a
> minimal network-topology diagram: one central hollow circle node (mint #5eead4 ring) with
> five thin connector lines radiating outward to five smaller nodes, arranged asymmetrically
> like a service dependency map, plus a large amount of calm negative space on the left third
> of the frame reserved for text overlay (leave that area empty/plain background, no
> elements). Faint 1px grid texture in the background at very low opacity. No people, no
> icons, no logos, no text baked into the image — text is added afterward in code.

**Estilo:** técnico, oscuro, coherente con el hero.
**Paleta:** fondo `#090c0f`, nodos y líneas en mint `#5eead4`.
**Dimensiones:** 1200×630 (estándar Open Graph).

---

## Nota sobre la foto de Gabriel

La foto del hero (`public/img/hero-portrait.webp`) **ya fue procesada** a partir de una foto
real (`assets/photo_2026-09-03_01-04-15.jpg`): recorte cuadrado centrado en rostro/gorra,
corrección de brillo/contraste, ligero viraje de color hacia el acento frío del sitio y
viñeta. No se necesita generación de imagen para el avatar — es intencionalmente una foto
real tratada, no una ilustración. Ningún prompt de esta lista debe usarse para producir un
rostro o persona sintética.
