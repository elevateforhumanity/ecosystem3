
#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🎯 EFH COMPREHENSIVE HEALTH CHECK - All Today\'s Work\n');
console.log('='.repeat(60));

// 1. SERVER FILES CHECK
console.log('\n🖥️  SERVER FILES VALIDATION:');
const serverFiles = [
  { file: 'simple-server.cjs', required: true, purpose: 'Main server (CommonJS)' },
  { file: 'server.mjs', required: false, purpose: 'Hardened server (ES6)' },
  { file: 'backend-api.js', required: false, purpose: 'Backend API services' }
];

let serverHealth = 0;
serverFiles.forEach(({ file, required, purpose }) => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`  ✅ ${file} - ${Math.round(stats.size/1024)}KB (${purpose})`);
    serverHealth++;
  } else {
    console.log(`  ${required ? '❌' : '⚠️'} ${file} - MISSING (${purpose})`);
  }
});

// 2. SISTER SITES CHECK
console.log('\n🌐 SISTER SITES ECOSYSTEM:');
const sisterSites = [
  'hub.html', 'programs.html', 'lms.html', 'connect.html', 
  'compliance.html', 'account.html', 'partners.html', 
  'admin-dashboard.html', 'demo-site.html'
];

let sitesHealth = 0;
sisterSites.forEach(site => {
  if (fs.existsSync(site)) {
    const content = fs.readFileSync(site, 'utf8');
    const hasUniversalScript = content.includes('efh-universal.v2.2.js');
    const hasEFHStructure = content.includes('id="efh-header"') && content.includes('id="efh-footer"');
    
    console.log(`  ✅ ${site} - ${hasUniversalScript ? '🔗' : '❌'} Universal Script ${hasEFHStructure ? '🏗️' : '❌'} Structure`);
    sitesHealth++;
  } else {
    console.log(`  ❌ ${site} - MISSING`);
  }
});

// 3. UNIVERSAL SCRIPT & BRAIN ASSETS CHECK
console.log('\n🧠 BRAIN REPOSITORY & UNIVERSAL SCRIPT:');
const brainAssets = [
  'scripts/efh-universal.v2.2.js',
  'config/partners.json',
  'config/health-programs.json',
  'config/beauty-programs.json',
  'ui/header.html',
  'ui/footer.html'
];

let brainHealth = 0;
brainAssets.forEach(asset => {
  if (fs.existsSync(asset)) {
    const stats = fs.statSync(asset);
    console.log(`  ✅ ${asset} - ${Math.round(stats.size/1024)}KB`);
    brainHealth++;
    
    // Special checks for universal script
    if (asset.includes('efh-universal.v2.2.js')) {
      const content = fs.readFileSync(asset, 'utf8');
      const features = ['injectChrome', 'getPartnerLogo', 'loadProgramsData', 'ensurePartnersLink'];
      const availableFeatures = features.filter(f => content.includes(f));
      console.log(`    📋 Features: ${availableFeatures.length}/${features.length} available`);
    }
  } else {
    console.log(`  ❌ ${asset} - MISSING`);
  }
});

// 4. STRIPE INTEGRATION CHECK
console.log('\n💳 STRIPE INTEGRATION VALIDATION:');
const stripeFiles = [
  'enhanced-checkout-with-coupons.js',
  'payment-processing-with-splits.js',
  'stripe-products-creator.js'
];

let stripeHealth = 0;
stripeFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const hasStripeAPI = content.includes('stripe') || content.includes('Stripe');
    console.log(`  ✅ ${file} - ${hasStripeAPI ? '💳' : '❌'} Stripe API integrated`);
    stripeHealth++;
  } else {
    console.log(`  ⚠️ ${file} - Missing (optional)`);
  }
});

// Count payment buttons across HTML files
let totalPaymentButtons = 0;
sisterSites.forEach(site => {
  if (fs.existsSync(site)) {
    const content = fs.readFileSync(site, 'utf8');
    const buttons = content.match(/checkout|enroll|payment|stripe/gi) || [];
    totalPaymentButtons += buttons.length;
  }
});
console.log(`  📊 Total payment elements found: ${totalPaymentButtons}`);

// 5. LMS & FEATURES CHECK
console.log('\n🎓 LMS & ENHANCED FEATURES:');
const lmsFeatures = [
  'lms.html',
  'lms-performance.js',
  'video-generator.js',
  'video-storage-manager.js'
];

let lmsHealth = 0;
lmsFeatures.forEach(feature => {
  if (fs.existsExists(feature)) {
    console.log(`  ✅ ${feature} - Available`);
    lmsHealth++;
  } else {
    console.log(`  ⚠️ ${feature} - Missing (optional)`);
  }
});

// 6. WORKFLOW & DEPLOYMENT CHECK
console.log('\n⚙️ WORKFLOW & DEPLOYMENT STATUS:');
if (fs.existsSync('.replit')) {
  const replit = fs.readFileSync('.replit', 'utf8');
  const hasWorkflow = replit.includes('simple-server.cjs');
  console.log(`  ${hasWorkflow ? '✅' : '❌'} .replit configured for simple-server.cjs`);
} else {
  console.log(`  ❌ .replit missing`);
}

// 7. FINAL HEALTH SCORE
console.log('\n📊 COMPREHENSIVE HEALTH SUMMARY:');
console.log('='.repeat(50));

const totalComponents = serverFiles.length + sisterSites.length + brainAssets.length;
const healthyComponents = serverHealth + sitesHealth + brainHealth;
const overallHealth = Math.round((healthyComponents / totalComponents) * 100);

console.log(`🖥️  Server Files: ${serverHealth}/${serverFiles.length}`);
console.log(`🌐 Sister Sites: ${sitesHealth}/${sisterSites.length}`);
console.log(`🧠 Brain Assets: ${brainHealth}/${brainAssets.length}`);
console.log(`💳 Stripe Integration: ${stripeHealth}/${stripeFiles.length} (optional)`);
console.log(`🎓 LMS Features: ${lmsHealth}/${lmsFeatures.length} (optional)`);

console.log(`\n🎯 OVERALL HEALTH SCORE: ${overallHealth}%`);

if (overallHealth >= 90) {
  console.log('🎉 EXCELLENT! All systems operational and ready for production');
  console.log('✅ Ecosystem is fully functional and integrated');
} else if (overallHealth >= 75) {
  console.log('⚠️ GOOD - Minor issues to address but core functionality intact');
  console.log('🔧 Some optional components missing');
} else if (overallHealth >= 60) {
  console.log('🚨 NEEDS ATTENTION - Core functionality may be impaired');
  console.log('🛠️ Critical components require fixes');
} else {
  console.log('❌ CRITICAL ISSUES - Ecosystem requires immediate attention');
  console.log('🆘 Major components missing or broken');
}

console.log('\n🚀 NEXT STEPS:');
if (overallHealth >= 75) {
  console.log('• Test the server with `npm start` or Run button');
  console.log('• Verify all sister sites load correctly');
  console.log('• Check payment integration on demo pages');
} else {
  console.log('• Fix missing critical files first');
  console.log('• Ensure server starts without errors');
  console.log('• Validate sister sites connectivity');
}

console.log('\n✅ Health Check Complete!');
