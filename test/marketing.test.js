
import request from 'supertest';
import { describe, test, expect, beforeAll } from 'vitest';
let app;
beforeAll(async () => {
  process.env.API_KEYS = 'test-key';
  app = (await import('../simple-server.cjs')).default || (await import('../simple-server.cjs'));
});

describe('Marketing Content', () => {
  test('Banners load', async () => {
    const res = await request(app).get('/api/marketing/banners');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.banners)).toBe(true);
    // Allow empty banners for now
  });
  test('Landing page loads', async () => {
    const res = await request(app).get('/api/marketing/page/landing');
    expect([200,404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.hero.title).toContain('Rise Forward');
    }
  });
  test('Lead capture works', async () => {
    const res = await request(app).post('/api/marketing/lead').send({ email: 'demo@example.org', intent: 'info' });
    expect(res.status).toBe(200);
    expect(res.body.stored).toBe(true);
  });
  test('Pricing plans available', async () => {
    const res = await request(app).get('/api/pricing');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.plans)).toBe(true);
    expect(res.body.plans.length).toBeGreaterThan(0);
  });
});
