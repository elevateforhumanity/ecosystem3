/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { randomUUID } from 'crypto';
import { loadEnv } from '../src/env.js';
import { logger } from '../src/logger.js';
import pinoHttp from 'pino-http';

// Import routers
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import enrollmentsRouter from './routes/enrollments.js';
import programsRouter from './routes/programs.js';
import lmsRouter from './routes/lms.js';
import complianceRouter from './routes/compliance.js';
import paymentsRouter from './routes/payments.js';
import brandingRouter from './routes/branding.js';
import widgetsRouter from './routes/widgets.js';
import navigationRouter from './routes/navigation.js';
import healthRouter from './routes/health.js';

// Load and validate environment
const env = loadEnv();

// Create Express app
const app = express();

// Trust proxy for accurate client IPs
app.set('trust proxy', true);
app.disable('x-powered-by');

// CORS whitelist function
const allowedOrigins = [
  'https://www.elevateforhumanity.org',
  'https://elevateforhumanity.org',
  'https://programs.elevateforhumanity.org',
  'https://lms.elevateforhumanity.org',
  'https://connect.elevateforhumanity.org',
  'https://pay.elevateforhumanity.org',
  'https://compliance.elevateforhumanity.org',
];

if (env.NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:3000', 'http://localhost:5000', 'http://localhost:5173');
}

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Request ID middleware
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] as string || randomUUID();
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  next();
});

// Security and performance middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

app.use(compression());
app.use(cors(corsOptions));

// Structured logging
app.use(pinoHttp({ logger }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting with proper trust proxy handling
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    type: 'RATE_LIMIT_ERROR',
    correlationId: '',
  },
  standardHeaders: true,
  legacyHeaders: false,
  trustProxy: env.NODE_ENV === 'production' ? 1 : false, // Only trust in production
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs for API endpoints
  message: {
    error: 'Too many API requests from this IP, please try again later.',
    type: 'RATE_LIMIT_ERROR',
    correlationId: '',
  },
  trustProxy: env.NODE_ENV === 'production' ? 1 : false, // Only trust in production
});

app.use(generalLimiter);
app.use('/api/', apiLimiter);

// Health check (no auth required)
app.use('/api/healthz', healthRouter);

// API routes with modular routers
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/enrollments', enrollmentsRouter);
app.use('/api/programs', programsRouter);
app.use('/api/lms', lmsRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/branding', brandingRouter);
app.use('/api/widgets', widgetsRouter);
app.use('/api/navigation', navigationRouter);

// Legacy API routes (maintain backward compatibility)
app.use('/api/stripe', paymentsRouter); // Alias for payments
app.use('/api/sister-sites', navigationRouter);

// Unified error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const correlationId = req.headers['x-request-id'] as string;
  
  logger.error({
    err,
    correlationId,
    url: req.url,
    method: req.method,
    ip: req.ip,
  }, 'Request error');

  // Classify error types
  let classification = 'internal';
  let status = 500;

  if (err.name === 'ValidationError') {
    classification = 'validation';
    status = 400;
  } else if (err.name === 'UnauthorizedError' || err.message.includes('Unauthorized')) {
    classification = 'auth';
    status = 401;
  } else if (err.name === 'NotFoundError' || err.status === 404) {
    classification = 'not_found';
    status = 404;
  }

  // Unified error envelope
  const errorResponse = {
    error: env.NODE_ENV === 'production' 
      ? (status === 500 ? 'Internal Server Error' : err.message)
      : err.message,
    type: classification.toUpperCase() + '_ERROR',
    correlationId,
    timestamp: new Date().toISOString(),
    ...(env.NODE_ENV !== 'production' && { stack: err.stack }),
  };

  res.status(status).json(errorResponse);
});

// 404 handler for unmatched routes - express standard approach
app.use((req: express.Request, res: express.Response) => {
  const correlationId = req.headers['x-request-id'] as string;
  res.status(404).json({
    error: 'Route not found',
    type: 'NOT_FOUND_ERROR',
    correlationId,
    timestamp: new Date().toISOString(),
  });
});

// Export app for testing
export default app;

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${env.NODE_ENV}`);
    logger.info(`🔒 CORS enabled for: ${allowedOrigins.join(', ')}`);
  });
}