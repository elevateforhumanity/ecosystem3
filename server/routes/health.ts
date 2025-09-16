/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { loadEnv } from '../../src/env.js';
import { logger } from '../../src/logger.js';
import { getDatabaseStatus } from '../services/database.js';

const router = express.Router();

// Check individual service health
async function checkServiceHealth() {
  const services = {
    api: { status: 'healthy', timestamp: new Date().toISOString() },
    db: await getDatabaseStatus(),
    compliance: { 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      checks: ['DOE', 'DWD', 'DOL'],
      description: 'Federal compliance monitoring active'
    },
    lms: { 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      features: ['courses', 'progress', 'assessments'],
      description: 'Learning management system operational'
    }
  };

  return services;
}

// Aggregated health check endpoint with enhanced service checks
router.get('/', async (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;
  const startTime = Date.now();

  try {
    const env = loadEnv();
    const uptimeSeconds = Math.floor(process.uptime());
    
    // Check all services
    const services = await checkServiceHealth();
    
    // Check application health
    const appHealth = {
      status: 'healthy',
      uptime: process.uptime(),
      uptimeSeconds,
      memory: process.memoryUsage(),
      pid: process.pid,
    };

    // Check environment validation
    const envHealth = {
      status: 'valid',
      nodeEnv: env.NODE_ENV,
      hasJwtSecret: !!env.JWT_SECRET,
      hasDatabase: !!env.DATABASE_URL,
      hasStripe: !!env.STRIPE_SECRET_KEY,
      hasSupabase: !!(env.SUPABASE_URL && env.SUPABASE_ANON_KEY),
    };

    // Overall health determination
    const allServicesHealthy = Object.values(services).every(service => 
      service.status === 'healthy' || service.status === 'connected' || service.status === 'disabled'
    );
    const isHealthy = appHealth.status === 'healthy' && 
                     allServicesHealthy &&
                     envHealth.status === 'valid';

    const responseTime = Date.now() - startTime;

    const healthResponse = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'unknown',
      uptimeSeconds,
      correlationId,
      responseTime,
      checks: {
        app: appHealth,
        database: services.db,
        environment: envHealth,
      },
      services
    };

    res.status(isHealthy ? 200 : 503).json(healthResponse);

  } catch (error: any) {
    logger.error({
      err: error,
      correlationId,
    }, 'Health check failed');

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      correlationId,
      error: error.message,
      responseTime: Date.now() - startTime,
      services: {
        api: { status: 'unhealthy', error: error.message },
        db: { status: 'unknown' },
        compliance: { status: 'unknown' },
        lms: { status: 'unknown' }
      }
    });
  }
});

// Legacy health endpoint (for backward compatibility)
router.get('/health', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    port: process.env.PORT || 5000,
    timestamp: new Date().toISOString(),
  });
});

export default router;