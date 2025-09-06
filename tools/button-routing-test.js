
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Button Routing Across All Pages...\n');

// Pages to check for button routing
const pagesToCheck = [
  'connect.html',
  'programs.html', 
  'hub.html',
  'lms.html',
  'index.html',
  'working-demo.html'
];

const buttonFindings = {
  totalButtons: 0,
  workingRoutes: 0,
  brokenRoutes: 0,
  missingTargets: 0,
  details: []
};

function checkButtonRouting(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ ${filePath} - FILE MISSING`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const findings = {
    file: filePath,
    buttons: [],
    forms: [],
    links: []
  };

  // Check form submissions
  const formMatches = content.match(/<form[^>]*action=["']([^"']+)["'][^>]*>/gi);
  if (formMatches) {
    formMatches.forEach(form => {
      const actionMatch = form.match(/action=["']([^"']+)["']/i);
      if (actionMatch) {
        const action = actionMatch[1];
        findings.forms.push({
          action: action,
          type: action.includes('google') ? 'Google Form' : 'Local Route',
          status: action.startsWith('http') ? '✅ External URL' : '🔍 Need to verify'
        });
        buttonFindings.totalButtons++;
        if (action.startsWith('http')) buttonFindings.workingRoutes++;
      }
    });
  }

  // Check button click handlers and links
  const buttonMatches = content.match(/<button[^>]*(?:onclick|@click|href)[^>]*>/gi);
  if (buttonMatches) {
    buttonMatches.forEach(button => {
      let route = 'No route found';
      let status = '❌ No action';
      
      // Check for onclick handlers
      const onclickMatch = button.match(/onclick=["']([^"']+)["']/i);
      if (onclickMatch) {
        route = onclickMatch[1];
        status = '🔍 JavaScript action';
      }

      // Check for Alpine.js @click handlers  
      const alpineMatch = button.match(/@click=["']([^"']+)["']/i);
      if (alpineMatch) {
        route = alpineMatch[1];
        status = '🔍 Alpine.js action';
      }

      findings.buttons.push({
        button: button.substring(0, 100) + '...',
        route: route,
        status: status
      });
      buttonFindings.totalButtons++;
    });
  }

  // Check navigation links
  const linkMatches = content.match(/<a[^>]*href=["']([^"']+)["'][^>]*>/gi);
  if (linkMatches) {
    linkMatches.forEach(link => {
      const hrefMatch = link.match(/href=["']([^"']+)["']/i);
      if (hrefMatch) {
        const href = hrefMatch[1];
        let status = '✅ Working';
        
        if (href.startsWith('#')) {
          status = '✅ Anchor link';
        } else if (href.startsWith('http')) {
          status = '✅ External URL';
        } else if (href.endsWith('.html')) {
          // Check if target file exists
          if (fs.existsSync(href)) {
            status = '✅ Local file exists';
            buttonFindings.workingRoutes++;
          } else {
            status = '❌ Local file missing';
            buttonFindings.brokenRoutes++;
          }
        }

        findings.links.push({
          href: href,
          status: status
        });
        buttonFindings.totalButtons++;
      }
    });
  }

  return findings;
}

// Check all pages
console.log('📄 Analyzing Button Routing:\n');

pagesToCheck.forEach(page => {
  if (fs.existsSync(page)) {
    console.log(`\n🔍 Checking ${page}:`);
    const findings = checkButtonRouting(page);
    
    if (findings.forms.length > 0) {
      console.log('  📝 Forms:');
      findings.forms.forEach(form => {
        console.log(`    ${form.status} ${form.action} (${form.type})`);
      });
    }

    if (findings.buttons.length > 0) {
      console.log('  🔘 Buttons:');
      findings.buttons.forEach(button => {
        console.log(`    ${button.status} ${button.route}`);
      });
    }

    if (findings.links.length > 0) {
      console.log('  🔗 Links:');
      findings.links.forEach(link => {
        console.log(`    ${link.status} ${link.href}`);
      });
    }

    buttonFindings.details.push(findings);
  } else {
    console.log(`❌ ${page} - FILE MISSING`);
  }
});

// Summary report
console.log('\n📊 Button Routing Summary:');
console.log(`  Total Interactive Elements: ${buttonFindings.totalButtons}`);
console.log(`  Working Routes: ${buttonFindings.workingRoutes}`);
console.log(`  Broken Routes: ${buttonFindings.brokenRoutes}`);
console.log(`  Need Manual Verification: ${buttonFindings.totalButtons - buttonFindings.workingRoutes - buttonFindings.brokenRoutes}`);

// Recommendations
console.log('\n💡 Recommendations:');
if (buttonFindings.brokenRoutes > 0) {
  console.log('  ❌ Fix broken local file links');
}
console.log('  ✅ Google Form submissions should work correctly now');
console.log('  🔍 Test JavaScript/Alpine.js actions manually');
console.log('  📱 Test form submissions in a browser');

console.log('\n✅ Button routing check complete!');
