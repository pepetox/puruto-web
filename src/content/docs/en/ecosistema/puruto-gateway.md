---
title: puruto-gateway
description: Unified REST API to expose base commands of ecosystem Purutos.
sidebar:
  order: 4
---

## What is puruto-gateway?

`puruto-gateway` is a **local REST API** that exposes the base commands (`init`, `help`, `list`, `status`) of all active Purutos in the ecosystem. Lets you integrate Purutos with scripts, dashboards or external tools without going through the agent.

:::caution[MVP]
`puruto-gateway` is an **MVP scaffold**. The basic generated API is available. Hardened auth, stable contracts and real invoker are pending.
:::

## When to use it

- Integrate Purutos with shell or Python scripts
- Build a simple web dashboard over ecosystem status
- Expose ecosystem status to monitoring tools
- Automate flows that don't require the agent interface

## Generate it

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-gateway
```

## Endpoints (MVP)

```
GET  /purutos                          → lists all available Purutos
GET  /purutos/{name}/status            → status of a Puruto
POST /purutos/{name}/init              → runs /init on a Puruto
GET  /purutos/{name}/list              → runs /list on a Puruto
GET  /purutos/{name}/help              → runs /help on a Puruto
```

Standard response:

```json
{
  "puruto": "puruto-finance",
  "action": "status",
  "status": "ok",
  "result": "..."
}
```

## Architecture

`puruto-gateway` uses `invoker.py` (shared ecosystem scaffold) to invoke each Puruto's commands. The gateway acts as HTTP → agentic IPC proxy.

```
HTTP Client
    ↓
puruto-gateway (FastAPI/Flask)
    ↓
invoker.py
    ↓
puruto-finance / puruto-data / ...
```

## Included skills

- `/init` — starts the local REST server
- `/help` — documents available endpoints
- `/list` — lists which Purutos are registered in the gateway
- `/status` — shows server state and registered Purutos
