---
title: Configuración (referencia)
description: Referencia de archivos y variables de configuración del framework Puruto y de los repos generados.
sidebar:
  order: 4
---

## Alcance de esta referencia

Esta página cubre la configuración en dos niveles:

1. **Framework Puruto** (repo `puruto/`)
2. **Repos Puruto generados** (por ejemplo `~/purutos/puruto-demo`)

No todas las claves aplican a todos los tipos de Puruto.

## Framework Puruto: archivos de configuración relevantes

| Archivo | Ámbito | Para qué sirve |
|---|---|---|
| `.env.example` | Framework | Variables de referencia del ecosistema (`PURUTO_DATA_PATH`, `PURUTO_TELEGRAM_BOT_TOKEN`) |
| `.env` | Framework local | Copia local editable (no se versiona) |
| `.puruto-config.json` | Framework | Configuración de guardias de sincronización docs/tests en CI |
| `CLAUDE.md` | Framework | Identidad y reglas operativas del framework para agentes |
| `README.md` | Framework | Documentación operativa y referencia de uso |

## Variables de entorno del framework (actuales)

Según `/Users/pepetox/Documents/01-code/puruto/.env.example`:

| Variable | Descripción | Uso típico |
|---|---|---|
| `PURUTO_DATA_PATH` | Ruta a `puruto-data` | Ecosistema local / integración entre Purutos |
| `PURUTO_TELEGRAM_BOT_TOKEN` | Token del bot de Telegram | Configuración de `puruto-telegram` |

:::note
El fichero `.env.example` del framework documenta variables de referencia. La configuración efectiva puede terminar viviendo en los repos generados (por ejemplo `~/purutos/puruto-telegram/.env`).
:::

## `.puruto-config.json` (framework)

Actualmente se usa para las guardias de sincronización en CI:

- `sync_guards.doc_files`: documentación obligatoria a sincronizar
- `sync_guards.test_prefixes`: prefijos de tests afectados
- `sync_guards.critical_prefixes`: rutas de código/plantillas que disparan la guardia

### Ejemplo de uso práctico

Si modificas:

- `.claude/skills/puruto-generator/templates/`
- `.claude/skills/validate/`
- `.claude/skills/upgrade/`

CI espera cambios consistentes también en docs/tests (según la guardia).

## Repos Puruto generados: archivos clave

### Siempre (mínimo estándar)

| Archivo/ruta | Requerido | Notas |
|---|---|---|
| `CLAUDE.md` o `agent.md` | Sí (al menos uno) | El validador acepta cualquiera; recomienda ambos |
| `README.md` | Sí | Documentación del repo |
| `.env.example` | Sí | Plantilla de configuración |
| `.claude/skills/` | Sí | Skills del Puruto |
| `.claude/skills/init/SKILL.md` | Sí | Skill base |
| `.claude/skills/help/SKILL.md` | Sí | Skill base |
| `.claude/skills/list/SKILL.md` | Sí | Skill base |
| `.claude/skills/status/SKILL.md` | Sí | Skill base |
| `.puruto-standard-version` | Recomendado | Muy importante para migraciones |
| `.gitignore` | Recomendado | Especialmente si existe `.env` |

### Configuración IPC (solo si usas delegación)

Si existe `.puruto-ipc.json`, el validador espera también:

- `.claude/skills/call/SKILL.md`
- `ipc.py`
- `invoker.py`

Claves recomendadas en `.puruto-ipc.json` (según `validate.py`):

- `enabled`
- `owner`
- `max_hops`
- `default_timeout_sec`
- `allowed_targets`
- `allowed_actions`

Tipos validados:

- `allowed_targets` debe ser lista
- `allowed_actions` debe ser objeto JSON

### Configuración por tipo de Puruto (resumen de validación)

### `puruto-data`

El validador comprueba componentes como:

- `registry.json`
- `shared/.gitkeep`
- `.claude/skills/register/SKILL.md`

Referencias útiles:

- → [`registry.json` de puruto-data](/referencia/registry-json-puruto-data/)

### `puruto-telegram`

El validador comprueba componentes como:

- `bot.py`, `router.py`, `db.py`, `inbox.py`
- `.channels.json`
- `db/.gitkeep`, `inbox/.gitkeep`
- skills `add-channel` y `drain-inbox`

Referencias útiles:

- → [`.channels.json` (referencia)](/referencia/config-channels-json/)

### `puruto-cron`

El validador comprueba componentes como:

- `main.py`, `db.py`, `scheduler.py`, `executor.py`, `invoker.py`, `notifier.py`
- `.jobs.json`
- `db/`, `runs/`, `notifications/`
- skills `register-job`, `pause-job`, `resume-job`, `run-now`, `logs`

Referencias útiles:

- → [`.jobs.json` (referencia)](/referencia/config-jobs-json/)

### `puruto-gateway`

El validador comprueba componentes como:

- `app.py`, `routes.py`, `auth.py`, `registry.py`, `invoker.py`

Referencias útiles:

- → [Gateway API (MVP)](/referencia/gateway-api-mvp/)

## Validar configuración (comando recomendado)

```bash
python3 .claude/skills/validate/scripts/validate.py /ruta/a/tu-puruto --json
```

Úsalo como fuente de verdad de estado estructural antes de depurar ejecución runtime.

## Relación con migraciones

`upgrade.py` usa `.puruto-standard-version` para planificar migraciones hacia la versión soportada más reciente del estándar (`0.2.0` en el código actual).

Comando útil:

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py /ruta/a/tu-puruto --plan
```

## Siguientes pasos

- → [Referencia CLI](/referencia/cli/)
- → [Errores frecuentes](/operacion/errores-frecuentes/)
- → [Debug y logs](/operacion/debug-y-logs/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/.env.example`, `/Users/pepetox/Documents/01-code/puruto/.puruto-config.json`, `/Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py` y `/Users/pepetox/Documents/01-code/puruto/.claude/skills/upgrade/scripts/upgrade.py` el **25 de febrero de 2026**.
