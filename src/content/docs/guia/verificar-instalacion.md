---
title: Verificar instalación
description: Comprueba con pasos reproducibles que el framework Puruto quedó operativo (agente o CLI).
sidebar:
  order: 4
---

## Qué cubre esta página

- Verificación del entorno base (Python, pip, Jinja2)
- Verificación del framework con generación por CLI
- Verificación de un Puruto generado con `validate.py`
- Comprobaciones opcionales en modo agente

## Resultado esperado

Al final tendrás una prueba funcional mínima de que:

- el generador crea repos Puruto válidos,
- el validador funciona,
- y tu instalación no depende de “asumir” que el agente está bien configurado.

## 1. Verifica el entorno base

```bash
git --version
python3 --version
python3 -m pip --version
python3 -c "import jinja2; print(jinja2.__version__)"
```

Esperado:

- `python3` devuelve `3.10+`
- la importación de `jinja2` no falla

## 2. Genera un Puruto de prueba (CLI)

Desde el repo del framework:

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-check \
  --description "Verificación local de Puruto"
```

## 3. Valida el repo generado

```bash
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-check
```

Esperado (salida humana):

- `Tipo detectado: standard`
- `Resumen: 0 errores, 0 warnings`

## 4. Verifica salida JSON (útil para automatización)

```bash
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-check --json
```

Campos clave esperados:

- `ok: true`
- `errors: 0`
- `warnings: 0`
- `kind: "standard"`

:::tip
Los tests del framework validan este flujo de forma automática (`tests/test_validate.py`), así que esta comprobación está alineada con la CI del proyecto.
:::

## 5. (Opcional) Verificación en modo agente

Si ya tienes un agente compatible con `SKILL.md`:

1. Abre el repo `puruto/`
2. Ejecuta `/init`
3. Ejecuta `/puruto-generator`
4. Ejecuta `/validate` sobre un repo generado

Si alguno de esos comandos no aparece, revisa:

- [Agentes y modelos](/conceptos/agentes-y-modelos/)
- [Errores frecuentes](/operacion/errores-frecuentes/)

## Criterio de “instalación OK”

Considera la instalación correcta si puedes completar estas 3 pruebas:

1. `jinja2` importable
2. `generate.py` crea un repo
3. `validate.py` devuelve `0 errores`

El soporte del agente puede configurarse después.

## Limpieza (opcional)

Si el repo de prueba era solo para verificar:

```bash
rm -rf ~/purutos/puruto-check
```

## Siguientes pasos

- → [Tu primer Puruto](/guia/primer-puruto/)
- → [Errores frecuentes](/operacion/errores-frecuentes/)
- → [Debug y logs](/operacion/debug-y-logs/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/README.md`, `/Users/pepetox/Documents/01-code/puruto/tests/test_validate.py` y `/Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py` el **25 de febrero de 2026**.
