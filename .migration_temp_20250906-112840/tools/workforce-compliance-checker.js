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
import fetch from 'node-fetch';

console.log('🎯 EFH Workforce Development Compliance & Linking Check\n');

const BASE_URL = 'http://localhost:5000';
const WORKFORCE_STANDARDS = {
  DOL: ['WIOA', 'OSHA', 'ETPL', 'apprenticeship', 'job placement', 'workforce development'],
  DWD: ['Indiana Connect', 'WEX', 'WRG', 'OJT', 'skills assessment', 'career pathways'],
  INDY: ['Indianapolis', 'Marion County', 'local workforce board', 'regional planning']
};

// Critical pages that must be properly linked
const CRITICAL_PAGES = [
  { file: 'hub.html', name: 'Hub/Homepage', required: true },
  { file: 'programs.html', name: 'Programs', required: true },
  { file: 'connect.html', name: 'Connect/Partners', required: true },
  { file: 'lms.html', name: 'LMS/Training', required: true },
  { file: 'compliance.html', name: 'Compliance', required: true },
  { file: 'account.html', name: 'Account/Student Portal', required: true },
  { file: 'admin-dashboard.html', name: 'Admin Dashboard', required: false },
  { file: 'eligibility-verification.html', name: 'Eligibility Verification', required: true },
  { file: 'performance-tracking.html', name: 'Performance Tracking', required: true }
];

// 1. Check file existence and structure
console.log('📁 Checking Critical Pages Existence:');
const pageResults = [];
let criticalIssues = [];

for (const page of CRITICAL_PAGES) {
  if (fs.existsSync(page.file)) {
    const content = fs.readFileSync(page.file, 'utf8');
    console.log(`  ✅ ${page.name} (${page.file}) - Found`);
    pageResults.push({ ...page, content, status: 'OK' });
  } else {
    console.log(`  ${page.required ? '❌' : '⚠️'} ${page.name} (${page.file}) - Missing`);
    pageResults.push({ ...page, status: 'MISSING' });
    if (page.required) criticalIssues.push(`Missing required page: ${page.file}`);
  }
}

// 2. Check workforce compliance keywords
console.log('\n🏛️ Checking Workforce Development Compliance:');
const complianceReport = {};

pageResults.filter(p => p.status === 'OK').forEach(page => {
  console.log(`  🔍 Analyzing ${page.name} for compliance keywords...`);
  const content = page.content.toLowerCase();
  
  complianceReport[page.file] = {
    DOL: 0, DWD: 0, INDY: 0,
    keywords: { DOL: [], DWD: [], INDY: [] }
  };
  
  Object.entries(WORKFORCE_STANDARDS).forEach(([standard, keywords]) => {
    keywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        complianceReport[page.file][standard]++;
        complianceReport[page.file].keywords[standard].push(keyword);
      }
    });
  });
  
  const total = complianceReport[page.file].DOL + complianceReport[page.file].DWD + complianceReport[page.file].INDY;
  console.log(`    📊 DOL: ${complianceReport[page.file].DOL}, DWD: ${complianceReport[page.file].DWD}, INDY: ${complianceReport[page.file].INDY} (Total: ${total})`);
  
  if (total === 0) {
    console.log(`    ⚠️ No workforce compliance keywords found`);
  }
});

// 3. Check cross-linking between pages
console.log('\n🔗 Checking Cross-Page Linking:');
const linkingReport = {};

pageResults.filter(p => p.status === 'OK').forEach(sourcePage => {
  linkingReport[sourcePage.file] = { outbound: [], missing: [] };
  
  console.log(`  🔍 Checking links from ${sourcePage.name}:`);
  
  CRITICAL_PAGES.filter(p => p.file !== sourcePage.file).forEach(targetPage => {
    const linkPatterns = [
      new RegExp(`href=["'][^"']*${targetPage.file}["']`, 'gi'),
      new RegExp(`href=["'][^"']*/${targetPage.file}["']`, 'gi'),
      new RegExp(`window\.location.*${targetPage.file}`, 'gi')
    ];
    
    const hasLink = linkPatterns.some(pattern => sourcePage.content.match(pattern));
    
    if (hasLink) {
      console.log(`    ✅ Links to ${targetPage.name}`);
      linkingReport[sourcePage.file].outbound.push(targetPage.name);
    } else if (targetPage.required) {
      console.log(`    ❌ Missing link to ${targetPage.name} (Required)`);
      linkingReport[sourcePage.file].missing.push(targetPage.name);
    }
  });
});

// 4. Check navigation consistency
console.log('\n🧭 Checking Navigation Consistency:');
const navElements = {};

pageResults.filter(p => p.status === 'OK').forEach(page => {
  const content = page.content;
  
  // Check for standard navigation patterns
  const navChecks = [
    { name: 'Universal Script', pattern: /efh-universal\.v2\.2\.js/gi },
    { name: 'EFH Header', pattern: /<div[^>]*id=["']efh-header["']/gi },
    { name: 'Navigation Menu', pattern: /<nav[^>]*>|class=["'][^"']*nav[^"']*["']/gi },
    { name: 'Home Link', pattern: /href=["'][^"']*\/(index\.html)?["']|href=["']\/["']/gi }
  ];
  
  navElements[page.file] = {};
  
  console.log(`  🔍 ${page.name} navigation elements:`);
  navChecks.forEach(check => {
    const found = content.match(check.pattern);
    navElements[page.file][check.name] = found ? found.length : 0;
    
    if (found && found.length > 0) {
      console.log(`    ✅ ${check.name}: ${found.length} found`);
    } else {
      console.log(`    ❌ ${check.name}: Missing`);
    }
  });
});

// 5. Generate fix recommendations
console.log('\n🔧 COMPLIANCE & LINKING RECOMMENDATIONS:');

const recommendations = [];

// Missing pages
const missingRequired = CRITICAL_PAGES.filter(p => p.required && !pageResults.find(r => r.file === p.file && r.status === 'OK'));
if (missingRequired.length > 0) {
  recommendations.push(`Create missing required pages: ${missingRequired.map(p => p.file).join(', ')}`);
}

// Low compliance scores
Object.entries(complianceReport).forEach(([file, report]) => {
  const total = report.DOL + report.DWD + report.INDY;
  if (total < 3) {
    recommendations.push(`Add workforce compliance keywords to ${file} (currently: ${total} keywords)`);
  }
});

// Missing cross-links
Object.entries(linkingReport).forEach(([file, report]) => {
  if (report.missing.length > 0) {
    recommendations.push(`Add navigation links in ${file} to: ${report.missing.join(', ')}`);
  }
});

// Missing navigation elements
Object.entries(navElements).forEach(([file, elements]) => {
  const missingNav = Object.entries(elements).filter(([name, count]) => count === 0).map(([name]) => name);
  if (missingNav.length > 0) {
    recommendations.push(`Fix navigation elements in ${file}: ${missingNav.join(', ')}`);
  }
});

// 6. Summary report
console.log('\n📊 COMPLIANCE SUMMARY:');
const totalPages = pageResults.filter(p => p.status === 'OK').length;
const requiredPages = CRITICAL_PAGES.filter(p => p.required).length;
const foundRequired = pageResults.filter(p => p.required && p.status === 'OK').length;

console.log(`Pages Found: ${totalPages}/${CRITICAL_PAGES.length} total, ${foundRequired}/${requiredPages} required`);
console.log(`Critical Issues: ${criticalIssues.length}`);
console.log(`Recommendations: ${recommendations.length}`);

if (recommendations.length > 0) {
  console.log('\n🚨 ACTION ITEMS:');
  recommendations.forEach((rec, i) => console.log(`  ${i + 1}. ${rec}`));
} else {
  console.log('\n🎉 ALL COMPLIANCE & LINKING CHECKS PASSED!');
}

// Calculate overall health score
const healthScore = Math.round(((foundRequired / requiredPages) * 0.6 + 
  (Math.max(0, totalPages - criticalIssues.length) / totalPages) * 0.4) * 100);

console.log(`\n💯 Overall Health Score: ${healthScore}%`);

if (healthScore >= 90) {
  console.log('✅ EXCELLENT - Ready for DOL/DWD/INDY deployment');
} else if (healthScore >= 75) {
  console.log('⚠️ GOOD - Minor fixes needed for full compliance');
} else {
  console.log('❌ NEEDS WORK - Critical issues must be resolved');
}
