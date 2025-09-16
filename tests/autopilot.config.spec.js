import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../simple-server.cjs';

describe('Autopilot config', () => {
  it('returns config with enabled task types', async () => {
    const res = await request(app).get('/api/autopilot/config');
    expect(res.status).toBe(200);
    expect(res.body.enabledTaskTypes).toContain('metrics_snapshot');
  });
});

