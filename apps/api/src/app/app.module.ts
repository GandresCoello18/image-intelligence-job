import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from './image/image.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueModule } from '@image-intelligence-v2/queue';
import { StorageModule } from '@image-intelligence-v2/storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    QueueModule,
    StorageModule,
    ImageModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
