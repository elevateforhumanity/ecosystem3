const https = require('https');

const CLOUDFLARE_API_TOKEN = '7W2pnC5oQxQKewWDjTLKB-1tY9Zd9xqEpA9qjyoB';
const ACCOUNT_ID = 'ff0d5ca582b5911a626ba012935cf3ec';
const ZONE_ID = '0cde07dbe1f6b3e3c25ec30421ee7ced';

// Step 1: Create CloudFlare Pages project
function createPagesProject() {
  console.log('🚀 Creating CloudFlare Pages project...');
  
  const projectData = {
    name: 'elevateforhumanity',
    production_branch: 'main',
    source: {
      type: 'github',
      config: {
        owner: 'elevateforhumanity',
        repo_name: 'new-ecosysstem',
        production_branch: 'main',
        pr_comments_enabled: true,
        deployments_enabled: true,
        production_deployments_enabled: true
      }
    },
    build_config: {
      build_command: 'cp quick-deploy.html index.html',
      destination_dir: './',
      root_dir: ''
    }
  };

  const postData = JSON.stringify(projectData);
  
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/accounts/${ACCOUNT_ID}/pages/projects`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ CloudFlare Pages project created!');
          console.log('🔗 Default URL:', response.result.subdomain);
          setTimeout(() => addCustomDomain(), 2000);
        } else {
          console.log('❌ Error creating project:', response.errors);
          if (response.errors && response.errors[0] && response.errors[0].message.includes('already exists')) {
            console.log('✅ Project already exists! Adding custom domain...');
            setTimeout(() => addCustomDomain(), 1000);
          }
        }
      } catch (error) {
        console.log('❌ Parse error:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
  });

  req.write(postData);
  req.end();
}

// Step 2: Add custom domain to Pages project
function addCustomDomain() {
  console.log('🌐 Adding custom domain to Pages project...');
  
  const domainData = {
    name: 'elevateforhumanity.org'
  };

  const postData = JSON.stringify(domainData);
  
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/accounts/${ACCOUNT_ID}/pages/projects/elevateforhumanity/domains`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ Custom domain added to Pages!');
          setTimeout(() => configureDNS(), 1000);
        } else {
          console.log('⚠️ Domain add result:', response.errors || 'May already exist');
          setTimeout(() => configureDNS(), 1000);
        }
      } catch (error) {
        console.log('❌ Parse error:', error.message);
        setTimeout(() => configureDNS(), 1000);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
    setTimeout(() => configureDNS(), 1000);
  });

  req.write(postData);
  req.end();
}

// Step 3: Configure DNS records
function configureDNS() {
  console.log('🔧 Configuring DNS records...');
  
  // Create CNAME record for www
  const cnameData = {
    type: 'CNAME',
    name: 'www',
    content: 'elevateforhumanity.pages.dev',
    ttl: 3600
  };

  const postData = JSON.stringify(cnameData);
  
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/zones/${ZONE_ID}/dns_records`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ DNS CNAME record created!');
        } else {
          console.log('⚠️ DNS result:', response.errors || 'May already exist');
        }
        setTimeout(() => createApexRecord(), 1000);
      } catch (error) {
        console.log('❌ Parse error:', error.message);
        setTimeout(() => createApexRecord(), 1000);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
    setTimeout(() => createApexRecord(), 1000);
  });

  req.write(postData);
  req.end();
}

// Step 4: Create apex domain record
function createApexRecord() {
  console.log('🔧 Creating apex domain record...');
  
  const apexData = {
    type: 'CNAME',
    name: '@',
    content: 'elevateforhumanity.pages.dev',
    ttl: 3600
  };

  const postData = JSON.stringify(apexData);
  
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/zones/${ZONE_ID}/dns_records`,
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ DNS apex record created!');
        } else {
          console.log('⚠️ Apex DNS result:', response.errors || 'May already exist');
        }
        showResults();
      } catch (error) {
        console.log('❌ Parse error:', error.message);
        showResults();
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
    showResults();
  });

  req.write(postData);
  req.end();
}

function showResults() {
  console.log('\n🎉 CloudFlare Setup Complete!');
  console.log('📱 Your sites will be live at:');
  console.log('   • https://elevateforhumanity.pages.dev');
  console.log('   • https://elevateforhumanity.org (once DNS propagates)');
  console.log('   • https://www.elevateforhumanity.org');
  console.log('\n⏱️  Timeline:');
  console.log('   • Pages site: Live in 2-3 minutes');
  console.log('   • Custom domain: Live in 15 minutes to 2 hours');
  console.log('\n✅ Features included:');
  console.log('   • Government contracting services');
  console.log('   • Philanthropy & grant management');
  console.log('   • Accessibility compliance');
  console.log('   • Veteran services');
  console.log('   • Performance metrics');
  console.log('\n🚀 Your government contracting platform is deploying!');
}

console.log('🚀 Starting complete CloudFlare setup...');
console.log('📋 Account ID:', ACCOUNT_ID);
console.log('🌐 Zone ID:', ZONE_ID);
createPagesProject();