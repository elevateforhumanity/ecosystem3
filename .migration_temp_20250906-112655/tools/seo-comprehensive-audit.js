/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/


const fs = require('fs');
const path = require('path');

// Comprehensive SEO Audit Tool
console.log('🔍 Starting Comprehensive SEO Audit...\n');

// 1. Check sitemap.xml
function auditSitemap() {
  console.log('📋 SITEMAP AUDIT:');
  try {
    const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
    const urlCount = (sitemap.match(/<url>/g) || []).length;
    const lastMod = sitemap.includes('<lastmod>2025-01-28</lastmod>');
    const priorities = sitemap.includes('<priority>');
    
    console.log(`  ✅ Sitemap exists with ${urlCount} URLs`);
    console.log(`  ${lastMod ? '✅' : '❌'} Last modified dates current`);
    console.log(`  ${priorities ? '✅' : '❌'} Priority tags included`);
    
    // Check for missing pages
    const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
    const missingPages = htmlFiles.filter(file => !sitemap.includes(file.replace('.html', '')));
    if (missingPages.length > 0) {
      console.log(`  ⚠️ Missing from sitemap: ${missingPages.join(', ')}`);
    }
  } catch (error) {
    console.log('  ❌ Sitemap.xml not found or invalid');
  }
  console.log('');
}

// 2. Check robots.txt
function auditRobots() {
  console.log('🤖 ROBOTS.TXT AUDIT:');
  try {
    const robots = fs.readFileSync('robots.txt', 'utf8');
    const allowsAll = robots.includes('User-agent: *\nAllow: /');
    const hasSitemap = robots.includes('Sitemap:');
    const blocksAdmin = robots.includes('Disallow: /admin') || robots.includes('Disallow: /tools');
    
    console.log(`  ${allowsAll ? '✅' : '❌'} Allows search engine crawling`);
    console.log(`  ${hasSitemap ? '✅' : '❌'} Sitemap URL included`);
    console.log(`  ${blocksAdmin ? '✅' : '❌'} Admin areas blocked`);
  } catch (error) {
    console.log('  ❌ robots.txt not found');
  }
  console.log('');
}

// 3. Audit meta tags on all pages
function auditMetaTags() {
  console.log('🏷️ META TAGS AUDIT:');
  const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  
  htmlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      console.log(`  📄 ${file}:`);
      
      // Essential meta tags
      const title = content.match(/<title[^>]*>([^<]+)<\/title>/i);
      const description = content.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
      const viewport = content.includes('name="viewport"');
      const charset = content.includes('charset=');
      
      // Open Graph tags
      const ogTitle = content.includes('property="og:title"');
      const ogDesc = content.includes('property="og:description"');
      const ogImage = content.includes('property="og:image"');
      const ogUrl = content.includes('property="og:url"');
      
      // Twitter cards
      const twitterCard = content.includes('name="twitter:card"');
      const twitterTitle = content.includes('name="twitter:title"');
      
      // Structured data
      const structuredData = content.includes('application/ld+json');
      
      // Google verification
      const googleVerify = content.includes('google-site-verification');
      
      console.log(`    ${title ? '✅' : '❌'} Title: ${title ? title[1].substring(0, 50) + '...' : 'Missing'}`);
      console.log(`    ${description ? '✅' : '❌'} Description: ${description ? (description[1].length + ' chars') : 'Missing'}`);
      console.log(`    ${viewport ? '✅' : '❌'} Viewport meta tag`);
      console.log(`    ${charset ? '✅' : '❌'} Charset declaration`);
      console.log(`    ${ogTitle && ogDesc && ogImage ? '✅' : '❌'} Open Graph complete`);
      console.log(`    ${twitterCard && twitterTitle ? '✅' : '❌'} Twitter Cards`);
      console.log(`    ${structuredData ? '✅' : '❌'} Structured Data (JSON-LD)`);
      console.log(`    ${googleVerify ? '✅' : '❌'} Google verification`);
      
    } catch (error) {
      console.log(`    ❌ Error reading ${file}`);
    }
    console.log('');
  });
}

// 4. Check for Google Analytics
function auditGoogleAnalytics() {
  console.log('📊 GOOGLE ANALYTICS AUDIT:');
  const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  let hasGA4 = false;
  let hasGTM = false;
  
  htmlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('gtag(') || content.includes('GA_MEASUREMENT_ID')) {
        hasGA4 = true;
      }
      if (content.includes('googletagmanager.com')) {
        hasGTM = true;
      }
    } catch (error) {
      // Skip file
    }
  });
  
  console.log(`  ${hasGA4 ? '✅' : '❌'} Google Analytics 4 (GA4) detected`);
  console.log(`  ${hasGTM ? '✅' : '❌'} Google Tag Manager detected`);
  console.log('');
}

// 5. Check high-ranking SEO keywords
function auditSEOKeywords() {
  console.log('🎯 HIGH-RANKING SEO KEYWORDS AUDIT:');
  
  const targetKeywords = [
    'AI training', 'data science bootcamp', 'workforce development',
    'WIOA funding', 'career training', 'federal grants', 'job placement',
    'python programming', 'machine learning', 'cybersecurity training',
    'online bootcamp', 'tech career', 'certification programs'
  ];
  
  const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  const keywordStats = {};
  
  targetKeywords.forEach(keyword => {
    keywordStats[keyword] = 0;
    htmlFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8').toLowerCase();
        const matches = (content.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
        keywordStats[keyword] += matches;
      } catch (error) {
        // Skip file
      }
    });
  });
  
  console.log('  📈 Keyword density across all pages:');
  Object.entries(keywordStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([keyword, count]) => {
      const status = count > 5 ? '✅' : count > 2 ? '⚠️' : '❌';
      console.log(`    ${status} "${keyword}": ${count} mentions`);
    });
  console.log('');
}

// 6. Check Bing optimization
function auditBingOptimization() {
  console.log('🔍 BING OPTIMIZATION AUDIT:');
  
  try {
    const bingVerification = fs.readFileSync('bing-site-verification.html', 'utf8');
    console.log('  ✅ Bing site verification file exists');
  } catch (error) {
    console.log('  ❌ Bing site verification file missing');
  }
  
  // Check for Bing meta tags in HTML files
  const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  let hasBingMeta = false;
  
  htmlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('msvalidate.01')) {
        hasBingMeta = true;
      }
    } catch (error) {
      // Skip file
    }
  });
  
  console.log(`  ${hasBingMeta ? '✅' : '❌'} Bing verification meta tag found`);
  console.log('');
}

// 7. Performance and Core Web Vitals check
function auditPerformance() {
  console.log('⚡ PERFORMANCE AUDIT:');
  
  const htmlFiles = fs.readdirSync('.').filter(f => f.endsWith('.html'));
  let totalSize = 0;
  let hasPreload = false;
  let hasCriticalCSS = false;
  
  htmlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const stats = fs.statSync(file);
      totalSize += stats.size;
      
      if (content.includes('rel="preload"')) hasPreload = true;
      if (content.includes('critical.css') || content.includes('<style>')) hasCriticalCSS = true;
      
    } catch (error) {
      // Skip file
    }
  });
  
  console.log(`  📊 Total HTML size: ${(totalSize / 1024).toFixed(2)}KB`);
  console.log(`  ${hasPreload ? '✅' : '❌'} Resource preloading`);
  console.log(`  ${hasCriticalCSS ? '✅' : '❌'} Critical CSS optimization`);
  console.log('');
}

// Run all audits
auditSitemap();
auditRobots();
auditMetaTags();
auditGoogleAnalytics();
auditSEOKeywords();
auditBingOptimization();
auditPerformance();

console.log('🎉 SEO Audit Complete!');
console.log('\n📋 SUMMARY RECOMMENDATIONS:');
console.log('1. Update meta descriptions to 150-160 characters');
console.log('2. Add Google Analytics 4 tracking');
console.log('3. Implement Bing Webmaster Tools verification');
console.log('4. Increase keyword density for target terms');
console.log('5. Add more structured data for rich snippets');
console.log('6. Optimize Core Web Vitals for better rankings');
