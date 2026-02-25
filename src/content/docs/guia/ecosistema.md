---
title: El ecosistema
description: Cómo conviven los Purutos en ~/purutos/ y para qué sirve cada repo especial.
sidebar:
  order: 4
---

## Estructura del ecosistema

Todos los Purutos conviven en `~/purutos/`. Cada carpeta es un **repo git independiente**:

```
~/purutos/
├── puruto-data/          ← bóveda privada de datos (OBLIGATORIO)
├── puruto-telegram/      ← conector móvil (opcional)
├── puruto-cron/          ← scheduler local (opcional)
├── puruto-gateway/       ← API REST local (opcional)
├── puruto-finanzas/      ← tu app de finanzas
├── puruto-salud/         ← tu app de salud
└── puruto-notas/         ← tu app de notas
```

:::note
La carpeta `~/purutos/` **no es un repo git** — es solo un directorio de trabajo. Cada Puruto tiene su propio `.git` y se gestiona de forma independiente.
:::

## puruto-data — la bóveda de datos

`puruto-data` es el **repo central de almacenamiento** del ecosistema. Ningún Puruto escribe directamente en la carpeta de otro — todos pasan por `puruto-data`.

```
~/purutos/puruto-data/
├── CLAUDE.md              ← reglas de acceso y gestión
├── finanzas/              ← datos propiedad de puruto-finanzas
├── salud/                 ← datos propiedad de puruto-salud
├── notas/                 ← datos propiedad de puruto-notas
└── shared/                ← datos cross-dominio (acceso controlado)
```

Cada Puruto lo encuentra en `../puruto-data/` por defecto, o mediante `PURUTO_DATA_PATH` en su `.env`.

:::tip
`puruto-data` es un Puruto completo — implementa `init`, `help`, `list` y `status`. Puedes preguntarle directamente sobre tus datos sin abrir el Puruto específico.
:::

## puruto-telegram — el conector móvil

`puruto-telegram` es un bot de Telegram que actúa como **router determinista** hacia todos tus Purutos. El enrutamiento no usa IA — se basa en un "canal activo" por usuario:

```
/finanzas    → activa puruto-finanzas como canal activo
/salud       → activa puruto-salud como canal activo

"gasté 50€"  → se envía a puruto-finanzas (canal activo)
"fui al gym" → se envía a puruto-salud (canal activo)
```

El teclado persistente de Telegram muestra siempre el canal activo y permite cambiar rápido.

:::caution
`puruto-telegram` es actualmente un **MVP scaffold**. El router determinista y el inbox local están implementados; la entrega real al chat de Telegram está en desarrollo.
:::

## puruto-cron — el scheduler local

`puruto-cron` gestiona **jobs asíncronos** del ecosistema. Usa SQLite para persistencia y soporta:

- Programación de jobs con cron expressions
- Lease/lock para evitar ejecuciones duplicadas
- Retries por job con backoff
- Outbox JSONL opcional para notificar a `puruto-telegram`

:::caution
`puruto-cron` es un **MVP scaffold**. El scheduler básico con SQLite está operativo; el invoker real y la política de retries avanzada están en I+D.
:::

## puruto-gateway — la API REST

`puruto-gateway` expone los **comandos base** (`init`, `help`, `list`, `status`) de todos los Purutos activos a través de una API REST local. Útil para integrar Purutos con herramientas externas o scripts.

:::caution
`puruto-gateway` es un **MVP scaffold**. La API básica está generada; auth endurecida y contratos estables están pendientes.
:::

## /workspace — el punto de entrada único

La skill `/workspace` (del framework) te permite **orquestar todos tus Purutos desde un único punto de entrada**. Sin tener que cargar cada repo por separado:

```
/workspace                  → lista todos los Purutos en ~/purutos/
/workspace puruto-finanzas  → activa y habla con puruto-finanzas
/workspace status           → muestra el estado de todo el ecosistema
```

## Generación de repos especiales

```bash
# Repos especiales del ecosistema
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-data
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-telegram
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-cron
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-gateway
```

O simplemente ejecuta `/init` que los genera todos de una vez.
