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
        aboutLeadIn: fields.text({ label: 'Sobre mí — frase antes de vertientes' }),
        vertientes: fields.array(
          fields.object({
            label: fields.text({ label: 'Nombre' }),
            detail: fields.text({ label: 'Detalle' }),
          }),
          { label: 'Vertientes', itemLabel: (p) => p.fields.label.value || 'Vertiente' }
        ),
        aboutClosing: fields.text({ label: 'Sobre mí — párrafo de cierre', multiline: true }),
        regulatedBadge: fields.text({ label: 'Badge de entornos regulados' }),

        capabilityNodes: fields.array(
          fields.object({
            id: fields.text({ label: 'ID' }),
            label: fields.text({ label: 'Nombre' }),
            detail: fields.text({ label: 'Detalle' }),
          }),
          { label: 'Hero — nodos de capacidad', itemLabel: (p) => p.fields.label.value || 'Nodo' }
        ),

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
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
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
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
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
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
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
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
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
        order: fields.integer({ label: 'Orden', defaultValue: 0 }),
        name: fields.slug({ name: { label: 'Certificación' } }),
        validity: fields.text({ label: 'Vigencia' }),
      },
    }),

    posts: collection({
      label: 'Blog',
      path: 'content/posts/*',
      slugField: 'title',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        date: fields.date({ label: 'Fecha' }),
        category: fields.select({
          label: 'Categoría',
          options: [
            { label: 'SRE / DevOps', value: 'sre-devops' },
            { label: 'Personal', value: 'personal' },
          ],
          defaultValue: 'sre-devops',
        }),
        excerpt: fields.text({ label: 'Resumen', multiline: true }),
        cover: fields.image({
          label: 'Portada',
          directory: 'public/img/blog',
          publicPath: '/img/blog/',
          validation: { isRequired: false },
        }),
        body: fields.document({
          label: 'Contenido',
          formatting: true,
          links: true,
          dividers: true,
        }),
      },
    }),
  },
});
