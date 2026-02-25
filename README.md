# Puruto Web

Web estática del framework Puruto — documentación, guías y showcase.

**Stack:** Astro + Starlight | **Idiomas:** ES (default), EN, JA | **Deploy:** puruto.com

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # previsualiza el build
```

## Estructura

```
src/content/docs/
├── (root)         ← español (idioma por defecto, URLs sin prefijo)
├── en/            ← inglés (/en/...)
└── ja/            ← japonés (/ja/..., parcial con fallback a ES)
```

## Añadir contenido

1. Crea el fichero `.md` o `.mdx` en la carpeta del idioma correspondiente
2. Añade frontmatter `title` y `description`
3. Para páginas nuevas, añade la entrada en el sidebar de `astro.config.mjs`

## I18n

- **ES** (root): contiene el 100% del contenido
- **EN**: contiene el 100% del contenido traducido
- **JA**: landing + guías 1-2 + FAQ (el resto usa fallback a ES)

## Deploy

Se despliega automáticamente a GitHub Pages cuando hay cambios en `web/**` en la rama `main`.

El workflow está en `.github/workflows/deploy-web.yml` (en el repo raíz de puruto).

Si mueves `web/` a un repo independiente, usa el workflow en `web/.github/workflows/deploy.yml`.

## Portabilidad

Esta carpeta `web/` está diseñada para moverse a un repo independiente en cualquier momento:

```bash
cp -r web/ /path/to/nuevo-repo/
cd /path/to/nuevo-repo
git init && git add . && git commit -m "init: web puruto"
```

El único ajuste necesario es mover `web/.github/workflows/deploy.yml` a `.github/workflows/deploy.yml` en el nuevo repo.
