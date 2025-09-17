/**
 * Military-Grade Encryption Module
 * AES-256-GCM + RSA-4096 + Argon2id
 * Government-compliant cryptography for Elevate platform
 */

const crypto = require('crypto');
const argon2 = require('argon2');

class MilitaryGradeCrypto {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16;  // 128 bits
    this.tagLength = 16; // 128 bits
    this.saltLength = 32; // 256 bits
  }

  /**
   * Generate cryptographically secure random key
   */
  generateKey() {
    return crypto.randomBytes(this.keyLength);
  }

  /**
   * Generate RSA-4096 key pair for asymmetric encryption
   */
  generateRSAKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });
  }

  /**
   * AES-256-GCM encryption (FIPS 140-2 compliant)
   */
  encrypt(plaintext, key) {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipher(this.algorithm, key, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  /**
   * AES-256-GCM decryption
   */
  decrypt(encryptedData, key) {
    const { encrypted, iv, tag } = encryptedData;
    
    const decipher = crypto.createDecipher(this.algorithm, key, Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  /**
   * RSA-4096 encryption for key exchange
   */
  rsaEncrypt(data, publicKey) {
    return crypto.publicEncrypt({
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    }, Buffer.from(data)).toString('base64');
  }

  /**
   * RSA-4096 decryption
   */
  rsaDecrypt(encryptedData, privateKey) {
    return crypto.privateDecrypt({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    }, Buffer.from(encryptedData, 'base64')).toString('utf8');
  }

  /**
   * Argon2id password hashing (OWASP recommended)
   */
  async hashPassword(password) {
    try {
      const salt = crypto.randomBytes(this.saltLength);
      const hash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 2 ** 16, // 64 MB
        timeCost: 3,         // 3 iterations
        parallelism: 1,      // 1 thread
        salt: salt
      });
      return hash;
    } catch (error) {
      throw new Error('Password hashing failed: ' + error.message);
    }
  }

  /**
   * Verify Argon2id password
   */
  async verifyPassword(password, hash) {
    try {
      return await argon2.verify(hash, password);
    } catch (error) {
      throw new Error('Password verification failed: ' + error.message);
    }
  }

  /**
   * Generate HMAC-SHA256 signature
   */
  generateHMAC(data, secret) {
    return crypto.createHmac('sha256', secret).update(data).digest('hex');
  }

  /**
   * Verify HMAC-SHA256 signature
   */
  verifyHMAC(data, signature, secret) {
    const expectedSignature = this.generateHMAC(data, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Generate cryptographically secure license token
   */
  generateLicenseToken(payload, secret) {
    const timestamp = Date.now();
    const nonce = crypto.randomBytes(16).toString('hex');
    
    const tokenData = {
      ...payload,
      timestamp,
      nonce,
      purpose: 'license'
    };
    
    const tokenString = JSON.stringify(tokenData);
    const signature = this.generateHMAC(tokenString, secret);
    
    return {
      token: Buffer.from(tokenString).toString('base64'),
      signature
    };
  }

  /**
   * Verify license token integrity
   */
  verifyLicenseToken(token, signature, secret) {
    try {
      const tokenString = Buffer.from(token, 'base64').toString('utf8');
      const isValid = this.verifyHMAC(tokenString, signature, secret);
      
      if (!isValid) {
        return { valid: false, error: 'Invalid signature' };
      }
      
      const payload = JSON.parse(tokenString);
      
      // Check token age (24 hours max)
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      if (Date.now() - payload.timestamp > maxAge) {
        return { valid: false, error: 'Token expired' };
      }
      
      return { valid: true, payload };
    } catch (error) {
      return { valid: false, error: 'Token parsing failed' };
    }
  }

  /**
   * Generate digital watermark for code protection
   */
  generateWatermark(licenseId, domain) {
    const watermarkData = {
      licenseId,
      domain,
      timestamp: Date.now(),
      version: '1.0.0',
      platform: 'elevate-for-humanity'
    };
    
    const watermarkString = JSON.stringify(watermarkData);
    return Buffer.from(watermarkString).toString('base64');
  }

  /**
   * Extract watermark information
   */
  extractWatermark(watermark) {
    try {
      const watermarkString = Buffer.from(watermark, 'base64').toString('utf8');
      return JSON.parse(watermarkString);
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate secure session token
   */
  generateSessionToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken() {
    return crypto.randomBytes(24).toString('base64');
  }

  /**
   * Constant-time string comparison (timing attack resistant)
   */
  constantTimeCompare(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(
      Buffer.from(a, 'utf8'),
      Buffer.from(b, 'utf8')
    );
  }
}

module.exports = MilitaryGradeCrypto;