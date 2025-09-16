/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { getDatabase, stubData } from '../services/database.js';
import { logger } from '../../src/logger.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/lms/courses - Get all published courses
router.get('/courses', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const correlationId = req.headers['x-request-id'] as string;
    const db = getDatabase();

    let courses;
    if (db) {
      // Use Prisma to fetch courses
      courses = await db.lmsCourse.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          slug: true,
          price: true,
          createdAt: true,
          modules: {
            select: {
              id: true,
              title: true,
              order: true,
            },
            orderBy: { order: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Use stub data
      courses = stubData.courses.filter(course => course.published);
    }

    logger.info({ correlationId, count: courses.length }, 'Fetched LMS courses');

    res.json({
      courses,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/lms/courses/:id - Get specific course with lessons
router.get('/courses/:id', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const correlationId = req.headers['x-request-id'] as string;
    const db = getDatabase();

    let course;
    if (db) {
      course = await db.lmsCourse.findFirst({
        where: {
          OR: [
            { id },
            { slug: id },
          ],
          published: true,
        },
        include: {
          modules: {
            include: {
              lessons: {
                orderBy: { order: 'asc' },
              },
            },
            orderBy: { order: 'asc' },
          },
          lessons: {
            where: { moduleId: null },
            orderBy: { order: 'asc' },
          },
        },
      });
    } else {
      // Use stub data
      course = stubData.courses.find(c => c.id === id || c.id === id);
      if (course) {
        const lessons = stubData.lessons.filter(l => l.courseId === course.id);
        course = { ...course, lessons };
      }
    }

    if (!course) {
      return res.status(404).json({
        error: 'Course not found',
        type: 'NOT_FOUND_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    logger.info({ correlationId, courseId: id }, 'Fetched course details');

    res.json({
      course,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/lms/courses/:id/lessons - Get lessons for a course
router.get('/courses/:id/lessons', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { id } = req.params;
    const correlationId = req.headers['x-request-id'] as string;
    const db = getDatabase();

    let lessons;
    if (db) {
      // First verify course exists
      const course = await db.lmsCourse.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
          published: true,
        },
      });

      if (!course) {
        return res.status(404).json({
          error: 'Course not found',
          type: 'NOT_FOUND_ERROR',
          correlationId,
          timestamp: new Date().toISOString(),
        });
      }

      lessons = await db.lmsLesson.findMany({
        where: { courseId: course.id },
        select: {
          id: true,
          title: true,
          type: true,
          duration: true,
          order: true,
          moduleId: true,
        },
        orderBy: [
          { moduleId: 'asc' },
          { order: 'asc' },
        ],
      });
    } else {
      // Use stub data
      const course = stubData.courses.find(c => c.id === id);
      if (!course) {
        return res.status(404).json({
          error: 'Course not found',
          type: 'NOT_FOUND_ERROR',
          correlationId,
          timestamp: new Date().toISOString(),
        });
      }

      lessons = stubData.lessons.filter(l => l.courseId === id);
    }

    logger.info({ correlationId, courseId: id, count: lessons.length }, 'Fetched course lessons');

    res.json({
      lessons,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/lms/progress - Track lesson/course progress (requires auth)
router.post('/progress', authenticateToken, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const { courseId, lessonId, progress, completed } = req.body;
    const correlationId = req.headers['x-request-id'] as string;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User authentication required',
        type: 'AUTH_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    if (!courseId) {
      return res.status(400).json({
        error: 'courseId is required',
        type: 'VALIDATION_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    const db = getDatabase();
    let progressRecord;

    if (db) {
      // Update or create progress in database
      progressRecord = await db.lmsEnrollment.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        update: {
          progress: progress || (completed ? 100 : undefined),
          status: completed ? 'COMPLETED' : 'ACTIVE',
          updatedAt: new Date(),
        },
        create: {
          userId,
          courseId,
          progress: progress || (completed ? 100 : 0),
          status: completed ? 'COMPLETED' : 'ACTIVE',
        },
      });
    } else {
      // Use stub data (in-memory)
      const existingProgress = stubData.progress.find(p => p.userId === userId && p.courseId === courseId);
      
      if (existingProgress) {
        existingProgress.progress = progress || (completed ? 100 : existingProgress.progress);
        existingProgress.completed = completed || existingProgress.completed;
        existingProgress.updatedAt = new Date();
        progressRecord = existingProgress;
      } else {
        progressRecord = {
          id: `progress_${Date.now()}`,
          userId,
          courseId,
          lessonId,
          progress: progress || (completed ? 100 : 0),
          completed: !!completed,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        stubData.progress.push(progressRecord);
      }
    }

    logger.info({ 
      correlationId, 
      userId, 
      courseId, 
      lessonId, 
      progress: progressRecord.progress 
    }, 'Progress updated');

    res.json({
      success: true,
      progress: progressRecord,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;