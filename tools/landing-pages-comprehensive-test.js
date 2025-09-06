// tools/landing-pages-comprehensive-test.js - Complete landing page functionality and Google indexing test
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

console.log('🚀 EFH Comprehensive Landing Pages Test Starting...\n');

// Utility function to make HTTP requests
function makeRequest(url, method = 'GET') {
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method }, (response) => {
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
    
    request.setTimeout(10000, () => {
      request.destroy();
      reject({ error: 'Request timeout', url: url });
    });
    
    request.end();
  });
}

// 1. LANDING PAGES SERVING TEST
console.log('🌐 Testing Landing Pages Serving & Routing:');

const landingPages = [
  { path: '/', name: 'Root Homepage', critical: true },
  { path: '/hub.html', name: 'Hub Landing Page', critical: true },
  { path: '/programs.html', name: 'Programs Landing Page', critical: true },
  { path: '/connect.html', name: 'Connect Landing Page', critical: true },
  { path: '/lms.html', name: 'LMS Landing Page', critical: true },
  { path: '/account.html', name: 'Account Page', critical: false },
  { path: '/index.html', name: 'Index Page', critical: false },
  { path: '/admin-dashboard.html', name: 'Admin Dashboard', critical: false },
  { path: '/admin-approvals-dashboard.html', name: 'Admin Approvals', critical: false }
];

async function testLandingPagesServing() {
  console.log('  📋 Checking all landing pages are properly served...');
  const results = [];
  
  for (const page of landingPages) {
    try {
      const response = await makeRequest(BASE_URL + page.path);
      
      if (response.statusCode === 200) {
        console.log(`  ✅ ${page.name} - Served OK (${response.statusCode})`);
        results.push({ 
          ...page, 
          status: 'OK', 
          code: response.statusCode, 
          body: response.body,
          contentLength: response.body.length 
        });
      } else if (response.statusCode === 404) {
        console.log(`  ${page.critical ? '❌' : '⚠️'} ${page.name} - Not Found (404)`);
        results.push({ ...page, status: 'NOT_FOUND', code: 404 });
      } else {
        console.log(`  ⚠️ ${page.name} - Status ${response.statusCode}`);
        results.push({ ...page, status: 'WARNING', code: response.statusCode });
      }
    } catch (error) {
      console.log(`  ${page.critical ? '❌' : '⚠️'} ${page.name} - ${error.error}`);
      results.push({ ...page, status: 'FAILED', error: error.error });
    }
  }
  
  return results;
}

// 2. NAVIGATION FLOW TEST
async function testNavigationFlow(pageResults) {
  console.log('\n🧭 Testing Navigation Flow Between Pages:');
  
  const successfulPages = pageResults.filter(p => p.status === 'OK' && p.body);
  const navigationIssues = [];
  
  for (const page of successfulPages) {
    console.log(`  🔍 Checking navigation links in ${page.name}:`);
    const content = page.body;
    
    // Look for links to other sister sites
    const linkPatterns = [
      { name: 'Hub Links', pattern: /href=["'][^"']*hub\.html["']/gi },
      { name: 'Programs Links', pattern: /href=["'][^"']*programs\.html["']/gi },
      { name: 'Connect Links', pattern: /href=["'][^"']*connect\.html["']/gi },
      { name: 'LMS Links', pattern: /href=["'][^"']*lms\.html["']/gi },
      { name: 'Home Links', pattern: /href=["'][^"']*\/(index\.html)?["']/gi },
      { name: 'Account Links', pattern: /href=["'][^"']*account\.html["']/gi }
    ];
    
    let linksFound = 0;
    linkPatterns.forEach(linkType => {
      const matches = content.match(linkType.pattern);
      if (matches) {
        console.log(`    ✅ ${linkType.name}: ${matches.length} found`);
        linksFound += matches.length;
      }
    });
    
    // Check for navigation menus/headers
    const navElements = [
      { name: 'Nav Element', pattern: /<nav[^>]*>/gi },
      { name: 'Menu', pattern: /class=["'][^"']*menu[^"']*["']/gi },
      { name: 'Header Navigation', pattern: /class=["'][^"']*nav[^"']*["']/gi }
    ];
    
    navElements.forEach(nav => {
      const matches = content.match(nav.pattern);
      if (matches) {
        console.log(`    🧭 ${nav.name}: ${matches.length} found`);
      }
    });
    
    if (linksFound === 0) {
      console.log(`    ⚠️ No navigation links found in ${page.name}`);
      navigationIssues.push(page.name);
    }
  }
  
  return navigationIssues;
}

// 3. STRUCTURAL FUNCTIONALITY TEST
async function testStructuralFunctionality(pageResults) {
  console.log('\n🏗️ Testing Structural Functionality:');
  
  const successfulPages = pageResults.filter(p => p.status === 'OK' && p.body);
  const functionalityReport = {
    totalPages: successfulPages.length,
    pagesWithForms: 0,
    pagesWithButtons: 0,
    pagesWithInteractivity: 0,
    pagesWithEFHComponents: 0,
    issues: []
  };
  
  for (const page of successfulPages) {
    console.log(`  🔧 Analyzing ${page.name}:`);
    const content = page.body;
    const pageIssues = [];
    
    // Check for forms
    const forms = content.match(/<form[^>]*>/gi);
    if (forms) {
      console.log(`    📝 Forms: ${forms.length} found`);
      functionalityReport.pagesWithForms++;
    }
    
    // Check for buttons and interactive elements
    const buttons = content.match(/<button[^>]*>|<input[^>]*type=["']submit["']|<input[^>]*type=["']button["']/gi);
    if (buttons) {
      console.log(`    🔘 Buttons: ${buttons.length} found`);
      functionalityReport.pagesWithButtons++;
    }
    
    // Check for JavaScript/interactivity
    const scripts = content.match(/<script[^>]*>/gi);
    const eventHandlers = content.match(/on[a-z]+\s*=/gi);
    if (scripts || eventHandlers) {
      console.log(`    ⚡ Interactive elements: Scripts(${scripts?.length || 0}), Handlers(${eventHandlers?.length || 0})`);
      functionalityReport.pagesWithInteractivity++;
    }
    
    // Check for EFH components
    const efhHeader = content.match(/<div[^>]*id=["']efh-header["']/gi);
    const efhFooter = content.match(/<div[^>]*id=["']efh-footer["']/gi);
    const universalScript = content.match(/efh-universal\.v2\.2\.js/gi);
    
    if (efhHeader && efhFooter && universalScript) {
      console.log(`    🎯 EFH Components: Header(${efhHeader.length}), Footer(${efhFooter.length}), Script(${universalScript.length})`);
      functionalityReport.pagesWithEFHComponents++;
    } else {
      const missing = [];
      if (!efhHeader) missing.push('Header');
      if (!efhFooter) missing.push('Footer');
      if (!universalScript) missing.push('Universal Script');
      console.log(`    ⚠️ Missing EFH components: ${missing.join(', ')}`);
      pageIssues.push(`Missing EFH components: ${missing.join(', ')}`);
    }
    
    // Check for essential HTML structure
    const essentials = [
      { name: 'Title', pattern: /<title[^>]*>/gi, required: true },
      { name: 'Meta Description', pattern: /<meta[^>]*name=["']description["']/gi, required: true },
      { name: 'Meta Viewport', pattern: /<meta[^>]*name=["']viewport["']/gi, required: true }
    ];
    
    essentials.forEach(essential => {
      const found = content.match(essential.pattern);
      if (found) {
        console.log(`    📄 ${essential.name}: Found`);
      } else if (essential.required) {
        console.log(`    ❌ ${essential.name}: Missing (Required)`);
        pageIssues.push(`Missing ${essential.name}`);
      }
    });
    
    if (pageIssues.length > 0) {
      functionalityReport.issues.push({ page: page.name, issues: pageIssues });
    }
  }
  
  return functionalityReport;
}

// 4. GOOGLE INDEXING ELEMENTS TEST
async function testGoogleIndexingElements(pageResults) {
  console.log('\n🔍 Testing Google Indexing & SEO Elements:');
  
  const successfulPages = pageResults.filter(p => p.status === 'OK' && p.body);
  const seoReport = {
    totalPages: successfulPages.length,
    fullyOptimized: 0,
    partiallyOptimized: 0,
    needsWork: 0,
    details: []
  };
  
  for (const page of successfulPages) {
    console.log(`  🔍 SEO Analysis for ${page.name}:`);
    const content = page.body;
    const seoElements = {
      title: false,
      metaDescription: false,
      metaViewport: false,
      metaCharset: false,
      openGraph: false,
      twitterCard: false,
      canonicalUrl: false,
      structured: false,
      h1Tag: false,
      altTags: false
    };
    
    // Check essential SEO elements
    if (content.match(/<title[^>]*>[^<]+<\/title>/gi)) {
      console.log(`    ✅ Title tag: Found`);
      seoElements.title = true;
    }
    
    if (content.match(/<meta[^>]*name=["']description["'][^>]*content=["'][^"']+["']/gi)) {
      console.log(`    ✅ Meta description: Found`);
      seoElements.metaDescription = true;
    }
    
    if (content.match(/<meta[^>]*name=["']viewport["']/gi)) {
      console.log(`    ✅ Meta viewport: Found`);
      seoElements.metaViewport = true;
    }
    
    if (content.match(/<meta[^>]*charset/gi)) {
      console.log(`    ✅ Meta charset: Found`);
      seoElements.metaCharset = true;
    }
    
    // Check Open Graph tags
    const ogTags = content.match(/<meta[^>]*property=["']og:[^"']+["']/gi);
    if (ogTags) {
      console.log(`    📱 Open Graph tags: ${ogTags.length} found`);
      seoElements.openGraph = true;
    }
    
    // Check Twitter Card tags
    const twitterTags = content.match(/<meta[^>]*name=["']twitter:[^"']+["']/gi);
    if (twitterTags) {
      console.log(`    🐦 Twitter Card tags: ${twitterTags.length} found`);
      seoElements.twitterCard = true;
    }
    
    // Check for H1 tags
    const h1Tags = content.match(/<h1[^>]*>/gi);
    if (h1Tags) {
      console.log(`    📝 H1 tags: ${h1Tags.length} found`);
      seoElements.h1Tag = true;
    }
    
    // Check for image alt tags
    const imgTags = content.match(/<img[^>]*>/gi);
    const altTags = content.match(/<img[^>]*alt=["'][^"']+["']/gi);
    if (imgTags && altTags) {
      console.log(`    🖼️ Image alt tags: ${altTags.length}/${imgTags.length} images have alt text`);
      seoElements.altTags = (altTags.length / imgTags.length) > 0.8;
    }
    
    // Calculate optimization level
    const optimizedCount = Object.values(seoElements).filter(Boolean).length;
    const totalChecks = Object.keys(seoElements).length;
    const optimizationPercentage = (optimizedCount / totalChecks) * 100;
    
    if (optimizationPercentage >= 80) {
      console.log(`    🎉 SEO Score: ${Math.round(optimizationPercentage)}% - Fully Optimized`);
      seoReport.fullyOptimized++;
    } else if (optimizationPercentage >= 60) {
      console.log(`    ⚠️ SEO Score: ${Math.round(optimizationPercentage)}% - Partially Optimized`);
      seoReport.partiallyOptimized++;
    } else {
      console.log(`    ❌ SEO Score: ${Math.round(optimizationPercentage)}% - Needs Work`);
      seoReport.needsWork++;
    }
    
    seoReport.details.push({
      page: page.name,
      score: Math.round(optimizationPercentage),
      elements: seoElements
    });
  }
  
  return seoReport;
}

// 5. HOMEPAGE ATTACHMENT TEST
async function testHomepageAttachment(pageResults) {
  console.log('\n🏠 Testing Homepage Links to All Landing Pages:');
  
  const homepage = pageResults.find(p => (p.path === '/' || p.path === '/index.html') && p.status === 'OK');
  
  if (!homepage || !homepage.body) {
    console.log('  ❌ Homepage not found or not accessible');
    return { homepageFound: false, linkedPages: 0, missingLinks: [] };
  }
  
  console.log(`  📋 Analyzing homepage (${homepage.name}) for links to all landing pages...`);
  const content = homepage.body;
  const missingLinks = [];
  const linkedPages = [];
  
  // Check for links to each critical landing page
  const criticalPages = landingPages.filter(p => p.critical && p.path !== '/');
  
  for (const page of criticalPages) {
    const pageName = page.path.replace('.html', '').replace('/', '');
    const linkPattern = new RegExp(`href=["'][^"']*${pageName}[^"']*["']`, 'gi');
    const found = content.match(linkPattern);
    
    if (found) {
      console.log(`  ✅ Link to ${page.name}: Found (${found.length} links)`);
      linkedPages.push(page.name);
    } else {
      console.log(`  ❌ Link to ${page.name}: Missing`);
      missingLinks.push(page.name);
    }
  }
  
  // Check for sitemap or navigation menu
  const navElements = [
    content.match(/<nav[^>]*>/gi),
    content.match(/sitemap/gi),
    content.match(/class=["'][^"']*menu[^"']*["']/gi)
  ].filter(Boolean);
  
  if (navElements.length > 0) {
    console.log(`  🧭 Navigation elements found: ${navElements.length} types`);
  }
  
  return {
    homepageFound: true,
    linkedPages: linkedPages.length,
    totalCriticalPages: criticalPages.length,
    missingLinks,
    navigationPresent: navElements.length > 0
  };
}

// MAIN EXECUTION
async function runComprehensiveLandingPagesTest() {
  try {
    // Wait for server to be ready
    console.log('⏳ Waiting for server to be ready...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const pageResults = await testLandingPagesServing();
    const navigationIssues = await testNavigationFlow(pageResults);
    const functionalityReport = await testStructuralFunctionality(pageResults);
    const seoReport = await testGoogleIndexingElements(pageResults);
    const homepageAttachment = await testHomepageAttachment(pageResults);
    
    // COMPREHENSIVE SUMMARY REPORT
    console.log('\n📊 COMPREHENSIVE LANDING PAGES TEST SUMMARY:');
    console.log('='.repeat(60));
    
    // Page Serving Results
    const totalPages = landingPages.length;
    const servedPages = pageResults.filter(p => p.status === 'OK').length;
    const criticalPages = landingPages.filter(p => p.critical).length;
    const servedCriticalPages = pageResults.filter(p => p.status === 'OK' && p.critical).length;
    
    console.log(`🌐 Page Serving:`);
    console.log(`   • Total pages tested: ${totalPages}`);
    console.log(`   • Successfully served: ${servedPages}/${totalPages} (${Math.round(servedPages/totalPages*100)}%)`);
    console.log(`   • Critical pages served: ${servedCriticalPages}/${criticalPages} (${Math.round(servedCriticalPages/criticalPages*100)}%)`);
    
    // Navigation Results
    console.log(`\n🧭 Navigation Flow:`);
    console.log(`   • Pages with navigation: ${servedPages - navigationIssues.length}/${servedPages}`);
    if (navigationIssues.length > 0) {
      console.log(`   • Pages missing navigation: ${navigationIssues.join(', ')}`);
    }
    
    // Functionality Results
    console.log(`\n🏗️ Structural Functionality:`);
    console.log(`   • Pages with forms: ${functionalityReport.pagesWithForms}/${functionalityReport.totalPages}`);
    console.log(`   • Pages with buttons: ${functionalityReport.pagesWithButtons}/${functionalityReport.totalPages}`);
    console.log(`   • Pages with interactivity: ${functionalityReport.pagesWithInteractivity}/${functionalityReport.totalPages}`);
    console.log(`   • Pages with EFH components: ${functionalityReport.pagesWithEFHComponents}/${functionalityReport.totalPages}`);
    
    // SEO Results
    console.log(`\n🔍 Google Indexing & SEO:`);
    console.log(`   • Fully optimized pages: ${seoReport.fullyOptimized}/${seoReport.totalPages}`);
    console.log(`   • Partially optimized pages: ${seoReport.partiallyOptimized}/${seoReport.totalPages}`);
    console.log(`   • Pages needing SEO work: ${seoReport.needsWork}/${seoReport.totalPages}`);
    
    // Homepage Attachment Results
    console.log(`\n🏠 Homepage Integration:`);
    if (homepageAttachment.homepageFound) {
      console.log(`   • Homepage accessible: ✅`);
      console.log(`   • Pages linked from homepage: ${homepageAttachment.linkedPages}/${homepageAttachment.totalCriticalPages}`);
      if (homepageAttachment.missingLinks.length > 0) {
        console.log(`   • Missing homepage links: ${homepageAttachment.missingLinks.join(', ')}`);
      }
      console.log(`   • Navigation menu present: ${homepageAttachment.navigationPresent ? '✅' : '❌'}`);
    } else {
      console.log(`   • Homepage accessible: ❌`);
    }
    
    // FINAL HEALTH SCORES
    const servingScore = (servedPages / totalPages) * 100;
    const criticalServingScore = (servedCriticalPages / criticalPages) * 100;
    const navigationScore = ((servedPages - navigationIssues.length) / servedPages) * 100;
    const functionalityScore = (functionalityReport.pagesWithEFHComponents / functionalityReport.totalPages) * 100;
    const seoScore = ((seoReport.fullyOptimized + seoReport.partiallyOptimized * 0.7) / seoReport.totalPages) * 100;
    const homepageScore = homepageAttachment.homepageFound ? 
      (homepageAttachment.linkedPages / homepageAttachment.totalCriticalPages) * 100 : 0;
    
    const overallHealth = Math.round(
      (criticalServingScore * 0.25 + 
       navigationScore * 0.15 + 
       functionalityScore * 0.20 + 
       seoScore * 0.25 + 
       homepageScore * 0.15)
    );
    
    console.log('\n🎯 FINAL HEALTH SCORES:');
    console.log(`   • Page Serving: ${Math.round(servingScore)}%`);
    console.log(`   • Critical Pages: ${Math.round(criticalServingScore)}%`);
    console.log(`   • Navigation Flow: ${Math.round(navigationScore)}%`);
    console.log(`   • EFH Functionality: ${Math.round(functionalityScore)}%`);
    console.log(`   • SEO Optimization: ${Math.round(seoScore)}%`);
    console.log(`   • Homepage Integration: ${Math.round(homepageScore)}%`);
    
    console.log(`\n🏆 OVERALL LANDING PAGES HEALTH: ${overallHealth}%`);
    
    if (overallHealth >= 90) {
      console.log('🎉 EXCELLENT! All landing pages are production-ready');
    } else if (overallHealth >= 75) {
      console.log('⚠️ GOOD - Minor improvements recommended');
    } else {
      console.log('❌ NEEDS ATTENTION - Critical issues require resolution');
    }
    
    console.log('\n✅ Comprehensive Landing Pages Test Complete!');
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Start the comprehensive test
runComprehensiveLandingPagesTest();