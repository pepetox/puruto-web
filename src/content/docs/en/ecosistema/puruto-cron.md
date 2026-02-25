---
title: puruto-cron
description: Local async job scheduler for the Puruto ecosystem.
sidebar:
  order: 3
---

## What is puruto-cron?

`puruto-cron` is the **local async job scheduler** of the ecosystem. It lets you schedule tasks that run automatically — from `puruto-data` backups to periodic reports.

:::caution[MVP]
`puruto-cron` is an **MVP scaffold**. The basic SQLite scheduler with lease/lock and retries is operational. The real Puruto invoker and advanced retry policy are in R&D.
:::

## When to use it

- Periodic `puruto-data` backups
- Automatic reports (e.g. weekly finance summary)
- Scheduled synchronization with external services
- Alerts or notifications based on data conditions

## Generate it

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-cron
```

## How it works

`puruto-cron` uses **SQLite** to persist jobs and their state:

```sql
-- jobs table (simplified)
job_id | cron_expr | target_puruto | action | last_run | next_run | status
```

### Job lifecycle

1. Job is registered with a cron expression (`0 8 * * *` = every day at 8am)
2. Scheduler checks which jobs should run
3. Acquires a **lease/lock** to avoid duplicate executions
4. Invokes the target Puruto via `invoker.py` (MVP scaffold)
5. If it fails, retries with backoff (up to the per-job limit)
6. Result is recorded in SQLite history

### Outbox to puruto-telegram

Jobs can send events to `puruto-telegram` via JSONL outbox:

```
~/purutos/puruto-cron/
└── outbox/
    └── telegram-events.jsonl   ← pending delivery events
```

`puruto-telegram` consumes this outbox with `inbox.py --deliver`.

## Included skills

- `/init` — initializes SQLite DB and directory structure
- `/help` — explains how to use the scheduler
- `/list` — lists all configured jobs
- `/status` — shows scheduler state: active jobs, next executions, last executions
