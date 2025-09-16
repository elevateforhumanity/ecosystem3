import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../simple-server.cjs';

describe('Payments Integration', () => {
  it('should fail payment if Stripe key is missing', async () => {
    const res = await request(app)
      .post('/api/pay/checkout')
      .send({ amount: 1000, currency: 'USD' });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.error).toBeDefined();
  });

  it('should fail payment with invalid payload', async () => {
    const res = await request(app)
      .post('/api/pay/checkout')
      .send({});
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.error).toBeDefined();
  });
});
