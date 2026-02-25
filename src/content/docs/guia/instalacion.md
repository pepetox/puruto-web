---
title: Instalación
description: Prepara tu entorno Puruto desde cero en modo agente o en modo CLI.
sidebar:
  order: 2
---

## Antes de empezar

Lee primero:

- → [Requisitos](/guia/requisitos/)
- → [Agentes y modelos](/conceptos/agentes-y-modelos/)

:::note
Los pasos con `/init` requieren un agente compatible con `SKILL.md`. Si todavía no lo tienes, puedes usar el generador por CLI y volver luego al modo agente.
:::

## 1. Clona el framework

```bash
git clone https://github.com/pepetox/puruto.git
cd puruto
```

## 2. Instala las dependencias

El único requisito del framework es Jinja2 (para renderizar los templates del generador):

```bash
pip install jinja2
```

## 3. Inicializa el ecosistema

Abre el repo en tu agente y ejecuta:

```
/init
```

La skill `/init` crea automáticamente:

```
~/purutos/
├── puruto-data/       ← bóveda de datos privada
├── puruto-telegram/   ← conector Telegram (MVP scaffold)
├── puruto-cron/       ← scheduler local (MVP scaffold)
└── puruto-gateway/    ← API REST local (MVP scaffold)
```

:::tip
Si quieres empezar solo con lo mínimo, `/init` acepta generar únicamente `puruto-data`. Los demás repos puedes añadirlos cuando los necesites con `/puruto-generator`.
:::

## 4. Verifica la instalación

```bash
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-data
```

Deberías ver `✓ Puruto válido` si todo ha ido bien.

### Alternativa: crear un Puruto por CLI (sin agente)

Si aún no tienes agente compatible, puedes validar el framework generando un repo de prueba:

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo \
  --description "Puruto de ejemplo"
```

Después valida el repo generado:

```bash
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-demo
```

## Variables de entorno

Copia el `.env.example` del framework para configurar rutas del ecosistema:

```bash
cp .env.example .env
```

Variables principales:

| Variable | Descripción | Por defecto |
|---|---|---|
| `PURUTO_DATA_PATH` | Ruta a `puruto-data` | `../puruto-data/` |
| `PURUTO_TELEGRAM_BOT_TOKEN` | Token del bot de Telegram | *(vacío)* |

## Siguiente paso

→ [Crea tu primer Puruto](/guia/primer-puruto/)
