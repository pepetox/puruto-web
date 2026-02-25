---
title: IPC entre Purutos
description: Tutorial para generar un Puruto con IPC, configurar allowlists y validar la estructura antes de probar delegación.
---

## Qué resuelve esta receta

Crear un Puruto con IPC (`--ipc true`) y dejarlo listo para pruebas locales de delegación controlada.

## Prerrequisitos

- Framework `puruto/`
- Python 3.10+
- Conocer la base de [IPC agéntico](/referencia/ipc/)

## Resultado esperado

Al final tendrás un repo con:

- `.puruto-ipc.json`
- `ipc.py`
- `invoker.py`
- `.claude/skills/call/SKILL.md`

y una configuración inicial de allowlists lista para editar.

## Paso 1. Genera un Puruto con IPC

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo-ipc \
  --description "Demo con delegación IPC" \
  --ipc true
```

## Paso 2. Verifica artefactos generados

```bash
cd ~/purutos/puruto-demo-ipc
ls -la .puruto-ipc.json ipc.py invoker.py
ls -la .claude/skills/call/SKILL.md
```

## Paso 3. Revisa la configuración base

El scaffold genera `.puruto-ipc.json` con una configuración deny-by-default:

- `enabled: true`
- `owner: <nombre-del-repo>`
- `max_hops: 2`
- `allowed_targets: []`
- `allowed_actions: {}`

## Paso 4. Añade una allowlist mínima (ejemplo)

Edita `.puruto-ipc.json` y añade un target permitido:

```json
{
  "enabled": true,
  "owner": "puruto-demo-ipc",
  "max_hops": 2,
  "default_timeout_sec": 120,
  "allowed_targets": ["puruto-data"],
  "allowed_actions": {
    "puruto-data": ["read"]
  }
}
```

## Paso 5. Valida la estructura y los tipos

```bash
python3 /Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py \
  ~/purutos/puruto-demo-ipc --json
```

Esperado:

- `ok: true`
- sin errores `missing-ipc-*`
- sin errores `ipc-config-invalid-type`

## Paso 6. Prueba local del scaffold IPC (opcional)

Si el scaffold `ipc.py` está preparado en tu caso:

```bash
python3 ipc.py --target puruto-data --action read --prompt "Lee el registro"
```

## Paso 7. Prueba con la skill `/call` (modo agente)

Abre el repo en tu agente y prueba algo como:

```text
/call puruto-data read "Lee el registro"
```

La skill scaffold debe:

1. leer `.puruto-ipc.json`
2. validar allowlists
3. respetar `max_hops`
4. devolver error explícito si el target/acción no está permitido

## Errores comunes

### `missing-ipc-skill`

Causa:

- existe `.puruto-ipc.json`, pero falta `.claude/skills/call/SKILL.md`

### `missing-ipc-runtime`

Causa:

- existe `.puruto-ipc.json`, pero falta `ipc.py` o `invoker.py`

### `ipc-config-invalid-type`

Causa:

- `allowed_targets` no es lista
- `allowed_actions` no es objeto JSON

## Buenas prácticas

1. Empieza con allowlists mínimas
2. Mantén `max_hops` bajo
3. No pongas secretos en prompts IPC
4. Revalida tras tocar `.puruto-ipc.json`

## Siguientes pasos

- → [IPC agéntico](/referencia/ipc/)
- → [Contratos runtime (MVP)](/referencia/contratos-runtime/)
- → [Artefactos runtime locales (MVP)](/referencia/artefactos-runtime-locales/)
- → [Seguridad y secretos](/operacion/seguridad-y-secretos/)
- → [Errores y códigos de validación](/referencia/errores-y-codigos/)

## Última verificación

Contenido contrastado con `generate.py`, template `.puruto-ipc.json.tpl`, `validate.py` y snapshots IPC del generador el **25 de febrero de 2026**.
