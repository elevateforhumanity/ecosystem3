/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/profile - Get user profile
router.get('/profile', authenticateToken, (req: express.Request, res: express.Response) => {
  const user = (req as any).user;
  const correlationId = req.headers['x-request-id'] as string;

  res.json({
    profile: {
      id: user.id,
      email: user.email,
      name: user.name || null,
      role: user.role || 'STUDENT',
      createdAt: user.iat ? new Date(user.iat * 1000).toISOString() : new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
    correlationId,
  });
});

export default router;