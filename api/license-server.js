/**
 * License Server API for Rise Foundation Ecosystem
 * Handles license validation, usage tracking, and violation alerts
 * 
 * Copyright (c) 2024 Selfish Inc. DBA Rise Foundation
 * Licensed Use Only - Unauthorized use prohibited
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const router = express.Router();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: [
    'https://elevateforhumanity.com',
    'https://kingdom-konnect.elevateforhumanity.com',
    'https://urban-build-crew.elevateforhumanity.com',
    'https://serene-comfort-care.elevateforhumanity.com',
    'https://elevate-brain.elevateforhumanity.com',
    'http://localhost:3000' // Development only
  ]
}));

app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// License database (in production, use a real database)
const licenses = new Map([
  ['EFH-RISE-2024-PROD-XYZ789', {
    key: 'EFH-RISE-2024-PROD-XYZ789',
    holder: 'Rise Foundation',
    domains: [
      'elevateforhumanity.com',
      'kingdom-konnect.elevateforhumanity.com',
      'urban-build-crew.elevateforhumanity.com',
      'serene-comfort-care.elevateforhumanity.com',
      'elevate-brain.elevateforhumanity.com'
    ],
    expires: '2025-12-31',
    type: 'COMMERCIAL',
    active: true,
    features: ['LMS', 'SISTER_SITES', 'AI_TUTOR', 'ANALYTICS', 'COMPLIANCE']
  }]
);

// Usage tracking
const usageLog = [];
const violationLog = [];

// Email configuration
const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// License validation endpoint
router.post('/validate', async (req, res) => {
  try {
    const { domain, key, timestamp } = req.body;
    const licenseKey = req.headers['x-license-key'];

    // Validate license key
    const license = licenses.get(licenseKey);
    if (!license) {
      await logViolation(req, 'Invalid license key');
      return res.status(401).json({
        valid: false,
        reason: 'Invalid license key'
      });
    }

    // Check if license is active
    if (!license.active) {
      await logViolation(req, 'License deactivated');
      return res.status(401).json({
        valid: false,
        reason: 'License has been deactivated'
      });
    }

    // Check expiration
    if (new Date() > new Date(license.expires)) {
      await logViolation(req, 'License expired');
      return res.status(401).json({
        valid: false,
        reason: 'License has expired'
      });
    }

    // Check domain authorization
    const isAuthorizedDomain = license.domains.some(authorizedDomain => 
      domain.includes(authorizedDomain) || 
      domain === 'localhost' || 
      domain === '127.0.0.1'
    );

    if (!isAuthorizedDomain) {
      await logViolation(req, `Unauthorized domain: ${domain}`);
      return res.status(401).json({
        valid: false,
        reason: `Domain ${domain} is not authorized for this license`
      });
    }

    // Log successful validation
    usageLog.push({
      timestamp: new Date(),
      domain,
      key: licenseKey,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'license_validation'
    });

    res.json({
      valid: true,
      license: {
        holder: license.holder,
        expires: license.expires,
        type: license.type,
        features: license.features
      }
    });

  } catch (error) {
    console.error('License validation error:', error);
    res.status(500).json({
      valid: false,
      reason: 'Internal server error'
    });
  }
});

// Usage ping endpoint
router.post('/usage-ping', async (req, res) => {
  try {
    const { domain, path, timestamp } = req.body;
    const licenseKey = req.headers['x-license-key'];

    // Validate license exists
    const license = licenses.get(licenseKey);
    if (!license) {
      return res.status(401).json({ error: 'Invalid license' });
    }

    // Log usage
    usageLog.push({
      timestamp: new Date(),
      domain,
      path,
      key: licenseKey,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      action: 'usage_ping',
      data: req.body
    });

    res.json({ received: true });

  } catch (error) {
    console.error('Usage ping error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Violation alert endpoint
router.post('/violation-alert', async (req, res) => {
  try {
    const { domain, reason, timestamp } = req.body;

    await logViolation(req, reason);
    await sendViolationAlert(req.body, req);

    res.json({ alerted: true });

  } catch (error) {
    console.error('Violation alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// License info endpoint (for authorized domains only)
router.get('/info/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const license = licenses.get(key);

    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }

    res.json({
      holder: license.holder,
      expires: license.expires,
      type: license.type,
      domains: license.domains,
      features: license.features,
      active: license.active
    });

  } catch (error) {
    console.error('License info error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin endpoints (protected)
router.get('/admin/usage', authenticateAdmin, (req, res) => {
  res.json({
    totalPings: usageLog.length,
    recentUsage: usageLog.slice(-50),
    violations: violationLog.length,
    recentViolations: violationLog.slice(-20)
  });
});

router.get('/admin/licenses', authenticateAdmin, (req, res) => {
  const licensesArray = Array.from(licenses.values());
  res.json(licensesArray);
});

// Helper functions
async function logViolation(req, reason) {
  const violation = {
    timestamp: new Date(),
    domain: req.body.domain || 'unknown',
    reason,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    referrer: req.body.referrer,
    data: req.body
  };

  violationLog.push(violation);
  console.warn('🚨 LICENSE VIOLATION:', violation);

  // In production, save to database
  // await saveViolationToDatabase(violation);
}

async function sendViolationAlert(violationData, req) {
  try {
    const emailContent = `
      🚨 LICENSE VIOLATION DETECTED

      Domain: ${violationData.domain}
      Reason: ${violationData.reason}
      IP Address: ${req.ip}
      User Agent: ${req.headers['user-agent']}
      Timestamp: ${new Date().toISOString()}
      
      Referrer: ${violationData.referrer || 'None'}
      
      This appears to be unauthorized use of the Rise Foundation Ecosystem.
      Please investigate and take appropriate action.
      
      ---
      Rise Foundation License Protection System
    `;

    await emailTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.VIOLATION_ALERT_EMAIL || 'legal@elevateforhumanity.com',
      subject: `🚨 License Violation: ${violationData.domain}`,
      text: emailContent
    });

    console.log('Violation alert sent to:', process.env.VIOLATION_ALERT_EMAIL);

  } catch (error) {
    console.error('Failed to send violation alert:', error);
  }
}

function authenticateAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// DMCA takedown template endpoint
router.get('/dmca-template', (req, res) => {
  const template = `
Subject: DMCA Takedown Request for Unauthorized Use of Rise Foundation Ecosystem

To Whom It May Concern,

I am the copyright holder of the Rise Foundation Ecosystem platform and associated software. The code, design, and proprietary systems currently hosted at [INFRINGING_URL] are unauthorized copies of our proprietary system.

Original Work: https://elevateforhumanity.com
Copyright Owner: Selfish Inc. DBA Rise Foundation
Contact: legal@elevateforhumanity.com

The infringing material includes but is not limited to:
- Sister sites navigation system
- Learning Management System (LMS)
- Payment processing integration
- Federal compliance reporting system
- AI tutoring system
- Proprietary business logic and workflows

I have a good faith belief that the use of this material is not authorized by the copyright owner, its agent, or the law.

I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or am authorized to act on behalf of the owner.

Please remove or suspend the infringing content immediately under the DMCA.

Sincerely,
[Your Name]
[Your Title]
Selfish Inc. DBA Rise Foundation
legal@elevateforhumanity.com
[Phone Number]
  `;

  res.text(template);
});

app.use('/api', router);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Rise Foundation License Server'
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🛡️  License server running on port ${PORT}`);
  console.log(`📊 Admin dashboard: http://localhost:${PORT}/api/admin/usage`);
});

module.exports = app;