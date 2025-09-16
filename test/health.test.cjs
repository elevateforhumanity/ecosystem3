const request = require('supertest');
const app = require('../simple-server.cjs');

describe('Health Aggregator', () => {
  test('GET /api/healthz returns status ok and services', async () => {
    const res = await request(app).get('/api/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.services).toHaveProperty('api');
    expect(Array.isArray(res.body.checks)).toBe(true);
  });
});
