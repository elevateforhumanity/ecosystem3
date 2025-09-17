#!/usr/bin/env node

// Simple deployment monitor to check when flash sale goes live
const https = require('https');

const SITE_URL = 'https://elevateforhumanity.org';
const CHECK_PATHS = [
  '/flash-sale-store.html',
  '/license-dashboard.html',
  '/elevate_license_dashboard.html'
];

console.log('🚀 Monitoring deployment status...');
console.log(`📍 Site: ${SITE_URL}`);
console.log('⏳ Checking every 30 seconds...\n');

function checkPath(path) {
  return new Promise((resolve) => {
    const url = `${SITE_URL}${path}`;
    https.get(url, (res) => {
      resolve({
        path,
        status: res.statusCode,
        success: res.statusCode === 200
      });
    }).on('error', () => {
      resolve({
        path,
        status: 'ERROR',
        success: false
      });
    });
  });
}

async function checkDeployment() {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] Checking deployment...`);
  
  const results = await Promise.all(CHECK_PATHS.map(checkPath));
  
  let allLive = true;
  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`  ${status} ${result.path} (${result.status})`);
    if (!result.success) allLive = false;
  });
  
  if (allLive) {
    console.log('\n🎉 DEPLOYMENT COMPLETE! Flash sale system is LIVE!');
    console.log('💰 Ready to generate revenue immediately!');
    console.log(`🔗 Flash Sale: ${SITE_URL}/flash-sale-store.html`);
    process.exit(0);
  } else {
    console.log('⏳ Still deploying...\n');
  }
}

// Check immediately, then every 30 seconds
checkDeployment();
setInterval(checkDeployment, 30000);

// Auto-exit after 10 minutes
setTimeout(() => {
  console.log('\n⏰ Monitoring timeout reached. Check manually:');
  console.log(`🔗 ${SITE_URL}/flash-sale-store.html`);
  process.exit(1);
}, 600000);