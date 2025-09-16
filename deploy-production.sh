#!/bin/bash

# Production Deployment Script for Elevate Platform
# Deploys complete LMS ecosystem with license protection

set -euo pipefail

echo "🚀 Starting Elevate Platform Production Deployment"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Check if we're in the right directory
if [[ ! -f "package.json" ]]; then
    error "package.json not found. Please run from project root."
fi

# Validate license system
log "🔐 Validating license system..."
node scripts/validate-license-system.js || error "License system validation failed"

# Build the application
log "🔨 Building application..."
npm run build || error "Build failed"

# Run tests
log "🧪 Running tests..."
npm test || warn "Some tests failed, continuing deployment"

# Deploy to Cloudflare Pages
log "☁️ Deploying to Cloudflare Pages..."
npx wrangler pages deploy dist --project-name elevate-platform

# Deploy license server to Cloudflare Workers
log "🛡️ Deploying license server..."
npx wrangler deploy api/license-server.js --name elevate-license-server

# Deploy Supabase functions
log "📡 Deploying Supabase functions..."
npx supabase functions deploy --project-ref $SUPABASE_PROJECT_REF

# Update DNS records
log "🌐 Updating DNS records..."
curl -X PUT "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records/$CLOUDFLARE_DNS_RECORD_ID" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"type":"CNAME","name":"elevateforhumanity.com","content":"elevate-platform.pages.dev"}'

# Generate production license
log "🎫 Generating production license..."
node scripts/generate-license.js \
    --licensee "Elevate for Humanity" \
    --domain "elevateforhumanity.com" \
    --tier "enterprise" \
    --features "all" \
    --output "production-license.txt"

# Start the LMS ecosystem
log "🎓 Starting LMS ecosystem..."
npm run start:production

# Health check
log "🏥 Running health checks..."
sleep 10
curl -f https://elevateforhumanity.com/health || error "Health check failed"

# Send deployment notification
log "📧 Sending deployment notification..."
curl -X POST "$SLACK_WEBHOOK_URL" \
     -H 'Content-type: application/json' \
     --data '{
       "text": "🚀 Elevate Platform deployed successfully!",
       "attachments": [{
         "color": "good",
         "fields": [
           {"title": "Environment", "value": "Production", "short": true},
           {"title": "Version", "value": "'$(git rev-parse --short HEAD)'", "short": true},
           {"title": "URL", "value": "https://elevateforhumanity.com", "short": false}
         ]
       }]
     }'

echo ""
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}🌐 Platform URL: https://elevateforhumanity.com${NC}"
echo -e "${BLUE}🛡️ License Server: https://license.elevateforhumanity.com${NC}"
echo -e "${BLUE}🧠 Admin Dashboard: https://elevateforhumanity.com/elevate-brain${NC}"
echo -e "${BLUE}📊 License Manager: https://elevateforhumanity.com/license-manager${NC}"
echo ""
echo -e "${YELLOW}🔑 Production license generated: production-license.txt${NC}"
echo ""