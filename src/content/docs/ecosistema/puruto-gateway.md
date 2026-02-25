---
title: puruto-gateway
description: API REST unificada para exponer los comandos base de los Purutos del ecosistema.
sidebar:
  order: 4
---

## ¿Qué es puruto-gateway?

`puruto-gateway` es una **API REST local** que expone los comandos base (`init`, `help`, `list`, `status`) de todos los Purutos activos del ecosistema. Permite integrar Purutos con scripts, dashboards o herramientas externas sin pasar por el agente.

:::caution[MVP]
`puruto-gateway` es un **MVP scaffold**. La API básica generada está disponible. Auth endurecida, contratos estables e invoker real están pendientes.
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

```
GET  /purutos                          → lista todos los Purutos disponibles
GET  /purutos/{nombre}/status          → status de un Puruto
POST /purutos/{nombre}/init            → ejecuta /init en un Puruto
GET  /purutos/{nombre}/list            → ejecuta /list en un Puruto
GET  /purutos/{nombre}/help            → ejecuta /help en un Puruto
```

Respuesta estándar:

```json
{
  "puruto": "puruto-finanzas",
  "action": "status",
  "status": "ok",
  "result": "..."
}
```

## Arquitectura

`puruto-gateway` usa `invoker.py` (scaffold compartido del ecosistema) para invocar los comandos de cada Puruto. El gateway actúa como proxy HTTP → IPC agéntico.

```
Cliente HTTP
    ↓
puruto-gateway (FastAPI/Flask)
    ↓
invoker.py
    ↓
puruto-finanzas / puruto-data / ...
```

## Skills incluidas

- `/init` — levanta el servidor REST local
- `/help` — documenta los endpoints disponibles
- `/list` — lista qué Purutos están registrados en el gateway
- `/status` — muestra el estado del servidor y los Purutos registrados
