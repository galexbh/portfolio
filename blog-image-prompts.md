# Prompts de imagen para el blog — Codex

Esta lista extiende el mismo sistema de assets de `image-prompts.md` a la sección de blog
(`content/posts/*`, campo opcional `cover` en `keystatic.config.ts`, guardado bajo
`public/img/blog/`). Igual que el resto del sitio, el blog **ya funciona sin estas imágenes**:
son mejoras opcionales que refuerzan el mismo mundo visual "mapa de topología de red /
dependencias de servicio" ya construido en el hero (grafo SVG en vivo), no una dirección
nueva ni un estilo distinto para el blog.

Paleta del sitio (idéntica a `image-prompts.md`, usar exactamente estos valores):
- Fondo casi negro: `#090c0f` / `#0f1418`
- Líneas/bordes finos: blanco al 8–18% de opacidad
- Acento vivo (estado "healthy"/activo): mint `#5eead4`
- Acento secundario: cian `#22d3ee`
- Estado "en progreso" / restringido: ámbar `#f5b942`
- Tipografía de referencia (no se renderiza texto real en las imágenes, solo se sugiere el
  carácter): Overpass (grotesk técnico/señalética) para cualquier texto simulado, JetBrains
  Mono para etiquetas tipo código.

Estilo general en todos los prompts: minimalista, geométrico, línea fina (1–1.5px), fondo
oscuro casi negro, sin gradientes vistosos, sin glassmorphism, sin iconografía genérica de
"IA" (sin cerebros, sin circuitos brillantes cliché) — se trata de diagramas de topología de
red / dependencias de servicio reales, tipo mapa de service mesh o dashboard de
observabilidad, no arte fantástico ni fotografía de stock. El ámbar `#f5b942` NO se usa en
ninguna imagen del blog — está reservado exclusivamente para el badge de proyectos
empresariales/restringidos (ver la Amber Exception Rule de `DESIGN.md`), un concepto que no
existe en el blog.

El blog tiene dos categorías reales (`category` en Keystatic: `sre-devops` / `personal`),
cada una con su propio acento ya cableado en el código:
- **SRE / DevOps** → mint `#5eead4` (el acento por defecto de todo el sitio).
- **Personal** → cian `#22d3ee` (el segundo acento con nombre propio, documentado en
  `DESIGN.md` como "Secondary Cyan" — antes un token declarado sin usar, ahora activo). Los
  prompts de portada para posts personales deben usar cian como acento en vez de mint, no
  como un color más entre varios.

---

## 1. Portada genérica / fallback de post — `blog-cover-default.webp`

**Propósito y ubicación:** portada de respaldo cuando un post no tiene `cover` propio en
Keystatic. Se usa en dos lugares con relaciones de aspecto distintas: como `<meta
property="og:image">` al compartir el link de un post (1200×630, igual que `og-cover.webp`)
y como miniatura de tarjeta en el listado `/blog` cuando el post no define portada (donde el
recorte probable es más ancho, tipo 16:9). El prompt debe resolver esa tensión: una
composición con un único foco visual centrado y suficiente espacio negativo alrededor para
que un recorte a 16:9 (quitando franjas arriba/abajo) no pierda el nodo principal ni corte
conectores a la mitad.

**Prompt:**
> A dark technical cover image, near-black background (#090c0f), featuring a single minimal
> network-topology composition: one central hollow circle node (mint #5eead4 ring, 1.5px
> stroke) with four to six thin straight connector lines radiating outward to smaller nodes,
> arranged so the central node and its immediate connections sit within the middle 60% of
> the frame both vertically and horizontally (safe for a wider crop that trims the top and
> bottom bands). Faint 1px grid texture in the background at very low opacity, generous calm
> negative space around the composition, no dense clutter at the edges. No people, no stock-
> photo elements, no icons, no logos, no text baked into the image — text is added afterward
> in code.

**Estilo:** técnico, oscuro, coherente con el hero y con `og-cover.webp`.
**Paleta:** fondo `#090c0f`, nodos y líneas en mint `#5eead4`.
**Dimensiones:** 1200×630 (relación Open Graph estándar), diseñado para recortar bien también
a 16:9 (tarjeta del listado) sin perder el foco central.

---

## 2. Banner del listado de blog — `blog-index-banner.webp` (opcional)

**Propósito y ubicación:** posible imagen de cabecera para `/blog`, encima de la lista de
posts, para señalar "esta es la sección de notas/escritura" dentro del mismo lenguaje visual
del hero. **Opcional** — solo generar/usar si la página construida termina necesitando un
elemento visual ahí; el listado funciona perfectamente bien solo con texto y tarjetas.

**Prompt:**
> A wide dark technical banner, near-black background (#090c0f), showing a denser, more
> layered network-topology diagram than a single hero node: multiple hollow circle nodes
> (mint #5eead4 ring, 1.5px stroke) connected by thin straight and orthogonal lines,
> suggesting many independent threads or entries converging loosely rather than one clean
> hub-and-spoke — like a service mesh with a dozen small services, not a single dependency
> tree. Faint 1px grid texture at very low opacity, flat vector line art, generous negative
> space so the pattern reads as texture rather than a diagram to parse. No text, no icons, no
> logos, no gradients, no glow.

**Estilo:** lineart técnico, mismo vocabulario de nodos que el hero pero con mayor densidad.
**Paleta:** fondo `#090c0f`, nodos y líneas en mint `#5eead4`.
**Dimensiones:** sugerido 1600×400 (banda horizontal ancha), ajustar si el layout final pide
otra proporción.

---

## 3. Portadas temáticas — SRE / DevOps

**Propósito y ubicación:** portadas específicas (`cover` en Keystatic, categoría
`sre-devops`) para posts técnicos: observabilidad, CI/CD, automatización de infraestructura,
contenedores/orquestación. Pensado para un blog activo y variado, no solo banca regulada —
estos temas aplican a cualquier nota técnica de SRE/DevOps. Cada variante reutiliza la misma
composición base de nodo-y-conectores en mint, cambiando solo el detalle temático entre
corchetes — no se refieren a títulos de post concretos, sino a la categoría/tema.

**Prompt (plantilla, repetir cambiando el concepto entre corchetes):**
> A dark technical cover image, near-black background (#090c0f), for a blog post about
> [an observability and monitoring topic / a CI-CD pipeline topic / an infrastructure-
> automation topic / a container orchestration topic], drawn as a network-topology diagram:
> one central hollow circle node (mint #5eead4 ring, 1.5px stroke) connected by thin lines to
> several smaller nodes, arranged asymmetrically like a service dependency map.
> [Variant-specific detail — see substitutions below]. Faint 1px grid texture in the
> background at very low opacity, calm negative space, no people, no icons, no logos, no text
> baked into the image.

**Sustituciones por tema:**
- **Observabilidad:** "small dashed-line concentric rings (mint #5eead4, very low opacity)
  emanating from two or three of the nodes, suggesting a monitoring probe or health-check
  pulse, without any glow or gradient."
- **CI/CD:** "the connector lines between nodes are drawn as a directional chain (left to
  right), with small hollow arrow ticks at each connection suggesting a pipeline flow, ending
  in a final solid mint node representing a completed stage."
- **Automatización de infraestructura:** "two or three of the nodes are drawn as small
  hollow squares instead of circles (same 1.5px mint stroke) to suggest scripted/managed
  resources, mixed among the regular circle nodes, connected by the same thin lines."
- **Contenedores / orquestación:** "several nodes are grouped inside a loosely drawn hollow
  rounded-rectangle boundary (same 1.5px mint stroke), like pods clustered inside a node pool,
  with one or two connector lines crossing the boundary to nodes outside it."

**Estilo:** lineart técnico, mismo vocabulario de nodos que el hero.
**Paleta:** fondo `#090c0f`, mint `#5eead4` como único acento.
**Dimensiones:** 1200×630, igual criterio de recorte seguro a 16:9 que el prompt 1.

---

## 4. Portadas temáticas — Personal

**Propósito y ubicación:** portadas para posts de la categoría `personal` en Keystatic — notas
que no son estrictamente técnicas (reflexiones, aprendizajes, vida fuera del trabajo). Mismo
sistema de nodos y líneas que el resto del sitio, pero en **cian `#22d3ee`** en vez de mint —
esa es la única diferencia deliberada, ya que el cian es el acento que el código usa para
distinguir visualmente "Personal" de "SRE / DevOps" (chip de categoría y nodo de la tarjeta en
`/blog`). La composición también puede ser algo más suelta/orgánica que las variantes técnicas
(menos "diagrama a resolver", más "constelación"), para reforzar el contraste de registro sin
salirse del mismo lenguaje de línea fina.

**Prompt (plantilla, repetir cambiando el concepto entre corchetes):**
> A dark technical cover image, near-black background (#090c0f), for a personal blog post
> about [a reflection or lessons-learned topic / a side project or hobby topic / a career or
> learning-in-public topic], drawn in the same node-and-line visual language as a network
> topology diagram, but in cyan (#22d3ee, 1.5px stroke) instead of mint: a loose scatter of
> hollow circle nodes connected by thin straight lines, less rigidly hub-and-spoke than a
> service map — more like a small constellation than an infrastructure diagram, still flat
> and geometric, no organic curves. Faint 1px grid texture in the background at very low
> opacity, calm negative space, no people, no icons, no logos, no text baked into the image.

**Sustituciones por tema:**
- **Reflexión / aprendizajes:** "one node sits slightly apart from the rest, connected by a
  single longer line, suggesting a standalone thought branching off the main cluster."
- **Proyecto personal / hobby:** "two small clusters of 3-4 nodes each, loosely linked by one
  connector between clusters, suggesting two related but separate small systems."
- **Carrera / aprendizaje en público:** "the nodes increase slightly in size left to right
  across the frame, suggesting quiet progression, still connected by the same thin lines."

**Estilo:** mismo vocabulario de nodos que el resto del sitio, cian en vez de mint, composición
más suelta.
**Paleta:** fondo `#090c0f`, cian `#22d3ee` como único acento (nunca mezclar con mint en la
misma imagen).
**Dimensiones:** 1200×630, igual criterio de recorte seguro a 16:9 que el prompt 1.

---

## Nota sobre el alcance de este archivo

Ninguna imagen de esta lista es necesaria para que el blog funcione: tanto el listado
`/blog` como la vista de post individual están construidos para renderizar correctamente sin
`cover` (estado sin portada ya contemplado en el código). Estos prompts son mejoras visuales
opcionales que se pueden generar y colocar en `public/img/blog/` en cualquier momento después
del lanzamiento, sin bloquear el envío del blog.
