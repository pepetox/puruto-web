---
title: Glosario
description: Términos clave del framework Puruto, su ecosistema y la operación diaria de repos agénticos.
sidebar:
  order: 7
---

## Alcance

Glosario práctico para evitar ambigüedades en la documentación de Puruto.

## Términos clave

### Puruto (framework)

El repo/framework que genera, valida y migra Purutos.

Incluye skills como:

- `/init`
- `/puruto-generator`
- `/validate`
- `/upgrade`

### Un Puruto (app)

Un repositorio que sigue el estándar Puruto (skills, `CLAUDE.md`/`agent.md`, `.env.example`, etc.).

### Estándar Puruto

Contrato mínimo de estructura e interfaz que hace que un repo sea “un Puruto”.

Incluye especialmente:

- skills base `init`, `help`, `list`, `status`
- artefactos mínimos (`README.md`, `.env.example`, `.claude/skills/`)

### Skill (`SKILL.md`)

Unidad de capacidad/instrucción agéntica descrita en Markdown con frontmatter YAML.

Define:

- cuándo usarla
- qué hace
- (opcionalmente) qué comandos ejecutar

### Agente compatible

Herramienta que puede:

- leer `CLAUDE.md`/`agent.md`
- interpretar `SKILL.md`
- ejecutar comandos/scripts del repo

Ejemplos mencionados en la docs del proyecto: Claude Code, Codex, Gemini CLI, Windsurf.

### Modelo

LLM subyacente usado por el agente. Puruto no se integra directamente con esta capa.

### Modo agente

Uso de Puruto mediante skills/slash commands en un agente compatible.

### Modo CLI

Uso directo de scripts del framework (`generate.py`, `validate.py`, `upgrade.py`) sin agente.

### Ecosistema `~/purutos/`

Conjunto de repos Puruto co-localizados en una carpeta de trabajo local.

### `puruto-data`

Puruto especial usado como bóveda/registro de datos del ecosistema.

### `puruto-telegram`

Puruto especial que actúa como conector móvil vía Telegram.

### `puruto-cron`

Puruto especial para scheduling local de jobs asíncronos.

### `puruto-gateway`

Puruto especial que expone una API REST local (MVP scaffold) para comandos base.

### Scaffold

Código/estructura generada automáticamente por `puruto-generator` como base funcional.

### Placeholder

Marcador temporal (por ejemplo `__FOO__`) en templates que debe quedar reemplazado al generar.

El framework incluye una guardia para detectar placeholders no resueltos.

### `validate.py`

Script del framework que valida estructura y consistencia mínima de un repo Puruto.

### `upgrade.py`

Script del framework que migra artefactos de un repo Puruto entre versiones del estándar soportadas.

### `.puruto-standard-version`

Fichero con la versión declarada del estándar de un Puruto. Muy útil para migraciones.

### IPC agéntico

Mecanismo MVP de delegación controlada entre Purutos con `.puruto-ipc.json`, `/call`, `ipc.py` e `invoker.py`.

### Allowlist

Lista explícita de targets/acciones permitidos para delegación IPC (`allowed_targets`, `allowed_actions`).

### `InvocationRequest`

Contrato JSON de solicitud de invocación entre Purutos.

### `InvocationResult`

Contrato JSON de respuesta estructurada (éxito/error) de una invocación.

### `correlation_id`

Identificador compartido para trazar una tarea a través de múltiples invocaciones.

### `hop` / `max_hops`

Profundidad actual y límite de delegación para evitar bucles o cadenas excesivas.

### Guardias de sincronización

Checks de CI que exigen actualizar docs/tests cuando cambian superficies críticas del framework.

## Siguientes pasos

- → [Qué es Puruto](/conceptos/que-es-puruto/)
- → [Contratos runtime (MVP)](/referencia/contratos-runtime/)
- → [Errores y códigos de validación](/referencia/errores-y-codigos/)

## Última verificación

Glosario derivado de `README.md`, `CLAUDE.md`, `puruto-plan.md`, `validate.py`, `upgrade.py` y docs del sitio el **25 de febrero de 2026**.
