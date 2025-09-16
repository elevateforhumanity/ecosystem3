#!/usr/bin/env node
// Deploy full site script - ensures the comprehensive content is served instead of React shell
const fs = require('fs');
const path = require('path');

const distPath = path.join(process.cwd(), 'dist');
const indexPath = path.join(distPath, 'index.html');
const fullSiteIndexPath = path.join(distPath, 'READY_FOR_TRANSFER_index.html');

function deployFullSite() {
  try {
    console.log('🚀 Deploying full site content...');
    
    // Replace the React shell index.html with the full site content
    if (fs.existsSync(fullSiteIndexPath)) {
      fs.copyFileSync(fullSiteIndexPath, indexPath);
      console.log('✅ Replaced index.html with full site content');
      
      // Update canonical URLs to point to root
      let content = fs.readFileSync(indexPath, 'utf8');
      
      // Fix all references to READY_FOR_TRANSFER_index.html
      content = content.replace(/https:\/\/www\.elevateforhumanity\.org\/READY_FOR_TRANSFER_index\.html/g, 'https://www.elevateforhumanity.org/');
      content = content.replace(/\/READY_FOR_TRANSFER_index\.html/g, '/');
      
      fs.writeFileSync(indexPath, content);
      console.log('✅ Updated canonical URLs for index.html');
    } else {
      console.warn('⚠️  READY_FOR_TRANSFER_index.html not found - keeping current index.html');
    }
    
    console.log('🎉 Full site deployment complete!');
  } catch (error) {
    console.error('❌ Error deploying full site:', error.message);
    process.exit(1);
  }
}

deployFullSite();