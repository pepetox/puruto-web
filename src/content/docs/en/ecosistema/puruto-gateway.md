---
title: puruto-gateway
description: Unified REST API to expose base commands of ecosystem Purutos.
sidebar:
  order: 4
---

## What is puruto-gateway?

`puruto-gateway` is a **local REST API** (FastAPI scaffold) for discovering ecosystem Purutos and exposing base commands over HTTP. It lets you integrate Purutos with scripts, dashboards or external tools without going through the agent.

:::caution[MVP]
`puruto-gateway` is an **MVP scaffold**. Discovery and basic endpoints exist, but hardened auth, stable contracts and a real invoker are still pending.
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

```text
GET  /health
GET  /purutos
GET  /purutos/{name}
POST /purutos/{name}/{command}   # command ∈ {init, help, list, status}
```

Typical discovery response:

```json
{
  "status": "ok",
  "count": 1,
  "items": [
    {
      "name": "puruto-data",
      "path": "/path/to/puruto-data",
      "kind": "puruto-data",
      "commands": ["init", "help", "list", "status"]
    }
  ]
}
```

:::caution[Known template limitation]
In the current `routes.py` template, `POST /purutos/{name}/{command}` has a naming collision with the imported `invoke_base_command` helper, so treat it as experimental until the scaffold is fixed.
:::

## Architecture

`puruto-gateway` uses `invoker.py` (shared ecosystem scaffold) to build invocations. The gateway acts as HTTP -> local invoker (stub in the MVP).

```
HTTP Client
    ↓
puruto-gateway (FastAPI)
    ↓
invoker.py
    ↓
puruto-finance / puruto-data / ...
```

## Auth (MVP)

Endpoints under `/purutos*` require:

- `X-API-Key` header
- `PURUTO_GATEWAY_API_KEY` configured

## See also

- [Gateway API (MVP)](/referencia/gateway-api-mvp/)
- [Diagnosing puruto-gateway](/operacion/diagnostico-puruto-gateway/)

## Included skills

- `/init` — starts the local REST server
- `/help` — documents available endpoints
- `/list` — lists which Purutos are registered in the gateway
- `/status` — shows server state and registered Purutos
