---
title: Diagnóstico de puruto-cron
description: Runbook operativo para diagnosticar puruto-cron (jobs, scheduler, leases, runs, notificaciones y retries del scaffold MVP).
---

## Qué cubre esta página

- Flujo de diagnóstico de `puruto-cron`
- Checks de `.jobs.json`, DB SQLite y scheduler
- Diagnóstico de `run-now`, `tick`, leases y retries
- Verificación de notificaciones locales y replicación a `puruto-telegram`

## Alcance

Fuente de verdad:

- templates `cron/*.py.tpl` del generador
- skills scaffold `init`, `status`, `logs`, `run-now`, `register-job`

## Principio de diagnóstico

En `puruto-cron`, separa estos fallos:

1. Configuración declarativa (`.jobs.json`)
2. Persistencia local (`db/cron.db`)
3. Scheduler/runtime (`tick`, `run-now`, leases)
4. Observabilidad/notificaciones (`notifications/events.jsonl`, outbox a telegram)

## Paso 1. Validar estructura del repo

```bash
python3 /Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py /ruta/a/puruto-cron --json
```

Revisa:

- `kind = "puruto-cron"`
- `errors = 0`

## Paso 2. Validar `.jobs.json`

Chequeo rápido de parseo:

```bash
python3 - <<'PY'
import json
from pathlib import Path

data = json.loads(Path(".jobs.json").read_text(encoding="utf-8"))
jobs = data.get("jobs", [])
print("jobs:", len(jobs))
for j in jobs:
    print("-", j.get("job_id"), "enabled=", j.get("enabled"), "schedule=", j.get("schedule"))
PY
```

Si falla:

- JSON inválido
- root sin `jobs`
- jobs con campos críticos faltantes

Referencia:

- [`.jobs.json` (referencia)](/referencia/config-jobs-json/)

## Paso 3. Inicialización base (alineada con `/init`)

La skill `/init` del scaffold hace:

1. `mkdir -p db runs notifications`
2. `python3 main.py init-db`
3. `python3 main.py sync-jobs`
4. `python3 main.py status`

Si dudas del estado local, reejecuta ese flujo.

## Paso 4. Estado del scheduler (`status`)

Comando:

```bash
python3 main.py status
```

La salida JSON incluye:

- `jobs`
- `recent_runs`
- `notification_targets`

Qué revisar:

- jobs esperados existen
- `enabled`, `next_run_at`, `lease_owner`, `lease_expires_at`
- rutas de notificación (`local_events`, `telegram_outbox`)

## Paso 5. Probar ejecución puntual (`run-now`)

Comando:

```bash
python3 main.py run-now <job_id>
```

Revisa en la salida:

- `status` (`ok` / `error`)
- `run_id`
- `notification_paths`

Errores controlados frecuentes (scheduler):

- `JOB_NOT_FOUND`
- `JOB_DISABLED`
- `JOB_LOCKED`

## Paso 6. Diagnóstico de `tick` (scheduler loop)

Comando:

```bash
python3 main.py tick
```

Campos clave:

- `now`
- `lease_owner`
- `due_jobs`
- `results[]`

Si `due_jobs` sale vacío cuando esperas ejecuciones:

1. revisa `next_run_at`
2. revisa `enabled`
3. revisa leases activos (`lease_expires_at`)
4. revisa si el `schedule` parsea en el MVP

## Paso 7. Notificaciones y outbox a `puruto-telegram`

`puruto-cron` escribe siempre en:

- `notifications/events.jsonl`

Y replica opcionalmente al repo hermano `puruto-telegram` en:

- `../puruto-telegram/inbox/cron-events.jsonl` (por defecto)

Variables relevantes:

- `PURUTO_TELEGRAM_PATH`
- `PURUTO_TELEGRAM_OUTBOX_FILE`

Comprobación:

```bash
ls -la notifications runs
tail -n 20 notifications/events.jsonl
```

Si no se replica a telegram:

1. revisa `notification_targets` en `main.py status`
2. confirma que existe el repo `puruto-telegram`
3. revisa `PURUTO_TELEGRAM_PATH`

## Paso 8. SQLite (diagnóstico profundo)

DB por defecto:

- `db/cron.db`

Inspecciones útiles:

```bash
sqlite3 db/cron.db "select job_id, enabled, next_run_at, lease_owner, lease_expires_at from jobs order by job_id;"
sqlite3 db/cron.db "select run_id, job_id, status, started_at, finished_at from runs order by started_at desc limit 20;"
```

## Diagnóstico por síntomas

### `status` OK pero no ejecuta jobs

Revisa:

1. `enabled=false`
2. `next_run_at` nulo (schedule no parseable en MVP)
3. lease activo (`JOB_LOCKED`)

### `run-now` devuelve error del invoker

El scaffold usa `invoker.py` común (stub o error estructurado). Revisa:

- payload de `result` / `error`
- `notifications/events.jsonl`
- integración del target (si has modificado el scaffold)

### No aparecen eventos en `notifications/events.jsonl`

Revisa:

1. que realmente hubo una ejecución (`run-now` / `tick`)
2. permisos de escritura en `notifications/`
3. errores antes de `emit_notification()`

## Checklist de diagnóstico rápido

1. `validate.py` del repo `puruto-cron` ✅
2. `.jobs.json` parsea ✅
3. `main.py status` responde ✅
4. `run-now <job_id>` responde ✅
5. `notifications/events.jsonl` registra eventos ✅
6. `db/cron.db` contiene jobs/runs ✅

## Referencias relacionadas

- [`.jobs.json` (referencia)](/referencia/config-jobs-json/)
- [Artefactos runtime locales (MVP)](/referencia/artefactos-runtime-locales/)
- [Ejecutar con puruto-cron](/recetas/ejecutar-con-cron/)

## Última verificación

Runbook contrastado con `cron/main.py.tpl`, `cron/scheduler.py.tpl`, `cron/notifier.py.tpl`, `cron/db.py.tpl` y skills scaffold de `puruto-cron` el **25 de febrero de 2026**.
