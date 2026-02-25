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

`puruto-cron` uses **SQLite** to persist jobs and runs (MVP scaffold).

The real scaffold stores fields such as:

- `job_id`, `enabled`, `puruto_target`, `schedule`, `prompt`
- `next_run_at`, `last_run_at`
- `lease_owner`, `lease_expires_at`
- `timeout_sec`, `max_retries`, `retry_backoff_sec`

### Job lifecycle

1. Job is declared in `.jobs.json` and synced with `main.py sync-jobs`
2. Scheduler checks which jobs should run
3. Acquires a **lease/lock** to avoid duplicate executions
4. Invokes the target Puruto via shared `invoker.py` (MVP scaffold)
5. If it fails, retries with backoff (up to the per-job limit)
6. Result is recorded in SQLite (`runs`) and notification events are emitted

### Local notifications and replication to puruto-telegram

The scaffold writes events to:

- `notifications/events.jsonl` (local)

And can replicate them to sibling `puruto-telegram` by default at:

- `../puruto-telegram/inbox/cron-events.jsonl`

`puruto-telegram` consumes this inbox with `inbox.py` / `inbox.py --deliver`.

## Included skills

- `/init` — initializes SQLite DB and directory structure
- `/help` — explains how to use the scheduler
- `/list` — lists all configured jobs
- `/status` — shows scheduler state (jobs, recent runs, notification targets)
- `/logs` — inspects `notifications/events.jsonl` and `runs/`
- `/run-now` — forces one immediate job execution

## See also

- [`.jobs.json` reference](/referencia/config-jobs-json/)
- [Local runtime artifacts (MVP)](/referencia/artefactos-runtime-locales/)
- [Diagnosing puruto-cron](/operacion/diagnostico-puruto-cron/)
