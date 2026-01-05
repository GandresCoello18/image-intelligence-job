/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from 'minio';
import { MINIO_CLIENT_TOKEN } from './storage.constants';
import { IMAGE_BUCKET } from '../minio.client';
import type { StorageService } from './storage.interface';
import { Readable } from 'stream';

@Injectable()
export class MinioStorageService implements StorageService, OnModuleInit {
  private readonly logger = new Logger(MinioStorageService.name);

  constructor(
    @Inject(MINIO_CLIENT_TOKEN)
    private readonly minio: Client,
  ) {}

  async onModuleInit() {
    await this.ensureBucketExists();
  }

  private async ensureBucketExists(): Promise<void> {
    const exists = await this.minio.bucketExists(IMAGE_BUCKET);
    if (!exists) {
      this.logger.log(`Creating bucket: ${IMAGE_BUCKET}`);
      await this.minio.makeBucket(IMAGE_BUCKET, 'us-east-1');
      this.logger.log(`Bucket ${IMAGE_BUCKET} created successfully`);
    }
  }

  async getPresignedUrl(
    filename: string,
    expiryInSeconds: number = 3600,
  ): Promise<string> {
    return this.minio.presignedGetObject(IMAGE_BUCKET, filename, expiryInSeconds);
  }

  async upload(filename: string, buffer: Buffer): Promise<void> {
    await this.minio.putObject(IMAGE_BUCKET, filename, buffer, buffer.length, {
      'Content-Type': 'application/octet-stream',
    });
  }

  async delete(filename: string): Promise<void> {
    await this.minio.removeObject(IMAGE_BUCKET, filename);
  }

  async getObject(filename: string): Promise<Readable> {
    return this.minio.getObject(IMAGE_BUCKET, filename);
  }

  async exists(filename: string): Promise<boolean> {
    try {
      await this.minio.statObject(IMAGE_BUCKET, filename);
      return true;
    } catch (error) {
      return false;
    }
  }
}

