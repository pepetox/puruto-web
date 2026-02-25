---
title: Integrar Telegram
description: Cómo preparar puruto-telegram, registrar canales y drenar eventos de puruto-cron en el scaffold MVP.
---

## Qué resuelve esta receta

Montar el conector móvil `puruto-telegram` para:

- configurar el token del bot
- inicializar DB y canales
- registrar un Puruto como canal
- drenar eventos de `puruto-cron` desde el inbox local

## Prerrequisitos

- Framework `puruto/`
- Cuenta de Telegram
- Token de bot de [@BotFather](https://t.me/BotFather)
- (Opcional) `puruto-cron` para probar el flujo de inbox

## Resultado esperado

Al final tendrás:

- `puruto-telegram` inicializado
- token verificado
- uno o más canales registrados
- capacidad de procesar `inbox/cron-events.jsonl` (MVP)

## Paso 1. Genera `puruto-telegram`

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-telegram
```

## Paso 2. Configura `.env`

```bash
cd ~/purutos/puruto-telegram
cp .env.example .env
```

Variables clave del scaffold:

- `PURUTO_TELEGRAM_BOT_TOKEN` (obligatoria)
- `PURUTO_TELEGRAM_DEFAULT_CHAT_ID` (recomendada para `--deliver`)
- `PURUTO_DATA_PATH`
- `DB_PATH`

## Paso 3. Inicializa `puruto-telegram`

### Con agente

Ejecuta:

- `/init`

Según la skill scaffold, `init` hace:

1. Verifica token en `.env`
2. Instala dependencias (`python-telegram-bot`, `python-dotenv`)
3. Inicializa DB local
4. Prepara `.channels.json`
5. Prepara `inbox/`
6. Verifica conectividad con Telegram (`getMe`)

### Sin agente (manual)

Puedes reproducir los pasos del scaffold desde la skill `init` si necesitas depurar.

## Paso 4. Arranca el bot (MVP)

El scaffold de `init` sugiere:

```bash
python3 bot.py
```

## Paso 5. Registra un canal (un Puruto del ecosistema)

Con la skill `/add-channel`:

```text
/add-channel puruto-financial
```

La skill scaffold:

1. verifica que `../puruto-financial` existe
2. registra el canal en DB
3. recuerda reiniciar el bot

### Reinicia el bot para refrescar comandos

```bash
python3 bot.py
```

## Paso 6. Verifica estado

La skill `/status` revisa (según snapshot):

- token configurado o no
- chat por defecto configurado o no
- canales registrados en `.channels.json`
- DB (`db/telegram.db`)
- eventos en `inbox/cron-events.jsonl`

## Paso 7. Drena eventos de `puruto-cron` (MVP)

Si `puruto-cron` escribe eventos al inbox local:

```bash
python3 inbox.py
```

Opciones útiles del scaffold:

```bash
python3 inbox.py --limit 20
python3 inbox.py --deliver
```

`--deliver` requiere:

- `PURUTO_TELEGRAM_BOT_TOKEN`
- `PURUTO_TELEGRAM_DEFAULT_CHAT_ID`

## Problemas comunes

### `PURUTO_TELEGRAM_BOT_TOKEN` no configurado

La skill `init` lo detecta y lo marca como error.

Revisa `.env` y vuelve a ejecutar `init`.

### El canal no aparece en Telegram tras `/add-channel`

La propia skill scaffold indica que debes reiniciar el bot para que se actualicen los comandos.

### `inbox.py --deliver` no envía nada

Revisa:

- `PURUTO_TELEGRAM_DEFAULT_CHAT_ID`
- token válido
- que existan eventos en `inbox/cron-events.jsonl`

## Siguientes pasos

- → [Ejecutar con puruto-cron](/recetas/ejecutar-con-cron/)
- → [`.channels.json` (referencia)](/referencia/config-channels-json/)
- → [puruto-telegram (ecosistema)](/ecosistema/puruto-telegram/)
- → [Seguridad y secretos](/operacion/seguridad-y-secretos/)

## Última verificación

Contenido contrastado con snapshots de `puruto-telegram` y templates `.env.example` del generador el **25 de febrero de 2026**.
