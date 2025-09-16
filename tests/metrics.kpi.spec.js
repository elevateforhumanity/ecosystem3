import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../simple-server.cjs';

// This test validates new business KPI fields added to /api/metrics and affiliate_conversions readiness check

describe('Metrics & KPI endpoints', () => {
  it('exposes business KPI counts on /api/metrics', async () => {
    const res = await request(app).get('/api/metrics');
    expect(res.status).toBe(200);
    expect(res.body.counts).toBeTruthy();
    const counts = res.body.counts;
    ['affiliates','directoryApproved','directoryPending','socialPostsRecorded','flashOffersActive','workbookPdfCache']
      .forEach(k => expect(Object.keys(counts)).toContain(k));
  });

  it('includes affiliate_conversions check in /api/readiness', async () => {
    const res = await request(app).get('/api/readiness');
    expect(res.status).toBe(200);
    const names = res.body.checks.map(c=>c.name);
    expect(names).toContain('affiliate_conversions');
  });
});
