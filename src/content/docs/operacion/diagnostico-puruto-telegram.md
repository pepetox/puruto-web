---
title: Diagnóstico de puruto-telegram
description: Runbook operativo para diagnosticar puruto-telegram (token, canales, DB, inbox local y entrega opcional a Telegram).
---

## Qué cubre esta página

- Flujo de diagnóstico de `puruto-telegram`
- Checks de `.env`, token, `.channels.json`, DB e inbox
- Pruebas de `inbox.py` (`--limit`, `--deliver`)
- Limitaciones del router/invocación en el scaffold MVP

## Alcance

Fuente de verdad:

- templates `telegram/*.py.tpl` del generador
- skills scaffold `init`, `status`, `drain-inbox`, `add-channel`

## Principio de diagnóstico

Separa siempre estos problemas:

1. Configuración del bot (token/chat/env)
2. Catálogo de canales (`.channels.json`)
3. Estado local del bot (DB `db/telegram.db`)
4. Inbox local de `puruto-cron` (`inbox/cron-events.jsonl`)
5. Enrutamiento a Purutos (MVP placeholder en `router.py`)

## Paso 1. Validar estructura del repo

```bash
python3 /Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py /ruta/a/puruto-telegram --json
```

Revisa:

- `kind = "puruto-telegram"`
- `errors = 0`

## Paso 2. Checks base del scaffold (`init`)

La skill `/init` del scaffold sugiere este flujo:

1. verificar `.env` y token
2. instalar dependencias
3. inicializar DB
4. inicializar `.channels.json`
5. preparar `inbox/`
6. verificar conectividad con Telegram

## Paso 3. Verificar token y chat por defecto

Variables clave:

- `PURUTO_TELEGRAM_BOT_TOKEN`
- `PURUTO_TELEGRAM_DEFAULT_CHAT_ID` (para `inbox.py --deliver`)

Comprobación rápida:

```bash
python3 - <<'PY'
import os
from dotenv import load_dotenv
load_dotenv()
print("TOKEN:", "OK" if os.getenv("PURUTO_TELEGRAM_BOT_TOKEN") else "FALTA")
print("DEFAULT_CHAT_ID:", "OK" if os.getenv("PURUTO_TELEGRAM_DEFAULT_CHAT_ID") else "no configurado")
PY
```

## Paso 4. Verificar `.channels.json`

Comprobación rápida:

```bash
python3 - <<'PY'
import json
from pathlib import Path

p = Path(".channels.json")
data = json.loads(p.read_text(encoding="utf-8")) if p.exists() else {"channels": []}
print("channels:", data.get("channels", []))
PY
```

Referencia:

- [`.channels.json` (referencia)](/referencia/config-channels-json/)

## Paso 5. Verificar DB local e inbox

Comprobaciones:

```bash
ls -la db inbox
python3 inbox.py --limit 20
```

`inbox.py` devuelve JSON con:

- `processed`
- `offset`
- `inbox_file`
- `forwarded_log`
- `preview`

## Paso 6. Verificar estado con la skill `status`

La skill scaffold `/status` revisa:

- token
- chat por defecto
- canales registrados
- DB (`db/telegram.db`)
- eventos en `inbox/cron-events.jsonl`

Puedes reproducirlo con:

```bash
python3 -c "
import os, json
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()

token = os.getenv('PURUTO_TELEGRAM_BOT_TOKEN', '')
chat_id = os.getenv('PURUTO_TELEGRAM_DEFAULT_CHAT_ID', '')
f = Path('.channels.json')
channels = json.loads(f.read_text()).get('channels', []) if f.exists() else []
db = Path(os.getenv('DB_PATH', 'db/telegram.db'))
inbox = Path('inbox/cron-events.jsonl')
events = sum(1 for _ in inbox.open('r', encoding='utf-8')) if inbox.exists() else 0

print('── puruto-telegram status ──')
print('  Token:', 'configurado' if token else 'FALTA')
print('  Chat por defecto:', 'configurado' if chat_id else 'no configurado')
print(f'  Canales: {len(channels)} — {channels}')
print('  DB:', 'OK' if db.exists() else 'no inicializada — ejecuta init')
print(f'  Inbox cron: {events} eventos en {inbox}')
"
```

## Paso 7. Probar `--deliver` (opcional)

Comando:

```bash
python3 inbox.py --deliver
```

Requiere:

- `PURUTO_TELEGRAM_BOT_TOKEN`
- `PURUTO_TELEGRAM_DEFAULT_CHAT_ID`

Si no están configuradas, `inbox.py` no falla duro: registra `_delivery.status = "skipped"` en el flujo de envío y cuenta `skipped_delivery`.

## Diagnóstico por síntomas

### El canal no aparece tras `/add-channel`

Revisa:

1. `../<canal>` existe (la skill lo valida)
2. `.channels.json` contiene el canal
3. reiniciaste `python3 bot.py` (necesario para cargar nuevos `CommandHandler`)

### `inbox.py --deliver` no envía nada

Revisa:

1. `PURUTO_TELEGRAM_DEFAULT_CHAT_ID`
2. token válido
3. `inbox/cron-events.jsonl` con eventos

### El bot responde pero no “habla” con el Puruto real

Limitación actual del scaffold:

- `router.py` devuelve un placeholder (`enrutamiento real pendiente de implementar`) en lugar de invocar un runtime real del Puruto

## Checklist de diagnóstico rápido

1. `validate.py` del repo `puruto-telegram` ✅
2. `.channels.json` parsea ✅
3. `db/telegram.db` existe ✅
4. `inbox.py --limit 20` responde ✅
5. `PURUTO_TELEGRAM_BOT_TOKEN` configurado ✅
6. `python3 bot.py` arranca ✅

## Referencias relacionadas

- [`.channels.json` (referencia)](/referencia/config-channels-json/)
- [Artefactos runtime locales (MVP)](/referencia/artefactos-runtime-locales/)
- [Integrar Telegram](/recetas/integrar-telegram/)

## Última verificación

Runbook contrastado con `telegram/bot.py.tpl`, `telegram/inbox.py.tpl`, `telegram/db.py.tpl`, `telegram/router.py.tpl` y skills scaffold de `puruto-telegram` el **25 de febrero de 2026**.
