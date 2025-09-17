/**
 * Digital Watermark & Tracking Beacon System
 * Invisible protection and unauthorized use detection
 * Government-grade tracking for Elevate platform
 */

class TrackingBeacon {
  constructor(config = {}) {
    this.licenseId = config.licenseId || 'UNLICENSED';
    this.domain = config.domain || window?.location?.hostname || 'unknown';
    this.trackingUrl = config.trackingUrl || 'https://license.elevateforhumanity.com/api/track';
    this.interval = config.interval || 5 * 60 * 1000; // 5 minutes
    this.enabled = config.enabled !== false;
    this.stealth = config.stealth !== false;
    
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.pageViews = 0;
    this.interactions = 0;
    
    if (this.enabled) {
      this.init();
    }
  }

  /**
   * Initialize tracking system
   */
  init() {
    this.embedWatermarks();
    this.startTracking();
    this.bindEventListeners();
    this.sendInitialPing();
  }

  /**
   * Embed invisible watermarks throughout the page
   */
  embedWatermarks() {
    // HTML comment watermark
    const comment = document.createComment(
      `Licensed to: ${this.domain} | License: ${this.licenseId} | Timestamp: ${Date.now()}`
    );
    document.head.appendChild(comment);

    // Meta tag watermark
    const meta = document.createElement('meta');
    meta.name = 'license-watermark';
    meta.content = this.generateWatermarkHash();
    meta.style.display = 'none';
    document.head.appendChild(meta);

    // Hidden div watermark
    const hiddenDiv = document.createElement('div');
    hiddenDiv.id = 'license-watermark';
    hiddenDiv.style.cssText = 'display:none!important;visibility:hidden!important;position:absolute!important;left:-9999px!important;';
    hiddenDiv.setAttribute('data-license', this.licenseId);
    hiddenDiv.setAttribute('data-domain', this.domain);
    hiddenDiv.setAttribute('data-timestamp', Date.now());
    hiddenDiv.innerHTML = `<!-- Elevate for Humanity Platform | Licensed Use Only -->`;
    document.body.appendChild(hiddenDiv);

    // CSS watermark
    const style = document.createElement('style');
    style.textContent = `
      /* Licensed to: ${this.domain} | License: ${this.licenseId} */
      body::before { content: ""; }
    `;
    document.head.appendChild(style);

    // Console watermark (if not in stealth mode)
    if (!this.stealth) {
      console.log(`
🛡️  ELEVATE FOR HUMANITY PLATFORM
Licensed to: ${this.domain}
License ID: ${this.licenseId}
Session: ${this.sessionId}

⚠️  UNAUTHORIZED USE PROHIBITED
This software is protected by copyright law and licensing agreements.
Unauthorized use, copying, or redistribution will result in legal action.

Contact: legal@elevateforhumanity.com
      `);
    }
  }

  /**
   * Generate unique watermark hash
   */
  generateWatermarkHash() {
    const data = `${this.licenseId}:${this.domain}:${Date.now()}:elevate-platform`;
    return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 16) + '_' + Date.now();
  }

  /**
   * Start periodic tracking
   */
  startTracking() {
    // Send tracking ping immediately
    this.sendTrackingPing();
    
    // Set up periodic pings
    this.trackingInterval = setInterval(() => {
      this.sendTrackingPing();
    }, this.interval);

    // Send ping when page is about to unload
    window.addEventListener('beforeunload', () => {
      this.sendTrackingPing(true);
    });

    // Send ping when page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.sendTrackingPing();
      }
    });
  }

  /**
   * Bind event listeners for interaction tracking
   */
  bindEventListeners() {
    // Track page views
    this.pageViews++;

    // Track user interactions
    ['click', 'keydown', 'scroll', 'mousemove'].forEach(event => {
      document.addEventListener(event, () => {
        this.interactions++;
      }, { passive: true, once: false });
    });

    // Track navigation
    window.addEventListener('popstate', () => {
      this.pageViews++;
      this.sendTrackingPing();
    });
  }

  /**
   * Send initial ping with system information
   */
  async sendInitialPing() {
    const systemInfo = this.collectSystemInfo();
    await this.sendPing({
      type: 'init',
      system: systemInfo,
      timestamp: Date.now()
    });
  }

  /**
   * Send tracking ping to server
   */
  async sendTrackingPing(isUnload = false) {
    const pingData = {
      type: isUnload ? 'unload' : 'ping',
      licenseId: this.licenseId,
      domain: this.domain,
      sessionId: this.sessionId,
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionDuration: Date.now() - this.startTime,
      pageViews: this.pageViews,
      interactions: this.interactions,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      }
    };

    await this.sendPing(pingData, isUnload);
  }

  /**
   * Collect system information for fingerprinting
   */
  collectSystemInfo() {
    return {
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency,
      maxTouchPoints: navigator.maxTouchPoints,
      screen: {
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth
      },
      window: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      webgl: this.getWebGLInfo(),
      canvas: this.getCanvasFingerprint()
    };
  }

  /**
   * Get WebGL information for fingerprinting
   */
  getWebGLInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return null;
      
      return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
      };
    } catch (e) {
      return null;
    }
  }

  /**
   * Generate canvas fingerprint
   */
  getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Elevate Platform Fingerprint', 2, 2);
      
      return canvas.toDataURL().substring(0, 50);
    } catch (e) {
      return null;
    }
  }

  /**
   * Send ping to tracking server
   */
  async sendPing(data, isUnload = false) {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-License-ID': this.licenseId,
          'X-Domain': this.domain
        },
        body: JSON.stringify(data)
      };

      if (isUnload && navigator.sendBeacon) {
        // Use sendBeacon for unload events (more reliable)
        navigator.sendBeacon(this.trackingUrl, JSON.stringify(data));
      } else {
        // Use fetch for regular pings
        const response = await fetch(this.trackingUrl, options);
        
        if (!response.ok) {
          console.warn('Tracking ping failed:', response.status);
        }
      }
    } catch (error) {
      // Silently fail - don't break the application
      if (!this.stealth) {
        console.warn('Tracking error:', error);
      }
    }
  }

  /**
   * Detect if running in unauthorized environment
   */
  detectViolations() {
    const violations = [];

    // Check if domain matches license
    if (this.domain !== this.expectedDomain && this.expectedDomain) {
      violations.push({
        type: 'domain_mismatch',
        expected: this.expectedDomain,
        actual: this.domain
      });
    }

    // Check for developer tools
    if (this.isDevToolsOpen()) {
      violations.push({
        type: 'devtools_open',
        timestamp: Date.now()
      });
    }

    // Check for common scraping user agents
    const scrapingAgents = ['bot', 'crawler', 'spider', 'scraper', 'wget', 'curl'];
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (scrapingAgents.some(agent => userAgent.includes(agent))) {
      violations.push({
        type: 'suspicious_user_agent',
        userAgent: navigator.userAgent
      });
    }

    return violations;
  }

  /**
   * Detect if developer tools are open
   */
  isDevToolsOpen() {
    const threshold = 160;
    return window.outerHeight - window.innerHeight > threshold ||
           window.outerWidth - window.innerWidth > threshold;
  }

  /**
   * Stop tracking
   */
  stop() {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }
    this.enabled = false;
  }

  /**
   * Get tracking statistics
   */
  getStats() {
    return {
      sessionId: this.sessionId,
      sessionDuration: Date.now() - this.startTime,
      pageViews: this.pageViews,
      interactions: this.interactions,
      domain: this.domain,
      licenseId: this.licenseId
    };
  }
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  // Initialize with default config
  window.ElevateTracker = new TrackingBeacon({
    licenseId: window.ELEVATE_LICENSE_ID || 'DEMO-LICENSE',
    domain: window.location.hostname,
    enabled: true,
    stealth: false
  });
}

module.exports = TrackingBeacon;