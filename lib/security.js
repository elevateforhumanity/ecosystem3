/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

const crypto = require('crypto');

// Simple base64 token (NOTE: replace with JWT or HMAC-signed token for production security)
const generateAPIToken = (email, role) => {
  const payload = { email, role, iat: Date.now() };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

const verifyAPIToken = (token) => {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload;
  } catch {
    throw new Error('Invalid token');
  }
};

const validateEmail = (email) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

module.exports = { generateAPIToken, verifyAPIToken, validateEmail };
