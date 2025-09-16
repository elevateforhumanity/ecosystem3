/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/auth/me - Get current user info
router.get('/me', authenticateToken, (req: express.Request, res: express.Response) => {
  const user = (req as any).user;
  const correlationId = req.headers['x-request-id'] as string;

  res.json({
    user: {
      id: user.id,
      email: user.email,
      role: user.role || 'STUDENT',
    },
    timestamp: new Date().toISOString(),
    correlationId,
  });
});

// POST /api/auth/login - Login stub (implement based on your auth strategy)
router.post('/login', (req: express.Request, res: express.Response) => {
  res.status(501).json({
    error: 'Login endpoint not implemented. Use your preferred auth method.',
    type: 'NOT_IMPLEMENTED_ERROR',
    correlationId: req.headers['x-request-id'] as string,
    timestamp: new Date().toISOString(),
  });
});

export default router;