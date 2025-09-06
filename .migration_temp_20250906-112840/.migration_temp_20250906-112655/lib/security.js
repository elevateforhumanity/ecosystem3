
<old_str>const crypto = require('crypto');

export const generateAPIToken = (email, role) => {
  const payload = { email, role, iat: Date.now() };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

export const verifyAPIToken = (token) => {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());
    return payload;
  } catch {
    throw new Error('Invalid token');
  }
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};</old_str>
<new_str>const crypto = require('crypto');

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

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

module.exports = { generateAPIToken, verifyAPIToken, validateEmail };</new_str>
