---
title: Ciclo de vida de una tarea
description: Cómo fluye una tarea en Puruto desde la entrada del usuario hasta el resultado, con y sin delegación IPC.
---

## Qué cubre esta página

- El flujo real de una tarea en un Puruto
- Diferencias entre ejecución por agente y por CLI
- Dónde encajan skills, `.env`, runtime local, IPC y ecosistema
- Qué puntos conviene validar cuando algo falla

## Resumen

En Puruto, una tarea no “la ejecuta el framework”.

La ejecución pasa por esta secuencia:

1. **Entrada** (usuario, `puruto-cron`, `puruto-telegram` o script)
2. **Selección de comando/skill**
3. **Lectura de reglas del repo** (`CLAUDE.md`, `agent.md`, `SKILL.md`)
4. **Ejecución de comandos/scripts**
5. **Lectura/escritura de estado local** (`.env`, DB, ficheros)
6. **Resultado** (respuesta al usuario, artefactos, notificaciones)

## Flujo base (modo agente)

### 1. El usuario pide una acción

Ejemplos:

- `init`
- `status`
- `list`
- una skill de dominio (`/ingest`, `/report`)

En `puruto-telegram`, la entrada puede venir desde un chat. En `puruto-cron`, desde un job programado.

### 2. El agente identifica la skill adecuada

El agente se apoya en:

- `CLAUDE.md` / `agent.md`
- descripción de la skill en `SKILL.md`
- reglas y comandos sugeridos en la propia skill

Esto se ve en los snapshots generados por el framework (`tests/text_snapshots/*.txt`), donde cada skill define frontmatter y pipeline.

### 3. La skill ejecuta su pipeline

Ejemplos reales de pipelines scaffold:

- `init` en un Puruto estándar: verifica `.env`, crea carpetas, inicializa DB (si aplica)
- `status`: inspecciona `.env`, rutas (`PURUTO_DATA_PATH`) y DB
- `puruto-cron/init`: `init-db`, `sync-jobs`, `status`
- `puruto-telegram/init`: verifica token, instala deps, crea DB y prepara inbox

## Flujo base (modo CLI)

Cuando trabajas sin agente, el ciclo se simplifica:

1. Ejecutas `generate.py`, `validate.py` o `upgrade.py`
2. El script lee archivos y parámetros
3. Escribe/valida artefactos
4. Devuelve salida humana o JSON

No hay interpretación de skills, pero sí se mantiene el contrato estructural del repo.

## Dónde aparecen los estados y artefactos

### Configuración

- `.env.example` (plantilla)
- `.env` (runtime local)
- `.puruto-standard-version` (versión del estándar)
- `.puruto-ipc.json` (si hay delegación IPC)

### Estructura funcional

- `.claude/skills/`
- `README.md`
- `CLAUDE.md` / `agent.md`

### Runtime local (según tipo)

- `db/` (SQLite)
- `runs/`, `notifications/` en `puruto-cron`
- `inbox/` y `.channels.json` en `puruto-telegram`

## Ciclo de vida con IPC (delegación)

Si el Puruto se generó con `--ipc true`, la tarea puede incluir una delegación:

1. La skill `/call` lee `.puruto-ipc.json`
2. Verifica `allowed_targets`, `allowed_actions`, `max_hops`
3. Construye `InvocationRequest`
4. Usa `ipc.py` / `invoker.py` (scaffold)
5. Recibe `InvocationResult`
6. Devuelve resumen o error (`DENIED`, `TIMEOUT`, etc.)

El validador (`validate.py`) comprueba consistencia estructural de estos artefactos.

## Ciclo de vida en `puruto-cron`

Resumen de flujo (MVP scaffold):

1. El job se declara en `.jobs.json`
2. `sync-jobs` lo persiste en SQLite
3. El scheduler determina próximas ejecuciones
4. `run-now` o scheduler dispara ejecución
5. Se generan artefactos/notificaciones (según runtime)
6. Opcionalmente se replica a `puruto-telegram` vía outbox/inbox local

## Ciclo de vida en `puruto-telegram`

Resumen de flujo (MVP scaffold):

1. Usuario envía comando/mensaje
2. `puruto-telegram` resuelve canal activo
3. Enruta al Puruto destino (router determinista)
4. Mantiene estado local (canales/DB)
5. Puede drenar eventos de `puruto-cron` desde `inbox/cron-events.jsonl`

## Puntos de control (para depurar)

Cuando una tarea falla, comprueba en este orden:

1. `validate.py --json` (estructura del repo)
2. `.env` y variables necesarias
3. artefactos del tipo de repo (DB, inbox, jobs, etc.)
4. versión del estándar (`.puruto-standard-version`)
5. `upgrade.py --plan` si el repo es antiguo
6. configuración del agente (si el problema es de skills/slash commands)

## Qué aporta este modelo

- Hace explícita la separación entre framework, agente y runtime
- Permite depurar por capas
- Evita confundir “fallo de Puruto” con “fallo del entorno” o “fallo del agente”

## Siguientes pasos

- → [Modelo de ejecución](/conceptos/modelo-de-ejecucion/)
- → [IPC agéntico](/referencia/ipc/)
- → [Debug y logs](/operacion/debug-y-logs/)
- → [Errores frecuentes](/operacion/errores-frecuentes/)

## Última verificación

Contenido contrastado con snapshots del generador (`/Users/pepetox/Documents/01-code/puruto/tests/text_snapshots/`) y docs del ecosistema el **25 de febrero de 2026**.
