import request from 'supertest';
import app from '../simple-server.cjs';
import { describe, test, expect } from 'vitest';

describe('Catalog API', () => {
  test('GET /api/catalog returns items array', async () => {
    const res = await request(app).get('/api/catalog');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    const first = res.body.items[0];
    expect(first).toHaveProperty('sku');
    expect(first).toHaveProperty('name');
  });
});
