const fs = require('fs').promises;
const path = require('path');

// Ensure logs directory exists
async function ensureLogsDir() {
  try {
    await fs.mkdir('./logs', { recursive: true });
  } catch (error) {
    console.error('❌ Failed to create logs directory:', error);
  }
}

// Main license activity logger
async function logLicenseActivity(email, licenseKey, productId, action = 'ISSUED', metadata = {}) {
  try {
    await ensureLogsDir();
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      action,
      licenseKey,
      email,
      productId,
      metadata,
      ip: metadata.ip || 'unknown',
      userAgent: metadata.userAgent || 'unknown'
    };
    
    // Detailed JSON log
    const jsonLog = JSON.stringify(logEntry) + '\n';
    await fs.appendFile('./logs/licenses.jsonl', jsonLog);
    
    // Human-readable log
    const readableLog = `[${timestamp}] ${action}: ${licenseKey} → ${email} (${productId})\n`;
    await fs.appendFile('./logs/licenses.log', readableLog);
    
    // CSV for analytics
    const csvLog = `"${timestamp}","${action}","${licenseKey}","${email}","${productId}","${metadata.price || 0}"\n`;
    await fs.appendFile('./logs/licenses.csv', csvLog);
    
    console.log(`📜 Activity logged: ${action} - ${licenseKey}`);
  } catch (error) {
    console.error('❌ Logging failed:', error);
  }
}

// Security event logger
async function logSecurityEvent(event, details = {}) {
  try {
    await ensureLogsDir();
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      event,
      details,
      severity: details.severity || 'INFO'
    };
    
    const securityLog = JSON.stringify(logEntry) + '\n';
    await fs.appendFile('./logs/security.jsonl', securityLog);
    
    console.log(`🔒 Security event logged: ${event}`);
  } catch (error) {
    console.error('❌ Security logging failed:', error);
  }
}

// Performance logger
async function logPerformance(operation, duration, metadata = {}) {
  try {
    await ensureLogsDir();
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      operation,
      duration,
      metadata
    };
    
    const perfLog = JSON.stringify(logEntry) + '\n';
    await fs.appendFile('./logs/performance.jsonl', perfLog);
    
    if (duration > 1000) { // Log slow operations
      console.log(`⚠️ Slow operation: ${operation} took ${duration}ms`);
    }
  } catch (error) {
    console.error('❌ Performance logging failed:', error);
  }
}

// Error logger
async function logError(error, context = {}) {
  try {
    await ensureLogsDir();
    
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context
    };
    
    const errorLog = JSON.stringify(logEntry) + '\n';
    await fs.appendFile('./logs/errors.jsonl', errorLog);
    
    console.error(`💥 Error logged: ${error.message}`);
  } catch (logError) {
    console.error('❌ Error logging failed:', logError);
  }
}

// Analytics aggregator
async function getLogAnalytics(days = 7) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // Read CSV log for analytics
    const csvData = await fs.readFile('./logs/licenses.csv', 'utf8');
    const lines = csvData.trim().split('\n');
    
    const analytics = {
      totalEvents: 0,
      eventsByAction: {},
      eventsByDay: {},
      revenueByDay: {},
      topProducts: {},
      recentActivity: []
    };
    
    lines.forEach(line => {
      const [timestamp, action, licenseKey, email, productId, price] = line.split(',').map(s => s.replace(/"/g, ''));
      const eventDate = new Date(timestamp);
      
      if (eventDate >= cutoffDate) {
        analytics.totalEvents++;
        
        // Count by action
        analytics.eventsByAction[action] = (analytics.eventsByAction[action] || 0) + 1;
        
        // Count by day
        const dayKey = eventDate.toISOString().split('T')[0];
        analytics.eventsByDay[dayKey] = (analytics.eventsByDay[dayKey] || 0) + 1;
        
        // Revenue by day
        const priceNum = parseFloat(price) || 0;
        analytics.revenueByDay[dayKey] = (analytics.revenueByDay[dayKey] || 0) + priceNum;
        
        // Top products
        analytics.topProducts[productId] = (analytics.topProducts[productId] || 0) + 1;
        
        // Recent activity
        if (analytics.recentActivity.length < 20) {
          analytics.recentActivity.push({
            timestamp,
            action,
            licenseKey,
            email,
            productId,
            price: priceNum
          });
        }
      }
    });
    
    return analytics;
  } catch (error) {
    console.error('❌ Log analytics failed:', error);
    return {
      totalEvents: 0,
      eventsByAction: {},
      eventsByDay: {},
      revenueByDay: {},
      topProducts: {},
      recentActivity: []
    };
  }
}

// Log rotation (keep logs manageable)
async function rotateLogs() {
  try {
    const logFiles = ['licenses.log', 'licenses.jsonl', 'security.jsonl', 'performance.jsonl', 'errors.jsonl'];
    
    for (const logFile of logFiles) {
      const logPath = `./logs/${logFile}`;
      
      try {
        const stats = await fs.stat(logPath);
        const fileSizeMB = stats.size / (1024 * 1024);
        
        // Rotate if file is larger than 10MB
        if (fileSizeMB > 10) {
          const timestamp = new Date().toISOString().split('T')[0];
          const archivePath = `./logs/archive/${logFile}.${timestamp}`;
          
          await fs.mkdir('./logs/archive', { recursive: true });
          await fs.rename(logPath, archivePath);
          
          console.log(`📦 Log rotated: ${logFile} → archive/${logFile}.${timestamp}`);
        }
      } catch (error) {
        // File doesn't exist, skip
      }
    }
  } catch (error) {
    console.error('❌ Log rotation failed:', error);
  }
}

// Initialize CSV headers
async function initializeLogs() {
  try {
    await ensureLogsDir();
    
    // Check if CSV exists, if not create with headers
    try {
      await fs.access('./logs/licenses.csv');
    } catch {
      await fs.writeFile('./logs/licenses.csv', '"timestamp","action","licenseKey","email","productId","price"\n');
    }
    
    console.log('📝 Logging system initialized');
  } catch (error) {
    console.error('❌ Log initialization failed:', error);
  }
}

module.exports = {
  logLicenseActivity,
  logSecurityEvent,
  logPerformance,
  logError,
  getLogAnalytics,
  rotateLogs,
  initializeLogs
};