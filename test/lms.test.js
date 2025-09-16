
import request from 'supertest';
import { describe, test, expect, beforeAll } from 'vitest';
let app;
beforeAll(async () => {
  process.env.API_KEYS = 'test-key';
  app = (await import('../simple-server.cjs')).default || (await import('../simple-server.cjs'));
});

describe('LMS Endpoints', () => {
  test('List courses', async () => {
    const res = await request(app).get('/api/lms/courses');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.courses)).toBe(true);
    expect(res.body.courses.length).toBeGreaterThan(0);
  });

  test('Get course lessons', async () => {
    const coursesRes = await request(app).get('/api/lms/courses');
    const first = coursesRes.body.courses[0];
    const res = await request(app).get(`/api/lms/courses/${first.id}/lessons`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.lessons)).toBe(true);
  });

  test('Record progress', async () => {
    const lessonsList = await request(app).get('/api/lms/courses/c_ai_fundamentals/lessons');
    const lesson = lessonsList.body.lessons[0];
    const res = await request(app).post('/api/lms/progress').send({ lessonId: lesson.id });
    expect(res.status).toBe(200);
    expect(res.body.completedCount).toBeGreaterThanOrEqual(1);
  });
});
