import { Injectable, Inject, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QUEUE_TOKEN, IMAGE_PROCESSING_QUEUE_NAME } from './queue.constants';
import { ImageJobDto } from '@image-intelligence-v2/shared';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @Inject(QUEUE_TOKEN)
    private readonly queue: Queue,
  ) {}

  async addImageProcessingJob(data: ImageJobDto) {
    this.logger.log(`Adding image processing job for file: ${data.filename}`);
    
    const job = await this.queue.add(IMAGE_PROCESSING_QUEUE_NAME, data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: {
        age: 3600,
        count: 1000,
      },
      removeOnFail: {
        age: 24 * 3600,
      },
    });

    this.logger.log(`Job ${job.id} added to queue`);
    return job;
  }

  async getJobStatus(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (!job) {
      return null;
    }

    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress,
      data: job.data,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
    };
  }
}
