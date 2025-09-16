# Production Deployment Guide

## Overview
This guide covers the deployment and production readiness setup for the Elevate for Humanity ecosystem.

## Prerequisites
- Node.js 20.x or higher
- PostgreSQL 15 or higher (optional - falls back to in-memory data)
- Environment variables configured

## Environment Variables

### Required
```bash
JWT_SECRET=your-strong-jwt-secret-minimum-16-characters
```

### Optional
```bash
DATABASE_URL=postgresql://username:password@host:port/database
STRIPE_SECRET_KEY=sk_live_your_stripe_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
NODE_ENV=production
LOG_LEVEL=info
```

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Database setup** (optional)
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   ```

4. **Build and start**
   ```bash
   npm run build
   npm start
   ```

## Production Features

### ✅ Unified Server Architecture
- Single `simple-server.cjs` consolidating all endpoints
- Graceful shutdown handling
- Request ID tracking and structured logging

### ✅ Federal Compliance
- DOE/DWD/DOL compliance endpoints
- WIOA eligibility validation
- PIRL reporting standards
- Federal cost principles (2 CFR 200)

### ✅ LMS Integration
- Prisma-based database layer with fallback to in-memory
- Course management endpoints
- Progress tracking
- Enrollment system ready

### ✅ Security & Performance
- Helmet.js security middleware
- Rate limiting (120 req/min per IP)
- Compression enabled
- CSRF protection
- Request logging with correlation IDs

### ✅ Health Monitoring
- `/health` - Basic health check
- `/api/healthz` - Comprehensive health aggregator
- Database connectivity status
- Service availability checks

### ✅ CI/CD Pipeline
- Automated testing on push
- TypeScript type checking
- ESLint code quality
- Security auditing
- Production build verification

## API Endpoints

### Core
- `GET /health` - Health check
- `GET /api/healthz` - Detailed health status

### Compliance
- `GET /api/compliance` - Compliance summary
- `GET /api/compliance/validate` - Validation checks

### LMS
- `GET /api/lms/courses` - List courses
- `GET /api/lms/courses/:id` - Get course details
- `GET /api/lms/courses/:id/lessons` - Get course lessons
- `POST /api/lms/progress` - Record progress

### Payments
- `GET /api/stripe/config` - Stripe configuration
- `POST /api/stripe/create-payment-intent` - Create payment

### Widgets
- `GET /api/widgets/hero-content` - Hero content widget
- `GET /api/widgets/program-carousel` - Program carousel widget
- `GET /api/widgets/integration.js` - Integration script

## Deployment Options

### Replit
Ready for Replit deployment with existing configuration.

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

### Vercel/Netlify
Use the provided `vercel.json` configuration.

### Traditional VPS
Use PM2 or similar process manager:
```bash
npm install -g pm2
pm2 start simple-server.cjs --name "efh-ecosystem"
```

## Database Management

### With PostgreSQL
The application automatically uses PostgreSQL when `DATABASE_URL` is provided.

### Without Database
Falls back to in-memory data storage - suitable for development and small deployments.

### Migrations
```bash
# Create new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Monitoring & Logs

### Health Checks
- Monitor `/api/healthz` for comprehensive status
- Database connectivity reported in health check
- Service uptime and checks included

### Logging
- Structured JSON logs via Pino
- Request correlation IDs
- Error levels: info, warn, error
- Configurable log level via `LOG_LEVEL`

## Security Considerations

### Headers
- CSP (Content Security Policy)
- HSTS (HTTP Strict Transport Security)
- X-Frame-Options
- X-Content-Type-Options

### Rate Limiting
- 120 requests per minute per IP
- Configurable per route

### Authentication
Ready for JWT-based authentication (JWT_SECRET required).

## Compliance Features

### WIOA Compliance
- Participant eligibility verification
- Individual Employment Plan (IEP) tracking
- Performance reporting standards

### Data Security
- PII handling protocols
- Secure data access controls
- Federal data security standards

### Financial Compliance
- Cost allocation tracking
- Federal cost principles adherence
- Audit trail maintenance

## Troubleshooting

### Common Issues
1. **Database connection fails**: Application falls back to in-memory mode
2. **Missing JWT_SECRET**: Application fails to start
3. **Prisma client errors**: Run `npx prisma generate`

### Debug Mode
```bash
LOG_LEVEL=debug npm start
```

### Health Check Verification
```bash
curl http://localhost:5000/api/healthz
```

Expected response includes service status and database connectivity.

## Support
For technical support and deployment assistance, refer to the repository documentation or create an issue on GitHub.