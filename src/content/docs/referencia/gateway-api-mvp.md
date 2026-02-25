---
title: Gateway API (MVP)
description: Referencia de la API REST de puruto-gateway (FastAPI scaffold), incluyendo auth, discovery, endpoints y limitaciones conocidas.
---

## Qué cubre esta página

- Endpoints reales del scaffold `puruto-gateway`
- Autenticación por API key (`X-API-Key`)
- Formato de respuestas y errores HTTP
- Discovery de Purutos (`registry.py`)
- Limitaciones conocidas del template MVP

## Alcance

Fuente de verdad:

- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/gateway/routes.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/gateway/auth.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/gateway/registry.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/gateway/app.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/common/invoker.py.tpl`

## Arquitectura (MVP scaffold)

- Framework HTTP: `FastAPI`
- Auth: header `X-API-Key`
- Discovery de repos:
  - desde `PURUTO_DATA_PATH/registry.json` (si existe)
  - o descubrimiento local de repos `puruto-*` en el directorio padre
- Invocación: `invoker.py` scaffold común (respuesta stub)

## Configuración mínima

Variables relevantes:

- `PURUTO_GATEWAY_API_KEY` (obligatoria para endpoints protegidos)
- `PURUTO_GATEWAY_HOST` (default `127.0.0.1`)
- `PURUTO_GATEWAY_PORT` (default `8787`)
- `PURUTO_DATA_PATH` (opcional, para discovery por registro)

## Auth (`X-API-Key`)

El gateway protege endpoints de negocio con:

- header `X-API-Key`

### Comportamiento

- `503 Service Unavailable` si falta `PURUTO_GATEWAY_API_KEY`
- `401 Unauthorized` si `X-API-Key` falta o no coincide

### Ejemplo

```bash
curl -H "X-API-Key: $PURUTO_GATEWAY_API_KEY" http://127.0.0.1:8787/purutos
```

## Endpoints reales (routes.py scaffold)

## `GET /health`

No requiere API key.

Respuesta:

```json
{
  "status": "ok",
  "service": "puruto-gateway"
}
```

## `GET /purutos`

Requiere API key.

Respuesta:

```json
{
  "status": "ok",
  "count": 2,
  "items": [
    {
      "name": "puruto-data",
      "path": "/ruta/puruto-data",
      "kind": "puruto-data",
      "commands": ["init", "help", "list", "status"]
    }
  ]
}
```

## `GET /purutos/{name}`

Requiere API key.

### `200 OK`

```json
{
  "status": "ok",
  "item": {
    "name": "puruto-cron",
    "path": "/ruta/puruto-cron",
    "kind": "puruto-cron",
    "commands": ["init", "help", "list", "status"]
  }
}
```

### `404 Not Found`

`detail = "Puruto no encontrado"`

## `POST /purutos/{name}/{command}`

Requiere API key.

Comandos permitidos (scaffold actual):

- `init`
- `help`
- `list`
- `status`

Body JSON opcional:

```json
{
  "any": "payload"
}
```

### `400 Bad Request`

Si `command` no está en allowlist:

- `detail = "Comando no permitido ..."`

### `404 Not Found`

Si el Puruto no existe:

- `detail = "Puruto no encontrado"`

### Respuesta prevista (intención del scaffold)

La intención del route handler es devolver un payload tipo:

```json
{
  "status": "accepted",
  "target": "puruto-data",
  "command": "status",
  "payload": {},
  "invocation": {
    "request_id": "req-...",
    "correlation_id": "corr-...",
    "status": "ok",
    "duration_ms": 0,
    "result": {
      "stub": true,
      "echo": {
        "target": "puruto-data",
        "action": "status"
      }
    }
  }
}
```

## Discovery de Purutos (`registry.py`)

## Prioridad de discovery

1. `PURUTO_DATA_PATH/registry.json` (si existe y parsea)
2. descubrimiento local de repos `puruto-*` en el directorio padre del gateway

## Forma normalizada por item

`registry.py` normaliza cada Puruto a:

```json
{
  "name": "puruto-financial",
  "path": "/ruta/puruto-financial",
  "kind": "standard",
  "commands": ["init", "help", "list", "status"]
}
```

Notas:

- `kind` se infiere por nombre si no viene en `registry.json`
- `commands` usa defaults si no vienen declarados

## Limitación conocida (template MVP, importante)

:::caution
En el template actual de `routes.py`, el handler `POST /purutos/{name}/{command}` define una función llamada `invoke_base_command` con el mismo nombre que el helper importado desde `invoker.py`.

Eso crea una colisión de nombres y puede romper la invocación del helper (el handler termina llamándose a sí mismo por nombre).
:::

Implicación práctica:

- `GET /health`, `GET /purutos`, `GET /purutos/{name}` son útiles para discovery/status
- el endpoint `POST /purutos/{name}/{command}` debe considerarse **experimental** hasta corregir el template

## Recomendaciones de uso (MVP)

1. Usa el gateway primero para discovery/status del ecosistema
2. Protege siempre el servicio con `PURUTO_GATEWAY_API_KEY`
3. No expongas el puerto fuera de localhost sin reverse proxy y auth más fuerte
4. Trata la respuesta de `invocation` como contrato stub (no runtime final)

## Referencias relacionadas

- [puruto-gateway (ecosistema)](/ecosistema/puruto-gateway/)
- [Contratos runtime (MVP)](/referencia/contratos-runtime/)
- [Seguridad y secretos](/operacion/seguridad-y-secretos/)

## Última verificación

Contenido contrastado con templates `gateway/*` y `common/invoker.py.tpl` del generador el **25 de febrero de 2026**.
