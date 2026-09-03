---
name: Gabriel Barrientos — Portfolio
description: A live service-dependency map that reads a regulated-banking SRE's career as a topology that stays up.
colors:
  canvas: "#090c0f"
  surface-elevated: "#0f1418"
  surface-elevated-2: "#141b20"
  line: "rgba(230, 237, 240, 0.10)"
  line-strong: "rgba(230, 237, 240, 0.18)"
  text: "#e6edf0"
  text-dim: "#8b98a1"
  text-faint: "#737d85"
  accent-mint: "#5eead4"
  accent-mint-dim: "rgba(94, 234, 212, 0.14)"
  status-amber: "#f5b942"
typography:
  display:
    fontFamily: "Overpass, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(2.4rem, 1.8rem + 3.2vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Overpass, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.6rem, 1.2rem + 1.6vw, 2.4rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Overpass, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.02rem–1.15rem"
    fontWeight: 600
    lineHeight: 1.2
  body:
    fontFamily: "Overpass, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "13px–16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    fontSize: "11px–13px"
    fontWeight: 500
    letterSpacing: "0.02em–0.08em"
rounded:
  sm: "4px"
  md: "6px"
  pill: "999px"
spacing:
  gap-sm: "8px"
  gap-md: "16px"
  gap-lg: "24px"
  gutter: "24px"
  section-y: "96px"
components:
  button-primary:
    backgroundColor: "{colors.accent-mint-dim}"
    textColor: "{colors.accent-mint}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
  button-primary-hover:
    backgroundColor: "rgba(94, 234, 212, 0.22)"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-dim}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "12px 22px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text}"
  card:
    backgroundColor: "{colors.surface-elevated}"
    rounded: "{rounded.md}"
    padding: "28px"
  chip:
    backgroundColor: "{colors.surface-elevated}"
    textColor: "{colors.text-dim}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
---

# Design System: Gabriel Barrientos — Portfolio

## Overview

**Creative North Star: "The Live Topology"**

The site reads as a service-dependency map that happens to describe a career, not a résumé wearing a dark theme. Every recurring shape — the hollow-circle node, the thin dashed or solid edge, the mono status label — is drawn from network-topology and observability tooling (Grafana/Dynatrace-adjacent, not sci-fi HUD). The world rejects the generic neon-glassmorphism SRE-dashboard default: no glass blur panels, no gradient glows, no multi-color status soup. Density is calm and technical — one accent color carries almost all the emphasis in the entire system, and its restraint is what reads as "production-grade" rather than "template."

The canvas is near-black rather than pure black, giving the line-art edges (1px, low-opacity white) somewhere to sit without vibrating. Content is organized as flat, bordered sections on a single scrolling column, each one a "panel" in the topology rather than a card wall. Motion is limited to edges drawing themselves in and content revealing on scroll — never decorative, always legible as "the graph is alive."

The hero graph has a WebGL rendition (`src/scripts/hero-graph-3d.ts`, Three.js) as a progressive enhancement on top of the flat SVG version — same nodes, same edges, same mint-only palette, no lights, no bloom, no gradient glow (the SVG stays the permanent fallback for JS-disabled, no-WebGL2, `prefers-reduced-motion`, narrow viewports, and any runtime failure, so there is never a code path that renders nothing). The one thing the 3D version does that the flat graph cannot: the five capability nodes sit at genuinely different depths and slowly rotate with a damped pointer-parallax tilt, so nodes pass behind the root and dim by real distance (tonal opacity, not glow) rather than by a flat z-index trick. This is still "the graph is alive," just literalized — depth is drawn, not decorated.

**Key Characteristics:**
- Near-black canvas with 1px hairline borders standing in for depth (no shadows)
- One electric mint accent for "healthy/active"; amber is reserved exclusively for a named restricted/enterprise status, never for a "past" or default state
- Every node in the system (hero graph, skill clusters, timeline markers, project mounts) is the same hollow-circle-with-ring motif
- Monospace for every technical/status label; a grounded geometric sans for everything read as prose

## Colors

The palette is almost monochrome by design: a near-black neutral scale carries the page, and mint is the only color allowed to mean "on."

### Primary
- **Signal Mint** (`#5eead4`): the single "healthy/active" accent — hover states, the primary CTA, current-role highlighting, OSS project badges, "healthy" status dots, edge lines in the hero graph. Paired with **Signal Mint Dim** (`rgba(94, 234, 212, 0.14)`) as its low-opacity fill for buttons, metric chips, and the halo/glow ring behind a node.

### Secondary
- **Restricted Amber** (`#f5b942`): reserved exclusively for the "restricted / enterprise" status — the enterprise project badge and its node-mount dot. It is a named exception, not a general warning color; it never marks a "past" or completed state (an earlier build used amber for past roles and that was a confirmed defect, fixed before ship — past timeline entries use a hollow neutral dot, never amber).
- **Secondary Cyan** (`#22d3ee`, `rgba(34, 211, 238, 0.35)` for chip borders): declared as a token from the start but unused until the blog — it now marks the "Personal" post category (node-mount ring, category chip), a second named exception alongside amber. Mint stays "SRE / DevOps" (the site's default healthy/active meaning); cyan is the one place a second hue is allowed, and only for this one category distinction. Never repurpose it as a generic second accent.

### Neutral
- **Canvas Black** (`#090c0f`): page background, the base of the topology.
- **Elevated Panel** (`#0f1418`): card and cluster backgrounds — one step off canvas, never a shadow.
- **Elevated Panel 2** (`#141b20`): the terminal-window chrome bar in Contact, a second step up for nested surfaces.
- **Hairline** (`rgba(230, 237, 240, 0.10)`): default 1px section and card borders, list dividers.
- **Hairline Strong** (`rgba(230, 237, 240, 0.18)`): borders that need more presence — chip borders, timeline connector lines, node-mount stems.
- **Signal Text** (`#e6edf0`): primary reading color for headings and emphasized copy.
- **Dim Text** (`#8b98a1`): body copy, secondary labels.
- **Faint Text** (`#737d85`): tertiary metadata — periods, categories, footer.

### Named Rules
**The One Signal Rule.** Mint is the only color permitted to mean "active, healthy, or emphasized." It is never used decoratively; every instance of mint on the page is load-bearing status information (a hover, a current role, a healthy node, a primary action).

**The Amber Exception Rule.** Amber means exactly one thing — "restricted/enterprise" — and appears in exactly two places: the enterprise project badge and its matching node-mount dot. It must never be reused for "past," "warning," "error," or any other state; those meanings stay unassigned rather than borrowing amber.

## Typography

**Display/Body Font:** Overpass (self-hosted, weights 400/500/600), with system-sans fallback.
**Label/Mono Font:** JetBrains Mono (self-hosted, weights 400/500/600), with ui-monospace fallback.

**Character:** A geometric grounded sans for anything read as prose (name, headlines, body copy), paired with a monospace for anything read as data — timestamps, status codes, handles, categories, metrics. The pairing itself is the "this is a system, not a page" signal.

### Hierarchy
- **Display** (600, `clamp(2.4rem, 1.8rem + 3.2vw, 4rem)`, 1.05 line-height, −0.01em tracking): the hero headline only.
- **Headline** (600, `clamp(1.6rem, 1.2rem + 1.6vw, 2.4rem)`): every section's `h2`.
- **Title** (600, 1.02–1.15rem): card and entry `h3` (project names, role titles, degree name).
- **Body** (400, 13–16px, 1.6 line-height): paragraph copy; hero subhead caps at 46ch, About lead paragraph is unconstrained but reads short.
- **Label** (500, 11–13px, 0.02–0.08em tracking, uppercase for cluster/category labels only): status text, timestamps, categories, nav links, chips, metrics — always monospace.

### Named Rules
**The Mono-Is-Data Rule.** Monospace is used exactly where a real system would show you a status code, timestamp, handle, or label — never for headlines and never for body prose. If a string reads as "data about the page" rather than "the page's content," it's mono.

## Layout

Single-column vertical scroll, one section per résumé block (Hero, About, Experience, Skills, Projects, Certifications, Education, Contact), each a flat bordered panel (`border-bottom: 1px solid` hairline, no border on the last section) with 96px vertical padding (64px under 720px). Content is centered in a 1160px max-width container (`.wrap`) with 24px horizontal padding. Section-internal grids commonly cap at 780–820px so long text blocks (About, Experience, Certifications) don't stretch past a comfortable measure even inside the wider container.

Two-column layouts (Hero copy/graph, Contact copy/terminal) use CSS grid with the illustrative/graph element and the copy each taking roughly half the row above ~900px, collapsing to a single stacked column below that breakpoint (900px for Hero, 800px for Contact, 720px for section padding, 640px for nav, 600px for About/Certifications row-to-stack). Card grids (Skills clusters, Projects) use `repeat(auto-fill, minmax(260–280px, 1fr))` so density adapts to viewport without a hard column count. Spacing rhythm runs 6–8px (icon-to-label gaps), 14–16px (grid gaps, card internal rhythm), 24–28px (card padding, block gaps), 40–56px (block separators), 96px (section padding) — no fractional or ad hoc values outside that ladder.

## Elevation & Depth

Flat by design: there is no shadow vocabulary anywhere in the system except a single soft glow (`box-shadow: 0 0 0 3px` in the accent's dim tint) used as a halo behind status dots, which is a status indicator, not a depth cue. Depth is conveyed entirely through tonal layering — Canvas Black → Elevated Panel → Elevated Panel 2 — and 1px hairline borders. Cards sit one tonal step above the canvas with a hairline border; nested surfaces (the contact terminal's title bar) sit one step further.

### Named Rules
**The No-Shadow Rule.** Nothing casts a drop shadow. Elevation is expressed only as a lighter background tone plus a 1px border; if a component needs to read as "above" something else, lighten it and border it — do not shadow it.

## Shapes

Two radius values cover the whole system: a tight **4px** for interactive controls (buttons, metric chips, the About badge) and a slightly softer **6px** for content containers (cards). Chips and the nav/status pills use a full **999px** pill. Everything else is square or hairline-bordered rectangles — there is no large-radius "friendly" rounding anywhere. Borders are always 1px (`--edge`), never thicker, and always one of the two hairline tokens.

The recurring geometric signature is the **node**: a small circle, either filled (hero root, mounted project dot) or hollow with a stroke (skill cluster marker, resolved timeline dot), sometimes wrapped in a second larger hollow "halo" ring at low opacity. Edges connecting nodes are thin (1–1.5px) lines, either animated dashed strokes (hero graph, drawn in on load) or solid hairline connectors (timeline spine, cluster item stems, project node-mount stems). This node-and-edge vocabulary is the one shape idea repeated everywhere; no other decorative motif is introduced.

## Components

### Buttons
- **Shape:** 4px radius, mono label, 12px/22px padding, always paired with a 1px border.
- **Primary:** mint-dim background (`rgba(94, 234, 212, 0.14)`), mint text and border — used for the hero's main CTA and any "go to the primary action" link.
- **Ghost:** transparent background, dim-text color, hairline-strong border — used for secondary CTAs and "view code" links.
- **Hover:** primary deepens its fill to `rgba(94, 234, 212, 0.22)` and lifts 1px (`translateY(-1px)`); ghost swaps to elevated-panel background and full-text color. Both transition border-color/background/transform over 0.2s ease.

### Chips
- **Style:** pill radius (999px), elevated-panel background, hairline-strong border, mono label, dim-text color by default.
- **State:** the enterprise/OSS project badges recolor text and border to amber or mint respectively (`badge-enterprise`, `badge-oss`) — the only chip variants in the system; there is no generic multi-color chip set.

### Cards / Containers
- **Corner Style:** 6px radius.
- **Background:** Elevated Panel (`#0f1418`), one tonal step above canvas.
- **Shadow Strategy:** none — see Elevation & Depth; separation comes from the tonal step plus a 1px hairline border.
- **Border:** 1px solid hairline (not hairline-strong).
- **Internal Padding:** 28px, uniform across skill clusters, project cards, education, and the contact terminal shell.

### Navigation
- Fixed top bar, 60px tall, canvas color at 72% opacity with a backdrop blur (the one intentional use of blur in the system, reserved for the sticky nav only), 1px hairline bottom border. Brand mark pairs a status dot with the mono handle. Links are mono, dim-text by default, transitioning to mint on hover (0.2s ease) — no underline, no background swap. Below 640px the middle nav link is dropped rather than the bar wrapping.

### Node & Status Dot (signature component)
The status dot (`--accent`-filled circle, 7px, with a 3px dim-accent glow ring) is the atomic unit of the whole visual language: it appears in the nav brand, hero meta line, About's regulated badge, and every certification row to mean "currently true / active." Its sibling states are load-bearing and limited to exactly two: `.warn` (amber fill + amber-tinted glow, meaning "restricted/enterprise," used only on the enterprise project block label) and `.resolved` (hollow — elevated-panel fill, hairline-strong border, no glow — meaning "past," used only on completed timeline entries). No other color or state variant of this dot exists; new sections should reuse one of these three, not invent a fourth.

## Do's and Don'ts

### Do:
- **Do** treat mint as the only "on/healthy/hover" signal in the system (The One Signal Rule) — new interactive elements hover into mint, not into a new color.
- **Do** build any new node-like marker (a status indicator, a timeline point, a graph vertex) from the existing hollow-circle-plus-optional-halo motif rather than introducing a new icon or glyph shape.
- **Do** keep monospace scoped to data/status/label text and Overpass to prose and headings (The Mono-Is-Data Rule).
- **Do** express new depth relationships with a tonal step (canvas → elevated → elevated-2) plus a 1px hairline border, never a shadow.
- **Do** stick to the two radii (4px controls, 6px containers, 999px pills) — don't introduce a third rounding value.

### Don't:
- **Don't** introduce a second accent color for "active/healthy" states — amber is reserved solely for the restricted/enterprise status and must never mean "past," "warning," or "error" (The Amber Exception Rule; an earlier build did use amber for past roles and that was a confirmed, fixed defect, not a pattern to repeat).
- **Don't** add drop shadows, glassmorphism panels, or gradient glows anywhere — the direction contract explicitly rejects the "neon-glassmorphism SRE-dashboard" default this system could easily slide into.
- **Don't** use backdrop blur outside the fixed nav bar; it is a one-off treatment for the sticky header, not a general surface treatment.
- **Don't** decorate edges/connectors with straight decorative gradients — edges are always thin, single-color hairline or dashed strokes, never a gradient stroke.
