import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../simple-server.cjs';

describe('Autopilot status & content index', () => {
  it('returns status with tasks and maybe readiness', async () => {
    const res = await request(app).get('/api/autopilot/status');
    expect(res.status).toBe(200);
    expect(res.body.tasks).toBeTruthy();
  });
  it('lists content index', async () => {
    const res = await request(app).get('/api/autopilot/content/index');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.files)).toBe(true);
  });
  it('searches content index', async () => {
    const res = await request(app).get('/api/autopilot/content/search').query({ q: 'pricing' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.matches)).toBe(true);
  });
});
