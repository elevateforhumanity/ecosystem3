/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import Stripe from 'stripe';
import { loadEnv } from '../../src/env.js';
import { logger } from '../../src/logger.js';

export interface PaymentConfig {
  programs: Array<{
    id: string;
    title: string;
    price: number;
    currency: string;
    description: string;
  }>;
  fundingOptions: Record<string, any>;
  stripeEnabled: boolean;
  publicKey?: string;
}

export interface PaymentIntentData {
  amount: number;
  program_id: string;
  user_id?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  paymentIntentId: string;
  clientSecret: string;
  simulated?: boolean;
  amount: number;
  currency: string;
  metadata?: Record<string, string>;
}

class PaymentService {
  private stripe: Stripe | null = null;
  private env: any;

  constructor() {
    try {
      this.env = loadEnv();
      if (this.env.STRIPE_SECRET_KEY) {
        this.stripe = new Stripe(this.env.STRIPE_SECRET_KEY, {
          apiVersion: '2024-12-18.acacia',
        });
        logger.info('Stripe payment service initialized');
      } else {
        logger.info('STRIPE_SECRET_KEY not provided, payment service running in stub mode');
      }
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to initialize payment service');
    }
  }

  isEnabled(): boolean {
    return !!this.stripe;
  }

  getConfig(): PaymentConfig {
    return {
      programs: [
        {
          id: 'ai-fundamentals',
          title: 'AI Fundamentals',
          price: 1997,
          currency: 'usd',
          description: 'Learn the basics of artificial intelligence',
        },
        {
          id: 'data-science-bootcamp',
          title: 'Data Science Bootcamp',
          price: 2997,
          currency: 'usd',
          description: 'Comprehensive data science training program',
        },
        {
          id: 'machine-learning-advanced',
          title: 'Advanced Machine Learning',
          price: 3997,
          currency: 'usd',
          description: 'Advanced ML techniques and real-world applications',
        },
      ],
      fundingOptions: {
        wioa: {
          name: 'Workforce Innovation and Opportunity Act (WIOA)',
          description: 'Federal workforce development funding',
          eligibilityRequired: true,
          coveragePercentage: 100,
        },
        wrg: {
          name: 'Workforce Reentry Grant (WRG)',
          description: 'Grant funding for workforce reentry programs',
          eligibilityRequired: true,
          coveragePercentage: 80,
        },
        selfPay: {
          name: 'Self-Pay',
          description: 'Direct payment with flexible payment plans available',
          eligibilityRequired: false,
          coveragePercentage: 0,
        },
      },
      stripeEnabled: this.isEnabled(),
      publicKey: this.env.STRIPE_PUBLIC_KEY,
    };
  }

  async createPaymentIntent(
    data: PaymentIntentData,
    idempotencyKey?: string
  ): Promise<PaymentResult> {
    const correlationId = idempotencyKey || this.generateIdempotencyKey();
    
    if (this.stripe) {
      try {
        // Create payment intent with Stripe
        const paymentIntent = await this.stripe.paymentIntents.create(
          {
            amount: data.amount,
            currency: 'usd',
            automatic_payment_methods: {
              enabled: true,
            },
            metadata: {
              program_id: data.program_id,
              user_id: data.user_id || 'anonymous',
              correlation_id: correlationId,
              ...data.metadata,
            },
          },
          {
            idempotencyKey: correlationId,
          }
        );

        logger.info({
          correlationId,
          paymentIntentId: paymentIntent.id,
          amount: data.amount,
          programId: data.program_id,
        }, 'Payment intent created');

        return {
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret!,
          amount: data.amount,
          currency: 'usd',
          metadata: paymentIntent.metadata,
        };
      } catch (error: any) {
        logger.error({
          err: error,
          correlationId,
          amount: data.amount,
          programId: data.program_id,
        }, 'Failed to create Stripe payment intent');

        throw new Error(`Payment intent creation failed: ${error.message}`);
      }
    } else {
      // Stub mode - return simulated payment intent
      logger.info({
        correlationId,
        amount: data.amount,
        programId: data.program_id,
        mode: 'stub',
      }, 'Simulated payment intent created');

      return {
        paymentIntentId: `pi_stub_${correlationId}`,
        clientSecret: `pi_stub_${correlationId}_secret_stub`,
        simulated: true,
        amount: data.amount,
        currency: 'usd',
        metadata: {
          program_id: data.program_id,
          user_id: data.user_id || 'anonymous',
          correlation_id: correlationId,
          simulated: 'true',
          ...data.metadata,
        },
      };
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
    if (this.stripe && !paymentIntentId.startsWith('pi_stub_')) {
      try {
        return await this.stripe.paymentIntents.retrieve(paymentIntentId);
      } catch (error: any) {
        logger.error({ err: error, paymentIntentId }, 'Failed to retrieve payment intent');
        return null;
      }
    }

    // Return stub data for simulated payment intents
    if (paymentIntentId.startsWith('pi_stub_')) {
      return {
        id: paymentIntentId,
        status: 'requires_payment_method',
        amount: 1997,
        currency: 'usd',
        metadata: { simulated: 'true' },
      } as Stripe.PaymentIntent;
    }

    return null;
  }

  private generateIdempotencyKey(): string {
    return `idem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async handleWebhook(rawBody: Buffer, signature: string): Promise<Stripe.Event | null> {
    if (!this.stripe || !this.env.STRIPE_WEBHOOK_SECRET) {
      logger.warn('Webhook handling not available - Stripe not configured');
      return null;
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.env.STRIPE_WEBHOOK_SECRET
      );

      logger.info({
        eventType: event.type,
        eventId: event.id,
      }, 'Stripe webhook event received');

      return event;
    } catch (error: any) {
      logger.error({ err: error }, 'Failed to construct webhook event');
      return null;
    }
  }
}

// Singleton payment service instance
export const paymentService = new PaymentService();