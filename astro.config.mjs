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
        baseUrl: 'https://github.com/pepetox/puruto/edit/main/web/',
      },
      sidebar: [
        {
          label: 'Guías',
          translations: { en: 'Guides', ja: 'ガイド' },
          items: [
            { slug: 'guia/instalacion' },
            { slug: 'guia/primer-puruto' },
            { slug: 'guia/skills' },
            { slug: 'guia/ecosistema' },
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
      ],
    }),
  ],
});
