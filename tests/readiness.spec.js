import { describe, it, expect } from 'vitest';
import request from 'supertest';
const app = require('../simple-server.cjs');

describe('Readiness Report', () => {
  it('returns overall score and checks', async () => {
    const res = await request(app).get('/api/readiness');
    expect(res.status).toBe(200);
    expect(typeof res.body.overall).toBe('number');
    expect(Array.isArray(res.body.checks)).toBe(true);
    const names = res.body.checks.map(c=>c.name);
    expect(names).toContain('health_endpoint');
    expect(names).toContain('pricing_plans');
  });
});
