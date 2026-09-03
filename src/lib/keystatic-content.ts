import { createReader } from '@keystatic/core/reader';
import config from '../../keystatic.config';

// Content is authored via Keystatic Cloud (which commits straight to this repo's
// `content/` directory through its GitHub App), but at build time we just want the
// files that are already sitting in git — no network call to Keystatic's API, no
// auth. `storage.kind` only matters for the editing UI, so it's forced to `local`
// here regardless of what keystatic.config.ts declares for the admin.
const reader = createReader(process.cwd(), { ...config, storage: { kind: 'local' } });

function bySlugOrder<T extends { entry: { order?: number | null } | null }>(entries: T[]) {
  return entries
    .filter((e): e is T & { entry: NonNullable<T['entry']> } => e.entry !== null)
    .sort((a, b) => (a.entry.order ?? 0) - (b.entry.order ?? 0));
}

export async function getMeta() {
  const site = await reader.singletons.site.read();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  const handle = new URL(site.github).pathname.replace(/^\//, '');
  return {
    name: site.metaName,
    handle,
    role: site.metaRole,
    location: site.location,
    email: site.email,
    domain: site.domain,
    github: site.github,
    site,
  };
}

export async function getHero() {
  const site = await reader.singletons.site.read();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  return {
    headline: site.heroHeadline,
    subheadline: site.heroSubheadline,
    ctaPrimary: { label: 'Ver proyectos', href: '#projects' },
    ctaSecondary: { label: 'Contacto', href: '#contact' },
  };
}

export async function getCapabilityNodes() {
  const site = await reader.singletons.site.read();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  return site.capabilityNodes.map((n) => ({ ...n, status: 'healthy' as const }));
}

export async function getAbout() {
  const site = await reader.singletons.site.read();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  return {
    paragraphs: [site.aboutIntro, site.aboutLeadIn],
    vertientes: site.vertientes,
    closing: site.aboutClosing,
    regulatedBadge: site.regulatedBadge,
  };
}

export async function getEducation() {
  const site = await reader.singletons.site.read();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  return {
    degree: site.educationDegree,
    institution: site.educationInstitution,
    period: site.educationPeriod,
    talks: site.educationTalks,
  };
}

export async function getContact() {
  const site = await reader.singletons.site.read();
  if (!site) throw new Error('content/site.yaml is missing or failed to parse');
  const handle = new URL(site.github).pathname.replace(/^\//, '');
  return {
    email: site.email,
    github: site.github,
    githubHandle: `@${handle}`,
    linkedin: site.linkedin || null,
    instagram: site.instagram || null,
    youtube: site.youtube || null,
  };
}

export async function getExperience() {
  const all = await reader.collections.experience.all();
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
  const all = await reader.collections.skillGroups.all();
  return bySlugOrder(all).map(({ entry }) => ({ category: entry.category, items: entry.items }));
}

export async function getEnterpriseProjects() {
  const all = await reader.collections.enterpriseProjects.all();
  return bySlugOrder(all).map(({ entry }) => ({
    name: entry.name,
    category: entry.category,
    role: entry.role,
    stack: entry.stack,
    result: entry.result,
  }));
}

export async function getOssProjects() {
  const all = await reader.collections.ossProjects.all();
  return bySlugOrder(all).map(({ entry }) => ({
    name: entry.name,
    category: entry.category,
    language: entry.language || undefined,
    description: entry.description,
    repo: entry.repo,
  }));
}

export async function getCertifications() {
  const all = await reader.collections.certifications.all();
  return bySlugOrder(all).map(({ entry }) => ({ name: entry.name, validity: entry.validity }));
}

export async function getPosts() {
  const all = await reader.collections.posts.all();
  return all
    .filter((e): e is typeof e & { entry: NonNullable<(typeof e)['entry']> } => e.entry !== null)
    .map(({ slug, entry }) => ({
      slug,
      title: entry.title,
      date: entry.date,
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
    date: entry.date,
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
