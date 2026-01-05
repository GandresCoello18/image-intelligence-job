# API E2E Tests

Tests end-to-end simples para la API de Image Intelligence Platform.

## Propósito

Estos tests E2E verifican que los endpoints principales de la API funcionen correctamente. Son tests simples diseñados para:

- ✅ Verificar que la API esté corriendo
- ✅ Probar los endpoints principales (GET, POST, DELETE)
- ✅ Validar la estructura de respuestas
- ✅ Demostrar cómo funcionan los tests E2E en el monorepo

## Requisitos

Antes de ejecutar los tests, asegúrate de tener:

1. **API corriendo**: La API debe estar disponible en `http://localhost:3000`
2. **Servicios de infraestructura** (opcional para algunos tests):
   - MongoDB en `localhost:27017`
   - Redis en `localhost:6379`
   - MinIO en `localhost:9000`

> **Nota**: Los tests están diseñados para ser tolerantes a fallos. Si los servicios no están disponibles, algunos tests pueden fallar pero otros seguirán funcionando.

## Ejecutar Tests

### Opción 1: Con Nx (Recomendado)

```bash
# Ejecutar tests E2E (inicia la API automáticamente)
nx e2e api-e2e
```

### Opción 2: Manual

```bash
# Terminal 1: Iniciar la API
nx serve api

# Terminal 2: Ejecutar tests
nx e2e api-e2e
# O también puedes usar:
nx test api-e2e
```

## Tests Incluidos

### 1. Health Check
- Verifica que la API esté accesible

### 2. GET /api/images
- Lista todas las imágenes procesadas
- Valida estructura de respuesta

### 3. POST /api/images/upload
- Prueba subida de imagen
- Valida respuesta de cola

### 4. GET /api/images/:id
- Obtiene detalles de una imagen específica
- Maneja casos de imagen no encontrada

### 5. DELETE /api/images/:id
- Elimina una imagen
- Maneja casos de imagen no encontrada

## Configuración

Variables de entorno disponibles:

- `API_URL`: URL base de la API (default: `http://localhost:3000/api`)
- `HOST`: Host de la API (default: `localhost`)
- `PORT`: Puerto de la API (default: `3000`)

## Estructura

```
api-e2e/
├── src/
│   ├── api/
│   │   └── api.spec.ts      # Tests principales
│   └── support/
│       ├── global-setup.ts  # Setup antes de todos los tests
│       ├── global-teardown.ts # Cleanup después de todos los tests
│       └── test-setup.ts    # Setup antes de cada suite
├── jest.config.cts          # Configuración de Jest
└── package.json
```

## Notas

- Los tests son **simples y funcionales**, no exhaustivos
- Están diseñados para **demostrar el funcionamiento** de tests E2E en el monorepo
- Algunos tests pueden requerir servicios externos (MongoDB, Redis, MinIO)
- Los tests son **tolerantes a fallos** cuando los servicios no están disponibles

