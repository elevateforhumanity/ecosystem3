#!/usr/bin/env node
// 🚀 ELEVATE LICENSE SYSTEM SETUP SCRIPT

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up Elevate License System...\n');

async function createDirectories() {
  const dirs = ['logs', 'data', 'logs/archive'];
  
  for (const dir of dirs) {
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } catch (error) {
      console.log(`⚠️  Directory already exists: ${dir}`);
    }
  }
}

async function createEnvFile() {
  try {
    await fs.access('.env');
    console.log('⚠️  .env file already exists, skipping...');
    return;
  } catch {
    // File doesn't exist, create it
  }

  const envContent = `# 🔐 ELEVATE LICENSE SYSTEM ENVIRONMENT VARIABLES
# Generated on ${new Date().toISOString()}

# Stripe Configuration (REQUIRED)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration (REQUIRED)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# Database Configuration
MONGO_URI=mongodb://localhost:27017/elevateLicensing

# Server Configuration
PORT=4242
NODE_ENV=development

# Security (IMPORTANT: Change these!)
LICENSE_SALT=${crypto.randomBytes(32).toString('hex')}
ADMIN_KEY=${crypto.randomBytes(16).toString('hex')}
ALLOWED_ORIGINS=http://localhost:3000,https://elevateforhumanity.com

# Optional: Advanced Features
JWT_SECRET=${crypto.randomBytes(32).toString('hex')}
RATE_LIMIT_MAX=1000
`;

  await fs.writeFile('.env', envContent);
  console.log('✅ Created .env file with secure random keys');
}

async function createLogFiles() {
  const logFiles = [
    { name: 'logs/licenses.csv', content: '"timestamp","action","licenseKey","email","productId","price"\n' },
    { name: 'logs/licenses.log', content: '# Elevate License System Activity Log\n' },
    { name: 'logs/licenses.jsonl', content: '' },
    { name: 'logs/security.jsonl', content: '' },
    { name: 'logs/performance.jsonl', content: '' },
    { name: 'logs/errors.jsonl', content: '' }
  ];

  for (const file of logFiles) {
    try {
      await fs.access(file.name);
      console.log(`⚠️  Log file already exists: ${file.name}`);
    } catch {
      await fs.writeFile(file.name, file.content);
      console.log(`✅ Created log file: ${file.name}`);
    }
  }
}

async function createNginxConfig() {
  const nginxConfig = `events {
    worker_connections 1024;
}

http {
    upstream elevate_backend {
        server elevate-license-system:4242;
    }

    server {
        listen 80;
        server_name localhost;

        location / {
            proxy_pass http://elevate_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        location /health {
            proxy_pass http://elevate_backend/health;
            access_log off;
        }
    }
}`;

  await fs.writeFile('nginx.conf', nginxConfig);
  console.log('✅ Created nginx.conf');
}

async function createMongoInit() {
  const mongoInit = `// MongoDB initialization script for Elevate License System

db = db.getSiblingDB('elevateLicensing');

// Create collections
db.createCollection('licenses');
db.createCollection('analytics');

// Create indexes
db.licenses.createIndex({ "licenseKey": 1 }, { unique: true });
db.licenses.createIndex({ "email": 1 });
db.licenses.createIndex({ "productId": 1 });
db.licenses.createIndex({ "issuedAt": -1 });
db.licenses.createIndex({ "status": 1 });

// Create admin user
db.createUser({
  user: "elevate_admin",
  pwd: "secure_password_123",
  roles: [
    { role: "readWrite", db: "elevateLicensing" }
  ]
});

print("✅ MongoDB initialized for Elevate License System");`;

  await fs.writeFile('mongo-init.js', mongoInit);
  console.log('✅ Created mongo-init.js');
}

async function createTestScript() {
  const testScript = `#!/usr/bin/env node
// 🧪 Test script for Elevate License System

const { sendLicenseEmail } = require('./email');
const { init: initDB, saveLicense, getLicense } = require('./db');
const { logLicenseActivity } = require('./logger');

async function runTests() {
  console.log('🧪 Running Elevate License System tests...');
  
  try {
    // Test 1: Database connection
    console.log('\\n1. Testing database connection...');
    await initDB();
    console.log('✅ Database connection successful');
    
    // Test 2: License creation
    console.log('\\n2. Testing license creation...');
    const testLicense = {
      licenseKey: 'TEST-' + Date.now(),
      productId: 'test-product',
      productName: 'Test Product',
      price: 99,
      customerEmail: 'test@example.com',
      customerName: 'Test Customer',
      licenseType: 'test'
    };
    
    await saveLicense(testLicense);
    console.log('✅ License creation successful');
    
    // Test 3: License retrieval
    console.log('\\n3. Testing license retrieval...');
    const retrievedLicense = await getLicense(testLicense.licenseKey);
    if (retrievedLicense) {
      console.log('✅ License retrieval successful');
    } else {
      console.log('❌ License retrieval failed');
    }
    
    // Test 4: Logging
    console.log('\\n4. Testing logging system...');
    await logLicenseActivity(
      'test@example.com',
      testLicense.licenseKey,
      'test-product',
      'TEST',
      { test: true }
    );
    console.log('✅ Logging system successful');
    
    // Test 5: Email (optional - requires valid credentials)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log('\\n5. Testing email system...');
      try {
        await sendLicenseEmail(
          'test@example.com',
          testLicense.licenseKey,
          'test-product',
          'Test Product'
        );
        console.log('✅ Email system successful');
      } catch (error) {
        console.log('⚠️  Email test failed (check credentials):', error.message);
      }
    } else {
      console.log('\\n5. Skipping email test (no credentials configured)');
    }
    
    console.log('\\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

runTests();`;

  await fs.writeFile('test.js', testScript);
  await fs.chmod('test.js', 0o755);
  console.log('✅ Created test.js');
}

async function createReadme() {
  const readme = `# 🚀 Elevate Complete License System

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment:**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your Stripe keys and email credentials
   \`\`\`

3. **Start the system:**
   \`\`\`bash
   npm start
   \`\`\`

4. **Test the system:**
   \`\`\`bash
   npm test
   \`\`\`

## Docker Deployment

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f elevate-license-system
\`\`\`

## API Endpoints

- \`POST /webhook\` - Stripe webhook handler
- \`GET /validate/:licenseKey\` - License validation
- \`GET /analytics\` - Sales analytics
- \`GET /health\` - Health check
- \`POST /revoke/:licenseKey\` - Revoke license (admin)

## Features

✅ Automatic license generation and delivery
✅ Professional email templates
✅ MongoDB database with fallback to files
✅ Comprehensive logging and analytics
✅ Security features and rate limiting
✅ Docker containerization
✅ Admin endpoints for management

## Support

- Email: support@elevateforhumanity.com
- Documentation: https://docs.elevateforhumanity.com
- Discord: https://discord.gg/elevate
`;

  await fs.writeFile('README.md', readme);
  console.log('✅ Created README.md');
}

async function main() {
  try {
    await createDirectories();
    await createEnvFile();
    await createLogFiles();
    await createNginxConfig();
    await createMongoInit();
    await createTestScript();
    await createReadme();
    
    console.log('\n🎉 Setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Edit .env file with your Stripe keys and email credentials');
    console.log('2. Run: npm install');
    console.log('3. Run: npm test (to verify setup)');
    console.log('4. Run: npm start (to start the system)');
    console.log('\n🐳 For Docker deployment:');
    console.log('1. Run: docker-compose up -d');
    console.log('2. Access at: http://localhost:4242');
    console.log('\n🚀 Ready to start selling licenses!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main();`;

  await fs.writeFile('setup.js', setupScript);
  await fs.chmod('setup.js', 0o755);
  console.log('✅ Created setup.js');
}

// Run setup
main();