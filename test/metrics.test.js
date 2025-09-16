import request from 'supertest';
import app from '../simple-server.cjs';
import { describe, test, expect } from 'vitest';

describe('Metrics Endpoint', () => {
  test('GET /api/metrics returns expected structure', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(typeof res.body.uptimeSeconds).toBe('number');
    expect(res.body.counts).toBeDefined();
    expect(res.body.counts.programs).toBeGreaterThan(0);
    expect(res.body.payments).toBeDefined();
    expect(res.body.payments).toHaveProperty('simulatedMode');
  });
});
