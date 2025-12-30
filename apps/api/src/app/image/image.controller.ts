/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Post, Get, Param, Delete, UploadedFile, UseInterceptors, Logger } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {

  constructor(
    private readonly imageService: ImageService,
    private readonly logger: Logger,
  ) {}

  @Get()
  async list() {
    this.logger.log('Get - list - images');
    return this.imageService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    this.logger.log('Get - id - images');
    return this.imageService.findById(id);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: any) {
    this.logger.log('Post - upload - image');
    const filename = `${Date.now()}-${file.originalname}`;
    await this.imageService.processImage(filename, file.buffer);
    return { status: 'queued', filename };
  }

  @Delete(':id')
  async deleteOne(@Param('id') id: string) {
    this.logger.log('Delete - id - image');
    return this.imageService.deleteById(id);
  }
}
