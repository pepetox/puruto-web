---
title: Salidas JSON de CLI
description: Contratos prácticos (JSON) de validate.py y upgrade.py para usar Puruto en CI, scripts y automatizaciones.
---

## Qué cubre esta página

- Forma de salida JSON de `validate.py --json`
- Forma de salida JSON de `upgrade.py --json`
- Campos útiles para CI/scripts
- Límites y casos en los que **no** hay salida JSON

## Alcance

Esta referencia documenta la salida JSON observada y contrastada con:

- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/upgrade/scripts/upgrade.py`

No cubre `generate.py` porque actualmente no expone `--json`.

## `validate.py --json`

### Comando

```bash
python3 .claude/skills/validate/scripts/validate.py /ruta/al-repo --json
```

### Ejemplo real

```json
{
  "path": "/ruta/al-repo",
  "kind": "standard",
  "ok": true,
  "errors": 0,
  "warnings": 0,
  "findings": []
}
```

### Campos (top-level)

| Campo | Tipo | Significado |
|---|---|---|
| `path` | string | Ruta absoluta resuelta del repo validado |
| `kind` | string | Tipo detectado (`standard`, `puruto-cron`, etc.) |
| `ok` | bool | `true` si no hay findings de nivel `error` |
| `errors` | int | Número de findings `error` |
| `warnings` | int | Número de findings `warning` |
| `findings` | array | Lista detallada de findings |

### Estructura de `findings[]`

Cada elemento viene de `Finding` (dataclass) serializado con `asdict()`:

```json
{
  "level": "error",
  "code": "missing-file",
  "path": "README.md",
  "message": "Falta archivo requerido: `README.md`."
}
```

Campos:

- `level`: `error` o `warning`
- `code`: código estable del finding (ver [Errores y códigos](/referencia/errores-y-codigos/))
- `path`: ruta relativa afectada
- `message`: mensaje legible para humanos

### Semántica útil para CI

- `exit code 0`: puede incluir warnings
- `exit code 1`: hay errores
- `ok` replica esa semántica (`true` si `errors == 0`)

Recomendación:

- Usa `exit code` como gate principal
- Usa `findings[]` para enriquecer logs/reportes

## `upgrade.py --json`

### Comandos típicos

Plan:

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py /ruta/al-repo --plan --json
```

Aplicación:

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py /ruta/al-repo --json
```

### Ejemplo real (`--plan --json`)

```json
{
  "path": "/ruta/al-repo",
  "current_version": "0.0.0",
  "target_version": "0.2.0",
  "dry_run": true,
  "plan": [
    { "from": "0.0.0", "to": "0.1.0" },
    { "from": "0.1.0", "to": "0.2.0" }
  ],
  "applied": [
    { "from": "0.0.0", "to": "0.1.0", "actions": [] },
    { "from": "0.1.0", "to": "0.2.0", "actions": [] }
  ],
  "final_version": "0.0.0"
}
```

### Ejemplo real (aplicación `--json`)

```json
{
  "path": "/ruta/al-repo",
  "current_version": "0.0.0",
  "target_version": "0.2.0",
  "dry_run": false,
  "plan": [
    { "from": "0.0.0", "to": "0.1.0" },
    { "from": "0.1.0", "to": "0.2.0" }
  ],
  "applied": [
    {
      "from": "0.0.0",
      "to": "0.1.0",
      "actions": ["Escribir `.puruto-standard-version` = 0.1.0"]
    },
    {
      "from": "0.1.0",
      "to": "0.2.0",
      "actions": ["Escribir `.puruto-standard-version` = 0.2.0"]
    }
  ],
  "final_version": "0.2.0"
}
```

### Campos (top-level)

| Campo | Tipo | Significado |
|---|---|---|
| `path` | string | Ruta absoluta resuelta del repo |
| `current_version` | string | Versión detectada antes de migrar |
| `target_version` | string | Versión objetivo pedida |
| `dry_run` | bool | `true` si es `--dry-run` o `--plan` |
| `plan` | array | Pasos de migración previstos |
| `applied` | array | Pasos ejecutados (o simulados) con acciones |
| `final_version` | string | Versión final observada (o actual si `dry_run`) |

### Diferencia entre `plan` y `applied`

- `plan`: ruta de migración teórica (`from -> to`)
- `applied`: resultado operativo por paso, con `actions[]`

En `--plan`, `applied[].actions` llega vacío por diseño.

## Casos en los que NO hay JSON (aunque pases `--json`)

### Error de argumentos (`argparse`)

Si pasas flags inválidos, `argparse` imprime ayuda/error y termina con `exit code 2`.

Ese error **no** sale como JSON estructurado.

### Ruta de migración no soportada (`upgrade.py`)

Si `upgrade.py` no encuentra una ruta válida (`current -> target`):

- imprime `ERROR: ...` por `stderr`
- termina con `exit code 1`

Ese error tampoco sale como JSON estructurado (el script corta antes de construir `result`).

## Patrones de uso recomendados en scripts

### Gate simple de validación (shell)

```bash
python3 .claude/skills/validate/scripts/validate.py "$REPO" --json > validate.json
```

Después:

- usa el exit code para decidir fail/pass
- parsea `validate.json` para resumen o reporte

### Migración segura (plan + apply + validate)

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py "$REPO" --plan --json > upgrade-plan.json
python3 .claude/skills/upgrade/scripts/upgrade.py "$REPO" --json > upgrade-apply.json
python3 .claude/skills/validate/scripts/validate.py "$REPO" --json > validate-after.json
```

## Estabilidad del contrato (práctica)

Estos payloads son útiles como contrato de integración, pero no tienen versión JSON explícita propia.

Para reducir riesgo:

1. fija la versión del framework Puruto que usas en CI
2. consume claves conocidas (`ok`, `errors`, `findings`, `plan`, `applied`)
3. tolera campos nuevos adicionales

## Referencias relacionadas

- [CLI (referencia)](/referencia/cli/)
- [Errores y códigos](/referencia/errores-y-codigos/)
- [Actualización y migraciones](/operacion/actualizacion-y-migraciones/)
- [CI/CD](/operacion/ci-cd/)

## Última verificación

Contratos contrastados con los scripts `validate.py` y `upgrade.py`, y con salidas reales generadas localmente, el **25 de febrero de 2026**.
