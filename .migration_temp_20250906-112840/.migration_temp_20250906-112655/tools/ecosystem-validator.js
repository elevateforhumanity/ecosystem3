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

// tools/ecosystem-validator.js - Simple ecosystem validation
const fs = require('fs');
const path = require('path');

console.log('🎯 EFH Ecosystem Validation Starting...\n');

// 1. Check Core Brain Repository Files
console.log('📁 Checking Brain Repository Structure:');
const coreFiles = [
  'config/health-programs.json',
  'config/beauty-programs.json', 
  'config/partners.json',
  'ui/header.html',
  'ui/footer.html',
  'scripts/efh-universal.v2.2.js'
];

let coreFilesOK = 0;
coreFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const stats = fs.statSync(file);
    console.log(`  ✅ ${file} (${Math.round(stats.size/1024)}KB)`);
    coreFilesOK++;
  } else {
    console.log(`  ❌ ${file} - MISSING`);
  }
});

// 2. Check Sister Sites Integration
console.log('\n🌐 Checking Sister Sites Universal Script Integration:');
const sisterSites = ['hub.html', 'programs.html', 'connect.html', 'lms.html'];
let sitesUpdated = 0;

sisterSites.forEach(site => {
  if (fs.existsSync(site)) {
    const content = fs.readFileSync(site, 'utf8');
    if (content.includes('efh-universal.v2.2.js')) {
      console.log(`  ✅ ${site} - Using Universal Script v2.2`);
      sitesUpdated++;
    } else if (content.includes('efh-universal.v2.1.js')) {
      console.log(`  ⚠️  ${site} - Using v2.1 (should upgrade to v2.2)`);
    } else {
      console.log(`  ❌ ${site} - Not using Universal Script`);
    }
  } else {
    console.log(`  ❌ ${site} - File missing`);
  }
});

// 3. Check Logo Pack
console.log('\n🎨 Checking Professional Logo Pack:');
const brandingDir = 'branding/partners';
if (fs.existsSync(brandingDir)) {
  const logos = fs.readdirSync(brandingDir).filter(f => f.endsWith('.png'));
  console.log(`  ✅ Found ${logos.length} partner logos in ${brandingDir}/`);
  logos.forEach(logo => console.log(`    • ${logo}`));
} else {
  console.log(`  ❌ ${brandingDir} directory missing`);
}

// 4. Validate JSON Configuration Files
console.log('\n📋 Validating JSON Configuration Files:');
['config/health-programs.json', 'config/beauty-programs.json', 'config/partners.json'].forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (Array.isArray(data)) {
        console.log(`  ✅ ${file} - Valid JSON with ${data.length} items`);
        
        // Check for logo paths in partners.json
        if (file.includes('partners.json')) {
          const withLogos = data.filter(p => p.logo).length;
          console.log(`    📸 ${withLogos}/${data.length} partners have logos configured`);
        }
      } else {
        console.log(`  ⚠️  ${file} - Valid JSON but not an array`);
      }
    } catch (e) {
      console.log(`  ❌ ${file} - Invalid JSON: ${e.message}`);
    }
  }
});

// 5. Universal Script v2.2 Features Check
console.log('\n⚙️  Checking Universal Script v2.2 Features:');
const scriptFile = 'scripts/efh-universal.v2.2.js';
if (fs.existsSync(scriptFile)) {
  const scriptContent = fs.readFileSync(scriptFile, 'utf8');
  const features = [
    { name: 'Header/Footer Injection', check: 'injectChrome' },
    { name: 'Logo Support', check: 'getPartnerLogo' },
    { name: 'Auto Partners Link', check: 'ensurePartnersLink' },
    { name: 'Error Handling', check: 'onerror' }
  ];
  
  features.forEach(feature => {
    if (scriptContent.includes(feature.check)) {
      console.log(`  ✅ ${feature.name} - Available`);
    } else {
      console.log(`  ❌ ${feature.name} - Missing`);
    }
  });
}

// 6. Summary Report
console.log('\n📊 ECOSYSTEM HEALTH SUMMARY:');
console.log(`Core Files: ${coreFilesOK}/${coreFiles.length} ✅`);
console.log(`Sister Sites: ${sitesUpdated}/${sisterSites.length} updated to v2.2`);

const healthScore = Math.round(((coreFilesOK + sitesUpdated) / (coreFiles.length + sisterSites.length)) * 100);

if (healthScore >= 90) {
  console.log(`\n🎉 Ecosystem Health Score: ${healthScore}% - EXCELLENT!`);
  console.log('✅ Ready for production deployment');
} else if (healthScore >= 70) {
  console.log(`\n⚠️  Ecosystem Health Score: ${healthScore}% - GOOD`);
  console.log('🔧 Minor fixes needed before deployment');
} else {
  console.log(`\n❌ Ecosystem Health Score: ${healthScore}% - NEEDS WORK`);
  console.log('🚨 Major issues need to be resolved');
}

console.log('\n🎯 Validation Complete!');