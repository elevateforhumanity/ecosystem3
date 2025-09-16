import React, { useEffect, useState } from 'react';
import LicenseProtection from '../lib/license-protection';

const LicenseProtectedApp = ({ children }) => {
  const [licenseValid, setLicenseValid] = useState(null);
  const [licenseInfo, setLicenseInfo] = useState(null);

  useEffect(() => {
    const protection = new LicenseProtection();
    
    // Get license info
    const info = LicenseProtection.getLicenseInfo();
    setLicenseInfo(info);

    // Check if license is expired
    if (LicenseProtection.isLicenseExpired()) {
      setLicenseValid(false);
      return;
    }

    // Validate license
    protection.validateLicense().then(valid => {
      setLicenseValid(valid);
    });

    // License check ping every 5 minutes
    const interval = setInterval(() => {
      fetch('/api/license-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: window.location.hostname,
          key: process.env.NEXT_PUBLIC_LICENSE_KEY
        })
      }).catch(err => console.warn('License ping failed:', err));
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Show loading while checking license
  if (licenseValid === null) {
    return (
      <div className="license-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Validating license...</p>
        </div>
        <style jsx>{`
          .license-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: #f9fafb;
          }
          .loading-spinner {
            text-align: center;
          }
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #e5e7eb;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Show license error if invalid
  if (licenseValid === false) {
    return (
      <div className="license-error">
        <div className="error-content">
          <h1>🚨 License Error</h1>
          <p>This software requires a valid license to operate.</p>
          <div className="license-details">
            <p><strong>License Key:</strong> {licenseInfo?.key || 'UNLICENSED'}</p>
            <p><strong>Domain:</strong> {licenseInfo?.domain || 'Unknown'}</p>
            <p><strong>Expires:</strong> {licenseInfo?.expires || 'Unknown'}</p>
          </div>
          <p>For licensing inquiries, contact:</p>
          <a href="mailto:licensing@elevateforhumanity.com">
            licensing@elevateforhumanity.com
          </a>
        </div>
        <style jsx>{`
          .license-error {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #1f2937, #374151);
            color: white;
            font-family: system-ui, sans-serif;
          }
          .error-content {
            text-align: center;
            max-width: 500px;
            padding: 2rem;
          }
          .error-content h1 {
            color: #ef4444;
            margin-bottom: 1rem;
            font-size: 2rem;
          }
          .license-details {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: left;
          }
          .license-details p {
            margin: 0.5rem 0;
            font-family: monospace;
          }
          a {
            color: #60a5fa;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  // Render app with license footer
  return (
    <div className="licensed-app">
      {children}
      <div className="license-footer">
        <p>
          Licensed to: {licenseInfo?.holder || 'Licensed User'} | 
          Valid until: {licenseInfo?.expires} | 
          © 2024 Rise Foundation
        </p>
        <style jsx>{`
          .license-footer {
            background: #1f2937;
            color: #9ca3af;
            text-align: center;
            padding: 0.5rem;
            font-size: 0.8rem;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 1000;
          }
          .license-footer p {
            margin: 0;
          }
        `}</style>
      </div>
    </div>
  );
};

export default LicenseProtectedApp;