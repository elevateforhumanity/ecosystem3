// tools/file-based-check.js - Direct file system check for pages, Stripe buttons, and structure
const fs = require('fs');
const path = require('path');

console.log('🔍 EFH File-Based Comprehensive Check Starting...\n');

// 1. CHECK ALL PAGES EXIST
console.log('📄 Checking Page Files Exist:');

const pagesToCheck = [
  { file: 'hub.html', name: 'Hub Site' },
  { file: 'programs.html', name: 'Programs Site' },
  { file: 'connect.html', name: 'Connect Site' },
  { file: 'lms.html', name: 'LMS Site' },
  { file: 'ui/header.html', name: 'Header Component' },
  { file: 'ui/footer.html', name: 'Footer Component' },
  { file: 'config/health-programs.json', name: 'Health Programs Config' },
  { file: 'config/beauty-programs.json', name: 'Beauty Programs Config' },
  { file: 'config/partners.json', name: 'Partners Config' },
  { file: 'scripts/efh-universal.v2.2.js', name: 'Universal Script v2.2' },
  { file: 'server.js', name: 'Server Application' }
];

const pageResults = [];

for (const page of pagesToCheck) {
  if (fs.existsSync(page.file)) {
    const stats = fs.statSync(page.file);
    console.log(`  ✅ ${page.name} - ${Math.round(stats.size/1024)}KB`);
    pageResults.push({ ...page, status: 'OK', size: stats.size });
    
    // Read content for HTML files
    if (page.file.endsWith('.html') || page.file.endsWith('.js')) {
      try {
        const content = fs.readFileSync(page.file, 'utf8');
        pageResults[pageResults.length - 1].content = content;
      } catch (err) {
        console.log(`    ⚠️  Could not read content: ${err.message}`);
      }
    }
  } else {
    console.log(`  ❌ ${page.name} - FILE MISSING`);
    pageResults.push({ ...page, status: 'MISSING' });
  }
}

// 2. CHECK STRIPE BUTTONS AND PAYMENT INTEGRATION
console.log('\n💳 Checking Stripe Buttons and Payment Integration:');

const stripeFindings = {
  buttonsFound: 0,
  enrollmentButtons: 0,
  paymentForms: 0,
  stripeReferences: 0,
  pages: []
};

const htmlPages = pageResults.filter(p => 
  p.file.endsWith('.html') && p.status === 'OK' && p.content
);

for (const page of htmlPages) {
  const findings = {
    page: page.name,
    file: page.file,
    buttons: [],
    stripeElements: [],
    forms: [],
    dataAttributes: []
  };
  
  const content = page.content.toLowerCase();
  
  // Check for enrollment/payment buttons
  const buttonPatterns = [
    { name: 'Enroll Now', pattern: /enroll\s+now/g },
    { name: 'Apply Now', pattern: /apply\s+now/g },
    { name: 'Start Program', pattern: /start\s+program/g },
    { name: 'Payment', pattern: /payment/g },
    { name: 'Checkout', pattern: /checkout/g },
    { name: 'Get Started', pattern: /get\s+started/g },
    { name: 'Join Program', pattern: /join\s+program/g }
  ];
  
  buttonPatterns.forEach(btn => {
    const matches = content.match(btn.pattern);
    if (matches) {
      findings.buttons.push(`${btn.name}: ${matches.length} found`);
      stripeFindings.buttonsFound += matches.length;
      if (btn.name.includes('Enroll') || btn.name.includes('Apply')) {
        stripeFindings.enrollmentButtons += matches.length;
      }
    }
  });
  
  // Check for Stripe integration elements
  const stripePatterns = [
    { name: 'Stripe.com', pattern: /stripe\.com/g },
    { name: 'Stripe JS', pattern: /stripe-js/g },
    { name: 'Payment Intent', pattern: /payment-intent/g },
    { name: 'Stripe Button', pattern: /stripe-button/g },
    { name: 'Payment Form', pattern: /payment-form/g }
  ];
  
  stripePatterns.forEach(stripe => {
    const matches = content.match(stripe.pattern);
    if (matches) {
      findings.stripeElements.push(`${stripe.name}: ${matches.length} found`);
      stripeFindings.stripeReferences += matches.length;
    }
  });
  
  // Check for data attributes for payment integration
  const dataPatterns = [
    { name: 'Program Data', pattern: /data-program/g },
    { name: 'Partner Data', pattern: /data-partner/g },
    { name: 'Price Data', pattern: /data-price/g },
    { name: 'Payment Data', pattern: /data-payment/g }
  ];
  
  dataPatterns.forEach(data => {
    const matches = content.match(data.pattern);
    if (matches) {
      findings.dataAttributes.push(`${data.name}: ${matches.length} found`);
    }
  });
  
  // Check for forms
  const formMatches = content.match(/<form[^>]*>/g);
  if (formMatches) {
    findings.forms.push(`Forms: ${formMatches.length} found`);
    stripeFindings.paymentForms += formMatches.length;
  }
  
  if (findings.buttons.length > 0 || findings.stripeElements.length > 0 || 
      findings.forms.length > 0 || findings.dataAttributes.length > 0) {
    stripeFindings.pages.push(findings);
    console.log(`  💳 ${page.name}:`);
    findings.buttons.forEach(b => console.log(`    🔘 ${b}`));
    findings.stripeElements.forEach(s => console.log(`    💸 ${s}`));
    findings.dataAttributes.forEach(d => console.log(`    📊 ${d}`));
    findings.forms.forEach(f => console.log(`    📝 ${f}`));
  } else {
    console.log(`  ➖ ${page.name} - No payment elements found`);
  }
}

// 3. CHECK STRUCTURAL INTEGRITY
console.log('\n🏗️  Checking HTML Structural Integrity:');

const structuralIssues = [];

for (const page of htmlPages) {
  const issues = [];
  const content = page.content;
  
  // Check for essential HTML elements
  const essentialElements = [
    { name: 'DOCTYPE', pattern: /<!doctype\s+html/i },
    { name: 'HTML tag', pattern: /<html[^>]*>/i },
    { name: 'HEAD tag', pattern: /<head[^>]*>/i },
    { name: 'BODY tag', pattern: /<body[^>]*>/i },
    { name: 'Title tag', pattern: /<title[^>]*>/i }
  ];
  
  essentialElements.forEach(element => {
    if (!element.pattern.test(content)) {
      issues.push(`Missing: ${element.name}`);
    }
  });
  
  // Check for EFH-specific elements
  const efhElements = [
    { name: 'EFH Header div', pattern: /<div[^>]*id=["']efh-header["'][^>]*>/i },
    { name: 'EFH Footer div', pattern: /<div[^>]*id=["']efh-footer["'][^>]*>/i },
    { name: 'Universal Script v2.2', pattern: /efh-universal\.v2\.2\.js/i }
  ];
  
  efhElements.forEach(element => {
    if (!element.pattern.test(content)) {
      issues.push(`EFH Missing: ${element.name}`);
    }
  });
  
  // Check for SEO elements
  const seoElements = [
    { name: 'Meta description', pattern: /<meta[^>]*name=["']description["']/i },
    { name: 'Meta viewport', pattern: /<meta[^>]*name=["']viewport["']/i },
    { name: 'Meta charset', pattern: /<meta[^>]*charset/i }
  ];
  
  seoElements.forEach(element => {
    if (!element.pattern.test(content)) {
      issues.push(`SEO Missing: ${element.name}`);
    }
  });
  
  if (issues.length === 0) {
    console.log(`  ✅ ${page.name} - Structure OK`);
  } else {
    console.log(`  ⚠️  ${page.name} - ${issues.length} issues:`);
    issues.forEach(issue => console.log(`    • ${issue}`));
    structuralIssues.push({ page: page.name, file: page.file, issues });
  }
}

// 4. CHECK UNIVERSAL SCRIPT FUNCTIONALITY
console.log('\n⚙️  Checking Universal Script v2.2 Features:');

const scriptPage = pageResults.find(p => p.file === 'scripts/efh-universal.v2.2.js');
if (scriptPage && scriptPage.content) {
  const scriptContent = scriptPage.content;
  
  const features = [
    { name: 'Header/Footer Injection', check: 'injectChrome', critical: true },
    { name: 'Logo Support', check: 'getPartnerLogo', critical: true },
    { name: 'Auto Partners Link', check: 'ensurePartnersLink', critical: false },
    { name: 'Error Handling', check: 'onerror', critical: false },
    { name: 'Data Loading', check: 'loadProgramsData', critical: true },
    { name: 'Version Check', check: 'v2.2', critical: true }
  ];
  
  const missingFeatures = [];
  
  features.forEach(feature => {
    if (scriptContent.includes(feature.check)) {
      console.log(`  ✅ ${feature.name} - Available`);
    } else {
      console.log(`  ${feature.critical ? '❌' : '⚠️'} ${feature.name} - ${feature.critical ? 'MISSING' : 'Not found'}`);
      if (feature.critical) {
        missingFeatures.push(feature.name);
      }
    }
  });
  
  if (missingFeatures.length > 0) {
    console.log(`  🚨 Critical features missing: ${missingFeatures.join(', ')}`);
  }
} else {
  console.log('  ❌ Universal Script v2.2 - FILE NOT FOUND OR UNREADABLE');
}

// 5. CHECK JSON CONFIGURATION FILES
console.log('\n📋 Validating JSON Configuration Files:');

const jsonFiles = pageResults.filter(p => p.file.endsWith('.json') && p.status === 'OK');

for (const jsonFile of jsonFiles) {
  try {
    const content = fs.readFileSync(jsonFile.file, 'utf8');
    const data = JSON.parse(content);
    
    if (Array.isArray(data)) {
      console.log(`  ✅ ${jsonFile.name} - Valid JSON with ${data.length} items`);
      
      // Special checks for different config files
      if (jsonFile.file.includes('partners.json')) {
        const withLogos = data.filter(p => p.logo).length;
        console.log(`    📸 ${withLogos}/${data.length} partners have logos configured`);
        
        const withStripe = data.filter(p => p.stripeAccount || p.paymentSplit).length;
        if (withStripe > 0) {
          console.log(`    💳 ${withStripe}/${data.length} partners have payment configured`);
        }
      }
      
      if (jsonFile.file.includes('programs.json')) {
        const withPricing = data.filter(p => p.price || p.cost).length;
        console.log(`    💰 ${withPricing}/${data.length} programs have pricing configured`);
      }
    } else {
      console.log(`  ⚠️  ${jsonFile.name} - Valid JSON but not an array (${typeof data})`);
    }
  } catch (error) {
    console.log(`  ❌ ${jsonFile.name} - Invalid JSON: ${error.message}`);
  }
}

// 6. FINAL SUMMARY REPORT
console.log('\n📊 COMPREHENSIVE FILE-BASED CHECK SUMMARY:');
console.log('='.repeat(60));

const totalFiles = pagesToCheck.length;
const existingFiles = pageResults.filter(p => p.status === 'OK').length;
const htmlFilesChecked = htmlPages.length;

console.log(`📄 Files: ${existingFiles}/${totalFiles} exist`);
console.log(`🌐 HTML Pages: ${htmlFilesChecked} checked for functionality`);

console.log(`💳 Stripe Integration Summary:`);
console.log(`   • Total payment buttons: ${stripeFindings.buttonsFound}`);
console.log(`   • Enrollment buttons: ${stripeFindings.enrollmentButtons}`);
console.log(`   • Stripe references: ${stripeFindings.stripeReferences}`);
console.log(`   • Forms detected: ${stripeFindings.paymentForms}`);
console.log(`   • Pages with payment elements: ${stripeFindings.pages.length}/${htmlFilesChecked}`);

console.log(`🏗️  Structure: ${htmlFilesChecked - structuralIssues.length}/${htmlFilesChecked} pages structurally sound`);

// Calculate health score
const fileScore = (existingFiles / totalFiles) * 100;
const structureScore = ((htmlFilesChecked - structuralIssues.length) / Math.max(htmlFilesChecked, 1)) * 100;
const paymentScore = stripeFindings.pages.length > 0 ? 100 : 0;

const overallHealth = Math.round((fileScore * 0.4 + structureScore * 0.3 + paymentScore * 0.3));

console.log('\n🎯 FINAL ECOSYSTEM HEALTH SCORE:');
if (overallHealth >= 90) {
  console.log(`🎉 ${overallHealth}% - EXCELLENT! All systems operational`);
  console.log('✅ Ready for production deployment');
} else if (overallHealth >= 75) {
  console.log(`⚠️  ${overallHealth}% - GOOD - Minor issues to address`);
  console.log('🔧 Some improvements recommended');
} else {
  console.log(`❌ ${overallHealth}% - NEEDS ATTENTION - Critical issues found`);
  console.log('🚨 Major issues require resolution');
}

console.log(`\n📈 Component Scores:`);
console.log(`   • File Availability: ${Math.round(fileScore)}%`);
console.log(`   • HTML Structure: ${Math.round(structureScore)}%`);
console.log(`   • Payment Integration: ${Math.round(paymentScore)}%`);

console.log('\n✅ File-Based Comprehensive Check Complete!');

// Return summary for potential use
const summary = {
  overallHealth,
  fileScore,
  structureScore,
  paymentScore,
  filesChecked: existingFiles,
  totalFiles,
  stripeFindings,
  structuralIssues: structuralIssues.length,
  pagesWithPayments: stripeFindings.pages.length
};

console.log('\n📋 JSON Summary for automated processing:');
console.log(JSON.stringify(summary, null, 2));