/**
 * License Management Dashboard API
 * Provides admin interface for managing licenses and monitoring usage
 * 
 * Copyright (c) 2024 Selfish Inc. DBA Rise Foundation
 * Licensed Use Only - Unauthorized use prohibited
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { validateLicense, generateClientLicense, validateLicenseToken } = require('../middleware/license');
const nodemailer = require('nodemailer');

const app = express();
const router = express.Router();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ADMIN_ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting for admin endpoints
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// In-memory storage (replace with database in production)
const licenseDatabase = new Map();
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

// Admin authentication middleware
function authenticateAdmin(req, res, next) {
  const adminKey = req.headers['x-admin-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Valid admin API key required' 
    });
  }
  
  next();
}

// Dashboard overview
router.get('/dashboard', authenticateAdmin, (req, res) => {
  const totalLicenses = licenseDatabase.size;
  const activeLicenses = Array.from(licenseDatabase.values())
    .filter(license => new Date(license.expires) > new Date()).length;
  const totalUsage = usageLog.length;
  const totalViolations = violationLog.length;
  
  // Recent activity
  const recentUsage = usageLog.slice(-10);
  const recentViolations = violationLog.slice(-5);
  
  // Usage by domain
  const usageByDomain = {};
  usageLog.forEach(log => {
    usageByDomain[log.domain] = (usageByDomain[log.domain] || 0) + 1;
  });

  res.json({
    overview: {
      totalLicenses,
      activeLicenses,
      expiredLicenses: totalLicenses - activeLicenses,
      totalUsage,
      totalViolations,
      violationRate: totalUsage > 0 ? (totalViolations / totalUsage * 100).toFixed(2) : 0
    },
    recentActivity: {
      usage: recentUsage,
      violations: recentViolations
    },
    analytics: {
      usageByDomain,
      topDomains: Object.entries(usageByDomain)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
    }
  });
});

// List all licenses
router.get('/licenses', authenticateAdmin, (req, res) => {
  const licenses = Array.from(licenseDatabase.values()).map(license => ({
    ...license,
    token: license.token.slice(0, 20) + '...' // Hide full token for security
  }));
  
  res.json({ licenses });
});

// Get specific license
router.get('/licenses/:id', authenticateAdmin, (req, res) => {
  const license = licenseDatabase.get(req.params.id);
  
  if (!license) {
    return res.status(404).json({ error: 'License not found' });
  }
  
  // Get usage stats for this license
  const licenseUsage = usageLog.filter(log => log.domain === license.domain);
  const licenseViolations = violationLog.filter(log => log.domain === license.domain);
  
  res.json({
    license,
    stats: {
      totalUsage: licenseUsage.length,
      violations: licenseViolations.length,
      lastUsed: licenseUsage.length > 0 ? licenseUsage[licenseUsage.length - 1].timestamp : null,
      isActive: new Date(license.expires) > new Date()
    }
  });
});

// Create new license
router.post('/licenses', authenticateAdmin, (req, res) => {
  try {
    const { licensee, domain, tier, features, duration } = req.body;
    
    // Validate required fields
    if (!licensee || !domain) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['licensee', 'domain'] 
      });
    }
    
    // Generate license
    const licenseData = {
      licensee,
      domain,
      tier: tier || 'basic',
      features: features || ['lms', 'basic'],
      duration: duration || 365
    };
    
    const token = generateClientLicense(licenseData);
    const validation = validateLicenseToken(token);
    
    if (!validation.valid) {
      throw new Error(`License validation failed: ${validation.error}`);
    }
    
    // Store license
    const licenseId = `lic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const license = {
      id: licenseId,
      ...licenseData,
      token,
      created: new Date().toISOString(),
      expires: new Date(Date.now() + (licenseData.duration * 24 * 60 * 60 * 1000)).toISOString(),
      status: 'active'
    };
    
    licenseDatabase.set(licenseId, license);
    
    // Send license email if requested
    if (req.body.sendEmail && req.body.email) {
      sendLicenseEmail(license, req.body.email);
    }
    
    res.status(201).json({
      message: 'License created successfully',
      license: {
        ...license,
        token: license.token.slice(0, 20) + '...' // Hide full token in response
      },
      fullToken: token // Provide full token separately
    });
    
  } catch (error) {
    console.error('License creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create license', 
      details: error.message 
    });
  }
});

// Update license
router.put('/licenses/:id', authenticateAdmin, (req, res) => {
  const license = licenseDatabase.get(req.params.id);
  
  if (!license) {
    return res.status(404).json({ error: 'License not found' });
  }
  
  const { status, tier, features } = req.body;
  
  // Update allowed fields
  if (status) license.status = status;
  if (tier) license.tier = tier;
  if (features) license.features = features;
  
  license.updated = new Date().toISOString();
  licenseDatabase.set(req.params.id, license);
  
  res.json({ 
    message: 'License updated successfully', 
    license 
  });
});

// Revoke license
router.delete('/licenses/:id', authenticateAdmin, (req, res) => {
  const license = licenseDatabase.get(req.params.id);
  
  if (!license) {
    return res.status(404).json({ error: 'License not found' });
  }
  
  license.status = 'revoked';
  license.revokedAt = new Date().toISOString();
  licenseDatabase.set(req.params.id, license);
  
  res.json({ 
    message: 'License revoked successfully',
    license 
  });
});

// Usage analytics
router.get('/analytics/usage', authenticateAdmin, (req, res) => {
  const { domain, startDate, endDate } = req.query;
  
  let filteredUsage = usageLog;
  
  if (domain) {
    filteredUsage = filteredUsage.filter(log => log.domain === domain);
  }
  
  if (startDate) {
    filteredUsage = filteredUsage.filter(log => new Date(log.timestamp) >= new Date(startDate));
  }
  
  if (endDate) {
    filteredUsage = filteredUsage.filter(log => new Date(log.timestamp) <= new Date(endDate));
  }
  
  // Group by date
  const usageByDate = {};
  filteredUsage.forEach(log => {
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    usageByDate[date] = (usageByDate[date] || 0) + 1;
  });
  
  res.json({
    totalUsage: filteredUsage.length,
    usageByDate,
    topPaths: getTopPaths(filteredUsage),
    topUserAgents: getTopUserAgents(filteredUsage)
  });
});

// Violation reports
router.get('/violations', authenticateAdmin, (req, res) => {
  const { domain, severity } = req.query;
  
  let filteredViolations = violationLog;
  
  if (domain) {
    filteredViolations = filteredViolations.filter(v => v.domain === domain);
  }
  
  if (severity) {
    filteredViolations = filteredViolations.filter(v => v.severity === severity);
  }
  
  res.json({
    violations: filteredViolations,
    summary: {
      total: filteredViolations.length,
      byDomain: groupBy(filteredViolations, 'domain'),
      byReason: groupBy(filteredViolations, 'reason')
    }
  });
});

// Send DMCA takedown template
router.get('/dmca-template/:domain', authenticateAdmin, (req, res) => {
  const { domain } = req.params;
  
  const template = `
Subject: DMCA Takedown Request - Unauthorized Use of Rise Foundation Ecosystem

To Whom It May Concern,

I am writing to report unauthorized use of copyrighted material owned by Selfish Inc. DBA Rise Foundation.

COPYRIGHTED WORK:
- Work: Rise Foundation Ecosystem Software Platform
- Copyright Owner: Selfish Inc. DBA Rise Foundation
- Original Location: https://elevateforhumanity.com

INFRINGING MATERIAL:
- Infringing URL: https://${domain}
- Description: Unauthorized copy/deployment of our proprietary LMS and sister sites platform

CONTACT INFORMATION:
- Name: [Your Name]
- Title: [Your Title]
- Company: Selfish Inc. DBA Rise Foundation
- Email: legal@elevateforhumanity.com
- Phone: [Your Phone]

GOOD FAITH STATEMENT:
I have a good faith belief that the use of the copyrighted material described above is not authorized by the copyright owner, its agent, or the law.

ACCURACY STATEMENT:
I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner or am authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.

Please remove or disable access to the infringing material immediately.

Sincerely,
[Your Signature]
[Your Name]
[Date]

---
This takedown request was generated by the Rise Foundation License Management System.
  `;
  
  res.text(template);
});

// Helper functions
function getTopPaths(usage) {
  const pathCounts = {};
  usage.forEach(log => {
    pathCounts[log.path] = (pathCounts[log.path] || 0) + 1;
  });
  
  return Object.entries(pathCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
}

function getTopUserAgents(usage) {
  const uaCounts = {};
  usage.forEach(log => {
    const ua = log.userAgent?.split(' ')[0] || 'Unknown';
    uaCounts[ua] = (uaCounts[ua] || 0) + 1;
  });
  
  return Object.entries(uaCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10);
}

function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const group = item[key] || 'Unknown';
    groups[group] = (groups[group] || 0) + 1;
    return groups;
  }, {});
}

async function sendLicenseEmail(license, email) {
  try {
    const emailContent = `
Dear ${license.licensee},

Your Rise Foundation Ecosystem license has been generated successfully.

LICENSE DETAILS:
- Licensee: ${license.licensee}
- Domain: ${license.domain}
- Tier: ${license.tier}
- Features: ${license.features.join(', ')}
- Expires: ${new Date(license.expires).toLocaleDateString()}

LICENSE TOKEN:
${license.token}

SETUP INSTRUCTIONS:
1. Add the license token to your .env file as LICENSE_TOKEN
2. Implement license validation in your application
3. Ensure your domain matches the licensed domain exactly

For support, contact: licensing@elevateforhumanity.com

Best regards,
Rise Foundation Licensing Team
    `;

    await emailTransporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Rise Foundation License - ${license.domain}`,
      text: emailContent
    });

    console.log(`License email sent to: ${email}`);
  } catch (error) {
    console.error('Failed to send license email:', error);
  }
}

// Apply rate limiting to admin routes
app.use('/api/admin', adminLimiter);
app.use('/api/admin', router);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Rise Foundation License Dashboard'
  });
});

const PORT = process.env.DASHBOARD_PORT || 3002;
app.listen(PORT, () => {
  console.log(`🛡️  License dashboard running on port ${PORT}`);
  console.log(`📊 Dashboard URL: http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`🔑 Admin API key required: ${process.env.ADMIN_API_KEY ? 'Set' : 'NOT SET'}`);
});

module.exports = app;