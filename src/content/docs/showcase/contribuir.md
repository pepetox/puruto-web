---
title: Añade tu Puruto
description: Cómo publicar tu Puruto en el showcase de la comunidad.
---

## Requisitos para aparecer en el showcase

Antes de enviar tu Puruto, verifica que cumple el estándar:

```bash
python3 .claude/skills/validate/scripts/validate.py ~/purutos/mi-puruto
# Debe mostrar: ✓ Puruto válido
```

Requisitos mínimos:

- [ ] El repo está en GitHub (público)
- [ ] Pasa la validación del estándar (`validate.py`)
- [ ] `.puruto-standard-version` presente y actualizado
- [ ] `README.md` explica claramente qué hace el Puruto y cómo usarlo
- [ ] `.env.example` documentado (sin secrets reales)

## Proceso de envío

El showcase funciona mediante Pull Requests a este repositorio.

### 1. Fork del repo del framework

```bash
git clone https://github.com/pepetox/puruto.git
cd puruto
```

### 2. Crea el fichero de entrada del showcase

Añade un fichero Markdown en `web/src/content/docs/showcase/community/`:

```bash
# Nombre del fichero: puruto-<nombre>.md
touch web/src/content/docs/showcase/community/puruto-mi-puruto.md
```

Con este formato:

```markdown
---
title: puruto-mi-puruto
description: Una línea describiendo qué hace tu Puruto.
---

## Descripción

[Explica en 2-3 párrafos qué hace el Puruto y qué problema resuelve]

## Skills

- `/init` — prepara el entorno
- `/mi-skill` — [descripción]
- ...

## Repositorio

[github.com/tu-usuario/puruto-mi-puruto](https://github.com/tu-usuario/puruto-mi-puruto)

## Estándar

Versión: `0.2.0`
```

### 3. Abre un Pull Request

```bash
git checkout -b showcase/puruto-mi-puruto
git add web/src/content/docs/showcase/community/puruto-mi-puruto.md
git commit -m "showcase: añade puruto-mi-puruto"
git push origin showcase/puruto-mi-puruto
```

Abre el PR en GitHub. El equipo revisará que el Puruto cumple los requisitos y hace merge.

## Criterios de aceptación

Los Purutos del showcase deben:

- Resolver un caso de uso real y útil
- Tener documentación clara en el README
- Pasar el validador del estándar
- No contener código malicioso ni exploits
- No exponer datos personales del autor

Los Purutos que almacenan datos personales (`puruto-data` personalizado) **no aplican** al showcase — son repos privados por diseño.
