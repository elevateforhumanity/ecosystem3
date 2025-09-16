import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createTestApp } from './test-app-factory';

describe('Subscription plans API', () => {
  const app = createTestApp();

  it('returns plans with expected fields', async () => {
    const res = await request(app).get('/api/subscription/plans');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.plans)).toBe(true);
    const starter = res.body.plans.find(p => p.id === 'starter');
    expect(starter).toBeTruthy();
    expect(starter).toHaveProperty('price_monthly');
    expect(starter).toHaveProperty('price_yearly');
    expect(starter).toHaveProperty('features');
  });
});
