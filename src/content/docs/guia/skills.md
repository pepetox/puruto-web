---
title: Skills
description: Qué son las skills de Puruto, el formato SKILL.md y cómo añadir las tuyas.
sidebar:
  order: 3
---

## ¿Qué es una skill?

Una skill es una **capacidad que le das a tu Puruto**. Cada skill vive en un fichero `SKILL.md` dentro de `.claude/skills/<nombre>/`.

Cuando el agente carga el repo, lee todas las skills disponibles y sabe exactamente qué puede hacer y cómo.

## El formato SKILL.md

```markdown
---
name: mi-skill
description: Hace X cosa concreta
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
---

# Instrucciones para el agente

Cuando el usuario invoque esta skill:

1. Paso uno
2. Paso dos
3. Paso tres

## Ejemplos de uso

...
```

### Campos del frontmatter

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | string | Identificador de la skill (sin espacios) |
| `description` | string | Descripción de una línea para el agente |
| `user-invocable` | boolean | Si el usuario puede invocarla con `/<name>` |
| `allowed-tools` | lista | Herramientas que puede usar el agente |

:::note
El formato SKILL.md es un **estándar abierto** desde diciembre 2025, adoptado por Gemini CLI, Codex/ChatGPT y Windsurf. Una skill escrita para Claude Code funciona sin modificación en los demás agentes compatibles.
:::

## Las 4 skills obligatorias

Todo Puruto implementa estas cuatro skills base. El generador las crea automáticamente:

### `/init`

Prepara el entorno local del Puruto:
- Crea las carpetas necesarias (`db/`, logs, etc.)
- Genera `.env` desde `.env.example` si no existe
- Inicializa la base de datos SQLite si aplica
- Instala dependencias Python del repo

### `/help`

Explica cómo interactuar con el Puruto:
- Describe el propósito del Puruto
- Lista los comandos principales con ejemplos
- Indica prerequisitos y configuración necesaria

### `/list`

Lista todas las funcionalidades disponibles:
- Enumera todas las skills con su descripción
- Indica qué skills son invocables por el usuario
- Muestra si hay skills que requieren configuración previa

### `/status`

Muestra el estado actual del Puruto:
- Configuración cargada (`.env` presente, variables requeridas)
- Estado de la base de datos (conectada, tamaño, último acceso)
- Conexiones activas (APIs, bots, servicios externos)
- Versión del estándar implementada

## Añadir skills personalizadas

### 1. Crea el directorio de la skill

```bash
mkdir -p .claude/skills/mi-skill
```

### 2. Escribe el SKILL.md

```bash
cat > .claude/skills/mi-skill/SKILL.md << 'EOF'
---
name: mi-skill
description: Procesa un fichero CSV y genera un resumen
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
---

# mi-skill

Cuando el usuario invoque `/mi-skill`:

1. Pide la ruta del CSV si no se ha especificado
2. Lee el fichero y analiza las columnas
3. Genera un resumen con estadísticas básicas
4. Guarda el resumen en `db/resumen-<fecha>.md`

Responde con un resumen en lenguaje natural de los datos encontrados.
EOF
```

### 3. Registra la skill en tu agente

Recarga el repo en tu agente. La nueva skill aparece automáticamente en `/list` y está disponible con `/<nombre>`.

## Skills especiales del framework

Además de las obligatorias, el framework genera estas skills opcionales:

| Skill | Flag | Descripción |
|---|---|---|
| `/call` | `--ipc true` | Delega tareas a otros Purutos del ecosistema |
| `/workspace` | (framework) | Orquesta todos los Purutos en `~/purutos/` |
| `/validate` | (framework) | Valida que un repo cumpla el estándar |
| `/upgrade` | (framework) | Migra un Puruto a una versión más reciente |

## Siguiente paso

→ [El ecosistema Puruto](/guia/ecosistema/)
