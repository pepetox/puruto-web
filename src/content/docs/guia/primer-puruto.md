---
title: Tu primer Puruto
description: Genera un repo Puruto completo y funcional con un solo comando.
sidebar:
  order: 2
---

## Genera un Puruto con el agente

Con el framework cargado en tu agente, ejecuta:

```
/puruto-generator
```

El generador te pregunta:

1. **Nombre** — convención `puruto-<nombre>`, sin espacios (ej: `puruto-notas`)
2. **Descripción** — una línea que explica qué hace
3. **¿Necesita base de datos?** — SQLite local por defecto
4. **Skills adicionales** — lista de capacidades extra (ej: `crear,buscar,exportar`)

## O directamente por CLI

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-notas \
  --description "Gestión de notas personales" \
  --db true \
  --skills "crear,buscar,exportar"
```

## Estructura generada

```
~/purutos/puruto-notas/
├── CLAUDE.md              ← identidad y reglas del agente
├── agent.md               ← equivalente para Codex/Windsurf/Gemini
├── README.md              ← documentación humana
├── .env.example           ← plantilla de variables de entorno
├── .env                   ← configuración local (no en git)
├── .gitignore
├── .puruto-standard-version
├── db/                    ← base de datos SQLite local
└── .claude/skills/
    ├── init/SKILL.md      ← prepara el entorno
    ├── help/SKILL.md      ← instrucciones de uso
    ├── list/SKILL.md      ← lista funcionalidades
    ├── status/SKILL.md    ← estado actual
    ├── crear/SKILL.md     ← skill personalizada
    ├── buscar/SKILL.md    ← skill personalizada
    └── exportar/SKILL.md  ← skill personalizada
```

## Pruébalo

```bash
cd ~/purutos/puruto-notas

# Con tu agente:
/init      ← prepara el entorno local (crea .env, inicializa db)
/help      ← explica cómo usarlo
/list      ← lista todas las skills disponibles
/status    ← muestra el estado actual
```

## Opciones avanzadas

### Con IPC — delegación entre Purutos

Genera el runtime de comunicación agéntica entre repos:

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-finanzas \
  --description "Finanzas personales" \
  --ipc true
```

Añade al repo:
- `.claude/skills/call/SKILL.md` — skill `/call` para delegar tareas a otros Purutos
- `.puruto-ipc.json` — allowlists de targets y límites de delegación
- `ipc.py` + `invoker.py` — runtime local de invocación (`InvocationRequest/Result`)

### Con Agent-CI — tests agénticos

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py \
  --name puruto-demo-ci \
  --description "Demo con tests agénticos" \
  --agent-tests true
```

Genera `tests/agent/` con:
- Casos declarativos en YAML
- Runner mock (sin LLM real)
- Adaptador Ollama opcional para pruebas con modelo local

## Siguiente paso

→ [Entiende las skills](/guia/skills/)
