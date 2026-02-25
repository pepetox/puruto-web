---
title: CI/CD
description: Cómo está montada la CI del framework Puruto y cómo reproducir localmente sus checks principales.
---

## Qué cubre esta página

- Qué ejecuta la CI del framework (`puruto/.github/workflows/ci.yml`)
- Cómo reproducir los checks localmente
- Qué guardias evitan desalineación entre código, docs y tests

## Alcance

Esta página documenta la CI del **framework Puruto** (repo `puruto`), no el deploy de esta web (`puruto-web`).

## Workflow de CI (framework)

Archivo fuente:

- `/Users/pepetox/Documents/01-code/puruto/.github/workflows/ci.yml`

Se ejecuta en:

- `push`
- `pull_request`

## Qué hace la CI (pipeline real)

### 1. Setup

- Checkout completo (`fetch-depth: 0`)
- Python `3.11`
- instalación de dependencias de test: `jinja2`, `pytest`

### 2. Guardias de sincronización docs/tests

Ejecuta `scripts/check_sync_guards.py`:

- en `pull_request` con `base.sha` / `head.sha`
- en `push` con `before` / `sha`

Objetivo:

- fallar si cambian superficies críticas sin actualizar docs y tests

Configuración de la guardia:

- `/Users/pepetox/Documents/01-code/puruto/.puruto-config.json`

## 3. Compilación de scripts Python

`python -m py_compile` sobre:

- `generate.py`
- `validate.py`
- `upgrade.py`
- scripts de guardias/config

## 4. Unit tests

`unittest` sobre:

- snapshots estructurales del generador
- `validate`
- `upgrade`
- guardia de placeholders
- guardia de sincronización

## 5. Pytest de snapshots textuales

Ejecuta:

```bash
python -m pytest -q tests/test_generator_text_snapshots_pytest.py
```

Esto comprueba contenido generado completo (skills, READMEs, etc.) y ayuda a detectar regresiones de texto/plantillas.

## 6. Smoke tests (CLI + generación + validate)

La CI prueba de forma integrada:

- `--help` de `generate.py`, `validate.py`, `upgrade.py`
- generación de varios tipos de Puruto
- check de placeholders sin reemplazar
- validación estructural
- migración (`upgrade.py`)
- scaffold `agent-tests` con pytest

## Guardias clave (por qué importan)

### `check_sync_guards.py`

Evita cambios “silenciosos” en:

- generador
- templates
- validación
- migraciones

sin cambios correlativos en:

- docs (`README.md`, `CLAUDE.md`, `CHANGELOG.md`)
- tests (`tests/`)

### `check_unresolved_placeholders.py`

Busca placeholders sin reemplazar tipo `__FOO__` en árboles de archivos generados.

Esto reduce el riesgo de publicar scaffolds rotos o incompletos.

## Reproducir CI localmente (paso a paso)

Desde `/Users/pepetox/Documents/01-code/puruto`:

```bash
python -m pip install --upgrade pip
python -m pip install jinja2 pytest
```

### Compilar scripts

```bash
python -m py_compile .claude/skills/puruto-generator/scripts/generate.py
python -m py_compile .claude/skills/validate/scripts/validate.py
python -m py_compile .claude/skills/upgrade/scripts/upgrade.py
python -m py_compile scripts/check_sync_guards.py
python -m py_compile scripts/check_unresolved_placeholders.py
python -m py_compile scripts/puruto_config.py
```

### Tests

```bash
python -m unittest -v \
  tests/test_generator_snapshots.py \
  tests/test_validate.py \
  tests/test_upgrade.py \
  tests/test_check_unresolved_placeholders.py \
  tests/test_check_sync_guards.py

python -m pytest -q tests/test_generator_text_snapshots_pytest.py
```

### Guardias manuales (útil antes de commit)

```bash
python scripts/check_sync_guards.py --file .claude/skills/puruto-generator/scripts/generate.py --file README.md --file tests/test_generator_snapshots.py
python scripts/check_unresolved_placeholders.py /ruta/a/un-puruto-generado
```

## Integración recomendada para tu flujo

Antes de abrir PR en `puruto`:

1. Ejecuta `validate.py` sobre repos de ejemplo afectados
2. Ejecuta tests mínimos relevantes
3. Ejecuta guardias si tocaste generador/templates/validate/upgrade
4. Revisa docs del framework (`README.md`, `CLAUDE.md`, `CHANGELOG.md`)

## CI de la web (`puruto-web`) vs CI del framework

- `puruto-web`: build y deploy de Astro/Starlight (GitHub Pages)
- `puruto`: CI de calidad/consistencia del framework y scaffolds

Mantenerlos separados es correcto.

## Siguientes pasos

- → [Observabilidad](/operacion/observabilidad/)
- → [Errores frecuentes](/operacion/errores-frecuentes/)
- → [Receta IPC entre Purutos](/recetas/ipc-entre-purutos/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/.github/workflows/ci.yml`, `scripts/check_sync_guards.py` y `scripts/check_unresolved_placeholders.py` el **25 de febrero de 2026**.
