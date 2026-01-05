module.exports = async function () {
  process.env.NODE_ENV = 'test';
  if (!process.env.API_URL) {
    const host = process.env.HOST ?? 'localhost';
    const port = process.env.PORT ?? '3000';
    process.env.API_URL = `http://${host}:${port}/api`;
  }

  console.log(`\n🧪 Running E2E tests against: ${process.env.API_URL}\n`);
};
