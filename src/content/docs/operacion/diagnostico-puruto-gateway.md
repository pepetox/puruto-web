---
title: Diagnóstico de puruto-gateway
description: Runbook operativo para diagnosticar puruto-gateway (auth, discovery, imports, entorno, endpoints y limitaciones del scaffold MVP).
---

## Qué cubre esta página

- Flujo rápido de diagnóstico de `puruto-gateway`
- Checks de `.env`, API key, imports y arranque
- Validación de discovery (`registry.py`)
- Pruebas HTTP mínimas con `curl`
- Limitación conocida del endpoint de invocación (`POST /purutos/{name}/{command}`)

## Alcance

Fuente de verdad:

- skills scaffold `init` y `status` de `puruto-gateway`
- templates `gateway/*.py` del generador

## Principio de diagnóstico

En `puruto-gateway`, separa siempre estos fallos:

1. Entorno/arranque (dependencias, imports, `.env`)
2. Auth (`X-API-Key`, env vars)
3. Discovery (qué Purutos ve `registry.py`)
4. Invocación (endpoint `POST`, hoy experimental en el scaffold)

## Paso 1. Validar estructura del repo

```bash
python3 /Users/pepetox/Documents/01-code/puruto/.claude/skills/validate/scripts/validate.py /ruta/a/puruto-gateway --json
```

Revisa:

- `kind = "puruto-gateway"`
- `errors = 0`

## Paso 2. Checks base del scaffold (`init`)

La skill `/init` del scaffold sugiere este orden:

### 2.1 Verificar `.env`

```bash
python3 -c "from pathlib import Path; print('OK: .env existe' if Path('.env').exists() else 'WARN: falta .env (copia .env.example)')"
```

### 2.2 Instalar dependencias mínimas

```bash
pip install fastapi uvicorn python-dotenv --quiet
```

### 2.3 Validar imports

```bash
python3 -c "import app; print('OK: app FastAPI cargada')"
```

Si falla este paso, revisa:

- entorno virtual activo
- dependencias instaladas
- sintaxis rota en `app.py`, `routes.py`, `auth.py`, `registry.py`, `invoker.py`

## Paso 3. Verificar configuración de auth

El scaffold exige:

- `PURUTO_GATEWAY_API_KEY`

Comprobación rápida:

```bash
python3 -c "import os; print('OK' if os.getenv('PURUTO_GATEWAY_API_KEY') else 'FALTA PURUTO_GATEWAY_API_KEY')"
```

Sin esa variable:

- `/health` puede responder
- `/purutos*` devolverán error (`503`) al pasar por `require_api_key`

## Paso 4. Verificar discovery local (`status`/`registry.py`)

La skill `/status` del scaffold hace:

```bash
python3 -c "
import os
from registry import list_purutos

api_key = os.getenv('PURUTO_GATEWAY_API_KEY', '')
items = list_purutos()
print('── puruto-gateway status ──')
print('  API key:', 'configurada' if api_key else 'FALTA')
print(f'  Purutos descubiertos: {len(items)}')
print('  Nombres:', [i['name'] for i in items])
"
```

Qué valida este paso:

- imports de `registry.py`
- lectura de `PURUTO_DATA_PATH` (si aplica)
- fallback a discovery en directorio padre

## Paso 5. Arrancar el servidor y probar endpoints

### 5.1 Arranque local

```bash
uvicorn app:app --reload --host 127.0.0.1 --port 8787
```

### 5.2 `GET /health` (sin auth)

```bash
curl http://127.0.0.1:8787/health
```

Esperado:

```json
{"status":"ok","service":"puruto-gateway"}
```

### 5.3 `GET /purutos` (con auth)

```bash
curl -H "X-API-Key: $PURUTO_GATEWAY_API_KEY" http://127.0.0.1:8787/purutos
```

Pruebas negativas útiles:

- sin header `X-API-Key` -> `401` (o `503` si falta env)
- API key incorrecta -> `401`

### 5.4 `GET /purutos/{name}`

```bash
curl -H "X-API-Key: $PURUTO_GATEWAY_API_KEY" http://127.0.0.1:8787/purutos/puruto-data
```

Si no existe:

- `404` con `detail = "Puruto no encontrado"`

## Paso 6. Endpoint de invocación (estado actual)

:::caution
En el template MVP actual existe una colisión de nombre en `routes.py` para `POST /purutos/{name}/{command}` (`invoke_base_command` handler vs helper importado).

Trátalo como experimental hasta corregir el scaffold.
:::

Qué sí puedes diagnosticar mientras tanto:

- validación de allowlist de `command`
- resolución de Puruto por nombre (`get_puruto`)

## Diagnóstico por síntomas

### `/health` OK pero `/purutos` falla

Revisa en este orden:

1. `PURUTO_GATEWAY_API_KEY`
2. header `X-API-Key`
3. import/ejecución de `registry.py`

### `/purutos` responde vacío

Causas comunes:

1. no hay repos `puruto-*` en el directorio padre
2. `PURUTO_DATA_PATH` apunta a un `registry.json` inexistente o inválido
3. `registry.json` existe pero sin entries en `purutos[]`

### El gateway descubre Purutos con `path: null`

Causa típica:

- `registry.json` de `puruto-data` con entries mínimas (`name`, `folder`, `registered_at`) sin `path`

Referencia:

- [registry.json de puruto-data (referencia)](/referencia/registry-json-puruto-data/)

## Checklist de diagnóstico rápido

1. `validate.py` del repo `puruto-gateway` ✅
2. `import app` ✅
3. `PURUTO_GATEWAY_API_KEY` configurada ✅
4. `python3 -c "from registry import list_purutos; print(list_purutos())"` ✅
5. `GET /health` ✅
6. `GET /purutos` con API key ✅

## Referencias relacionadas

- [Gateway API (MVP)](/referencia/gateway-api-mvp/)
- [puruto-gateway (ecosistema)](/ecosistema/puruto-gateway/)
- [Debug y logs](/operacion/debug-y-logs/)

## Última verificación

Runbook contrastado con `gateway/init.SKILL.md.tpl`, `gateway/status.SKILL.md.tpl` y templates `gateway/*.py` del generador el **25 de febrero de 2026**.
