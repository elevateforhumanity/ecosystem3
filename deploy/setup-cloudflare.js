const https = require('https');

const CLOUDFLARE_API_TOKEN = '7W2pnC5oQxQKewWDjTLKB-1tY9Zd9xqEpA9qjyoB';
const ACCOUNT_ID = 'ff0d5ca582b5911a626ba012935cf3ec';

// First, let's get the account ID
function getAccountInfo() {
  const options = {
    hostname: 'api.cloudflare.com',
    path: '/client/v4/accounts',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success && response.result.length > 0) {
          const accountId = response.result[0].id;
          console.log('✅ Found Account ID:', accountId);
          createPagesProject(accountId);
        } else {
          console.log('❌ Error getting account info:', response.errors);
        }
      } catch (error) {
        console.log('❌ Parse error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
  });

  req.end();
}

function createPagesProject(accountId = ACCOUNT_ID) {
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
        production_deployments_enabled: true,
        preview_deployment_setting: 'custom',
        preview_branch_includes: ['*'],
        preview_branch_excludes: []
      }
    },
    build_config: {
      build_command: 'mkdir -p dist && cp index.html dist/ && cp -r src dist/ && cp robots.txt dist/ && cp sitemap*.xml dist/',
      destination_dir: 'dist',
      root_dir: '',
      web_analytics_tag: null,
      web_analytics_token: null
    },
    deployment_configs: {
      production: {
        environment_variables: {
          NODE_VERSION: '20'
        },
        kv_namespaces: {},
        durable_object_namespaces: {},
        d1_databases: {},
        r2_buckets: {},
        services: {},
        compatibility_date: '2023-05-18',
        compatibility_flags: []
      }
    }
  };

  const postData = JSON.stringify(projectData);
  
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/accounts/${accountId}/pages/projects`,
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
          console.log('🚀 CloudFlare Pages project created successfully!');
          console.log('📱 Your site will be live at:', response.result.subdomain);
          console.log('🔗 Full URL: https://' + response.result.subdomain);
          console.log('⏱️  Build will start automatically and complete in 2-3 minutes');
        } else {
          console.log('❌ Error creating project:', response.errors);
          if (response.errors && response.errors[0] && response.errors[0].message.includes('already exists')) {
            console.log('✅ Project already exists! Checking status...');
            getProjectStatus(accountId);
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

function getProjectStatus(accountId) {
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/accounts/${accountId}/pages/projects/elevateforhumanity`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json'
    }
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        if (response.success) {
          console.log('✅ Project exists!');
          console.log('🔗 Your site URL: https://' + response.result.subdomain);
          console.log('📊 Status:', response.result.latest_deployment?.stage || 'Ready');
        } else {
          console.log('❌ Error getting project status:', response.errors);
        }
      } catch (error) {
        console.log('❌ Parse error:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
  });

  req.end();
}

console.log('🚀 Setting up CloudFlare Pages for elevateforhumanity...');
console.log('✅ Using Account ID:', ACCOUNT_ID);
createPagesProject(ACCOUNT_ID);