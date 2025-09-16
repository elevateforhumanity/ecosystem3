/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getDatabase, stubData } from '../services/database.js';

const router = express.Router();

// GET /api/enrollments - Get user enrollments
router.get('/', authenticateToken, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const user = (req as any).user;
    const correlationId = req.headers['x-request-id'] as string;
    const db = getDatabase();

    let enrollments;
    if (db) {
      enrollments = await db.lmsEnrollment.findMany({
        where: { userId: user.id },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Use stub data
      enrollments = stubData.enrollments.filter(e => e.userId === user.id);
    }

    res.json({
      enrollments,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;