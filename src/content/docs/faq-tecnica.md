---
title: FAQ técnica
description: Preguntas técnicas frecuentes sobre validación, migraciones, IPC, CI y operación del framework Puruto.
---

## ¿Por qué `validate.py` puede devolver `ok=true` aunque haya warnings?

Porque el script falla (`exit 1`) solo cuando hay findings de nivel `error`.

Los warnings sirven para:

- señalar deuda técnica (`missing-standard-version`)
- inconsistencias no bloqueantes (`unsupported-standard-version`)
- riesgos operativos (`missing-gitignore` si existe `.env`)

## ¿Qué diferencia hay entre `validate.py` y `upgrade.py`?

- `validate.py`: diagnostica estructura y consistencia
- `upgrade.py`: modifica artefactos para migrar versión de estándar

Recomendación:

1. `upgrade.py --plan`
2. `upgrade.py` (si procede)
3. `validate.py --json`

## ¿`upgrade.py` migra mi lógica o mis datos?

No. Migra **artefactos y estructura** del scaffold/estándar (ficheros, rutas, versión declarada), no lógica de negocio ni datos runtime.

## ¿Qué significa `0.0.0` en migraciones?

Es el fallback que usa `upgrade.py` cuando:

- falta `.puruto-standard-version`, o
- el fichero está vacío

No significa necesariamente “repo roto”; significa “versión no declarada / legacy”.

## ¿Puedo usar `validate.py --json` como contrato en CI?

Sí. Es una buena práctica para scripts y gates internos.

Campos especialmente útiles:

- `ok`
- `kind`
- `errors`
- `warnings`
- `findings[]`

## ¿Qué pasa si tengo `.puruto-ipc.json` pero no quiero usar IPC todavía?

Si dejas `.puruto-ipc.json` en el repo, mantén también:

- `.claude/skills/call/SKILL.md`
- `ipc.py`
- `invoker.py`

Si no, `validate.py` marcará errores de IPC inconsistente.

## ¿Qué pasa si tengo `/call` pero no `.puruto-ipc.json`?

`validate.py` lo trata como warning (`missing-ipc-config`), no como error.

Eso puede ser útil para scaffolds intermedios, pero no es recomendable en repos operativos.

## ¿Por qué `generate.py` crea el repo en una ruta distinta a la que esperaba?

El generador resuelve destino por orden:

1. `~/purutos/<nombre>` si existe `~/purutos/`
2. `../purutos/<nombre>` relativo al CWD si existe
3. `<cwd>/<nombre>` como fallback

Revisa primero dónde estabas ejecutando el comando.

## ¿Cómo sé si un fallo es del agente o del framework?

Prueba el flujo mínimo por CLI:

1. `generate.py`
2. `validate.py`

Si eso funciona, el problema suele estar en:

- configuración del agente
- carga de skills
- entorno del repo generado

## ¿Qué checks de CI son “los más importantes” en el framework?

Los más críticos para evitar regresiones silenciosas:

- `check_sync_guards.py` (docs/tests sincronizados)
- `check_unresolved_placeholders.py` (templates completos)
- tests de snapshots textuales del generador

## ¿Qué debería inspeccionar primero en `puruto-cron` o `puruto-telegram`?

### `puruto-cron`

- `.jobs.json`
- `db/cron.db`
- `notifications/events.jsonl`
- `python3 main.py status`

### `puruto-telegram`

- `.env` (token/chat)
- `.channels.json`
- `db/telegram.db`
- `inbox/cron-events.jsonl`
- `python3 inbox.py --limit 20`

## ¿Por qué la docs web muestra páginas nuevas en EN/JA si no las traduje?

El sitio usa i18n con fallback (Starlight). Si falta traducción específica, la página puede resolverse desde el contenido raíz (ES).

Esto es útil para cobertura rápida, pero conviene traducir primero páginas fundacionales.

## Siguientes pasos

- → [FAQ](/faq/)
- → [CI/CD](/operacion/ci-cd/)
- → [Observabilidad](/operacion/observabilidad/)
- → [Glosario](/referencia/glosario/)

## Última verificación

FAQ construida sobre `generate.py`, `validate.py`, `upgrade.py`, `ci.yml` y docs del sitio el **25 de febrero de 2026**.
