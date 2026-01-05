import { waitForPortOpen } from '@nx/node/utils';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Wait for required services to be ready
  console.log('\n🔧 Setting up Worker E2E test environment...\n');

  const redisHost = process.env.REDIS_HOST ?? 'localhost';
  const redisPort = process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379;
  const mongoHost = 'localhost';
  const mongoPort = 27017;
  const minioHost = process.env.MINIO_ENDPOINT ?? 'localhost';
  const minioPort = process.env.MINIO_PORT ? Number(process.env.MINIO_PORT) : 9000;

  console.log('⏳ Waiting for required services...');

  try {
    console.log(`   Checking Redis at ${redisHost}:${redisPort}...`);
    await waitForPortOpen(redisPort, { host: redisHost, timeout: 10000 });
    console.log(`   ✅ Redis is ready`);
  } catch (error) {
    console.warn(`   ⚠️  Redis not available at ${redisHost}:${redisPort}`);
    console.warn('   Some tests may fail. Make sure Redis is running: docker-compose up -d redis\n');
  }

  try {
    console.log(`   Checking MongoDB at ${mongoHost}:${mongoPort}...`);
    await waitForPortOpen(mongoPort, { host: mongoHost, timeout: 10000 });
    console.log(`   ✅ MongoDB is ready`);
  } catch (error) {
    console.warn(`   ⚠️  MongoDB not available at ${mongoHost}:${mongoPort}`);
    console.warn('   Some tests may fail. Make sure MongoDB is running: docker-compose up -d mongodb\n');
  }

  try {
    console.log(`   Checking MinIO at ${minioHost}:${minioPort}...`);
    await waitForPortOpen(minioPort, { host: minioHost, timeout: 10000 });
    console.log(`   ✅ MinIO is ready`);
  } catch (error) {
    console.warn(`   ⚠️  MinIO not available at ${minioHost}:${minioPort}`);
    console.warn('   Some tests may fail. Make sure MinIO is running: docker-compose up -d minio\n');
  }

  console.log('\n✅ Worker E2E test environment ready\n');

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\n🧹 Tearing down Worker E2E test environment...\n';
};
