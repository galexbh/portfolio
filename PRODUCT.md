# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (static site, no server runtime). Deploy target: Cloudflare Pages, custom domain galexbh.dev.

## Users

Recruiters, hiring managers, and technical leads (primarily at banks, fintechs, and regulated-industry companies in Centroamérica and remote/LatAm markets) evaluating Gabriel Barrientos (galexbh) for SRE/DevOps/infrastructure roles. Secondary audience: peers/engineers who land on the site via GitHub or LinkedIn and want to see real project depth.

## Product Purpose

A single-page portfolio that proves Gabriel is a credible, currently-practicing SRE with real regulated-banking infrastructure experience (cloud, CI/CD, observability, containers, automation), makes him easy to contact, and gives visitors a fast path to his real code (GitHub) and CV.

## Positioning

Not a generic "full-stack developer" portfolio template. The differentiator is regulated-banking SRE experience (ITIL incident governance, RCA, audits, critical banking application uptime) combined with a concrete current stack (AWS/Azure, Azure DevOps + ArgoCD, Dynatrace, OpenShift, Ansible) — a profile most junior/mid SRE portfolios cannot credibly claim.

## Operating Context

- All content (identity, hero copy, about, experience timeline, skills, projects, certifications, education, contact) is sourced from `portfolio-spec.md` in this repo — the single source of truth for text, dates, stack, and project claims. Nothing outside that file is invented.
- Enterprise/work projects have no public repo (banking confidentiality) and are shown as reference case studies without a "view code" action. Personal/OSS projects link to real GitHub repos under @galexbh.
- Real photos of Gabriel exist in `assets/` (raw selfies). One is selected and visually treated for the hero; no synthetic/generated face is used.
- Additional illustrative/technical imagery (backgrounds, dividers, icons) is out of scope for in-session generation; prompts for that imagery are handed off to Codex and tracked in `image-prompts.md`, generated externally, then dropped into the project before final asset wiring.

## Capabilities and Constraints

- Single scroll page, vertical sections in the order: Hero, About, Experience, Skills, Projects (Empresarial + Personal/OSS), Certifications, Education, Contact.
- Bilingual is optional/future (spec allows Spanish primary + optional English); this build ships Spanish-only content per the spec's primary content.
- Animations must be subtle and performance-conscious, not heavy/showy.
- AWS is explicitly NOT part of the "Administrador de Aplicaciones" role stack — must not be mixed into that timeline entry (per spec note in section 11).
- No image-generation tool is available in this session; any new visual asset beyond the treated real photo is defined as a prompt for external (Codex) generation, not fabricated inline.

## Evidence on Hand

- `portfolio-spec.md` — full content spec (identity, hero, about, experience, skills, projects, certifications, education, contact, exclusions, design notes).
- `assets/photo_2026-09-03_01-04-15.jpg` through `-18.jpg` — four real candid photos of Gabriel. `-17` is the one selected for the hero (Gabriel's own choice): a confident half-smile with a heart-hand gesture, moodier/dim lighting that actually reads well once cropped and vignetted for the site's dark palette. The others are unused: `-15` is a plainer, neutral-lit alternative; `-16` and `-18` are more casual/informal (tongue out, peace-sign) and weren't used as-is.
- No CV PDF, no logo, no existing brand assets currently in the repo — CV link and any logo are placeholders/TBD until provided.

## Product Principles

1. Content authority is `portfolio-spec.md` — never invent dates, metrics, or stack claims not present there.
2. Prove regulated-banking SRE credibility concretely (real stack names, real metrics like -35% MTTR, -20% incidents) rather than generic buzzwords.
3. Keep enterprise vs. personal/OSS projects visually distinct so confidentiality is honest, not evasive.
4. Motion and visual richness serve scanability and credibility; they never bury the CTA (contact / view projects) or slow the page down.
5. Real photography of Gabriel only for identity — no AI-generated likeness.

## Accessibility & Inclusion

No product-specific accessibility requirement was stated; build to standard WCAG AA practice (contrast, focus states, reduced-motion support) as baseline craft, not a documented mandate.
