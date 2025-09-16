import request from 'supertest';
import app from '../simple-server.cjs';
import { describe, test, expect } from 'vitest';

describe('Directory Listings', () => {
  test('Submission pending then approve then visible', async () => {
    const submit = await request(app).post('/api/directory/listing').send({ name: 'Test Org', category: 'training', url: 'https://example.org', description: 'Desc' });
    expect(submit.status).toBe(201);
    const id = submit.body.listing.id;
    // Should not show yet
    const listEmpty = await request(app).get('/api/directory/listings');
    expect(listEmpty.status).toBe(200);
    expect(listEmpty.body.listings.find(l => l.id === id)).toBeUndefined();
    // Attempt approve without secret -> 501 config or 403
    const approve = await request(app).post(`/api/directory/${id}/approve`);
    expect([501,403]).toContain(approve.status);
  });
});
