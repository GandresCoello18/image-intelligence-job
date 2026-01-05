# Storage Package

## Propósito

Este package proporciona una abstracción completa para el almacenamiento de objetos usando **MinIO** (compatible con S3). Ofrece un módulo NestJS reutilizable que encapsula todas las operaciones de almacenamiento, permitiendo desacoplar la lógica de storage de las aplicaciones.

## Características

- ✅ **Módulo NestJS Global**: Configuración centralizada de MinIO
- ✅ **StorageService**: Servicio inyectable con todas las operaciones
- ✅ **Interface unificada**: Contrato claro para operaciones de storage
- ✅ **Auto-creación de buckets**: Crea el bucket automáticamente al iniciar
- ✅ **Configuración mediante ConfigModule**: Soporte para variables de entorno
- ✅ **Tipado fuerte**: Interfaces TypeScript para todas las operaciones

## Uso

### Importar el módulo

```typescript
import { StorageModule } from '@image-intelligence-v2/storage';

@Module({
  imports: [StorageModule],
  // ...
})
export class AppModule {}
```

### Usar StorageService

```typescript
import { 
  MinioStorageService, 
  STORAGE_SERVICE_TOKEN 
} from '@image-intelligence-v2/storage';

@Module({
  providers: [
    {
      provide: 'ImageStorage',
      useExisting: MinioStorageService,
    },
  ],
})
export class MyModule {}

// O inyectar directamente
@Injectable()
export class MyService {
  constructor(
    @Inject('ImageStorage')
    private readonly storage: StorageService,
  ) {}

  async uploadFile(filename: string, buffer: Buffer) {
    await this.storage.upload(filename, buffer);
  }

  async getFileUrl(filename: string) {
    return await this.storage.getPresignedUrl(filename);
  }

  async downloadFile(filename: string) {
    return await this.storage.getObject(filename);
  }

  async deleteFile(filename: string) {
    await this.storage.delete(filename);
  }

  async fileExists(filename: string) {
    return await this.storage.exists(filename);
  }
}
```

## Configuración

El módulo requiere las siguientes variables de entorno:

- `MINIO_ENDPOINT`: Endpoint de MinIO (default: `localhost`)
- `MINIO_PORT`: Puerto de MinIO (default: `9000`)
- `MINIO_SSL`: Usar SSL (default: `false`)
- `MINIO_ACCESS_KEY`: Access key de MinIO (default: `minioadmin`)
- `MINIO_SECRET_KEY`: Secret key de MinIO (default: `minioadmin`)

## Interface StorageService

```typescript
interface StorageService {
  getPresignedUrl(filename: string, expiryInSeconds?: number): Promise<string>;
  upload(filename: string, buffer: Buffer): Promise<void>;
  delete(filename: string): Promise<void>;
  getObject(filename: string): Promise<Readable>;
  exists(filename: string): Promise<boolean>;
}
```

## Operaciones Disponibles

### `upload(filename, buffer)`
Sube un archivo al storage.

### `getPresignedUrl(filename, expiryInSeconds?)`
Genera una URL pre-firmada para acceso temporal al archivo.

### `getObject(filename)`
Descarga un archivo como stream.

### `delete(filename)`
Elimina un archivo del storage.

### `exists(filename)`
Verifica si un archivo existe en el storage.

## Estructura

```
storage/
├── src/
│   ├── lib/
│   │   ├── storage.module.ts       # Módulo NestJS global
│   │   ├── storage.service.ts      # Implementación de MinIO
│   │   ├── storage.interface.ts    # Interface del servicio
│   │   ├── minio.providers.ts      # Providers de MinIO
│   │   └── storage.constants.ts    # Constantes (tokens, buckets)
│   ├── minio.client.ts             # Factory para crear cliente MinIO
│   └── index.ts
```

## Buckets

El servicio usa el bucket `images` por defecto, definido en la constante `IMAGE_BUCKET`.

El bucket se crea automáticamente al iniciar el módulo si no existe.

## Dependencias

- `minio`: Cliente de MinIO (compatible con S3)
- `@nestjs/common`: Decoradores y utilidades de NestJS
- `@nestjs/config`: Gestión de configuración
