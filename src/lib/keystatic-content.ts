import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';

// Content is authored via Keystatic Cloud (which commits straight to this repo's
// `content/` directory through its GitHub App), but at build time we just want the
// files that are already sitting in git — no network call to Keystatic's API, no
// auth. `storage.kind` only matters for the editing UI, so it's forced to `local`
// here regardless of what keystatic.config.ts declares for the admin.
const reader = createReader(process.cwd(), { ...config, storage: { kind: 'local' } });

/**
 * A single page render can call several `get*` functions that each read the
 * same singleton/collection off disk (e.g. `/` reads the `site` singleton via
 * Base, Nav, Hero, About, Education and Contact). Memoizing the read promise
 * collapses those into one actual read+parse per build/request.
 *
 * Gated to production: in `astro dev` the module stays warm across requests,
 * so caching here would mean editing `content/` wouldn't show up without a
 * restart.
 */
function memo<T>(fn: () => Promise<T>): () => Promise<T> {
  if (!import.meta.env.PROD) return fn;
  let cached: Promise<T> | null = null;
  return () => (cached ??= fn());
}

const readSite = memo(() => reader.singletons.site.read());
const readExperience = memo(() => reader.collections.experience.all());
const readSkillGroups = memo(() => reader.collections.skillGroups.all());
const readEnterpriseProjects = memo(() => reader.collections.enterpriseProjects.all());
const readOssProjects = memo(() => reader.collections.ossProjects.all());
const readCertifications = memo(() => reader.collections.certifications.all());

function bySlugOrder<T extends { entry: { order?: number | null } | null }>(entries: T[]) {
  return entries
    .filter((e): e is T & { entry: NonNullable<T['entry']> } => e.entry !== null)
    .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0));
}

/**
 * Keystatic tipa todo campo como potencialmente `null` (el contenido en disco
 * podría estar vacío o mal formado), pero estos son campos obligatorios del
 * CMS — nunca deberían estarlo en la práctica. Falla alto y claro si ocurre,
 * en vez de dejar pasar un `null` silencioso hasta el render.
 */
function required<T>(value: T | null, message: string): T {
  if (value === null) throw new Error(message);
  return value;
}

export async function getMeta() {
  const site = await readSite();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  const github = required(site.github, 'content/site.yaml: github is required');
  const handle = new URL(github).pathname.replace(/^\//, '');
  return {
    name: site.metaName,
    handle,
    role: site.metaRole,
    location: site.location,
    email: site.email,
    phone: site.phone || undefined,
    domain: site.domain,
    github,
    site,
  };
}

export async function getHero() {
  const site = await readSite();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  return {
    headline: site.heroHeadline,
    subheadline: site.heroSubheadline,
    ctaPrimary: { label: 'Ver proyectos', href: '#projects' },
    ctaSecondary: { label: 'Contacto', href: '#contact' },
  };
}

export async function getCapabilityNodes() {
  const site = await readSite();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  return site.capabilityNodes.map((n) => ({ ...n, status: 'healthy' as const }));
}

export async function getAbout() {
  const site = await readSite();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  return {
    paragraphs: [site.aboutIntro, site.aboutLeadIn],
    vertientes: site.vertientes,
    closing: site.aboutClosing,
    regulatedBadge: site.regulatedBadge,
  };
}

export async function getEducation() {
  const site = await readSite();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  return {
    degree: site.educationDegree,
    institution: site.educationInstitution,
    period: site.educationPeriod,
    talks: site.educationTalks,
    verificationUrl: site.educationVerificationUrl || undefined,
  };
}

export async function getCvProfile() {
  const site = await readSite();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  return {
    summary: site.cvSummary,
    updated: site.cvUpdated,
  };
}

export async function getContact() {
  const site = await readSite();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  const github = required(site.github, 'content/site.yaml: github is required');
  const handle = new URL(github).pathname.replace(/^\//, '');
  return {
    email: site.email,
    github,
    githubHandle: `@${handle}`,
    linkedin: site.linkedin || null,
    instagram: site.instagram || null,
    youtube: site.youtube || null,
  };
}

export async function getExperience() {
  const all = await readExperience();
  return bySlugOrder(all).map(({ entry }) => ({
    role: entry.role,
    company: entry.company,
    period: entry.period,
    location: entry.location,
    current: entry.current,
    bullets: entry.bullets,
    metrics: entry.metrics.length ? entry.metrics : undefined,
  }));
}

export async function getSkills() {
  const all = await readSkillGroups();
  return bySlugOrder(all).map(({ entry }) => ({ category: entry.category, items: entry.items }));
}

export async function getEnterpriseProjects() {
  const all = await readEnterpriseProjects();
  return bySlugOrder(all).map(({ entry }) => ({
    name: entry.name,
    category: entry.category,
    role: entry.role,
    stack: entry.stack,
    result: entry.result,
  }));
}

export async function getOssProjects() {
  const all = await readOssProjects();
  return bySlugOrder(all).map(({ entry }) => ({
    name: entry.name,
    category: entry.category,
    language: entry.language || undefined,
    description: entry.description,
    repo: entry.repo,
  }));
}

export async function getCertifications() {
  const all = await readCertifications();
  return bySlugOrder(all).map(({ entry }) => ({
    name: entry.name,
    validity: entry.validity,
    credentialUrl: entry.credentialUrl || undefined,
  }));
}

export async function getPosts() {
  const all = await reader.collections.posts.all();
  return all
    .filter((e): e is typeof e & { entry: NonNullable<(typeof e)['entry']> } => e.entry !== null)
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      date: required(entry.date, `content/posts/${slug}: date is required`),
      category: entry.category,
      excerpt: entry.excerpt,
      cover: entry.cover ? `/img/blog/${entry.cover}` : null,
      videoUrl: entry.videoUrl || null,
      body: entry.body,
    }))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string) {
  const entry = await reader.collections.posts.read(slug);
  if (!entry) return null;
  return {
    slug,
    title: entry.title,
    date: required(entry.date, `content/posts/${slug}: date is required`),
    category: entry.category,
    excerpt: entry.excerpt,
    cover: entry.cover ? `/img/blog/${entry.cover}` : null,
    videoUrl: entry.videoUrl || null,
    body: entry.body,
  };
}

export const postCategoryLabels: Record<string, string> = {
  'sre-devops': 'SRE / DevOps',
  personal: 'Personal',
};

/** Formats a `YYYY-MM-DD` post date as long-form Spanish (Honduras locale), UTC-anchored so it doesn't shift by the reader's timezone. */
export function formatPostDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(year, (month ?? 1) - 1, day ?? 1));
  return date.toLocaleDateString('es-HN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** Extracts an 11-char YouTube video ID from youtu.be, watch?v=, or /embed/ URLs. */
export function getYoutubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
    if (u.hostname.endsWith('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v');
      const embedMatch = u.pathname.match(/^\/embed\/([^/]+)/);
      if (embedMatch) return embedMatch[1];
    }
    return null;
  } catch {
    return null;
  }
}
