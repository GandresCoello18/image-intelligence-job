import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import { QUEUE_TOKEN, IMAGE_PROCESSING_QUEUE_NAME } from './queue.constants';

export const QueueProvider: Provider = {
  provide: QUEUE_TOKEN,
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return new Queue(IMAGE_PROCESSING_QUEUE_NAME, {
      connection: {
        host: configService.get<string>('REDIS_HOST', 'localhost'),
        port: configService.get<number>('REDIS_PORT', 6379),
      },
    });
  },
};

