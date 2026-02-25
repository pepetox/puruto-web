---
title: Variables de entorno
description: Referencia de variables del framework Puruto y de los Purutos generados por tipo de plantilla.
sidebar:
  order: 4
---

## Alcance

Esta página documenta variables de entorno en:

1. el **framework** (`puruto/`)
2. los **Purutos generados** (según plantilla: standard, data, telegram, cron, gateway)

Fuente de verdad usada:

- `/Users/pepetox/Documents/01-code/puruto/.env.example`
- templates `.env.example.tpl` del generador en `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/`

## Convención general

- `.env.example` se versiona
- `.env` se mantiene local
- no se suben secretos al repositorio

## Framework Puruto (`puruto/.env.example`)

Variables de referencia del ecosistema:

| Variable | Significado | Nota |
|---|---|---|
| `PURUTO_DATA_PATH` | Ruta a `puruto-data` | Referencia del ecosistema local |
| `PURUTO_TELEGRAM_BOT_TOKEN` | Token de Telegram | El comentario indica configurarlo en `~/purutos/puruto-telegram/.env` |

## Puruto estándar (template `standard/.env.example.tpl`)

Variables posibles:

| Variable | Cuándo aparece | Descripción |
|---|---|---|
| `PURUTO_DATA_PATH` | Siempre (comentada) | Ruta a la bóveda `puruto-data` |
| `DB_PATH` | Solo si generas con `--db true` | Ruta de la BD SQLite local (`db/data.db`) |

:::note
`DB_PATH` se renderiza condicionalmente en la plantilla (`{% if has_db %}`), así que no aparece si generas el repo sin base de datos.
:::

## `puruto-data` (template `data/.env.example.tpl`)

| Variable | Descripción |
|---|---|
| `MAX_SIZE_MB` | Tamaño máximo por Puruto en MB (`0 = sin límite`) |

## `puruto-telegram` (template `telegram/.env.example.tpl`)

| Variable | Descripción | Comentario |
|---|---|---|
| `PURUTO_TELEGRAM_BOT_TOKEN` | Token del bot de Telegram | Es la variable principal y aparece no comentada (vacía) |
| `PURUTO_TELEGRAM_DEFAULT_CHAT_ID` | Chat por defecto para notificaciones drenadas | Opcional |
| `PURUTO_DATA_PATH` | Ruta a `puruto-data` | Integración con bóveda compartida |
| `DB_PATH` | Ruta de la BD local | Por defecto sugerido `db/telegram.db` |

## `puruto-cron` (template `cron/.env.example.tpl`)

| Variable | Descripción | Valor sugerido |
|---|---|---|
| `DB_PATH` | Ruta de la BD SQLite de `puruto-cron` | `db/cron.db` |
| `PURUTO_CRON_POLL_SECONDS` | Polling del scheduler (s) | `30` |
| `PURUTO_CRON_LEASE_SECONDS` | Duración del lease/lock por job (s) | `120` |
| `PURUTO_DATA_PATH` | Ruta a `puruto-data` | `../puruto-data` |
| `PURUTO_TELEGRAM_PATH` | Ruta al repo `puruto-telegram` | `../puruto-telegram` |
| `PURUTO_TELEGRAM_OUTBOX_FILE` | Fichero outbox local para eventos | `inbox/cron-events.jsonl` |

## `puruto-gateway` (template `gateway/.env.example.tpl`)

| Variable | Descripción | Valor sugerido |
|---|---|---|
| `PURUTO_GATEWAY_API_KEY` | API key esperada en `X-API-Key` | `changeme` (placeholder) |
| `PURUTO_GATEWAY_HOST` | Bind local del gateway | `127.0.0.1` |
| `PURUTO_GATEWAY_PORT` | Puerto del gateway | `8787` |
| `PURUTO_DATA_PATH` | Ruta opcional a `puruto-data` | `../puruto-data` |

## Buenas prácticas (operativas)

1. Mantén `.env.example` completo y sin secretos.
2. Documenta valores por defecto reales en comentarios.
3. Valida con `status` (si el Puruto lo implementa con checks de env/rutas).
4. Si cambias variables en templates del framework, sincroniza docs/tests del repo `puruto`.

## Problemas comunes

### Variable existe en docs pero no en mi repo generado

Revisa:

- tipo de Puruto (`standard`, `telegram`, `cron`, etc.)
- flags usados al generar (`--db`, `--ipc`, `--agent-tests`)
- versión del estándar (`.puruto-standard-version`)

### `PURUTO_TELEGRAM_BOT_TOKEN` configurada en el sitio incorrecto

En el framework aparece como referencia, pero el comentario indica que la configuración efectiva del bot va en el repo `puruto-telegram`.

## Siguientes pasos

- → [Configuración (referencia)](/referencia/config-completa/)
- → [Errores y códigos de validación](/referencia/errores-y-codigos/)
- → [Actualización y migraciones](/operacion/actualizacion-y-migraciones/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/.env.example` y los templates `.env.example.tpl` del generador el **25 de febrero de 2026**.
