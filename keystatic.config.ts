import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'cloud',
  },
  cloud: {
    project: 'portfolio-galex/portfolio',
  },

  singletons: {
    site: singleton({
      label: 'Sitio',
      path: 'content/site',
      schema: {
        metaName: fields.text({ label: 'Nombre' }),
        metaRole: fields.text({ label: 'Rol actual' }),
        location: fields.text({ label: 'Ubicación' }),
        email: fields.text({ label: 'Email de contacto' }),
        domain: fields.text({ label: 'Dominio' }),
        github: fields.url({ label: 'URL de GitHub' }),

        heroHeadline: fields.text({ label: 'Hero — headline' }),
        heroSubheadline: fields.text({ label: 'Hero — subheadline', multiline: true }),

        aboutIntro: fields.text({ label: 'Sobre mí — párrafo inicial', multiline: true }),
        aboutClosing: fields.text({ label: 'Sobre mí — párrafo de cierre', multiline: true }),
        regulatedBadge: fields.text({ label: 'Badge de entornos regulados' }),

        educationDegree: fields.text({ label: 'Educación — título' }),
        educationInstitution: fields.text({ label: 'Educación — institución' }),
        educationPeriod: fields.text({ label: 'Educación — período' }),
        educationTalks: fields.array(fields.text({ label: 'Ponencia' }), {
          label: 'Educación — ponencias',
          itemLabel: (props) => props.value || 'Ponencia',
        }),
      },
    }),
  },

  collections: {
    experience: collection({
      label: 'Experiencia',
      path: 'content/experience/*',
      slugField: 'role',
      schema: {
        role: fields.slug({ name: { label: 'Puesto' } }),
        company: fields.text({ label: 'Empresa' }),
        period: fields.text({ label: 'Período' }),
        location: fields.text({ label: 'Ubicación' }),
        current: fields.checkbox({ label: '¿Rol actual?', defaultValue: false }),
        bullets: fields.array(fields.text({ label: 'Punto' }), {
          label: 'Responsabilidades',
          itemLabel: (props) => props.value || 'Punto',
        }),
        metrics: fields.array(fields.text({ label: 'Métrica' }), {
          label: 'Métricas destacadas',
          itemLabel: (props) => props.value || 'Métrica',
        }),
      },
    }),

    skillGroups: collection({
      label: 'Skills (categorías)',
      path: 'content/skills/*',
      slugField: 'category',
      schema: {
        category: fields.slug({ name: { label: 'Categoría' } }),
        items: fields.array(fields.text({ label: 'Tecnología' }), {
          label: 'Tecnologías',
          itemLabel: (props) => props.value || 'Tecnología',
        }),
      },
    }),

    enterpriseProjects: collection({
      label: 'Proyectos — Empresariales',
      path: 'content/projects/enterprise/*',
      slugField: 'name',
      schema: {
        name: fields.slug({ name: { label: 'Nombre del proyecto' } }),
        category: fields.text({ label: 'Categoría' }),
        role: fields.text({ label: 'Rol' }),
        stack: fields.text({ label: 'Stack' }),
        result: fields.text({ label: 'Resultado', multiline: true }),
      },
    }),

    ossProjects: collection({
      label: 'Proyectos — Personales / OSS',
      path: 'content/projects/oss/*',
      slugField: 'name',
      schema: {
        name: fields.slug({ name: { label: 'Nombre del proyecto' } }),
        category: fields.text({ label: 'Categoría' }),
        language: fields.text({ label: 'Lenguaje', validation: { isRequired: false } }),
        description: fields.text({ label: 'Descripción', multiline: true }),
        repo: fields.url({ label: 'URL del repositorio' }),
      },
    }),

    certifications: collection({
      label: 'Certificaciones',
      path: 'content/certifications/*',
      slugField: 'name',
      schema: {
        name: fields.slug({ name: { label: 'Certificación' } }),
        validity: fields.text({ label: 'Vigencia' }),
      },
    }),
  },
});
