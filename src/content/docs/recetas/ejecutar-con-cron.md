---
title: Ejecutar con puruto-cron
description: Cómo crear un scheduler local con puruto-cron, registrar un job y ejecutarlo con run-now.
---

## Qué resuelve esta receta

Montar un flujo mínimo con `puruto-cron` para:

- inicializar el scheduler
- declarar un job en `.jobs.json`
- sincronizarlo
- ejecutarlo manualmente con `/run-now`
- inspeccionar notificaciones/logs

## Prerrequisitos

- Framework `puruto/` disponible
- Python 3.10+
- Ecosistema `~/purutos/` (recomendado)

## Resultado esperado

Al final tendrás un `puruto-cron` operativo (MVP scaffold) con al menos un job registrado y ejecutable.

## Paso 1. Genera `puruto-cron`

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-cron
```

## Paso 2. Prepara `.env`

```bash
cd ~/purutos/puruto-cron
cp .env.example .env
```

Variables útiles en el scaffold:

- `DB_PATH`
- `PURUTO_CRON_POLL_SECONDS`
- `PURUTO_CRON_LEASE_SECONDS`
- `PURUTO_TELEGRAM_PATH`
- `PURUTO_TELEGRAM_OUTBOX_FILE`

## Paso 3. Inicializa el scheduler (modo agente o CLI)

### Con agente (recomendado)

Ejecuta:

- `/init`

El scaffold de la skill `init` hace (según snapshot del generador):

1. `mkdir -p db runs notifications`
2. `python3 main.py init-db`
3. `python3 main.py sync-jobs`
4. `python3 main.py status`

### Sin agente (manual)

```bash
mkdir -p db runs notifications
python3 main.py init-db
python3 main.py sync-jobs
python3 main.py status
```

## Paso 4. Edita `.jobs.json`

El scaffold ya genera un ejemplo de job en `.jobs.json`. Revísalo y ajusta:

- `job_id`
- `enabled`
- `puruto_target`
- `schedule`
- `prompt`

Campos útiles adicionales del ejemplo scaffold:

- `notify_channel`
- `timeout_sec`
- `max_retries`
- `retry_backoff_sec`

## Paso 5. Sincroniza jobs

```bash
python3 main.py sync-jobs
python3 main.py status
```

## Paso 6. Ejecuta un job inmediatamente

Según la skill `/run-now` del scaffold:

```bash
python3 main.py run-now <job_id>
```

Qué revisar después:

- resultado (`ok`/`error`)
- `run_id` (si el runtime lo reporta)
- `notifications/events.jsonl`

## Paso 7. Inspecciona logs/notificaciones

La skill `/logs` del scaffold sugiere:

```bash
ls -la notifications runs
tail -n 20 notifications/events.jsonl
```

Si aún no hay ficheros, puede ser normal en un entorno recién creado.

## Integración opcional con `puruto-telegram`

`puruto-cron` puede replicar eventos a un outbox local para `puruto-telegram`.

Revisa en `.env`:

- `PURUTO_TELEGRAM_PATH`
- `PURUTO_TELEGRAM_OUTBOX_FILE`

Luego en `puruto-telegram` podrás usar `inbox.py` / `/drain-inbox`.

## Problemas comunes

### `main.py init-db` falla

Revisa:

- versión de Python
- ruta actual (`~/purutos/puruto-cron`)
- archivos scaffold presentes (`main.py`, `db.py`, etc.)

### El job no aparece en `status`

Revisa:

- JSON válido en `.jobs.json`
- ejecución de `python3 main.py sync-jobs`
- `enabled` del job

## Siguientes pasos

- → [Integrar Telegram](/recetas/integrar-telegram/)
- → [puruto-cron (ecosistema)](/ecosistema/puruto-cron/)
- → [Debug y logs](/operacion/debug-y-logs/)

## Última verificación

Contenido contrastado con snapshots de `puruto-cron` y templates `.env.example` del generador el **25 de febrero de 2026**.
