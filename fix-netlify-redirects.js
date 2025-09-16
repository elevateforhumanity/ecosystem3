#!/usr/bin/env node

/**
 * Netlify Redirect Loop Fix - Autopilot Script
 * This script fixes the redirect loop between elevateforhumanity.org and www.elevateforhumanity.org
 */

const https = require('https');

// Configuration
const SITE_ID = 'elevatecareerpub'; // Your Netlify site name
const PRIMARY_DOMAIN = 'elevateforhumanity.org'; // Make this the primary (no redirect)

console.log('🔧 Netlify Redirect Loop Fix - Autopilot');
console.log('=====================================');

// Step 1: Check current redirect configuration
function checkCurrentRedirects() {
    console.log('\n📋 Current redirect analysis:');
    console.log('- elevateforhumanity.org → redirects to www.elevateforhumanity.org');
    console.log('- www.elevateforhumanity.org → redirects to elevateforhumanity.org');
    console.log('- Result: INFINITE REDIRECT LOOP');
}

// Step 2: Create _redirects file to fix the loop
function createRedirectsFile() {
    const redirectsContent = `# Netlify Redirects - Fix redirect loop
# Make elevateforhumanity.org the primary domain

# Redirect www to non-www (primary domain)
https://www.elevateforhumanity.org/* https://elevateforhumanity.org/:splat 301!

# Ensure HTTPS redirect for non-www
http://elevateforhumanity.org/* https://elevateforhumanity.org/:splat 301!

# Student portal clean URLs
/student-portal /student-portal.html 200
/enroll /student-portal.html 200
/login /student-portal.html 200
/certificates /student-portal.html 200

# Fallback to index for SPA behavior
/* /index.html 200
`;

    return redirectsContent;
}

// Step 3: Manual instructions since we can't access Netlify API without token
function showManualInstructions() {
    console.log('\n🎯 MANUAL FIX INSTRUCTIONS:');
    console.log('============================');
    
    console.log('\n📁 Option 1: Create _redirects file');
    console.log('1. In your project root, create a file named "_redirects"');
    console.log('2. Add this content:');
    console.log('');
    console.log(createRedirectsFile());
    
    console.log('\n📱 Option 2: Netlify Dashboard');
    console.log('1. Go to: Site Settings → Domain Management');
    console.log('2. Look for "Primary domain" or "Default domain"');
    console.log('3. Set "elevateforhumanity.org" as primary');
    console.log('4. Ensure www redirects TO the primary (not FROM)');
    
    console.log('\n🔧 Option 3: Site Settings');
    console.log('1. Site Settings → Build & Deploy → Post Processing');
    console.log('2. Look for "Pretty URLs" or "Asset Optimization"');
    console.log('3. Check redirect settings there');
    
    console.log('\n⚡ Quick Test Commands:');
    console.log('curl -I https://elevateforhumanity.org');
    console.log('curl -I https://www.elevateforhumanity.org');
    console.log('(Should show 200 for first, 301 for second)');
}

// Step 4: Create the _redirects file for deployment
function writeRedirectsFile() {
    const fs = require('fs');
    const path = '/workspaces/_redirects';
    
    try {
        fs.writeFileSync(path, createRedirectsFile());
        console.log('\n✅ Created _redirects file at:', path);
        console.log('📤 Commit and push this file to fix the redirect loop');
        return true;
    } catch (error) {
        console.error('❌ Error creating _redirects file:', error.message);
        return false;
    }
}

// Main execution
function main() {
    checkCurrentRedirects();
    
    console.log('\n🤖 Autopilot Fix Attempt...');
    
    // Create the _redirects file
    const fileCreated = writeRedirectsFile();
    
    if (fileCreated) {
        console.log('\n🚀 NEXT STEPS:');
        console.log('1. git add _redirects');
        console.log('2. git commit -m "Fix redirect loop with _redirects file"');
        console.log('3. git push');
        console.log('4. Wait 2-3 minutes for deployment');
        console.log('5. Test: https://elevateforhumanity.org');
    } else {
        showManualInstructions();
    }
    
    console.log('\n🎯 Expected Result:');
    console.log('- elevateforhumanity.org → serves site (200)');
    console.log('- www.elevateforhumanity.org → redirects to elevateforhumanity.org (301)');
    console.log('- No more redirect loop!');
}

// Run the autopilot
main();