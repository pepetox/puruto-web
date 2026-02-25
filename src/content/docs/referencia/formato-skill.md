---
title: Formato SKILL.md
description: Especificación del formato SKILL.md — el estándar abierto de skills para agentes de código.
sidebar:
  order: 2
---

## ¿Qué es SKILL.md?

SKILL.md es el **formato estándar para definir skills de agentes de código**. Fue publicado por Anthropic como estándar abierto en diciembre de 2025 y es actualmente compatible con:

- Claude Code
- Gemini CLI
- Codex / ChatGPT
- Windsurf

Una skill escrita en SKILL.md funciona sin modificación en todos estos agentes.

## Estructura de un fichero SKILL.md

```markdown
---
name: nombre-skill
description: Descripción de una línea para el agente
user-invocable: true
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
---

# Instrucciones del agente

El contenido del cuerpo son las instrucciones que sigue el agente
cuando ejecuta esta skill. Escríbelas en Markdown natural.

## Cuándo usar esta skill

Define en qué contexto el agente debe activar esta skill.

## Pasos de ejecución

1. Primer paso
2. Segundo paso
3. Tercer paso

## Ejemplos

\```bash
# Ejemplo de uso
/nombre-skill argumento
\```
```

## Campos del frontmatter

### `name` (obligatorio)

Identificador de la skill. Sin espacios ni caracteres especiales. Se usa para invocarla con `/<name>`.

```yaml
name: procesar-csv
```

### `description` (obligatorio)

Descripción de una línea. El agente la usa para decidir si esta skill es relevante para la tarea actual.

```yaml
description: Procesa un fichero CSV y genera estadísticas básicas
```

### `user-invocable` (obligatorio)

Si es `true`, el usuario puede invocar la skill explícitamente con `/<name>`. Si es `false`, el agente la puede usar internamente pero el usuario no la invoca directamente.

```yaml
user-invocable: true
```

### `allowed-tools` (opcional)

Lista de herramientas que el agente puede usar al ejecutar esta skill. Si se omite, el agente usa las herramientas disponibles por defecto en el entorno.

```yaml
allowed-tools:
  - Read
  - Write
  - Bash
  - Glob
  - Grep
  - Task
```

## Localización de las skills

Las skills de un Puruto viven en `.claude/skills/<nombre>/SKILL.md`:

```
.claude/
└── skills/
    ├── init/
    │   └── SKILL.md
    ├── help/
    │   └── SKILL.md
    └── mi-skill/
        ├── SKILL.md
        └── scripts/      ← scripts auxiliares (opcional)
            └── helper.py
```

## Buenas prácticas

### Instrucciones claras y ejecutables

Escribe las instrucciones en imperativo, como si le hablaras directamente al agente:

```markdown
# Bueno
Cuando el usuario invoque esta skill:
1. Lee el fichero especificado
2. Valida el formato JSON
3. Muestra un resumen de los campos

# Malo
Esta skill sirve para leer ficheros y mostrar información sobre ellos.
```

### Una responsabilidad por skill

Cada skill hace una cosa concreta. Si una skill hace demasiado, divídela en varias.

### Documenta los parámetros

Si la skill acepta argumentos, documéntalos explícitamente:

```markdown
## Parámetros

- `--ruta <path>` — ruta al fichero a procesar (obligatorio)
- `--formato json|csv` — formato de salida (por defecto: json)
```

### Incluye ejemplos de uso

```markdown
## Ejemplos

\```
/mi-skill --ruta datos/archivo.csv
/mi-skill --ruta datos/archivo.csv --formato json
\```
```
