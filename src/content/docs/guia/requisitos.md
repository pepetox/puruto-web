---
title: Requisitos
description: Requisitos reales para usar Puruto con agente (Claude/Codex/etc.) o por CLI.
sidebar:
  order: 1
---

## Qué cubre esta página

- Requisitos mínimos para usar el framework Puruto.
- Qué cambia si trabajas con agente vs solo CLI.
- Cómo verificar el entorno antes de empezar.

## Resultado esperado

Al terminar esta página, sabrás si tu equipo puede:

- usar Puruto en **modo agente** (`/init`, `/puruto-generator`, etc.), o
- empezar en **modo CLI** con los scripts Python del framework.

## Requisitos mínimos (siempre)

- **Git** (clonar repos y versionar Purutos)
- **Python 3.10+** (el framework usa sintaxis y tipado modernos)
- **`pip`** para instalar dependencias del framework
- **Jinja2** (dependencia del generador)

Compruébalo:

```bash
git --version
python3 --version
python3 -m pip --version
```

## Requisito clave para modo agente

Necesitas un **agente de código compatible con `SKILL.md`**.

En la documentación del proyecto se mencionan como opciones habituales:

- Claude Code
- Codex
- Gemini CLI
- Windsurf

:::note
Puruto no incluye el agente ni el modelo. Puruto organiza el repositorio y las skills; el agente es una pieza externa.
:::

Si no quieres depender de un agente desde el primer día, puedes empezar por **modo CLI** y usar `generate.py`, `validate.py` y `upgrade.py`.

## Requisitos opcionales (según qué generes o ejecutes)

- **Credenciales/tokens** del servicio que uses (ej. Telegram)
- Librerías de runtime del Puruto generado (dependen del tipo)
- Ollama u otro runtime local si decides usar adaptadores agénticos en tests (según configuración)

## Elige tu modo de inicio

### Opción A: Empezar con agente (recomendado)

Elige esta opción si quieres usar la experiencia completa de Puruto:

- `/init`
- `/puruto-generator`
- `/validate`
- `/upgrade`

### Opción B: Empezar por CLI (fallback válido)

Elige esta opción si:

- todavía no has configurado un agente compatible
- tu agente no soporta bien `SKILL.md`
- quieres automatizar desde shell/CI

## Checklist previo a instalación

Antes de seguir a instalación:

1. `python3 --version` devuelve `3.10` o superior
2. Puedes ejecutar `python3 -m pip`
3. Tienes claro si empezarás en modo agente o modo CLI
4. (Si modo agente) tu herramienta ya está instalada y operativa

## Siguientes pasos

- → [Agentes y modelos](/conceptos/agentes-y-modelos/)
- → [Instalación](/guia/instalacion/)
- → [Tu primer Puruto](/guia/primer-puruto/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/README.md` el **25 de febrero de 2026**.
