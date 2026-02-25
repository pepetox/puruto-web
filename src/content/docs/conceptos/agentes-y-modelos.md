---
title: Agentes y modelos
description: "Requisito clave: Puruto necesita un agente compatible o, en su defecto, usar los scripts CLI del framework."
---

## Qué cubre esta página

- Qué rol juega el agente (Claude/Codex/etc.) dentro de Puruto.
- Qué significa "compatible" en la práctica.
- Qué puedes hacer con agente y qué puedes hacer solo por CLI.
- Cómo elegir una configuración mínima para empezar.

## Punto clave (sin rodeos)

Puruto **no incluye** un agente ni un modelo.

Para usar comandos como `/init` o `/puruto-generator`, necesitas un **agente de código compatible con el formato `SKILL.md`** (por ejemplo Claude Code, Codex, Gemini CLI o Windsurf, según la documentación del proyecto).

Si no quieres usar un agente, Puruto sigue funcionando en **modo CLI** mediante scripts Python.

## Agente vs modelo (no es lo mismo)

- **Agente**: la herramienta que abre el repo, lee `CLAUDE.md`/`agent.md` y ejecuta skills/comandos.
- **Modelo**: el LLM que usa ese agente por debajo (según tu proveedor/configuración).

Puruto se integra con la **capa agente**, no con un modelo concreto.

## Qué significa "compatible" para Puruto

En términos prácticos, un agente útil para Puruto debería poder:

1. Leer instrucciones del repo (`CLAUDE.md`, `agent.md`)
2. Entender skills en formato `SKILL.md`
3. Ejecutar comandos/scripts del proyecto
4. Mantener contexto de trabajo en el repositorio

Si alguna de esas capacidades falla, Puruto puede funcionar parcialmente, pero la experiencia se degrada.

## Modos de uso soportados

### 1. Modo agente (recomendado para desarrollo)

Usas las skills del framework:

- `/init`
- `/puruto-generator`
- `/validate`
- `/upgrade`

Ventajas:

- Menos fricción operativa
- UX guiada por skills
- Mejor aprovechamiento de `CLAUDE.md`/`agent.md`

Limitación:

- Dependes del soporte real del agente para `SKILL.md` y flujo de comandos

### 2. Modo CLI (útil para automatización o fallback)

Usas scripts Python directamente:

```bash
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-demo
python3 .claude/skills/validate/scripts/validate.py ~/purutos/puruto-demo
python3 .claude/skills/upgrade/scripts/upgrade.py --plan
```

Ventajas:

- Funciona sin agente
- Fácil de integrar en CI y scripts shell

Limitación:

- No tienes interfaz por skills/slash commands

## Matriz de decisión (práctica)

| Situación | Recomendación |
|---|---|
| Quieres empezar rápido y usar Puruto como fue diseñado | Usa un agente compatible + skills |
| Quieres automatizar validación/migración en CI | Usa CLI (scripts Python) |
| Tu agente no expone slash commands o no carga skills bien | Empieza por CLI y luego migra a modo agente |
| Estás evaluando Puruto sin configurar un agente todavía | Usa CLI para generar/validar un repo de prueba |

## Requisitos asociados (lo que cambia según el caso)

### Siempre

- `git`
- `python3` (3.10+)
- `Jinja2` para el generador del framework

### Solo si usas modo agente

- Un agente compatible con `SKILL.md`
- Acceso/configuración del agente en tu máquina (según la herramienta)

### Solo si usas ciertos Purutos generados

- Tokens/credenciales (ej. Telegram)
- Dependencias del runtime del repo generado

## Problemas comunes

### No aparecen `/init` o `/puruto-generator`

Probables causas:

- El agente no soporta `SKILL.md`
- El agente no está leyendo el repo raíz correcto
- El agente no carga automáticamente `.claude/skills/`

Qué hacer:

1. Verifica que estás en el repo `puruto/`
2. Prueba el modo CLI (`generate.py`) para descartar problemas del framework
3. Revisa la configuración/documentación del agente

### "Instalé Puruto" pero no tengo modelo configurado

Esto no bloquea el uso del framework en sí, pero puede bloquear el agente.

Puruto no gestiona credenciales del proveedor del LLM. Eso se configura en tu herramienta de agente.

## Siguientes pasos

- → [Requisitos](/guia/requisitos/)
- → [Instalación](/guia/instalacion/)
- → [Referencia CLI](/referencia/cli/)

## Última verificación

Contenido contrastado con `/Users/pepetox/Documents/01-code/puruto/README.md`, `/Users/pepetox/Documents/01-code/puruto/CLAUDE.md` y `/Users/pepetox/Documents/01-code/puruto/puruto-plan.md` el **25 de febrero de 2026**.
