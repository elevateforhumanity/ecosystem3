/**
 * License Protection System for Rise Foundation Ecosystem
 * Prevents unauthorized use, copying, and redistribution
 * 
 * Copyright (c) 2024 Selfish Inc. DBA Rise Foundation
 * Licensed Use Only - Unauthorized use prohibited
 */

class LicenseProtection {
  constructor() {
    this.licenseKey = process.env.LICENSE_KEY || 'UNLICENSED';
    this.licenseDomain = process.env.LICENSE_DOMAIN || 'localhost';
    this.licenseExpires = process.env.LICENSE_EXPIRES || '2024-12-31';
    this.licenseServerUrl = process.env.LICENSE_SERVER_URL || 'https://license.elevateforhumanity.com/api';
    this.enableChecks = process.env.ENABLE_LICENSE_CHECK === 'true';
    this.enableDomainLock = process.env.ENABLE_DOMAIN_LOCK === 'true';
    this.enableWatermark = process.env.ENABLE_WATERMARK === 'true';
    this.devMode = process.env.DEV_MODE === 'true';
    
    this.init();
  }

  init() {
    if (typeof window !== 'undefined' && this.enableChecks && !this.devMode) {
      this.validateLicense();
      this.embedWatermark();
      this.startMonitoring();
      this.checkDomainLock();
    }
  }

  async validateLicense() {
    try {
      const response = await fetch(`${this.licenseServerUrl}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-License-Key': this.licenseKey
        },
        body: JSON.stringify({
          domain: window.location.hostname,
          key: this.licenseKey,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        })
      });

      if (!response.ok) {
        this.handleLicenseViolation('Invalid license response');
        return false;
      }

      const result = await response.json();
      if (!result.valid) {
        this.handleLicenseViolation(result.reason || 'License validation failed');
        return false;
      }

      console.log(`✅ License validated for ${this.licenseDomain}`);
      return true;
    } catch (error) {
      console.warn('License validation failed:', error);
      // In production, you might want to be more strict here
      return false;
    }
  }

  checkDomainLock() {
    if (!this.enableDomainLock) return true;

    const currentDomain = window.location.hostname;
    const allowedDomains = [
      this.licenseDomain,
      process.env.KINGDOM_KONNECT_DOMAIN,
      process.env.URBAN_BUILD_CREW_DOMAIN,
      process.env.SERENE_COMFORT_CARE_DOMAIN,
      process.env.ELEVATE_BRAIN_DOMAIN,
      'localhost', // For development
      '127.0.0.1'  // For development
    ].filter(Boolean);

    if (!allowedDomains.some(domain => currentDomain.includes(domain))) {
      this.handleLicenseViolation(`Unauthorized domain: ${currentDomain}`);
      return false;
    }

    return true;
  }

  embedWatermark() {
    if (!this.enableWatermark) return;

    // Console watermark
    console.log(`
    🌟 Rise Foundation Ecosystem
    Licensed to: ${process.env.LICENSE_HOLDER || 'Licensed User'}
    Valid until: ${this.licenseExpires}
    License: ${this.licenseKey}
    
    ⚠️  PROPRIETARY SOFTWARE - UNAUTHORIZED USE PROHIBITED
    This software is protected by copyright law and licensing agreements.
    `);

    // HTML watermark (hidden)
    const watermark = document.createElement('div');
    watermark.style.display = 'none';
    watermark.setAttribute('data-license', this.licenseKey);
    watermark.setAttribute('data-domain', this.licenseDomain);
    watermark.setAttribute('data-expires', this.licenseExpires);
    watermark.innerHTML = `<!-- Licensed to ${process.env.LICENSE_HOLDER} | Rise Foundation Ecosystem | License: ${this.licenseKey} -->`;
    document.body.appendChild(watermark);

    // Meta tag watermark
    const meta = document.createElement('meta');
    meta.name = 'license-info';
    meta.content = `Licensed Use Only | Rise Foundation © 2024 | Key: ${this.licenseKey.slice(-8)}`;
    document.head.appendChild(meta);
  }

  startMonitoring() {
    // Send usage ping every 5 minutes
    setInterval(() => {
      this.sendUsagePing();
    }, 5 * 60 * 1000);

    // Send initial ping
    setTimeout(() => this.sendUsagePing(), 2000);
  }

  async sendUsagePing() {
    try {
      await fetch(`${this.licenseServerUrl}/usage-ping`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-License-Key': this.licenseKey
        },
        body: JSON.stringify({
          domain: window.location.hostname,
          path: window.location.pathname,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          screenResolution: `${screen.width}x${screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });
    } catch (error) {
      // Silently fail - don't break the app
      console.debug('Usage ping failed:', error);
    }
  }

  handleLicenseViolation(reason) {
    console.error('🚨 LICENSE VIOLATION DETECTED:', reason);
    
    // Send violation alert
    this.sendViolationAlert(reason);
    
    // Show license error page
    this.showLicenseError(reason);
  }

  async sendViolationAlert(reason) {
    try {
      await fetch(`${this.licenseServerUrl}/violation-alert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          domain: window.location.hostname,
          reason: reason,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          ip: await this.getClientIP(),
          referrer: document.referrer
        })
      });
    } catch (error) {
      console.error('Failed to send violation alert:', error);
    }
  }

  async getClientIP() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  showLicenseError(reason) {
    // Create license error overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: system-ui, sans-serif;
    `;

    overlay.innerHTML = `
      <div style="text-align: center; max-width: 600px; padding: 2rem;">
        <h1 style="color: #ef4444; margin-bottom: 1rem;">🚨 License Violation Detected</h1>
        <p style="margin-bottom: 1rem;">This software is licensed for authorized use only.</p>
        <p style="margin-bottom: 2rem; color: #fbbf24;">Reason: ${reason}</p>
        <p style="margin-bottom: 1rem;">For licensing inquiries, contact:</p>
        <p style="color: #60a5fa;">licensing@elevateforhumanity.com</p>
        <p style="margin-top: 2rem; font-size: 0.9rem; color: #9ca3af;">
          © 2024 Selfish Inc. DBA Rise Foundation. All Rights Reserved.
        </p>
      </div>
    `;

    document.body.appendChild(overlay);

    // Disable page functionality
    document.body.style.overflow = 'hidden';
    
    // Redirect after 10 seconds
    setTimeout(() => {
      window.location.href = 'https://elevateforhumanity.com/license-error';
    }, 10000);
  }

  // Static method to check license expiration
  static isLicenseExpired() {
    const expirationDate = new Date(process.env.LICENSE_EXPIRES || '2024-12-31');
    return new Date() > expirationDate;
  }

  // Static method to get license info
  static getLicenseInfo() {
    return {
      key: process.env.LICENSE_KEY?.slice(-8) || 'UNLICENSED',
      domain: process.env.LICENSE_DOMAIN || 'localhost',
      expires: process.env.LICENSE_EXPIRES || '2024-12-31',
      holder: process.env.LICENSE_HOLDER || 'Unlicensed User',
      type: process.env.LICENSE_TYPE || 'TRIAL'
    };
  }
}

// Auto-initialize in browser
if (typeof window !== 'undefined') {
  window.LicenseProtection = LicenseProtection;
  new LicenseProtection();
}

export default LicenseProtection;