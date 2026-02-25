---
title: Agentic IPC
description: Communication between Purutos — InvocationRequest, InvocationResult and .puruto-ipc.json configuration.
sidebar:
  order: 3
---

## What is Puruto IPC?

Puruto's agentic IPC (Inter-Process Communication) allows one Puruto to **delegate tasks to another Puruto** in a controlled and traceable way.

One Puruto can tell another: *"execute this action with this prompt"* — and receive a structured response.

## How to generate it

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-reservations \
  --description "Reservation management" \
  --ipc true
```

This generates in the repo:
- `.claude/skills/call/SKILL.md` — `/call` skill to invoke other Purutos
- `.puruto-ipc.json` — allowlists and delegation limits
- `ipc.py` — emits `InvocationRequest` and receives `InvocationResult`
- `invoker.py` — local invoker scaffold

## Contracts

### InvocationRequest

```json
{
  "request_id": "req-20260224-001",
  "correlation_id": "corr-20260224-001",
  "caller": "puruto-reservations",
  "target": "puruto-finance",
  "action": "pay_invoice",
  "prompt": "Pay invoice #123 for 50 EUR",
  "timeout_sec": 120,
  "hop": 0
}
```

| Field | Description |
|---|---|
| `request_id` | Unique identifier for this request |
| `correlation_id` | Shared trace for chained calls |
| `caller` | Puruto initiating the invocation |
| `target` | Target Puruto |
| `action` | Logical name of the action |
| `prompt` | Operative prompt to be executed by the target |
| `timeout_sec` | Timeout in seconds |
| `hop` | Delegation depth (0 = first call) |

### InvocationResult

Successful response:

```json
{
  "request_id": "req-20260224-001",
  "correlation_id": "corr-20260224-001",
  "status": "ok",
  "duration_ms": 824,
  "result": {
    "summary": "Invoice #123 paid"
  }
}
```

Error response:

```json
{
  "request_id": "req-20260224-001",
  "correlation_id": "corr-20260224-001",
  "status": "error",
  "duration_ms": 15,
  "error": {
    "code": "DENIED",
    "message": "Target not in allowlist",
    "details": null
  }
}
```

### Error codes

| Code | Description |
|---|---|
| `TARGET_NOT_FOUND` | Target Puruto doesn't exist or isn't available |
| `DENIED` | Target is not in the `allowed_targets` allowlist |
| `TIMEOUT` | Execution exceeded `timeout_sec` |
| `INVALID_RESPONSE` | Target didn't return a valid `InvocationResult` |

## Configuration: .puruto-ipc.json

```json
{
  "allowed_targets": ["puruto-finance", "puruto-data"],
  "allowed_actions": {
    "puruto-finance": ["pay_invoice", "check_balance"],
    "puruto-data": ["read", "write"]
  },
  "max_hops": 3,
  "default_timeout_sec": 120
}
```

| Field | Description |
|---|---|
| `allowed_targets` | List of Purutos that can be delegated to |
| `allowed_actions` | Optional map `target → allowed actions` |
| `max_hops` | Maximum delegation depth (prevents loops) |
| `default_timeout_sec` | Default timeout for invocations |

## The /call skill

```
/call puruto-finance pay_invoice "Pay invoice #123 for 50 EUR"
```

The `/call` skill builds the `InvocationRequest`, validates that the target is in the allowlist, invokes the target Puruto and returns the `InvocationResult`.

:::caution
Agentic IPC is an **MVP**. The `ipc.py` and `invoker.py` scaffold is implemented; real integration with the agent runtime is in active development. Current calls are local and synchronous.
:::

## Security and limits

- **Never** delegate to a Puruto not in `allowed_targets`
- The `max_hops` field prevents circular delegations
- If `hop` reaches `max_hops`, the Puruto rejects the invocation with `DENIED`
- Secrets never pass through `InvocationRequest` — use `puruto-data` to share sensitive data
