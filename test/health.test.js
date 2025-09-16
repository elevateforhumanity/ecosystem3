
import request from 'supertest';
import { describe, test, expect, beforeAll } from 'vitest';
let app;
beforeAll(async () => {
  process.env.API_KEYS = 'test-key';
  app = (await import('../simple-server.cjs')).default || (await import('../simple-server.cjs'));
});

describe('Health Aggregator', () => {
  test('GET /api/healthz returns status ok and services', async () => {
    const res = await request(app).get('/api/healthz');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.services).toHaveProperty('api');
    expect(Array.isArray(res.body.checks)).toBe(true);
  });
});
