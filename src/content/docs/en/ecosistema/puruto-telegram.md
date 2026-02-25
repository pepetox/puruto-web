---
title: puruto-telegram
description: The mobile connector — Telegram bot with deterministic routing by active channel.
sidebar:
  order: 2
---

## What is puruto-telegram?

`puruto-telegram` is the **mobile connector** of the ecosystem. It is a Telegram bot with deterministic routing by active channel and a local inbox for ecosystem events (MVP scaffold).

:::caution[MVP]
`puruto-telegram` is currently an **MVP scaffold**. The bot, channel selection, local status, and inbox draining are implemented. Real routing into Puruto runtimes is still a placeholder in `router.py`.
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

## Telegram UX (scaffold)

The scaffold implements:

- base commands (`/start`, `/list`, `/status`)
- dynamic per-channel commands (registered at startup from `.channels.json`)
- reply keyboard for quick channel switching

The exact UI depends on the Telegram client. The bot builds a `ReplyKeyboardMarkup` with:

- first row: active channel
- second row: other channels (up to 3 buttons)

## Local inbox from puruto-cron

`puruto-telegram` includes a local inbox to receive events from `puruto-cron`:

```
~/purutos/puruto-telegram/
└── inbox/
    └── cron-events.jsonl   ← scheduler events
```

The `inbox.py --deliver` script (MVP scaffold) processes pending events and can send them to the configured chat (`PURUTO_TELEGRAM_DEFAULT_CHAT_ID`).

## Generate and configure

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-telegram
```

Configuration in `.env`:

```bash
PURUTO_TELEGRAM_BOT_TOKEN=your_token_here
PURUTO_TELEGRAM_DEFAULT_CHAT_ID=your_chat_id  # optional, used by inbox.py --deliver
```

To get the token: talk to [@BotFather](https://t.me/BotFather) on Telegram.

## Current router limitation (MVP)

`router.py` locates the active channel's repo, but currently returns a placeholder response instead of invoking a real Puruto runtime.

## Extensibility

Each new Puruto can be registered via `.channels.json` / `/add-channel`. After restarting `bot.py`, the channel command becomes available.

## See also

- [`.channels.json` reference](/referencia/config-channels-json/)
- [Local runtime artifacts (MVP)](/referencia/artefactos-runtime-locales/)
- [Diagnosing puruto-telegram](/operacion/diagnostico-puruto-telegram/)
