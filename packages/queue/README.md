# Queue Package

## Propósito

Este package proporciona una abstracción completa para el manejo de colas de tareas usando **BullMQ** y **Redis**. Ofrece un módulo NestJS reutilizable que encapsula la configuración y operaciones de colas, permitiendo desacoplar la lógica de procesamiento asíncrono de las aplicaciones.

## Características

- ✅ **Módulo NestJS Global**: Configuración centralizada de BullMQ
- ✅ **QueueService**: Servicio inyectable para operaciones de cola
- ✅ **Configuración mediante ConfigModule**: Soporte para variables de entorno
- ✅ **Retry Policies**: Reintentos automáticos con backoff exponencial
- ✅ **Limpieza automática**: Gestión de jobs completados y fallidos
- ✅ **Tipado fuerte**: Uso de DTOs compartidos para los jobs

## Uso

### Importar el módulo

```typescript
import { QueueModule } from '@image-intelligence-v2/queue';

@Module({
  imports: [QueueModule],
  // ...
})
export class AppModule {}
```

### Usar QueueService

```typescript
import { QueueService } from '@image-intelligence-v2/queue';
import { ImageJobDto } from '@image-intelligence-v2/shared';

@Injectable()
export class MyService {
  constructor(private readonly queueService: QueueService) {}

  async addJob(data: ImageJobDto) {
    const job = await this.queueService.addImageProcessingJob(data);
    return job;
  }

  async getJobStatus(jobId: string) {
    return await this.queueService.getJobStatus(jobId);
  }
}
```

## Configuración

El módulo requiere las siguientes variables de entorno:

- `REDIS_HOST`: Host de Redis (default: `localhost`)
- `REDIS_PORT`: Puerto de Redis (default: `6379`)

## Estructura

```
queue/
├── src/
│   ├── lib/
│   │   ├── queue.module.ts       # Módulo NestJS global
│   │   ├── queue.service.ts       # Servicio principal
│   │   ├── queue.providers.ts     # Providers de BullMQ
│   │   ├── queue.config.ts        # Configuración
│   │   └── queue.constants.ts     # Constantes (nombres de colas, tokens)
│   └── index.ts
```

## Colas Disponibles

- `image-processing`: Cola para procesamiento de imágenes

## Dependencias

- `@nestjs/bullmq`: Integración de BullMQ con NestJS
- `bullmq`: Cliente de colas para Redis
- `@nestjs/config`: Gestión de configuración
