---
title: Frequently Asked Questions
description: Answers to the most common questions about the Puruto framework.
---

## Does Puruto only work with Claude Code?

No. The SKILL.md format is an **open standard** adopted in December 2025 by Gemini CLI, Codex/ChatGPT and Windsurf. A Puruto generated with the framework works without modification on any of these agents.

Puruto is not tied to Anthropic or any specific AI provider.

---

## Do I need an Anthropic/Google/OpenAI account?

You just need **one** of the compatible agents installed (Claude Code, Gemini CLI, Codex or Windsurf). Puruto itself doesn't require an account with any service.

---

## What's the difference between "the Puruto framework" and "a Puruto"?

| | Puruto (framework) | A Puruto (app) |
|---|---|---|
| **What it is** | The tool that creates and manages Purutos | A repo that follows the Puruto standard |
| **Main skill** | `puruto-generator`, `validate`, `upgrade` | Its own domain skills |
| **Who uses it** | The developer creating apps | The end user via the agent |
| **Is it public** | Yes (this repo) | Depends on the author |

---

## Do I need internet to use Puruto?

No. The entire ecosystem is local:
- `puruto-data` stores data on your machine
- The code agent runs locally (or in your subscription, but without Puruto data)
- `puruto-cron` uses local SQLite

`puruto-telegram` does require internet to connect to the Telegram API if you use it.

---

## Can I use Puruto with local models (Ollama)?

It's an **active R&D line**. Basic functionality is possible if the local model supports a CLI interface and can read `CLAUDE.md` / `agent.md`. Full compatibility is not guaranteed and depends on the model's tool capabilities.

---

## How do I migrate an old Puruto to the new standard?

With the migration script:

```bash
# See what would change (dry-run)
python3 .claude/skills/upgrade/scripts/upgrade.py --plan ~/purutos/my-puruto

# Apply the migration
python3 .claude/skills/upgrade/scripts/upgrade.py ~/purutos/my-puruto
```

Or with the `/upgrade` skill from the agent.

---

## Is puruto-data mandatory?

Not technically. Each Puruto can store its data in its own `db/`.

But if you have more than one Puruto in the ecosystem, `puruto-data` is strongly recommended: it avoids data duplication, centralizes access and simplifies backups.

---

## How many Purutos can I have in the ecosystem?

No technical limit. The ecosystem is designed to grow. `/workspace` lets you orchestrate all Purutos from a single entry point regardless of how many there are.

---

## Can I publish my Purutos?

Yes. Any Puruto can be published on GitHub as a public repo. The only Puruto that **should not be published** is `puruto-data`, since it contains your personal data.

The Puruto marketplace is on the roadmap as part of the framework's Phase 2.

---

## Why is it called Puruto?

**プルト** (Puruto) is the Japanese phonetic adaptation of "Pluto". The reference is to something small but with its own ecosystem — just like the dwarf planet has its moon Charon and its peculiar atmosphere.

It also plays well with Japanese storytelling: kanji for "rapid sprouting" or "application germination".

---

## Why skills in SKILL.md instead of a normal CLI?

The SKILL.md format has key advantages over a conventional CLI:

1. **No installation required**: the agent reads the file directly — no `pip install`, no `npm install`
2. **Universal**: works on all compatible agents without adaptation
3. **The repo is the app**: logic, documentation and agent instructions live together in the same file
4. **Evolvable**: changing behavior is changing Markdown text, not recompiling code

---

## How do I contribute to the framework?

Open a PR at [github.com/pepetox/puruto](https://github.com/pepetox/puruto). Before making large changes, review `puruto-plan.md` to understand the design decisions made.

If you change the generator, templates or validations, also update `README.md`, `CLAUDE.md`, `CHANGELOG.md` and the affected tests — CI checks this automatically.
