const https = require('https');
const fs = require('fs');

const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'YOUR_CLOUDFLARE_API_TOKEN';
const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'YOUR_CLOUDFLARE_ACCOUNT_ID';

// Create a simple deployment
function deployToCloudFlare() {
  console.log('🚀 Creating CloudFlare Pages deployment...');
  
  // Read the HTML file
  const htmlContent = fs.readFileSync('quick-deploy.html', 'utf8');
  
  // Create a simple deployment payload
  const deploymentData = {
    files: {
      'index.html': htmlContent
    }
  };

  const postData = JSON.stringify(deploymentData);
  
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/accounts/${ACCOUNT_ID}/pages/projects/elevateforhumanity/deployments`,
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
          console.log('🎉 Deployment successful!');
          console.log('🔗 Your site URL: https://elevateforhumanity.pages.dev');
          console.log('⏱️  Site will be live in 1-2 minutes');
        } else {
          console.log('❌ Deployment failed:', response.errors);
          console.log('💡 Try manual setup instead');
        }
      } catch (error) {
        console.log('❌ Parse error:', error.message);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ Request error:', error.message);
    console.log('💡 Manual setup recommended');
  });

  req.write(postData);
  req.end();
}

// Check if project exists first
function checkProject() {
  const options = {
    hostname: 'api.cloudflare.com',
    path: `/client/v4/accounts/${ACCOUNT_ID}/pages/projects/elevateforhumanity`,
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
          console.log('✅ Project exists! Deploying...');
          deployToCloudFlare();
        } else {
          console.log('📋 Project not found. Manual setup needed.');
          console.log('🔗 Go to: https://dash.cloudflare.com/pages');
          console.log('📝 Follow the setup guide in cloudflare-setup-guide.md');
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

console.log('🔍 Checking CloudFlare Pages project...');
checkProject();