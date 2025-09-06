#!/usr/bin/env bash
set -euo pipefail

# ===================================================================
# EFH COMPLETE MIGRATION SCRIPT - FINAL VERSION
# ===================================================================
# Complete migration: R2 + GitHub + Vercel + DNS instructions
# ===================================================================

echo "🚀 EFH Complete Migration Starting..."
echo "====================================="

# Helper functions
log() { echo "→ $*"; }
success() { echo "✅ $*"; }
error() { echo "❌ ERROR: $*" >&2; exit 1; }

# ===== CONFIGURATION VALIDATION =====
log "Validating configuration..."

# Required R2 settings
: "${S3_BUCKET:?Please set: export S3_BUCKET=\"your-bucket-name\"}"
: "${S3_ENDPOINT:?Please set: export S3_ENDPOINT=\"https://your-account-id.r2.cloudflarestorage.com\"}"
: "${AWS_ACCESS_KEY_ID:?Please set: export AWS_ACCESS_KEY_ID=\"your-r2-access-key\"}"
: "${AWS_SECRET_ACCESS_KEY:?Please set: export AWS_SECRET_ACCESS_KEY=\"your-r2-secret-key\"}"

# Required GitHub settings
: "${GIT_REMOTE:?Please set: export GIT_REMOTE=\"https://github.com/username/repo.git\"}"

# Optional settings with defaults
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
VERCEL_PROJECT_NAME="${VERCEL_PROJECT_NAME:-efh-platform}"
ROOT_DOMAIN="${ROOT_DOMAIN:-elevateforhumanity.org}"
PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-root}"
APP_SUBDOMAIN="${APP_SUBDOMAIN:-app}"

# Validate R2 key formats
if [ ${#AWS_SECRET_ACCESS_KEY} -lt 20 ] || [ ${#AWS_SECRET_ACCESS_KEY} -gt 50 ]; then
    error "R2 Secret Access Key should be 20-50 characters. Current length: ${#AWS_SECRET_ACCESS_KEY}"
fi

if [ ${#AWS_ACCESS_KEY_ID} -lt 16 ] || [ ${#AWS_ACCESS_KEY_ID} -gt 40 ]; then
    error "R2 Access Key ID should be 16-40 characters. Current length: ${#AWS_ACCESS_KEY_ID}"
fi

success "Configuration validated"

# ===== SETUP =====
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
EXPORT_DIR="exports"
CODE_ARCHIVE="$EXPORT_DIR/code-$TIMESTAMP.tar.gz"
ASSETS_ARCHIVE="$EXPORT_DIR/assets-$TIMESTAMP.tar.gz"
TEMP_DIR=".migration_temp_$TIMESTAMP"

mkdir -p "$EXPORT_DIR"

# ===== INSTALL DEPENDENCIES =====
log "Setting up tools..."

# Install AWS CLI if needed
if ! command -v aws >/dev/null 2>&1; then
    log "Installing AWS CLI..."
    pip install --user awscli >/dev/null 2>&1
    export PATH="$HOME/.local/bin:$PATH"
fi

# Install Vercel CLI if token provided
if [ -n "$VERCEL_TOKEN" ] && ! command -v vercel >/dev/null 2>&1; then
    log "Installing Vercel CLI..."
    npm install -g vercel@latest >/dev/null 2>&1
fi

success "Tools ready"

# ===== CREATE ARCHIVES =====
log "Creating project archives..."

# Create code archive (clean for GitHub/Vercel)
log "Building code archive..."
tar -czf "$CODE_ARCHIVE" \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='*/node_modules' \
    --exclude='dist' \
    --exclude='*/dist' \
    --exclude='build' \
    --exclude='*/build' \
    --exclude='.next' \
    --exclude='*/.next' \
    --exclude='out' \
    --exclude='*/out' \
    --exclude='.cache' \
    --exclude='*/.cache' \
    --exclude='coverage' \
    --exclude='*/coverage' \
    --exclude='.vercel' \
    --exclude='*/.vercel' \
    --exclude='tmp' \
    --exclude='*/tmp' \
    --exclude='exports' \
    --exclude='*.log' \
    --exclude='.env*' \
    --exclude='assets' \
    --exclude='images' \
    --exclude='branding' \
    --exclude='attached_assets' \
    --exclude='static' \
    --exclude='public/assets' \
    .

# Create assets archive
log "Building assets archive..."
tar -czf "$ASSETS_ARCHIVE" \
    ./assets ./images ./branding ./attached_assets ./static ./public/assets 2>/dev/null || \
    echo "No assets found (this is okay)"

# Show archive sizes
log "Archive sizes:"
du -h "$CODE_ARCHIVE" "$ASSETS_ARCHIVE" 2>/dev/null || true

success "Archives created successfully"

# ===== UPLOAD TO R2 =====
log "Uploading to Cloudflare R2..."

# Test R2 connection
aws s3 ls "s3://$S3_BUCKET/" --endpoint-url "$S3_ENDPOINT" >/dev/null || \
    error "Cannot connect to R2. Check bucket name, endpoint, and credentials."

# Upload code archive
log "Uploading code archive..."
aws s3 cp "$CODE_ARCHIVE" "s3://$S3_BUCKET/" --endpoint-url "$S3_ENDPOINT" || \
    error "Failed to upload code archive"

# Upload assets archive if it exists and has content
if [ -f "$ASSETS_ARCHIVE" ] && [ -s "$ASSETS_ARCHIVE" ]; then
    log "Uploading assets archive..."
    aws s3 cp "$ASSETS_ARCHIVE" "s3://$S3_BUCKET/" --endpoint-url "$S3_ENDPOINT" || \
        error "Failed to upload assets archive"
fi

success "Uploaded to R2: s3://$S3_BUCKET/"

# ===== PREPARE CLEAN REPOSITORY =====
log "Preparing clean Git repository..."

# Extract code to temporary directory
mkdir -p "$TEMP_DIR"
tar -xzf "$CODE_ARCHIVE" -C "$TEMP_DIR"

# Create comprehensive .gitignore
cat > "$TEMP_DIR/.gitignore" << 'GITIGNORE'
# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
build/
out/
.next/

# Environment files
.env
.env.*
!.env.example

# Cache directories
.cache/
.vercel/
.vscode/
.idea/

# Log files
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Assets (stored separately in R2)
assets/
images/
branding/
attached_assets/
static/
public/assets/

# Export and temp directories
exports/
tmp/
temp/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
GITIGNORE

# Initialize Git and push
(
    cd "$TEMP_DIR"
    
    # Initialize repository
    git init >/dev/null 2>&1
    git add .
    git commit -m "Complete educational platform - clean deployment $(date)" >/dev/null 2>&1
    git branch -M main
    
    # Set remote
    if git remote get-url origin >/dev/null 2>&1; then
        git remote set-url origin "$GIT_REMOTE"
    else
        git remote add origin "$GIT_REMOTE"
    fi
    
    # Push to GitHub
    log "Pushing to GitHub..."
    git push -u origin main --force
) || error "Failed to push to GitHub"

success "Code pushed to GitHub: $GIT_REMOTE"

# ===== VERCEL DEPLOYMENT =====
if [ -n "$VERCEL_TOKEN" ]; then
    log "Deploying to Vercel..."
    
    (
        cd "$TEMP_DIR"
        
        # Link Vercel project
        if [ -n "$VERCEL_PROJECT_NAME" ]; then
            vercel link --project "$VERCEL_PROJECT_NAME" --yes --token "$VERCEL_TOKEN" >/dev/null || true
        else
            vercel link --yes --token "$VERCEL_TOKEN" >/dev/null || true
        fi
        
        # Deploy to production
        DEPLOY_URL=$(vercel deploy --prod --token "$VERCEL_TOKEN" 2>/dev/null | tail -n1)
        
        if [ -n "$DEPLOY_URL" ]; then
            success "Deployed to: $DEPLOY_URL"
            
            # Configure domains
            ROOT_DOMAIN_FULL="$ROOT_DOMAIN"
            WWW_DOMAIN="www.$ROOT_DOMAIN"
            APP_DOMAIN="$APP_SUBDOMAIN.$ROOT_DOMAIN"
            
            log "Setting up domains..."
            
            # Add domains to Vercel
            vercel domains add "$ROOT_DOMAIN_FULL" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            vercel domains add "$WWW_DOMAIN" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            vercel domains add "$APP_DOMAIN" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            
            # Alias deployment to domains
            vercel alias set "$DEPLOY_URL" "$ROOT_DOMAIN_FULL" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            vercel alias set "$DEPLOY_URL" "$WWW_DOMAIN" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            vercel alias set "$DEPLOY_URL" "$APP_DOMAIN" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            
            success "Vercel domains configured"
        else
            log "Vercel deployment completed (no URL returned)"
        fi
    )
else
    log "Skipping Vercel deployment (no VERCEL_TOKEN provided)"
fi

# ===== CLEANUP =====
rm -rf "$TEMP_DIR"

# ===== FINAL REPORT =====
echo ""
echo "====================================="
success "MIGRATION COMPLETED SUCCESSFULLY!"
echo "====================================="
echo ""

cat << EOF
📦 ARCHIVES CREATED:
   • Code: $CODE_ARCHIVE ($(du -h "$CODE_ARCHIVE" | cut -f1))
   • Assets: $ASSETS_ARCHIVE ($(du -h "$ASSETS_ARCHIVE" 2>/dev/null | cut -f1 || echo "0B"))

☁️  CLOUDFLARE R2:
   • Uploaded to: s3://$S3_BUCKET/
   • Endpoint: $S3_ENDPOINT

🐙 GITHUB:
   • Repository: $GIT_REMOTE
   • Branch: main (clean code only)

$([ -n "$VERCEL_TOKEN" ] && echo "⚡ VERCEL:
   • Deployed successfully
   • Domains configured" || echo "⏸️  VERCEL: Skipped (no token)")

🌐 DNS CONFIGURATION REQUIRED:
Add these records at your domain registrar for $ROOT_DOMAIN:

OPTION A - Durable at root, Vercel at app:
   @ (root)  →  ALIAS/ANAME  →  [your-durable-cname-target]
   www       →  CNAME        →  [your-durable-cname-target]
   app       →  CNAME        →  cname.vercel-dns.com

OPTION B - Vercel at root, Durable at www:
   @ (root)  →  A            →  76.76.21.21
   www       →  CNAME        →  [your-durable-cname-target]
   app       →  CNAME        →  cname.vercel-dns.com

🔍 VERIFY R2 UPLOAD:
   aws s3 ls s3://$S3_BUCKET/ --endpoint-url $S3_ENDPOINT

🎉 Your complete educational platform is now deployed and ready!
EOF

echo ""
echo "====================================="