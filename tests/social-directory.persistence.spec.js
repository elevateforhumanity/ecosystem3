import { describe, it, expect } from 'vitest';
import request from 'supertest';

// Set admin secret before loading app
process.env.ADMIN_SECRET = 'test-admin';
const app = require('../simple-server.cjs');

describe('Persistence: Directory + Social History', () => {
  let listingId;
  it('creates directory listing (pending) then approves and lists', async () => {
    const submit = await request(app).post('/api/directory/listing').send({ name: 'Persisted Org', category: 'software' });
    expect(submit.status).toBe(201);
    listingId = submit.body.listing.id;
    const approve = await request(app).post(`/api/directory/${listingId}/approve`).set('x-admin-secret','test-admin');
    expect(approve.status).toBe(200);
    const list = await request(app).get('/api/directory/listings');
    expect(list.status).toBe(200);
  expect(list.body.listings.some(l => l.id === listingId)).toBe(true);
  });

  it('records social post history (db if available)', async () => {
    // Grab next suggestions
    const next = await request(app).get('/api/social/schedule/next');
    expect(next.status).toBe(200);
    const post = next.body.next && next.body.next[0];
    if (!post) return; // skip if none
    const rec = await request(app).post('/api/social/mark-posted').send({ id: post.id });
    expect(rec.status).toBe(200);
    const hist = await request(app).get('/api/social/history');
    expect(hist.status).toBe(200);
    expect(Array.isArray(hist.body.history)).toBe(true);
  });
});
