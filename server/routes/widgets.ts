/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { logger } from '../../src/logger.js';
import { widgetService } from '../services/widgets.js';

const router = express.Router();

// GET /api/widgets/integration.js - JavaScript integration script (must come before /:name route)
router.get('/integration.js', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;

  try {
    const script = widgetService.getIntegrationScript();

    if (!script) {
      return res.status(500).json({
        error: 'Integration script not available',
        type: 'INTERNAL_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    logger.info({ correlationId }, 'Integration script requested');

    // Set appropriate headers for JavaScript
    res.set({
      'Content-Type': script.contentType,
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      'ETag': `"${Buffer.from(script.lastUpdated).toString('base64')}"`,
    });

    res.send(script.content);
  } catch (error: any) {
    logger.error({ err: error, correlationId }, 'Integration script error');
    res.status(500).json({
      error: 'Failed to generate integration script',
      type: 'INTERNAL_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/widgets - List all available widgets
router.get('/', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;

  try {
    const widgets = widgetService.getAllWidgets();

    logger.info({ correlationId, count: widgets.length }, 'All widgets requested');

    res.json({
      widgets: widgets.map(w => ({
        name: w.widget,
        version: w.version,
        lastUpdated: w.lastUpdated,
        endpoint: `/api/widgets/${w.widget}`,
      })),
      total: widgets.length,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId }, 'Widget list error');
    res.status(500).json({
      error: 'Failed to retrieve widgets',
      type: 'INTERNAL_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/widgets/:name - Get specific widget (must come after specific routes)
router.get('/:name', (req: express.Request, res: express.Response) => {
  const { name } = req.params;
  const correlationId = req.headers['x-request-id'] as string;

  try {
    const widget = widgetService.getWidget(name);

    if (!widget) {
      return res.status(404).json({
        error: `Widget '${name}' not found`,
        type: 'NOT_FOUND_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
        availableWidgets: widgetService.getAllWidgets().map(w => w.widget),
      });
    }

    logger.info({ correlationId, widget: name }, 'Widget requested');

    res.json({
      ...widget,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId, widget: name }, 'Widget retrieval error');
    res.status(500).json({
      error: 'Failed to retrieve widget',
      type: 'INTERNAL_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;