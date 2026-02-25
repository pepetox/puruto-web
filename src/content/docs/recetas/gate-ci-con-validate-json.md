---
title: Gate de CI con validate.py --json
description: Cómo usar validate.py --json como gate de CI y reporte estructurado en pipelines (GitHub Actions u otros).
---

## Qué cubre esta página

- Patrón robusto para usar `validate.py --json` en CI
- Cómo capturar JSON y preservar el `exit code`
- Ejemplo de workflow en GitHub Actions

## Cuándo usar esta receta

Úsala cuando quieras:

- fallar CI por errores estructurales de Puruto
- guardar un resumen legible de findings
- integrar checks de validación en scripts/pipelines

## Prerrequisitos

- Repo del framework `puruto` disponible en CI
- Python 3.x
- Acceso al script:
  - `/Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py`

## Idea clave (para no romper CI)

`validate.py --json`:

- devuelve JSON cuando ejecuta correctamente el script
- pero sigue usando `exit code 1` si hay errores de validación

Eso es bueno para gates, pero si quieres **parsear el JSON antes de fallar**, debes capturar el exit code explícitamente.

## Patrón local (shell)

```bash
set +e
python3 .claude/skills/validate/scripts/validate.py "$REPO" --json > validate.json
VALIDATE_EXIT=$?
set -e

python3 - <<'PY'
import json
from pathlib import Path

payload = json.loads(Path("validate.json").read_text(encoding="utf-8"))
print("kind:", payload.get("kind"))
print("ok:", payload.get("ok"))
print("errors:", payload.get("errors"))
print("warnings:", payload.get("warnings"))
for f in payload.get("findings", [])[:10]:
    print(f"- {f['level']} {f['code']} {f['path']}")
PY

exit "$VALIDATE_EXIT"
```

## Ejemplo de GitHub Actions (gate + resumen)

```yaml
name: Validate Puruto Repo

on:
  push:
  pull_request:

jobs:
  validate-structure:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Run validate.py and capture JSON
        id: validate
        shell: bash
        run: |
          set +e
          python3 .claude/skills/validate/scripts/validate.py . --json > validate.json
          code=$?
          echo "exit_code=$code" >> "$GITHUB_OUTPUT"
          set -e

      - name: Print structured summary
        if: always()
        shell: bash
        run: |
          python3 - <<'PY'
          import json
          from pathlib import Path

          p = Path("validate.json")
          if not p.exists():
              print("validate.json no existe (error de argumentos o fallo previo)")
              raise SystemExit(0)

          data = json.loads(p.read_text(encoding="utf-8"))
          print(f"kind={data.get('kind')} ok={data.get('ok')} errors={data.get('errors')} warnings={data.get('warnings')}")
          for f in data.get("findings", [])[:20]:
              print(f"[{f['level']}] {f['code']} {f['path']} - {f['message']}")
          PY

      - name: Fail job if validate found errors
        if: steps.validate.outputs.exit_code != '0'
        run: exit 1
```

## Variante: validar repos generados (smoke)

Puedes usar el mismo patrón tras generar un repo temporal:

```bash
tmpdir="$(mktemp -d)"
(
  cd "$tmpdir"
  python3 /ruta/al/repo-puruto/.claude/skills/puruto-generator/scripts/generate.py \
    --name puruto-ci-smoke \
    --description "Smoke test" \
    --kind standard

  set +e
  python3 /ruta/al/repo-puruto/.claude/skills/validate/scripts/validate.py \
    "$tmpdir/puruto-ci-smoke" --json > "$tmpdir/validate-smoke.json"
  code=$?
  set -e
  exit "$code"
)
```

## Errores comunes

### No hay `validate.json`

Suele indicar:

- error de argumentos (`argparse`, exit `2`)
- ruta del script incorrecta
- step falló antes de redirigir salida

## Parseo frágil por campos opcionales

No asumas que siempre habrá findings ni que `findings[]` tiene tamaño > 0.

Parsea con `.get(...)` y defaults.

## Buenas prácticas

1. Usa `exit code` para el gate final
2. Usa el JSON para resumen/reporting
3. Limita el número de findings impresos en logs de CI
4. Guarda el payload si necesitas debugging de PRs complejos

## Referencias relacionadas

- [Salidas JSON de CLI](/referencia/salidas-json-cli/)
- [CI/CD](/operacion/ci-cd/)
- [Errores y códigos](/referencia/errores-y-codigos/)

## Última verificación

Receta contrastada con `validate.py` y el comportamiento real de `exit code` + `--json` el **25 de febrero de 2026**.
