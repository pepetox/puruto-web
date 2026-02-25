---
title: Referencia CLI
description: Todos los comandos CLI del framework Puruto — generate.py, validate.py y upgrade.py.
sidebar:
  order: 4
---

## generate.py

Genera un nuevo repo Puruto en `~/purutos/` (o en el directorio actual como fallback).

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py [opciones]
```

### Opciones

| Flag | Tipo | Por defecto | Descripción |
|---|---|---|---|
| `--name` | string | *(requerido)* | Nombre del repo (sin espacios) |
| `--description` | string | `""` | Descripción de una línea |
| `--db` | bool (string `true/false`) | `true` | Incluir base de datos SQLite local |
| `--skills` | string | `""` | Skills adicionales separadas por comas |
| `--ipc` | bool | `false` | Incluir runtime IPC (`/call`, `ipc.py`, `invoker.py`) |
| `--agent-tests` | bool | `false` | Incluir scaffold de Agent-CI (`tests/agent/`) |

:::note
`generate.py` parsea estos flags booleanos como strings (`\"true\"` / `\"false\"`) y compara en minúsculas.
:::

### Repos especiales

```bash
# Genera repos del ecosistema (template dedicado por tipo)
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-data
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-telegram
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-cron
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-gateway
```

### Ejemplos

```bash
# Puruto mínimo
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-notas \
  --description "Gestión de notas personales"

# Puruto con base de datos y skills custom
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-finanzas \
  --description "Finanzas personales" \
  --db true \
  --skills "ingresar,consultar,exportar"

# Puruto con IPC completo
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-reservas \
  --description "Reservas de restaurantes" \
  --db true \
  --ipc true

# Puruto con tests agénticos
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo \
  --description "Demo con Agent-CI" \
  --agent-tests true
```

### Resolución de destino

El generador crea repos en este orden de preferencia:

1. `~/purutos/<nombre>` si el directorio `~/purutos/` existe
2. `../purutos/<nombre>` relativo al CWD, si existe `../purutos/`
3. `<cwd>/<nombre>` como fallback final

---

## validate.py

Valida que un repo cumpla el estándar mínimo Puruto.

```bash
python3 .claude/skills/validate/scripts/validate.py [ruta] [opciones]
```

### Opciones

| Flag | Descripción |
|---|---|
| `ruta` | Ruta al repo a validar (por defecto: CWD) |
| `--json` | Salida en formato JSON (para scripting) |

### Salida JSON (ejemplo real)

Ejemplo de `validate.py --json` sobre un Puruto recién generado:

```json
{
  "kind": "standard",
  "ok": true,
  "errors": 0,
  "warnings": 0,
  "findings": []
}
```

Campos devueltos:

- `path`
- `kind`
- `ok`
- `errors`
- `warnings`
- `findings[]`

### Ejemplos

```bash
# Validar un Puruto específico
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-finanzas

# Validar el CWD
python3 .claude/skills/validate/scripts/validate.py

# Salida JSON para scripting
python3 .claude/skills/validate/scripts/validate.py --json

# Validar todos los repos de ~/purutos/ (con loop de shell)
for d in ~/purutos/*/; do
  echo "--- $d ---"
  python3 .claude/skills/validate/scripts/validate.py "$d"
done
```

### Qué valida

- Presencia de `CLAUDE.md` o `agent.md`
- Presencia de `README.md`
- Presencia de `.env.example`
- Directorio `.claude/skills/` con las 4 skills base
- `.puruto-standard-version` (warning si falta o está desalineado)
- `.gitignore` (warning si existe `.env` y falta `.gitignore`)
- Validaciones específicas por tipo (`puruto-data`, `puruto-telegram`, etc.)
- Consistencia IPC (`.puruto-ipc.json`, `/call`, `ipc.py`, `invoker.py`) cuando aplica

### Códigos y findings

Consulta la referencia completa:

- → [Errores y códigos de validación](/referencia/errores-y-codigos/)

---

## upgrade.py

Migra un repo Puruto a una versión más reciente del estándar.

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py [ruta] [opciones]
```

### Opciones

| Flag | Descripción |
|---|---|
| `ruta` | Ruta al repo a migrar (por defecto: CWD) |
| `--target-version` | Versión objetivo (por defecto: última soportada) |
| `--plan` | Solo muestra qué migraciones aplicarían (sin ejecutar) |
| `--dry-run` | Simula la migración sin escribir ficheros |
| `--json` | Salida JSON estructurada |

### Ejemplos

```bash
# Ver qué migraciones aplican (modo dry-run)
python3 .claude/skills/upgrade/scripts/upgrade.py --plan ~/purutos/puruto-finanzas

# Aplicar migraciones
python3 .claude/skills/upgrade/scripts/upgrade.py ~/purutos/puruto-finanzas

# Migrar el CWD
python3 .claude/skills/upgrade/scripts/upgrade.py
```

### Salida JSON (ejemplo real: `--plan`)

```json
{
  "current_version": "0.0.0",
  "target_version": "0.2.0",
  "dry_run": true,
  "plan": [
    { "from": "0.0.0", "to": "0.1.0" },
    { "from": "0.1.0", "to": "0.2.0" }
  ],
  "final_version": "0.0.0"
}
```

### Salida JSON (ejemplo real: aplicación)

```json
{
  "dry_run": false,
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

### Recomendación de uso

Para repos antiguos o dudosos:

1. `upgrade.py --plan --json`
2. `upgrade.py --json`
3. `validate.py --json`

### Migraciones disponibles

| De → A | Cambios |
|---|---|
| `legacy → 0.1.0` | Añade `.puruto-standard-version`, normaliza estructura base |
| `0.1.0 → 0.2.0` | Añade scaffold IPC opcional, `agent.md`, template de skills actualizado |

:::note
`upgrade.py` actualiza artefactos de estructura (ficheros y carpetas). No migra lógica runtime ni datos existentes.
:::
