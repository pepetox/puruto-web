---
title: The Puruto standard
description: Formal specification of the Puruto 0.2.0 standard — minimum structure, mandatory contract and versioning.
sidebar:
  order: 1
---

## Current version

**`0.2.0`** — recorded in `.puruto-standard-version` in every Puruto repo.

## Minimum structure

Every repo that meets the Puruto standard contains:

```
my-puruto/
├── CLAUDE.md              ← agent rules (identity, behavior, skills)
├── agent.md               ← equivalent for Codex/Windsurf/Gemini CLI
├── README.md              ← human documentation of the repo
├── .env.example           ← environment variables template (in git)
├── .env                   ← real values (never in git, in .gitignore)
├── .gitignore             ← excludes .env, db/, etc.
├── .puruto-standard-version ← version of implemented standard
└── .claude/skills/        ← skills directory
    ├── init/SKILL.md
    ├── help/SKILL.md
    ├── list/SKILL.md
    └── status/SKILL.md
```

### Common optional files

```
my-puruto/
├── db/                    ← local database (if --db true)
├── ipc.py                 ← IPC runtime (if --ipc true)
├── invoker.py             ← IPC invoker (if --ipc true)
├── .puruto-ipc.json       ← IPC config (if --ipc true)
└── tests/
    └── agent/             ← agentic tests (if --agent-tests true)
```

## Mandatory contract

Every Puruto implements these four skills as a minimum:

| Skill | Invocation | Responsibility |
|---|---|---|
| `init` | `/init` | Sets up the environment: creates folders, installs deps, initializes DB, generates `.env` |
| `help` | `/help` or "how do I use you?" | Explains how to interact with the Puruto |
| `list` | `/list` or "what can you do?" | Lists all available features and skills |
| `status` | `/status` | Current state: config, DB, active connections |

A repo that implements these four commands can be called a Puruto.

## CLAUDE.md vs agent.md

Both files contain the same agent rules, but in slightly different formats:

- `CLAUDE.md` — Claude Code format (Anthropic-style frontmatter)
- `agent.md` — generic format compatible with Gemini CLI, Codex and Windsurf

The generator creates both. They are functionally equivalent.

## Standard versioning

The `.puruto-standard-version` file contains the version of the standard implemented by the repo:

```
0.2.0
```

### Version history

| Version | Main changes |
|---|---|
| `0.1.0` | Base structure: mandatory skills, `.env.example`, `.gitignore` |
| `0.2.0` | Agentic IPC (`/call`, `.puruto-ipc.json`, `ipc.py`), Agent-CI scaffold, `puruto-cron` and `puruto-gateway` templates |

### Migration

Use the `/upgrade` skill or the CLI:

```bash
# See which migrations apply
python3 .claude/skills/upgrade/scripts/upgrade.py --plan ~/purutos/my-puruto

# Apply the migration
python3 .claude/skills/upgrade/scripts/upgrade.py ~/purutos/my-puruto
```

## Conventions

### Repo names

The recommended convention is `puruto-<name>` (e.g. `puruto-finance`, `puruto-health`). Not mandatory, but improves integration with `/workspace` and `puruto-gateway`.

### Placeholders

Generator templates use `__UPPERCASE__` placeholders. If you find this pattern in a generated repo, it's a bug — please report on GitHub.

### Secrets

**Never** include real values in `.env.example` or in `CLAUDE.md`. Only templates and descriptions. Real values go exclusively in `.env` (which is in `.gitignore`).
