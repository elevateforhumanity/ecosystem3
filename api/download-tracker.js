// 📊 Download Delivery Tracking System
// Tracks license downloads, validates access, and provides analytics

const { getLicense, updateLicenseUsage } = require('../complete-license-system/db');
const { logLicenseActivity } = require('../complete-license-system/logger');

// Download tracking middleware
async function trackDownload(req, res, next) {
  const { licenseKey, file } = req.params;
  const clientIP = req.ip || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];

  try {
    // Validate license
    const license = await getLicense(licenseKey);
    
    if (!license) {
      await logLicenseActivity(
        'UNKNOWN',
        licenseKey,
        'UNKNOWN',
        'DOWNLOAD_DENIED',
        {
          reason: 'invalid_license',
          file,
          ip: clientIP,
          userAgent
        }
      );
      
      return res.status(404).json({ 
        error: 'Invalid license key',
        message: 'The provided license key is not valid or has expired.'
      });
    }

    // Check license status
    if (license.status !== 'active') {
      await logLicenseActivity(
        license.customerEmail,
        licenseKey,
        license.productId,
        'DOWNLOAD_DENIED',
        {
          reason: 'inactive_license',
          status: license.status,
          file,
          ip: clientIP
        }
      );
      
      return res.status(403).json({ 
        error: 'License inactive',
        message: 'This license has been deactivated or revoked.'
      });
    }

    // Check expiry
    if (license.expiresAt && new Date(license.expiresAt) < new Date()) {
      await logLicenseActivity(
        license.customerEmail,
        licenseKey,
        license.productId,
        'DOWNLOAD_DENIED',
        {
          reason: 'expired_license',
          expiresAt: license.expiresAt,
          file,
          ip: clientIP
        }
      );
      
      return res.status(403).json({ 
        error: 'License expired',
        message: 'This license has expired. Please renew to continue downloading.'
      });
    }

    // Check if file is authorized for this license
    const authorizedFiles = license.download_files || license.files || [];
    const requestedFile = file.split('?')[0]; // Remove query params
    
    if (!authorizedFiles.some(authFile => authFile.includes(requestedFile))) {
      await logLicenseActivity(
        license.customerEmail,
        licenseKey,
        license.productId,
        'DOWNLOAD_DENIED',
        {
          reason: 'unauthorized_file',
          requestedFile,
          authorizedFiles,
          ip: clientIP
        }
      );
      
      return res.status(403).json({ 
        error: 'File not authorized',
        message: 'This file is not included in your license package.'
      });
    }

    // Log successful download attempt
    await logLicenseActivity(
      license.customerEmail,
      licenseKey,
      license.productId,
      'DOWNLOAD_STARTED',
      {
        file: requestedFile,
        ip: clientIP,
        userAgent,
        timestamp: new Date().toISOString()
      }
    );

    // Update license usage
    await updateLicenseUsage(licenseKey);

    // Add license info to request for downstream handlers
    req.license = license;
    req.downloadFile = requestedFile;
    
    next();

  } catch (error) {
    console.error('❌ Download tracking error:', error);
    
    await logLicenseActivity(
      'SYSTEM',
      licenseKey,
      'UNKNOWN',
      'DOWNLOAD_ERROR',
      {
        error: error.message,
        file,
        ip: clientIP
      }
    );
    
    res.status(500).json({ 
      error: 'Download tracking failed',
      message: 'Please try again or contact support.'
    });
  }
}

// Download completion tracking
async function trackDownloadComplete(req, res, next) {
  const { license, downloadFile } = req;
  
  if (license && downloadFile) {
    try {
      await logLicenseActivity(
        license.customerEmail,
        license.licenseKey,
        license.productId,
        'DOWNLOAD_COMPLETED',
        {
          file: downloadFile,
          ip: req.ip,
          timestamp: new Date().toISOString(),
          success: true
        }
      );
    } catch (error) {
      console.error('❌ Download completion tracking failed:', error);
    }
  }
  
  next();
}

// Generate secure download URL with expiry
function generateSecureDownloadURL(licenseKey, fileName, expiryHours = 24) {
  const crypto = require('crypto');
  const expires = Date.now() + (expiryHours * 60 * 60 * 1000);
  
  // Create signature
  const payload = `${licenseKey}:${fileName}:${expires}`;
  const signature = crypto
    .createHmac('sha256', process.env.DOWNLOAD_SECRET || 'default-secret')
    .update(payload)
    .digest('hex');
  
  return `/api/download/${licenseKey}/${fileName}?expires=${expires}&signature=${signature}`;
}

// Validate secure download URL
function validateDownloadURL(licenseKey, fileName, expires, signature) {
  const crypto = require('crypto');
  
  // Check expiry
  if (Date.now() > parseInt(expires)) {
    return { valid: false, reason: 'expired' };
  }
  
  // Verify signature
  const payload = `${licenseKey}:${fileName}:${expires}`;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.DOWNLOAD_SECRET || 'default-secret')
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return { valid: false, reason: 'invalid_signature' };
  }
  
  return { valid: true };
}

// Download analytics endpoint
async function getDownloadAnalytics(req, res) {
  try {
    const { licenseKey } = req.params;
    const { getLicense } = require('../complete-license-system/db');
    const { getLogAnalytics } = require('../complete-license-system/logger');
    
    // Validate license access (basic auth or admin key)
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    let analytics;
    
    if (licenseKey) {
      // Get analytics for specific license
      const license = await getLicense(licenseKey);
      if (!license) {
        return res.status(404).json({ error: 'License not found' });
      }
      
      analytics = {
        license: {
          key: license.licenseKey,
          product: license.productName,
          customer: license.customerEmail,
          issued: license.issuedAt,
          expires: license.expiresAt,
          status: license.status,
          usageCount: license.usageCount || 0,
          lastUsed: license.lastUsed
        },
        downloads: await getDownloadHistory(licenseKey)
      };
    } else {
      // Get overall analytics
      analytics = await getLogAnalytics(30); // Last 30 days
    }
    
    res.json(analytics);
    
  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ error: 'Analytics unavailable' });
  }
}

// Get download history for a license
async function getDownloadHistory(licenseKey) {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // Read from logs
    const logFile = path.join('./complete-license-system/logs', 'licenses.jsonl');
    const logData = await fs.readFile(logFile, 'utf8');
    
    const downloads = logData
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line))
      .filter(entry => 
        entry.licenseKey === licenseKey && 
        ['DOWNLOAD_STARTED', 'DOWNLOAD_COMPLETED', 'DOWNLOAD_DENIED'].includes(entry.action)
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 100); // Last 100 download events
    
    return downloads;
  } catch (error) {
    console.error('❌ Download history error:', error);
    return [];
  }
}

module.exports = {
  trackDownload,
  trackDownloadComplete,
  generateSecureDownloadURL,
  validateDownloadURL,
  getDownloadAnalytics
};