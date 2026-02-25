---
title: IPC agéntico
description: Comunicación entre Purutos, contrato MVP y configuración validable de .puruto-ipc.json.
sidebar:
  order: 3
---

## ¿Qué es el IPC de Puruto?

El IPC (Inter-Process Communication) agéntico de Puruto permite que un Puruto **delegue tareas a otro Puruto** de forma controlada y trazable.

Un Puruto puede decirle a otro: "ejecuta esta acción con este prompt" y recibir una respuesta estructurada.

## Cómo generarlo

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-reservas \
  --description "Gestión de reservas" \
  --ipc true
```

Esto genera en el repo:

- `.claude/skills/call/SKILL.md` (skill `/call`)
- `.puruto-ipc.json` (allowlists y límites de delegación)
- `ipc.py` (scaffold runtime local)
- `invoker.py` (scaffold invocador)

## Artefactos que deben mantenerse juntos

Si existe `.puruto-ipc.json`, el validador (`validate.py`) espera también:

- `.claude/skills/call/SKILL.md`
- `ipc.py`
- `invoker.py`

Si faltan, puede devolver errores como:

- `missing-ipc-skill`
- `missing-ipc-runtime`

## Contratos (MVP)

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

### Códigos de error (MVP, ejemplo de contrato)

| Código | Descripción |
|---|---|
| `TARGET_NOT_FOUND` | El Puruto target no existe o no está disponible |
| `DENIED` | El target no está en la allowlist |
| `TIMEOUT` | La ejecución superó `timeout_sec` |
| `INVALID_RESPONSE` | El target no devolvió un `InvocationResult` válido |

## Configuración: `.puruto-ipc.json`

### Plantilla generada por defecto (scaffold)

El generador crea esta base (template real):

```json
{
  "enabled": true,
  "owner": "puruto-demo",
  "max_hops": 2,
  "default_timeout_sec": 120,
  "allowed_targets": [],
  "allowed_actions": {}
}
```

Notas:

- `owner` se rellena con el nombre del repo
- `max_hops` por defecto en la plantilla actual es `2`
- `allowed_targets` empieza vacío (deny-by-default)

### Ejemplo operativo con allowlists

```json
{
  "enabled": true,
  "owner": "puruto-reservas",
  "allowed_targets": ["puruto-finanzas", "puruto-data"],
  "allowed_actions": {
    "puruto-finanzas": ["pagar_factura", "consultar_saldo"],
    "puruto-data": ["leer", "escribir"]
  },
  "max_hops": 2,
  "default_timeout_sec": 120
}
```

| Campo | Descripción |
|---|---|
| `enabled` | Activa/desactiva IPC en el repo |
| `owner` | Nombre del Puruto propietario de la configuración |
| `allowed_targets` | Lista de Purutos a los que se puede delegar |
| `allowed_actions` | Mapa opcional `target -> acciones permitidas` |
| `max_hops` | Profundidad máxima de delegación (evita bucles) |
| `default_timeout_sec` | Timeout por defecto para invocaciones |

### Qué valida `validate.py` sobre `.puruto-ipc.json`

El validador actual comprueba:

- que el JSON se pueda parsear (`invalid-ipc-config`)
- presencia recomendada de claves:
  - `enabled`
  - `owner`
  - `max_hops`
  - `default_timeout_sec`
  - `allowed_targets`
  - `allowed_actions`
- tipos:
  - `allowed_targets` debe ser lista
  - `allowed_actions` debe ser objeto JSON

## Ejemplos válidos e inválidos

### Válido (mínimo razonable)

```json
{
  "enabled": true,
  "owner": "puruto-financial",
  "max_hops": 2,
  "default_timeout_sec": 120,
  "allowed_targets": ["puruto-data"],
  "allowed_actions": {
    "puruto-data": ["read", "write"]
  }
}
```

### Inválido (tipos incorrectos)

```json
{
  "enabled": true,
  "owner": "puruto-financial",
  "max_hops": 2,
  "default_timeout_sec": 120,
  "allowed_targets": "puruto-data",
  "allowed_actions": ["read", "write"]
}
```

Esto dispara `ipc-config-invalid-type`.

## La skill `/call`

Ejemplo de uso (documentado por el scaffold):

```text
/call puruto-finanzas pagar_factura "Paga la factura #123 por 50 EUR"
```

La skill scaffold `/call` (visible en snapshots del generador) recuerda:

1. leer `.puruto-ipc.json`
2. comprobar `allowed_targets`
3. respetar `max_hops`
4. incluir `request_id` y `correlation_id`

## Seguridad y límites

- Nunca delegues a un Puruto fuera de `allowed_targets`
- Usa `allowed_actions` para limitar superficie por target
- `max_hops` previene bucles y cadenas largas difíciles de auditar
- No pongas secretos en `InvocationRequest`; usa `puruto-data` para compartir datos sensibles

## Estado actual (MVP)

El IPC agéntico en Puruto está en modo scaffold MVP:

- `ipc.py` e `invoker.py` se generan y sirven de base
- hay contrato recomendado y validación estructural
- la integración completa con runtimes/agentes depende del caso de uso

## Comandos de verificación recomendados

```bash
# Validar estructura IPC + tipos JSON
python3 .claude/skills/validate/scripts/validate.py /ruta/a/tu-puruto --json

# Prueba local del scaffold (si existe ipc.py)
python3 ipc.py --target puruto-data --action read --prompt "Lee el registro"
```

## Siguientes pasos

- → [Seguridad y secretos](/operacion/seguridad-y-secretos/)
- → [Errores y códigos de validación](/referencia/errores-y-codigos/)
- → [Ciclo de vida de una tarea](/conceptos/ciclo-de-vida-de-una-tarea/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/common/.puruto-ipc.json.tpl`, `validate.py` y snapshots IPC del generador el **25 de febrero de 2026**.
