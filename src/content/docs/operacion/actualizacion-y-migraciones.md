---
title: Actualización y migraciones
description: Cómo usar upgrade.py con plan, dry-run y JSON para migrar Purutos entre versiones del estándar.
---

## Qué cubre esta página

- Cómo funciona `upgrade.py`
- Qué rutas de migración soporta el framework actual
- Cómo usar `--plan`, `--dry-run` y `--json`
- Qué cambios aplica realmente y cuáles no

## Cuándo usar esta página

Úsala cuando:

- un Puruto antiguo falla validación o tiene artefactos incompletos,
- quieres normalizar repos antes de trabajar con ellos,
- o necesitas confirmar qué cambios aplicará una migración sin escribir ficheros.

## Comando base

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py [ruta] [opciones]
```

## Flags importantes (código actual)

Según `/Users/pepetox/Documents/01-code/puruto/.claude/skills/upgrade/scripts/upgrade.py`:

| Flag | Para qué sirve |
|---|---|
| `ruta` | Repo Puruto a migrar (por defecto: directorio actual) |
| `--target-version` | Versión objetivo (por defecto: última soportada por el script) |
| `--plan` | Muestra el plan sin aplicar cambios |
| `--dry-run` | Simula la migración sin escribir ficheros |
| `--json` | Devuelve salida estructurada para scripting/CI |

## Regla operativa recomendada

Ejecuta siempre en este orden:

1. `--plan`
2. `--dry-run --json` (si quieres automatizar revisión)
3. migración real
4. `validate.py` para confirmar resultado

## Rutas de migración soportadas (actuales)

El script actual soporta:

- `0.0.0` → `0.1.0`
- `0.1.0` → `0.2.0`
- `0.0.0` → `0.2.0` (encadenando dos pasos)

Si el repo tiene una versión fuera de esas rutas, `upgrade.py` devolverá error indicando que no hay ruta soportada.

## Flujo recomendado (paso a paso)

### 1. Inspecciona el plan

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py ~/purutos/puruto-demo --plan
```

Qué esperar:

- versión actual detectada
- versión objetivo
- lista de pasos `from -> to`
- mensaje de que no se aplicaron cambios

### 2. Simula con salida JSON (opcional, muy útil)

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py ~/purutos/puruto-demo --dry-run --json
```

Campos útiles:

- `current_version`
- `target_version`
- `dry_run`
- `plan`
- `applied` (acciones previstas por paso)
- `final_version` (en dry-run no cambia)

### 3. Aplica la migración real

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py ~/purutos/puruto-demo
```

### 4. Valida después de migrar

```bash
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-demo --json
```

## Qué cambios aplica `upgrade.py` (ejemplos reales)

### `0.0.0` → `0.1.0`

Ejemplos de acciones del script:

- Renombrar referencia legacy `PURUTO_BOT_TOKEN` → `PURUTO_TELEGRAM_BOT_TOKEN` en `.env.example` (si aplica)
- Añadir `.env` a `.gitignore` (si falta y existe `.gitignore`)
- Crear/escribir `.puruto-standard-version = 0.1.0`

### `0.1.0` → `0.2.0`

Ejemplos de acciones del script:

- Añadir `invoker.py` / `ipc.py` si el repo usa `.puruto-ipc.json`
- Añadir `invoker.py` para `puruto-cron` y `puruto-gateway`
- Añadir `inbox.py`, `inbox/.gitkeep` y skill `/drain-inbox` en `puruto-telegram`
- Actualizar `.puruto-standard-version = 0.2.0`

:::tip
Los tests de `/Users/pepetox/Documents/01-code/puruto/tests/test_upgrade.py` cubren varios de estos casos (legacy, plan, IPC runtime, `puruto-telegram` con artefactos faltantes).
:::

## Qué NO hace (importante)

`upgrade.py` migra **estructura y artefactos**, no lógica runtime ni datos de negocio.

Ejemplos de cosas que no debes asumir:

- migración de bases de datos aplicativas
- compatibilidad total con customizaciones locales
- reparación de código runtime personalizado

## Troubleshooting rápido

### “No hay ruta de migración soportada”

1. Revisa `.puruto-standard-version`
2. Ejecuta `--plan --json`
3. Si la versión es custom/no soportada, prepara migración manual o normaliza primero

### El repo sigue fallando tras migrar

1. Ejecuta `validate.py --json`
2. Revisa findings y artefactos faltantes
3. Comprueba si el fallo es runtime (no estructural)

## Siguientes pasos

- → [Errores frecuentes](/operacion/errores-frecuentes/)
- → [Debug y logs](/operacion/debug-y-logs/)
- → [Referencia CLI](/referencia/cli/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/.claude/skills/upgrade/scripts/upgrade.py` y `/Users/pepetox/Documents/01-code/puruto/tests/test_upgrade.py` el **25 de febrero de 2026**.
