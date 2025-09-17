// 🚀 COMPLETE ELEVATE LICENSE SYSTEM
// Production-ready webhook with email, database, and logging

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const Stripe = require('stripe');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Import our modules
const { sendLicenseEmail, testEmail } = require('./email');
const { init: initDB, saveLicense, getLicense, updateLicenseUsage, getAnalytics, revokeLicense } = require('./db');
const { logLicenseActivity, logSecurityEvent, logPerformance, logError, getLogAnalytics, rotateLogs, initializeLogs } = require('./logger');

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://elevateforhumanity.com'],
  credentials: true
}));

// Rate limiting
const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many webhook requests from this IP'
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many API requests from this IP'
});

// 📦 Enhanced product catalog (matches frontend purchase form)
const PRODUCT_CATALOG = {
  'price_1DemoTemplate': {
    name: 'Landing Page Demo Template',
    price: 39,
    files: [
      'https://cdn.elevateforhumanity.com/downloads/landing-template.zip',
      'https://cdn.elevateforhumanity.com/downloads/setup-guide.pdf'
    ],
    license_type: 'single_use',
    description: 'Complete HTML template with sister-site navigation',
    category: 'template'
  },
  'price_1Workbooks': {
    name: 'PDF Workbook Bundle',
    price: 29,
    files: [
      'https://cdn.elevateforhumanity.com/downloads/workforce-workbooks.zip'
    ],
    license_type: 'commercial',
    description: '50+ professional training PDFs',
    category: 'content'
  },
  'price_1AICourseLicense': {
    name: 'AI Course Creator License',
    price: 199,
    files: [
      'https://cdn.elevateforhumanity.com/downloads/ai-course-creator.zip',
      'https://cdn.elevateforhumanity.com/downloads/api-documentation.pdf'
    ],
    license_type: 'annual',
    description: 'AI-powered course generation system',
    category: 'software'
  },
  'price_1SiteClone': {
    name: 'Elevate Site Clone',
    price: 399,
    files: [
      'https://cdn.elevateforhumanity.com/downloads/elevate-clone-full.zip',
      'https://cdn.elevateforhumanity.com/downloads/deployment-guide.pdf'
    ],
    license_type: 'commercial',
    description: 'Complete source code with documentation',
    category: 'platform'
  },
  'price_1WhiteLabel': {
    name: 'White-Label Platform',
    price: 599,
    files: [
      'https://cdn.elevateforhumanity.com/downloads/white-label-platform.zip',
      'https://cdn.elevateforhumanity.com/downloads/branding-kit.zip',
      'https://cdn.elevateforhumanity.com/downloads/customization-guide.pdf'
    ],
    license_type: 'reseller',
    description: 'Full platform with custom branding',
    category: 'platform'
  },
  'price_1Enterprise': {
    name: 'Enterprise License System',
    price: 1299,
    files: [
      'https://cdn.elevateforhumanity.com/downloads/enterprise-platform.zip',
      'https://cdn.elevateforhumanity.com/downloads/license-system.zip',
      'https://cdn.elevateforhumanity.com/downloads/docker-config.zip'
    ],
    license_type: 'enterprise',
    description: 'Advanced features with enterprise license protection',
    category: 'enterprise'
  },
  'price_1DFYSetup': {
    name: 'Done-for-You Setup',
    price: 1999,
    files: [], // Service-based, no immediate downloads
    license_type: 'service',
    description: 'Complete setup service with 30-day support',
    category: 'service'
  }
};

// 🔐 Enhanced license key generator
function generateLicenseKey(productId, customerEmail) {
  const timestamp = Date.now().toString(36).toUpperCase();
  const hash = crypto.createHash('sha256').update(customerEmail + productId + process.env.LICENSE_SALT).digest('hex').substring(0, 8).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  
  return `ELV-${timestamp}-${hash}-${random}`;
}

// 📅 Calculate license expiry
function getLicenseExpiry(licenseType) {
  const now = new Date();
  
  switch (licenseType) {
    case 'annual':
      return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    case 'enterprise':
      return new Date(now.getFullYear() + 3, now.getMonth(), now.getDate());
    case 'single_use':
      return new Date(now.getFullYear() + 10, now.getMonth(), now.getDate());
    case 'commercial':
    case 'reseller':
      return null; // Lifetime
    default:
      return null;
  }
}

// 🎯 Main webhook handler
app.post('/webhook', webhookLimiter, bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const startTime = Date.now();
  const sig = req.headers['stripe-signature'];
  const clientIP = req.ip || req.connection.remoteAddress;
  
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    
    await logSecurityEvent('webhook_received', {
      eventType: event.type,
      eventId: event.id,
      ip: clientIP
    });
    
  } catch (err) {
    await logSecurityEvent('webhook_signature_failed', {
      error: err.message,
      ip: clientIP,
      severity: 'HIGH'
    });
    
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    try {
      console.log('💳 Processing payment for session:', session.id);
      
      // Get line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      
      const customerEmail = session.customer_details.email;
      const customerName = session.customer_details.name || 'Valued Customer';
      
      // Process each purchased item
      const licenses = [];
      
      for (const item of lineItems.data) {
        const priceId = item.price.id;
        const product = PRODUCT_CATALOG[priceId];
        
        if (product) {
          const licenseKey = generateLicenseKey(priceId, customerEmail);
          
          const licenseData = {
            licenseKey,
            productId: priceId,
            productName: product.name,
            price: product.price,
            files: product.files,
            licenseType: product.license_type,
            category: product.category,
            expiresAt: getLicenseExpiry(product.license_type),
            customerEmail,
            customerName,
            stripeSessionId: session.id,
            billingAddress: session.customer_details?.address,
            paymentIntent: session.payment_intent
          };
          
          licenses.push(licenseData);
          
          // Save license to database
          await saveLicense(licenseData);
          
          // Log license activity
          await logLicenseActivity(
            customerEmail, 
            licenseKey, 
            priceId, 
            'ISSUED',
            {
              price: product.price,
              productName: product.name,
              stripeSessionId: session.id,
              ip: clientIP
            }
          );
        }
      }
      
      // Send delivery email
      if (licenses.length > 0) {
        for (const license of licenses) {
          await sendLicenseEmail(
            license.customerEmail,
            license.licenseKey,
            license.productId,
            license.productName,
            license.files
          );
          
          await logLicenseActivity(
            license.customerEmail,
            license.licenseKey,
            license.productId,
            'EMAIL_SENT',
            { deliveryMethod: 'email' }
          );
        }
        
        await logLicenseActivity(
          customerEmail,
          'BULK',
          'MULTIPLE',
          'DELIVERY_COMPLETED',
          {
            sessionId: session.id,
            licenseCount: licenses.length,
            totalAmount: session.amount_total / 100
          }
        );
      }
      
      console.log('✅ Payment processed successfully:', session.id);
      
    } catch (error) {
      await logError(error, {
        sessionId: session.id,
        customerEmail: session.customer_details?.email,
        eventType: 'payment_processing'
      });
      
      console.error('❌ Payment processing failed:', error);
      return res.status(500).json({ error: 'Processing failed' });
    }
  }

  // Log performance
  const duration = Date.now() - startTime;
  await logPerformance('webhook_processing', duration, {
    eventType: event.type,
    eventId: event.id
  });

  res.status(200).json({ received: true });
});

// 🔍 License validation endpoint
app.get('/validate/:licenseKey', apiLimiter, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { licenseKey } = req.params;
    const clientIP = req.ip || req.connection.remoteAddress;
    
    const license = await getLicense(licenseKey);
    
    if (!license) {
      await logSecurityEvent('license_validation_failed', {
        licenseKey,
        ip: clientIP,
        reason: 'not_found'
      });
      
      return res.status(404).json({ valid: false, error: 'License not found' });
    }
    
    // Check if license is still valid
    const isValid = license.status === 'active' && 
                   (!license.expiresAt || new Date(license.expiresAt) > new Date());
    
    // Update usage tracking
    if (isValid) {
      await updateLicenseUsage(licenseKey);
    }
    
    // Log validation attempt
    await logLicenseActivity(
      license.customerEmail,
      licenseKey,
      license.productId,
      'VALIDATED',
      {
        isValid,
        ip: clientIP,
        userAgent: req.headers['user-agent']
      }
    );
    
    const response = {
      valid: isValid,
      product: license.productName,
      licenseType: license.licenseType,
      expiresAt: license.expiresAt,
      issuedAt: license.issuedAt,
      usageCount: license.usageCount || 0
    };
    
    // Log performance
    const duration = Date.now() - startTime;
    await logPerformance('license_validation', duration, { licenseKey });
    
    res.json(response);
    
  } catch (error) {
    await logError(error, { 
      licenseKey: req.params.licenseKey,
      endpoint: 'validate'
    });
    
    res.status(500).json({ valid: false, error: 'Validation failed' });
  }
});

// 📊 Analytics dashboard endpoint
app.get('/analytics', apiLimiter, async (req, res) => {
  try {
    const dbAnalytics = await getAnalytics();
    const logAnalytics = await getLogAnalytics(30); // Last 30 days
    
    const combinedAnalytics = {
      database: dbAnalytics,
      logs: logAnalytics,
      timestamp: new Date().toISOString()
    };
    
    res.json(combinedAnalytics);
  } catch (error) {
    await logError(error, { endpoint: 'analytics' });
    res.status(500).json({ error: 'Analytics unavailable' });
  }
});

// 🚫 License revocation endpoint (admin only)
app.post('/revoke/:licenseKey', apiLimiter, async (req, res) => {
  try {
    const { licenseKey } = req.params;
    const { reason, adminKey } = req.body;
    
    // Simple admin authentication (enhance with proper auth)
    if (adminKey !== process.env.ADMIN_KEY) {
      await logSecurityEvent('unauthorized_revocation_attempt', {
        licenseKey,
        ip: req.ip,
        severity: 'HIGH'
      });
      
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    await revokeLicense(licenseKey, reason);
    
    await logLicenseActivity(
      'ADMIN',
      licenseKey,
      'UNKNOWN',
      'REVOKED',
      {
        reason,
        adminIP: req.ip,
        timestamp: new Date().toISOString()
      }
    );
    
    res.json({ success: true, message: 'License revoked' });
  } catch (error) {
    await logError(error, { 
      licenseKey: req.params.licenseKey,
      endpoint: 'revoke'
    });
    
    res.status(500).json({ error: 'Revocation failed' });
  }
});

// 🏥 Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

// 📧 Test email endpoint (admin only)
app.post('/test-email', apiLimiter, async (req, res) => {
  try {
    const { adminKey } = req.body;
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    await testEmail();
    res.json({ success: true, message: 'Test email sent' });
  } catch (error) {
    await logError(error, { endpoint: 'test-email' });
    res.status(500).json({ error: 'Test email failed' });
  }
});

// 🔄 Log rotation endpoint (admin only)
app.post('/rotate-logs', apiLimiter, async (req, res) => {
  try {
    const { adminKey } = req.body;
    
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    await rotateLogs();
    res.json({ success: true, message: 'Logs rotated' });
  } catch (error) {
    await logError(error, { endpoint: 'rotate-logs' });
    res.status(500).json({ error: 'Log rotation failed' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  logError(error, {
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  res.status(500).json({ error: 'Internal server error' });
});

// 🚀 Start server
const PORT = process.env.PORT || 4242;

async function startServer() {
  try {
    // Initialize systems
    await initializeLogs();
    await initDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Complete Elevate License System running on port ${PORT}`);
      console.log(`📊 Analytics: http://localhost:${PORT}/analytics`);
      console.log(`🔍 License validation: http://localhost:${PORT}/validate/LICENSE-KEY`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log(`📧 Test email: POST http://localhost:${PORT}/test-email`);
      
      // Log startup
      logLicenseActivity(
        'SYSTEM',
        'STARTUP',
        'SERVER',
        'STARTED',
        {
          port: PORT,
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      );
    });
    
    // Schedule log rotation (daily)
    setInterval(rotateLogs, 24 * 60 * 60 * 1000);
    
  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
}

startServer();