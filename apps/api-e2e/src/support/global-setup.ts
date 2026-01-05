import { waitForPortOpen } from '@nx/node/utils';

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string;

module.exports = async function () {
  // Wait for the API server to be ready
  console.log('\n🔧 Setting up E2E test environment...\n');

  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;
  
  console.log(`⏳ Waiting for API server at ${host}:${port}...`);
  
  try {
    await waitForPortOpen(port, { host, timeout: 30000 });
    console.log(`✅ API server is ready at ${host}:${port}\n`);
  } catch (error) {
    console.warn(`⚠️  Could not connect to API server at ${host}:${port}`);
    console.warn('   Make sure the API is running: nx serve api\n');
    throw error;
  }

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\n🧹 Tearing down E2E test environment...\n';
};
