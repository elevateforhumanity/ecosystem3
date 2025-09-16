// Enhanced LMS service with Prisma integration (graceful fallback to in-memory)
const { PrismaClient } = (() => {
  try {
    return require('@prisma/client');
  } catch (e) {
    // Fallback when Prisma client not generated or DB not available
    return { PrismaClient: null };
  }
})();

// Fallback data (same as original lms.cjs)
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

// Initialize Prisma client if available
let prisma = null;
let useDatabase = false;

if (PrismaClient) {
  try {
    prisma = new PrismaClient();
    useDatabase = true;
  } catch (e) {
    console.warn('Prisma client initialization failed, falling back to in-memory data:', e.message);
  }
}

// Basic in-memory progress map (fallback): userId -> Set(lessonId)
const progressMap = new Map();

// Database-enabled functions
async function listCoursesDB() {
  return await prisma.lmsCourse.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      published: true
    },
    where: { published: true }
  });
}

async function getCourseDB(id) {
  return await prisma.lmsCourse.findFirst({
    where: {
      OR: [
        { id: id },
        { slug: id }
      ],
      published: true
    },
    include: {
      modules: {
        include: {
          lessons: true
        }
      }
    }
  });
}

async function listLessonsDB(courseId) {
  const course = await getCourseDB(courseId);
  if (!course) return [];
  
  return await prisma.lmsLesson.findMany({
    where: { courseId: course.id },
    orderBy: { order: 'asc' }
  });
}

async function recordProgressDB({ userId = 'demo-user', lessonId }) {
  // In a real implementation, this would create/update enrollment records
  // For now, we'll use the in-memory fallback for progress tracking
  return recordProgressMemory({ userId, lessonId });
}

// In-memory fallback functions (current implementation)
function listCoursesMemory() { 
  return courses; 
}

function getCourseMemory(id) { 
  return courses.find(c => c.id === id || c.slug === id); 
}

function listLessonsMemory(courseId) { 
  return lessons.filter(l => l.courseId === courseId).sort((a,b)=>a.order-b.order); 
}

function recordProgressMemory({ userId = 'demo-user', lessonId }) {
  if (!lessonId || !lessons.find(l => l.id === lessonId)) {
    const err = new Error('Invalid lessonId');
    err.statusCode = 400;
    err.type = 'validation';
    throw err;
  }
  if (!progressMap.has(userId)) progressMap.set(userId, new Set());
  progressMap.get(userId).add(lessonId);
  return getProgressSummary(userId);
}

function getProgressSummary(userId = 'demo-user') {
  const completed = progressMap.get(userId) || new Set();
  const total = lessons.length;
  return {
    userId,
    completedLessons: Array.from(completed),
    completedCount: completed.size,
    totalLessons: total,
    percent: total === 0 ? 0 : Math.round((completed.size / total) * 100)
  };
}

// Unified interface (switches between DB and memory based on availability)
async function listCourses() {
  try {
    return useDatabase ? await listCoursesDB() : listCoursesMemory();
  } catch (e) {
    console.warn('Database query failed, falling back to in-memory:', e.message);
    useDatabase = false; // Disable for subsequent calls
    return listCoursesMemory();
  }
}

async function getCourse(id) {
  try {
    return useDatabase ? await getCourseDB(id) : getCourseMemory(id);
  } catch (e) {
    console.warn('Database query failed, falling back to in-memory:', e.message);
    useDatabase = false;
    return getCourseMemory(id);
  }
}

async function listLessons(courseId) {
  try {
    return useDatabase ? await listLessonsDB(courseId) : listLessonsMemory(courseId);
  } catch (e) {
    console.warn('Database query failed, falling back to in-memory:', e.message);
    useDatabase = false;
    return listLessonsMemory(courseId);
  }
}

async function recordProgress({ userId = 'demo-user', lessonId }) {
  try {
    return useDatabase ? await recordProgressDB({ userId, lessonId }) : recordProgressMemory({ userId, lessonId });
  } catch (e) {
    console.warn('Database operation failed, falling back to in-memory:', e.message);
    useDatabase = false;
    return recordProgressMemory({ userId, lessonId });
  }
}

// Cleanup function for proper shutdown
async function disconnect() {
  if (prisma) {
    await prisma.$disconnect();
  }
}

module.exports = {
  listCourses,
  getCourse,
  listLessons,
  recordProgress,
  getProgressSummary,
  disconnect,
  // Export database availability status for health checks
  isUsingDatabase: () => useDatabase
};