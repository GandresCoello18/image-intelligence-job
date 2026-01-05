# Worker E2E Tests

Tests end-to-end simples para el Worker de Image Intelligence Platform.

## Propósito

Estos tests E2E verifican que el Worker pueda conectarse correctamente a los servicios requeridos y que la configuración esté correcta. Son tests simples diseñados para:

- ✅ Verificar conexiones a servicios (Redis, MongoDB, MinIO)
- ✅ Validar configuración de colas
- ✅ Probar que se pueden agregar jobs a la cola
- ✅ Demostrar cómo funcionan los tests E2E para workers en el monorepo

## Requisitos

Antes de ejecutar los tests, asegúrate de tener:

1. **Servicios de infraestructura corriendo**:
   - Redis en `localhost:6379`
   - MongoDB en `localhost:27017`
   - MinIO en `localhost:9000`

> **Nota**: Los tests están diseñados para ser tolerantes a fallos. Si los servicios no están disponibles, algunos tests pueden fallar pero otros seguirán funcionando.

## Ejecutar Tests

### Opción 1: Con Nx (Recomendado)

```bash
# Ejecutar tests E2E (inicia el worker automáticamente)
nx e2e worker-e2e
```

### Opción 2: Manual

```bash
# Terminal 1: Iniciar el worker
nx serve worker

# Terminal 2: Ejecutar tests
nx e2e worker-e2e
# O también puedes usar:
nx test worker-e2e
```

## Tests Incluidos

### 1. Worker Infrastructure
- Verifica conexión a Redis
- Verifica conexión a MongoDB
- Verifica conexión a MinIO

### 2. Queue Configuration
- Verifica que la cola `image-processing` esté configurada
- Prueba agregar un job de prueba a la cola

### 3. Worker Dependencies
- Verifica variables de entorno requeridas
- Valida constantes de configuración

### 4. Worker Process
- Verifica que el proceso del worker pueda iniciar

## Configuración

Variables de entorno disponibles:

- `REDIS_HOST`: Host de Redis (default: `localhost`)
- `REDIS_PORT`: Puerto de Redis (default: `6379`)
- `MONGO_URI`: URI de MongoDB (default: `mongodb://localhost:27017/image-intelligence`)
- `MINIO_ENDPOINT`: Endpoint de MinIO (default: `localhost`)
- `MINIO_PORT`: Puerto de MinIO (default: `9000`)
- `MINIO_ACCESS_KEY`: Access key de MinIO (default: `minioadmin`)
- `MINIO_SECRET_KEY`: Secret key de MinIO (default: `minioadmin`)

## Estructura

```
worker-e2e/
├── src/
│   ├── worker/
│   │   └── worker.spec.ts      # Tests principales
│   └── support/
│       ├── global-setup.ts     # Setup antes de todos los tests
│       ├── global-teardown.ts   # Cleanup después de todos los tests
│       └── test-setup.ts       # Setup antes de cada suite
├── jest.config.cts              # Configuración de Jest
└── package.json
```

## Notas

- Los tests son **simples y funcionales**, no exhaustivos
- Están diseñados para **demostrar el funcionamiento** de tests E2E para workers en el monorepo
- Los tests verifican **conexiones a servicios**, no el procesamiento real de jobs
- Los tests son **tolerantes a fallos** cuando los servicios no están disponibles
- El worker no tiene endpoints HTTP, por lo que los tests se enfocan en infraestructura y configuración

## Diferencia con API E2E

A diferencia de los tests de la API que prueban endpoints HTTP, los tests del Worker se enfocan en:

- ✅ Conexiones a servicios externos
- ✅ Configuración de colas
- ✅ Capacidad de agregar jobs
- ✅ Variables de entorno y configuración

