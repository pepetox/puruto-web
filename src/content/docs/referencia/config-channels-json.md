---
title: .channels.json (referencia)
description: Contrato práctico de .channels.json en puruto-telegram (canales registrados), semántica del bot y relación con db/telegram.db.
---

## Qué cubre esta página

- Formato de `.channels.json` en `puruto-telegram`
- Cómo lo usa el bot (`bot.py`) y la DB (`db.py`)
- Semántica de registro/eliminación de canales
- Límites del scaffold MVP

## Alcance

Fuente de verdad:

- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/telegram/.channels.json.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/telegram/db.py.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/telegram/bot.py.tpl`

## Estructura raíz

El fichero debe ser un JSON objeto con una lista `channels`:

```json
{
  "channels": []
}
```

## Ejemplo

```json
{
  "channels": [
    "puruto-financial",
    "puruto-health",
    "puruto-data"
  ]
}
```

## Qué representa

`channels[]` es la lista de Purutos que el bot puede exponer como canales conversacionales.

Se usa para:

- comandos dinámicos (`/puruto-financial`, `/puruto-health`, etc.)
- teclado de selección de canal
- validación de cambios de canal en mensajes

## Relación con `db/telegram.db`

Hay dos piezas distintas:

- `.channels.json`: catálogo de canales disponibles (config declarativa)
- `db/telegram.db`: canal activo por usuario (`active_channels`)

No son equivalentes.

## Cómo lo usa el scaffold

## `db.py`

- `get_all_channels()` lee `.channels.json`
- `register_channel(name)` añade el nombre si no existe (sin duplicado exacto)
- `remove_channel(name)` reescribe la lista sin ese canal

## `bot.py`

Al arrancar:

- carga `channels = get_all_channels()`
- registra `CommandHandler(channel, ...)` para cada canal

Implicación importante:

- si cambias `.channels.json`, debes reiniciar `python3 bot.py` para que el bot cargue los nuevos comandos

## Reglas prácticas del contenido

- elementos de `channels[]` deben ser strings
- lo normal es usar nombres de repos del ecosistema (`puruto-*`)
- el orden de la lista afecta al orden visual en `/list` y al teclado (tras el canal activo)

## Ejemplo de flujo (scaffold)

1. Añades canal (`register_channel` o skill `/add-channel`)
2. `.channels.json` se actualiza
3. Reinicias el bot
4. El bot expone el nuevo comando `/<canal>`

## Limitaciones del MVP

- no hay validación JSON/schema estricta de `.channels.json`
- `get_all_channels()` hace `json.loads(...).get("channels", [])` sin validación de tipos
- si el archivo está corrupto, puede fallar al arrancar el bot

## Errores comunes

### El canal no aparece en Telegram

Revisa:

- que el canal esté en `.channels.json`
- que reiniciaste `python3 bot.py`
- que el nombre coincide exactamente con el registrado

### El bot arranca pero no enruta al Puruto esperado

Revisa:

- canal activo del usuario (DB)
- nombre del canal vs nombre de repo real
- `PURUTO_DATA_PATH` / estructura del ecosistema en `router.py`

## Buenas prácticas

1. Usa nombres de canal iguales al nombre del repo (`puruto-foo`)
2. Mantén `.channels.json` en control de versiones si es configuración compartida
3. Reinicia el bot tras cambios de canales
4. Valida JSON antes de editar manualmente

## Referencias relacionadas

- [Integrar Telegram](/recetas/integrar-telegram/)
- [Artefactos runtime locales (MVP)](/referencia/artefactos-runtime-locales/)
- [puruto-telegram (ecosistema)](/ecosistema/puruto-telegram/)

## Última verificación

Contenido contrastado con `.channels.json.tpl`, `db.py.tpl` y `bot.py.tpl` del scaffold `puruto-telegram` el **25 de febrero de 2026**.
