import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://puruto.com',
  integrations: [
    starlight({
      title: 'Puruto',
      description: 'Framework para crear aplicaciones agénticas. El repositorio ES la aplicación.',
      defaultLocale: 'root',
      locales: {
        // Root locale = español (sin prefijo /es/ en la URL)
        root: { label: 'Español', lang: 'es' },
        en: { label: 'English', lang: 'en' },
        ja: { label: '日本語', lang: 'ja' },
      },
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/pepetox/puruto',
      },
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/pepetox/puruto-web/edit/main/',
      },
      sidebar: [
        {
          label: 'Guías',
          translations: { en: 'Guides', ja: 'ガイド' },
          items: [
            { slug: 'guia/requisitos' },
            { slug: 'guia/instalacion' },
            { slug: 'guia/configuracion-minima' },
            { slug: 'guia/verificar-instalacion' },
            { slug: 'guia/primer-ejemplo-funcional' },
            { slug: 'guia/primer-puruto' },
            { slug: 'guia/skills' },
            { slug: 'guia/ecosistema' },
          ],
        },
        {
          label: 'Conceptos',
          translations: { en: 'Concepts', ja: 'コンセプト' },
          items: [
            { slug: 'conceptos/que-es-puruto' },
            { slug: 'conceptos/agentes-y-modelos' },
            { slug: 'conceptos/modelo-de-ejecucion' },
            { slug: 'conceptos/ciclo-de-vida-de-una-tarea' },
          ],
        },
        {
          label: 'Operación',
          translations: { en: 'Operations', ja: '運用' },
          collapsed: true,
          items: [
            { slug: 'operacion/errores-frecuentes' },
            { slug: 'operacion/debug-y-logs' },
            { slug: 'operacion/actualizacion-y-migraciones' },
            { slug: 'operacion/seguridad-y-secretos' },
            { slug: 'operacion/ci-cd' },
            { slug: 'operacion/observabilidad' },
            { slug: 'operacion/deploy-de-la-web' },
            { slug: 'operacion/diagnostico-puruto-gateway' },
            { slug: 'operacion/diagnostico-puruto-data' },
            { slug: 'operacion/diagnostico-puruto-cron' },
            { slug: 'operacion/diagnostico-puruto-telegram' },
          ],
        },
        {
          label: 'Recetas',
          translations: { en: 'Recipes', ja: 'レシピ' },
          collapsed: true,
          items: [
            { slug: 'recetas/crear-una-skill' },
            { slug: 'recetas/ipc-entre-purutos' },
            { slug: 'recetas/ejecutar-con-cron' },
            { slug: 'recetas/integrar-telegram' },
            { slug: 'recetas/gate-ci-con-validate-json' },
          ],
        },
        {
          label: 'Adopción',
          translations: { en: 'Adoption', ja: '導入' },
          collapsed: true,
          items: [
            { slug: 'adopcion/buenas-practicas' },
            { slug: 'adopcion/anti-patrones' },
          ],
        },
        {
          label: 'Referencia',
          translations: { en: 'Reference', ja: 'リファレンス' },
          collapsed: true,
          items: [
            { slug: 'referencia/estandar' },
            { slug: 'referencia/formato-skill' },
            { slug: 'referencia/ipc' },
            { slug: 'referencia/contratos-runtime' },
            { slug: 'referencia/gateway-api-mvp' },
            { slug: 'referencia/registry-json-puruto-data' },
            { slug: 'referencia/artefactos-runtime-locales' },
            { slug: 'referencia/config-jobs-json' },
            { slug: 'referencia/config-channels-json' },
            { slug: 'referencia/config-completa' },
            { slug: 'referencia/variables-de-entorno' },
            { slug: 'referencia/errores-y-codigos' },
            { slug: 'referencia/salidas-json-cli' },
            { slug: 'referencia/glosario' },
            { slug: 'referencia/cli' },
          ],
        },
        {
          label: 'Ecosistema',
          translations: { en: 'Ecosystem', ja: 'エコシステム' },
          collapsed: true,
          items: [
            { slug: 'ecosistema/puruto-data' },
            { slug: 'ecosistema/puruto-telegram' },
            { slug: 'ecosistema/puruto-cron' },
            { slug: 'ecosistema/puruto-gateway' },
          ],
        },
        {
          label: 'Showcase',
          translations: { en: 'Showcase', ja: 'ショーケース' },
          items: [
            { slug: 'showcase' },
            { slug: 'showcase/contribuir' },
          ],
        },
        { slug: 'faq', label: 'FAQ' },
        { slug: 'faq-tecnica', label: 'FAQ técnica' },
      ],
    }),
  ],
});
