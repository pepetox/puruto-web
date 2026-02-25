---
title: Modelo de ejecución
description: Cómo encajan framework, agente, repos Puruto, runtime local y ecosistema en el flujo real de trabajo.
---

## Qué cubre esta página

- Las capas reales de ejecución de Puruto
- Diferencia entre framework y app Puruto
- Flujo de generación, validación y uso
- Dónde aparecen IPC, migraciones y repos del ecosistema

## Resumen ejecutivo

Puruto es un **scaffolder + estándar**, no un runner.

El framework:

- genera repos con estructura y skills,
- valida estructura y contratos mínimos,
- migra artefactos entre versiones del estándar.

El **agente** (Claude/Codex/Gemini CLI/Windsurf u otro compatible) es quien interpreta las skills y ejecuta el trabajo sobre el repo.

## Capas del sistema (práctico)

### 1. Framework Puruto (repo `puruto/`)

Responsabilidades:

- generar repos (`generate.py` / `/puruto-generator`)
- validar estándar (`validate.py` / `/validate`)
- migrar estructura (`upgrade.py` / `/upgrade`)
- bootstrap del ecosistema (`/init`)

No ejecuta por sí mismo “la app final” del usuario.

### 2. Agente de código (externo al framework)

Responsabilidades:

- leer `CLAUDE.md` / `agent.md`
- interpretar skills `SKILL.md`
- invocar comandos/scripts
- mantener contexto operativo del repo

Sin agente, puedes usar el framework por CLI, pero pierdes la interfaz agéntica.

### 3. Repo Puruto generado (tu app)

Es el artefacto principal que vas a desarrollar/usar.

Incluye:

- identidad del agente (`CLAUDE.md`, `agent.md`)
- skills del Puruto
- `.env.example`
- README
- opcionalmente DB local, IPC, tests agénticos

### 4. Runtime local del Puruto

Aquí viven:

- Python y dependencias reales
- bases de datos SQLite
- tokens y rutas en `.env`
- scripts/runtime del Puruto generado

Muchos fallos de “ejecución” ocurren aquí, no en el framework.

### 5. Ecosistema `~/purutos/` (opcional pero central)

Puruto favorece una estructura de repos independientes co-localizados:

- `puruto-data`
- `puruto-telegram`
- `puruto-cron`
- `puruto-gateway`
- tus Purutos de dominio

Cada repo mantiene su git y su configuración local.

## Flujo de ejecución típico (de extremo a extremo)

1. Trabajas en el framework `puruto/`
2. Generas un repo Puruto (agente o CLI)
3. Validas estructura con `validate.py`
4. Abres/operas el repo generado con tu agente
5. Si el estándar cambia, migras con `upgrade.py`
6. Integras con otros Purutos del ecosistema (si aplica)

## Dónde encaja IPC (delegación)

IPC no es obligatorio.

Solo aparece cuando generas un Puruto estándar con `--ipc true`, lo que añade:

- `.claude/skills/call/SKILL.md`
- `.puruto-ipc.json`
- `ipc.py`
- `invoker.py`

El validador comprueba consistencia entre esos artefactos.

## Dónde encaja Agent-CI

Agent-CI también es opcional (`--agent-tests true`) y añade scaffolds de `tests/agent/`.

Esto forma parte del **repo generado**, no del runtime central del framework.

## Qué problemas resuelve este modelo

- Portabilidad entre agentes compatibles con `SKILL.md`
- Repos con contrato mínimo consistente (`init`, `help`, `list`, `status`)
- Validación estructural explícita
- Evolución del estándar con migraciones controladas

## Qué problemas no resuelve por sí solo

- Hosting cloud del runtime
- Orquestación global de LLMs
- Gestión universal de secretos/proveedores
- Compatibilidad total con customizaciones locales fuera del estándar

## Siguientes pasos

- → [Qué es Puruto](/conceptos/que-es-puruto/)
- → [Agentes y modelos](/conceptos/agentes-y-modelos/)
- → [Primer ejemplo funcional](/guia/primer-ejemplo-funcional/)
- → [Actualización y migraciones](/operacion/actualizacion-y-migraciones/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/README.md`, `/Users/pepetox/Documents/01-code/puruto/CLAUDE.md` y `/Users/pepetox/Documents/01-code/puruto/puruto-plan.md` el **25 de febrero de 2026**.
