---
title: Contratos runtime (MVP)
description: Contratos JSON y semántica mínima para invocación local entre Purutos (InvocationRequest/InvocationResult).
sidebar:
  order: 6
---

## Alcance

Esta referencia documenta los contratos runtime MVP para delegación entre Purutos:

- `InvocationRequest`
- `InvocationResult`

Fuente de verdad:

- `/Users/pepetox/Documents/01-code/puruto/puruto-plan.md` (sección de contratos runtime)
- snapshots del scaffold IPC (`standard_ipc_full.txt`)

## Qué problema resuelven

Permiten representar una invocación entre Purutos de forma:

- estructurada
- trazable
- validable por humanos
- portable entre scaffolds/runtimes futuros

## `InvocationRequest` (MVP)

Solicitud estructurada de invocación.

```json
{
  "request_id": "req-20260224-001",
  "correlation_id": "corr-20260224-001",
  "caller": "puruto-reservations",
  "target": "puruto-financial",
  "action": "pay_invoice",
  "prompt": "Paga la factura #123 por 50 EUR",
  "timeout_sec": 120,
  "hop": 0
}
```

### Campos

| Campo | Tipo (MVP) | Significado |
|---|---|---|
| `request_id` | string | Identificador único de la petición |
| `correlation_id` | string | Traza compartida para llamadas encadenadas |
| `caller` | string | Puruto que inicia la invocación |
| `target` | string | Puruto destino |
| `action` | string | Acción lógica solicitada al target |
| `prompt` | string | Instrucción operativa para el target |
| `timeout_sec` | int | Timeout solicitado |
| `hop` | int | Profundidad de delegación (0 = primera llamada) |

### Campos mínimos recomendados

Según `puruto-plan.md`, los mínimos recomendados son:

- `request_id`
- `correlation_id`
- `caller`
- `target`
- `action`
- `prompt`

## `InvocationResult` (MVP)

Respuesta estructurada del target.

### Éxito

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

### Error

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

### Campos clave

| Campo | Significado |
|---|---|
| `status` | `ok` o `error` |
| `duration_ms` | Tiempo de ejecución observado |
| `result` | Payload de éxito (forma libre en MVP) |
| `error.code` | Código de error |
| `error.message` | Mensaje legible |
| `error.details` | Información opcional adicional |

## Códigos de error reservados (MVP)

Definidos en `puruto-plan.md` como base del contrato:

- `TARGET_NOT_FOUND`
- `DENIED`
- `TIMEOUT`
- `INVALID_RESPONSE`

En el scaffold local (`ipc.py` de snapshots) también aparece:

- `IPC_ERROR` (error genérico de ejecución/cliente IPC local)

## Semántica operativa recomendada

### `request_id`

- único por invocación
- útil para trazabilidad puntual

### `correlation_id`

- se comparte entre llamadas encadenadas
- útil para seguir una tarea que atraviesa varios Purutos

### `hop`

- empieza en `0`
- se incrementa cuando hay delegación adicional
- se compara contra `max_hops` para evitar bucles/cadenas excesivas

### `timeout_sec`

- puede venir del request
- si no, el scaffold IPC usa `default_timeout_sec` de `.puruto-ipc.json`

## Relación con `.puruto-ipc.json`

El contrato runtime se gobierna con:

- `allowed_targets`
- `allowed_actions`
- `max_hops`
- `default_timeout_sec`

Referencia relacionada:

- [IPC agéntico](/referencia/ipc/)

## Scaffold local (qué hay hoy)

En snapshots del generador (`standard_ipc_full.txt`):

- `invoker.py` expone CLI local y construye request/response
- `ipc.py` valida allowlists y serializa salida JSON

Ejemplo de CLI scaffold (`ipc.py`):

```bash
python3 ipc.py --target puruto-data --action read --prompt "Lee el registro"
```

## Límites del contrato MVP

- `result` no está fuertemente tipado (payload libre)
- no hay firma/criptografía nativa en el contrato
- no hay trazas distribuidas completas de fábrica
- el runtime real depende del Puruto y del agente

## Recomendaciones de diseño

1. Mantén `result` compacto y explícito (`summary`, IDs, estado)
2. Usa `correlation_id` en flujos largos
3. No metas secretos en `prompt` ni `error.details`
4. Devuelve errores estructurados, no texto libre únicamente

## Siguientes pasos

- → [IPC agéntico](/referencia/ipc/)
- → [Receta IPC entre Purutos](/recetas/ipc-entre-purutos/)
- → [Seguridad y secretos](/operacion/seguridad-y-secretos/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/puruto-plan.md` y snapshots IPC del generador el **25 de febrero de 2026**.
