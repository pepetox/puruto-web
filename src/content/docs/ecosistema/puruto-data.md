---
title: puruto-data
description: La bóveda de datos privada del ecosistema Puruto.
sidebar:
  order: 1
---

## ¿Qué es puruto-data?

`puruto-data` es el **repositorio central de almacenamiento** del ecosistema Puruto. Todos los Purutos del ecosistema leen y escriben sus datos aquí — nunca en las carpetas de otros Purutos.

Es un Puruto completo (implementa `init`, `help`, `list`, `status`) y actúa como guardián del acceso a los datos del ecosistema.

## Cuándo necesitarlo

- Cuando tienes **más de un Puruto** que comparte datos
- Cuando quieres un punto único de consulta sobre tus datos personales
- Cuando necesitas que los datos persistan aunque muevas o reinstales un Puruto

Si solo tienes un Puruto, puede almacenar sus datos localmente en `db/`. Cuando el ecosistema crece, centralizarlo en `puruto-data` es la solución natural.

## Generarlo

```bash
# Con /init (genera todo el ecosistema de una vez)
/init

# O solo puruto-data
python3 .claude/skills/puruto-generator/scripts/generate.py --name puruto-data
```

## Estructura

```
~/purutos/puruto-data/
├── CLAUDE.md              ← reglas de acceso y gestión de datos
├── agent.md
├── README.md
├── .env.example
├── .env
├── .puruto-standard-version
├── db/                    ← gestión interna de la bóveda
└── .claude/skills/
    ├── init/SKILL.md
    ├── help/SKILL.md
    ├── list/SKILL.md
    ├── status/SKILL.md
    ├── leer/SKILL.md      ← leer datos de un Puruto
    ├── escribir/SKILL.md  ← escribir/actualizar datos
    └── listar/SKILL.md    ← listar qué datos hay disponibles
```

Los datos de cada Puruto se almacenan en su propia subcarpeta:

```
~/purutos/puruto-data/
├── finanzas/              ← datos propiedad de puruto-finanzas
├── salud/                 ← datos propiedad de puruto-salud
├── notas/                 ← datos propiedad de puruto-notas
└── shared/                ← datos cross-dominio (acceso controlado)
```

## Cómo lo encuentran los demás Purutos

Cada Puruto busca `puruto-data` en este orden:

1. Ruta especificada en `PURUTO_DATA_PATH` del `.env` del Puruto
2. `../puruto-data/` relativo al directorio del Puruto (convención de co-localización)

```bash
# En el .env de cualquier Puruto:
PURUTO_DATA_PATH=../puruto-data/   # por defecto
# o con ruta absoluta:
PURUTO_DATA_PATH=/home/user/purutos/puruto-data/
```

## Política de acceso

- Cada Puruto solo escribe en **su propia carpeta** (`data/<nombre-puruto>/`)
- El acceso a `shared/` está abierto a todos los Purutos del ecosistema
- `puruto-data` nunca se publica en el marketplace — es un repo **privado** por diseño

:::danger
`puruto-data` contiene tus datos personales. **Nunca** lo hagas público ni lo subas a un repositorio público de GitHub.
:::

## Ver también

- → [`registry.json` de puruto-data](/referencia/registry-json-puruto-data/)
