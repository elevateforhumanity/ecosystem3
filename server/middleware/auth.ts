/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import jwt from 'jsonwebtoken';
import express from 'express';
import { loadEnv } from '../../src/env.js';
import { logger } from '../../src/logger.js';

interface JwtPayload {
  id: string;
  email: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const correlationId = req.headers['x-request-id'] as string;
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    logger.warn({ correlationId }, 'No authorization token provided');
    return res.status(401).json({
      error: 'Access token is required',
      type: 'AUTH_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const env = loadEnv();
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    
    // Attach user info to request
    (req as any).user = decoded;
    
    logger.debug({ correlationId, userId: decoded.id }, 'Token authenticated successfully');
    next();
  } catch (error: any) {
    logger.warn({ 
      correlationId, 
      error: error.message 
    }, 'Token authentication failed');
    
    return res.status(403).json({
      error: 'Invalid or expired token',
      type: 'AUTH_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
}

// Optional authentication - continues if no token provided
export function optionalAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(); // No token, but continue
  }

  try {
    const env = loadEnv();
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
  } catch (error) {
    // Invalid token, but continue without user context
    logger.debug({ correlationId: req.headers['x-request-id'] }, 'Optional auth token invalid, continuing without user context');
  }

  next();
}

// Role-based authorization middleware
export function requireRole(role: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    const correlationId = req.headers['x-request-id'] as string;

    if (!user) {
      return res.status(401).json({
        error: 'Authentication required',
        type: 'AUTH_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    if (user.role !== role && user.role !== 'ADMIN') {
      logger.warn({ 
        correlationId, 
        userId: user.id, 
        userRole: user.role, 
        requiredRole: role 
      }, 'Insufficient permissions');
      
      return res.status(403).json({
        error: `${role} role required`,
        type: 'AUTH_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
}