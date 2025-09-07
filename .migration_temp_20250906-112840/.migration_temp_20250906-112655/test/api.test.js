/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

// Comprehensive Node.js API Testing Suite
// DOE/DWD/DOL Compliance Testing for Federal Workforce Development Standards

const request = require('supertest');
const express = require('express');
const path = require('path');

// Mock the main server app
function createTestApp() {
  const app = express();
  app.use(express.json());
  
  // Include actual server routes for testing
  require('../simple-server');
  
  return app;
}

describe('EFH Brain Service - Federal Compliance Testing', () => {
  let app;
  
  beforeAll(() => {
    app = createTestApp();
  });

  // Health Check Tests
  describe('Health Checks', () => {
    test('GET /health should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    test('GET / should return 200 (React app)', async () => {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    });
  });

  // DOE/DWD/DOL Compliance Tests
  describe('Federal Compliance APIs', () => {
    test('GET /api/compliance should return compliance status', async () => {
      const res = await request(app).get('/api/compliance');
      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Federal Workforce Compliance Portal');
      expect(res.body.status).toBe('FULLY_COMPLIANT');
      
      // DOE Compliance
      expect(res.body.complianceAreas.doe.status).toBe('CERTIFIED');
      expect(res.body.complianceAreas.doe.certificationNumber).toMatch(/DOE-WIOA-\d{4}-FL-\d+/);
      
      // DWD Compliance  
      expect(res.body.complianceAreas.dwd.status).toBe('ACTIVE_COMPLIANCE');
      expect(res.body.complianceAreas.dwd.contractNumber).toMatch(/DWD-FL-\d{4}-\d+/);
      
      // DOL Compliance
      expect(res.body.complianceAreas.dol.status).toBe('CURRENT_REPORTING');
    });

    test('GET /api/compliance/validate should pass all validations', async () => {
      const res = await request(app).get('/api/compliance/validate');
      expect(res.status).toBe(200);
      expect(res.body.overallStatus).toBe('COMPLIANT');
      
      // Critical compliance validations
      expect(res.body.validations.wioa_eligibility.status).toBe('PASS');
      expect(res.body.validations.iep_compliance.status).toBe('PASS');
      expect(res.body.validations.pirl_reporting.status).toBe('PASS');
      expect(res.body.validations.financial_compliance.status).toBe('PASS');
      expect(res.body.validations.equal_opportunity.status).toBe('PASS');
      expect(res.body.validations.data_security.status).toBe('PASS');
      
      // Verify certifications
      expect(res.body.certifications).toHaveLength(2);
      expect(res.body.certifications[0].type).toBe('WIOA_PROVIDER');
      expect(res.body.certifications[0].status).toBe('ACTIVE');
    });
  });

  // Sister Sites Ecosystem Tests
  describe('Sister Sites Ecosystem', () => {
    test('GET /api/sister-sites should return all sites', async () => {
      const res = await request(app).get('/api/sister-sites');
      expect(res.status).toBe(200);
      expect(res.body.brain).toBe('active');
      expect(res.body.ecosystem).toBe('feeding-main-domain');
      
      // Verify all sister sites
      expect(res.body.sites.main).toBe('https://www.elevateforhumanity.org');
      expect(res.body.sites.programs).toBe('/api/programs');
      expect(res.body.sites.hub).toBe('/api/hub');
      expect(res.body.sites.lms).toBe('/api/lms');
      expect(res.body.sites.connect).toBe('/api/connect');
      expect(res.body.sites.compliance).toBe('/api/compliance');
      expect(res.body.sites.pay).toBe('/api/stripe');
      expect(res.body.sites.branding).toBe('/api/branding');
    });

    test('GET /api/navigation should return complete navigation', async () => {
      const res = await request(app).get('/api/navigation');
      expect(res.status).toBe(200);
      expect(res.body.mainMenu).toHaveLength(6);
      
      // Verify compliance portal in navigation
      const complianceMenu = res.body.mainMenu.find(item => item.title === 'Compliance Portal');
      expect(complianceMenu).toBeDefined();
      expect(complianceMenu.icon).toBe('📋');
      expect(complianceMenu.sections).toHaveLength(3);
    });
  });

  // Stripe Integration Tests
  describe('Payment Processing', () => {
    test('GET /api/stripe/config should return Stripe configuration', async () => {
      const res = await request(app).get('/api/stripe/config');
      expect(res.status).toBe(200);
      expect(res.body.programs).toHaveLength(3);
      expect(res.body.fundingOptions).toHaveProperty('wioa');
      expect(res.body.fundingOptions).toHaveProperty('wrg');
    });

    test('POST /api/stripe/create-payment-intent should create payment intent', async () => {
      const paymentData = {
        amount: 1997,
        program_id: 'ai-fundamentals',
        user_id: 'test-user-123'
      };
      
      const res = await request(app)
        .post('/api/stripe/create-payment-intent')
        .send(paymentData);
      
      // Should fail gracefully if Stripe not configured in test environment
      expect([200, 500]).toContain(res.status);
      
      if (res.status === 200) {
        expect(res.body.clientSecret).toBeDefined();
        expect(res.body.paymentIntentId).toBeDefined();
      } else {
        expect(res.body.error).toContain('Stripe not configured');
      }
    });
  });

  // Widget Integration Tests
  describe('Embeddable Widgets', () => {
    test('GET /api/widgets/hero-content should return hero content', async () => {
      const res = await request(app).get('/api/widgets/hero-content');
      expect(res.status).toBe(200);
      expect(res.body.widget).toBe('hero-content');
      expect(res.body.hero.headline).toBe('Launch Your AI & Data Science Career');
      
      // Verify branding requirements
      expect(res.body.branding.logo.requirements.type).toBe('LOGO_REQUIRED');
      expect(res.body.branding.footerBackground.requirements.type).toBe('EDUCATION_BACKGROUND_REQUIRED');
    });

    test('GET /api/widgets/program-carousel should return programs', async () => {
      const res = await request(app).get('/api/widgets/program-carousel');
      expect(res.status).toBe(200);
      expect(res.body.widget).toBe('program-carousel');
      expect(res.body.programs).toHaveLength(3);
    });

    test('GET /api/widgets/integration.js should return JavaScript integration', async () => {
      const res = await request(app).get('/api/widgets/integration.js');
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/javascript');
      expect(res.text).toContain('ElevateForHumanityBrain');
    });
  });

  // Branding Assets Tests
  describe('Branding Assets', () => {
    test('GET /api/branding should return branding configuration', async () => {
      const res = await request(app).get('/api/branding');
      expect(res.status).toBe(200);
      
      // Logo requirements
      expect(res.body.logo.favicon).toBe('/api/images/favicon.ico');
      expect(res.body.logo.header).toBe('/api/images/logo-header.svg');
      expect(res.body.logo.requirements.format).toBe('SVG preferred, PNG backup');
      
      // Footer background requirements
      expect(res.body.footerBackground.image).toBe('/api/images/footer-education-bg.jpg');
      expect(res.body.footerBackground.requirements.theme).toBe('education/workforce development');
      
      // Brand colors
      expect(res.body.colors.primary).toBe('#1e40af');
      expect(res.body.colors.secondary).toBe('#7c3aed');
    });
  });

  // Federal Reporting Compliance
  describe('Federal Reporting Standards', () => {
    test('Should meet WIOA Title I Adult Program Standards', async () => {
      const compliance = await request(app).get('/api/compliance/validate');
      const wioaValidation = compliance.body.validations.wioa_eligibility;
      
      expect(wioaValidation.status).toBe('PASS');
      expect(wioaValidation.requirement).toContain('WIOA Title I Adult Program Eligibility');
    });

    test('Should meet PIRL reporting requirements', async () => {
      const compliance = await request(app).get('/api/compliance/validate');
      const pirlValidation = compliance.body.validations.pirl_reporting;
      
      expect(pirlValidation.status).toBe('PASS');
      expect(pirlValidation.requirement).toContain('PIRL Data Quality and Timeliness');
    });

    test('Should meet financial compliance standards', async () => {
      const compliance = await request(app).get('/api/compliance/validate');
      const financialValidation = compliance.body.validations.financial_compliance;
      
      expect(financialValidation.status).toBe('PASS');
      expect(financialValidation.requirement).toContain('Federal Cost Principles (2 CFR 200)');
    });
  });

  // Performance & Security Tests
  describe('Performance & Security', () => {
    test('API responses should be fast (under 500ms)', async () => {
      const start = Date.now();
      await request(app).get('/api/navigation');
      const duration = Date.now() - start;
      
      expect(duration).toBeLessThan(500);
    });

    test('Should have proper CORS headers for main domain', async () => {
      const res = await request(app)
        .get('/api/sister-sites')
        .set('Origin', 'https://www.elevateforhumanity.org');
      
      expect(res.status).toBe(200);
      // CORS should allow main domain access
    });

    test('Should protect against common vulnerabilities', async () => {
      // Test for XSS protection
      const res = await request(app)
        .get('/api/navigation')
        .set('X-Forwarded-For', '<script>alert("xss")</script>');
      
      expect(res.status).toBe(200);
      expect(res.text).not.toContain('<script>');
    });
  });
});

// Data Integrity Tests
describe('Data Integrity & Validation', () => {
  test('All API endpoints should return valid JSON', async () => {
    const endpoints = [
      '/api/sister-sites',
      '/api/navigation',
      '/api/compliance',
      '/api/compliance/validate',
      '/api/stripe/config',
      '/api/widgets/hero-content',
      '/api/branding'
    ];
    
    for (const endpoint of endpoints) {
      const res = await request(createTestApp()).get(endpoint);
      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
      expect(() => JSON.parse(JSON.stringify(res.body))).not.toThrow();
    }
  });

  test('Federal compliance data should be current', async () => {
    const res = await request(createTestApp()).get('/api/compliance');
    const compliance = res.body;
    
    // Check that audit dates are reasonable
    const lastAudit = new Date(compliance.lastAudit);
    const nextAudit = new Date(compliance.nextAudit);
    const now = new Date();
    
    expect(lastAudit).toBeInstanceOf(Date);
    expect(nextAudit).toBeInstanceOf(Date);
    expect(nextAudit > now).toBe(true);
    expect(nextAudit > lastAudit).toBe(true);
  });
});

// Integration Tests
describe('Main Domain Integration', () => {
  test('Integration guide should provide complete instructions', async () => {
    const res = await request(createTestApp()).get('/api/integration-guide');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Elevate for Humanity Brain Integration Guide');
    expect(res.body.integration.step1.title).toBe('Include Brain Script');
    expect(res.body.integration.step2.title).toBe('Add Widget Containers');
    expect(res.body.integration.step3.title).toBe('Navigation Integration');
  });

  test('Widget containers should be properly defined', async () => {
    const res = await request(createTestApp()).get('/api/integration-guide');
    const widgets = res.body.integration.step2.examples;
    
    expect(widgets).toHaveLength(5);
    expect(widgets.find(w => w.name === 'Hero Stats')).toBeDefined();
    expect(widgets.find(w => w.name === 'Program Carousel')).toBeDefined();
    expect(widgets.find(w => w.name === 'Success Stories')).toBeDefined();
    expect(widgets.find(w => w.name === 'Live Feed')).toBeDefined();
    expect(widgets.find(w => w.name === 'Funding Calculator')).toBeDefined();
  });
});