const request = require('supertest');
const app = require('./simple-server.cjs');

console.log('Testing health endpoint with main server...');

async function runTest() {
  try {
    console.log('Making request to /health...');
    const res = await request(app).get('/health');
    console.log('Status:', res.status);
    console.log('Body:', JSON.stringify(res.body, null, 2));
    console.log('Headers:', JSON.stringify(res.headers, null, 2));

    if (res.status === 200 && res.body && res.body.status === 'ok') {
      console.log('✅ Health test PASSED!');
      process.exit(0);
    } else {
      console.log('❌ Health test FAILED!');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error during test:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

runTest();