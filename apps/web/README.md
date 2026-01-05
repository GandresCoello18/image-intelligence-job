# Web Application

## Propósito

Aplicación web ligera construida con **Fastify** y **Pug** que proporciona una interfaz visual para interactuar con la API de procesamiento de imágenes. Permite visualizar imágenes procesadas, subir nuevas imágenes y eliminar imágenes existentes.

## Características

- ✅ **Interfaz visual moderna**: Diseño limpio y responsive
- ✅ **Listado de imágenes**: Visualiza todas las imágenes procesadas con sus metadatos
- ✅ **Subida de imágenes**: Formulario para subir nuevas imágenes
- ✅ **Eliminación de imágenes**: Elimina imágenes con confirmación
- ✅ **Manejo de errores**: Mensajes de error y éxito claros
- ✅ **Responsive**: Diseño adaptativo para móviles y desktop

## Tecnologías

- **Fastify**: Framework web rápido y eficiente
- **Pug**: Motor de plantillas
- **Axios**: Cliente HTTP para comunicarse con la API
- **CSS3**: Estilos modernos con variables CSS

## Estructura

```
web/
├── src/
│   ├── routes/
│   │   └── images.routes.ts    # Rutas de la aplicación
│   ├── services/
│   │   └── api.service.ts      # Servicio para comunicarse con la API
│   ├── views/
│   │   ├── layout.pug          # Layout principal
│   │   └── images/
│   │       ├── list.pug        # Vista de listado
│   │       └── upload.pug      # Vista de subida
│   ├── public/
│   │   └── css/
│   │       └── style.css       # Estilos
│   └── main.ts                 # Punto de entrada
```

## Configuración

### Variables de Entorno

- `PORT`: Puerto del servidor (default: `3001`)
- `HOST`: Host del servidor (default: `0.0.0.0`)
- `API_URL`: URL de la API backend (default: `http://localhost:3000/api`)
- `LOG_LEVEL`: Nivel de logging (default: `info`)
- `NODE_ENV`: Entorno de ejecución (`development` | `production`)

### Ejemplo

```bash
PORT=3001 API_URL=http://localhost:3000/api npm run serve
```

## Uso

### Desarrollo

```bash
nx serve web
```

### Producción

```bash
nx build web
node dist/apps/web/main.js
```

## Rutas

- `GET /` - Listado de imágenes procesadas
- `GET /upload` - Formulario de subida de imágenes
- `POST /upload` - Endpoint para subir imagen
- `POST /delete/:id` - Eliminar imagen por ID
- `GET /health` - Health check endpoint

## Dependencias

- `fastify`: Framework web
- `@fastify/view`: Plugin para vistas
- `@fastify/static`: Plugin para archivos estáticos
- `@fastify/formbody`: Plugin para formularios
- `@fastify/multipart`: Plugin para multipart/form-data
- `@fastify/sensible`: Plugin con utilidades sensibles
- `pug`: Motor de plantillas
- `axios`: Cliente HTTP
- `form-data`: Para envío de archivos

