---
title: Primer ejemplo funcional
description: Tutorial end-to-end para generar, validar y abrir un Puruto de ejemplo con resultados verificables.
sidebar:
  order: 5
---

## Qué cubre esta guía

Un flujo mínimo pero real para demostrar que Puruto funciona en tu máquina:

1. generar un Puruto estándar
2. validar su estructura
3. revisar los artefactos clave
4. (opcional) ejecutarlo con un agente compatible

## Prerrequisitos

- [Requisitos](/guia/requisitos/)
- [Configuración mínima](/guia/configuracion-minima/)
- Framework `puruto/` clonado
- `Jinja2` instalado

## Resultado esperado

Al final tendrás:

- un repo `puruto-demo-funcional` generado
- `validate.py` en verde (`0 errores, 0 warnings`)
- una base clara para empezar a editar skills reales

## 1. Genera un Puruto estándar (CLI)

Desde el repo del framework:

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo-funcional \
  --description "Demo funcional para validar Puruto" \
  --db true \
  --skills "ingest,report"
```

### Qué debería pasar

El generador imprime:

- la ruta donde creó el repo
- el listado de ficheros creados
- el siguiente paso (`cd ...`, `cp .env.example .env`)

## 2. Verifica que el repo se creó donde esperabas

El generador resuelve destino en este orden:

1. `~/purutos/<nombre>` si existe `~/purutos/`
2. `../purutos/<nombre>` si existe relativo a tu CWD
3. `<cwd>/<nombre>` como fallback

Compruébalo:

```bash
ls -la ~/purutos/puruto-demo-funcional
```

Si no existe ahí, busca en tu carpeta de trabajo actual.

## 3. Crea `.env` local en el repo generado

```bash
cd ~/purutos/puruto-demo-funcional
cp .env.example .env
```

:::note
Para este tutorial no necesitas rellenar valores reales si solo quieres validar estructura y revisar el scaffold.
:::

## 4. Valida el repo con `validate.py`

Vuelve al repo del framework o usa ruta absoluta del script:

```bash
python3 /Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py \
  ~/purutos/puruto-demo-funcional
```

### Resultado esperado

- `Tipo detectado: standard`
- `Resumen: 0 errores, 0 warnings`

También puedes verificar por JSON:

```bash
python3 /Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py \
  ~/purutos/puruto-demo-funcional --json
```

Campos esperados:

- `"ok": true`
- `"kind": "standard"`
- `"errors": 0`

## 5. Revisa los artefactos clave generados

Deberías ver al menos:

- `CLAUDE.md`
- `agent.md`
- `README.md`
- `.env.example`
- `.puruto-standard-version`
- `.claude/skills/init/SKILL.md`
- `.claude/skills/help/SKILL.md`
- `.claude/skills/list/SKILL.md`
- `.claude/skills/status/SKILL.md`
- `.claude/skills/ingest/SKILL.md`
- `.claude/skills/report/SKILL.md`
- `db/.gitkeep` (porque generaste con `--db true`)

## 6. (Opcional) Prueba el repo con un agente compatible

Abre `~/purutos/puruto-demo-funcional` en tu agente y ejecuta:

- `init`
- `status`
- `list`
- `help`

Qué esperar:

- `init` crea/valida `.env`, carpetas y (si aplica) inicializa la BD según el scaffold
- `status` resume estado de `.env`, ruta a `puruto-data` y BD
- `list` muestra skills base + `ingest` y `report`

## 7. Qué hacer después (para convertirlo en una app real)

1. Editar `CLAUDE.md` con la identidad real del Puruto
2. Implementar las skills placeholder (`ingest`, `report`)
3. Ajustar `.env.example` y `README.md`
4. Revalidar con `validate.py`

## Variantes útiles del mismo tutorial

### Sin base de datos

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo-lite \
  --description "Demo sin DB" \
  --db false
```

### Con IPC

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo-ipc \
  --description "Demo con IPC" \
  --ipc true
```

Después valida que existan:

- `.puruto-ipc.json`
- `ipc.py`
- `invoker.py`
- `.claude/skills/call/SKILL.md`

## Troubleshooting rápido

### `generate.py` falla por Jinja2

```bash
python3 -m pip install jinja2
```

### `validate.py` devuelve `missing-core-skill`

El repo fue modificado o generado parcialmente. Revisa [Errores frecuentes](/operacion/errores-frecuentes/).

## Siguientes pasos

- → [Tu primer Puruto](/guia/primer-puruto/)
- → [Modelo de ejecución](/conceptos/modelo-de-ejecucion/)
- → [Errores y códigos de validación](/referencia/errores-y-codigos/)

## Última verificación

Tutorial construido a partir de `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/scripts/generate.py`, `/Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py` y snapshots de tests del generador el **25 de febrero de 2026**.
