# Production Deployment Guide

## Overview
This document provides a comprehensive guide for deploying the Elevate for Humanity ecosystem to production.

## Prerequisites

### System Requirements
- Node.js 20.0.0 or higher
- NPM 10.0.0 or higher
- PostgreSQL 13+ (optional - system can run with in-memory storage)
- SSL certificate for HTTPS

### Security Requirements
- Secure JWT secret (minimum 32 characters)
- HTTPS-only deployment
- Environment variable security
- Database connection encryption

## Pre-Deployment Checklist

### 1. Environment Configuration
Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

**Required Variables:**
- `NODE_ENV=production`
- `JWT_SECRET=` (generate secure 32+ character string)
- `PORT=5000` (or your preferred port)

**Optional Variables:**
- `DATABASE_URL=` (PostgreSQL connection string)
- `STRIPE_SECRET_KEY=` (for payment processing)
- `LOG_LEVEL=info` (error, warn, info, debug, trace)

### 2. Dependency Installation
```bash
npm ci --only=production
```

### 3. Security Validation
```bash
npm run security:check
npm run production:validate
```

### 4. Test Suite Verification
```bash
npm test
```

## Deployment Steps

### 1. Server Deployment
The main server file is `simple-server.cjs` which includes:

**Security Features:**
- ✅ Helmet security headers
- ✅ Rate limiting (120 req/min per IP)
- ✅ Request compression
- ✅ Structured logging with Pino
- ✅ Request ID tracking
- ✅ Centralized error handling

**API Endpoints:**
- Health checks: `/health`, `/api/healthz`
- Federal compliance: `/api/compliance/*`
- LMS functionality: `/api/lms/*`
- Payment processing: `/api/stripe/*`
- Sister sites integration: `/api/sister-sites`

### 2. Process Management
Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start simple-server.cjs --name "efh-api"
pm2 startup
pm2 save
```

### 3. Reverse Proxy (Nginx)
Example Nginx configuration:

```nginx
server {
    listen 443 ssl http2;
    server_name api.elevateforhumanity.org;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Production Validation

### Automated Checks
```bash
npm run production:validate
```

### Manual Verification
1. **Health Check**: `curl https://yourdomain.com/health`
2. **Security Headers**: `curl -I https://yourdomain.com/health`
3. **API Functionality**: Test key endpoints
4. **Performance**: Monitor response times
5. **Logs**: Check structured logging output

### Expected Health Response
```json
{
  "status": "ok",
  "port": 5000,
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## Monitoring & Maintenance

### Log Monitoring
Logs are structured JSON with Pino:
- Request logs include request ID, method, URL, response time
- Error logs include stack traces and context
- Log levels: error, warn, info (configurable)

### Performance Monitoring
- Monitor `/api/healthz` for service status
- Track response times (should be < 500ms)
- Monitor rate limiting effectiveness
- Database connection health (if applicable)

### Security Monitoring
- Regular security audits: `npm audit`
- Monitor for failed authentication attempts
- Track unusual request patterns
- SSL certificate expiration monitoring

## Scaling Considerations

### Horizontal Scaling
- The server is stateless and can be load-balanced
- Use a shared session store if authentication is implemented
- Database connection pooling for multiple instances

### Performance Optimization
- Enable gzip compression (already configured)
- Use CDN for static assets
- Database query optimization
- Caching layer (Redis) for frequently accessed data

## Troubleshooting

### Common Issues
1. **Port binding errors**: Check if port is available
2. **Environment variables**: Verify all required vars are set
3. **Database connection**: Check DATABASE_URL format
4. **SSL certificates**: Verify certificate validity

### Debug Mode
```bash
LOG_LEVEL=debug npm start
```

### Health Check Failures
Check logs for specific error messages:
```bash
pm2 logs efh-api
```

## Security Best Practices

### Environment Security
- Never commit `.env` files
- Use secure password generation for JWT_SECRET
- Rotate secrets regularly
- Use environment variable injection in CI/CD

### Network Security
- HTTPS only (no HTTP redirects)
- Rate limiting configured
- CORS properly configured for known domains
- Security headers enforced

### Application Security
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)
- XSS protection via Content Security Policy
- Regular dependency updates

## Support

### Production Support Contacts
- Technical Issues: [Technical Support Email]
- Security Issues: [Security Team Email]
- Emergency Contact: [Emergency Contact]

### Documentation
- API Documentation: `/api/integration-guide`
- Federal Compliance: `/api/compliance`
- Status Page: `/health`

---

**Last Updated:** September 2025  
**Version:** 1.0.0  
**Deployment Target:** Production Environment