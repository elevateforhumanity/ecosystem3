/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import { logger } from '../../src/logger.js';
import { authenticateToken } from '../middleware/auth.js';
import { paymentService } from '../services/payment.js';

const router = express.Router();

// GET /api/payments/config - Payment configuration
router.get('/config', (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;
  
  try {
    const config = paymentService.getConfig();
    
    logger.info({ correlationId }, 'Payment configuration requested');
    
    res.json({
      ...config,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId }, 'Payment config error');
    res.status(500).json({
      error: 'Failed to get payment configuration',
      type: 'INTERNAL_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/payments/create-payment-intent - Create payment intent
router.post('/create-payment-intent', async (req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;
  
  try {
    const { amount, program_id, user_id, metadata } = req.body;

    // Validation
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        error: 'Valid amount is required',
        type: 'VALIDATION_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    if (!program_id || typeof program_id !== 'string') {
      return res.status(400).json({
        error: 'Valid program_id is required',
        type: 'VALIDATION_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    // Create payment intent with correlation ID as idempotency key
    const result = await paymentService.createPaymentIntent(
      {
        amount,
        program_id,
        user_id,
        metadata,
      },
      correlationId
    );

    logger.info({
      correlationId,
      paymentIntentId: result.paymentIntentId,
      amount,
      programId: program_id,
      simulated: result.simulated,
    }, 'Payment intent created successfully');

    res.json({
      ...result,
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId }, 'Payment intent creation failed');
    res.status(500).json({
      error: 'Failed to create payment intent',
      type: 'INTERNAL_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
});

// GET /api/payments/payment-intent/:id - Retrieve payment intent
router.get('/payment-intent/:id', async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const correlationId = req.headers['x-request-id'] as string;
  
  try {
    const paymentIntent = await paymentService.retrievePaymentIntent(id);
    
    if (!paymentIntent) {
      return res.status(404).json({
        error: 'Payment intent not found',
        type: 'NOT_FOUND_ERROR',
        correlationId,
        timestamp: new Date().toISOString(),
      });
    }

    logger.info({ correlationId, paymentIntentId: id }, 'Payment intent retrieved');

    res.json({
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
      },
      timestamp: new Date().toISOString(),
      correlationId,
    });
  } catch (error: any) {
    logger.error({ err: error, correlationId, paymentIntentId: id }, 'Failed to retrieve payment intent');
    res.status(500).json({
      error: 'Failed to retrieve payment intent',
      type: 'INTERNAL_ERROR',
      correlationId,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/payments/webhook - Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: express.Request, res: express.Response) => {
  const signature = req.headers['stripe-signature'] as string;
  const correlationId = req.headers['x-request-id'] as string;
  
  try {
    const event = await paymentService.handleWebhook(req.body, signature);
    
    if (!event) {
      return res.status(400).json({
        error: 'Invalid webhook signature or configuration',
        type: 'VALIDATION_ERROR',
        correlationId,
      });
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        logger.info({
          correlationId,
          eventId: event.id,
          paymentIntentId: event.data.object.id,
        }, 'Payment succeeded');
        break;
      
      case 'payment_intent.payment_failed':
        logger.warn({
          correlationId,
          eventId: event.id,
          paymentIntentId: event.data.object.id,
        }, 'Payment failed');
        break;
      
      default:
        logger.info({
          correlationId,
          eventType: event.type,
          eventId: event.id,
        }, 'Unhandled webhook event type');
    }

    res.json({ received: true });
  } catch (error: any) {
    logger.error({ err: error, correlationId }, 'Webhook handling failed');
    res.status(400).json({
      error: 'Webhook handling failed',
      type: 'WEBHOOK_ERROR',
      correlationId,
    });
  }
});

export default router;