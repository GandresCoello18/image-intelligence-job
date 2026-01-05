# Image Intelligence Platform

<img width="700" height="519" alt="Result App" src="https://github.com/user-attachments/assets/28794e87-d99b-4c4b-94cc-af5a6d2a58bc" />

## 📋 Tabla de Contenidos

- [1. Resumen Ejecutivo](#1-resumen-ejecutivo)
- [2. Qué problema resuelve](#2-qué-problema-resuelve)
- [3. Arquitectura General](#3-arquitectura-general)
- [4. Flujo de la aplicación](#4-flujo-de-la-aplicación)
- [5. Tecnologías utilizadas](#5-tecnologías-utilizadas)
- [6. Estructura del Monorepo](#6-estructura-del-monorepo)
- [7. Instalación y Configuración](#7-instalación-y-configuración)
- [8. Uso](#8-uso)
- [9. Endpoints principales](#9-endpoints-principales)
- [10. Diseño de datos](#10-diseño-de-datos)
- [11. Decisiones de arquitectura](#11-decisiones-de-arquitectura)
- [12. Packages compartidos](#12-packages-compartidos)
- [13. Estado actual del proyecto](#13-estado-actual-del-proyecto)
- [14. Próximos pasos (roadmap)](#14-próximos-pasos-roadmap)

---

## 1. Resumen Ejecutivo

**Image Intelligence Platform** es una plataforma completa para el análisis automático de imágenes. Permite recibir imágenes desde múltiples clientes, procesarlas de forma asíncrona y escalable, extraer información relevante (metadatos, colores dominantes, paleta, brillo, hash, etc.), almacenarlas de manera eficiente y exponer los resultados a través de una API REST y una interfaz web.

El proyecto está diseñado con una **arquitectura moderna, desacoplada y escalable**, inspirada en sistemas reales de producción:

* ✅ Procesamiento asíncrono mediante colas (BullMQ + Redis)
* ✅ Separación clara de responsabilidades (API, Worker, Web)
* ✅ Uso de almacenamiento de objetos para binarios (MinIO)
* ✅ Persistencia flexible para datos de análisis (MongoDB)
* ✅ Packages compartidos reutilizables
* ✅ Interfaz web ligera para interacción

Esta solución es ideal como base para sistemas de **Computer Vision**, **IA aplicada a imágenes**, **moderación de contenido**, **clasificación visual** o **análisis multimedia**.

---

## 2. Qué problema resuelve

Procesar imágenes de forma síncrona suele generar:

* ❌ APIs lentas y bloqueantes
* ❌ Alto consumo de memoria en el servidor
* ❌ Poca escalabilidad
* ❌ Mala experiencia de usuario

**Image Intelligence Platform** resuelve esto mediante:

* ✅ Procesamiento en segundo plano (workers asíncronos)
* ✅ Almacenamiento eficiente de imágenes (Object Storage)
* ✅ Persistencia flexible de resultados (NoSQL)
* ✅ Arquitectura preparada para crecer (IA, ML, búsquedas avanzadas)
* ✅ Interfaz web para interacción directa

---

## 3. Arquitectura General

La aplicación está construida como un **monorepo con Nx**, lo que permite compartir código entre aplicaciones y mantener una estructura clara y mantenible.

### Componentes principales

#### 1. **API (NestJS)** - Puerto 3000
   * Recibe imágenes desde clientes
   * Almacena imágenes en MinIO
   * Publica jobs en una cola (Redis)
   * Expone endpoints REST para consulta
   * **No procesa imágenes** (desacoplado)

#### 2. **Worker (NestJS + BullMQ)** - Procesamiento asíncrono
   * Consume jobs desde Redis
   * Descarga imágenes desde MinIO
   * Analiza imágenes (Sharp + Canvas)
   * Extrae metadatos, colores, paleta, brillo
   * Guarda resultados en MongoDB
   * **Stateless y escalable**

#### 3. **Web (Fastify + Pug)** - Puerto 3001
   * Interfaz web ligera y moderna
   * Visualización de imágenes procesadas
   * Subida de imágenes
   * Eliminación de imágenes
   * Diseño responsive

#### 4. **Redis**
   * Coordinación de trabajos (BullMQ)
   * Cola de procesamiento asíncrono
   * Retry policies y manejo de errores

#### 5. **MinIO**
   * Almacenamiento de imágenes (Object Storage compatible con S3)
   * URLs pre-firmadas para acceso temporal
   * Bucket automático

#### 6. **MongoDB**
   * Persistencia de resultados de análisis
   * Esquema flexible (documental)
   * Sin migraciones complejas

<img width="524" height="1036" alt="Arquitectura monorepo" src="https://github.com/user-attachments/assets/19212139-50df-46af-b7d1-121e09e3ba3c" />

---

## 4. Flujo de la aplicación

### Flujo completo:

1. **Cliente envía imagen** (API o Web)
   - API: `POST /api/images/upload`
   - Web: Formulario en `http://localhost:3001/upload`

2. **API procesa la solicitud:**
   - Guarda la imagen en MinIO
   - Crea un job en la cola (Redis)
   - Retorna respuesta inmediata

3. **Worker consume el job:**
   - Descarga la imagen desde MinIO
   - Analiza la imagen (metadatos, colores, paleta, brillo, hash)
   - Guarda resultados en MongoDB

4. **Cliente consulta resultados:**
   - API: `GET /api/images` o `GET /api/images/:id`
   - Web: Visualización en `http://localhost:3001/`

Este flujo desacopla completamente la recepción de imágenes del procesamiento pesado, permitiendo escalar cada componente independientemente.

---

## 5. Tecnologías utilizadas

### Backend

* **Node.js** - Runtime
* **TypeScript (strict)** - Lenguaje tipado
* **NestJS** - Framework para API y Worker
* **Fastify** - Framework web ligero para la app web
* **Nx Monorepo** - Gestión de monorepo

### Procesamiento asíncrono

* **BullMQ** - Sistema de colas robusto
* **Redis** - Broker de mensajes

### Procesamiento de imágenes

* **Sharp** - Procesamiento de imágenes
* **Canvas** - Análisis de colores y paleta

### Almacenamiento

* **MinIO** - Object Storage (compatible con S3)
* **MongoDB** - Base de datos documental

### Frontend Web

* **Pug** - Motor de plantillas
* **CSS3** - Estilos modernos y responsive
* **Axios** - Cliente HTTP

### Infraestructura

* **Docker / Docker Compose** - Contenedores
* **Webpack** - Bundling

---

## 6. Estructura del Monorepo

```
image-intelligence-v2/
├─ apps/
│  ├─ api/              # API REST (NestJS) - Puerto 3000
│  ├─ worker/           # Worker de procesamiento (NestJS) - Asíncrono
│  ├─ web/              # Interfaz web (Fastify + Pug) - Puerto 3001
│  ├─ api-e2e/          # Tests E2E de la API
│  └─ worker-e2e/       # Tests E2E del Worker
│
├─ packages/
│  ├─ shared/           # DTOs, Schemas y tipos compartidos
│  ├─ queue/            # Módulo de colas (BullMQ) - Reutilizable
│  └─ storage/          # Módulo de almacenamiento (MinIO) - Reutilizable
│
├─ docker-compose.yml    # Servicios de infraestructura
├─ nx.json              # Configuración de Nx
└─ package.json         # Dependencias del workspace
```

### Características de los packages:

* **shared**: DTOs, schemas de MongoDB, interfaces compartidas
* **queue**: Módulo NestJS completo para manejo de colas con BullMQ
* **storage**: Módulo NestJS completo para almacenamiento con MinIO

---

## 7. Instalación y Configuración

### Prerrequisitos

* Node.js 20+
* Docker y Docker Compose
* npm o yarn

### Pasos de instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd image-intelligence-v2
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar servicios de infraestructura:**
   ```bash
   docker-compose up -d
   ```
   
   Esto iniciará:
   - Redis en `localhost:6379`
   - MongoDB en `localhost:27017`
   - MinIO en `localhost:9000` (API) y `localhost:9001` (Console)

4. **Configurar variables de entorno:**
   
   Crear archivos `.env` en cada app o usar variables de sistema:
   
   **API (`apps/api`):**
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/image-intelligence
   REDIS_HOST=localhost
   REDIS_PORT=6379
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_SSL=false
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin
   ```
   
   **Worker (`apps/worker`):**
   ```env
   MONGO_URI=mongodb://localhost:27017/image-intelligence
   REDIS_HOST=localhost
   REDIS_PORT=6379
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_SSL=false
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin
   ```
   
   **Web (`apps/web`):**
   ```env
   PORT=3001
   API_URL=http://localhost:3000/api
   NODE_ENV=development
   ```

---

## 8. Uso

### Desarrollo

**Iniciar todos los servicios:**

```bash
# Terminal 1: API
nx serve api

# Terminal 2: Worker
nx serve worker

# Terminal 3: Web
nx serve web
```

**O usar comandos individuales:**

```bash
# API REST
nx serve api
# Disponible en: http://localhost:3000/api

# Worker
nx serve worker
# Escucha jobs automáticamente

# Interfaz Web
nx serve web
# Disponible en: http://localhost:3001
```

### Producción

```bash
# Build de todas las apps
nx build api
nx build worker
nx build web

# Ejecutar
node dist/apps/api/main.js
node dist/apps/worker/main.js
node dist/apps/web/main.js
```

### Acceso a servicios

* **API REST**: http://localhost:3000/api
* **Interfaz Web**: http://localhost:3001
* **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)
* **MongoDB**: mongodb://localhost:27017
* **Redis**: localhost:6379

---

## 9. Endpoints principales

### API REST (`/api`)

| Método    | Endpoint         | Descripción                                               |
| --------- | ---------------- | --------------------------------------------------------- |
| POST      | /images/upload   | Sube imagen y crea job de procesamiento                   |
| GET       | /images          | Lista todas las imágenes analizadas con URLs pre-firmadas |
| GET       | /images/:id      | Detalle de análisis + URL de imagen original              |
| DELETE   | /images/:id      | Elimina registro y imagen de MinIO                       |

### Interfaz Web (`/`)

| Ruta              | Descripción                                    |
| ----------------- | ---------------------------------------------- |
| GET /             | Listado de imágenes procesadas                 |
| GET /upload       | Formulario de subida de imágenes               |
| POST /upload      | Endpoint para subir imagen                     |
| POST /delete/:id  | Eliminar imagen por ID                         |
| GET /health       | Health check                                   |

### Ejemplos de uso

**Subir imagen (API):**
```bash
curl -X POST http://localhost:3000/api/images/upload \
  -F "file=@imagen.jpg"
```

**Listar imágenes (API):**
```bash
curl http://localhost:3000/api/images
```

**Obtener imagen específica (API):**
```bash
curl http://localhost:3000/api/images/:id
```

---

## 10. Diseño de datos

### Imagen (MongoDB)

Cada imagen analizada se guarda como un documento flexible:

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "filename": "1764558900283.png",
  "bucket": "images",
  "metadata": {
    "format": "png",
    "size": 874354,
    "width": 800,
    "height": 800,
    "aspectRatio": 1,
    "orientation": "square",
    "hasAlpha": false,
    "dominantColor": { "r": 8, "g": 8, "b": 8 }
  },
  "palette": [
    { "r": 8, "g": 8, "b": 8 },
    { "r": 120, "g": 110, "b": 100 },
    { "r": 200, "g": 195, "b": 190 }
  ],
  "brightness": "dark",
  "hash": "3a6e205d28c9f8b5a1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4",
  "createdAt": "2025-12-28T21:10:00.000Z",
  "updatedAt": "2025-12-28T21:10:00.000Z"
}
```

### Job de cola (Redis)

```typescript
{
  bucket: "images",
  filename: "1764558900283.png"
}
```

Este diseño permite:

* ✅ Agregar nuevos campos sin migraciones
* ✅ Guardar resultados de IA futuros
* ✅ Versionar análisis
* ✅ Flexibilidad total en el esquema

---

## 11. Decisiones de arquitectura

### Principios clave

* ❌ **No se envían imágenes por Redis** - Solo referencias (bucket + filename)
* ✅ **Workers son stateless** - Fácil escalado horizontal
* ✅ **Separación clara API / Worker** - Desacoplamiento total
* ✅ **MongoDB para flexibilidad** - Sin migraciones complejas
* ✅ **MinIO para binarios** - Object Storage escalable
* ✅ **Packages compartidos** - Código reutilizable y mantenible
* ✅ **Monorepo con Nx** - Gestión centralizada

### Beneficios

Estas decisiones hacen que el sistema sea:

* 🚀 **Escalable**: Cada componente puede escalar independientemente
* 🔧 **Mantenible**: Código organizado y desacoplado
* 📈 **Extensible**: Fácil agregar nuevas funcionalidades
* 🧪 **Testeable**: Componentes aislados y testeables
* 🔄 **Reutilizable**: Packages compartidos entre apps

---

## 12. Packages compartidos

El proyecto utiliza packages compartidos para evitar duplicación de código:

### `@image-intelligence-v2/shared`

**Propósito**: DTOs, schemas y tipos compartidos entre aplicaciones.

**Contenido:**
* `ImageJobDto` - DTO para jobs de procesamiento
* `ImageAnalysisSchema` - Schema de MongoDB compartido
* Interfaces y tipos comunes

**Uso:**
```typescript
import { ImageJobDto, ImageAnalysisSchemaClass } from '@image-intelligence-v2/shared';
```

### `@image-intelligence-v2/queue`

**Propósito**: Módulo NestJS completo para manejo de colas con BullMQ.

**Características:**
* QueueModule global
* QueueService inyectable
* Configuración mediante ConfigModule
* Retry policies y limpieza automática

**Uso:**
```typescript
import { QueueModule, QueueService } from '@image-intelligence-v2/queue';
```

### `@image-intelligence-v2/storage`

**Propósito**: Módulo NestJS completo para almacenamiento con MinIO.

**Características:**
* StorageModule global
* StorageService con todas las operaciones
* Auto-creación de buckets
* URLs pre-firmadas

**Uso:**
```typescript
import { StorageModule, MinioStorageService } from '@image-intelligence-v2/storage';
```

Para más detalles, consulta los README.md de cada package.

---

## 13. Estado actual del proyecto

### ✅ Funcionalidades implementadas

* ✅ Recepción de imágenes (API REST)
* ✅ Almacenamiento en MinIO
* ✅ Procesamiento asíncrono (Workers)
* ✅ Extracción de metadatos (formato, dimensiones, tamaño)
* ✅ Análisis de colores (paleta, color dominante)
* ✅ Cálculo de brillo
* ✅ Generación de hash SHA-256
* ✅ Persistencia en MongoDB
* ✅ Endpoints de consulta
* ✅ Interfaz web para visualización
* ✅ Eliminación de imágenes
* ✅ Packages compartidos refactorizados
* ✅ Arquitectura desacoplada y escalable

### 📊 Métricas de análisis

Cada imagen procesada incluye:

* **Metadatos**: Formato, dimensiones, tamaño, aspect ratio, orientación
* **Colores**: Paleta de colores dominantes (RGB)
* **Brillo**: Clasificación (bright/dark)
* **Hash**: SHA-256 para identificación única

---

## 14. Próximos pasos (roadmap)

### Corto plazo

* [ ] Tests unitarios y de integración
* [ ] Health checks para todos los servicios
* [ ] Métricas y observabilidad (Prometheus/Grafana)
* [ ] Manejo de errores más robusto
* [ ] Validación de archivos mejorada

### Medio plazo

* [ ] Versionado de análisis
* [ ] Estados de job más avanzados
* [ ] Búsqueda por similitud de imágenes
* [ ] Paginación en endpoints
* [ ] Filtros y ordenamiento

### Largo plazo

* [ ] Integración con IA (clasificación, etiquetas)
* [ ] Detección de objetos
* [ ] OCR (reconocimiento de texto)
* [ ] Autenticación y autorización
* [ ] Rate limiting
* [ ] Webhooks para notificaciones
* [ ] Dashboard administrativo avanzado

---

## 🎯 Conclusión

**Image Intelligence Platform** demuestra:

* ✅ Dominio de arquitectura backend moderna
* ✅ Uso correcto de colas y workers
* ✅ Buenas prácticas en NestJS y Fastify
* ✅ Diseño orientado a escalabilidad
* ✅ Código limpio y mantenible
* ✅ Packages compartidos bien estructurados

Es una base sólida para sistemas reales de análisis de imágenes y aplicaciones con IA, lista para producción y escalamiento.

---

## 👨‍💻 Autores

- **Andrés Coello Goyes** - _SOFTWARE ENGINEER_ - [Andres Coello](https://linktr.ee/gandrescoello)

### 🔗 Links

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://andres-coello-goyes.vercel.app/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrescoellogoyes/)
[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://x.com/acoellogoyes)

## 🙏 Expresiones de Gratitud

- Pásate por mi perfil para ver algún otro proyecto 📢
- Desarrollemos alguna app juntos, puedes escribirme en mis redes
- Muchas gracias por pasarte por este proyecto 🤓

---

⌨️ con ❤️ por [Andres Coello Goyes](https://linktr.ee/gandrescoello) 😊

<img width="400" height="400" alt="1764558900283" src="https://github.com/user-attachments/assets/cde88968-7856-49ec-bdb1-53a82bf9caa3" />
