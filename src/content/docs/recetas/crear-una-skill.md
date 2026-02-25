---
title: Crear una skill
description: Cómo añadir una skill nueva a un Puruto manteniendo el formato SKILL.md y el contrato del repositorio.
---

## Qué resuelve esta receta

Añadir una skill nueva (por ejemplo `/ingest`, `/report`, `/exportar`) a un Puruto ya generado sin romper:

- el formato `SKILL.md`
- la UX del agente
- la documentación básica del repo

## Cuándo usarla

Usa esta receta cuando:

- ya tienes un Puruto generado
- quieres pasar de placeholders a una capacidad real
- necesitas una skill adicional específica de tu dominio

## Prerrequisitos

- Un Puruto generado (por ejemplo `~/purutos/puruto-demo`)
- Editor de texto
- Opcional: agente compatible con `SKILL.md`

## Resultado esperado

Al terminar tendrás:

- una nueva carpeta `.claude/skills/<nombre>/SKILL.md`
- la skill listada en `list`
- una primera versión funcional (o placeholder bien formado)

## Paso 1. Crea la carpeta de la skill

```bash
cd ~/purutos/puruto-demo
mkdir -p .claude/skills/mi-skill
```

## Paso 2. Crea `SKILL.md` con un formato mínimo válido

Plantilla mínima (basada en el template placeholder del framework):

```md
---
name: mi-skill
description: >
  Qué hace la skill y cuándo debe usarse.
user-invocable: true
---

# mi-skill

Describe el pipeline paso a paso y los comandos a ejecutar.
```

## Paso 3. Añade un pipeline útil (no solo texto)

Buenas prácticas:

- describe **cuándo usarla**
- enumera pasos
- añade comandos reales (`bash`, `python3`, etc.)
- aclara el resultado esperado

Ejemplo:

```md
## Pipeline

1. Leer el input del usuario
2. Validar archivos requeridos
3. Ejecutar el script correspondiente
4. Resumir resultado y siguientes pasos
```

## Paso 4. Declárala en la skill `list`

Edita:

- `.claude/skills/list/SKILL.md`

Añade la skill bajo “Skills adicionales”.

Ejemplo:

```md
**Skills adicionales:**
- `/mi-skill`
```

## Paso 5. (Recomendado) Documenta la skill en `CLAUDE.md`

Edita:

- `CLAUDE.md`

Añade una línea en “Qué puedes hacer”:

```md
- `/mi-skill` — descripción breve de la capacidad
```

Esto mejora la discoverabilidad para el agente y para humanos.

## Paso 6. Prueba la skill

### Con agente

Abre el repo y ejecuta:

```text
/mi-skill
```

### Sin agente (verificación estructural)

La skill nueva no afecta al mínimo obligatorio, pero conviene validar el repo:

```bash
python3 /Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py .
```

## Errores comunes

### La skill no aparece

Revisa:

- nombre de carpeta: `.claude/skills/mi-skill/`
- archivo: `.claude/skills/mi-skill/SKILL.md`
- formato frontmatter YAML válido

### El agente no la usa

Revisa:

- `description` demasiado vaga
- falta mención en `list` o `CLAUDE.md`
- el agente no recargó el contexto del repo

## Evolución recomendada (de placeholder a skill real)

1. Placeholder válido
2. Pipeline manual documentado
3. Comandos reproducibles
4. Scripts dedicados si el flujo crece
5. Tests o verificación de salida

## Siguientes pasos

- → [Primer ejemplo funcional](/guia/primer-ejemplo-funcional/)
- → [Formato SKILL.md](/referencia/formato-skill/)
- → [Errores frecuentes](/operacion/errores-frecuentes/)

## Última verificación

Contenido contrastado con templates `placeholder_skill.SKILL.md.tpl`, `skill_list.SKILL.md.tpl` y snapshots del generador el **25 de febrero de 2026**.
