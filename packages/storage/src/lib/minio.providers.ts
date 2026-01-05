import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { createMinioClient, MinioConfig } from '../minio.client';
import { MINIO_CLIENT_TOKEN } from './storage.constants';

export const MinioClientProvider: Provider = {
  provide: MINIO_CLIENT_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): Client => {
    const config: MinioConfig = {
      endPoint: configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: configService.get<number>('MINIO_PORT', 9000),
      useSSL: configService.get<string>('MINIO_SSL', 'false') === 'true',
      accessKey: configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: configService.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    };

    return createMinioClient(config);
  },
};

