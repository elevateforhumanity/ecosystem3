#!/usr/bin/env node
/**
 * Apply Google Configuration Script
 * Replaces placeholders with actual Google Analytics and Search Console values
 * across HTML files in the project.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

// Try to load environment variables from .env.local if it exists
function loadEnvFile() {
  const envPath = path.join(ROOT, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=');
        if (key && value && !process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
}

// Load environment variables
loadEnvFile();

// Get environment variables with fallbacks
const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || process.env.VITE_ANALYTICS_ID;
const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION;

// Placeholder patterns to replace
const PLACEHOLDERS = {
  'GA_MEASUREMENT_ID': GOOGLE_ANALYTICS_ID,
  'GOOGLE_VERIFICATION_CODE_HERE': GOOGLE_SITE_VERIFICATION,
  'YOUR_GOOGLE_ANALYTICS_ID': GOOGLE_ANALYTICS_ID,
  'YOUR_GOOGLE_SITE_VERIFICATION': GOOGLE_SITE_VERIFICATION
};

/**
 * Get all HTML files in the root directory
 */
function getHtmlFiles() {
  return fs.readdirSync(ROOT)
    .filter(file => file.endsWith('.html'))
    .map(file => path.join(ROOT, file));
}

/**
 * Replace placeholders in file content
 */
function replacePlaceholders(content) {
  let updatedContent = content;
  let replacementsMade = 0;

  Object.entries(PLACEHOLDERS).forEach(([placeholder, value]) => {
    if (value && updatedContent.includes(placeholder)) {
      const regex = new RegExp(placeholder, 'g');
      const matches = (updatedContent.match(regex) || []).length;
      updatedContent = updatedContent.replace(regex, value);
      replacementsMade += matches;
      console.log(`  ✓ Replaced ${matches} occurrence(s) of "${placeholder}" with "${value}"`);
    }
  });

  return { content: updatedContent, replacementsMade };
}

/**
 * Process a single HTML file
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: updatedContent, replacementsMade } = replacePlaceholders(content);

    if (replacementsMade > 0) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      console.log(`✅ Updated ${path.basename(filePath)} (${replacementsMade} replacements)`);
      return true;
    } else {
      console.log(`ℹ️  No changes needed for ${path.basename(filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}: ${error.message}`);
    return false;
  }
}

/**
 * Main execution function
 */
function main() {
  console.log('🔧 Google Configuration Application Script');
  console.log('==========================================\n');

  // Check if we have the required environment variables
  if (!GOOGLE_ANALYTICS_ID && !GOOGLE_SITE_VERIFICATION) {
    console.log('⚠️  No Google configuration found in environment variables.');
    console.log('Set GOOGLE_ANALYTICS_ID and/or GOOGLE_SITE_VERIFICATION to apply configurations.\n');
    console.log('Example:');
    console.log('  export GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"');
    console.log('  export GOOGLE_SITE_VERIFICATION="your-verification-code"');
    console.log('  npm run google:apply\n');
    return;
  }

  console.log('Configuration values:');
  console.log(`  Google Analytics ID: ${GOOGLE_ANALYTICS_ID || 'Not set'}`);
  console.log(`  Google Site Verification: ${GOOGLE_SITE_VERIFICATION || 'Not set'}\n`);

  const htmlFiles = getHtmlFiles();
  console.log(`Found ${htmlFiles.length} HTML files to process:\n`);

  let totalFilesUpdated = 0;
  htmlFiles.forEach(file => {
    if (processFile(file)) {
      totalFilesUpdated++;
    }
  });

  console.log(`\n🎉 Google configuration application complete!`);
  console.log(`   Files updated: ${totalFilesUpdated}/${htmlFiles.length}\n`);

  if (totalFilesUpdated > 0) {
    console.log('📋 Next Steps:');
    console.log('1. Test the pages to ensure Google Analytics is tracking');
    console.log('2. Verify Google Search Console verification is working');
    console.log('3. Regenerate and submit sitemaps: npm run sitemaps:submit');
    console.log('4. Check Google Rich Results Test for meta tag validation');
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { replacePlaceholders, processFile };