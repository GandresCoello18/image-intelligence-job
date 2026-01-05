import { Logger, Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageAnalysisSchemaClass, ImageAnalysisSchema } from '@image-intelligence-v2/shared';
import { ImageService } from './image.service';
import { MinioStorageService, STORAGE_SERVICE_TOKEN } from '@image-intelligence-v2/storage';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ImageAnalysisSchemaClass.name, schema: ImageAnalysisSchema },
        ]),
    ],
    controllers: [ImageController],
    providers: [
        ImageService,
        Logger,
        {
            provide: 'ImageStorage',
            useExisting: MinioStorageService,
        },
    ],
})
export class ImageModule {}
