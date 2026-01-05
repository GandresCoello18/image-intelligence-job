import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageAnalysisSchemaClass, ImageAnalysisSchema } from '@image-intelligence-v2/shared';
import { ImageProcessor } from './processors/image.processor';
import { ImageAnalyzerService } from './services/image.analyzer';
import { MinioStorageService, STORAGE_SERVICE_TOKEN } from '@image-intelligence-v2/storage';
import { IMAGE_PROCESSING_QUEUE_NAME } from '@image-intelligence-v2/queue';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageAnalysisSchemaClass.name, schema: ImageAnalysisSchema },
    ]),
    BullModule.registerQueue({
      name: IMAGE_PROCESSING_QUEUE_NAME,
    }),
  ],
  providers: [
    ImageProcessor,
    ImageAnalyzerService,
    {
      provide: 'ImageStorage',
      useExisting: MinioStorageService,
    },
  ],
  exports: [ImageAnalyzerService],
})
export class ImageModule {}
