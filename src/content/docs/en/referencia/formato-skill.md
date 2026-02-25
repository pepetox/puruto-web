---
title: SKILL.md format
description: Specification of the SKILL.md format — the open standard for code agent skills.
sidebar:
  order: 2
---

## What is SKILL.md?

SKILL.md is the **standard format for defining code agent skills**. Published by Anthropic as an open standard in December 2025, it's currently compatible with:

- Claude Code
- Gemini CLI
- Codex / ChatGPT
- Windsurf

A skill written in SKILL.md works without modification on all these agents.

## Structure of a SKILL.md file

```markdown
---
name: skill-name
description: One-line description for the agent
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

# Agent instructions

The body content contains the instructions the agent follows
when executing this skill. Write them in natural Markdown.

## When to use this skill

Define in what context the agent should activate this skill.

## Execution steps

1. First step
2. Second step
3. Third step

## Examples

\```bash
# Usage example
/skill-name argument
\```
```

## Frontmatter fields

### `name` (required)

Skill identifier. No spaces or special characters. Used to invoke it with `/<name>`.

```yaml
name: process-csv
```

### `description` (required)

One-line description. The agent uses it to decide if this skill is relevant for the current task.

```yaml
description: Processes a CSV file and generates basic statistics
```

### `user-invocable` (required)

If `true`, the user can explicitly invoke the skill with `/<name>`. If `false`, the agent can use it internally but the user doesn't invoke it directly.

```yaml
user-invocable: true
```

### `allowed-tools` (optional)

List of tools the agent can use when executing this skill. If omitted, the agent uses the default tools available in the environment.

```yaml
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
```

## Skill location

A Puruto's skills live in `.claude/skills/<name>/SKILL.md`:

```
.claude/
└── skills/
    ├── init/
    │   └── SKILL.md
    ├── help/
    │   └── SKILL.md
    └── my-skill/
        ├── SKILL.md
        └── scripts/      ← helper scripts (optional)
            └── helper.py
```

## Best practices

### Clear, executable instructions

Write instructions in imperative form, as if speaking directly to the agent:

```markdown
# Good
When the user invokes this skill:
1. Read the specified file
2. Validate the JSON format
3. Display a summary of the fields

# Bad
This skill is for reading files and displaying information about them.
```

### One responsibility per skill

Each skill does one specific thing. If a skill does too much, split it into several.

### Document parameters

If the skill accepts arguments, document them explicitly:

```markdown
## Parameters

- `--path <path>` — path to the file to process (required)
- `--format json|csv` — output format (default: json)
```

### Include usage examples

```markdown
## Examples

\```
/my-skill --path data/file.csv
/my-skill --path data/file.csv --format json
\```
```
