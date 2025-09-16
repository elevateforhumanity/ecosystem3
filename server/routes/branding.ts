/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { logger } from '../../src/logger.js';
import { brandingService } from '../services/branding.js';

const router = express.Router();

// GET /api/branding - Branding configuration
router.get('/', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;

  try {
    const config = brandingService.getConfig();

    logger.info({ correlationId }, 'Branding configuration requested');

    res.json({
      ...config,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId }, 'Branding configuration error');
    res.status(500).json({
      error: 'Failed to get branding configuration',
      type: 'INTERNAL_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/branding/css - CSS variables for branding
router.get('/css', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;

  try {
    const css = brandingService.generateCSS();

    logger.info({ correlationId }, 'Branding CSS requested');

    res.set('Content-Type', 'text/css');
    res.send(css);
  } catch (error: any) {
    logger.error({ err: error, correlationId }, 'Branding CSS generation error');
    res.status(500).json({
      error: 'Failed to generate branding CSS',
      type: 'INTERNAL_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/branding/variables - CSS variables as JSON
router.get('/variables', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;

  try {
    const variables = brandingService.getCSSVariables();

    logger.info({ correlationId }, 'Branding variables requested');

    res.json({
      variables,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId }, 'Branding variables error');
    res.status(500).json({
      error: 'Failed to get branding variables',
      type: 'INTERNAL_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;