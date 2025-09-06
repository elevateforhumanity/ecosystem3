#!/usr/bin/env bash
set -euo pipefail

# ===================================================================
# EFH DEPLOYMENT SCRIPT (No R2 - GitHub + Vercel Only)
# ===================================================================
# Quick deployment while R2 credentials are sorted out
# ===================================================================

echo "🚀 EFH Deployment Starting (No R2)..."
echo "====================================="

# Helper functions
log() { echo "→ $*"; }
success() { echo "✅ $*"; }
error() { echo "❌ ERROR: $*" >&2; exit 1; }

# ===== CONFIGURATION VALIDATION =====
log "Validating configuration..."

# Required GitHub settings
: "${GIT_REMOTE:?Please set: export GIT_REMOTE=\"https://github.com/username/repo.git\"}"

# Optional settings with defaults
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
VERCEL_PROJECT_NAME="${VERCEL_PROJECT_NAME:-efh-platform}"
ROOT_DOMAIN="${ROOT_DOMAIN:-elevateforhumanity.org}"

success "Configuration validated"

# ===== SETUP =====
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
EXPORT_DIR="exports"
CODE_ARCHIVE="$EXPORT_DIR/code-$TIMESTAMP.tar.gz"
TEMP_DIR=".migration_temp_$TIMESTAMP"

mkdir -p "$EXPORT_DIR"

# ===== INSTALL DEPENDENCIES =====
log "Setting up tools..."

# Install Vercel CLI if token provided
if [ -n "$VERCEL_TOKEN" ] && ! command -v vercel >/dev/null 2>&1; then
    log "Installing Vercel CLI..."
    npm install -g vercel@latest >/dev/null 2>&1
fi

success "Tools ready"

# ===== CREATE CODE ARCHIVE =====
log "Creating code archive..."

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

log "Archive size: $(du -h "$CODE_ARCHIVE" | cut -f1)"
success "Code archive created"

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

# Assets (stored separately)
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
    git commit -m "EFH Educational Platform - Clean Deployment $(date)" >/dev/null 2>&1
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
            APP_DOMAIN="app.$ROOT_DOMAIN"
            
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
success "DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "====================================="
echo ""

cat << EOF
📦 ARCHIVE CREATED:
   • Code: $CODE_ARCHIVE ($(du -h "$CODE_ARCHIVE" | cut -f1))

🐙 GITHUB:
   • Repository: $GIT_REMOTE
   • Branch: main (clean code only)

$([ -n "$VERCEL_TOKEN" ] && echo "⚡ VERCEL:
   • Deployed successfully
   • Domains configured" || echo "⏸️  VERCEL: Skipped (no token)")

🌐 NEXT STEPS:
1. Your EFH platform is deployed and ready!
2. Configure DNS for $ROOT_DOMAIN if needed
3. Sort out R2 credentials later for backup storage

🎉 Your educational platform is now live!
EOF

echo ""
echo "====================================="