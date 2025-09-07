/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/


// EFH Copyright Protection System
const crypto = require('crypto');

class CopyrightProtection {
  constructor() {
    this.COPYRIGHT_NOTICE = `
      © 2025 Elevate for Humanity. All Rights Reserved.
      
      This software and associated documentation files (the "Software") are proprietary 
      and confidential to Elevate for Humanity. Unauthorized copying, distribution, 
      modification, or use of this Software is strictly prohibited.
      
      Licensed users may use this Software only in accordance with the terms 
      of their licensing agreement. Federal partnerships and ETPL approvals 
      are proprietary assets of Elevate for Humanity.
      
      For licensing inquiries: licensing@elevateforhumanity.org
    `;
    
    this.WATERMARK_HTML = `
      <div id="efh-copyright-protection" style="
        position: fixed; 
        bottom: 10px; 
        right: 10px; 
        background: rgba(0,0,0,0.8); 
        color: white; 
        padding: 8px 12px; 
        border-radius: 4px; 
        z-index: 9999; 
        font-size: 11px;
        font-family: monospace;
        pointer-events: none;
      ">
        © 2025 EFH - Licensed Code
      </div>
    `;
  }

  // Add copyright headers to all JavaScript files
  addCopyrightHeader(fileContent, filename) {
    const header = `/*
 * ${filename}
 * Copyright © 2025 Elevate for Humanity
 * All Rights Reserved - Proprietary Software
 * 
 * This file is part of the EFH Workforce Development Platform.
 * Unauthorized distribution is prohibited.
 * 
 * License: Commercial - Contact licensing@elevateforhumanity.org
 */\n\n`;
    
    // Only add if not already present
    if (!fileContent.includes('Copyright © 2025 Elevate for Humanity')) {
      return header + fileContent;
    }
    return fileContent;
  }

  // Add copyright notice to HTML pages
  addCopyrightToHTML(htmlContent) {
    // Add to head for metadata
    const headCopyright = `
    <!-- Copyright Notice -->
    <meta name="copyright" content="© 2025 Elevate for Humanity. All Rights Reserved.">
    <meta name="author" content="Elevate for Humanity">
    <meta name="robots" content="noarchive">
    `;

    // Add visible watermark before closing body
    const bodyWatermark = this.WATERMARK_HTML + '\n  </body>';

    let updatedHTML = htmlContent;
    
    // Add to head if not present
    if (!htmlContent.includes('name="copyright"')) {
      updatedHTML = updatedHTML.replace('</head>', headCopyright + '\n  </head>');
    }

    // Add watermark if not present
    if (!htmlContent.includes('efh-copyright-protection')) {
      updatedHTML = updatedHTML.replace('</body>', bodyWatermark);
    }

    return updatedHTML;
  }

  // Generate unique license key for installations
  generateLicenseKey(customerInfo) {
    const data = JSON.stringify({
      customer: customerInfo.email,
      domain: customerInfo.domain,
      issued: new Date().toISOString(),
      type: customerInfo.licenseType || 'standard'
    });
    
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return `EFH-${hash.substring(0, 16).toUpperCase()}`;
  }

  // Validate license key
  validateLicense(licenseKey, domain) {
    // In production, this would check against a database
    if (!licenseKey || !licenseKey.startsWith('EFH-')) {
      return {
        valid: false,
        message: 'Invalid license key format'
      };
    }

    // For demo purposes, allow specific test keys
    const validTestKeys = [
      'EFH-DEMO2025TEST',
      'EFH-TRIAL2025TEMP'
    ];

    if (validTestKeys.includes(licenseKey)) {
      return {
        valid: true,
        type: 'demo',
        restrictions: ['Limited features', 'Watermark required']
      };
    }

    return {
      valid: true,
      type: 'licensed',
      restrictions: []
    };
  }

  // Middleware to check license on protected routes
  requireValidLicense(req, res, next) {
    const licenseKey = req.headers['x-efh-license'] || req.query.license;
    const domain = req.get('host');

    const validation = this.validateLicense(licenseKey, domain);

    if (!validation.valid) {
      return res.status(403).json({
        error: 'Invalid License',
        message: 'This software requires a valid EFH license',
        contact: 'licensing@elevateforhumanity.org'
      });
    }

    req.license = validation;
    next();
  }

  // Anti-tampering protection
  protectSourceCode() {
    return `
    // EFH Anti-Tampering Protection
    (function() {
      'use strict';
      
      // Detect developer tools
      let devtools = {open: false};
      
      setInterval(function() {
        if (window.outerHeight - window.innerHeight > 200 || 
            window.outerWidth - window.innerWidth > 200) {
          if (!devtools.open) {
            devtools.open = true;
            console.clear();
            console.log('%c⚠️ EFH Copyright Protection Active', 
              'color: red; font-size: 20px; font-weight: bold;');
            console.log('%c© 2025 Elevate for Humanity - All Rights Reserved', 
              'color: orange; font-size: 14px;');
            console.log('%cUnauthorized code inspection is prohibited.', 
              'color: orange; font-size: 12px;');
          }
        }
      }, 500);

      // Disable right-click context menu
      document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
      });

      // Disable F12, Ctrl+Shift+I, Ctrl+U
      document.addEventListener('keydown', function(e) {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && e.key === 'I') ||
            (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
          return false;
        }
      });

      // Disable text selection on sensitive elements
      document.addEventListener('selectstart', function(e) {
        if (e.target.classList.contains('efh-protected')) {
          e.preventDefault();
          return false;
        }
      });
    })();
    `;
  }
}

module.exports = new CopyrightProtection();
