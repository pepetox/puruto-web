---
title: Debug y logs
description: Flujo de diagnóstico para Puruto con validate.py, upgrade.py y revisión de artefactos locales.
---

## Qué cubre esta página

- Un flujo de debug reproducible para el framework y repos Puruto
- Qué comandos usar primero
- Qué archivos inspeccionar según el tipo de problema

## Principio de diagnóstico

Puruto tiene dos capas de fallo:

1. **Framework / estructura** (generación, validación, migración)
2. **Runtime del Puruto generado** (integraciones, tokens, ejecución real)

Empieza siempre por la capa 1. Es más rápida de validar y elimina muchas dudas.

## Flujo de debug recomendado (5 pasos)

### 1. Identifica si estás en modo agente o CLI

Anota esto primero. Cambia totalmente el diagnóstico.

- Si falla `/init` o `/puruto-generator`, puede ser un problema del agente
- Si falla `generate.py`/`validate.py`, es framework/entorno

### 2. Ejecuta `validate.py` con salida humana

```bash
python3 .claude/skills/validate/scripts/validate.py /ruta/a/tu-puruto
```

Te da:

- tipo detectado (`standard`, `puruto-data`, `puruto-telegram`, etc.)
- lista de findings
- resumen de errores y warnings

### 3. Ejecuta `validate.py --json` para diagnóstico estructurado

```bash
python3 .claude/skills/validate/scripts/validate.py /ruta/a/tu-puruto --json
```

Campos más útiles para debug:

- `ok`
- `kind`
- `errors`
- `warnings`
- `findings[]` con `code`, `path`, `message`

Esto es especialmente útil para:

- scripts de soporte
- CI
- issues reproducibles

### 4. Si es un repo antiguo, inspecciona migración con `upgrade.py --plan`

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py /ruta/a/tu-puruto --plan
```

Esto te dice:

- versión actual detectada
- ruta de migración soportada (si existe)
- si hace falta migrar antes de seguir depurando

### 5. Inspecciona artefactos según el tipo de repo

El validador usa comprobaciones específicas por tipo. Revisa esos archivos cuando haya errores:

### `standard`

- `.claude/skills/init/SKILL.md`
- `.claude/skills/help/SKILL.md`
- `.claude/skills/list/SKILL.md`
- `.claude/skills/status/SKILL.md`
- `.env.example`
- `README.md`

### `puruto-data`

- `registry.json`
- `shared/.gitkeep`
- `.claude/skills/register/SKILL.md`

### `puruto-telegram`

- `bot.py`, `router.py`, `db.py`, `inbox.py`
- `.channels.json`
- `db/.gitkeep`, `inbox/.gitkeep`
- skills `add-channel` y `drain-inbox`

### `puruto-cron`

- `main.py`, `scheduler.py`, `executor.py`, `db.py`, `notifier.py`, `invoker.py`
- `.jobs.json`
- `db/`, `runs/`, `notifications/`
- skills `register-job`, `pause-job`, `resume-job`, `run-now`, `logs`

### `puruto-gateway`

- `app.py`, `routes.py`, `auth.py`, `registry.py`, `invoker.py`

## Qué “logs” mirar realmente

Puruto (framework) no tiene un sistema centralizado de logs. El diagnóstico se apoya en:

- salida de scripts (`stdout/stderr`)
- findings de `validate.py`
- plan/salida de `upgrade.py`
- artefactos y ficheros del repo generado

En repos del ecosistema, los logs/estados pueden vivir en archivos locales y carpetas específicas del scaffold (por ejemplo `runs/`, `notifications/`, `inbox/`, `db/` según el tipo).

## Checklist de debug mínimo (para compartir con alguien)

1. Ruta del repo que falla
2. Tipo detectado (`validate.py`)
3. Salida de `validate.py --json`
4. Versión declarada en `.puruto-standard-version`
5. Resultado de `upgrade.py --plan` (si no es repo nuevo)

## Siguientes pasos

- → [Errores frecuentes](/operacion/errores-frecuentes/)
- → [Referencia CLI](/referencia/cli/)
- → [Referencia de configuración](/referencia/config-completa/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py` y `/Users/pepetox/Documents/01-code/puruto/.claude/skills/upgrade/scripts/upgrade.py` el **25 de febrero de 2026**.
