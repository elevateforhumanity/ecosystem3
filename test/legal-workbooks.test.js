import request from 'supertest';
import app from '../simple-server.cjs';
import { describe, test, expect } from 'vitest';

describe('Legal & Workbooks', () => {
  test('Legal documents list loads', async () => {
    const res = await request(app).get('/api/legal');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.documents)).toBe(true);
  });
  test('Workbooks list loads (may be empty)', async () => {
    const res = await request(app).get('/api/workbooks');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('workbooks');
  });
});
