---
title: Preguntas frecuentes
description: Respuestas a las preguntas más habituales sobre el framework Puruto.
---

## ¿Puruto solo funciona con Claude Code?

No. El formato SKILL.md es un **estándar abierto** adoptado en diciembre de 2025 por Gemini CLI, Codex/ChatGPT y Windsurf. Un Puruto generado con el framework funciona sin modificación en cualquiera de estos agentes.

Puruto no está atado a Anthropic ni a ningún proveedor de IA concreto.

---

## ¿Necesito una cuenta de Anthropic/Google/OpenAI?

Solo necesitas tener instalado **uno** de los agentes compatibles (Claude Code, Gemini CLI, Codex o Windsurf). Puruto en sí no requiere cuenta en ningún servicio.

---

## ¿Qué diferencia hay entre "el framework Puruto" y "un Puruto"?

| | Puruto (framework) | Un Puruto (app) |
|---|---|---|
| **Qué es** | La herramienta que crea y gestiona Purutos | Un repo que sigue el estándar Puruto |
| **Skill principal** | `puruto-generator`, `validate`, `upgrade` | Sus propias skills de dominio |
| **Quién lo usa** | El desarrollador que crea apps | El usuario final vía el agente |
| **Es público** | Sí (este repo) | Depende del autor |

---

## ¿Necesito internet para usar Puruto?

No. Todo el ecosistema es local:
- `puruto-data` almacena datos en tu máquina
- El agente de código corre localmente (o en tu subscripción, pero sin datos de Puruto)
- `puruto-cron` usa SQLite local

`puruto-telegram` sí requiere internet para conectar con la API de Telegram si lo usas.

---

## ¿Puedo usar Puruto con modelos locales (Ollama)?

Es una **línea de I+D activa**. La funcionalidad básica es posible si el modelo local soporta una interfaz CLI y puede leer `CLAUDE.md` / `agent.md`. La compatibilidad total no está garantizada y depende de las capacidades de herramientas del modelo.

---

## ¿Cómo migro un Puruto antiguo al nuevo estándar?

Con el script de migración:

```bash
# Ver qué cambiaría (dry-run)
python3 .claude/skills/upgrade/scripts/upgrade.py --plan ~/purutos/mi-puruto

# Aplicar la migración
python3 .claude/skills/upgrade/scripts/upgrade.py ~/purutos/mi-puruto
```

O con la skill `/upgrade` desde el agente.

---

## ¿Es obligatorio usar puruto-data?

No es técnicamente obligatorio. Cada Puruto puede almacenar sus datos en su propio `db/`.

Pero si tienes más de un Puruto en el ecosistema, `puruto-data` es muy recomendable: evita duplicación de datos, centraliza el acceso y simplifica las copias de seguridad.

---

## ¿Cuántos Purutos puedo tener en el ecosistema?

Sin límite técnico. El ecosistema está diseñado para crecer. `/workspace` te permite orquestar todos los Purutos desde un único punto de entrada independientemente de cuántos haya.

---

## ¿Puedo publicar mis Purutos?

Sí. Cualquier Puruto puede publicarse en GitHub como repo público. El único Puruto que **no debe publicarse** es `puruto-data`, ya que contiene tus datos personales.

El marketplace de Purutos está en el roadmap como parte de la Fase 2 del framework.

---

## ¿Por qué se llama Puruto?

**プルト** (Puruto) es la adaptación fonética japonesa de "Pluto" (Plutón). La referencia es a algo pequeño pero con ecosistema propio — igual que el planeta enano tiene su luna Caronte y su atmósfera peculiar.

También permite jugar con el storytelling en japonés: los kanjis de "brote rápido" o "germinación de aplicaciones".

---

## ¿Por qué skills en SKILL.md en vez de un CLI normal?

El formato SKILL.md tiene ventajas clave sobre un CLI convencional:

1. **No requiere instalación**: el agente lee el fichero directamente — sin `pip install`, sin `npm install`
2. **Universal**: funciona en todos los agentes compatibles sin adaptación
3. **El repo es la app**: la lógica, la documentación y las instrucciones del agente viven juntas en el mismo fichero
4. **Evolvable**: cambiar el comportamiento es cambiar texto en Markdown, no recompilar código

---

## ¿Cómo contribuyo al framework?

Abre un PR en [github.com/pepetox/puruto](https://github.com/pepetox/puruto). Antes de hacer cambios grandes, revisa `puruto-plan.md` para entender las decisiones de diseño tomadas.

Si cambias el generador, templates o validaciones, actualiza también `README.md`, `CLAUDE.md`, `CHANGELOG.md` y los tests afectados — el CI lo verifica automáticamente.
