---
title: .jobs.json (referencia)
description: Contrato práctico de .jobs.json en puruto-cron (jobs, campos, defaults, semántica de scheduler y límites del parser MVP).
---

## Qué cubre esta página

- Formato de `.jobs.json` en `puruto-cron`
- Campos requeridos y opcionales por job
- Defaults aplicados al sincronizar (`sync-jobs`)
- Limitaciones del parser de cron en el scaffold MVP

## Alcance

Fuente de verdad:

- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/cron/.jobs.json.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/cron/scheduler.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/cron/db.py.tpl`

## Estructura raíz

El fichero debe ser un JSON objeto con clave `jobs`:

```json
{
  "jobs": []
}
```

## Ejemplo scaffold

```json
{
  "jobs": [
    {
      "job_id": "sample-financial-weekly",
      "enabled": false,
      "puruto_target": "puruto-financial",
      "schedule": "0 9 * * 5",
      "prompt": "Revisa movimientos bancarios y resume anomalías de la semana",
      "notify_channel": "telegram",
      "timeout_sec": 180,
      "max_retries": 2,
      "retry_backoff_sec": 30
    }
  ]
}
```

## Campos por job

## Requeridos (prácticos)

Estos campos son los que el scheduler/DB usa como base y debes tratar como obligatorios:

- `job_id` (string)
- `puruto_target` (string)
- `schedule` (string, cron de 5 campos en formato texto)
- `prompt` (string)

## Recomendados explícitos

- `enabled` (bool)

Aunque `db.py` tiene default `enabled=1`, es mejor declararlo siempre para que la intención del job sea clara.

## Opcionales con default en `upsert_job()`

- `notify_channel` (default `"telegram"`)
- `timeout_sec` (default `120`)
- `max_retries` (default `0`)
- `retry_backoff_sec` (default `30`)

## Campos gestionados por runtime/DB (no suelen editarse a mano)

Pueden existir en el objeto al sincronizar, pero normalmente los gestiona el runtime:

- `next_run_at`
- `last_run_at`
- `lease_owner`
- `lease_expires_at`

## Semántica de `sync-jobs`

`python3 main.py sync-jobs`:

1. lee `.jobs.json`
2. recorre `jobs[]`
3. si falta `next_run_at`, calcula uno con `compute_next_run_at(schedule)`
4. inserta/actualiza en SQLite (`jobs` table)

Respuesta típica:

```json
{
  "status": "ok",
  "synced_jobs": 1
}
```

## Parser de cron (MVP) y limitaciones importantes

El scaffold MVP **no implementa un parser cron completo**.

`compute_next_run_at()`:

- espera 5 campos (`M H * * *` o `M H * * DOW`)
- solo usa `minute` y `hour`
- exige que ambos sean numéricos

Esto implica:

- expresiones como `*/5 * * * *` no se calculan
- `DOW` no afecta al cálculo de `next_run_at` en el MVP
- si el `schedule` no parsea, `next_run_at` puede quedar `null`

## Campos persistidos en SQLite (`jobs` table)

La tabla `jobs` guarda (entre otros):

- `job_id`
- `enabled`
- `puruto_target`
- `schedule`
- `prompt`
- `notify_channel`
- `timeout_sec`
- `max_retries`
- `retry_backoff_sec`
- `next_run_at`
- `last_run_at`
- `lease_owner`
- `lease_expires_at`

## Errores comunes

### El job no aparece tras `sync-jobs`

Revisa:

- JSON válido en `.jobs.json`
- que el objeto esté dentro de `jobs[]`
- `job_id` único (PK en SQLite)

### `next_run_at` queda vacío o extraño

Suele indicar:

- `schedule` no compatible con el parser MVP
- cron con expresiones avanzadas (`*/`, listas, rangos)

## Buenas prácticas

1. Usa `job_id` estable y descriptivo (`daily-summary`, `weekly-anomalies`)
2. Mantén `enabled=false` para jobs nuevos hasta validar
3. Empieza con `max_retries=0` y sube después si hace falta
4. Revisa `python3 main.py status` tras cada cambio

## Referencias relacionadas

- [Ejecutar con puruto-cron](/recetas/ejecutar-con-cron/)
- [Artefactos runtime locales (MVP)](/referencia/artefactos-runtime-locales/)
- [Observabilidad](/operacion/observabilidad/)

## Última verificación

Contenido contrastado con `.jobs.json.tpl`, `scheduler.py.tpl` y `db.py.tpl` del scaffold `puruto-cron` el **25 de febrero de 2026**.
