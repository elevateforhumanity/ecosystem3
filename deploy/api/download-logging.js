// 🔍 Enhanced Download Logging API
// Integrates with existing license system for comprehensive tracking

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { logLicenseActivity, logSecurityEvent } = require('../complete-license-system/logger');
const { getLicense, updateLicenseUsage } = require('../complete-license-system/db');

const router = express.Router();

// Ensure logs directory exists
async function ensureLogsDir() {
  try {
    await fs.mkdir('./logs', { recursive: true });
    await fs.mkdir('./logs/downloads', { recursive: true });
  } catch (error) {
    // Directory already exists
  }
}

// Enhanced download tracking
router.post('/log-download', async (req, res) => {
  try {
    const {
      email,
      productId,
      licenseKey,
      fileName,
      sessionId,
      timestamp,
      userAgent,
      referrer,
      pageUrl,
      screenResolution,
      timezone
    } = req.body;

    const clientIP = req.ip || req.connection.remoteAddress;
    
    // Enhanced log entry
    const logEntry = {
      timestamp: timestamp || new Date().toISOString(),
      action: 'DOWNLOAD_STARTED',
      email,
      productId,
      licenseKey,
      fileName,
      sessionId,
      clientIP,
      userAgent,
      referrer,
      pageUrl,
      screenResolution,
      timezone,
      server: {
        nodeVersion: process.version,
        platform: process.platform
      }
    };

    // Log to multiple destinations
    await Promise.all([
      // 1. Main license activity log
      logLicenseActivity(
        email,
        licenseKey || 'UNKNOWN',
        productId,
        'DOWNLOAD_STARTED',
        {
          fileName,
          sessionId,
          ip: clientIP,
          userAgent: userAgent?.substring(0, 200) // Truncate long user agents
        }
      ),

      // 2. Detailed download log
      fs.appendFile(
        './logs/downloads/detailed.jsonl',
        JSON.stringify(logEntry) + '\n'
      ),

      // 3. Simple CSV log for analytics
      fs.appendFile(
        './logs/downloads/simple.csv',
        `"${timestamp}","${email}","${productId}","${licenseKey || ''}","${fileName || ''}","${clientIP}"\n`
      )
    ]);

    // Validate license if provided
    if (licenseKey) {
      try {
        const license = await getLicense(licenseKey);
        if (!license || license.status !== 'active') {
          await logSecurityEvent('invalid_license_download_attempt', {
            licenseKey,
            email,
            productId,
            ip: clientIP,
            severity: 'MEDIUM'
          });
        }
      } catch (error) {
        console.error('License validation error during download tracking:', error);
      }
    }

    console.log(`📥 Download tracked: ${email} - ${productId} - ${fileName || 'unknown'}`);
    
    res.json({ 
      success: true, 
      sessionId,
      message: 'Download tracked successfully'
    });

  } catch (error) {
    console.error('❌ Download tracking failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to track download' 
    });
  }
});

// Download completion tracking
router.post('/log-download-complete', async (req, res) => {
  try {
    const {
      email,
      productId,
      licenseKey,
      fileName,
      sessionId,
      timestamp,
      success,
      duration
    } = req.body;

    const clientIP = req.ip || req.connection.remoteAddress;

    // Log completion
    await logLicenseActivity(
      email,
      licenseKey || 'UNKNOWN',
      productId,
      success ? 'DOWNLOAD_COMPLETED' : 'DOWNLOAD_FAILED',
      {
        fileName,
        sessionId,
        duration,
        ip: clientIP,
        success
      }
    );

    // Update license usage if successful
    if (success && licenseKey) {
      try {
        await updateLicenseUsage(licenseKey);
      } catch (error) {
        console.error('Failed to update license usage:', error);
      }
    }

    // Detailed completion log
    const completionEntry = {
      timestamp: timestamp || new Date().toISOString(),
      action: success ? 'DOWNLOAD_COMPLETED' : 'DOWNLOAD_FAILED',
      email,
      productId,
      licenseKey,
      fileName,
      sessionId,
      duration,
      success,
      clientIP
    };

    await fs.appendFile(
      './logs/downloads/completions.jsonl',
      JSON.stringify(completionEntry) + '\n'
    );

    console.log(`✅ Download ${success ? 'completed' : 'failed'}: ${email} - ${productId}`);
    
    res.json({ success: true });

  } catch (error) {
    console.error('❌ Download completion tracking failed:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to track download completion' 
    });
  }
});

// Download error tracking
router.post('/log-download-error', async (req, res) => {
  try {
    const {
      email,
      productId,
      licenseKey,
      fileName,
      sessionId,
      timestamp,
      error
    } = req.body;

    const clientIP = req.ip || req.connection.remoteAddress;

    // Log error
    await logLicenseActivity(
      email,
      licenseKey || 'UNKNOWN',
      productId,
      'DOWNLOAD_ERROR',
      {
        fileName,
        sessionId,
        error: error?.substring(0, 500), // Truncate long errors
        ip: clientIP
      }
    );

    // Security event for repeated errors
    await logSecurityEvent('download_error', {
      email,
      productId,
      licenseKey,
      error,
      ip: clientIP,
      severity: 'LOW'
    });

    console.log(`❌ Download error: ${email} - ${productId} - ${error}`);
    
    res.json({ success: true });

  } catch (trackingError) {
    console.error('❌ Download error tracking failed:', trackingError);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to track download error' 
    });
  }
});

// License validation endpoint
router.get('/validate-license/:licenseKey', async (req, res) => {
  try {
    const { licenseKey } = req.params;
    const clientIP = req.ip || req.connection.remoteAddress;

    // Get license from database
    const license = await getLicense(licenseKey);

    if (!license) {
      await logSecurityEvent('license_validation_failed', {
        licenseKey,
        ip: clientIP,
        reason: 'not_found',
        severity: 'MEDIUM'
      });

      return res.status(404).json({
        valid: false,
        error: 'License not found'
      });
    }

    // Check license status and expiry
    const isValid = license.status === 'active' && 
                   (!license.expiresAt || new Date(license.expiresAt) > new Date());

    // Log validation attempt
    await logLicenseActivity(
      license.customerEmail,
      licenseKey,
      license.productId,
      'LICENSE_VALIDATED',
      {
        valid: isValid,
        ip: clientIP,
        userAgent: req.headers['user-agent']?.substring(0, 200)
      }
    );

    const response = {
      valid: isValid,
      license: {
        productName: license.productName,
        licenseType: license.licenseType,
        issuedAt: license.issuedAt,
        expiresAt: license.expiresAt,
        usageCount: license.usageCount || 0,
        status: license.status
      }
    };

    if (!isValid) {
      response.reason = license.status !== 'active' ? 'inactive' : 'expired';
    }

    res.json(response);

  } catch (error) {
    console.error('❌ License validation error:', error);
    res.status(500).json({
      valid: false,
      error: 'Validation failed'
    });
  }
});

// Page view tracking
router.post('/log-page-view', async (req, res) => {
  try {
    const {
      page,
      timestamp,
      sessionId,
      referrer
    } = req.body;

    const clientIP = req.ip || req.connection.remoteAddress;

    const pageViewEntry = {
      timestamp: timestamp || new Date().toISOString(),
      action: 'PAGE_VIEW',
      page,
      sessionId,
      referrer,
      clientIP,
      userAgent: req.headers['user-agent']
    };

    await fs.appendFile(
      './logs/downloads/page-views.jsonl',
      JSON.stringify(pageViewEntry) + '\n'
    );

    res.json({ success: true });

  } catch (error) {
    console.error('❌ Page view tracking failed:', error);
    res.status(500).json({ success: false });
  }
});

// Download analytics endpoint (admin only)
router.get('/download-analytics', async (req, res) => {
  try {
    // Simple admin authentication
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { days = 7 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    // Read download logs
    const logsPath = './logs/downloads/simple.csv';
    
    try {
      const logData = await fs.readFile(logsPath, 'utf8');
      const lines = logData.trim().split('\n');
      
      const analytics = {
        totalDownloads: 0,
        uniqueUsers: new Set(),
        productBreakdown: {},
        dailyDownloads: {},
        topFiles: {},
        recentDownloads: []
      };

      lines.forEach(line => {
        const [timestamp, email, productId, licenseKey, fileName, ip] = line.split(',').map(s => s.replace(/"/g, ''));
        const downloadDate = new Date(timestamp);

        if (downloadDate >= cutoffDate) {
          analytics.totalDownloads++;
          analytics.uniqueUsers.add(email);
          
          // Product breakdown
          analytics.productBreakdown[productId] = (analytics.productBreakdown[productId] || 0) + 1;
          
          // Daily downloads
          const dayKey = downloadDate.toISOString().split('T')[0];
          analytics.dailyDownloads[dayKey] = (analytics.dailyDownloads[dayKey] || 0) + 1;
          
          // Top files
          if (fileName) {
            analytics.topFiles[fileName] = (analytics.topFiles[fileName] || 0) + 1;
          }
          
          // Recent downloads
          if (analytics.recentDownloads.length < 20) {
            analytics.recentDownloads.push({
              timestamp,
              email,
              productId,
              fileName,
              ip
            });
          }
        }
      });

      analytics.uniqueUsers = analytics.uniqueUsers.size;

      res.json(analytics);

    } catch (fileError) {
      res.json({
        totalDownloads: 0,
        uniqueUsers: 0,
        productBreakdown: {},
        dailyDownloads: {},
        topFiles: {},
        recentDownloads: [],
        note: 'No download data available yet'
      });
    }

  } catch (error) {
    console.error('❌ Download analytics error:', error);
    res.status(500).json({ error: 'Analytics unavailable' });
  }
});

// Initialize logs directory on startup
ensureLogsDir();

module.exports = router;