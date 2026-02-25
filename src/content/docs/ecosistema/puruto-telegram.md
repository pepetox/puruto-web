---
title: puruto-telegram
description: El conector móvil del ecosistema — bot Telegram con enrutamiento determinista por canal activo.
sidebar:
  order: 2
---

## ¿Qué es puruto-telegram?

`puruto-telegram` es el **conector móvil del ecosistema**. Es un bot de Telegram con routing determinista por canal activo y un inbox local para eventos del ecosistema (MVP scaffold).

:::caution[MVP]
`puruto-telegram` es actualmente un **MVP scaffold**. El bot, la selección de canal, el estado local y el drenado de inbox están implementados. El enrutamiento real hacia runtimes de Puruto sigue en placeholder en `router.py`.
:::

## Mecanismo de enrutamiento

El enrutamiento es determinista por canal activo. El usuario selecciona explícitamente a qué Puruto hablar:

```
/finanzas    → activa puruto-finanzas como canal activo
/salud       → activa puruto-salud como canal activo
/status      → muestra el canal activo actual
/help        → lista todos los canales disponibles

"gasté 50€"  → se envía al canal activo (puruto-finanzas)
"fui al gym" → se envía al canal activo (puruto-salud)
```

`puruto-telegram` mantiene en su base de datos:

```
user_id  |  puruto_activo  |  timestamp
```

## UX de Telegram (scaffold)

El scaffold implementa:

- comandos base (`/start`, `/list`, `/status`)
- comandos dinámicos por canal (registrados al arrancar, según `.channels.json`)
- reply keyboard para cambio de canal rápido

La forma visual concreta depende del cliente de Telegram; el bot construye un `ReplyKeyboardMarkup` con:

- primera fila: canal activo
- segunda fila: otros canales (hasta 3 botones)

## Inbox local de puruto-cron

`puruto-telegram` incluye un inbox local para recibir eventos de `puruto-cron`:

```
~/purutos/puruto-telegram/
└── inbox/
    └── cron-events.jsonl   ← eventos del scheduler
```

El script `inbox.py --deliver` (scaffold MVP) procesa los eventos pendientes y puede enviarlos al chat configurado (`PURUTO_TELEGRAM_DEFAULT_CHAT_ID`).

## Generarlo y configurarlo

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-telegram
```

Configuración en `.env`:

```bash
PURUTO_TELEGRAM_BOT_TOKEN=tu_token_aqui
PURUTO_TELEGRAM_DEFAULT_CHAT_ID=tu_chat_id  # para inbox.py --deliver (opcional)
```

Para obtener el token: habla con [@BotFather](https://t.me/BotFather) en Telegram.

## Limitación actual del router (MVP)

`router.py` localiza el repo del canal activo, pero hoy devuelve una respuesta placeholder (enrutamiento real pendiente) en lugar de invocar un runtime real del Puruto.

## Extensibilidad

Cada nuevo Puruto que añades al ecosistema se puede registrar en `puruto-telegram` vía `.channels.json` / skill `/add-channel`. Tras reiniciar `bot.py`, el comando del canal queda disponible.

## Ver también

- → [`.channels.json` (referencia)](/referencia/config-channels-json/)
- → [Artefactos runtime locales (MVP)](/referencia/artefactos-runtime-locales/)
- → [Diagnóstico de puruto-telegram](/operacion/diagnostico-puruto-telegram/)
