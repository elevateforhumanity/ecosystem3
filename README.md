## Environment Variables

Validated at build via `scripts/validate-env.js` (runs in `prebuild`). Required:

STRIPE_SECRET_KEY
STRIPE_SUCCESS_URL
STRIPE_CANCEL_URL
SUPABASE_URL
SUPABASE_SERVICE_KEY

Add them to your Vercel project settings or a local `.env` file (do not commit secrets).

# Deployment

## Docker
Build image:
```
docker build -t efh-app .
```
Run container:
```
docker run -p 5000:5000 --name efh efh-app
```
Health checks:
- http://localhost:5000/api/healthz
- http://localhost:5000/api/readiness

Metrics: http://localhost:5000/api/metrics

Autopilot status: http://localhost:5000/api/autopilot/status

Set environment variables as needed (examples):
```
PORT=5000
JWT_SECRET=replace_me
ADMIN_SECRET=admin_secret_here
AUTOPILOT_MAX_TASKS=800
```

## Production Notes
- Run behind reverse proxy (Nginx / Caddy) for TLS.
- Persist `autopilot-tasks.json` only if you need history between restarts (mount a volume).
- For Prisma with SQLite dev -> mount `prisma/dev.db` or migrate to Postgres for concurrency.

# Multi-Site Ecosystem Implementation

This project implements a complete multi-site ecosystem for Elevate for Humanity using Supabase for shared user memory.

## 🏗️ System Architecture

### Sister Sites
- **Hub (www)**: Main landing page with navigation and SEO
- **Programs (programs.)**: Program catalog, funding info, and application intake  
- **LMS (lms.)**: Learning content delivery and course management
- **Connect (connect.)**: Community features, events, and resources
- **Pay (pay.)**: Centralized payment processing using Node.js and Stripe
- **Memory Service**: Powered by Supabase (no custom server needed)

### Data Sharing
All sites share user data through Supabase:
- User authentication (magic links, OAuth)
- Profile information (name, phone, address)
- User preferences (email settings, locale, accessibility)
- Course enrollments with status tracking
- Payment history and Stripe integration

## 📂 File Structure

```
├── account.html                    # Full account management page
├── demo-site.html                  # Example sister site implementation
├── pay-backend-integration.js      # Stripe → Supabase integration
├── setup-guide.md                 # Step-by-step setup instructions
└── shared/
    ├── account-drawer.html         # Embeddable account widget
    ├── supabase.js                # Shared Supabase client
    └── enrollment.js              # Enrollment helper functions
```

## 🚀 Implementation Status

### ✅ Completed Components
- Database schema design with security policies
- Account management page (full-page version)
- Account drawer widget (embeddable version)
- Shared authentication and user session management
- Enrollment tracking and display functions
- Payment integration template for existing Pay service
- Demo site showing complete integration

### ⏳ Manual Setup Required
- Create Supabase project and apply database schema
- Configure Supabase Auth for all sister site domains
- Update credential placeholders with real Supabase values
- Integrate Supabase code into existing Pay backend
- Test cross-site authentication and enrollment flow

## 🔧 Key Features

### Account Drawer Widget
- Floating "Account" button on any page
- Slide-out drawer with sign-in and profile management
- Shows live enrollment status across all sites
- Mobile responsive with proper accessibility
- **NEW**: Funding & voucher collection for checkout metadata

### Enrollment System
- Reuses existing Pay backend with minimal changes
- Adds `program_slug` metadata to Stripe checkout
- Automatic enrollment activation after payment
- Status tracking: pending → active → completed
- **NEW**: Automatic funding metadata injection (voucher ID, case manager, funding source, coupons)

### Funding & Voucher Support
- Local storage persistence for guest users
- Supabase sync for authenticated users
- Automatic injection into all enrollment checkouts
- Case manager and voucher ID tracking
- Support for WIOA, ETPL, WRG, and other funding sources
- Funding details recorded in payment metadata and notes

#### How It Works
1. User fills out funding info in Account Drawer (voucher ID, case manager, funding source, coupon)
2. System saves locally and syncs to Supabase if signed in
3. When `efhEnroll()` is called, funding data is automatically attached to Stripe metadata
4. Payment backend receives funding info in webhook and stores in database notes
5. Funding details appear in Stripe dashboard for billing/authorization support

### Shared Authentication
- Magic link email authentication
- Session persistence across sister sites
- Automatic user record creation and syncing
- Secure access with Row Level Security

## 🎯 Business Benefits

- **Unified User Experience**: Users see consistent data across all sites
- **Simplified Management**: One source of truth for all user data
- **Scalable Architecture**: Supabase handles infrastructure and security
- **Easy Integration**: Drop-in widgets require minimal code changes
- **Cost Effective**: Uses existing Pay service with hosted Supabase

## 📱 User Journey

1. **Discovery**: User visits any sister site
2. **Sign In**: Magic link authentication (works across all sites)
3. **Browse**: View programs, courses, community content
4. **Enroll**: Click enrollment button → Stripe checkout
5. **Payment**: Complete payment through existing Pay service
6. **Activation**: Enrollment automatically activated across all sites
7. **Learning**: Access content based on enrollment status

The system ensures seamless experience as users move between different parts of the ecosystem.

## 🔍 Health & Monitoring
- Basic liveness: `/health`
- Aggregated: `/api/healthz` returns service statuses (api, lms, compliance, db) + uptime
- Request IDs returned in `X-Request-ID` header and error payloads

## 🛠️ Observability & Operations
| Aspect | Implementation | Usage |
|--------|----------------|-------|
| Logs | Pino JSON + daily file rotation (`logs/`) | `npm run logs:tail`, ship to central store |
| Log Retention | Compress/prune via `npm run logs:rotate` | Set `LOG_RETENTION_DAYS` (default 7) |
| Metrics | Prometheus text at `/metrics` | Add scrape job; view counters & memory |
| Errors | Optional Sentry (`SENTRY_DSN`) | Provide Sentry secrets + CI release step |
| Tracing | Optional OpenTelemetry (`ENABLE_OTEL=1`) | Set OTLP endpoint `OTEL_EXPORTER_OTLP_ENDPOINT` |
| Perf Budgets | Lighthouse + `budgets.json` enforced in CI | Tune thresholds as app scales |
| Bundle Size | `npm run size:check` (total + per-file) | Adjust `BUNDLE_BUDGET_KB`, `BUNDLE_SINGLE_MAX_KB` |
| Heartbeat | 30s structured log with mem + request delta | Search for `"msg":"heartbeat"` |

### Key Env Vars
```
SENTRY_DSN=
SENTRY_TRACES=0.1
ENABLE_OTEL=1
OTEL_EXPORTER_OTLP_ENDPOINT=https://otel-collector.example/v1/traces
OTEL_SERVICE_NAME=efh-app
LOG_RETENTION_DAYS=14
BUNDLE_BUDGET_KB=800
BUNDLE_SINGLE_MAX_KB=260
```

## 🧪 Testing & Quality Gates
- Vitest with coverage thresholds (lines >=70%)
- Run: `npm test`
- Env validation: `npm run env:check`

## 🔐 Security (Phase 1)
- Helmet, rate limiting, compression
- JWT secret required (placeholder currently) – replace in production
- No user auth flow yet (future phase) – LMS progress uses demo user fallback

## 📘 Compliance
See `COMPLIANCE.md` for current (stub) check catalog.

## 🗄️ Database
- Prisma + SQLite fallback (dev)
- Postgres upgrade path documented in `MIGRATIONS.md`

## 🛰️ Payments
- `/api/stripe/create-payment-intent` simulated unless `STRIPE_SECRET_KEY` set

## 🧭 LMS Endpoints
- `GET /api/lms/courses`
- `GET /api/lms/courses/:id`
- `GET /api/lms/courses/:id/lessons`
- `POST /api/lms/progress` (body: `{ lessonId, userId? }`)

## ✅ Production Readiness Checklist (Phase 1)
- [ ] Set real `JWT_SECRET`
- [ ] Provide `DATABASE_URL` (switch to Postgres)
- [ ] Run migrations (`npx prisma migrate deploy`)
- [ ] Configure Stripe secret (optional)
- [ ] Add proper auth layer & replace demo user
- [ ] Enable logging aggregation (e.g., Cloud provider)
- [ ] Review rate limit thresholds

## 🗺️ Roadmap (Phase 2+)
- Real compliance evidence linkage
- Auth sessions + refresh flow
- Metrics & tracing (OpenTelemetry)
- Frontend unification (SPA)
- Robust enrollment/payment domain logic

# Workspace (Plain Vite + TypeScript)

## Features
- Strict TypeScript
- ESLint + Prettier
- Vitest + coverage
- Environment validation (zod)
- API helper (fetch + timeout + error)
- Logging utility
- Size & production checks
- CI workflow + Dependabot

## Commands
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
npm run check:prod

## Release
Increment version in package.json then:
npm run release:tag

## Environment
Copy .env.example to .env (optional). Validate via:
npm run env:check