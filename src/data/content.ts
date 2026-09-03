// Fuente única de verdad: portfolio-spec.md (raíz del repo).
// No agregar textos, fechas, métricas ni tecnologías que no estén en ese archivo.

export const meta = {
  name: 'Gabriel Barrientos',
  handle: 'galexbh',
  role: 'Site Reliability Engineer',
  location: 'Tegucigalpa, Honduras',
  email: 'info@galexbh.dev',
  domain: 'galexbh.dev',
  github: 'https://github.com/galexbh',
};

export const hero = {
  headline: 'Site Reliability Engineer',
  subheadline:
    'Construyo infraestructura confiable, automatizada y observable en entornos regulados y multi-nube.',
  ctaPrimary: { label: 'Ver proyectos', href: '#projects' },
  ctaSecondary: { label: 'Contacto', href: '#contact' },
};

export const capabilityNodes = [
  { id: 'cloud', label: 'Cloud', detail: 'AWS · Azure', status: 'healthy' as const },
  { id: 'cicd', label: 'CI/CD', detail: 'Azure DevOps · Argo CD', status: 'healthy' as const },
  { id: 'observability', label: 'Observabilidad', detail: 'Dynatrace', status: 'healthy' as const },
  { id: 'containers', label: 'Contenedores', detail: 'OpenShift', status: 'healthy' as const },
  { id: 'automation', label: 'Automatización', detail: 'Ansible', status: 'healthy' as const },
];

export const about = {
  paragraphs: [
    'Ingeniero en Sistemas con más de 3 años de experiencia en infraestructura, automatización y gestión de incidentes bajo ITIL, en entornos bancarios regulados. Actualmente trabajo como Site Reliability Engineer, dentro del equipo de plataformas.',
    'En el rol de SRE cubro cinco vertientes principales:',
  ],
  vertientes: [
    { label: 'Cloud', detail: 'operación y soporte de cargas de trabajo en AWS y Azure.' },
    { label: 'CI/CD', detail: 'diseño y mantenimiento de pipelines en Azure DevOps, y despliegues continuos con Argo CD.' },
    { label: 'Observabilidad', detail: 'monitoreo, dashboards y alertas con Dynatrace.' },
    { label: 'Contenedores', detail: 'administración de clústeres OpenShift.' },
    { label: 'Automatización', detail: 'playbooks de Ansible para configuración e infraestructura.' },
  ],
  closing:
    'Esta base se apoya en experiencia previa en gestión de incidentes (RCA, ITIL) y administración de aplicaciones bancarias, sistemas Linux/Windows, y seguridad perimetral — combinando confiabilidad medible, observabilidad end-to-end y automatización as-code.',
  regulatedBadge: 'Experiencia en entornos regulados',
};

export interface ExperienceEntry {
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
  metrics?: string[];
  current?: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    role: 'Site Reliability Engineer',
    company: 'INFATLAN',
    period: 'Sept 2026 – Actualidad',
    location: 'Tegucigalpa, HN',
    current: true,
    bullets: [
      'Cloud: soporte y operación de infraestructura en AWS y Azure.',
      'CI/CD: pipelines en Azure DevOps y despliegues continuos con Argo CD.',
      'Observabilidad: monitoreo y alertas con Dynatrace.',
      'Contenedores: administración de clústeres OpenShift.',
      'Automatización: playbooks de Ansible para configuración e infraestructura.',
    ],
  },
  {
    role: 'Administrador de Aplicaciones',
    company: 'INFATLAN',
    period: 'Nov 2025 – Sept 2026',
    location: 'Tegucigalpa, HN',
    bullets: [
      'Administración de plataformas en contenedores: OpenShift, Kubernetes, Minikube.',
      'Administración de sistemas Linux y Windows.',
      'Coordinación de incidentes críticos con Arquitectura, Cumplimiento y Gerencia de TI.',
      'Documentación de RCA formales bajo gobierno ITIL/SRE.',
      'Monitoreo y gestión del rendimiento de aplicaciones e infraestructura.',
      'Gestión de incidencias y controles de cambio en Jira.',
    ],
  },
  {
    role: 'Ingeniero DevOps',
    company: 'Punto HN',
    period: 'Ene 2024 – Nov 2025',
    location: 'Tegucigalpa, HN',
    bullets: [
      'Administración de entornos híbridos multi-nube: Contabo, AWS, Azure.',
      'Acceso remoto Zero Trust con Cloudflare Tunnels, sin VPN tradicional.',
      'Monitoreo automatizado con alertas en tiempo real vía Telegram.',
      'Liderazgo de un equipo de 3 practicantes universitarios.',
    ],
    metrics: ['-35% en tiempo de respuesta a incidentes'],
  },
  {
    role: 'Técnico Jr',
    company: 'Punto HN',
    period: 'Feb 2023 – Dic 2023',
    location: 'Tegucigalpa, HN',
    bullets: [
      'Configuración de firewalls perimetrales Sophos y Fortinet.',
      'Soporte de ciberseguridad para entornos Microsoft 365.',
      'Desarrollo de sitios web institucionales con pasarela de pagos.',
    ],
    metrics: ['-20% en incidentes de seguridad reportados'],
  },
];

export interface SkillGroup {
  category: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  { category: 'Cloud', items: ['AWS', 'Azure', 'Contabo'] },
  { category: 'CI/CD & Automatización', items: ['Azure DevOps', 'Argo CD', 'Ansible', 'Docker'] },
  { category: 'Observabilidad', items: ['Dynatrace', 'Monitoreo y gestión de rendimiento'] },
  { category: 'Contenedores', items: ['OpenShift', 'Kubernetes', 'Minikube'] },
  { category: 'Sistemas Operativos', items: ['Linux', 'Windows'] },
  { category: 'Seguridad y Redes', items: ['Sophos Firewall', 'Fortinet', 'Cloudflare (Zero Trust)', 'Microsoft 365 Security'] },
  { category: 'Backend', items: ['Node.js', 'Express', 'NestJS'] },
  { category: 'Gestión / Gobierno', items: ['ITIL', 'Jira', 'Gestión de incidentes y RCA'] },
];

export interface EnterpriseProject {
  name: string;
  category: string;
  role: string;
  stack: string;
  result: string;
}

export const enterpriseProjects: EnterpriseProject[] = [
  {
    name: 'Automatización de infraestructura con Ansible',
    category: 'Automatización',
    role: 'SRE actual',
    stack: 'Ansible',
    result: 'pendiente de documentar (playbooks creados, tareas automatizadas, tiempo ahorrado).',
  },
  {
    name: 'Pipelines de CI/CD con Azure DevOps y Argo CD',
    category: 'CI/CD',
    role: 'SRE actual',
    stack: 'Azure DevOps, Argo CD, OpenShift',
    result: 'pendiente de documentar (frecuencia de releases, tasa de fallos).',
  },
  {
    name: 'Observabilidad end-to-end con Dynatrace',
    category: 'Observabilidad',
    role: 'SRE actual',
    stack: 'Dynatrace',
    result: 'pendiente de documentar (MTTD/MTTR, incidentes detectados proactivamente).',
  },
  {
    name: 'Operación multi-cloud AWS/Azure',
    category: 'Cloud',
    role: 'SRE actual',
    stack: 'AWS, Azure, OpenShift',
    result: 'pendiente de documentar (disponibilidad, incidentes resueltos).',
  },
  {
    name: 'Administración de aplicaciones bancarias críticas',
    category: 'Plataformas',
    role: 'Administrador de Aplicaciones',
    stack: 'OpenShift, Kubernetes, Minikube, Linux, Windows',
    result: 'continuidad operativa y cumplimiento de políticas de TI en entorno bancario regulado.',
  },
  {
    name: 'Migración a acceso remoto Zero Trust',
    category: 'Seguridad',
    role: 'DevOps (Punto HN)',
    stack: 'Cloudflare Tunnels',
    result: 'eliminación de VPN tradicional para el equipo.',
  },
  {
    name: 'Automatización de monitoreo y alerting',
    category: 'Observabilidad',
    role: 'DevOps (Punto HN)',
    stack: 'Telegram API, monitoreo de infraestructura',
    result: '-35% en tiempo de respuesta a incidentes.',
  },
  {
    name: 'Gobierno de incidentes en entorno bancario regulado',
    category: 'Gestión de incidentes',
    role: 'Administrador de Aplicaciones',
    stack: 'ITIL, RCA, Jira',
    result: 'mejora en trazabilidad y evidencia para auditoría.',
  },
  {
    name: 'Hardening de seguridad perimetral',
    category: 'Seguridad',
    role: 'Técnico Jr (Punto HN)',
    stack: 'Sophos, Fortinet',
    result: '-20% en incidentes de seguridad reportados.',
  },
];

export interface OSSProject {
  name: string;
  category: string;
  language?: string;
  description: string;
  repo: string;
}

export const ossProjects: OSSProject[] = [
  {
    name: 'OpenSight',
    category: 'Plataformas / OpenShift',
    language: 'Python',
    description:
      'Herramienta de línea de comandos que inventaría automáticamente los recursos clave de proyectos en un clúster de OpenShift.',
    repo: 'https://github.com/galexbh/OpenSight',
  },
  {
    name: 'zabbix-installation',
    category: 'Observabilidad / Monitoreo',
    description: 'Scripts de instalación y configuración de Zabbix para monitoreo de infraestructura.',
    repo: 'https://github.com/galexbh/zabbix-installation',
  },
  {
    name: 'ocr-plugin-flameshot',
    category: 'Herramientas / Productividad',
    language: 'Shell',
    description: 'Plugin que añade extracción de texto (OCR) a Flameshot.',
    repo: 'https://github.com/galexbh/ocr-plugin-flameshot',
  },
  {
    name: 'my-dotfiles',
    category: 'Herramientas / Configuración',
    language: 'Shell',
    description: 'Configuración personal de entorno de desarrollo (dotfiles).',
    repo: 'https://github.com/galexbh/my-dotfiles',
  },
  {
    name: 'ymd',
    category: 'Herramientas',
    language: 'TypeScript',
    description: 'Interfaz de interacción con yt-dlp.',
    repo: 'https://github.com/galexbh/ymd',
  },
];

export interface Certification {
  name: string;
  validity: string;
}

export const certifications: Certification[] = [
  { name: 'Introduction to Kubernetes (LFS158) — Linux Foundation', validity: 'May 2025 – May 2027' },
  { name: 'Sophos Firewall Certified Engineer v21.0 (ET80)', validity: 'Jul 2025 – Jul 2027' },
  { name: 'Sophos Firewall Certified Technician v21.0 (S80)', validity: 'Jul 2025 – Jul 2027' },
  { name: 'NestJS: Desarrollo backend escalable', validity: 'Jul 2026 – Jul 2028' },
  { name: 'Ingeniería de Prompts', validity: 'Jul 2026 – Jul 2028' },
];

export const education = {
  degree: 'Ingeniero en Sistemas',
  institution: 'Universidad Nacional Autónoma de Honduras (UNAH)',
  period: 'Feb 2018 – Sept 2024',
  talks: [
    'Domain-Driven Design con Node.js y Express',
    'Entornos de Desarrollo con Docker',
  ],
};

export const contact = {
  email: 'info@galexbh.dev',
  github: 'https://github.com/galexbh',
  githubHandle: '@galexbh',
};
