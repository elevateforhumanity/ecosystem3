// tools/file-based-landing-test.js - Comprehensive file-based landing page test
const fs = require('fs');
const path = require('path');

console.log('🚀 EFH File-Based Comprehensive Landing Pages Test Starting...\n');

// 1. LANDING PAGES AVAILABILITY TEST
console.log('🌐 Testing Landing Pages Files Availability:');

const landingPages = [
  { file: 'hub.html', name: 'Hub Landing Page', critical: true, type: 'sister-site' },
  { file: 'programs.html', name: 'Programs Landing Page', critical: true, type: 'sister-site' },
  { file: 'connect.html', name: 'Connect Landing Page', critical: true, type: 'sister-site' },
  { file: 'lms.html', name: 'LMS Landing Page', critical: true, type: 'sister-site' },
  { file: 'account.html', name: 'Account Page', critical: false, type: 'user-page' },
  { file: 'admin-dashboard.html', name: 'Admin Dashboard', critical: false, type: 'admin-page' },
  { file: 'admin-approvals-dashboard.html', name: 'Admin Approvals', critical: false, type: 'admin-page' },
  { file: 'index.html', name: 'Index Page', critical: false, type: 'homepage' }
];

function testLandingPagesAvailability() {
  const results = [];
  let criticalFound = 0;
  let totalFound = 0;
  
  console.log('  📋 Checking all landing page files exist...');
  
  for (const page of landingPages) {
    if (fs.existsSync(page.file)) {
      const stats = fs.statSync(page.file);
      const content = fs.readFileSync(page.file, 'utf8');
      
      console.log(`  ✅ ${page.name} - ${Math.round(stats.size/1024)}KB (${page.type})`);
      
      results.push({ 
        ...page, 
        status: 'OK', 
        size: stats.size,
        content: content 
      });
      
      totalFound++;
      if (page.critical) criticalFound++;
    } else {
      console.log(`  ${page.critical ? '❌' : '⚠️'} ${page.name} - FILE MISSING (${page.type})`);
      results.push({ ...page, status: 'MISSING' });
    }
  }
  
  console.log(`\n  📊 Summary: ${totalFound}/${landingPages.length} total, ${criticalFound}/${landingPages.filter(p => p.critical).length} critical pages found`);
  
  return results;
}

// 2. NAVIGATION FLOW TEST
function testNavigationFlow(pageResults) {
  console.log('\n🧭 Testing Navigation Flow Between Landing Pages:');
  
  const successfulPages = pageResults.filter(p => p.status === 'OK' && p.content);
  const navigationReport = {
    pagesWithNavigation: 0,
    crossLinks: {},
    missingNavigation: [],
    totalLinks: 0
  };
  
  for (const page of successfulPages) {
    console.log(`  🔍 Analyzing navigation in ${page.name}:`);
    const content = page.content;
    
    // Check for links to sister sites
    const sisterSiteLinks = [
      { name: 'Hub', pattern: /href=["'][^"']*hub\.html["']/gi, target: 'hub.html' },
      { name: 'Programs', pattern: /href=["'][^"']*programs\.html["']/gi, target: 'programs.html' },
      { name: 'Connect', pattern: /href=["'][^"']*connect\.html["']/gi, target: 'connect.html' },
      { name: 'LMS', pattern: /href=["'][^"']*lms\.html["']/gi, target: 'lms.html' },
      { name: 'Account', pattern: /href=["'][^"']*account\.html["']/gi, target: 'account.html' },
      { name: 'Home', pattern: /href=["'][^"']*\/(index\.html)?["']|href=["']\/["']/gi, target: 'home' }
    ];
    
    let pageLinksFound = 0;
    navigationReport.crossLinks[page.file] = [];
    
    sisterSiteLinks.forEach(link => {
      const matches = content.match(link.pattern);
      if (matches) {
        console.log(`    ✅ Links to ${link.name}: ${matches.length} found`);
        navigationReport.crossLinks[page.file].push({ target: link.name, count: matches.length });
        pageLinksFound += matches.length;
        navigationReport.totalLinks += matches.length;
      }
    });
    
    // Check for navigation structure elements
    const navStructures = [
      { name: 'Nav Element', pattern: /<nav[^>]*>|<div[^>]*class=["'][^"']*nav[^"']*["']/gi },
      { name: 'Menu Structure', pattern: /<ul[^>]*class=["'][^"']*menu[^"']*["']|<div[^>]*class=["'][^"']*menu[^"']*["']/gi },
      { name: 'Header Links', pattern: /<header[^>]*>[\s\S]*?<\/header>/gi }
    ];
    
    navStructures.forEach(nav => {
      const matches = content.match(nav.pattern);
      if (matches) {
        console.log(`    🧭 ${nav.name}: ${matches.length} found`);
      }
    });
    
    if (pageLinksFound > 0) {
      navigationReport.pagesWithNavigation++;
      console.log(`    📊 Total navigation links: ${pageLinksFound}`);
    } else {
      console.log(`    ⚠️ No inter-page navigation found`);
      navigationReport.missingNavigation.push(page.name);
    }
  }
  
  return navigationReport;
}

// 3. STRUCTURAL FUNCTIONALITY TEST
function testStructuralFunctionality(pageResults) {
  console.log('\n🏗️ Testing Structural Functionality & Components:');
  
  const successfulPages = pageResults.filter(p => p.status === 'OK' && p.content);
  const functionalityReport = {
    totalPages: successfulPages.length,
    pagesWithForms: 0,
    pagesWithButtons: 0,
    pagesWithPaymentElements: 0,
    pagesWithEFHComponents: 0,
    pagesWithInteractivity: 0,
    structuralIssues: [],
    details: []
  };
  
  for (const page of successfulPages) {
    console.log(`  🔧 Analyzing ${page.name} structure:`);
    const content = page.content;
    const pageDetails = {
      page: page.name,
      forms: 0,
      buttons: 0,
      paymentElements: 0,
      efhComponents: [],
      interactive: false,
      issues: []
    };
    
    // Check for forms
    const forms = content.match(/<form[^>]*>/gi);
    if (forms) {
      console.log(`    📝 Forms: ${forms.length} found`);
      pageDetails.forms = forms.length;
      functionalityReport.pagesWithForms++;
    }
    
    // Check for buttons and clickable elements
    const buttons = content.match(/<button[^>]*>|<input[^>]*type=["']submit["']|<input[^>]*type=["']button["']|onclick=/gi);
    if (buttons) {
      console.log(`    🔘 Interactive buttons: ${buttons.length} found`);
      pageDetails.buttons = buttons.length;
      functionalityReport.pagesWithButtons++;
    }
    
    // Check for payment/enrollment elements
    const paymentElements = [
      /enroll\s+now/gi,
      /apply\s+now/gi,
      /payment/gi,
      /checkout/gi,
      /data-program/gi,
      /data-partner/gi,
      /stripe/gi
    ];
    
    let paymentCount = 0;
    paymentElements.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        paymentCount += matches.length;
      }
    });
    
    if (paymentCount > 0) {
      console.log(`    💳 Payment/enrollment elements: ${paymentCount} found`);
      pageDetails.paymentElements = paymentCount;
      functionalityReport.pagesWithPaymentElements++;
    }
    
    // Check for EFH-specific components
    const efhComponents = [
      { name: 'EFH Header', pattern: /<div[^>]*id=["']efh-header["']/gi },
      { name: 'EFH Footer', pattern: /<div[^>]*id=["']efh-footer["']/gi },
      { name: 'Universal Script v2.2', pattern: /efh-universal\.v2\.2\.js/gi },
      { name: 'Program Data Loading', pattern: /data-programs=["'][^"']*\.json["']/gi },
      { name: 'Partner Integration', pattern: /data-partners=["'][^"']*\.json["']/gi }
    ];
    
    efhComponents.forEach(component => {
      const matches = content.match(component.pattern);
      if (matches) {
        console.log(`    🎯 ${component.name}: Found (${matches.length})`);
        pageDetails.efhComponents.push(component.name);
      }
    });
    
    if (pageDetails.efhComponents.length >= 3) {
      functionalityReport.pagesWithEFHComponents++;
    } else {
      pageDetails.issues.push('Missing core EFH components');
    }
    
    // Check for interactivity (JavaScript, event handlers)
    const interactiveElements = [
      /<script[^>]*>/gi,
      /on[a-z]+\s*=/gi,
      /addEventListener/gi,
      /click|hover|submit/gi
    ];
    
    const interactivityFound = interactiveElements.some(pattern => content.match(pattern));
    if (interactivityFound) {
      console.log(`    ⚡ Interactive functionality: Detected`);
      pageDetails.interactive = true;
      functionalityReport.pagesWithInteractivity++;
    }
    
    // Check essential HTML structure
    const structuralElements = [
      { name: 'DOCTYPE', pattern: /<!doctype\s+html/gi, required: true },
      { name: 'Title Tag', pattern: /<title[^>]*>[^<]+<\/title>/gi, required: true },
      { name: 'Meta Description', pattern: /<meta[^>]*name=["']description["']/gi, required: true },
      { name: 'Meta Viewport', pattern: /<meta[^>]*name=["']viewport["']/gi, required: true }
    ];
    
    structuralElements.forEach(element => {
      const found = content.match(element.pattern);
      if (!found && element.required) {
        pageDetails.issues.push(`Missing ${element.name}`);
      }
    });
    
    if (pageDetails.issues.length > 0) {
      console.log(`    ⚠️ Issues found: ${pageDetails.issues.join(', ')}`);
      functionalityReport.structuralIssues.push(page.name);
    } else {
      console.log(`    ✅ Structure OK`);
    }
    
    functionalityReport.details.push(pageDetails);
  }
  
  return functionalityReport;
}

// 4. GOOGLE INDEXING & SEO TEST
function testGoogleIndexingElements(pageResults) {
  console.log('\n🔍 Testing Google Indexing & SEO Optimization:');
  
  const successfulPages = pageResults.filter(p => p.status === 'OK' && p.content);
  const seoReport = {
    totalPages: successfulPages.length,
    fullyOptimized: 0,
    partiallyOptimized: 0,
    needsWork: 0,
    averageScore: 0,
    details: []
  };
  
  for (const page of successfulPages) {
    console.log(`  🔍 SEO Analysis for ${page.name}:`);
    const content = page.content;
    
    const seoChecks = [
      { name: 'Title Tag', pattern: /<title[^>]*>[^<]+<\/title>/gi, weight: 15 },
      { name: 'Meta Description', pattern: /<meta[^>]*name=["']description["'][^>]*content=["'][^"']{50,}["']/gi, weight: 15 },
      { name: 'Meta Viewport', pattern: /<meta[^>]*name=["']viewport["']/gi, weight: 10 },
      { name: 'Meta Charset', pattern: /<meta[^>]*charset/gi, weight: 5 },
      { name: 'H1 Tag', pattern: /<h1[^>]*>[^<]+<\/h1>/gi, weight: 10 },
      { name: 'Open Graph Tags', pattern: /<meta[^>]*property=["']og:[^"']+["']/gi, weight: 10 },
      { name: 'Twitter Cards', pattern: /<meta[^>]*name=["']twitter:[^"']+["']/gi, weight: 5 },
      { name: 'Canonical URL', pattern: /<link[^>]*rel=["']canonical["']/gi, weight: 5 },
      { name: 'Alt Tags on Images', pattern: /<img[^>]*alt=["'][^"']+["']/gi, weight: 10 },
      { name: 'Structured Data', pattern: /<script[^>]*type=["']application\/ld\+json["']/gi, weight: 10 },
      { name: 'Internal Links', pattern: /<a[^>]*href=["'][^"']*\.html["']/gi, weight: 5 }
    ];
    
    let totalScore = 0;
    let maxScore = 0;
    const pageResults = [];
    
    seoChecks.forEach(check => {
      const matches = content.match(check.pattern);
      maxScore += check.weight;
      
      if (matches) {
        let score = check.weight;
        
        // Special scoring for image alt tags (percentage-based)
        if (check.name === 'Alt Tags on Images') {
          const allImages = content.match(/<img[^>]*>/gi);
          if (allImages) {
            const altPercentage = matches.length / allImages.length;
            score = Math.round(check.weight * altPercentage);
            console.log(`    ✅ ${check.name}: ${matches.length}/${allImages.length} images (${Math.round(altPercentage*100)}%)`);
          } else {
            score = check.weight; // No images, full score
            console.log(`    ✅ ${check.name}: No images to check`);
          }
        } else {
          console.log(`    ✅ ${check.name}: Found (${matches.length})`);
        }
        
        totalScore += score;
        pageResults.push({ check: check.name, found: true, count: matches.length, score });
      } else {
        console.log(`    ❌ ${check.name}: Missing`);
        pageResults.push({ check: check.name, found: false, count: 0, score: 0 });
      }
    });
    
    const pageScore = Math.round((totalScore / maxScore) * 100);
    console.log(`    📊 SEO Score: ${pageScore}%`);
    
    if (pageScore >= 80) {
      console.log(`    🎉 Fully optimized for Google indexing`);
      seoReport.fullyOptimized++;
    } else if (pageScore >= 60) {
      console.log(`    ⚠️ Partially optimized - room for improvement`);
      seoReport.partiallyOptimized++;
    } else {
      console.log(`    ❌ Needs significant SEO work`);
      seoReport.needsWork++;
    }
    
    seoReport.details.push({
      page: page.name,
      score: pageScore,
      checks: pageResults
    });
  }
  
  // Calculate average score
  if (seoReport.details.length > 0) {
    seoReport.averageScore = Math.round(
      seoReport.details.reduce((sum, page) => sum + page.score, 0) / seoReport.details.length
    );
  }
  
  return seoReport;
}

// 5. HOMEPAGE ATTACHMENT & SITEMAP TEST
function testHomepageAttachment(pageResults) {
  console.log('\n🏠 Testing Homepage Integration & Site Linking:');
  
  // Look for potential homepage files
  const homepageFiles = ['index.html', 'hub.html'];
  let homepage = null;
  
  for (const file of homepageFiles) {
    const found = pageResults.find(p => p.file === file && p.status === 'OK');
    if (found) {
      console.log(`  📋 Using ${found.name} as homepage for analysis`);
      homepage = found;
      break;
    }
  }
  
  if (!homepage) {
    console.log('  ❌ No accessible homepage found');
    return { 
      homepageFound: false, 
      linkedPages: 0, 
      missingLinks: pageResults.filter(p => p.critical).map(p => p.name),
      sitemapPresent: false 
    };
  }
  
  const content = homepage.content;
  const criticalPages = pageResults.filter(p => p.critical && p.status === 'OK');
  const linkedPages = [];
  const missingLinks = [];
  
  console.log(`  🔍 Checking homepage links to all critical landing pages...`);
  
  for (const page of criticalPages) {
    if (page.file === homepage.file) continue; // Skip self-reference
    
    const fileName = page.file.replace('.html', '');
    const linkPatterns = [
      new RegExp(`href=["'][^"']*${fileName}[^"']*["']`, 'gi'),
      new RegExp(`href=["'][^"']*${page.file}["']`, 'gi')
    ];
    
    const found = linkPatterns.some(pattern => content.match(pattern));
    
    if (found) {
      console.log(`  ✅ Link to ${page.name}: Found`);
      linkedPages.push(page.name);
    } else {
      console.log(`  ❌ Link to ${page.name}: Missing`);
      missingLinks.push(page.name);
    }
  }
  
  // Check for sitemap or comprehensive navigation
  const sitemapIndicators = [
    /sitemap/gi,
    /<nav[^>]*>[\s\S]*?<\/nav>/gi,
    /class=["'][^"']*menu[^"']*["']/gi,
    /class=["'][^"']*navigation[^"']*["']/gi
  ];
  
  const sitemapPresent = sitemapIndicators.some(pattern => content.match(pattern));
  
  if (sitemapPresent) {
    console.log(`  🗺️ Navigation/sitemap structure: Found`);
  } else {
    console.log(`  ⚠️ Navigation/sitemap structure: Not clearly identified`);
  }
  
  return {
    homepageFound: true,
    homepageName: homepage.name,
    linkedPages: linkedPages.length,
    totalCriticalPages: criticalPages.length,
    missingLinks,
    sitemapPresent
  };
}

// MAIN EXECUTION
function runComprehensiveLandingPagesTest() {
  try {
    const pageResults = testLandingPagesAvailability();
    const navigationReport = testNavigationFlow(pageResults);
    const functionalityReport = testStructuralFunctionality(pageResults);
    const seoReport = testGoogleIndexingElements(pageResults);
    const homepageAttachment = testHomepageAttachment(pageResults);
    
    // COMPREHENSIVE SUMMARY REPORT
    console.log('\n📊 COMPREHENSIVE LANDING PAGES TEST SUMMARY:');
    console.log('='.repeat(60));
    
    // Page Availability Results
    const totalPages = landingPages.length;
    const availablePages = pageResults.filter(p => p.status === 'OK').length;
    const criticalPages = landingPages.filter(p => p.critical).length;
    const availableCriticalPages = pageResults.filter(p => p.status === 'OK' && p.critical).length;
    
    console.log(`🌐 Landing Pages Availability:`);
    console.log(`   • Total pages tested: ${totalPages}`);
    console.log(`   • Pages available: ${availablePages}/${totalPages} (${Math.round(availablePages/totalPages*100)}%)`);
    console.log(`   • Critical pages available: ${availableCriticalPages}/${criticalPages} (${Math.round(availableCriticalPages/criticalPages*100)}%)`);
    
    // Navigation Results
    console.log(`\n🧭 Navigation Flow:`);
    console.log(`   • Pages with navigation: ${navigationReport.pagesWithNavigation}/${functionalityReport.totalPages}`);
    console.log(`   • Total cross-page links: ${navigationReport.totalLinks}`);
    if (navigationReport.missingNavigation.length > 0) {
      console.log(`   • Pages missing navigation: ${navigationReport.missingNavigation.join(', ')}`);
    }
    
    // Functionality Results
    console.log(`\n🏗️ Structural Functionality:`);
    console.log(`   • Pages with forms: ${functionalityReport.pagesWithForms}/${functionalityReport.totalPages}`);
    console.log(`   • Pages with buttons: ${functionalityReport.pagesWithButtons}/${functionalityReport.totalPages}`);
    console.log(`   • Pages with payment elements: ${functionalityReport.pagesWithPaymentElements}/${functionalityReport.totalPages}`);
    console.log(`   • Pages with EFH components: ${functionalityReport.pagesWithEFHComponents}/${functionalityReport.totalPages}`);
    console.log(`   • Pages with interactivity: ${functionalityReport.pagesWithInteractivity}/${functionalityReport.totalPages}`);
    console.log(`   • Pages with structural issues: ${functionalityReport.structuralIssues.length}/${functionalityReport.totalPages}`);
    
    // SEO Results
    console.log(`\n🔍 Google Indexing & SEO:`);
    console.log(`   • Fully optimized pages: ${seoReport.fullyOptimized}/${seoReport.totalPages}`);
    console.log(`   • Partially optimized pages: ${seoReport.partiallyOptimized}/${seoReport.totalPages}`);
    console.log(`   • Pages needing SEO work: ${seoReport.needsWork}/${seoReport.totalPages}`);
    console.log(`   • Average SEO score: ${seoReport.averageScore}%`);
    
    // Homepage Integration Results
    console.log(`\n🏠 Homepage Integration:`);
    if (homepageAttachment.homepageFound) {
      console.log(`   • Homepage accessible: ✅ (${homepageAttachment.homepageName})`);
      console.log(`   • Critical pages linked from homepage: ${homepageAttachment.linkedPages}/${homepageAttachment.totalCriticalPages}`);
      if (homepageAttachment.missingLinks.length > 0) {
        console.log(`   • Missing homepage links: ${homepageAttachment.missingLinks.join(', ')}`);
      }
      console.log(`   • Sitemap/navigation present: ${homepageAttachment.sitemapPresent ? '✅' : '❌'}`);
    } else {
      console.log(`   • Homepage accessible: ❌`);
    }
    
    // FINAL HEALTH SCORES
    const availabilityScore = (availablePages / totalPages) * 100;
    const criticalAvailabilityScore = (availableCriticalPages / criticalPages) * 100;
    const navigationScore = functionalityReport.totalPages > 0 ? 
      (navigationReport.pagesWithNavigation / functionalityReport.totalPages) * 100 : 0;
    const functionalityScore = functionalityReport.totalPages > 0 ? 
      (functionalityReport.pagesWithEFHComponents / functionalityReport.totalPages) * 100 : 0;
    const seoScore = seoReport.averageScore;
    const homepageScore = homepageAttachment.homepageFound ? 
      (homepageAttachment.linkedPages / Math.max(homepageAttachment.totalCriticalPages, 1)) * 100 : 0;
    
    const overallHealth = Math.round(
      (criticalAvailabilityScore * 0.25 + 
       navigationScore * 0.15 + 
       functionalityScore * 0.20 + 
       seoScore * 0.25 + 
       homepageScore * 0.15)
    );
    
    console.log('\n🎯 FINAL HEALTH SCORES:');
    console.log(`   • Page Availability: ${Math.round(availabilityScore)}%`);
    console.log(`   • Critical Pages: ${Math.round(criticalAvailabilityScore)}%`);
    console.log(`   • Navigation Flow: ${Math.round(navigationScore)}%`);
    console.log(`   • EFH Functionality: ${Math.round(functionalityScore)}%`);
    console.log(`   • SEO Optimization: ${Math.round(seoScore)}%`);
    console.log(`   • Homepage Integration: ${Math.round(homepageScore)}%`);
    
    console.log(`\n🏆 OVERALL LANDING PAGES HEALTH: ${overallHealth}%`);
    
    if (overallHealth >= 90) {
      console.log('🎉 EXCELLENT! All landing pages are production-ready for Google indexing');
      console.log('✅ Ready for immediate deployment and search engine submission');
    } else if (overallHealth >= 75) {
      console.log('⚠️ GOOD - Minor improvements recommended for optimal Google indexing');
      console.log('🔧 Address SEO and navigation issues for best results');
    } else {
      console.log('❌ NEEDS ATTENTION - Critical issues require resolution before deployment');
      console.log('🚨 Fix structural and SEO problems for proper Google indexing');
    }
    
    console.log('\n✅ Comprehensive Landing Pages Test Complete!');
    
    // Return summary for potential automation
    return {
      overallHealth,
      scores: {
        availability: Math.round(availabilityScore),
        critical: Math.round(criticalAvailabilityScore),
        navigation: Math.round(navigationScore),
        functionality: Math.round(functionalityScore),
        seo: Math.round(seoScore),
        homepage: Math.round(homepageScore)
      },
      summary: {
        totalPages,
        availablePages,
        criticalPages: availableCriticalPages,
        navigationIssues: navigationReport.missingNavigation.length,
        seoIssues: seoReport.needsWork,
        homepageIntegrated: homepageAttachment.homepageFound
      }
    };
    
  } catch (error) {
    console.error('💥 Test failed:', error);
    return null;
  }
}

// Execute the test
runComprehensiveLandingPagesTest();