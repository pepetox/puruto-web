---
title: Best Purutos
description: Showcase of official ecosystem Purutos and community contributions.
---

## Official ecosystem

The four special repos of the Puruto ecosystem, generated and maintained as part of the framework:

| Puruto | Type | Status | Description |
|---|---|---|---|
| [puruto-data](/en/ecosistema/puruto-data/) | Data vault | Stable | Centralized ecosystem storage |
| [puruto-telegram](/en/ecosistema/puruto-telegram/) | Mobile connector | MVP | Telegram bot with deterministic routing |
| [puruto-cron](/en/ecosistema/puruto-cron/) | Scheduler | MVP | Async jobs with SQLite and retries |
| [puruto-gateway](/en/ecosistema/puruto-gateway/) | REST API | MVP | HTTP exposure of base commands |

## Use case templates

### Personal finance

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-finance \
  --description "Personal finance tracking and analysis" \
  --db true \
  --skills "record,query,budget,export"
```

Suggested skills: `record` (income/expenses), `query` (filter by category/date), `budget` (limit alerts), `export` (CSV/JSON).

### Journal and notes

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-journal \
  --description "Personal journal and notes" \
  --db true \
  --skills "create,search,summarize,export"
```

### Health and habits

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-health \
  --description "Habit and health tracking" \
  --db true \
  --skills "log,trends,goals"
```

### Reservations and schedule

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-reservations \
  --description "Reservation and personal schedule management" \
  --db true \
  --ipc true \
  --skills "create,query,cancel,reminder"
```

This use case uses IPC (`--ipc true`) to delegate payments to `puruto-finance`.

## Community

Have an interesting Puruto? Share it with the community.

→ [How to add your Puruto to the showcase](/en/showcase/contribuir/)
