---
title: Your first Puruto
description: Generate a complete, functional Puruto repo with a single command.
sidebar:
  order: 2
---

## Generate a Puruto with the agent

With the framework loaded in your agent, run:

```
/puruto-generator
```

The generator asks:

1. **Name** — convention `puruto-<name>`, no spaces (e.g. `puruto-notes`)
2. **Description** — one line explaining what it does
3. **Does it need a database?** — local SQLite by default
4. **Additional skills** — list of extra capabilities (e.g. `create,search,export`)

## Or directly via CLI

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-notes \
  --description "Personal notes management" \
  --db true \
  --skills "create,search,export"
```

## Generated structure

```
~/purutos/puruto-notes/
├── CLAUDE.md              ← agent identity and rules
├── agent.md               ← equivalent for Codex/Windsurf/Gemini
├── README.md              ← human documentation
├── .env.example           ← environment variables template
├── .env                   ← local config (not in git)
├── .gitignore
├── .puruto-standard-version
├── db/                    ← local SQLite database
└── .claude/skills/
    ├── init/SKILL.md      ← sets up the environment
    ├── help/SKILL.md      ← usage instructions
    ├── list/SKILL.md      ← lists all features
    ├── status/SKILL.md    ← current state
    ├── create/SKILL.md    ← custom skill
    ├── search/SKILL.md    ← custom skill
    └── export/SKILL.md    ← custom skill
```

## Try it out

```bash
cd ~/purutos/puruto-notes

# With your agent:
/init      ← sets up local environment (creates .env, initializes db)
/help      ← explains how to use it
/list      ← lists all available skills
/status    ← shows current state
```

## Advanced options

### With IPC — delegation between Purutos

Generates the agentic communication runtime between repos:

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-finance \
  --description "Personal finance" \
  --ipc true
```

Adds to the repo:
- `.claude/skills/call/SKILL.md` — `/call` skill to delegate tasks to other Purutos
- `.puruto-ipc.json` — target allowlists and delegation limits
- `ipc.py` + `invoker.py` — local invocation runtime (`InvocationRequest/Result`)

### With Agent-CI — agentic tests

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo-ci \
  --description "Demo with agentic tests" \
  --agent-tests true
```

Generates `tests/agent/` with:
- Declarative test cases in YAML
- Mock runner (no real LLM)
- Optional Ollama adapter for testing with a local model

## Next step

→ [Understand skills](/en/guia/skills/)
