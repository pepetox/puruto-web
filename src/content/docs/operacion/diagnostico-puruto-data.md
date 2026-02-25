---
title: Diagnóstico de puruto-data
description: Runbook operativo para diagnosticar y reparar puruto-data (registry.json, shared/, registro de Purutos y compatibilidad con gateway).
---

## Qué cubre esta página

- Flujo de diagnóstico de `puruto-data`
- Checks de estructura (`registry.json`, `shared/`)
- Validación de `registry.json` y carpetas registradas
- Reparación básica alineada con la skill `/init`
- Compatibilidad con discovery de `puruto-gateway`

## Alcance

Fuente de verdad:

- templates `data/*.tpl` del generador (especialmente `registry.json.tpl`)
- skills scaffold `init`, `register`, `status` de `puruto-data`

## Principio de diagnóstico

En `puruto-data`, separa estos problemas:

1. Estructura base rota (`registry.json`, `shared/`)
2. Registro inconsistente (entries sin carpeta o carpetas sin entry)
3. Integración de ecosistema (`PURUTO_DATA_PATH`, discovery del gateway)

## Paso 1. Validar estructura del repo

```bash
python3 /Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py /ruta/a/puruto-data --json
```

Revisa:

- `kind = "puruto-data"`
- `errors = 0`

## Paso 2. Revisar estructura mínima esperada

El scaffold base espera, como mínimo:

- `registry.json`
- `shared/.gitkeep`
- skill `.claude/skills/register/SKILL.md`

Comprobación rápida:

```bash
ls -la
ls -la shared
```

## Paso 3. Validar `registry.json` (JSON y contrato mínimo)

El scaffold genera este root:

```json
{
  "version": "1",
  "purutos": []
}
```

Chequeo rápido de parseo:

```bash
python3 - <<'PY'
import json
from pathlib import Path

p = Path("registry.json")
data = json.loads(p.read_text(encoding="utf-8"))
print("version:", data.get("version"))
print("purutos:", len(data.get("purutos", [])))
PY
```

Si falla este paso:

- JSON inválido
- fichero ausente
- root inesperado

## Paso 4. Verificar consistencia registro ↔ carpetas

La skill `/register` crea:

- entry en `registry.json` (`name`, `folder`, `registered_at`)
- carpeta `<nombre>/` con `.gitkeep`

Check recomendado:

```bash
python3 - <<'PY'
import json
from pathlib import Path

reg = json.loads(Path("registry.json").read_text(encoding="utf-8"))
rows = reg.get("purutos", [])
for item in rows:
    folder = item.get("folder")
    name = item.get("name")
    exists = Path(folder).exists() if folder else False
    print(f"{name}: folder={folder!r} exists={exists}")
PY
```

## Paso 5. Usar el check de `status` del scaffold

La skill `/status` del scaffold:

- cuenta Purutos registrados
- cuenta ficheros por carpeta registrada
- revisa `shared/`

Puedes reproducirlo:

```bash
python3 -c "
import json
from pathlib import Path

reg = json.loads(Path('registry.json').read_text())
purutos = reg['purutos']
print('── puruto-data status ──')
print(f'  Purutos registrados: {len(purutos)}')
for p in purutos:
    folder = Path(p['folder'])
    files = list(folder.rglob('*')) if folder.exists() else []
    print(f\"  · {p['name']} — {len(files)} ficheros\")
shared = list(Path('shared').rglob('*')) if Path('shared').exists() else []
print(f'  · shared — {len(shared)} ficheros')
"
```

## Paso 6. Reparación básica (alineada con `/init`)

Si falta estructura base, la skill `/init` hace:

1. `mkdir -p shared`
2. crear `registry.json` si no existe con `{"version":"1","purutos":[]}`

Reparación mínima manual:

```bash
mkdir -p shared

python3 - <<'PY'
import json
from pathlib import Path

reg = Path("registry.json")
if not reg.exists():
    reg.write_text(json.dumps({"version": "1", "purutos": []}, indent=2, ensure_ascii=False), encoding="utf-8")
    print("OK: registry.json creado")
else:
    print("OK: registry.json ya existe (no modificado)")
PY
```

## Paso 7. Repair de entradas (cuando hay desalineación)

Casos típicos:

- entry en `registry.json` sin carpeta
- carpeta de Puruto sin entry

Recomendación:

1. Haz copia de seguridad de `registry.json`
2. Corrige primero el registro (JSON válido)
3. Reejecuta `/register` para recrear la carpeta/entry si procede
4. Revalida con `status` + `validate.py`

Backup rápido:

```bash
cp registry.json "registry.json.bak.$(date +%Y%m%d-%H%M%S)"
```

## Integración con `puruto-gateway`

Si `puruto-gateway` usa `PURUTO_DATA_PATH`, puede descubrir desde `registry.json`.

Síntomas comunes:

- gateway descubre `0` Purutos
- gateway muestra `path: null`

Revisa:

1. `PURUTO_DATA_PATH` apunta al repo correcto
2. `registry.json` parsea
3. `purutos[]` tiene entradas

Referencia:

- [registry.json de puruto-data (referencia)](/referencia/registry-json-puruto-data/)

## Checklist de diagnóstico rápido

1. `validate.py` del repo `puruto-data` ✅
2. `registry.json` parsea ✅
3. `shared/` existe ✅
4. entries `purutos[]` tienen `name/folder` coherentes ✅
5. `status` muestra conteos razonables ✅

## Referencias relacionadas

- [registry.json de puruto-data (referencia)](/referencia/registry-json-puruto-data/)
- [Diagnóstico de puruto-gateway](/operacion/diagnostico-puruto-gateway/)
- [Observabilidad](/operacion/observabilidad/)

## Última verificación

Runbook contrastado con `data/init.SKILL.md.tpl`, `data/register.SKILL.md.tpl`, `data/status.SKILL.md.tpl` y `registry.json.tpl` del generador el **25 de febrero de 2026**.
