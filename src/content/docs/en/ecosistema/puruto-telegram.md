---
title: puruto-telegram
description: The mobile connector — Telegram bot with deterministic routing by active channel.
sidebar:
  order: 2
---

## What is puruto-telegram?

`puruto-telegram` is the **mobile connector** of the ecosystem. It's a Telegram bot that acts as a router to all your active Purutos, letting you interact with any Puruto from your phone.

:::caution[MVP]
`puruto-telegram` is currently an **MVP scaffold**. The deterministic router and local inbox are implemented. Real Telegram chat delivery is in active development.
:::

## Routing mechanism

Routing is **deterministic based on active channel** — it doesn't use AI to interpret intent. The user explicitly selects which Puruto to talk to:

```
/finance     → activates puruto-finance as active channel
/health      → activates puruto-health as active channel
/status      → shows current active channel
/help        → lists all available channels

"spent $50"  → sent to active channel (puruto-finance)
"went to gym"→ sent to active channel (puruto-health)
```

`puruto-telegram` maintains in its database:

```
user_id  |  active_puruto  |  timestamp
```

## Telegram UX

Leverages Telegram's native mechanisms:

- **Command menu** (`/`): lists all available channels with description. Automatically registered with `setMyCommands`.
- **Persistent Reply Keyboard**: always-visible keyboard with the active channel and quick-switch buttons.

```
┌─────────────────────────────────┐
│  Active channel: 💰 Finance      │
├──────────────┬──────────────────┤
│  🏥 Health   │  📅 Reservations │
└──────────────┴──────────────────┘
```

## Local inbox from puruto-cron

`puruto-telegram` includes a local inbox to receive events from `puruto-cron`:

```
~/purutos/puruto-telegram/
└── inbox/
    └── cron-events.jsonl   ← scheduler events
```

The `inbox.py --deliver` script (MVP scaffold) processes pending events and delivers them to the configured chat.

## Generate and configure

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-telegram
```

Configuration in `.env`:

```bash
PURUTO_TELEGRAM_BOT_TOKEN=your_token_here
PURUTO_TELEGRAM_CHAT_ID=your_chat_id  # ID of your personal chat
```

To get the token: talk to [@BotFather](https://t.me/BotFather) on Telegram.

## Extensibility

Each new Puruto you add to the ecosystem can be registered in `puruto-telegram`. The corresponding command appears automatically in the menu — no code changes, just configuration.
