/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../server/main.js';

describe('Unified Server API Tests', () => {
  beforeAll(() => {
    // Set required environment variables for testing
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test_secret_key_for_testing_minimum_16_chars';
  });

  // Health Check Tests
  describe('Health Endpoints', () => {
    it('GET /api/healthz should return aggregated health status', async () => {
      const res = await request(app).get('/api/healthz');
      expect(res.status).toBe(200);
      expect(res.body.status).toMatch(/healthy|unhealthy/);
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.correlationId).toBeDefined();
      expect(res.body.checks).toBeDefined();
      expect(res.body.checks.app).toBeDefined();
      expect(res.body.checks.database).toBeDefined();
      expect(res.body.checks.environment).toBeDefined();
    });

    it('GET /api/healthz/health should return legacy health check', async () => {
      const res = await request(app).get('/api/healthz/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  // LMS Endpoints Tests  
  describe('LMS Endpoints', () => {
    it('GET /api/lms/courses should return courses list', async () => {
      const res = await request(app).get('/api/lms/courses');
      expect(res.status).toBe(200);
      expect(res.body.courses).toBeDefined();
      expect(Array.isArray(res.body.courses)).toBe(true);
      expect(res.body.timestamp).toBeDefined();
      expect(res.body.correlationId).toBeDefined();
    });

    it('GET /api/lms/courses/:id should return specific course', async () => {
      const res = await request(app).get('/api/lms/courses/ai-fundamentals');
      expect(res.status).toBe(200);
      expect(res.body.course).toBeDefined();
      expect(res.body.course.title).toBeDefined();
      expect(res.body.timestamp).toBeDefined();
    });

    it('GET /api/lms/courses/:id/lessons should return course lessons', async () => {
      const res = await request(app).get('/api/lms/courses/ai-fundamentals/lessons');
      expect(res.status).toBe(200);
      expect(res.body.lessons).toBeDefined();
      expect(Array.isArray(res.body.lessons)).toBe(true);
    });

    it('POST /api/lms/progress should require authentication', async () => {
      const res = await request(app)
        .post('/api/lms/progress')
        .send({ courseId: 'ai-fundamentals', progress: 50 });
      
      expect(res.status).toBe(401);
      expect(res.body.type).toBe('AUTH_ERROR');
    });
  });

  // Compliance Endpoints Tests
  describe('Compliance Endpoints', () => {
    it('GET /api/compliance should return compliance status', async () => {
      const res = await request(app).get('/api/compliance');
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Federal Workforce Compliance Portal');
      expect(res.body.status).toBe('FULLY_COMPLIANT');
      expect(res.body.complianceAreas.doe.status).toBe('CERTIFIED');
      expect(res.body.complianceAreas.dwd.status).toBe('ACTIVE_COMPLIANCE');
      expect(res.body.complianceAreas.dol.status).toBe('CURRENT_REPORTING');
    });

    it('GET /api/compliance/validate should return detailed validation', async () => {
      const res = await request(app).get('/api/compliance/validate');
      expect(res.status).toBe(200);
      expect(res.body.overallStatus).toBe('COMPLIANT');
      expect(res.body.validations.wioa_eligibility.status).toBe('PASS');
      expect(res.body.validations.iep_compliance.status).toBe('PASS');
      expect(res.body.validations.pirl_reporting.status).toBe('PASS');
      expect(res.body.validations.financial_compliance.status).toBe('PASS');
      expect(res.body.validations.equal_opportunity.status).toBe('PASS');
      expect(res.body.validations.data_security.status).toBe('PASS');
      expect(res.body.certifications).toHaveLength(2);
    });
  });

  // Payment Endpoints Tests
  describe('Payment Endpoints', () => {
    it('GET /api/payments/config should return payment configuration', async () => {
      const res = await request(app).get('/api/payments/config');
      expect(res.status).toBe(200);
      expect(res.body.programs).toHaveLength(3);
      expect(res.body.fundingOptions).toHaveProperty('wioa');
      expect(res.body.fundingOptions).toHaveProperty('wrg');
      expect(res.body.stripeEnabled).toBeDefined();
    });

    it('POST /api/payments/create-payment-intent should validate input', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({}); // Missing required fields
      
      expect(res.status).toBe(400);
      expect(res.body.type).toBe('VALIDATION_ERROR');
    });

    it('POST /api/payments/create-payment-intent should create payment intent', async () => {
      const res = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({
          amount: 1997,
          program_id: 'ai-fundamentals',
          user_id: 'test-user-123'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.paymentIntentId).toBeDefined();
      expect(res.body.clientSecret).toBeDefined();
    });
  });

  // Navigation & Sister Sites Tests
  describe('Navigation Endpoints', () => {
    it('GET /api/navigation should return navigation menu', async () => {
      const res = await request(app).get('/api/navigation');
      expect(res.status).toBe(200);
      expect(res.body.mainMenu).toHaveLength(6);
      
      const complianceMenu = res.body.mainMenu.find((item: any) => item.title === 'Compliance Portal');
      expect(complianceMenu).toBeDefined();
      expect(complianceMenu.sections).toHaveLength(3);
    });

    it('GET /api/navigation/sister-sites should return sister sites info', async () => {
      const res = await request(app).get('/api/navigation/sister-sites');
      expect(res.status).toBe(200);
      expect(res.body.brain).toBe('active');
      expect(res.body.ecosystem).toBe('feeding-main-domain');
      expect(res.body.sites.main).toBe('https://www.elevateforhumanity.org');
      expect(res.body.sites.programs).toBe('/api/programs');
    });
  });

  // Widget Endpoints Tests  
  describe('Widget Endpoints', () => {
    it('GET /api/widgets/hero-content should return hero content', async () => {
      const res = await request(app).get('/api/widgets/hero-content');
      expect(res.status).toBe(200);
      expect(res.body.widget).toBe('hero-content');
      expect(res.body.hero.headline).toBe('Launch Your AI & Data Science Career');
    });

    it('GET /api/widgets/program-carousel should return program carousel', async () => {
      const res = await request(app).get('/api/widgets/program-carousel');
      expect(res.status).toBe(200);
      expect(res.body.widget).toBe('program-carousel');
      expect(res.body.programs).toHaveLength(3);
    });

    it('GET /api/widgets/integration.js should return JavaScript', async () => {
      const res = await request(app).get('/api/widgets/integration.js');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/javascript');
      expect(res.text).toContain('ElevateForHumanityBrain');
    });
  });

  // Branding Endpoints Tests
  describe('Branding Endpoints', () => {
    it('GET /api/branding should return branding configuration', async () => {
      const res = await request(app).get('/api/branding');
      expect(res.status).toBe(200);
      expect(res.body.logo.favicon).toBe('/api/images/favicon.ico');
      expect(res.body.logo.header).toBe('/api/images/logo-header.svg');
      expect(res.body.colors.primary).toBe('#1e40af');
      expect(res.body.colors.secondary).toBe('#7c3aed');
    });
  });

  // Error Handling Tests
  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app).get('/api/unknown-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.type).toBe('NOT_FOUND_ERROR');
      expect(res.body.correlationId).toBeDefined();
    });

    it('should include correlation ID in error responses', async () => {
      const correlationId = 'test-correlation-123';
      const res = await request(app)
        .get('/api/unknown')
        .set('x-request-id', correlationId);
      
      expect(res.status).toBe(404);
      expect(res.body.correlationId).toBe(correlationId);
    });
  });

  // Legacy Compatibility Tests
  describe('Legacy API Compatibility', () => {
    it('GET /api/stripe/config should work (legacy alias)', async () => {
      const res = await request(app).get('/api/stripe/config');
      expect(res.status).toBe(200);
      expect(res.body.programs).toBeDefined();
    });
  });
});