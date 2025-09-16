// LMS service with in-memory fallback if database unavailable
const { getPrisma } = require('./prisma.cjs');

const courses = [
  {
    id: 'c_ai_fundamentals',
    slug: 'ai-fundamentals',
    title: 'AI Fundamentals',
    description: 'Foundational AI concepts, terminology, and practical intro projects.',
    level: 'beginner'
  },
  {
    id: 'c_data_science_bootcamp',
    slug: 'data-science-bootcamp',
    title: 'Data Science Bootcamp',
    description: 'End-to-end data workflows, exploratory analysis, modeling, evaluation.',
    level: 'intermediate'
  }
];

const lessons = [
  { id: 'l1', courseId: 'c_ai_fundamentals', title: 'Intro to AI', order: 1 },
  { id: 'l2', courseId: 'c_ai_fundamentals', title: 'Machine Learning Basics', order: 2 },
  { id: 'l3', courseId: 'c_ai_fundamentals', title: 'Neural Networks Overview', order: 3 },
  { id: 'l4', courseId: 'c_data_science_bootcamp', title: 'Data Collection & Cleaning', order: 1 },
  { id: 'l5', courseId: 'c_data_science_bootcamp', title: 'Exploratory Data Analysis', order: 2 },
  { id: 'l6', courseId: 'c_data_science_bootcamp', title: 'Model Building', order: 3 }
];

// Basic in-memory progress map: userId -> Set(lessonId)
// Still used even when DB present to avoid N+1 queries for per-request summary in Phase 1.
const progressMap = new Map();

async function listCourses() {
  const prisma = await getPrisma();
  if (prisma) {
    const dbCourses = await prisma.lmsCourse.findMany({ select: { id: true, slug: true, title: true, price: true, published: true } });
    if (dbCourses.length) return dbCourses;
  }
  return courses;
}
async function getCourse(id) {
  const prisma = await getPrisma();
  if (prisma) {
    const c = await prisma.lmsCourse.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (c) return c;
  }
  return courses.find(c => c.id === id || c.slug === id);
}
async function listLessons(courseId) {
  const prisma = await getPrisma();
  if (prisma) {
    const dbLessons = await prisma.lmsLesson.findMany({ where: { courseId }, select: { id: true, title: true, order: true, type: true }, orderBy: { order: 'asc' } });
    if (dbLessons.length) return dbLessons;
  }
  return lessons.filter(l => l.courseId === courseId).sort((a,b)=>a.order-b.order);
}

async function recordProgress({ userId = 'demo-user', lessonId }) {
  if (!lessonId || !lessons.find(l => l.id === lessonId)) {
    const err = new Error('Invalid lessonId');
    err.statusCode = 400;
    err.type = 'validation';
    throw err;
  }
  if (!progressMap.has(userId)) progressMap.set(userId, new Set());
  progressMap.get(userId).add(lessonId);

  const prisma = await getPrisma();
  if (prisma) {
    try {
      // Derive course from lesson
      const lesson = lessons.find(l => l.id === lessonId);
      const courseId = lesson.courseId;
      // Count distinct completed lessons for this course (in-memory + DB fallback)
      const courseLessonIds = lessons.filter(l => l.courseId === courseId).map(l => l.id);
      const completedForCourse = Array.from(progressMap.get(userId)).filter(id => courseLessonIds.includes(id));
      const percent = Math.round((completedForCourse.length / courseLessonIds.length) * 100);
      // Upsert enrollment row to persist progress percent (0-100 scaled to 0-1 float for future refinement)
      await prisma.lmsEnrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: { progress: percent / 100 },
        create: { userId, courseId, progress: percent / 100, status: percent === 100 ? 'COMPLETED' : 'ACTIVE' }
      });
    } catch (e) {
      // swallow DB issues silently in phase 1, rely on in-memory
    }
  }
  return getProgressSummary(userId);
}

function getProgressSummary(userId = 'demo-user') {
  const completed = progressMap.get(userId) || new Set();
  const total = lessons.length;
  // Per-course aggregation
  const perCourse = {};
  for (const l of lessons) {
    if (!perCourse[l.courseId]) perCourse[l.courseId] = { courseId: l.courseId, completed: 0, total: 0 };
    perCourse[l.courseId].total += 1;
    if (completed.has(l.id)) perCourse[l.courseId].completed += 1;
  }
  Object.values(perCourse).forEach(c => { c.percent = c.total === 0 ? 0 : Math.round((c.completed / c.total) * 100); });
  return {
    userId,
    completedLessons: Array.from(completed),
    completedCount: completed.size,
    totalLessons: total,
    percent: total === 0 ? 0 : Math.round((completed.size / total) * 100),
    courses: Object.values(perCourse)
  };
}

module.exports = { listCourses, getCourse, listLessons, recordProgress, getProgressSummary };
