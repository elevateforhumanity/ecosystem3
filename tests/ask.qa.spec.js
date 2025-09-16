import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../simple-server.cjs';

describe('/api/ask FAQ assistant', () => {
  it('answers pricing questions', async () => {
    const res = await request(app).post('/api/ask').send({ question: 'What are your pricing plans?' });
    expect(res.status).toBe(200);
    expect(res.body.topic).toBe('pricing');
    expect(res.body.answer).toMatch(/pricing plans/i);
  });
  it('falls back on unknown', async () => {
    const res = await request(app).post('/api/ask').send({ question: 'Explain quantum tunneling potatoes' });
    expect(res.status).toBe(200);
    expect(res.body.topic).toBe('unknown');
  });
});
