---
title: Artefactos runtime locales (MVP)
description: Formatos y semántica de artefactos locales en Puruto (JSON/JSONL/SQLite) para cron, telegram y observabilidad operativa.
---

## Qué cubre esta página

- Formato de `notifications/events.jsonl` en `puruto-cron`
- Formato de `inbox/cron-events.jsonl` en `puruto-telegram`
- Estado local de drenado (`db/inbox_offsets.json`, `db/cron-forwarded.jsonl`)
- Salidas JSON operativas de `puruto-cron` (`status`, `tick`, `run-now`)

## Alcance

Esta referencia documenta artefactos **MVP scaffold** observados en templates del generador:

- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/cron/notifier.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/cron/scheduler.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/cron/main.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/cron/db.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/telegram/inbox.py.tpl`

Los formatos pueden evolucionar con nuevas versiones del estándar.

## `puruto-cron`: `notifications/events.jsonl`

Ruta local por defecto:

- `notifications/events.jsonl`

El notifier escribe un JSON por línea y siempre añade:

- `ts` (timestamp UTC ISO)

Luego mezcla el `event` recibido desde el scheduler.

### Ejemplo (éxito)

Forma emitida por `scheduler.run_job_now()` cuando la invocación termina `ok`:

```json
{
  "ts": "2026-02-25T20:00:00+00:00",
  "job_id": "daily-summary",
  "run_id": "daily-summary-20260225T200000",
  "attempt": 1,
  "result": {
    "status": "ok",
    "request": {
      "request_id": "req-...",
      "correlation_id": "corr-..."
    },
    "response": {
      "status": "ok",
      "result": {
        "summary": "Trabajo completado"
      }
    }
  }
}
```

### Ejemplo (error)

Forma emitida cuando el scheduler agota intentos o falla:

```json
{
  "ts": "2026-02-25T20:01:00+00:00",
  "job_id": "daily-summary",
  "run_id": "daily-summary-20260225T200100",
  "attempts": 2,
  "error": {
    "code": "INVOKER_ERROR_STATUS",
    "message": "El invoker devolvió status != ok",
    "details": {
      "attempt": 2,
      "response_status": "error"
    }
  }
}
```

### Semántica importante

- `attempt` aparece en éxito
- `attempts` aparece en error final
- `result` y `error` son mutuamente excluyentes en los eventos típicos del scheduler
- `ts` lo añade `notifier.py`, no el scheduler

## Replicación a `puruto-telegram` (outbox/inbox jsonl)

El mismo payload se replica opcionalmente al repo hermano:

- base: `PURUTO_TELEGRAM_PATH` (default `../puruto-telegram`)
- fichero: `PURUTO_TELEGRAM_OUTBOX_FILE` (default `inbox/cron-events.jsonl`)

Si el repo destino no existe, el notifier:

- no falla
- sigue escribiendo `notifications/events.jsonl`
- devuelve `telegram_outbox` vacío en `notification_paths`

## `puruto-telegram`: `inbox/cron-events.jsonl`

Ruta esperada por `inbox.py`:

- `inbox/cron-events.jsonl`

Contenido:

- JSONL con la misma forma que los eventos emitidos por `puruto-cron`

`inbox.py` procesa líneas nuevas desde un offset persistido y puede:

- solo registrar forwarding (`--deliver` desactivado)
- registrar forwarding y enviar a Telegram (`--deliver`)

## `puruto-telegram`: estado local del drenado

### `db/inbox_offsets.json`

Mapa JSON de offsets por archivo de inbox:

```json
{
  "inbox/cron-events.jsonl": 1234
}
```

Uso:

- recordar hasta dónde se leyó el inbox
- permitir drenado incremental

Si el archivo está corrupto (JSON inválido), `inbox.py` cae a `{}`.

### `db/cron-forwarded.jsonl`

Log JSONL de eventos procesados por `inbox.py`.

Cada línea es el evento original. Si se usa `--deliver`, el preview de salida añade `_delivery`, pero el forwarded log se escribe antes de enriquecer el evento en memoria.

## Salida JSON de `puruto-telegram/inbox.py`

Comando:

```bash
python3 inbox.py --limit 50
```

Ejemplo típico:

```json
{
  "status": "ok",
  "processed": 3,
  "deliver": false,
  "delivered": 0,
  "skipped_delivery": 0,
  "offset": 1234,
  "inbox_file": "inbox/cron-events.jsonl",
  "forwarded_log": "db/cron-forwarded.jsonl",
  "preview": [
    {
      "job_id": "daily-summary",
      "run_id": "daily-summary-20260225T200000",
      "ts": "2026-02-25T20:00:00+00:00"
    }
  ]
}
```

Si el inbox no existe:

```json
{
  "status": "ok",
  "pending": 0,
  "processed": 0,
  "message": "No existe inbox/cron-events.jsonl"
}
```

## Salidas JSON de `puruto-cron` (operación)

## `status`

`python3 main.py status` devuelve:

```json
{
  "jobs": [],
  "recent_runs": [],
  "notification_targets": {
    "local_events": "notifications/events.jsonl",
    "telegram_outbox": "../puruto-telegram/inbox/cron-events.jsonl",
    "telegram_repo_exists": false
  }
}
```

Notas:

- `recent_runs` viene de SQLite (`runs` table) y expone solo `run_id`, `job_id`, `started_at`, `finished_at`, `status`
- `notification_targets` se calcula en runtime con env vars

## `tick`

`python3 main.py tick` devuelve una ejecución de scheduler:

```json
{
  "status": "ok",
  "now": "2026-02-25T20:00:00+00:00",
  "lease_owner": "host:12345",
  "due_jobs": ["daily-summary"],
  "results": []
}
```

`results[]` contiene los payloads de `run_job_now()` (éxito o error por job).

## `run-now`

`python3 main.py run-now <job_id>` devuelve el payload de `run_job_now()`.

Errores controlados posibles (según `scheduler.py`):

- `JOB_NOT_FOUND`
- `JOB_DISABLED`
- `JOB_LOCKED`

## Tabla `runs` (SQLite) en `puruto-cron`

DB por defecto:

- `db/cron.db`

Tabla `runs` (campos relevantes):

- `run_id` (TEXT, PK)
- `job_id` (TEXT)
- `started_at` (TEXT)
- `finished_at` (TEXT o null)
- `status` (TEXT)
- `result_json` (TEXT o null)
- `error_json` (TEXT o null)

### Semántica práctica

- `recent_runs()` no expone `result_json` ni `error_json`
- para diagnóstico profundo puedes inspeccionar SQLite directamente

Ejemplo:

```bash
sqlite3 db/cron.db "select run_id, job_id, status, started_at, finished_at from runs order by started_at desc limit 20;"
```

## Recomendaciones operativas

1. Trata `events.jsonl` e `inbox/*.jsonl` como logs append-only
2. No asumas schema rígido completo en `result` (puede depender del target/invoker)
3. Usa claves estables para dashboards simples: `job_id`, `run_id`, `ts`, `error.code`
4. Versiona tus parsers internos si dependes de campos opcionales

## Referencias relacionadas

- [Observabilidad](/operacion/observabilidad/)
- [Ejecutar con puruto-cron](/recetas/ejecutar-con-cron/)
- [Integrar Telegram](/recetas/integrar-telegram/)
- [Contratos runtime (MVP)](/referencia/contratos-runtime/)

## Última verificación

Contenido contrastado con templates `cron/*` y `telegram/inbox.py.tpl` del generador el **25 de febrero de 2026**.
