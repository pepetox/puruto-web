---
title: Buenas prácticas
description: Patrones recomendados para mantener Purutos legibles, migrables y operables en equipo.
---

## Qué cubre esta página

- Patrones de adopción para individuos y equipos
- Cómo mantener el estándar sin frenar la evolución del repo
- Recomendaciones para skills, docs, config y operación local

## Principios de adopción (prácticos)

### 1. Mantén el contrato mínimo siempre intacto

Todo Puruto debe conservar:

- `init`
- `help`
- `list`
- `status`

Aunque añadas skills avanzadas, ese contrato mantiene la usabilidad y la portabilidad.

### 2. Separa claramente estructura de runtime

Piensa en dos capas:

- **estructura del Puruto** (skills, `CLAUDE.md`, `.env.example`, README)
- **runtime local** (DB, tokens, servicios, archivos de eventos)

Esto facilita validar con `validate.py` antes de depurar ejecución real.

### 3. Usa `.env.example` como documentación viva

No lo trates como un archivo de relleno.

Incluye:

- variables reales
- comentarios útiles
- defaults razonables

### 4. Haz las skills pequeñas y composables

Mejor:

- varias skills claras (`/ingest`, `/report`, `/exportar`)

que:

- una skill gigante con muchos modos implícitos

### 5. Haz que `list` y `help` sean fiables

Cuando añadas/cambies skills:

- actualiza `.claude/skills/list/SKILL.md`
- actualiza `CLAUDE.md`

Si no, la discoverabilidad cae rápido (humana y agéntica).

## Buenas prácticas de evolución

### 6. Revalida después de cambios estructurales

```bash
python3 .claude/skills/validate/scripts/validate.py /ruta/a/tu-puruto --json
```

### 7. Usa `upgrade.py --plan` antes de tocar repos antiguos

Evita “reparaciones manuales” prematuras si el problema es de versión del estándar.

### 8. Cambia una cosa cada vez en IPC

Cuando uses delegación:

- ajusta `allowed_targets`
- valida
- luego ajusta `allowed_actions`
- valida otra vez

Así reduces errores de tipo y configuración.

## Buenas prácticas para equipos

### 9. Define convenciones de naming

Recomendado:

- `puruto-<dominio>`
- nombres de skills verbales (`ingest`, `sync`, `report`, `export`)

### 10. Documenta el “resultado esperado” en guías internas

No solo pasos.

Añade:

- qué archivo debería existir
- qué comando debería devolver OK
- qué warning es aceptable o no

### 11. Separa repos del ecosistema por responsabilidad

Ejemplos:

- `puruto-data` para datos
- `puruto-cron` para scheduling
- `puruto-telegram` para entrada móvil
- Purutos de dominio para lógica de negocio

Esto alinea con el diseño del framework y simplifica mantenimiento.

## Buenas prácticas de seguridad

### 12. Secretos en `.env`, nunca en docs/skills

Especialmente:

- tokens Telegram
- API keys de gateway

### 13. Empieza IPC con allowlists vacías o mínimas

No abras `allowed_targets` de forma amplia “por comodidad”.

## Buenas prácticas de calidad

### 14. Usa recipes + referencia + operación (no solo tutoriales)

Una docs seria combina:

- guías de inicio
- recetas
- referencia exacta
- troubleshooting

### 15. Si tocas framework `puruto`, sincroniza docs y tests

La CI del framework ya tiene guardias para esto. Aprovecha ese contrato en lugar de pelearte con él.

## Checklist de madurez de un Puruto (rápido)

1. `validate.py --json` sin errores
2. `help/list/status` actualizados
3. `.env.example` útil y sin secretos
4. README con quickstart real
5. skills nuevas documentadas
6. versión del estándar presente (`.puruto-standard-version`)

## Siguientes pasos

- → [Anti-patrones](/adopcion/anti-patrones/)
- → [Crear una skill](/recetas/crear-una-skill/)
- → [Seguridad y secretos](/operacion/seguridad-y-secretos/)

## Última verificación

Guía derivada del diseño y guardias del framework (`README.md`, `CLAUDE.md`, `validate.py`, `ci.yml`) el **25 de febrero de 2026**.
