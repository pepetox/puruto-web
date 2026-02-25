---
title: puruto-gateway
description: API REST unificada para exponer los comandos base de los Purutos del ecosistema.
sidebar:
  order: 4
---

## ¿Qué es puruto-gateway?

`puruto-gateway` es una **API REST local** (FastAPI scaffold) para descubrir Purutos del ecosistema y exponer comandos base por HTTP. Permite integrar Purutos con scripts, dashboards o herramientas externas sin pasar por el agente.

:::caution[MVP]
`puruto-gateway` es un **MVP scaffold**. Discovery y endpoints básicos existen, pero auth endurecida, contratos estables e invoker real siguen pendientes.
:::

## Cuándo usarlo

- Integrar Purutos con scripts de shell o Python
- Construir un dashboard web simple sobre el estado del ecosistema
- Exponer el status del ecosistema a herramientas de monitorización
- Automatizar flujos que no requieren la interfaz del agente

## Generarlo

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

Respuesta típica de discovery:

```json
{
  "status": "ok",
  "count": 1,
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

:::caution[Limitación conocida del template MVP]
En el template actual de `routes.py`, el endpoint `POST /purutos/{name}/{command}` tiene una colisión de nombre con el helper importado `invoke_base_command`, por lo que debe considerarse **experimental** hasta corregir el scaffold.
:::

## Arquitectura

`puruto-gateway` usa `invoker.py` (scaffold compartido del ecosistema) para construir invocaciones. El gateway actúa como proxy HTTP → invoker local (stub en el MVP).

```
Cliente HTTP
    ↓
puruto-gateway (FastAPI)
    ↓
invoker.py
    ↓
puruto-finanzas / puruto-data / ...
```

## Auth (MVP)

Los endpoints `/purutos*` requieren:

- header `X-API-Key`
- variable `PURUTO_GATEWAY_API_KEY` configurada

## Ver también

- → [Gateway API (MVP)](/referencia/gateway-api-mvp/)
- → [Seguridad y secretos](/operacion/seguridad-y-secretos/)

## Skills incluidas

- `/init` — levanta el servidor REST local
- `/help` — documenta los endpoints disponibles
- `/list` — lista qué Purutos están registrados en el gateway
- `/status` — muestra el estado del servidor y los Purutos registrados
