#!/usr/bin/env node
/**
 * Verification Script for Google Console Setup
 * Checks that all SEO and Google configurations are properly implemented
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

console.log('🔍 Google Console Setup Verification');
console.log('====================================\n');

// Check 1: Google Configuration Script
console.log('1. Checking Google Configuration Script...');
const googleConfigPath = path.join(ROOT, 'scripts/apply-google-config.js');
if (fs.existsSync(googleConfigPath)) {
  console.log('   ✅ apply-google-config.js exists');
} else {
  console.log('   ❌ apply-google-config.js missing');
}

// Check 2: Package.json scripts
console.log('\n2. Checking npm scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  if (packageJson.scripts && packageJson.scripts['google:apply']) {
    console.log('   ✅ google:apply script exists');
  } else {
    console.log('   ❌ google:apply script missing');
  }
  
  if (packageJson.scripts && packageJson.scripts['sitemaps:generate']) {
    console.log('   ✅ sitemaps:generate script exists');
  } else {
    console.log('   ❌ sitemaps:generate script missing');
  }
} catch (error) {
  console.log('   ❌ Error reading package.json');
}

// Check 3: Key HTML files have proper meta tags
console.log('\n3. Checking key HTML files for SEO meta tags...');
const keyFiles = ['index.html', 'programs.html', 'hub.html'];

keyFiles.forEach(file => {
  const filePath = path.join(ROOT, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for Open Graph tags
    const hasOG = content.includes('property="og:title"') && content.includes('property="og:description"');
    
    // Check for Twitter Cards
    const hasTwitter = content.includes('property="twitter:card"');
    
    // Check for Google Analytics
    const hasGA = content.includes('googletagmanager.com/gtag/js') || content.includes('gtag(');
    
    console.log(`   ${file}:`);
    console.log(`     ${hasOG ? '✅' : '❌'} Open Graph tags`);
    console.log(`     ${hasTwitter ? '✅' : '❌'} Twitter Card tags`);
    console.log(`     ${hasGA ? '✅' : '❌'} Google Analytics`);
  } else {
    console.log(`   ❌ ${file} not found`);
  }
});

// Check 4: Google Site Verification file
console.log('\n4. Checking Google site verification...');
const verificationPath = path.join(ROOT, 'google-site-verification.html');
if (fs.existsSync(verificationPath)) {
  const content = fs.readFileSync(verificationPath, 'utf8');
  if (content.includes('google-site-verification')) {
    console.log('   ✅ Google site verification file exists');
    
    // Check if it still has placeholder
    if (content.includes('GOOGLE_VERIFICATION_CODE_HERE')) {
      console.log('   ⚠️  Still contains placeholder - run npm run google:apply');
    } else {
      console.log('   ✅ Verification code appears to be set');
    }
  } else {
    console.log('   ❌ Verification file malformed');
  }
} else {
  console.log('   ❌ google-site-verification.html missing');
}

// Check 5: Sitemaps
console.log('\n5. Checking sitemaps...');
const sitemapIndexPath = path.join(ROOT, 'sitemap-index.xml');
const sitemapsDir = path.join(ROOT, 'sitemaps');

if (fs.existsSync(sitemapIndexPath)) {
  console.log('   ✅ sitemap-index.xml exists');
} else {
  console.log('   ❌ sitemap-index.xml missing - run npm run sitemaps:generate');
}

if (fs.existsSync(sitemapsDir)) {
  const sitemapFiles = fs.readdirSync(sitemapsDir).filter(f => f.endsWith('.xml'));
  console.log(`   ✅ ${sitemapFiles.length} sitemap files in /sitemaps/`);
} else {
  console.log('   ❌ /sitemaps/ directory missing');
}

// Check 6: Robots.txt
console.log('\n6. Checking robots.txt...');
const robotsPath = path.join(ROOT, 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const content = fs.readFileSync(robotsPath, 'utf8');
  if (content.includes('Sitemap:')) {
    console.log('   ✅ robots.txt exists with sitemap reference');
  } else {
    console.log('   ⚠️  robots.txt exists but no sitemap reference');
  }
} else {
  console.log('   ❌ robots.txt missing');
}

// Check 7: Environment variables setup
console.log('\n7. Checking environment setup...');
const envExamplePath = path.join(ROOT, '.env.local.example');
if (fs.existsSync(envExamplePath)) {
  console.log('   ✅ .env.local.example exists');
} else {
  console.log('   ❌ .env.local.example missing');
}

console.log('\n🎉 Verification complete!');
console.log('\n📋 Next Steps:');
console.log('1. Set your actual Google Analytics ID and Search Console verification code');
console.log('2. Run: npm run google:apply');
console.log('3. Run: npm run sitemaps:generate');
console.log('4. Submit sitemap-index.xml to Google Search Console');
console.log('5. Verify meta tags with Google Rich Results Test');