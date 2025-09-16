/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { logger } from '../../src/logger.js';
import { 
  getComplianceSummary, 
  getDetailedValidation,
  complianceRegistry 
} from '../services/compliance.js';

const router = express.Router();

// GET /api/compliance - Overall compliance status
router.get('/', (req: express.Request, res: express.Response) => {
  try {
    const correlationId = req.headers['x-request-id'] as string;
    const summary = getComplianceSummary();
    
    logger.info({ correlationId }, 'Compliance summary requested');
    
    res.json({
      ...summary,
      timestamp: new Date().toISOString(),
      correlationId
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId: req.headers['x-request-id'] }, 'Compliance summary error');
    res.status(500).json({
      error: 'Internal server error',
      type: 'INTERNAL_ERROR',
      correlationId: req.headers['x-request-id'],
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/compliance/validate - Detailed validation checks
router.get('/validate', (req: express.Request, res: express.Response) => {
  try {
    const correlationId = req.headers['x-request-id'] as string;
    const validation = getDetailedValidation();
    
    logger.info({ correlationId }, 'Detailed compliance validation requested');
    
    res.json({
      ...validation,
      correlationId
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId: req.headers['x-request-id'] }, 'Compliance validation error');
    res.status(500).json({
      error: 'Internal server error',
      type: 'INTERNAL_ERROR',
      correlationId: req.headers['x-request-id'],
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/compliance/checks - Get all compliance checks
router.get('/checks', (req: express.Request, res: express.Response) => {
  try {
    const correlationId = req.headers['x-request-id'] as string;
    const checks = complianceRegistry.getAllChecks();
    
    logger.info({ correlationId, count: checks.length }, 'Compliance checks requested');
    
    res.json({
      checks,
      total: checks.length,
      timestamp: new Date().toISOString(),
      correlationId
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId: req.headers['x-request-id'] }, 'Compliance checks error');
    res.status(500).json({
      error: 'Internal server error',
      type: 'INTERNAL_ERROR',
      correlationId: req.headers['x-request-id'],
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;