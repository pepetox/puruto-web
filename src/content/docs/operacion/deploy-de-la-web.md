---
title: Deploy de la web
description: Runbook operativo para desplegar puruto-web en GitHub Pages con dominio personalizado y troubleshooting real.
---

## Alcance

Esta página documenta el deploy de **esta documentación** (`puruto-web`) usando:

- GitHub Actions
- GitHub Pages
- dominio personalizado `puruto.com`

No cubre la CI del framework `puruto` (ver [CI/CD](/operacion/ci-cd/)).

## Arquitectura de deploy (actual)

Repositorio:

- `pepetox/puruto-web` (público)

Workflow:

- `/Users/pepetox/Documents/01-code/puruto-web/.github/workflows/deploy.yml`

Estrategia:

1. `npm ci`
2. `npm run build`
3. `upload-pages-artifact`
4. `actions/deploy-pages@v4`

## Requisitos previos (GitHub)

En `Settings > Pages` del repo `puruto-web`:

1. `Source` = `GitHub Actions`
2. (Si aplica) `Custom domain` = `puruto.com`

Si esto no está activado, el step `Deploy to GitHub Pages` falla con:

- `Failed to create deployment (status: 404)`
- `Ensure GitHub Pages has been enabled`

## Requisitos previos (DNS)

Para `puruto.com` en GoDaddy (o equivalente):

- A records de GitHub Pages para `@`
- CNAME `www -> pepetox.github.io`

Comprobación rápida:

```bash
dig puruto.com +short
dig www.puruto.com +short
```

## Flujo operativo recomendado

### 1. Validar build local antes de push

```bash
cd /Users/pepetox/Documents/01-code/puruto-web
npm run build
```

### 2. Commit y push

```bash
git add .
git commit -m "Describe el cambio"
git push origin main
```

### 3. Verificar run en GitHub Actions

Workflow esperado:

- `Build` ✅
- `Deploy` ✅

### 4. Verificar publicación

- abre `https://puruto.com`
- hard refresh (`Cmd+Shift+R`) si ves contenido viejo

## Problemas frecuentes y diagnóstico

### 1. Deploy falla con `404` en `actions/deploy-pages@v4`

Síntoma:

- `HttpError: Not Found`
- `Ensure GitHub Pages has been enabled`

Causa:

- Pages no habilitado en el repo
- o `Source` no está en `GitHub Actions`

Solución:

1. Configura `Settings > Pages`
2. Reejecuta el workflow

### 2. Deploy sale bien pero el contenido no cambia

Causa más común:

- cambios locales no commiteados/pusheados

Diagnóstico:

```bash
git status --short
git log --oneline -n 5
```

Compara el commit local con el commit del run en GitHub Actions.

### 3. Build local OK, web pública sigue antigua

Posibles causas:

- CDN/cache del navegador
- run de Actions anterior aún mostrando un commit viejo
- estás mirando el dominio correcto pero sin hard refresh

Qué hacer:

1. hard refresh
2. incógnito
3. verificar el commit del último run

### 4. Build falla por Astro/Starlight config

Ejemplo real que ya ocurrió:

- formato `social` incompatible con versión actual de Starlight

Qué hacer:

1. reproducir `npm run build` local
2. corregir config en `astro.config.mjs`
3. volver a push

### 5. Build falla en CI por `npm ci`

Causa típica:

- falta `package-lock.json`

Solución:

```bash
npm install
git add package-lock.json
git commit -m "Add lockfile"
git push
```

## Checklist de deploy (rápido)

1. `npm run build` local ✅
2. cambios commiteados ✅
3. `git push origin main` ✅
4. `Build` y `Deploy` verdes en GitHub ✅
5. hard refresh en `puruto.com` ✅

## Siguientes pasos

- → [CI/CD](/operacion/ci-cd/)
- → [Observabilidad](/operacion/observabilidad/)
- → [FAQ técnica](/faq-tecnica/)

## Última verificación

Runbook contrastado con el workflow `/Users/pepetox/Documents/01-code/puruto-web/.github/workflows/deploy.yml` y errores reales observados en deploys de `puruto-web` el **25 de febrero de 2026**.
