---
title: puruto-cron
description: Scheduler local de jobs asíncronos para el ecosistema Puruto.
sidebar:
  order: 3
---

## ¿Qué es puruto-cron?

`puruto-cron` es el **scheduler local de jobs asíncronos** del ecosistema. Permite programar tareas que se ejecutan automáticamente — desde backups de `puruto-data` hasta reportes periódicos.

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

`puruto-cron` usa **SQLite** para persistir los jobs y su estado:

```sql
-- Tabla jobs (simplificada)
job_id | cron_expr | target_puruto | action | last_run | next_run | status
```

### Ciclo de vida de un job

1. El job se registra con una cron expression (`0 8 * * *` = cada día a las 8h)
2. El scheduler comprueba qué jobs deben ejecutarse
3. Adquiere un **lease/lock** para evitar ejecuciones duplicadas
4. Invoca al Puruto target vía `invoker.py` (scaffold MVP)
5. Si falla, reintenta con backoff (hasta el límite configurado por job)
6. El resultado se registra en el historial de SQLite

### Outbox hacia puruto-telegram

Los jobs pueden enviar eventos a `puruto-telegram` vía outbox JSONL:

```
~/purutos/puruto-cron/
└── outbox/
    └── telegram-events.jsonl   ← eventos pendientes de entrega
```

`puruto-telegram` consume este outbox con `inbox.py --deliver`.

## Skills incluidas

- `/init` — inicializa la BD SQLite y la estructura de directorios
- `/help` — explica cómo usar el scheduler
- `/list` — lista todos los jobs configurados
- `/status` — muestra estado del scheduler: jobs activos, próximas ejecuciones, últimas ejecuciones
