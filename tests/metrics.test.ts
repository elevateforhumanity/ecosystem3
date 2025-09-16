import request from 'supertest';
import { describe, test, expect, beforeAll } from 'vitest';
// Dynamic import to avoid potential CJS/ESM interop typing confusion
let appRef: any;
beforeAll(async () => {
  const mod = await import('../server.mjs');
  appRef = mod.app;
});

describe('metrics & error instrumentation', () => {
  test('metrics endpoint exposes counters', async () => {
  const res = await request(appRef).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/efh_requests_total/);
  });

  test('error route increments error counter', async () => {
  const before = await request(appRef).get('/metrics');
    const beforeErr = parseInt((before.text.match(/efh_errors_total (\d+)/)||[])[1] || '0', 10);
    // Dynamically add error route for test (isolated)
  appRef.get('/_test_error', () => { throw new Error('test-triggered'); });
  const errRes = await request(appRef).get('/_test_error');
    expect(errRes.status).toBe(500);
  const after = await request(appRef).get('/metrics');
    const afterErr = parseInt((after.text.match(/efh_errors_total (\d+)/)||[])[1] || '0', 10);
    expect(afterErr).toBeGreaterThan(beforeErr);
  });
});