// tools/stripe-pages-check.js - Comprehensive Node.js check for Stripe buttons, pages, and functionality
const http = require('http');
const https = require('https');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';

console.log('🔍 EFH Comprehensive Node Check Starting...\n');

// Utility function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const module = url.startsWith('https') ? https : http;
    const request = module.get(url, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: data,
          url: url
        });
      });
    });
    
    request.on('error', (error) => {
      reject({ error: error.message, url: url });
    });
    
    // Set timeout
    request.setTimeout(10000, () => {
      request.destroy();
      reject({ error: 'Request timeout', url: url });
    });
  });
}

// 1. PAGE ACCESSIBILITY CHECK
console.log('📄 Checking Page Accessibility:');

const pagesToCheck = [
  { path: '/', name: 'Root/Home' },
  { path: '/hub.html', name: 'Hub Site' },
  { path: '/programs.html', name: 'Programs Site' },
  { path: '/connect.html', name: 'Connect Site' },
  { path: '/lms.html', name: 'LMS Site' },
  { path: '/ui/header.html', name: 'Header Component' },
  { path: '/ui/footer.html', name: 'Footer Component' },
  { path: '/config/health-programs.json', name: 'Health Programs Config' },
  { path: '/config/beauty-programs.json', name: 'Beauty Programs Config' },
  { path: '/config/partners.json', name: 'Partners Config' },
  { path: '/scripts/efh-universal.v2.2.js', name: 'Universal Script v2.2' }
];

async function checkPageAccessibility() {
  const results = [];
  
  for (const page of pagesToCheck) {
    try {
      const response = await makeRequest(BASE_URL + page.path);
      if (response.statusCode === 200) {
        console.log(`  ✅ ${page.name} - OK (${response.statusCode})`);
        results.push({ ...page, status: 'OK', code: response.statusCode, body: response.body });
      } else {
        console.log(`  ❌ ${page.name} - Error ${response.statusCode}`);
        results.push({ ...page, status: 'ERROR', code: response.statusCode });
      }
    } catch (error) {
      console.log(`  ❌ ${page.name} - ${error.error}`);
      results.push({ ...page, status: 'FAILED', error: error.error });
    }
  }
  
  return results;
}

// 2. STRIPE BUTTONS CHECK
async function checkStripeButtons(pageResults) {
  console.log('\n💳 Checking Stripe Buttons and Payment Integration:');
  
  const htmlPages = pageResults.filter(p => 
    p.path.endsWith('.html') && p.status === 'OK' && p.body
  );
  
  const stripeFindings = {
    buttonsFound: 0,
    enrollmentButtons: 0,
    paymentForms: 0,
    stripeReferences: 0,
    pages: []
  };
  
  for (const page of htmlPages) {
    const findings = {
      page: page.name,
      path: page.path,
      buttons: [],
      stripeElements: [],
      forms: []
    };
    
    const content = page.body.toLowerCase();
    
    // Check for enrollment/payment buttons
    const buttonPatterns = [
      /enroll\s+now/g,
      /apply\s+now/g,
      /start\s+program/g,
      /payment/g,
      /checkout/g,
      /stripe/g,
      /data-program/g,
      /data-partner/g
    ];
    
    buttonPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        findings.buttons.push(`${pattern.source}: ${matches.length} found`);
        stripeFindings.buttonsFound += matches.length;
      }
    });
    
    // Check for Stripe integration elements
    const stripePatterns = [
      /stripe\.com/g,
      /stripe-js/g,
      /payment-intent/g,
      /stripe-button/g,
      /payment-form/g
    ];
    
    stripePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        findings.stripeElements.push(`${pattern.source}: ${matches.length} found`);
        stripeFindings.stripeReferences += matches.length;
      }
    });
    
    // Check for forms
    const formMatches = content.match(/<form[^>]*>/g);
    if (formMatches) {
      findings.forms.push(`Forms found: ${formMatches.length}`);
      stripeFindings.paymentForms += formMatches.length;
    }
    
    if (findings.buttons.length > 0 || findings.stripeElements.length > 0 || findings.forms.length > 0) {
      stripeFindings.pages.push(findings);
      console.log(`  💳 ${page.name}:`);
      findings.buttons.forEach(b => console.log(`    🔘 ${b}`));
      findings.stripeElements.forEach(s => console.log(`    💸 ${s}`));
      findings.forms.forEach(f => console.log(`    📝 ${f}`));
    } else {
      console.log(`  ➖ ${page.name} - No payment elements found`);
    }
  }
  
  return stripeFindings;
}

// 3. API ENDPOINTS CHECK
async function checkAPIEndpoints() {
  console.log('\n🔌 Checking API Endpoints:');
  
  const apiEndpoints = [
    { path: '/api/programs', name: 'Programs API' },
    { path: '/api/coupons/validate', name: 'Coupon Validation API', method: 'POST' },
    { path: '/api/digital-binders/test-user', name: 'Digital Binders API' },
    { path: '/api/admin/reports/enrollment', name: 'Admin Reports API' }
  ];
  
  const apiResults = [];
  
  for (const endpoint of apiEndpoints) {
    try {
      if (endpoint.method === 'POST') {
        // For POST endpoints, we'll just check if they're reachable
        // (proper testing would require valid payloads)
        console.log(`  ➖ ${endpoint.name} - POST endpoint (requires payload testing)`);
        apiResults.push({ ...endpoint, status: 'POST_ENDPOINT' });
      } else {
        const response = await makeRequest(BASE_URL + endpoint.path);
        if (response.statusCode === 200) {
          console.log(`  ✅ ${endpoint.name} - OK (${response.statusCode})`);
          apiResults.push({ ...endpoint, status: 'OK', code: response.statusCode });
        } else {
          console.log(`  ⚠️  ${endpoint.name} - Status ${response.statusCode}`);
          apiResults.push({ ...endpoint, status: 'WARNING', code: response.statusCode });
        }
      }
    } catch (error) {
      console.log(`  ❌ ${endpoint.name} - ${error.error}`);
      apiResults.push({ ...endpoint, status: 'FAILED', error: error.error });
    }
  }
  
  return apiResults;
}

// 4. STRUCTURAL INTEGRITY CHECK
async function checkStructuralIntegrity(pageResults) {
  console.log('\n🏗️  Checking Structural Integrity:');
  
  const htmlPages = pageResults.filter(p => 
    p.path.endsWith('.html') && p.status === 'OK' && p.body
  );
  
  const structuralIssues = [];
  
  for (const page of htmlPages) {
    const issues = [];
    const content = page.body;
    
    // Check for essential elements
    const essentialElements = [
      { name: 'DOCTYPE', pattern: /<!doctype\s+html/i },
      { name: 'HTML tag', pattern: /<html[^>]*>/i },
      { name: 'HEAD tag', pattern: /<head[^>]*>/i },
      { name: 'BODY tag', pattern: /<body[^>]*>/i },
      { name: 'EFH Header div', pattern: /<div[^>]*id="efh-header"[^>]*>/i },
      { name: 'EFH Footer div', pattern: /<div[^>]*id="efh-footer"[^>]*>/i },
      { name: 'Universal Script', pattern: /efh-universal\.v2\.2\.js/i }
    ];
    
    essentialElements.forEach(element => {
      if (!element.pattern.test(content)) {
        issues.push(`Missing: ${element.name}`);
      }
    });
    
    // Check for meta tags (SEO)
    const metaTags = [
      { name: 'Title tag', pattern: /<title[^>]*>/i },
      { name: 'Meta description', pattern: /<meta[^>]*name=["']description["']/i },
      { name: 'Meta viewport', pattern: /<meta[^>]*name=["']viewport["']/i }
    ];
    
    metaTags.forEach(meta => {
      if (!meta.pattern.test(content)) {
        issues.push(`SEO Missing: ${meta.name}`);
      }
    });
    
    if (issues.length === 0) {
      console.log(`  ✅ ${page.name} - Structure OK`);
    } else {
      console.log(`  ⚠️  ${page.name} - ${issues.length} issues:`);
      issues.forEach(issue => console.log(`    • ${issue}`));
      structuralIssues.push({ page: page.name, issues });
    }
  }
  
  return structuralIssues;
}

// MAIN EXECUTION
async function runComprehensiveCheck() {
  try {
    // Wait for server to be ready
    console.log('⏳ Waiting for server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pageResults = await checkPageAccessibility();
    const stripeFindings = await checkStripeButtons(pageResults);
    const apiResults = await checkAPIEndpoints();
    const structuralIssues = await checkStructuralIntegrity(pageResults);
    
    // SUMMARY REPORT
    console.log('\n📊 COMPREHENSIVE CHECK SUMMARY:');
    console.log('='.repeat(50));
    
    const totalPages = pagesToCheck.length;
    const successfulPages = pageResults.filter(p => p.status === 'OK').length;
    console.log(`📄 Pages: ${successfulPages}/${totalPages} accessible`);
    
    console.log(`💳 Stripe Integration:`);
    console.log(`   • Payment buttons found: ${stripeFindings.buttonsFound}`);
    console.log(`   • Stripe references: ${stripeFindings.stripeReferences}`);
    console.log(`   • Forms detected: ${stripeFindings.paymentForms}`);
    console.log(`   • Pages with payment elements: ${stripeFindings.pages.length}`);
    
    const successfulAPIs = apiResults.filter(a => a.status === 'OK').length;
    console.log(`🔌 API Endpoints: ${successfulAPIs}/${apiResults.length} responding`);
    
    console.log(`🏗️  Structural Issues: ${structuralIssues.length} pages with issues`);
    
    // FINAL HEALTH SCORE
    const healthScore = Math.round(
      ((successfulPages / totalPages) * 0.4 + 
       (successfulAPIs / apiResults.length) * 0.3 + 
       ((pageResults.length - structuralIssues.length) / pageResults.length) * 0.3) * 100
    );
    
    console.log('\n🎯 FINAL HEALTH SCORE:');
    if (healthScore >= 90) {
      console.log(`🎉 ${healthScore}% - EXCELLENT! All systems operational`);
    } else if (healthScore >= 75) {
      console.log(`⚠️  ${healthScore}% - GOOD - Minor issues to address`);
    } else {
      console.log(`❌ ${healthScore}% - NEEDS ATTENTION - Critical issues found`);
    }
    
    console.log('\n✅ Comprehensive Node Check Complete!');
    
  } catch (error) {
    console.error('💥 Check failed:', error);
  }
}

// Start the check
runComprehensiveCheck();