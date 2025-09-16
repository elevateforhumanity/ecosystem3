#!/usr/bin/env node
// Verify that the full site is properly deployed
const fs = require('fs');
const path = require('path');

function verifyFullSite() {
  const distPath = path.join(process.cwd(), 'dist');
  const indexPath = path.join(distPath, 'index.html');
  
  console.log('🔍 Verifying full site deployment...');
  
  if (!fs.existsSync(indexPath)) {
    console.error('❌ index.html not found in dist directory');
    return false;
  }
  
  const content = fs.readFileSync(indexPath, 'utf8');
  
  // Check for comprehensive content indicators
  const checks = [
    { name: 'Has comprehensive title', test: content.includes('Launch Your AI & Data Science Career') },
    { name: 'Has proper meta description', test: content.includes('Transform your career with federally-funded') },
    { name: 'Has navigation content', test: content.includes('efh-nav-primary') },
    { name: 'Has correct canonical URL', test: content.includes('canonical" href="https://www.elevateforhumanity.org/"') },
    { name: 'No old Replit URLs', test: !content.includes('stripe-integrate-curvaturebodysc.replit.app') },
    { name: 'Has structured data', test: content.includes('application/ld+json') },
    { name: 'Has main content sections', test: content.includes('class="') && content.length > 10000 }
  ];
  
  let allPassed = true;
  checks.forEach(check => {
    if (check.test) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name}`);
      allPassed = false;
    }
  });
  
  if (allPassed) {
    console.log('🎉 Full site verification PASSED - site is ready for deployment!');
  } else {
    console.log('⚠️  Full site verification FAILED - check the issues above');
  }
  
  // Report file sizes for monitoring
  const stats = fs.statSync(indexPath);
  console.log(`📊 index.html size: ${Math.round(stats.size / 1024)}KB`);
  
  return allPassed;
}

const passed = verifyFullSite();
process.exit(passed ? 0 : 1);