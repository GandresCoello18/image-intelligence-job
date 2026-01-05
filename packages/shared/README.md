# Shared Package

## Propósito

Este package contiene código compartido entre las diferentes aplicaciones del monorepo. Incluye DTOs (Data Transfer Objects), schemas de base de datos, interfaces y tipos comunes que son utilizados por múltiples módulos.

## Características

- ✅ **DTOs compartidos**: Tipos de datos para comunicación entre servicios
- ✅ **Schemas de MongoDB**: Definiciones de modelos compartidos
- ✅ **Tipos e interfaces**: Contratos comunes entre aplicaciones
- ✅ **Zero dependencies**: No tiene dependencias externas (excepto decoradores de NestJS/Mongoose)

## Contenido

### DTOs

#### `ImageJobDto`

DTO para los jobs de procesamiento de imágenes en la cola.

```typescript
interface ImageJobDto {
  bucket: string;
  filename: string;
}
```

### Schemas

#### `ImageAnalysisSchema`

Schema de MongoDB para almacenar los resultados del análisis de imágenes.

**Campos:**
- `filename`: Nombre del archivo (requerido)
- `bucket`: Bucket donde se almacena la imagen
- `metadata`: Metadatos de la imagen (formato, dimensiones, etc.)
- `palette`: Paleta de colores extraída
- `brightness`: Nivel de brillo (`bright` | `dark`)
- `hash`: Hash SHA-256 de la imagen
- `createdAt`: Fecha de creación (automático)
- `updatedAt`: Fecha de actualización (automático)

## Uso

### Importar DTOs

```typescript
import { ImageJobDto } from '@image-intelligence-v2/shared';
```

### Importar Schemas

```typescript
import { 
  ImageAnalysisSchemaClass, 
  ImageAnalysisSchema 
} from '@image-intelligence-v2/shared';

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: ImageAnalysisSchemaClass.name, 
        schema: ImageAnalysisSchema 
      },
    ]),
  ],
})
export class MyModule {}
```

## Estructura

```
shared/
├── src/
│   ├── lib/
│   │   ├── image-job.dto.ts              # DTO para jobs de imágenes
│   │   ├── schemas/
│   │   │   └── image-analysis.schema.ts   # Schema de MongoDB
│   │   └── shared.module.ts              # Módulo compartido (vacío)
│   └── index.ts
```

## Principios

1. **Inmutabilidad**: Los DTOs y schemas son definiciones de contrato
2. **Reutilización**: Cualquier código compartido entre apps debe estar aquí
3. **Simplicidad**: Mantener el package ligero y sin lógica de negocio
4. **Tipado fuerte**: Todo debe estar tipado con TypeScript

## Dependencias

- `@nestjs/mongoose`: Decoradores para schemas de MongoDB
- `mongoose`: Tipos de TypeScript para Mongoose
