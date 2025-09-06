
// EFH License Validation Routes
const express = require('express');
const CopyrightProtection = require('../lib/copyright-protection');
const router = express.Router();

// Validate license key
router.post('/validate', (req, res) => {
  try {
    const { licenseKey, domain } = req.body;
    
    if (!licenseKey || !domain) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['licenseKey', 'domain']
      });
    }

    const validation = CopyrightProtection.validateLicense(licenseKey, domain);
    
    res.json({
      valid: validation.valid,
      type: validation.type,
      restrictions: validation.restrictions || [],
      message: validation.message || 'License validated successfully'
    });

  } catch (error) {
    res.status(500).json({
      error: 'License validation failed',
      message: error.message
    });
  }
});

// Generate new license key (admin only)
router.post('/generate', CopyrightProtection.requireValidLicense, (req, res) => {
  try {
    // Only allow admin licenses to generate new keys
    if (req.license.type !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    const { email, domain, licenseType } = req.body;
    
    if (!email || !domain) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'domain']
      });
    }

    const licenseKey = CopyrightProtection.generateLicenseKey({
      email,
      domain,
      licenseType: licenseType || 'standard'
    });

    res.json({
      licenseKey,
      customerInfo: { email, domain, licenseType },
      terms: 'https://elevateforhumanity.org/license-terms',
      support: 'support@elevateforhumanity.org'
    });

  } catch (error) {
    res.status(500).json({
      error: 'License generation failed',
      message: error.message
    });
  }
});

// Check license status
router.get('/status', (req, res) => {
  const licenseKey = req.headers['x-efh-license'] || req.query.license;
  const domain = req.get('host');

  if (!licenseKey) {
    return res.json({
      licensed: false,
      message: 'No license key provided',
      contact: 'licensing@elevateforhumanity.org'
    });
  }

  const validation = CopyrightProtection.validateLicense(licenseKey, domain);
  
  res.json({
    licensed: validation.valid,
    type: validation.type,
    restrictions: validation.restrictions || [],
    domain: domain,
    copyright: '© 2025 Elevate for Humanity'
  });
});

module.exports = router;
