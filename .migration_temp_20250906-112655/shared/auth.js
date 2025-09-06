// Shared authentication utilities for EFH microservices
const jwt = require('jsonwebtoken');
const { ENV } = require('./config');
const db = require('./database');

class AuthManager {
  constructor() {
    this.jwtSecret = ENV.JWT_SECRET;
  }

  // Generate JWT token
  generateToken(payload, expiresIn = '24h') {
    return jwt.sign(payload, this.jwtSecret, { expiresIn });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Middleware for protecting routes
  requireAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'Please provide a valid authorization token'
        });
      }

      const token = authHeader.substring(7);
      const decoded = this.verifyToken(token);
      
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: error.message
      });
    }
  }

  // Create user session
  async createSession(userData) {
    try {
      // Check if user exists
      let user = await db.getUserByEmail(userData.email);
      
      // Create user if doesn't exist
      if (!user) {
        user = await db.createUser(userData);
      }

      // Generate token
      const token = this.generateToken({
        id: user.id,
        email: user.email,
        auth_id: user.auth_id
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        },
        token,
        expires_in: '24h'
      };
    } catch (error) {
      throw new Error(`Session creation failed: ${error.message}`);
    }
  }

  // Validate session
  async validateSession(token) {
    try {
      const decoded = this.verifyToken(token);
      const user = await db.getUserById(decoded.id);
      
      if (!user) {
        throw new Error('User not found');
      }

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        }
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Service-to-service authentication
  generateServiceToken(serviceName) {
    return this.generateToken({
      service: serviceName,
      type: 'service',
      timestamp: Date.now()
    }, '1h');
  }

  verifyServiceToken(token) {
    try {
      const decoded = this.verifyToken(token);
      if (decoded.type !== 'service') {
        throw new Error('Invalid service token');
      }
      return decoded;
    } catch (error) {
      throw new Error(`Service authentication failed: ${error.message}`);
    }
  }
}

// Create singleton instance
const auth = new AuthManager();

// Export middleware function
const requireAuth = auth.requireAuth.bind(auth);

module.exports = {
  auth,
  requireAuth
};