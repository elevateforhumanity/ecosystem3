// Shared configuration for EFH microservices ecosystem

// Service Registry - Define all microservices and their configurations
const SERVICES = {
  'api-gateway': {
    name: 'API Gateway',
    port: process.env.GATEWAY_PORT || 5000,
    path: '/gateway',
    healthCheck: '/health'
  },
  'hub': {
    name: 'Hub Service',
    port: process.env.HUB_PORT || 5001,
    path: '/hub',
    healthCheck: '/health',
    description: 'Main landing page and navigation'
  },
  'programs': {
    name: 'Programs Service', 
    port: process.env.PROGRAMS_PORT || 5002,
    path: '/programs',
    healthCheck: '/health',
    description: 'Program catalog and enrollment management'
  },
  'lms': {
    name: 'LMS Service',
    port: process.env.LMS_PORT || 5003,
    path: '/lms',
    healthCheck: '/health', 
    description: 'Learning management and content delivery'
  },
  'connect': {
    name: 'Connect Service',
    port: process.env.CONNECT_PORT || 5004,
    path: '/connect',
    healthCheck: '/health',
    description: 'Community features and social networking'
  },
  'pay': {
    name: 'Payment Service',
    port: process.env.PAY_PORT || 5005,
    path: '/pay',
    healthCheck: '/health',
    description: 'Payment processing and financial transactions'
  },
  'compliance': {
    name: 'Compliance Service',
    port: process.env.COMPLIANCE_PORT || 5006,
    path: '/compliance',
    healthCheck: '/health',
    description: 'Federal DOL/DWD compliance and reporting'
  }
};

// Environment Configuration
const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  JWT_SECRET: process.env.JWT_SECRET || 'efh-microservices-secret'
};

// Service Discovery
function getServiceUrl(serviceName, path = '') {
  const service = SERVICES[serviceName];
  if (!service) {
    throw new Error(`Service '${serviceName}' not found in registry`);
  }
  
  // In production, use environment-specific URLs
  const baseUrl = ENV.NODE_ENV === 'production' 
    ? `https://${serviceName}.elevateforhumanity.com`
    : `http://localhost:${service.port}`;
    
  return `${baseUrl}${path}`;
}

// Cross-service communication headers
function getServiceHeaders(fromService = 'unknown') {
  return {
    'Content-Type': 'application/json',
    'X-Service-Source': fromService,
    'X-Timestamp': new Date().toISOString(),
    'X-Request-ID': generateRequestId()
  };
}

// Generate unique request ID for tracing
function generateRequestId() {
  return `efh-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Shared error handling
class ServiceError extends Error {
  constructor(message, code = 500, service = 'unknown') {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.service = service;
    this.timestamp = new Date().toISOString();
  }
}

// Export configuration
module.exports = {
  SERVICES,
  ENV,
  getServiceUrl,
  getServiceHeaders,
  generateRequestId,
  ServiceError
};