---
title: The ecosystem
description: How Purutos coexist in ~/purutos/ and what each special repo is for.
sidebar:
  order: 4
---

## Ecosystem structure

All Purutos live together in `~/purutos/`. Each folder is an **independent git repo**:

```
~/purutos/
├── puruto-data/          ← private data vault (REQUIRED)
├── puruto-telegram/      ← mobile connector (optional)
├── puruto-cron/          ← local scheduler (optional)
├── puruto-gateway/       ← local REST API (optional)
├── puruto-finance/       ← your finance app
├── puruto-health/        ← your health app
└── puruto-notes/         ← your notes app
```

:::note
The `~/purutos/` folder is **not a git repo** — it's just a working directory. Each Puruto has its own `.git` and is managed independently.
:::

## puruto-data — the data vault

`puruto-data` is the **central storage repo** of the ecosystem. No Puruto writes directly to another's folder — everything goes through `puruto-data`.

```
~/purutos/puruto-data/
├── CLAUDE.md              ← access rules and data management
├── finance/               ← data owned by puruto-finance
├── health/                ← data owned by puruto-health
├── notes/                 ← data owned by puruto-notes
└── shared/                ← cross-domain data (controlled access)
```

Each Puruto finds it at `../puruto-data/` by default, or via `PURUTO_DATA_PATH` in its `.env`.

:::tip
`puruto-data` is a complete Puruto — it implements `init`, `help`, `list` and `status`. You can ask it directly about your data without opening the specific Puruto.
:::

## puruto-telegram — the mobile connector

`puruto-telegram` is a Telegram bot that acts as a **deterministic router** to all your Purutos. Routing doesn't use AI — it's based on an "active channel" per user:

```
/finance     → activates puruto-finance as active channel
/health      → activates puruto-health as active channel

"spent $50"  → sent to active channel (puruto-finance)
"went to gym"→ sent to active channel (puruto-health)
```

The persistent Telegram keyboard always shows the active channel and allows quick switching.

:::caution
`puruto-telegram` is currently an **MVP scaffold**. The deterministic router and local inbox are implemented; real Telegram chat delivery is in development.
:::

## puruto-cron — the local scheduler

`puruto-cron` manages **async jobs** for the ecosystem. It uses SQLite for persistence and supports:

- Job scheduling with cron expressions
- Lease/lock to avoid duplicate executions
- Per-job retries with backoff
- Optional JSONL outbox to notify `puruto-telegram`

:::caution
`puruto-cron` is an **MVP scaffold**. The basic SQLite scheduler is operational; the real Puruto invoker and advanced retry policy are in R&D.
:::

## puruto-gateway — the REST API

`puruto-gateway` exposes **base commands** (`init`, `help`, `list`, `status`) of all active Purutos through a local REST API. Useful for integrating Purutos with scripts, dashboards or external tools.

:::caution
`puruto-gateway` is an **MVP scaffold**. The basic API is generated; hardened auth and stable contracts are pending.
:::

## /workspace — the single entry point

The `/workspace` skill (from the framework) lets you **orchestrate all your Purutos from a single entry point**. Without loading each repo separately:

```
/workspace                  → lists all Purutos in ~/purutos/
/workspace puruto-finance   → activates and talks to puruto-finance
/workspace status           → shows the entire ecosystem status
```

## Generating special repos

```bash
# Special ecosystem repos
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-data
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-telegram
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-cron
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-gateway
```

Or simply run `/init` which generates all of them at once.
