import { describe, it, expect } from 'vitest';
import request from 'supertest';
const app = require('../simple-server.cjs');

describe('Workbooks PDF', () => {
  it('lists workbooks and fetches PDF', async () => {
    const list = await request(app).get('/api/workbooks');
    expect(list.status).toBe(200);
    if (!list.body.workbooks.length) return; // skip if none
    const wb = list.body.workbooks[0];
    const pdfRes = await request(app).get(wb.pdfPath);
    expect(pdfRes.status).toBe(200);
    expect(pdfRes.headers['content-type']).toMatch(/application\/pdf/);
  });
});
