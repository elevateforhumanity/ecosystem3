/**
 * JWT-based License Validation Middleware
 * Protects routes and validates license tokens
 * 
 * Copyright (c) 2024 Selfish Inc. DBA Rise Foundation
 * Licensed Use Only - Unauthorized use prohibited
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// License validation secret (store in environment)
const LICENSE_SECRET = process.env.LICENSE_SECRET || 'rise-foundation-license-secret-2024';

// Valid license domains and their configurations
const VALID_DOMAINS = {
  'elevateforhumanity.com': { tier: 'enterprise', features: ['all'] },
  'kingdom-konnect.elevateforhumanity.com': { tier: 'sister-site', features: ['lms', 'basic'] },
  'urban-build-crew.elevateforhumanity.com': { tier: 'sister-site', features: ['lms', 'basic'] },
  'serene-comfort-care.elevateforhumanity.com': { tier: 'sister-site', features: ['lms', 'basic'] },
  'elevate-brain.elevateforhumanity.com': { tier: 'private', features: ['admin', 'analytics'] },
  'localhost': { tier: 'development', features: ['all'] },
  '127.0.0.1': { tier: 'development', features: ['all'] }
};

/**
 * Generate a new license token
 */
function generateLicenseToken(payload) {
  const tokenData = {
    ...payload,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (365 * 24 * 60 * 60), // 1 year
    iss: 'rise-foundation-licensing',
    jti: crypto.randomUUID() // Unique token ID
  };

  return jwt.sign(tokenData, LICENSE_SECRET, { algorithm: 'HS256' });
}

/**
 * Validate license token
 */
function validateLicenseToken(token) {
  try {
    const decoded = jwt.verify(token, LICENSE_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * License validation middleware
 */
function validateLicense(req, res, next) {
  try {
    // Get license token from header or query
    const token = req.headers['x-license-token'] || 
                  req.headers['authorization']?.replace('Bearer ', '') ||
                  req.query.license_token;

    if (!token) {
      return res.status(401).json({
        error: 'License token required',
        code: 'MISSING_LICENSE'
      });
    }

    // Validate JWT token
    const validation = validateLicenseToken(token);
    if (!validation.valid) {
      logViolation(req, `Invalid license token: ${validation.error}`);
      return res.status(401).json({
        error: 'Invalid license token',
        code: 'INVALID_LICENSE',
        details: validation.error
      });
    }

    const { payload } = validation;

    // Check domain authorization
    const requestDomain = req.get('host') || req.headers['x-forwarded-host'];
    const authorizedDomain = payload.domain;

    if (requestDomain !== authorizedDomain && !VALID_DOMAINS[requestDomain]) {
      logViolation(req, `Unauthorized domain: ${requestDomain} (licensed for: ${authorizedDomain})`);
      return res.status(403).json({
        error: 'Domain not authorized',
        code: 'UNAUTHORIZED_DOMAIN',
        authorized: authorizedDomain,
        current: requestDomain
      });
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && now > payload.exp) {
      logViolation(req, `Expired license token for domain: ${requestDomain}`);
      return res.status(403).json({
        error: 'License expired',
        code: 'LICENSE_EXPIRED',
        expired: new Date(payload.exp * 1000).toISOString()
      });
    }

    // Check feature access
    const route = req.path;
    const requiredFeature = getRequiredFeature(route);
    if (requiredFeature && !hasFeatureAccess(payload, requiredFeature)) {
      return res.status(403).json({
        error: 'Feature not licensed',
        code: 'FEATURE_NOT_LICENSED',
        required: requiredFeature,
        available: payload.features || []
      });
    }

    // Add license info to request
    req.license = {
      valid: true,
      payload,
      domain: authorizedDomain,
      tier: payload.tier || 'basic',
      features: payload.features || [],
      expires: new Date(payload.exp * 1000)
    };

    // Log successful validation
    logLicenseUsage(req, payload);

    next();

  } catch (error) {
    console.error('License validation error:', error);
    return res.status(500).json({
      error: 'License validation failed',
      code: 'VALIDATION_ERROR'
    });
  }
}

/**
 * Get required feature for a route
 */
function getRequiredFeature(route) {
  if (route.startsWith('/api/lms')) return 'lms';
  if (route.startsWith('/api/admin')) return 'admin';
  if (route.startsWith('/api/analytics')) return 'analytics';
  if (route.startsWith('/api/ai-tutor')) return 'ai-tutor';
  if (route.startsWith('/api/compliance')) return 'compliance';
  return null; // No specific feature required
}

/**
 * Check if license has access to feature
 */
function hasFeatureAccess(payload, feature) {
  if (!payload.features) return false;
  return payload.features.includes('all') || payload.features.includes(feature);
}

/**
 * Log license violation
 */
function logViolation(req, reason) {
  const violation = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    domain: req.get('host'),
    path: req.path,
    method: req.method,
    reason,
    headers: {
      'x-forwarded-for': req.get('x-forwarded-for'),
      'x-real-ip': req.get('x-real-ip'),
      'referer': req.get('referer')
    }
  };

  console.warn('🚨 LICENSE VIOLATION:', violation);

  // Send to violation tracking service
  sendViolationAlert(violation);
}

/**
 * Log successful license usage
 */
function logLicenseUsage(req, payload) {
  const usage = {
    timestamp: new Date().toISOString(),
    domain: payload.domain,
    licensee: payload.licensee,
    tier: payload.tier,
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };

  // In production, send to analytics service
  console.log('📊 License usage:', usage);
}

/**
 * Send violation alert (implement email/webhook)
 */
async function sendViolationAlert(violation) {
  try {
    // Email alert (implement with your email service)
    if (process.env.VIOLATION_ALERT_EMAIL) {
      // await sendEmail({
      //   to: process.env.VIOLATION_ALERT_EMAIL,
      //   subject: `🚨 License Violation: ${violation.domain}`,
      //   body: JSON.stringify(violation, null, 2)
      // });
    }

    // Webhook alert (implement with your monitoring service)
    if (process.env.VIOLATION_WEBHOOK_URL) {
      await fetch(process.env.VIOLATION_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(violation)
      });
    }
  } catch (error) {
    console.error('Failed to send violation alert:', error);
  }
}

/**
 * Generate license for a new client
 */
function generateClientLicense(clientData) {
  const {
    licensee,
    domain,
    tier = 'basic',
    features = ['lms'],
    duration = 365 // days
  } = clientData;

  const payload = {
    licensee,
    domain,
    tier,
    features,
    issued: new Date().toISOString(),
    issuer: 'Rise Foundation Licensing'
  };

  return generateLicenseToken(payload);
}

/**
 * Middleware for different license tiers
 */
const requireTier = (minTier) => {
  const tierLevels = { basic: 1, sister: 2, enterprise: 3, development: 999 };
  
  return (req, res, next) => {
    if (!req.license) {
      return res.status(401).json({ error: 'License required' });
    }

    const userTier = req.license.tier || 'basic';
    if (tierLevels[userTier] < tierLevels[minTier]) {
      return res.status(403).json({
        error: 'Insufficient license tier',
        required: minTier,
        current: userTier
      });
    }

    next();
  };
};

/**
 * Middleware for specific features
 */
const requireFeature = (feature) => {
  return (req, res, next) => {
    if (!req.license) {
      return res.status(401).json({ error: 'License required' });
    }

    if (!hasFeatureAccess(req.license.payload, feature)) {
      return res.status(403).json({
        error: 'Feature not licensed',
        required: feature,
        available: req.license.features
      });
    }

    next();
  };
};

module.exports = {
  validateLicense,
  generateLicenseToken,
  validateLicenseToken,
  generateClientLicense,
  requireTier,
  requireFeature,
  VALID_DOMAINS
};