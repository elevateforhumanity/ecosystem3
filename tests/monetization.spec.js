import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../simple-server.cjs';

describe('Monetization endpoints', () => {
  it('lists flash offers', async () => {
    const res = await request(app).get('/api/offers/flash');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.offers)).toBe(true);
  });

  it('claims a flash offer if available', async () => {
    const list = await request(app).get('/api/offers/flash');
    const offer = list.body.offers && list.body.offers[0];
    if (!offer) return; // skip if none
    if (offer.remaining === 0) return; // already depleted
    const res = await request(app).post(`/api/offers/flash/${offer.id}/claim`);
    expect([200,400]).toContain(res.status);
  });

  it('creates affiliate and records conversion', async () => {
    const email = `tester+${Date.now()}@example.com`;
    const apply = await request(app).post('/api/affiliate/apply').send({ email });
    expect(apply.status).toBe(201);
    const code = apply.body.affiliate.code;
    const convert = await request(app).post(`/api/affiliate/${code}/convert`).send({});
    expect(convert.status).toBe(200);
    expect(convert.body.recorded).toBe(true);
  });
});
