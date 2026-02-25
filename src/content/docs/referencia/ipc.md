---
title: IPC agéntico
description: Comunicación entre Purutos — InvocationRequest, InvocationResult y configuración de .puruto-ipc.json.
sidebar:
  order: 3
---

## ¿Qué es el IPC de Puruto?

El IPC (Inter-Process Communication) agéntico de Puruto permite que un Puruto **delegue tareas a otro Puruto** de forma controlada y trazable.

Un Puruto puede decirle a otro: *"ejecuta esta acción con este prompt"* — y recibir una respuesta estructurada.

## Cómo generarlo

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-reservas \
  --description "Gestión de reservas" \
  --ipc true
```

Esto genera en el repo:
- `.claude/skills/call/SKILL.md` — skill `/call` para invocar otros Purutos
- `.puruto-ipc.json` — allowlists y límites de delegación
- `ipc.py` — emite `InvocationRequest` y recibe `InvocationResult`
- `invoker.py` — scaffold del invocador local

## Contratos

### InvocationRequest

```json
{
  "request_id": "req-20260224-001",
  "correlation_id": "corr-20260224-001",
  "caller": "puruto-reservas",
  "target": "puruto-finanzas",
  "action": "pagar_factura",
  "prompt": "Paga la factura #123 por 50 EUR",
  "timeout_sec": 120,
  "hop": 0
}
```

| Campo | Descripción |
|---|---|
| `request_id` | Identificador único de esta petición |
| `correlation_id` | Traza compartida para llamadas encadenadas |
| `caller` | Puruto que inicia la invocación |
| `target` | Puruto destino |
| `action` | Nombre lógico de la acción |
| `prompt` | Prompt operativo a ejecutar por el target |
| `timeout_sec` | Timeout en segundos |
| `hop` | Profundidad de delegación (0 = primera llamada) |

### InvocationResult

Respuesta exitosa:

```json
{
  "request_id": "req-20260224-001",
  "correlation_id": "corr-20260224-001",
  "status": "ok",
  "duration_ms": 824,
  "result": {
    "summary": "Factura #123 pagada"
  }
}
```

Respuesta con error:

```json
{
  "request_id": "req-20260224-001",
  "correlation_id": "corr-20260224-001",
  "status": "error",
  "duration_ms": 15,
  "error": {
    "code": "DENIED",
    "message": "Target no está en la allowlist",
    "details": null
  }
}
```

### Códigos de error

| Código | Descripción |
|---|---|
| `TARGET_NOT_FOUND` | El Puruto target no existe o no está disponible |
| `DENIED` | El target no está en la allowlist de `allowed_targets` |
| `TIMEOUT` | La ejecución superó `timeout_sec` |
| `INVALID_RESPONSE` | El target no devolvió un `InvocationResult` válido |

## Configuración: .puruto-ipc.json

```json
{
  "allowed_targets": ["puruto-finanzas", "puruto-data"],
  "allowed_actions": {
    "puruto-finanzas": ["pagar_factura", "consultar_saldo"],
    "puruto-data": ["leer", "escribir"]
  },
  "max_hops": 3,
  "default_timeout_sec": 120
}
```

| Campo | Descripción |
|---|---|
| `allowed_targets` | Lista de Purutos a los que se puede delegar |
| `allowed_actions` | Mapa opcional `target → acciones permitidas` |
| `max_hops` | Profundidad máxima de delegación (evita bucles) |
| `default_timeout_sec` | Timeout por defecto para invocaciones |

## La skill /call

```
/call puruto-finanzas pagar_factura "Paga la factura #123 por 50 EUR"
```

La skill `/call` construye el `InvocationRequest`, valida que el target esté en la allowlist, invoca al Puruto target y devuelve el `InvocationResult`.

:::caution
El IPC agéntico es un **MVP**. El scaffold de `ipc.py` e `invoker.py` está implementado; la integración real con el runtime del agente está en desarrollo activo. Las llamadas actuales son locales y síncronas.
:::

## Seguridad y límites

- **Nunca** delegues a un Puruto que no esté en `allowed_targets`
- El campo `max_hops` previene delegaciones circulares
- Si el `hop` llega a `max_hops`, el Puruto rechaza la invocación con `DENIED`
- Los secrets nunca pasan por `InvocationRequest` — usa `puruto-data` para compartir datos sensibles
