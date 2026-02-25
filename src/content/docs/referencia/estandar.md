---
title: El estándar Puruto
description: Especificación formal del estándar Puruto 0.2.0 — estructura mínima, contrato obligatorio y versionado.
sidebar:
  order: 1
---

## Versión actual

**`0.2.0`** — registrada en `.puruto-standard-version` en cada repo Puruto.

## Estructura mínima

Todo repo que cumpla el estándar Puruto contiene:

```
mi-puruto/
├── CLAUDE.md              ← reglas del agente (identidad, comportamiento, skills)
├── agent.md               ← equivalente para Codex/Windsurf/Gemini CLI
├── README.md              ← documentación humana del repo
├── .env.example           ← plantilla de variables de entorno (en git)
├── .env                   ← valores reales (nunca en git, en .gitignore)
├── .gitignore             ← excluye .env, db/, etc.
├── .puruto-standard-version ← versión del estándar implementada
└── .claude/skills/        ← directorio de skills
    ├── init/SKILL.md
    ├── help/SKILL.md
    ├── list/SKILL.md
    └── status/SKILL.md
```

### Ficheros opcionales comunes

```
mi-puruto/
├── db/                    ← base de datos local (si --db true)
├── ipc.py                 ← runtime IPC (si --ipc true)
├── invoker.py             ← invocador IPC (si --ipc true)
├── .puruto-ipc.json       ← config IPC (si --ipc true)
└── tests/
    └── agent/             ← tests agénticos (si --agent-tests true)
```

## Contrato obligatorio

Todo Puruto implementa estas cuatro skills como mínimo:

| Skill | Invocación | Responsabilidad |
|---|---|---|
| `init` | `/init` | Prepara el entorno: crea carpetas, instala deps, inicializa BD, genera `.env` |
| `help` | `/help` o `¿cómo te uso?` | Explica cómo interactuar con el Puruto |
| `list` | `/list` o `¿qué puedes hacer?` | Lista todas las funcionalidades y skills disponibles |
| `status` | `/status` | Estado actual: config, BD, conexiones activas |

Un repo que implementa estos cuatro comandos puede llamarse Puruto.

## CLAUDE.md vs agent.md

Ambos ficheros contienen las mismas reglas del agente, pero en formatos ligeramente distintos:

- `CLAUDE.md` — formato Claude Code (frontmatter estilo Anthropic)
- `agent.md` — formato genérico compatible con Gemini CLI, Codex y Windsurf

El generador crea ambos. Son funcionalmente equivalentes.

## Versionado del estándar

El fichero `.puruto-standard-version` contiene la versión del estándar implementada por el repo:

```
0.2.0
```

### Historial de versiones

| Versión | Cambios principales |
|---|---|
| `0.1.0` | Estructura base: skills obligatorias, `.env.example`, `.gitignore` |
| `0.2.0` | IPC agéntico (`/call`, `.puruto-ipc.json`, `ipc.py`), Agent-CI scaffold, templates `puruto-cron` y `puruto-gateway` |

### Migración

Usa la skill `/upgrade` o el CLI:

```bash
# Ver qué migraciones aplican
python3 .claude/skills/upgrade/scripts/upgrade.py --plan ~/purutos/mi-puruto

# Aplicar la migración
python3 .claude/skills/upgrade/scripts/upgrade.py ~/purutos/mi-puruto
```

## Convenciones

### Nombres de repos

La convención recomendada es `puruto-<nombre>` (ej: `puruto-finanzas`, `puruto-salud`). No es obligatoria, pero mejora la integración con `/workspace` y `puruto-gateway`.

### Placeholders

Los templates del generador usan placeholders en `__MAYUSCULAS__`. Si encuentras este patrón en un repo generado, es un bug — reporta en GitHub.

### Secrets

**Nunca** incluir valores reales en `.env.example` ni en `CLAUDE.md`. Solo plantillas y descripciones. Los valores reales van exclusivamente en `.env` (que está en `.gitignore`).
