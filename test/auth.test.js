import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';
let app;
beforeAll(async () => {
  process.env.API_KEYS = 'test-key';
  app = (await import('../simple-server.cjs')).default || (await import('../simple-server.cjs'));
});

describe('Auth MVP', () => {
  const email = `user_${Date.now()}@test.local`;
  const password = 'Str0ngP@ssw0rd!';
  it('registers a user', async () => {
    const res = await request(app).post('/api/auth/register').send({ email, password, name: 'Test User' });
    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe(email);
    expect(res.body.token).toBeDefined();
  });
  it('rejects duplicate registration', async () => {
    const res = await request(app).post('/api/auth/register').send({ email, password });
    expect(res.status).toBe(409);
  });
  it('logs in and retrieves profile', async () => {
    const login = await request(app).post('/api/auth/login').send({ email, password });
    expect(login.status).toBe(200);
    const token = login.body.token;
    const me = await request(app).get('/api/auth/me').set('Authorization', 'Bearer ' + token);
    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(email);
  });
  it('denies /me without token', async () => {
    const me = await request(app).get('/api/auth/me');
    expect(me.status).toBe(401);
  });
  it('rejects login with wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ email, password: 'wrongpass' });
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });
  it('rejects password reset for unknown user', async () => {
    const res = await request(app).post('/api/auth/reset-password').send({ email: 'nouser@test.local', newPassword: 'newpass123' });
    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });
});
