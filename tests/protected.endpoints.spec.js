import request from 'supertest';
import { describe, test, beforeAll, afterAll, expect } from 'vitest';

let app;
describe('Protected API key endpoints', () => {
  const apiKey = 'testkey123';
  const OLD = process.env.API_KEYS;
  beforeAll(async () => {
    process.env.API_KEYS = `admin:${apiKey}`;
    // Dynamic import after env set so server picks up keys
    app = (await import('../simple-server.cjs')).default || (await import('../simple-server.cjs'));
  });
  afterAll(() => { process.env.API_KEYS = OLD; });

  test('rejects without api key', async () => {
    const res = await request(app).get('/api/protected/financial/revenue');
    expect(res.status).toBe(401);
  });

  test('allows with api key', async () => {
    const res = await request(app).get('/api/protected/financial/revenue').set('x-api-key', apiKey);
    expect(res.status).toBe(200);
    expect(res.body.revenue).toBeDefined();
  });

  test('audit log accessible with api key', async () => {
    const res = await request(app).get('/api/protected/audit/logs').set('x-api-key', apiKey);
    expect(res.status).toBe(200);
    expect(res.body.events).toBeInstanceOf(Array);
  });
});
