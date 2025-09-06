
// tools/complete-ecosystem-purge.js - Complete ecosystem cache and build purge
const fs = require('fs');
const path = require('path');

console.log('🧹 COMPLETE ECOSYSTEM PURGE STARTING...\n');

// 1. Clear all build directories
const buildDirs = [
  'client/dist',
  'client/build', 
  'dist',
  'build',
  '.next',
  '.nuxt',
  'public/build'
];

console.log('📁 Clearing build directories:');
buildDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`  ✅ Removed: ${dir}`);
  } else {
    console.log(`  ⏭️  Not found: ${dir}`);
  }
});

// 2. Clear cache files
const cacheFiles = [
  '.buildmode-quick',
  'node_modules/.cache',
  '.vite',
  '.turbo',
  'client/node_modules/.cache',
  'client/.vite'
];

console.log('\n🗄️ Clearing cache files:');
cacheFiles.forEach(file => {
  if (fs.existsSync(file)) {
    fs.rmSync(file, { recursive: true, force: true });
    console.log(`  ✅ Removed: ${file}`);
  } else {
    console.log(`  ⏭️  Not found: ${file}`);
  }
});

// 3. Clear temp and log files
const tempPatterns = [
  '*.log',
  '*.tmp',
  '.DS_Store',
  'Thumbs.db'
];

function clearTempFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      clearTempFiles(fullPath);
    } else if (tempPatterns.some(pattern => 
      file.endsWith(pattern.replace('*', '')))) {
      fs.unlinkSync(fullPath);
      console.log(`  ✅ Removed temp: ${fullPath}`);
    }
  });
}

console.log('\n🗑️ Clearing temp files:');
clearTempFiles('.');

// 4. Reset package locks (force fresh installs)
const lockFiles = [
  'package-lock.json',
  'client/package-lock.json',
  'yarn.lock'
];

console.log('\n🔒 Resetting package locks:');
lockFiles.forEach(lock => {
  if (fs.existsSync(lock)) {
    fs.unlinkSync(lock);
    console.log(`  ✅ Removed: ${lock}`);
  }
});

// 5. Update cache buster version
const newCacheVersion = Date.now();
console.log(`\n🔄 Setting new cache version: ${newCacheVersion}`);

// 6. Generate fresh sitemap with cache busters
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://stripe-integrate-curvaturebodysc.replit.app/?v=${newCacheVersion}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://stripe-integrate-curvaturebodysc.replit.app/programs?v=${newCacheVersion}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://stripe-integrate-curvaturebodysc.replit.app/hub?v=${newCacheVersion}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://stripe-integrate-curvaturebodysc.replit.app/connect?v=${newCacheVersion}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://stripe-integrate-curvaturebodysc.replit.app/lms?v=${newCacheVersion}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemapContent);
console.log('  ✅ Updated sitemap.xml with fresh cache busters');

console.log('\n🎯 PURGE COMPLETE! Run npm install && npm run build for fresh start');
console.log(`📋 New cache version: ${newCacheVersion}`);
