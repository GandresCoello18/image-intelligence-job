import { Inject, Injectable, Logger } from '@nestjs/common';
import { QueueService } from '@image-intelligence-v2/queue';
import { IMAGE_BUCKET } from '@image-intelligence-v2/storage';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageAnalysisSchemaClass } from '@image-intelligence-v2/shared';
import type { StorageService } from '@image-intelligence-v2/storage';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(ImageAnalysisSchemaClass.name)
    private readonly imageModel: Model<ImageAnalysisSchemaClass>,
    @Inject('ImageStorage')
    private readonly storage: StorageService,
    private readonly queueService: QueueService,
    private readonly logger: Logger,
  ) {}

  async findAll() {
    this.logger.log('ImageService - find all images');
    const dataImages = await this.imageModel
      .find()
      .sort({ createdAt: -1 })
      .lean();

      return Promise.all(
        dataImages.map(async (image) => ({
          ...image,
          imageUrl: await this.storage.getPresignedUrl(image.filename),
        })),
      );
  }

  async findById(id: string) {
    this.logger.log('ImageService - find one image');
    const image = await this.imageModel.findById(id).lean();

    if (!image) return null;

    return {
      ...image,
      imageUrl: await this.storage.getPresignedUrl(image.filename),
    };
  }

  async deleteById(id: string) {
    this.logger.log('ImageService - find one image');
    const image = await this.imageModel.findById(id).lean();

    if (!image) return null;

    await this.imageModel.deleteOne({ _id: id });
    await this.storage.delete(image.filename);

    return {
      success: true,
      message: 'Image Remove'
    };
  }

  async processImage(filename: string, buffer: Buffer) {
    this.logger.log('ImageService - Uploading image');
    await this.storage.upload(filename, buffer);

    this.logger.log('ImageService - Processing Queue Image');
    await this.queueService.addImageProcessingJob({
      bucket: IMAGE_BUCKET,
      filename,
    });
  }
}
