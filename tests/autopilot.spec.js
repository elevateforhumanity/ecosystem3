import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../simple-server.cjs';

// Autopilot integration test (non-flaky: only inspects structure, not timing of background loop)

describe('Autopilot task API', () => {
  it('enqueues a metrics snapshot task and reports in list', async () => {
    const enqueue = await request(app).post('/api/autopilot/tasks').send({ type: 'metrics_snapshot' });
    expect(enqueue.status).toBe(201);
    const id = enqueue.body.task.id;
    const list = await request(app).get('/api/autopilot/tasks');
    const found = list.body.tasks.find(t => t.id === id);
    expect(found).toBeTruthy();
    expect(found.type).toBe('metrics_snapshot');
  });
  it('exposes autopilot counts in metrics', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.status).toBe(200);
    expect(res.body.autopilot).toBeTruthy();
    expect(typeof res.body.autopilot.total).toBe('number');
  });
});
