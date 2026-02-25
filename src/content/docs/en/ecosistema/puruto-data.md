---
title: puruto-data
description: The private data vault of the Puruto ecosystem.
sidebar:
  order: 1
---

## What is puruto-data?

`puruto-data` is the **central storage repository** of the Puruto ecosystem. All Purutos in the ecosystem read and write their data here — never in each other's folders.

It's a complete Puruto (implements `init`, `help`, `list`, `status`) and acts as the guardian of data access for the ecosystem.

## When do you need it?

- When you have **more than one Puruto** sharing data
- When you want a single query point for your personal data
- When you need data to persist even if you move or reinstall a Puruto

If you only have one Puruto, it can store its data locally in `db/`. When the ecosystem grows, centralizing in `puruto-data` is the natural solution.

## Generate it

```bash
# With /init (generates the entire ecosystem at once)
/init

# Or only puruto-data
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-data
```

## Structure

```
~/purutos/puruto-data/
├── CLAUDE.md              ← access rules and data management
├── agent.md
├── README.md
├── .env.example
├── .env
├── .puruto-standard-version
├── db/                    ← internal vault management
└── .claude/skills/
    ├── init/SKILL.md
    ├── help/SKILL.md
    ├── list/SKILL.md
    ├── status/SKILL.md
    ├── read/SKILL.md      ← read data from a Puruto
    ├── write/SKILL.md     ← write/update data
    └── list-data/SKILL.md ← list available data
```

Each Puruto's data is stored in its own subfolder:

```
~/purutos/puruto-data/
├── finance/               ← data owned by puruto-finance
├── health/                ← data owned by puruto-health
├── notes/                 ← data owned by puruto-notes
└── shared/                ← cross-domain data (controlled access)
```

## How other Purutos find it

Each Puruto looks for `puruto-data` in this order:

1. Path specified in `PURUTO_DATA_PATH` in the Puruto's `.env`
2. `../puruto-data/` relative to the Puruto's directory (co-location convention)

```bash
# In any Puruto's .env:
PURUTO_DATA_PATH=../puruto-data/   # default
# or with absolute path:
PURUTO_DATA_PATH=/home/user/purutos/puruto-data/
```

## Access policy

- Each Puruto only writes to **its own folder** (`data/<puruto-name>/`)
- Access to `shared/` is open to all Purutos in the ecosystem
- `puruto-data` is never published in the marketplace — it's a **private** repo by design

:::danger
`puruto-data` contains your personal data. **Never** make it public or upload it to a public GitHub repository.
:::
