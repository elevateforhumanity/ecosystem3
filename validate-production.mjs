#!/usr/bin/env node

/*
 * Production Readiness Validation Script
 * Tests all critical endpoints and functionality
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const app = require('./simple-server.cjs');
const request = require('supertest');

async function validateProduction() {
  console.log('🚀 Starting Production Readiness Validation...\n');
  
  let passedTests = 0;
  let totalTests = 0;
  
  const test = async (name, testFn) => {
    totalTests++;
    try {
      await testFn();
      console.log(`✅ ${name}`);
      passedTests++;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
    }
  };

  // Wait for services to initialize
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Core Health Tests
  await test('Health endpoint returns OK', async () => {
    const res = await request(app).get('/health');
    if (res.status !== 200 || res.body.status !== 'ok') {
      throw new Error(`Expected 200/ok, got ${res.status}/${res.body?.status}`);
    }
  });

  await test('Root endpoint accessible', async () => {
    const res = await request(app).get('/');
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}`);
    }
  });

  // Federal Compliance Tests
  await test('Compliance portal accessible', async () => {
    const res = await request(app).get('/api/compliance');
    if (res.status !== 200 || res.body.status !== 'FULLY_COMPLIANT') {
      throw new Error(`Expected FULLY_COMPLIANT, got ${res.body?.status}`);
    }
  });

  await test('Compliance validations pass', async () => {
    const res = await request(app).get('/api/compliance/validate');
    if (res.status !== 200 || res.body.overallStatus !== 'COMPLIANT') {
      throw new Error(`Expected COMPLIANT, got ${res.body?.overallStatus}`);
    }
  });

  // API Ecosystem Tests  
  await test('Sister sites configuration', async () => {
    const res = await request(app).get('/api/sister-sites');
    if (res.status !== 200 || res.body.brain !== 'active') {
      throw new Error(`Expected active brain, got ${res.body?.brain}`);
    }
  });

  await test('Navigation API', async () => {
    const res = await request(app).get('/api/navigation');
    if (res.status !== 200 || !Array.isArray(res.body.mainMenu)) {
      throw new Error('Navigation API not returning proper menu structure');
    }
  });

  // LMS Tests
  await test('LMS courses endpoint', async () => {
    const res = await request(app).get('/api/lms/courses');
    if (res.status !== 200 || !res.body.courses) {
      throw new Error('LMS courses not accessible');
    }
  });

  // Payment System Tests
  await test('Stripe configuration', async () => {
    const res = await request(app).get('/api/stripe/config');
    if (res.status !== 200 || !res.body.programs) {
      throw new Error('Stripe configuration not accessible');
    }
  });

  await test('Payment intent creation', async () => {
    const res = await request(app)
      .post('/api/stripe/create-payment-intent')
      .send({ amount: 1997, program_id: 'ai-fundamentals', user_id: 'test' });
    if (res.status !== 200 || !res.body.clientSecret) {
      throw new Error('Payment intent creation failed');
    }
  });

  // Widget Integration Tests
  await test('Hero content widget', async () => {
    const res = await request(app).get('/api/widgets/hero-content');
    if (res.status !== 200 || res.body.widget !== 'hero-content') {
      throw new Error('Hero content widget not working');
    }
  });

  await test('Program carousel widget', async () => {
    const res = await request(app).get('/api/widgets/program-carousel');
    if (res.status !== 200 || res.body.widget !== 'program-carousel') {
      throw new Error('Program carousel widget not working');
    }
  });

  await test('Widget integration script', async () => {
    const res = await request(app).get('/api/widgets/integration.js');
    if (res.status !== 200 || !res.text.includes('ElevateForHumanityBrain')) {
      throw new Error('Widget integration script not working');
    }
  });

  // Branding Tests
  await test('Branding configuration', async () => {
    const res = await request(app).get('/api/branding');
    if (res.status !== 200 || !res.body.logo) {
      throw new Error('Branding configuration not working');
    }
  });

  // Security Tests
  await test('Rate limiting headers present', async () => {
    const res = await request(app).get('/api/navigation');
    if (!res.headers['x-ratelimit-limit']) {
      throw new Error('Rate limiting not configured');
    }
  });

  await test('Security headers present', async () => {
    const res = await request(app).get('/health');
    if (!res.headers['x-content-type-options'] || !res.headers['strict-transport-security']) {
      throw new Error('Security headers missing');
    }
  });

  await test('Health aggregator endpoint', async () => {
    const res = await request(app).get('/api/healthz');
    if (res.status !== 200 || !res.body.services) {
      throw new Error('Health aggregator not working');
    }
  });

  // Final Report
  console.log(`\n📊 Production Readiness Results:`);
  console.log(`   ✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`   📈 Success Rate: ${Math.round((passedTests/totalTests)*100)}%`);
  
  if (passedTests === totalTests) {
    console.log(`\n🎉 ALL TESTS PASSED - System is production ready!`);
    process.exit(0);
  } else {
    console.log(`\n⚠️  Some tests failed - Review required before production deployment`);
    process.exit(1);
  }
}

validateProduction().catch(error => {
  console.error('Validation script failed:', error);
  process.exit(1);
});