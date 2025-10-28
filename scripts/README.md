# Scripts de Mantenimiento

## `prefetch-logos.ts` - Pre-carga de Logos

Este script pre-carga en Redis todos los logos de equipos y ligas para los partidos de los próximos 14 días (7 días atrás y 7 días adelante).

### Características

- ✅ Obtiene fixtures de 7 días atrás hasta 7 días adelante
- ✅ Extrae todos los IDs únicos de equipos y ligas
- ✅ Verifica qué logos ya están en caché
- ✅ Descarga solo los logos faltantes
- ✅ Guarda los logos en Redis con TTL de 6 meses
- ✅ Procesa en chunks de 30 IDs por petición
- ✅ Incluye reintentos automáticos en caso de errores
- ✅ Delays entre peticiones para no saturar el servidor

### Uso

#### Primera vez (instalar dependencias)

```bash
pnpm install
```

#### Ejecutar el script

```bash
pnpm prefetch:logos
```

O directamente con npx:

```bash
npx tsx scripts/prefetch-logos.ts
```

### Salida Esperada

```
🚀 Iniciando pre-carga de logos...

⏱️  TTL configurado: 6 meses (15,552,000 segundos)

📅 Obteniendo fixtures de 15 días (21.10.2025 a 04.11.2025)...

📅 Procesando 21.10.2025...
  → 156 equipos, 23 ligas
📅 Procesando 22.10.2025...
  → 203 equipos, 31 ligas
...

============================================================
📊 RESUMEN DE IDs ENCONTRADOS
============================================================
Equipos únicos: 1247
Ligas únicas: 89
============================================================

📦 Procesando 1247 teams...
✅ 523 teams ya en caché
🔍 724 teams por buscar
📋 Procesando en 25 chunks...
  🔄 Chunk 1/25 (30 IDs)...
  ✅ Guardados 30 logos en Redis
...
✨ Total teams nuevos: 724

📦 Procesando 89 leagues...
✅ 34 leagues ya en caché
🔍 55 leagues por buscar
📋 Procesando en 2 chunks...
  🔄 Chunk 1/2 (30 IDs)...
  ✅ Guardados 30 logos en Redis
...
✨ Total leagues nuevos: 55

============================================================
✅ PROCESO COMPLETADO
============================================================
Nuevos logos de equipos: 724
Nuevos logos de ligas: 55
Total logos nuevos: 779
============================================================

👋 Conexión Redis cerrada
```

### Configuración de Cron

Para ejecutar este script automáticamente una vez al día:

#### Linux/macOS

```bash
# Editar crontab
crontab -e

# Agregar esta línea para ejecutar todos los días a las 3:00 AM
0 3 * * * cd /ruta/a/tu/proyecto && pnpm prefetch:logos >> /var/log/prefetch-logos.log 2>&1
```

#### Windows (Task Scheduler)

1. Abrir "Programador de tareas" (Task Scheduler)
2. Crear tarea básica
3. Nombre: "Pre-carga de logos Minuto90"
4. Desencadenador: Diariamente a las 3:00 AM
5. Acción: Iniciar programa
   - Programa: `C:\Program Files\nodejs\node.exe`
   - Argumentos: `C:\ruta\a\tu\proyecto\node_modules\.bin\pnpm prefetch:logos`
   - Iniciar en: `C:\ruta\a\tu\proyecto`

#### Docker/Producción

Si usas Docker, puedes agregar un cron job dentro del contenedor o usar un servicio separado:

```yaml
# docker-compose.yml
services:
  logo-prefetch:
    image: node:20
    working_dir: /app
    volumes:
      - .:/app
    command: >
      sh -c "
        while true; do
          pnpm prefetch:logos;
          sleep 86400;
        done
      "
    depends_on:
      - redis
```

### Variables de Entorno Requeridas

- `PRIVATE_GOAL_SERVE_API_KEY`: API key de GoalServe
- `GOAL_SERVE_BASE_URL`: URL base de la API de GoalServe
- `REDIS_URL` o (`REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_DB`)

### Notas

- El script es idempotente: puedes ejecutarlo múltiples veces sin problemas
- Solo descarga los logos que no están en caché
- Los logos se actualizarán automáticamente cada 6 meses
- Si el script falla, puedes ejecutarlo nuevamente sin perder progreso

