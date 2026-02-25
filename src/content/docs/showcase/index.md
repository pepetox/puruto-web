---
title: Mejores Purutos
description: Showcase de Purutos del ecosistema oficial y de la comunidad.
---

## Ecosistema oficial

Los cuatro repos especiales del ecosistema Puruto, generados y mantenidos como parte del framework:

| Puruto | Tipo | Estado | Descripción |
|---|---|---|---|
| [puruto-data](/ecosistema/puruto-data/) | Bóveda de datos | Estable | Almacenamiento centralizado del ecosistema |
| [puruto-telegram](/ecosistema/puruto-telegram/) | Conector móvil | MVP | Bot Telegram con enrutamiento determinista |
| [puruto-cron](/ecosistema/puruto-cron/) | Scheduler | MVP | Jobs asíncronos con SQLite y retries |
| [puruto-gateway](/ecosistema/puruto-gateway/) | API REST | MVP | Exposición HTTP de comandos base |

## Casos de uso tipo

### Finanzas personales

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-finanzas \
  --description "Registro y análisis de finanzas personales" \
  --db true \
  --skills "registrar,consultar,presupuesto,exportar"
```

Skills sugeridas: `registrar` (ingresos/gastos), `consultar` (filtros por categoría/fecha), `presupuesto` (alertas de límite), `exportar` (CSV/JSON).

### Diario y notas

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-diario \
  --description "Diario personal y notas" \
  --db true \
  --skills "crear,buscar,resumir,exportar"
```

### Salud y hábitos

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-salud \
  --description "Seguimiento de hábitos y salud" \
  --db true \
  --skills "registrar,tendencias,objetivos"
```

### Reservas y agenda

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-reservas \
  --description "Gestión de reservas y agenda personal" \
  --db true \
  --ipc true \
  --skills "crear,consultar,cancelar,recordatorio"
```

Este caso usa IPC (`--ipc true`) para delegar pagos a `puruto-finanzas`.

## Comunidad

¿Tienes un Puruto interesante? Compártelo con la comunidad.

→ [Cómo añadir tu Puruto al showcase](/showcase/contribuir/)
