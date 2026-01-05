import { Module, Global } from '@nestjs/common';
import { MinioClientProvider } from './minio.providers';
import { MinioStorageService } from './storage.service';
import { STORAGE_SERVICE_TOKEN } from './storage.constants';

@Global()
@Module({
  providers: [
    MinioClientProvider,
    MinioStorageService,
    {
      provide: STORAGE_SERVICE_TOKEN,
      useExisting: MinioStorageService,
    },
  ],
  exports: [STORAGE_SERVICE_TOKEN, MinioStorageService],
})
export class StorageModule {}

