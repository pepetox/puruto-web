---
title: Anti-patrones
description: Errores de diseño y operación que hacen que un Puruto pierda portabilidad, mantenibilidad o seguridad.
---

## Qué cubre esta página

- Errores comunes al adoptar Puruto en proyectos reales
- Cómo reconocerlos pronto
- Alternativas recomendadas

## Anti-patrón 1: Romper el contrato mínimo

### Síntoma

El repo elimina o deja obsoletos `init`, `help`, `list` o `status`.

### Problema

Pierdes:

- usabilidad básica
- portabilidad entre agentes
- consistencia con el estándar Puruto

### Alternativa

Mantén el contrato mínimo y añade skills extra para capacidades avanzadas.

## Anti-patrón 2: Skills gigantes y ambiguas

### Síntoma

Una sola skill hace demasiadas cosas y su `description` no deja claro cuándo usarla.

### Problema

- mala discoverabilidad
- más errores del agente al elegir skill
- mantenimiento difícil

### Alternativa

Divide por intención y flujo:

- `/ingest`
- `/report`
- `/export`

## Anti-patrón 3: `.env.example` desactualizado o inútil

### Síntoma

Variables reales solo existen en `.env` local o en mensajes informales.

### Problema

- onboarding lento
- errores de configuración repetidos
- docs no confiables

### Alternativa

Mantén `.env.example` como referencia viva, con comentarios y defaults.

## Anti-patrón 4: Meter secretos en repo, skills o docs

### Síntoma

Tokens/API keys en:

- `README.md`
- `SKILL.md`
- commits
- ejemplos “temporales”

### Problema

Riesgo de fuga inmediato.

### Alternativa

- secretos en `.env`
- placeholders en `.env.example`
- revisión antes de publicar

## Anti-patrón 5: Saltarse `validate.py` tras cambios estructurales

### Síntoma

Se cambia estructura/skills y se prueba directamente runtime/agente.

### Problema

Pierdes una verificación rápida de errores obvios (`missing-core-skill`, IPC inconsistente, etc.).

### Alternativa

Ejecuta siempre:

```bash
python3 .claude/skills/validate/scripts/validate.py /ruta/a/tu-puruto --json
```

## Anti-patrón 6: Abrir IPC demasiado pronto y demasiado amplio

### Síntoma

`allowed_targets` con muchos targets y sin `allowed_actions` restringidas.

### Problema

- mayor superficie de riesgo
- debugging difícil
- delegaciones difíciles de auditar

### Alternativa

Empieza mínimo:

- un target
- pocas acciones
- `max_hops` bajo

## Anti-patrón 7: Mezclar responsabilidades de ecosistema

### Síntoma

Un Puruto de dominio acaba haciendo datos + scheduling + entrada móvil + gateway.

### Problema

- complejidad excesiva
- límites difusos
- repos menos reutilizables

### Alternativa

Separar responsabilidades:

- `puruto-data`
- `puruto-cron`
- `puruto-telegram`
- Purutos de dominio

## Anti-patrón 8: Cambiar templates del framework sin sincronizar docs/tests

### Síntoma

`generate.py` o templates cambian, pero no se actualizan docs/tests.

### Problema

- regresiones silenciosas
- confusión entre lo que “dice la docs” y lo que genera el framework

### Alternativa

Sigue la disciplina que ya exige la CI del framework:

- docs (`README.md`, `CLAUDE.md`, `CHANGELOG.md`)
- tests (`tests/`)

## Anti-patrón 9: Usar `status` como mensaje bonito sin checks reales

### Síntoma

`status` responde algo genérico pero no comprueba `.env`, DB o rutas.

### Problema

Reduce mucho el valor operativo del Puruto.

### Alternativa

Haz que `status` verifique señales concretas del runtime (como hacen los scaffolds).

## Anti-patrón 10: Tutoriales sin “resultado esperado”

### Síntoma

La guía lista pasos, pero no dice cómo validar que funcionó.

### Problema

El usuario no sabe si está atascado o si va bien.

### Alternativa

Incluye siempre:

- salida esperada
- archivos esperados
- comando de verificación

## Señal de alerta temprana

Si para entender un Puruto hay que leer todo el código antes de ejecutar `help/list/status`, estás perdiendo parte del valor del estándar.

## Siguientes pasos

- → [Buenas prácticas](/adopcion/buenas-practicas/)
- → [Verificar instalación](/guia/verificar-instalacion/)
- → [Errores frecuentes](/operacion/errores-frecuentes/)

## Última verificación

Guía derivada de patrones observados en el framework, snapshots del generador y validaciones del estándar el **25 de febrero de 2026**.
