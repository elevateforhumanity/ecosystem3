import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../simple-server.cjs';

describe('/api/ask autopilot triggers', () => {
  it('enqueues test run from ask', async () => {
    const res = await request(app).post('/api/ask').send({ question: 'Please run tests' });
    expect(res.status).toBe(200);
    expect(res.body.topic).toBe('autopilot');
    const tasks = await request(app).get('/api/autopilot/tasks');
    expect(tasks.body.tasks.some(t=> t.reason==='user ask trigger')).toBe(true);
  });
  it('lists routes when asked', async () => {
    const res = await request(app).post('/api/ask').send({ question: 'list routes' });
    expect(res.status).toBe(200);
    expect(res.body.topic).toBe('introspection');
  });
});
