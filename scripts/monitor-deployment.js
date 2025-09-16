#!/usr/bin/env node
// Comprehensive deployment verification - checks multiple indicators
const https = require('https');

async function fetchUrl(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Request timed out after ${timeout}ms`));
    }, timeout);

    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (deployment verification)' } }, (res) => {
      clearTimeout(timer);
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, body: data });
      });
    }).on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function verifyDeployment() {
  const urls = [
    'https://www.elevateforhumanity.org',
    'https://elevateforhumanity.org'
  ];
  
  console.log('🔍 Comprehensive deployment verification starting...\n');
  
  for (const url of urls) {
    try {
      console.log(`Checking ${url}...`);
      const response = await fetchUrl(url);
      
      if (response.statusCode === 200) {
        const content = response.body;
        
        // Check for full site indicators
        const checks = [
          { name: 'Full content title', test: content.includes('Launch Your AI') },
          { name: 'Comprehensive description', test: content.includes('federally-funded') },
          { name: 'Navigation present', test: content.includes('efh-nav-primary') || content.includes('Programs') },
          { name: 'Substantial content', test: content.length > 10000 },
          { name: 'Proper domain in meta', test: content.includes('elevateforhumanity.org') },
          { name: 'No old domains', test: !content.includes('replit.app') }
        ];
        
        let passed = 0;
        checks.forEach(check => {
          if (check.test) {
            console.log(`  ✅ ${check.name}`);
            passed++;
          } else {
            console.log(`  ❌ ${check.name}`);
          }
        });
        
        console.log(`  📊 Content size: ${Math.round(content.length / 1024)}KB`);
        console.log(`  📈 Verification: ${passed}/${checks.length} checks passed\n`);
        
        if (passed === checks.length) {
          console.log(`🎉 SUCCESS: ${url} is serving the full site content!`);
          return true;
        }
      } else {
        console.log(`  ❌ HTTP ${response.statusCode}\n`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}\n`);
    }
  }
  
  return false;
}

async function main() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    attempts++;
    console.log(`\n⏰ Attempt ${attempts}/${maxAttempts} - ${new Date().toISOString()}`);
    
    const success = await verifyDeployment();
    if (success) {
      console.log('\n🚀 DEPLOYMENT VERIFICATION COMPLETE - Full site is live!');
      process.exit(0);
    }
    
    if (attempts < maxAttempts) {
      console.log('⚠️  Full site not yet live, waiting 45 seconds before next check...');
      await new Promise(resolve => setTimeout(resolve, 45000));
    }
  }
  
  console.log('\n⏰ Maximum attempts reached. Please check Vercel deployment status manually.');
  process.exit(1);
}

main().catch(console.error);