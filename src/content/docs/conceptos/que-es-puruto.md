---
title: Qué es Puruto
description: Qué resuelve Puruto, qué no resuelve y cómo encaja con tu agente de código.
---

## Qué cubre esta página

- Qué es Puruto y qué problema resuelve.
- Qué piezas forman parte del framework y cuáles no.
- Cómo encaja en un flujo real con Claude, Codex u otros agentes compatibles.

## Resumen corto

Puruto es un **framework para crear repositorios agénticos**. Define una estructura, unas skills y unos artefactos mínimos para que un agente de código pueda entender y operar una app desde el propio repositorio.

La idea central es:

> **El repositorio es la aplicación.**

## Qué sí es Puruto

- Un **estándar de empaquetado** para apps agénticas (skills, identidad, env, estructura).
- Un **framework generador** que crea repos Puruto funcionales desde plantillas.
- Un conjunto de **skills del framework** (`/init`, `/puruto-generator`, `/validate`, `/upgrade`) para bootstrap, generación y mantenimiento.
- Un **ecosistema local** de repos cooperando en `~/purutos/` (por ejemplo `puruto-data`, `puruto-telegram`, `puruto-cron`, `puruto-gateway`).

## Qué no es Puruto

- No es un modelo LLM.
- No es un runner de agentes.
- No sustituye a Claude Code, Codex, Gemini CLI, Windsurf u otro cliente equivalente.
- No elimina las dependencias de runtime de los repos generados (por ejemplo Telegram, si ejecutas `puruto-telegram`).

## Arquitectura conceptual (mínima)

Puruto funciona con 4 piezas:

1. **Framework Puruto** (este repo)
2. **Agente de código** compatible con `SKILL.md` (Claude/Codex/etc.)
3. **Repos Puruto generados** (tu app real)
4. **Runtime local** (Python, librerías, SQLite, variables de entorno)

Si falta la pieza 2, Puruto sigue siendo útil, pero usarás principalmente los scripts CLI del framework en lugar de comandos tipo `/init`.

## Dos modos de uso reales

### Modo agente (recomendado)

Usas el framework dentro de un agente compatible con skills:

- `/init`
- `/puruto-generator`
- `/validate`
- `/upgrade`

Este modo es el más productivo porque aprovecha `CLAUDE.md`, `agent.md` y las skills como interfaz de trabajo.

### Modo CLI (sin agente)

Puedes usar scripts Python directamente:

- `generate.py`
- `validate.py`
- `upgrade.py`

Esto permite automatizar en CI, scripts o terminal puro, aunque pierdes la UX de skills/slash commands.

## Cuándo usar Puruto

- Quieres que tu app agéntica viva en un repo **portable** y entendible por varios agentes.
- Quieres **scaffolds funcionales** en vez de plantillas vacías.
- Quieres un estándar repetible para generar repos con skills, env y estructura mínima.
- Quieres componer varios repos Puruto en un ecosistema local.

## Cuándo no usar Puruto

- Solo necesitas un script suelto o un proyecto no agéntico.
- No quieres mantener estructura estándar ni skills.
- Buscas un orquestador cloud/hosted de LLMs (Puruto no cubre esa capa).

## Siguientes pasos

- → [Agentes y modelos](/conceptos/agentes-y-modelos/)
- → [Requisitos](/guia/requisitos/)
- → [Instalación](/guia/instalacion/)
- → [Tu primer Puruto](/guia/primer-puruto/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/README.md` y `/Users/pepetox/Documents/01-code/puruto/CLAUDE.md` el **25 de febrero de 2026**.
