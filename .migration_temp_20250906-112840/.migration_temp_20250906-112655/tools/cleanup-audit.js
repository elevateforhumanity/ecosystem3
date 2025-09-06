// tools/cleanup-audit.js - Find duplicate and unused files
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🧹 EFH Cleanup Audit Starting...\n');

// 1. Find duplicate files by hash
console.log('🔍 Scanning for duplicate files:');
const fileHashes = new Map();
const duplicates = [];

function scanDirectory(dir, exclude = []) {
  if (!fs.existsSync(dir)) return;
  
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (exclude.some(ex => item.includes(ex))) continue;
      
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath, exclude);
      } else if (stat.isFile()) {
        const content = fs.readFileSync(fullPath);
        const hash = crypto.createHash('md5').update(content).digest('hex');
        
        if (fileHashes.has(hash)) {
          duplicates.push({
            original: fileHashes.get(hash),
            duplicate: fullPath,
            size: stat.size
          });
        } else {
          fileHashes.set(hash, fullPath);
        }
      }
    }
  } catch (err) {
    console.log(`  ⚠️  Could not scan ${dir}: ${err.message}`);
  }
}

// Scan current directory, excluding node_modules and generated assets
scanDirectory('.', ['node_modules', '.git', 'attached_assets']);

if (duplicates.length === 0) {
  console.log('  ✅ No duplicate files found');
} else {
  console.log(`  ❌ Found ${duplicates.length} duplicate files:`);
  duplicates.forEach(dup => {
    console.log(`    ${dup.duplicate} (duplicate of ${dup.original}) - ${Math.round(dup.size/1024)}KB`);
  });
}

// 2. Check for unused assets
console.log('\n📁 Checking for potentially unused assets:');
const assetExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico'];
const allFiles = [];

function collectFiles(dir) {
  if (!fs.existsSync(dir)) return;
  
  try {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      if (item.includes('node_modules') || item.includes('.git')) continue;
      
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        collectFiles(fullPath);
      } else {
        allFiles.push(fullPath);
      }
    }
  } catch (err) {
    // Skip inaccessible directories
  }
}

collectFiles('.');

// Find asset files
const assetFiles = allFiles.filter(file => 
  assetExtensions.some(ext => file.toLowerCase().endsWith(ext))
);

// Find HTML/JS/CSS files that might reference assets
const contentFiles = allFiles.filter(file => 
  file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.mjs')
);

const unreferencedAssets = [];

for (const asset of assetFiles) {
  const assetName = path.basename(asset);
  const assetPath = asset.replace(/\\/g, '/'); // Normalize path separators
  
  let isReferenced = false;
  
  for (const contentFile of contentFiles) {
    try {
      const content = fs.readFileSync(contentFile, 'utf8');
      if (content.includes(assetName) || content.includes(assetPath)) {
        isReferenced = true;
        break;
      }
    } catch (err) {
      // Skip files that can't be read
    }
  }
  
  if (!isReferenced) {
    unreferencedAssets.push(asset);
  }
}

if (unreferencedAssets.length === 0) {
  console.log('  ✅ All asset files appear to be referenced');
} else {
  console.log(`  ⚠️  Found ${unreferencedAssets.length} potentially unused assets:`);
  unreferencedAssets.forEach(asset => {
    const stats = fs.statSync(asset);
    console.log(`    ${asset} - ${Math.round(stats.size/1024)}KB`);
  });
  console.log('    Note: Review these manually before deletion');
}

// 3. Check for placeholder or temp files
console.log('\n🚫 Checking for placeholder/temp files:');
const badPatterns = [/placeholder/i, /lorem/i, /dummy/i, /temp/i, /test/i];
const suspiciousFiles = [];

for (const file of allFiles) {
  const fileName = path.basename(file);
  if (badPatterns.some(pattern => pattern.test(fileName))) {
    suspiciousFiles.push(file);
  }
}

if (suspiciousFiles.length === 0) {
  console.log('  ✅ No placeholder or temp files found');
} else {
  console.log(`  ⚠️  Found ${suspiciousFiles.length} suspicious files:`);
  suspiciousFiles.forEach(file => console.log(`    ${file}`));
}

// 4. Summary
console.log('\n📊 CLEANUP SUMMARY:');
const totalSavings = duplicates.reduce((sum, dup) => sum + dup.size, 0);
console.log(`Duplicate files: ${duplicates.length} (${Math.round(totalSavings/1024)}KB savings potential)`);
console.log(`Unreferenced assets: ${unreferencedAssets.length}`);
console.log(`Suspicious files: ${suspiciousFiles.length}`);

if (duplicates.length === 0 && unreferencedAssets.length === 0 && suspiciousFiles.length === 0) {
  console.log('\n✨ Repository is clean and optimized!');
} else {
  console.log('\n🔧 Consider cleaning up the identified files for optimal deployment');
}

console.log('\n🧹 Cleanup Audit Complete!');