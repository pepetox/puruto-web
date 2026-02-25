---
title: Configuración mínima
description: Configura lo imprescindible para empezar a usar Puruto sin bloquearte con detalles opcionales.
sidebar:
  order: 3
---

## Qué cubre esta página

- La configuración mínima para empezar con el framework Puruto.
- Qué archivos debes crear/editar primero.
- Qué puedes dejar para más tarde.

## Resultado esperado

Al terminar:

- tendrás el repo del framework listo para generar Purutos,
- sabrás qué variables son realmente necesarias al principio,
- y podrás validar un repo generado sin configurar todavía todo el ecosistema.

## Configuración mínima del framework (lo imprescindible)

En el repo del framework (`puruto/`) necesitas:

1. Python 3.10+
2. `Jinja2` instalado
3. Un `.env` local (opcional al inicio, pero recomendado)

### Paso 1. Instala Jinja2

```bash
python3 -m pip install jinja2
```

### Paso 2. Crea `.env` desde el ejemplo (recomendado)

```bash
cp .env.example .env
```

:::note
Puedes empezar sin rellenar nada en `.env` si solo quieres generar y validar repos. Algunas integraciones (por ejemplo Telegram) requerirán configuración adicional más adelante.
:::

## Variables mínimas (práctica)

Según `/Users/pepetox/Documents/01-code/puruto/.env.example`, las variables de referencia principales del framework son:

| Variable | Cuándo la necesitas | Notas |
|---|---|---|
| `PURUTO_DATA_PATH` | Cuando trabajas con el ecosistema local (`puruto-data`) | Si no la defines, se usa la ruta por defecto del scaffold/entorno |
| `PURUTO_TELEGRAM_BOT_TOKEN` | Solo si vas a ejecutar `puruto-telegram` | Se configura en el repo `puruto-telegram`, no en todos los Purutos |

## Qué configuración NO necesitas al principio

Puedes posponer todo esto hasta que tengas un caso real:

- Token de Telegram
- Configuración IPC (`.puruto-ipc.json`) si no usas `--ipc true`
- Agent-CI / adaptadores de tests agénticos (`--agent-tests true`)
- Ajustes de migración (`upgrade.py`) si todavía no estás migrando repos antiguos

## Configuración mínima de un Puruto generado

Un Puruto recién generado ya incluye lo básico:

- `CLAUDE.md` y/o `agent.md`
- `.env.example`
- `.claude/skills/`
- `README.md`

Tu primer ajuste manual suele ser:

```bash
cd ~/purutos/puruto-demo
cp .env.example .env
```

Y después ejecutar la skill `/init` (modo agente) o validar por CLI.

## Checklist de configuración mínima

1. `python3 --version` >= `3.10`
2. `python3 -m pip install jinja2` ejecutado
3. `cp .env.example .env` en el framework (recomendado)
4. Decidido si usarás modo agente o modo CLI

## Siguientes pasos

- → [Verificar instalación](/guia/verificar-instalacion/)
- → [Tu primer Puruto](/guia/primer-puruto/)
- → [Referencia de configuración](/referencia/config-completa/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/.env.example` y `/Users/pepetox/Documents/01-code/puruto/README.md` el **25 de febrero de 2026**.
