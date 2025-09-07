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


#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log('🔍 EFH Sister Sites Integration Check\n');

// 1. Check if all sister sites exist
const sisterSites = [
  'hub.html',
  'programs.html', 
  'lms.html',
  'connect.html',
  'compliance.html',
  'account.html',
  'demo-site.html',
  'admin-dashboard.html'
];

console.log('📄 Sister Sites Availability:');
let sitesFound = 0;
sisterSites.forEach(site => {
  if (fs.existsSync(site)) {
    console.log(`  ✅ ${site}`);
    sitesFound++;
  } else {
    console.log(`  ❌ ${site} - MISSING`);
  }
});

// 2. Check Universal Script Integration
console.log('\n🔧 Universal Script Integration:');
const scriptsToCheck = [
  'efh-universal.v2.2.js',
  'efh-universal.v2.1.js'
];

scriptsToCheck.forEach(script => {
  const scriptPath = `scripts/${script}`;
  if (fs.existsSync(scriptPath)) {
    console.log(`  ✅ ${scriptPath} exists`);
    
    // Check which sites use this script
    let sitesUsingScript = 0;
    sisterSites.forEach(site => {
      if (fs.existsSync(site)) {
        const content = fs.readFileSync(site, 'utf8');
        if (content.includes(script)) {
          console.log(`    📱 ${site} uses ${script}`);
          sitesUsingScript++;
        }
      }
    });
    
    if (sitesUsingScript === 0) {
      console.log(`    ⚠️  No sites are using ${script}`);
    }
  } else {
    console.log(`  ❌ ${scriptPath} - MISSING`);
  }
});

// 3. Check Navigation Integration
console.log('\n🧭 Navigation Integration:');
const sharedNavPath = 'shared/navigation.html';
if (fs.existsSync(sharedNavPath)) {
  console.log(`  ✅ ${sharedNavPath} exists`);
  
  let sitesWithNavigation = 0;
  sisterSites.forEach(site => {
    if (fs.existsSync(site)) {
      const content = fs.readFileSync(site, 'utf8');
      if (content.includes('shared/navigation.html') || content.includes('efh-header')) {
        console.log(`    🔗 ${site} has navigation integration`);
        sitesWithNavigation++;
      }
    }
  });
  
  console.log(`  📊 ${sitesWithNavigation}/${sitesFound} sites have navigation`);
} else {
  console.log(`  ❌ ${sharedNavPath} - MISSING`);
}

// 4. Check Cross-linking
console.log('\n🔗 Cross-site Linking:');
sisterSites.forEach(site => {
  if (fs.existsSync(site)) {
    const content = fs.readFileSync(site, 'utf8');
    let linksFound = 0;
    
    sisterSites.forEach(targetSite => {
      if (site !== targetSite && content.includes(targetSite)) {
        linksFound++;
      }
    });
    
    if (linksFound > 0) {
      console.log(`  ✅ ${site} links to ${linksFound} other sites`);
    } else {
      console.log(`  ⚠️  ${site} has no cross-links`);
    }
  }
});

// 5. Check React Client Integration
console.log('\n⚛️ React Client Integration:');
if (fs.existsSync('client/dist/index.html')) {
  console.log('  ✅ React client built and ready');
  
  // Check if server serves React app
  if (fs.existsSync('simple-server.js')) {
    const serverContent = fs.readFileSync('simple-server.js', 'utf8');
    if (serverContent.includes('client/dist')) {
      console.log('  ✅ Server configured to serve React app');
    } else {
      console.log('  ⚠️  Server may not serve React app properly');
    }
  }
} else {
  console.log('  ❌ React client not built - run: cd client && npm run build');
}

// Summary
console.log('\n📊 INTEGRATION SUMMARY:');
console.log(`  Sites Found: ${sitesFound}/${sisterSites.length}`);
console.log(`  Integration Status: ${sitesFound === sisterSites.length ? '✅ GOOD' : '⚠️ NEEDS WORK'}`);

if (sitesFound < sisterSites.length) {
  console.log('\n🔧 NEXT STEPS:');
  console.log('  1. Create missing sister site pages');
  console.log('  2. Integrate universal script in all pages');
  console.log('  3. Add shared navigation to all sites');
  console.log('  4. Ensure cross-linking between sites');
}
