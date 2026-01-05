module.exports = async function () {
  console.log(globalThis.__TEARDOWN_MESSAGE__);
  console.log('✅ Worker E2E tests completed\n');
};
