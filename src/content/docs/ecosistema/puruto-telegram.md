---
title: puruto-telegram
description: El conector móvil del ecosistema — bot Telegram con enrutamiento determinista por canal activo.
sidebar:
  order: 2
---

## ¿Qué es puruto-telegram?

`puruto-telegram` es el **conector móvil del ecosistema**. Es un bot de Telegram que actúa como router hacia todos tus Purutos activos, permitiéndote interactuar con cualquier Puruto desde tu móvil.

:::caution[MVP]
`puruto-telegram` es actualmente un **MVP scaffold**. El router determinista y el inbox local están implementados. La entrega real de mensajes al chat de Telegram está en desarrollo activo.
:::

## Mecanismo de enrutamiento

El enrutamiento es **determinista basado en canal activo** — no usa IA para interpretar intención. El usuario selecciona explícitamente a qué Puruto hablar:

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

## UX de Telegram

Aprovecha los mecanismos nativos de Telegram:

- **Menú de comandos** (`/`): lista todos los canales disponibles con descripción. Se registra automáticamente con `setMyCommands`.
- **Reply Keyboard persistente**: teclado siempre visible con el canal activo y botones de cambio rápido.

```
┌─────────────────────────────────┐
│  Canal activo: 💰 Finanzas       │
├──────────────┬──────────────────┤
│  🏥 Salud    │  📅 Reservas     │
└──────────────┴──────────────────┘
```

## Inbox local de puruto-cron

`puruto-telegram` incluye un inbox local para recibir eventos de `puruto-cron`:

```
~/purutos/puruto-telegram/
└── inbox/
    └── cron-events.jsonl   ← eventos del scheduler
```

El script `inbox.py --deliver` (scaffold MVP) procesa los eventos pendientes y los entrega al chat configurado.

## Generarlo y configurarlo

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-telegram
```

Configuración en `.env`:

```bash
PURUTO_TELEGRAM_BOT_TOKEN=tu_token_aqui
PURUTO_TELEGRAM_CHAT_ID=tu_chat_id  # ID de tu chat personal
```

Para obtener el token: habla con [@BotFather](https://t.me/BotFather) en Telegram.

## Extensibilidad

Cada nuevo Puruto que añades al ecosistema se puede registrar en `puruto-telegram`. El comando correspondiente aparece automáticamente en el menú — sin cambios de código, solo configuración.
