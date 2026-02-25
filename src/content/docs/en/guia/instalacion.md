---
title: Installation
description: Set up your Puruto environment from scratch in 5 minutes.
sidebar:
  order: 1
---

## Requirements

- **Python 3.10+** — the generator and validator use modern syntax (`|`, generic types)
- **A SKILL.md-compatible agent**: [Claude Code](https://claude.ai/code), Gemini CLI, Codex or Windsurf
- **Git**

Verify your Python version:

```bash
python3 --version
# Python 3.10.x or higher
```

## 1. Clone the framework

```bash
git clone https://github.com/pepetox/puruto.git
cd puruto
```

## 2. Install dependencies

The only framework requirement is Jinja2 (for rendering generator templates):

```bash
pip install jinja2
```

## 3. Initialize the ecosystem

Open the repo in your agent and run:

```
/init
```

The `/init` skill automatically creates:

```
~/purutos/
├── puruto-data/       ← private data vault
├── puruto-telegram/   ← Telegram connector (MVP scaffold)
├── puruto-cron/       ← local scheduler (MVP scaffold)
└── puruto-gateway/    ← local REST API (MVP scaffold)
```

:::tip
If you want to start minimal, `/init` can generate only `puruto-data`. You can add the other repos later with `/puruto-generator` when you need them.
:::

## 4. Verify the installation

```bash
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-data
```

You should see `✓ Valid Puruto` if everything is working.

## Environment variables

Copy the framework's `.env.example` to configure ecosystem paths:

```bash
cp .env.example .env
```

Main variables:

| Variable | Description | Default |
|---|---|---|
| `PURUTO_DATA_PATH` | Path to `puruto-data` | `../puruto-data/` |
| `PURUTO_TELEGRAM_BOT_TOKEN` | Telegram bot token | *(empty)* |

## Next step

→ [Create your first Puruto](/en/guia/primer-puruto/)
