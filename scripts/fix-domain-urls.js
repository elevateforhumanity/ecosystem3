#!/usr/bin/env node
// Fix domain URLs in all HTML files - replace Replit URLs with production domain
const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');

const OLD_DOMAIN = 'https://stripe-integrate-curvaturebodysc.replit.app';
const NEW_DOMAIN = 'https://www.elevateforhumanity.org';

function fixUrlsInFile(file) {
  try {
    const src = fs.readFileSync(file, 'utf8');
    let out = src;
    
    // Replace all occurrences of the old domain
    out = out.replace(new RegExp(OLD_DOMAIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), NEW_DOMAIN);
    
    if (out !== src) {
      fs.writeFileSync(file, out);
      console.log(`✅ Fixed URLs in: ${path.relative(process.cwd(), file)}`);
    }
  } catch (e) {
    console.error(`Failed to fix URLs in ${file}:`, e.message);
  }
}

(async function main() {
  const files = await fg([
    'dist/**/*.html',
    'dist/**/*.js',
    'dist/**/*.css',
    '!dist/node_modules/**',
  ]);
  
  console.log(`Fixing domain URLs in ${files.length} files...`);
  files.forEach(fixUrlsInFile);
  console.log('Domain URL cleanup complete!');
})();