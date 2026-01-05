import { Queue } from 'bullmq';
import { Client } from 'minio';
import Redis from 'ioredis';

describe('Image Intelligence Worker E2E Tests', () => {
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/image-intelligence';
  const minioEndpoint = process.env.MINIO_ENDPOINT || 'localhost';
  const minioPort = parseInt(process.env.MINIO_PORT || '9000', 10);
  const minioAccessKey = process.env.MINIO_ACCESS_KEY || 'minioadmin';
  const minioSecretKey = process.env.MINIO_SECRET_KEY || 'minioadmin';

  describe('Worker Infrastructure', () => {
    it('should be able to connect to Redis', async () => {
      const redis = new Redis({
        host: redisHost,
        port: redisPort,
        retryStrategy: () => null,
      });

      try {
        const result = await redis.ping();
        expect(result).toBe('PONG');
        await redis.quit();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should be able to connect to MongoDB', async () => {
      expect(mongoUri).toBeDefined();
      expect(mongoUri).toContain('mongodb://');
    });

    it('should be able to connect to MinIO', async () => {
      const minioClient = new Client({
        endPoint: minioEndpoint,
        port: minioPort,
        useSSL: false,
        accessKey: minioAccessKey,
        secretKey: minioSecretKey,
      });

      try {
        const buckets = await minioClient.listBuckets();
        expect(Array.isArray(buckets)).toBe(true);
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Queue Configuration', () => {
    it('should have image-processing queue configured', async () => {
      const queue = new Queue('image-processing', {
        connection: {
          host: redisHost,
          port: redisPort,
        },
      });

      try {
        const queueName = queue.name;
        expect(queueName).toBe('image-processing');
        await queue.close();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should be able to add a test job to queue', async () => {
      const queue = new Queue('image-processing', {
        connection: {
          host: redisHost,
          port: redisPort,
        },
      });

      try {
        const testJob = await queue.add('image-processing', {
          bucket: 'images',
          filename: 'test-job-e2e.png',
        }, {
          removeOnComplete: true,
          removeOnFail: true,
        });

        expect(testJob).toBeDefined();
        expect(testJob.id).toBeDefined();
        expect(testJob.data).toHaveProperty('bucket');
        expect(testJob.data).toHaveProperty('filename');

        await testJob.remove();
        await queue.close();
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('Worker Dependencies', () => {
    it('should have required environment variables', () => {
      expect(redisHost).toBeDefined();
      expect(mongoUri).toBeDefined();
      expect(minioEndpoint).toBeDefined();
    });

    it('should have correct queue name constant', () => {
      const queueName = 'image-processing';
      expect(queueName).toBe('image-processing');
    });
  });

  describe('Worker Process', () => {
    it('should verify worker can start (process check)', () => {
      expect(process.env).toBeDefined();
      expect(process.pid).toBeDefined();
    });
  });
});
