module.exports = async function () {
  process.env.NODE_ENV = 'test';
  if (!process.env.REDIS_HOST) {
    process.env.REDIS_HOST = 'localhost';
  }
  if (!process.env.REDIS_PORT) {
    process.env.REDIS_PORT = '6379';
  }
  if (!process.env.MONGO_URI) {
    process.env.MONGO_URI = 'mongodb://localhost:27017/image-intelligence';
  }
  if (!process.env.MINIO_ENDPOINT) {
    process.env.MINIO_ENDPOINT = 'localhost';
  }
  if (!process.env.MINIO_PORT) {
    process.env.MINIO_PORT = '9000';
  }

  console.log(`\n🧪 Running Worker E2E tests\n`);
  console.log(`   Redis: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
  console.log(`   MongoDB: ${process.env.MONGO_URI}`);
  console.log(`   MinIO: ${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}\n`);
};
