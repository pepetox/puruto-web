---
title: registry.json de puruto-data (referencia)
description: Contrato práctico de registry.json en puruto-data, flujo de /register y compatibilidad con discovery de puruto-gateway.
---

## Qué cubre esta página

- Estructura de `registry.json` en `puruto-data`
- Forma de entradas creadas por la skill `/register`
- Cómo lo consume `puruto-gateway` (`registry.py`)
- Limitaciones y compatibilidad actual

## Alcance

Fuente de verdad:

- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/data/registry.json.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/data/register.SKILL.md.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/data/status.SKILL.md.tpl`
- `/Users/pepetox/Documents/01-code/puruto/.claude/skills/puruto-generator/templates/gateway/registry.py.tpl`

## Estructura raíz (scaffold actual)

Template generado:

```json
{
  "version": "1",
  "purutos": []
}
```

Campos:

- `version` (string): versión del formato de registro (actual scaffold: `"1"`)
- `purutos` (array): lista de Purutos registrados

## Entradas de `purutos[]` (skill `/register`)

La skill scaffold `/register` añade entradas con esta forma:

```json
{
  "name": "puruto-financial",
  "folder": "puruto-financial",
  "registered_at": "2026-02-25T20:00:00.000000"
}
```

Además crea:

- carpeta `./puruto-financial/`
- `./puruto-financial/.gitkeep`

## Semántica de campos (MVP)

- `name`: identificador del Puruto (debe seguir `puruto-<nombre>`)
- `folder`: carpeta dentro de `puruto-data` asignada a ese Puruto
- `registered_at`: timestamp ISO generado por la skill de registro

## Cómo lo usa `puruto-data/status`

La skill `/status` de `puruto-data`:

- lee `registry.json`
- recorre `reg["purutos"]`
- usa `folder` para contar ficheros por Puruto

Esto confirma que, en el scaffold actual, `folder` es parte funcional del contrato local (no solo metadata).

## Compatibilidad con `puruto-gateway` (`registry.py`)

`puruto-gateway` puede intentar discovery desde:

- `PURUTO_DATA_PATH/registry.json`

El normalizador de `registry.py` acepta:

- raíz `purutos` (scaffold `puruto-data`)
- raíz `repos` (compatibilidad adicional)

Y para cada item intenta leer:

- `name` o `id`
- `path` (opcional)
- `kind` (opcional)
- `commands` (opcional)

## Limitación importante de compatibilidad (actual)

:::caution
Las entradas creadas por la skill `/register` de `puruto-data` no incluyen `path`, `kind` ni `commands`.

Por tanto, cuando `puruto-gateway` consume ese `registry.json`, el item normalizado puede quedar con `path: null` y defaults en `kind/commands`.
:::

Esto no rompe el discovery básico, pero reduce precisión del catálogo.

## Ejemplo de normalización en gateway (desde `registry.json` de puruto-data)

Entrada en `puruto-data`:

```json
{
  "name": "puruto-financial",
  "folder": "puruto-financial",
  "registered_at": "2026-02-25T20:00:00"
}
```

Salida normalizada en `puruto-gateway` (aprox.):

```json
{
  "name": "puruto-financial",
  "path": null,
  "kind": "standard",
  "commands": ["init", "help", "list", "status"]
}
```

## Buenas prácticas (hoy)

1. Usa `registry.json` de `puruto-data` como registro de alta de Purutos y asignación de carpetas
2. Para discovery más rico en gateway, considera complementar con metadata (`path`, `kind`, `commands`) en una evolución controlada del formato
3. No edites a mano `registered_at` salvo migraciones/repair
4. Mantén `registry.json` válido (sin trailing commas, sin claves rotas)

## Referencias relacionadas

- [puruto-data (ecosistema)](/ecosistema/puruto-data/)
- [Gateway API (MVP)](/referencia/gateway-api-mvp/)
- [Configuración (referencia)](/referencia/config-completa/)

## Última verificación

Contenido contrastado con `registry.json.tpl`, `register.SKILL.md.tpl`, `status.SKILL.md.tpl` y `gateway/registry.py.tpl` el **25 de febrero de 2026**.
