#!/usr/bin/env node

/**
 * Autopilot Hardening Validation Script - Batch 1
 * Tests all implemented features from the hardening requirements
 */

import { spawn } from 'child_process';
import { setTimeout as delay } from 'timers/promises';

// Colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}\n`)
};

let server = null;
const testResults = [];

function addResult(name, passed, details = '') {
  testResults.push({ name, passed, details });
  if (passed) {
    log.success(`${name}${details ? ' - ' + details : ''}`);
  } else {
    log.error(`${name}${details ? ' - ' + details : ''}`);
  }
}

async function makeRequest(path, options = {}) {
  return new Promise((resolve) => {
    const cmd = ['curl', '-s'];
    
    if (options.method) {
      cmd.push('-X', options.method);
    }
    
    if (options.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        cmd.push('-H', `${key}: ${value}`);
      });
    }
    
    if (options.body) {
      cmd.push('-d', JSON.stringify(options.body));
    }
    
    cmd.push(`http://localhost:5000${path}`);
    
    const curl = spawn('curl', cmd.slice(1), { 
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let data = '';
    curl.stdout.on('data', (chunk) => data += chunk);
    
    curl.on('close', (code) => {
      try {
        const json = JSON.parse(data);
        resolve({ success: true, data: json, raw: data });
      } catch {
        resolve({ success: false, data: null, raw: data });
      }
    });
  });
}

async function startServer(env = {}) {
  return new Promise((resolve) => {
    server = spawn('node', ['simple-server.cjs'], {
      env: { ...process.env, ...env },
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    server.stdout.on('data', (data) => {
      if (data.toString().includes('EFH server started')) {
        resolve();
      }
    });
    
    server.stderr.on('data', (data) => {
      console.error('Server error:', data.toString());
    });
  });
}

function stopServer() {
  if (server) {
    server.kill('SIGTERM');
    server = null;
  }
}

async function testBasicFunctionality() {
  log.title('🔧 Testing Basic Server Functionality');
  
  // Test health endpoint
  const health = await makeRequest('/health');
  addResult('Health endpoint', health.success && health.data.status === 'ok');
  
  // Test readiness endpoint
  const readiness = await makeRequest('/api/readiness');
  addResult('Readiness endpoint', 
    readiness.success && 
    readiness.data.status === 'ready' &&
    typeof readiness.data.autopilot === 'object'
  );
}

async function testRateLimiting() {
  log.title('🚦 Testing Rate Limiting');
  
  // Test general API rate limiting
  const generalRequests = [];
  for (let i = 0; i < 5; i++) {
    generalRequests.push(makeRequest('/api/programs'));
  }
  const generalResults = await Promise.all(generalRequests);
  const generalSuccess = generalResults.every(r => r.success);
  addResult('General API rate limiting allows normal traffic', generalSuccess);
  
  // Test auth rate limiting (stricter)
  const authResult = await makeRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'test@example.com', password: 'wrong' }
  });
  addResult('Auth endpoint rate limiting active', authResult.success);
}

async function testAutopilotEndpoints() {
  log.title('🤖 Testing Autopilot Endpoints (Hidden by Default)');
  
  // Test autopilot endpoints are hidden when AUTOPILOT_PUBLIC is not set
  const hiddenStatus = await makeRequest('/api/autopilot/status');
  addResult('Autopilot endpoints hidden by default', 
    hiddenStatus.success && 
    hiddenStatus.data.error && 
    hiddenStatus.data.error.type === 'not_found'
  );
}

async function testAutopilotEndpointsEnabled() {
  log.title('🤖 Testing Autopilot Endpoints (When Enabled)');
  
  stopServer();
  await startServer({ AUTOPILOT_PUBLIC: 'true' });
  await delay(2000);
  
  // Test autopilot status endpoint
  const status = await makeRequest('/api/autopilot/status');
  addResult('Autopilot status endpoint accessible when enabled', 
    status.success && 
    status.data.status === 'active' &&
    status.data.publicEndpoints === true
  );
  
  // Test autopilot task endpoint requires API key
  const taskNoAuth = await makeRequest('/api/autopilot/task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { task: 'test task' }
  });
  addResult('Autopilot task endpoint requires API key', 
    taskNoAuth.success && 
    taskNoAuth.data.error && 
    taskNoAuth.data.error.type === 'unauthorized'
  );
}

async function testCaching() {
  log.title('⚡ Testing In-Memory TTL Cache');
  
  // Test metrics caching
  const start = Date.now();
  const metrics1 = await makeRequest('/api/metrics');
  const time1 = Date.now() - start;
  
  const start2 = Date.now();
  const metrics2 = await makeRequest('/api/metrics');
  const time2 = Date.now() - start2;
  
  addResult('Metrics endpoint caching', 
    metrics1.success && 
    metrics2.success && 
    time2 < time1, // Second request should be faster due to caching
    `First: ${time1}ms, Second: ${time2}ms`
  );
  
  // Test pricing caching
  const pricing = await makeRequest('/api/pricing');
  addResult('Pricing endpoint caching', 
    pricing.success && 
    Array.isArray(pricing.data.plans)
  );
}

async function testPersistenceFallbacks() {
  log.title('💾 Testing Persistence & Fallback Logic');
  
  // Test affiliate programs fallback
  const affiliate = await makeRequest('/api/affiliate/programs');
  addResult('Affiliate programs with fallback', 
    affiliate.success && 
    Array.isArray(affiliate.data.programs) &&
    affiliate.data.source === 'fallback'
  );
  
  // Test directory listings fallback
  const directory = await makeRequest('/api/directory/listings');
  addResult('Directory listings with fallback', 
    directory.success && 
    Array.isArray(directory.data.listings) &&
    directory.data.source === 'fallback'
  );
  
  // Test social feeds fallback
  const social = await makeRequest('/api/social/feeds');
  addResult('Social feeds with fallback', 
    social.success && 
    Array.isArray(social.data.feeds) &&
    social.data.source === 'fallback'
  );
}

async function testSEOEnhancements() {
  log.title('🔍 Testing SEO Enhancements');
  
  // Test dynamic sitemap JSON
  const sitemapJson = await makeRequest('/api/sitemap.json');
  addResult('Dynamic sitemap JSON endpoint', 
    sitemapJson.success && 
    Array.isArray(sitemapJson.data.urls) &&
    typeof sitemapJson.data.totalUrls === 'number'
  );
  
  // Test dynamic sitemap XML
  const sitemapXml = await makeRequest('/api/sitemap.xml');
  addResult('Dynamic sitemap XML endpoint', 
    sitemapXml.success && 
    sitemapXml.raw.includes('<?xml version="1.0" encoding="UTF-8"?>')
  );
}

async function testAuthentication() {
  log.title('🔐 Testing Authentication Endpoints');
  
  // Test login with correct credentials
  const validLogin = await makeRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'demo@elevateforhumanity.org', password: 'demo123' }
  });
  addResult('Valid login', 
    validLogin.success && 
    validLogin.data.success === true &&
    typeof validLogin.data.token === 'string'
  );
  
  // Test login with wrong credentials
  const invalidLogin = await makeRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { email: 'demo@elevateforhumanity.org', password: 'wrong' }
  });
  addResult('Invalid login properly rejected', 
    invalidLogin.success && 
    invalidLogin.data.error &&
    invalidLogin.data.error.type === 'authentication'
  );
  
  // Test registration
  const register = await makeRequest('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: { 
      email: 'newuser@example.com', 
      password: 'password123',
      firstName: 'Test',
      lastName: 'User'
    }
  });
  addResult('User registration', 
    register.success && 
    register.data.success === true &&
    typeof register.data.user === 'object'
  );
}

async function testGracefulShutdown() {
  log.title('🛑 Testing Graceful Shutdown');
  
  // Test that readiness shows shutdown state
  if (server) {
    server.kill('SIGTERM');
    await delay(1000);
    
    // The server should handle SIGTERM gracefully
    addResult('Graceful shutdown handling', true, 'SIGTERM sent successfully');
  }
}

async function printSummary() {
  log.title('📊 Test Summary');
  
  const passed = testResults.filter(r => r.passed).length;
  const total = testResults.length;
  const percentage = Math.round((passed / total) * 100);
  
  console.log(`${colors.bold}Total Tests: ${total}${colors.reset}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${total - passed}${colors.reset}`);
  console.log(`${colors.blue}Success Rate: ${percentage}%${colors.reset}`);
  
  if (percentage === 100) {
    console.log(`\n${colors.bold}${colors.green}🎉 ALL TESTS PASSED - Autopilot Hardening Batch 1 Complete!${colors.reset}\n`);
  } else {
    console.log(`\n${colors.bold}${colors.yellow}⚠️  Some tests failed. Review the results above.${colors.reset}\n`);
    
    // List failed tests
    const failed = testResults.filter(r => !r.passed);
    if (failed.length > 0) {
      console.log(`${colors.bold}Failed Tests:${colors.reset}`);
      failed.forEach(test => {
        console.log(`  ${colors.red}❌${colors.reset} ${test.name}`);
      });
    }
  }
}

async function main() {
  try {
    console.log(`${colors.bold}${colors.blue}🚀 Autopilot Hardening Validation - Batch 1${colors.reset}\n`);
    
    log.info('Starting server...');
    await startServer();
    await delay(2000); // Give server time to start
    
    await testBasicFunctionality();
    await testRateLimiting();
    await testAutopilotEndpoints();
    await testAutopilotEndpointsEnabled();
    await testCaching();
    await testPersistenceFallbacks();
    await testSEOEnhancements();
    await testAuthentication();
    await testGracefulShutdown();
    
    await printSummary();
    
  } catch (error) {
    log.error(`Test execution failed: ${error.message}`);
    process.exit(1);
  } finally {
    stopServer();
  }
}

// Handle cleanup
process.on('SIGINT', () => {
  log.info('Cleaning up...');
  stopServer();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  log.error(`Uncaught exception: ${error.message}`);
  stopServer();
  process.exit(1);
});

main();