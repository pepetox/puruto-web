---
title: puruto-cron
description: Scheduler local de jobs asíncronos para el ecosistema Puruto.
sidebar:
  order: 3
---

## ¿Qué es puruto-cron?

`puruto-cron` es el **scheduler local de jobs asíncronos** del ecosistema. Permite programar tareas que se ejecutan automáticamente, con persistencia local en SQLite y notificaciones JSONL (MVP scaffold).

:::caution[MVP]
`puruto-cron` es un **MVP scaffold**. El scheduler básico con SQLite, lease/lock y retries está operativo. El invoker real de Purutos y la política de retries avanzada están en I+D.
:::

## Cuándo usarlo

- Backups periódicos de `puruto-data`
- Reportes automáticos (ej: resumen semanal de finanzas)
- Sincronización con servicios externos en horarios programados
- Alertas o notificaciones basadas en condiciones de los datos

## Generarlo

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-cron
```

## Funcionamiento

`puruto-cron` usa **SQLite** para persistir jobs y runs. El scaffold crea tablas `jobs` y `runs`.

La estructura real incluye campos como:

- `job_id`, `enabled`, `puruto_target`, `schedule`, `prompt`
- `next_run_at`, `last_run_at`
- `lease_owner`, `lease_expires_at`
- `timeout_sec`, `max_retries`, `retry_backoff_sec`

### Ciclo de vida de un job

1. El job se declara en `.jobs.json` y se sincroniza con `main.py sync-jobs`
2. El scheduler comprueba qué jobs deben ejecutarse
3. Adquiere un **lease/lock** para evitar ejecuciones duplicadas
4. Invoca al Puruto target vía `invoker.py` (scaffold común, MVP)
5. Si falla, reintenta con backoff (hasta el límite configurado por job)
6. El resultado se registra en SQLite (`runs`) y se emite evento de notificación

### Notificaciones locales y replicación a puruto-telegram

El scaffold escribe eventos en:

- `notifications/events.jsonl` (local)

Y puede replicarlos al repo hermano `puruto-telegram` (por defecto):

- `../puruto-telegram/inbox/cron-events.jsonl`

`puruto-telegram` consume ese inbox con `inbox.py` / `inbox.py --deliver`.

## Skills incluidas

- `/init` — inicializa la BD SQLite y la estructura de directorios
- `/help` — explica cómo usar el scheduler
- `/list` — lista todos los jobs configurados
- `/status` — muestra estado del scheduler (jobs, runs recientes y rutas de notificación)
- `/logs` — inspecciona `notifications/events.jsonl` y `runs/`
- `/run-now` — fuerza una ejecución puntual de un job

## Ver también

- → [`.jobs.json` (referencia)](/referencia/config-jobs-json/)
- → [Artefactos runtime locales (MVP)](/referencia/artefactos-runtime-locales/)
- → [Diagnóstico de puruto-cron](/operacion/diagnostico-puruto-cron/)
