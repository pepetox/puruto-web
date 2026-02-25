---
title: Errores y códigos de validación
description: Catálogo de códigos emitidos por validate.py (errors, warnings e interpretación práctica).
sidebar:
  order: 5
---

## Alcance

Esta página documenta los códigos (`findings[].code`) emitidos por:

```bash
python3 .claude/skills/validate/scripts/validate.py --json
```

Fuente de verdad:

- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py`

## Formato de salida (resumen)

`validate.py --json` devuelve un payload con:

- `ok`
- `errors`
- `warnings`
- `kind`
- `findings[]`

Cada finding incluye:

- `level` (`error`, `warning`, `info`)
- `code`
- `path`
- `message`

## Códigos de error (`level = error`)

| Código | Cuándo aparece | Impacto |
|---|---|---|
| `missing-agent-rules` | Faltan `CLAUDE.md` y `agent.md` | El repo no cumple el mínimo |
| `missing-required` | Falta `README.md`, `.env.example` o `.claude/skills` | El repo no cumple el mínimo |
| `missing-core-skill` | Falta `init`, `help`, `list` o `status` | El repo no cumple el contrato básico |
| `invalid-ipc-config` | `.puruto-ipc.json` no se puede leer/parsear | IPC roto |
| `missing-ipc-skill` | Existe `.puruto-ipc.json` pero falta `/call` | IPC inconsistente |
| `missing-ipc-runtime` | Existe `.puruto-ipc.json` pero faltan `ipc.py` o `invoker.py` | IPC incompleto |
| `ipc-config-invalid-type` | `allowed_targets` o `allowed_actions` con tipo inválido | Config IPC inválida |
| `missing-data-file` | Falta componente requerido de `puruto-data` | Repo especial inválido |
| `missing-telegram-file` | Falta componente requerido de `puruto-telegram` | Repo especial inválido |
| `missing-cron-file` | Falta componente requerido de `puruto-cron` | Repo especial inválido |
| `missing-gateway-file` | Falta componente requerido de `puruto-gateway` | Repo especial inválido |

## Códigos de warning (`level = warning`)

| Código | Cuándo aparece | Impacto |
|---|---|---|
| `missing-recommended-file` | Falta `CLAUDE.md` o `agent.md` (pero existe el otro) | Recomendación, no bloquea |
| `empty-standard-version` | `.puruto-standard-version` vacío | Puede afectar migraciones |
| `unsupported-standard-version` | Versión declarada distinta de la soportada por `validate.py` | No bloquea, pero requiere revisión |
| `missing-standard-version` | Falta `.puruto-standard-version` | No bloquea, dificulta migraciones |
| `ipc-config-missing-key` | Falta clave recomendada en `.puruto-ipc.json` | IPC puede funcionar parcial |
| `missing-ipc-config` | Existe `/call` pero falta `.puruto-ipc.json` | Delegación sin configuración explícita |
| `missing-gitignore` | Existe `.env` pero falta `.gitignore` | Riesgo de subir secretos |

## Cómo interpretar `ok`, `errors` y `warnings`

- `ok = true` si **no hay errores**
- Warnings no cambian `ok` a `false`
- `sys.exit(1)` solo si hay errores

Esto permite usar `validate.py` como gate estricto en CI o como diagnóstico flexible local.

## Ejemplos de diagnóstico por código

### `missing-core-skill`

Acción recomendada:

1. Ejecuta `validate.py --json`
2. Mira `path` para la skill faltante
3. Restaura desde un repo válido o regenera

### `unsupported-standard-version`

Acción recomendada:

1. Ejecuta `upgrade.py --plan`
2. Revisa si hay ruta soportada
3. Migra antes de seguir depurando runtime

### `ipc-config-invalid-type`

Acción recomendada:

1. Abre `.puruto-ipc.json`
2. Corrige tipos:
   - `allowed_targets` → lista
   - `allowed_actions` → objeto JSON

## Comandos útiles

```bash
# Ver todos los findings en JSON
python3 .claude/skills/validate/scripts/validate.py /ruta/repo --json

# Filtrar códigos (si usas jq)
python3 .claude/skills/validate/scripts/validate.py /ruta/repo --json | jq -r '.findings[].code'
```

## Siguientes pasos

- → [Errores frecuentes](/operacion/errores-frecuentes/)
- → [Debug y logs](/operacion/debug-y-logs/)
- → [Actualización y migraciones](/operacion/actualizacion-y-migraciones/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py` el **25 de febrero de 2026**.
