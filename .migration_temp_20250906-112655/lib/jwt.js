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


import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'efh-default-secret-change-in-production'

export function signToken(payload, expiresIn = '24h') {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn })
  } catch (error) {
    console.error('JWT sign error:', error)
    throw new Error('Token generation failed')
  }
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error('JWT verify error:', error)
    throw new Error('Invalid token')
  }
}

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please provide a valid authorization token'
      })
    }

    const token = authHeader.substring(7)
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token missing',
        message: 'Authorization token is required'
      })
    }

    const decoded = verifyToken(token)
    req.user = decoded
    next()
    
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ 
      error: 'Authentication failed',
      message: 'Invalid or expired token'
    })
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          error: 'Authentication required',
          message: 'User not authenticated'
        })
      }

      if (req.user.role !== role && req.user.role !== 'ADMIN') {
        return res.status(403).json({ 
          error: 'Insufficient permissions',
          message: `Role ${role} required`
        })
      }

      next()
    } catch (error) {
      console.error('Role check error:', error)
      return res.status(500).json({ 
        error: 'Authorization check failed',
        message: 'Internal server error'
      })
    }
  }
}

export function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      if (token) {
        try {
          const decoded = verifyToken(token)
          req.user = decoded
        } catch (error) {
          // Optional auth - don't fail on invalid token
          console.warn('Optional auth failed:', error.message)
        }
      }
    }
    
    next()
  } catch (error) {
    // Optional auth - continue even on error
    console.warn('Optional auth error:', error)
    next()
  }
}
