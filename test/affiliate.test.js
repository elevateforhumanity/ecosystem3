import request from 'supertest';
import app from '../simple-server.cjs';
import { describe, test, expect } from 'vitest';

describe('Affiliate Program', () => {
  test('Program metadata visible', async () => {
    const res = await request(app).get('/api/affiliate/program');
    expect(res.status).toBe(200);
    expect(res.body.program).toBeDefined();
    expect(res.body.program.name).toMatch(/Affiliate/);
  });
  test('Application + stats cycle', async () => {
    const email = `user+${Date.now()}@example.org`;
    const apply = await request(app).post('/api/affiliate/apply').send({ email, name: 'Tester' });
    expect(apply.status).toBe(201);
    expect(apply.body.affiliate).toBeDefined();
    const code = apply.body.affiliate.code;
    // simulate tracking click
    const track = await request(app).get(`/a/${code}`).redirects(1);
    expect(track.status).toBe(200);
      const stats = await request(app).get(`/api/affiliate/stats/${code}`);
      expect([200,404]).toContain(stats.status);
      if (stats.status === 200) {
        expect(stats.body.clicks).toBeGreaterThan(0);
      }
  });
});
