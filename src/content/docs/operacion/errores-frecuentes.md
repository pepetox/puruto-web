---
title: Errores frecuentes
description: Fallos comunes al empezar con Puruto y cómo diagnosticarlos sin perder tiempo.
---

## Qué cubre esta página

- Errores comunes de instalación, agente y validación
- Diagnóstico rápido con comandos concretos
- Qué es error del framework y qué es problema de entorno

## Regla de oro

Antes de culpar al framework, prueba este flujo mínimo:

1. `generate.py` por CLI
2. `validate.py` sobre el repo generado

Si eso funciona, el problema suele estar en:

- configuración del agente,
- entorno local (Python/dependencias),
- o configuración específica del Puruto que estás ejecutando.

## `ModuleNotFoundError: No module named 'jinja2'`

### Causa probable

No has instalado la dependencia del generador en el repo del framework.

### Solución

```bash
python3 -m pip install jinja2
```

### Verificación

```bash
python3 -c "import jinja2; print(jinja2.__version__)"
```

## `python3` demasiado antiguo (3.9 o inferior)

### Síntoma

Errores de sintaxis o comportamiento extraño al ejecutar scripts del framework.

### Causa probable

El framework usa Python `3.10+`.

### Solución

Actualiza Python y verifica:

```bash
python3 --version
```

## No aparecen `/init` o `/puruto-generator` en el agente

### Causas probables

- El agente no soporta `SKILL.md`
- El agente no está abierto en el repo `puruto/`
- El agente no carga `.claude/skills/`

### Diagnóstico rápido

1. Ejecuta `generate.py` por CLI
2. Si funciona, el framework está bien
3. Revisa configuración/documentación de tu agente

### Fallback

Usa modo CLI temporalmente:

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-demo
```

## `validate.py` devuelve error por skill obligatoria faltante

### Síntoma típico

El validador devuelve `code = missing-core-skill`.

### Qué significa

Falta alguna skill base obligatoria:

- `init`
- `help`
- `list`
- `status`

### Diagnóstico

```bash
python3 .claude/skills/validate/scripts/validate.py /ruta/a/tu-puruto --json
```

Busca en `findings[]`:

- `code: "missing-core-skill"`

### Solución

- Regenera el repo con `generate.py` si fue alterado manualmente
- O restaura la skill faltante desde una copia válida

## `validate.py` avisa sobre `.puruto-standard-version`

### Síntoma

Warnings tipo:

- `missing-standard-version`
- `unsupported-standard-version`

### Qué significa

No bloquea la validez mínima del repo, pero afecta migraciones y trazabilidad del estándar.

### Solución recomendada

- Si es un repo nuevo: regénéralo o restaura el fichero
- Si es un repo antiguo: revisa [Referencia CLI](/referencia/cli/) y usa `upgrade.py`

## Error IPC: falta `/call`, `ipc.py` o `invoker.py`

### Síntoma

Errores del validador como:

- `missing-ipc-skill`
- `missing-ipc-runtime`

### Causa probable

El repo tiene `.puruto-ipc.json` pero le faltan artefactos IPC.

### Solución

1. Verifica que el repo fue generado con `--ipc true`
2. Revisa que existan:
   - `.claude/skills/call/SKILL.md`
   - `ipc.py`
   - `invoker.py`
3. Si faltan, regenera o repara desde una plantilla válida

## `upgrade.py` no encuentra ruta de migración

### Síntoma

Error de salida indicando:

- `No hay ruta de migración soportada`

### Causa probable

La versión actual del repo no tiene una ruta soportada hacia la versión objetivo.

### Diagnóstico

```bash
python3 .claude/skills/upgrade/scripts/upgrade.py /ruta/repo --plan
```

## Cuándo abrir issue (y qué incluir)

Abre issue si puedes reproducir el problema tras pasar el flujo mínimo (generar + validar).

Incluye:

1. Versión de Python (`python3 --version`)
2. Comando ejecutado
3. Salida completa (`stdout/stderr`)
4. Si usaste agente o CLI
5. Resultado de `validate.py --json` (si aplica)

## Siguientes pasos

- → [Debug y logs](/operacion/debug-y-logs/)
- → [Verificar instalación](/guia/verificar-instalacion/)
- → [Referencia de configuración](/referencia/config-completa/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py`, `/Users/pepetox/Documents/01-code/puruto/.claude/skills/upgrade/scripts/upgrade.py` y `/Users/pepetox/Documents/01-code/puruto/tests/test_validate.py` el **25 de febrero de 2026**.
