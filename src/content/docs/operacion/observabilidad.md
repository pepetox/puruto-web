---
title: Observabilidad
description: Qué señales observar en Purutos (status, archivos, runs, notifications, inbox) para diagnosticar estado y actividad.
---

## Qué cubre esta página

- Qué “observabilidad” existe hoy en Puruto (MVP)
- Qué señales usar por tipo de repo
- Cómo inspeccionar actividad sin instrumentación compleja

## Punto importante

Puruto no trae una plataforma centralizada de observabilidad.

La observabilidad actual es principalmente:

- salida de comandos (`status`, `logs`, scripts)
- ficheros de estado (`.jobs.json`, `.channels.json`)
- artefactos locales (`db/`, `runs/`, `notifications/`, `inbox/`)
- validación estructural (`validate.py`)

## Capas de observabilidad (prácticas)

### 1. Estructura del repo (salud estática)

Usa:

```bash
python3 .claude/skills/validate/scripts/validate.py /ruta/repo --json
```

Te dice:

- `kind` detectado
- errores/warnings
- rutas faltantes

Esto responde “¿el repo está completo?” antes de preguntar “¿está funcionando?”.

### 2. Estado operativo (salud dinámica)

Usa la skill `status` del Puruto (si estás en modo agente) o los comandos que la skill ejecuta.

Ejemplos:

- `puruto-telegram/status` revisa token, chat, canales, DB e inbox
- `puruto-cron/status` revisa jobs, runs recientes y rutas de notificación
- Puruto estándar `status` revisa `.env`, `PURUTO_DATA_PATH` y DB (si aplica)

### 3. Eventos/artefactos runtime (actividad)

Según el tipo de Puruto:

- `puruto-cron`: `notifications/events.jsonl`, `runs/`
- `puruto-telegram`: `inbox/cron-events.jsonl`, `.channels.json`, `db/telegram.db`
- estándar con DB: `db/`

## Qué observar por tipo de Puruto

### Puruto estándar

Señales útiles:

- `.env` existe / cargado
- `PURUTO_DATA_PATH` resuelve a una ruta existente
- DB (si `--db true`) existe en `DB_PATH`
- `list` refleja skills reales del repo

Comprobaciones rápidas:

```bash
ls -la .claude/skills
ls -la db 2>/dev/null || true
```

### `puruto-cron`

Señales útiles (MVP scaffold):

- `.jobs.json` (config declarativa)
- DB local (`db/cron.db`)
- `notifications/events.jsonl`
- `runs/` (artefactos de ejecución, según evolución del runtime)

Comandos recomendados (alineados con la skill `/logs`):

```bash
ls -la notifications runs
tail -n 20 notifications/events.jsonl
python3 main.py status
```

### `puruto-telegram`

Señales útiles (MVP scaffold):

- `.channels.json` (canales registrados)
- DB (`db/telegram.db`)
- inbox local (`inbox/cron-events.jsonl`)
- token/chat configurados en `.env`

Comandos útiles:

```bash
ls -la db inbox
python3 inbox.py --limit 20
```

## Señales de observabilidad para IPC

En repos con `--ipc true`:

- `.puruto-ipc.json` válido
- `ipc.py` y `invoker.py` presentes
- allowlists coherentes (`allowed_targets`, `allowed_actions`)

Antes de probar llamadas IPC:

```bash
python3 .claude/skills/validate/scripts/validate.py /ruta/repo --json
```

## Checklist de observabilidad mínima (MVP)

Para cualquier Puruto en operación local:

1. `validate.py --json` sin errores
2. `status` ejecutable y con resumen útil
3. `.env` presente y variables clave configuradas
4. artefactos runtime del tipo de repo accesibles
5. logs/archivos de eventos inspeccionables (`tail`, `ls`)

## Qué falta todavía (normal en MVP)

- métricas centralizadas
- trazas distribuidas reales entre Purutos
- dashboards
- alerting automático de fábrica

Puedes añadirlo después, pero este baseline ya permite depurar bastante.

## Siguientes pasos

- → [Debug y logs](/operacion/debug-y-logs/)
- → [CI/CD](/operacion/ci-cd/)
- → [Ejecutar con puruto-cron](/recetas/ejecutar-con-cron/)

## Última verificación

Contenido contrastado con snapshots de `puruto-cron`, `puruto-telegram` y `validate.py` el **25 de febrero de 2026**.
