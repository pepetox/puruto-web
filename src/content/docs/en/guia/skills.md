---
title: Skills
description: What Puruto skills are, the SKILL.md format, and how to add your own.
sidebar:
  order: 3
---

## What is a skill?

A skill is a **capability you give your Puruto**. Each skill lives in a `SKILL.md` file inside `.claude/skills/<name>/`.

When the agent loads the repo, it reads all available skills and knows exactly what it can do and how.

## The SKILL.md format

```markdown
---
name: my-skill
description: Does X specific thing
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
---

# Agent instructions

When the user invokes this skill:

1. Step one
2. Step two
3. Step three

## Usage examples

...
```

### Frontmatter fields

| Field | Type | Description |
|---|---|---|
| `name` | string | Skill identifier (no spaces) |
| `description` | string | One-line description for the agent |
| `user-invocable` | boolean | Whether the user can invoke it with `/<name>` |
| `allowed-tools` | list | Tools the agent can use |

:::note
The SKILL.md format is an **open standard** since December 2025, adopted by Gemini CLI, Codex/ChatGPT and Windsurf. A skill written for Claude Code works without modification on all compatible agents.
:::

## The 4 mandatory skills

Every Puruto implements these four base skills. The generator creates them automatically:

### `/init`

Sets up the Puruto's local environment:
- Creates required directories (`db/`, logs, etc.)
- Generates `.env` from `.env.example` if it doesn't exist
- Initializes SQLite database if applicable
- Installs repo Python dependencies

### `/help`

Explains how to interact with the Puruto:
- Describes the Puruto's purpose
- Lists main commands with examples
- States prerequisites and required configuration

### `/list`

Lists all available features:
- Enumerates all skills with their description
- Indicates which skills are user-invocable
- Shows if any skills require prior configuration

### `/status`

Shows the Puruto's current state:
- Loaded configuration (`.env` present, required variables)
- Database state (connected, size, last access)
- Active connections (APIs, bots, external services)
- Implemented standard version

## Adding custom skills

### 1. Create the skill directory

```bash
mkdir -p .claude/skills/my-skill
```

### 2. Write the SKILL.md

```bash
cat > .claude/skills/my-skill/SKILL.md << 'EOF'
---
name: my-skill
description: Processes a CSV file and generates a summary
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
---

# my-skill

When the user invokes `/my-skill`:

1. Ask for the CSV path if not specified
2. Read the file and analyze columns
3. Generate a summary with basic statistics
4. Save the summary in `db/summary-<date>.md`

Respond with a natural language summary of the data found.
EOF
```

### 3. Register the skill in your agent

Reload the repo in your agent. The new skill appears automatically in `/list` and is available with `/<name>`.

## Framework special skills

In addition to the mandatory ones, the framework generates these optional skills:

| Skill | Flag | Description |
|---|---|---|
| `/call` | `--ipc true` | Delegate tasks to other Purutos in the ecosystem |
| `/workspace` | (framework) | Orchestrate all Purutos in `~/purutos/` |
| `/validate` | (framework) | Validate that a repo meets the standard |
| `/upgrade` | (framework) | Migrate a Puruto to a newer version |

## Next step

→ [The Puruto ecosystem](/en/guia/ecosistema/)
