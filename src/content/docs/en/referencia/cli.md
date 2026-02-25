---
title: CLI Reference
description: All Puruto framework CLI commands — generate.py, validate.py and upgrade.py.
sidebar:
  order: 4
---

## generate.py

Generates a new Puruto repo in `~/purutos/` (or current directory as fallback).

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py [options]
```

### Options

| Flag | Type | Default | Description |
|---|---|---|---|
| `--name` | string | *(required)* | Repo name (no spaces) |
| `--description` | string | `""` | One-line description |
| `--db` | bool | `false` | Include local SQLite database |
| `--skills` | string | `""` | Additional skills, comma-separated |
| `--ipc` | bool | `false` | Include IPC runtime (`/call`, `ipc.py`, `invoker.py`) |
| `--agent-tests` | bool | `false` | Include Agent-CI scaffold (`tests/agent/`) |

### Special repos

```bash
# Generate ecosystem repos (dedicated template per type)
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-data
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-telegram
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-cron
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-gateway
```

### Examples

```bash
# Minimal Puruto
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-notes \
  --description "Personal notes management"

# Puruto with database and custom skills
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-finance \
  --description "Personal finance" \
  --db true \
  --skills "record,query,export"

# Puruto with full IPC
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-reservations \
  --description "Restaurant reservations" \
  --db true \
  --ipc true

# Puruto with agentic tests
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo \
  --description "Demo with Agent-CI" \
  --agent-tests true
```

### Target resolution

The generator creates repos in this preference order:

1. `~/purutos/<name>` if the `~/purutos/` directory exists
2. `../purutos/<name>` relative to CWD, if `../purutos/` exists
3. `<cwd>/<name>` as final fallback

---

## validate.py

Validates that a repo meets the minimum Puruto standard.

```bash
python3 .claude/skills/validate/scripts/validate.py [path] [options]
```

### Options

| Flag | Description |
|---|---|
| `path` | Path to the repo to validate (default: CWD) |
| `--json` | Output in JSON format (for scripting) |

### Examples

```bash
# Validate a specific Puruto
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-finance

# Validate CWD
python3 .claude/skills/validate/scripts/validate.py

# JSON output for scripting
python3 .claude/skills/validate/scripts/validate.py --json

# Validate all repos in ~/purutos/ (shell loop)
for d in ~/purutos/*/; do
  echo "--- $d ---"
  python3 .claude/skills/validate/scripts/validate.py "$d"
done
```

### What it validates

- Presence of `CLAUDE.md` or `agent.md`
- Presence of `README.md`
- Presence of `.env.example`
- Presence of `.gitignore`
- Presence of `.puruto-standard-version`
- `.claude/skills/` directory with the 4 base skills
- Type-specific validations (`puruto-data`, `puruto-telegram`, etc.)

---

## upgrade.py

Migrates a Puruto repo to a newer version of the standard.

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py [path] [options]
```

### Options

| Flag | Description |
|---|---|
| `path` | Path to the repo to migrate (default: CWD) |
| `--plan` | Only shows which migrations would apply (dry-run) |

### Examples

```bash
# See which migrations apply (dry-run)
python3 .claude/skills/upgrade/scripts/upgrade.py --plan ~/purutos/puruto-finance

# Apply migrations
python3 .claude/skills/upgrade/scripts/upgrade.py ~/purutos/puruto-finance

# Migrate CWD
python3 .claude/skills/upgrade/scripts/upgrade.py
```

### Available migrations

| From → To | Changes |
|---|---|
| `legacy → 0.1.0` | Adds `.puruto-standard-version`, normalizes base structure |
| `0.1.0 → 0.2.0` | Adds optional IPC scaffold, `agent.md`, updated skills template |

:::note
`upgrade.py` updates structural artifacts (files and folders). It does not migrate runtime logic or existing data.
:::
