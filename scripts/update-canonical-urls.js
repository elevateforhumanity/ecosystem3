/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

const fs = require('fs');
const path = require('path');

// Configuration
const OLD_DOMAIN = 'stripe-integrate-curvaturebodysc.replit.app';
const NEW_DOMAIN = 'www.elevateforhumanity.org';

function updateCanonicalUrls() {
  console.log('🔗 Updating canonical URLs to www.elevateforhumanity.org...');
  
  // Find all HTML files in current directory
  const htmlFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.html'))
    .sort();
  
  let updatedFiles = 0;
  let totalReplacements = 0;
  
  htmlFiles.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let originalContent = content;
      
      // Replace canonical URLs
      content = content.replace(
        new RegExp(`https://${OLD_DOMAIN.replace('.', '\\.')}`, 'g'),
        `https://${NEW_DOMAIN}`
      );
      
      // Replace any http:// versions too
      content = content.replace(
        new RegExp(`http://${OLD_DOMAIN.replace('.', '\\.')}`, 'g'),
        `https://${NEW_DOMAIN}`
      );
      
      // Count replacements in this file
      const fileReplacements = (originalContent.match(new RegExp(OLD_DOMAIN, 'g')) || []).length;
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content);
        updatedFiles++;
        totalReplacements += fileReplacements;
        console.log(`  ✅ Updated ${file} (${fileReplacements} replacements)`);
      }
    } catch (error) {
      console.error(`  ❌ Error updating ${file}:`, error.message);
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   • Files updated: ${updatedFiles}`);
  console.log(`   • Total replacements: ${totalReplacements}`);
  console.log(`   • Old domain: ${OLD_DOMAIN}`);
  console.log(`   • New domain: ${NEW_DOMAIN}`);
  
  return { updatedFiles, totalReplacements };
}

function addCanonicalToIndexHtml() {
  const indexFile = 'index.html';
  
  try {
    let content = fs.readFileSync(indexFile, 'utf8');
    
    // Check if canonical link already exists
    if (content.includes('rel="canonical"')) {
      console.log('  📍 index.html already has canonical URL');
      return;
    }
    
    // Add canonical URL to index.html if missing
    const canonicalTag = `    <link rel="canonical" href="https://${NEW_DOMAIN}/">`;
    
    // Insert after viewport meta tag
    const viewportMatch = content.match(/(<meta name="viewport"[^>]*>)/);
    if (viewportMatch) {
      content = content.replace(
        viewportMatch[1],
        viewportMatch[1] + '\n' + canonicalTag
      );
      
      fs.writeFileSync(indexFile, content);
      console.log('  ✅ Added canonical URL to index.html');
    }
  } catch (error) {
    console.error(`  ❌ Error updating ${indexFile}:`, error.message);
  }
}

function verifyCanonicalUrls() {
  console.log('\n🔍 Verifying canonical URLs...');
  
  const htmlFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.html'))
    .slice(0, 10); // Check first 10 files
  
  htmlFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('rel="canonical"')) {
        if (content.includes(NEW_DOMAIN)) {
          console.log(`  ✅ ${file} has correct canonical URL`);
        } else if (content.includes(OLD_DOMAIN)) {
          console.log(`  ⚠️  ${file} still has old domain`);
        } else {
          console.log(`  ❓ ${file} has canonical but unknown domain`);
        }
      } else {
        console.log(`  ⚪ ${file} has no canonical URL`);
      }
    } catch (error) {
      console.error(`  ❌ Error checking ${file}:`, error.message);
    }
  });
}

// Run if called directly
if (require.main === module) {
  updateCanonicalUrls();
  addCanonicalToIndexHtml();
  verifyCanonicalUrls();
}

module.exports = { updateCanonicalUrls, NEW_DOMAIN };