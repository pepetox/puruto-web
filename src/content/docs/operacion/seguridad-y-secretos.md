---
title: Seguridad y secretos
description: Buenas prácticas de secretos, .env, allowlists IPC y límites operativos en repos Puruto.
---

## Qué cubre esta página

- Cómo manejar secretos en el framework y en Purutos generados
- Qué riesgos cubren `.env`, `.gitignore` y `.env.example`
- Qué límites aplicar en IPC para reducir superficie de riesgo
- Qué revisar antes de publicar un repo Puruto

## Principio base

Puruto asume una regla simple:

> **Los secretos viven en `.env`, no en Git.**

Esta regla aparece en las plantillas generadas, en los comentarios de `.env.example` y en reglas del framework (`CLAUDE.md`).

## Patrón recomendado (framework y Purutos)

### 1. Versiona `.env.example`

Debe contener:

- nombres de variables
- comentarios
- valores de ejemplo/no sensibles

### 2. Mantén `.env` local

Debe contener:

- tokens reales
- rutas locales
- configuraciones específicas de tu máquina

### 3. Asegura `.gitignore`

El generador incluye `.gitignore` con `.env` y patrones comunes (Python, `node_modules`, etc.).

El validador además emite warning `missing-gitignore` si detecta `.env` sin `.gitignore`.

## Secretos comunes por tipo de Puruto

### `puruto-telegram`

Variables sensibles típicas:

- `PURUTO_TELEGRAM_BOT_TOKEN`
- `PURUTO_TELEGRAM_DEFAULT_CHAT_ID` (dato sensible, aunque no siempre secreto estricto)

Riesgo principal:

- publicar token del bot por error en commits, logs o capturas

### `puruto-gateway`

Variable sensible:

- `PURUTO_GATEWAY_API_KEY`

Riesgo principal:

- dejar el placeholder `changeme` en producción
- exponer el servicio sin rotar credenciales

### `puruto-cron`

Suele manejar más rutas que secretos, pero puede tocar:

- rutas a `puruto-telegram`
- outboxes/notifications

Riesgo principal:

- registrar datos sensibles en `notifications/*.jsonl` o artefactos de runs

## Reglas operativas recomendadas

1. Nunca pegues valores reales de `.env` en issues o documentación.
2. Si compartes logs, redáctalos antes (tokens, chat IDs, API keys).
3. Mantén `.env.example` sincronizado con el runtime real.
4. Revalida con `validate.py` después de cambios estructurales.
5. Si cambias templates del framework, actualiza docs/tests del repo `puruto`.

## Seguridad en IPC (delegación)

Puruto no resuelve toda la seguridad del runtime, pero el scaffold IPC reduce riesgo con:

- `allowed_targets`
- `allowed_actions`
- `max_hops`
- `default_timeout_sec`

### Recomendaciones prácticas

1. Empieza con `allowed_targets: []` y abre solo lo necesario.
2. Restringe `allowed_actions` por target.
3. Mantén `max_hops` bajo para evitar cadenas difíciles de auditar.
4. No metas secretos en `InvocationRequest`.
5. Usa `puruto-data` para compartir datos, no prompts con credenciales.

## Antes de publicar un repo Puruto (checklist)

1. Revisa `.gitignore` y confirma que `.env` está ignorado.
2. Verifica que `.env.example` no contiene tokens reales.
3. Busca cadenas sospechosas:

```bash
rg -n "TOKEN=|API_KEY=|SECRET=|password" . --glob '!*.md'
```

4. Ejecuta `validate.py --json`
5. Si el repo usa IPC, revisa `.puruto-ipc.json` (allowlists y límites)

## Qué hacer si ya subiste un secreto por error

1. Rótalo inmediatamente (nuevo token/API key)
2. Elimina el valor del repo (no basta con borrarlo localmente)
3. Limpia historial si el riesgo lo requiere
4. Actualiza `.env.example` y documentación para evitar que vuelva a ocurrir

## Alcance y límites

Puruto no sustituye:

- un gestor de secretos
- controles de red/firewall
- auditoría de runtime
- hardening del agente o del proveedor del LLM

Sí ayuda a estandarizar buenas prácticas básicas de repos y configuración local.

## Siguientes pasos

- → [Variables de entorno](/referencia/variables-de-entorno/)
- → [IPC agéntico](/referencia/ipc/)
- → [Errores y códigos de validación](/referencia/errores-y-codigos/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/CLAUDE.md`, `generate.py`, `validate.py` y templates `.env.example/.gitignore` del generador el **25 de febrero de 2026**.
