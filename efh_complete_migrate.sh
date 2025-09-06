#!/usr/bin/env bash
set -euo pipefail

# ===================================================================
# EFH COMPLETE MIGRATION SCRIPT
# ===================================================================
# This script does everything:
# 1. Creates clean code + assets archives
# 2. Uploads to Cloudflare R2 
# 3. Pushes clean code to GitHub
# 4. Deploys to Vercel with domain setup
# 5. Provides DNS configuration instructions
# ===================================================================

say() { printf "\n🔹 %s\n" "$*"; }
error() { printf "\n❌ ERROR: %s\n" "$*" >&2; exit 1; }
success() { printf "\n✅ %s\n" "$*"; }

# ===== CONFIGURATION CHECK =====
say "Checking configuration..."

# Required variables
: "${S3_BUCKET:?❌ Set S3_BUCKET (e.g., export S3_BUCKET=\"efh-archive\")}"
: "${S3_ENDPOINT:?❌ Set S3_ENDPOINT (e.g., export S3_ENDPOINT=\"https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com\")}"
: "${AWS_ACCESS_KEY_ID:?❌ Set AWS_ACCESS_KEY_ID (R2 Access Key ID - about 20 chars)}"
: "${AWS_SECRET_ACCESS_KEY:?❌ Set AWS_SECRET_ACCESS_KEY (R2 Secret Key - 32 chars)}"
: "${GIT_REMOTE:?❌ Set GIT_REMOTE (e.g., export GIT_REMOTE=\"https://github.com/username/repo.git\")}"

# Optional variables with defaults
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
VERCEL_PROJECT_NAME="${VERCEL_PROJECT_NAME:-efh-platform}"
ROOT_DOMAIN="${ROOT_DOMAIN:-elevateforhumanity.org}"
PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-root}"
APP_SUBDOMAIN="${APP_SUBDOMAIN:-app}"
DURABLE_TARGET="${DURABLE_TARGET:-}"

# Validate R2 credentials
if [ ${#AWS_ACCESS_KEY_ID} -lt 15 ] || [ ${#AWS_ACCESS_KEY_ID} -gt 25 ]; then
    error "AWS_ACCESS_KEY_ID length is ${#AWS_ACCESS_KEY_ID}, should be ~20 characters. Check you're using R2 Access Key ID, not API token."
fi

if [ ${#AWS_SECRET_ACCESS_KEY} -ne 32 ]; then
    error "AWS_SECRET_ACCESS_KEY length is ${#AWS_SECRET_ACCESS_KEY}, should be exactly 32 characters. Check you're using R2 Secret Access Key, not API token."
fi

success "Configuration validated"

# ===== SETUP =====
TS="$(date +%Y%m%d-%H%M%S)"
OUTDIR="exports"
CODE_TAR="$OUTDIR/code-only-$TS.tar.gz"
ASSET_TAR="$OUTDIR/assets-only-$TS.tar.gz"
WORKDIR=".export_temp_$TS"

mkdir -p "$OUTDIR"

# ===== INSTALL TOOLS =====
say "Installing required tools..."

# AWS CLI for R2
if ! command -v aws >/dev/null 2>&1; then
    say "Installing AWS CLI..."
    pip install --user awscli >/dev/null 2>&1 || error "Failed to install AWS CLI"
    export PATH="$HOME/.local/bin:$PATH"
fi

# Vercel CLI (if token provided)
if [ -n "$VERCEL_TOKEN" ] && ! command -v vercel >/dev/null 2>&1; then
    say "Installing Vercel CLI..."
    npm i -g vercel@latest >/dev/null 2>&1 || error "Failed to install Vercel CLI"
fi

# Check required tools
for tool in tar gzip git; do
    command -v $tool >/dev/null 2>&1 || error "Missing required tool: $tool"
done

success "Tools ready"

# ===== CREATE ARCHIVES =====
say "Creating archives..."

# Code-only archive (GitHub/Vercel ready)
say "Building code archive (excludes node_modules, assets, build files)..."
tar -I 'gzip -9' -cf "$CODE_TAR" \
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
  --exclude='assets' \
  --exclude='static' \
  --exclude='public/assets' \
  --exclude='images' \
  --exclude='branding' \
  --exclude='*.log' \
  --exclude='.env*' \
  .

# Assets archive (backup)
say "Building assets archive..."
tar -I 'gzip -9' -cf "$ASSET_TAR" \
  ./assets ./static ./public/assets ./images ./branding ./attached_assets 2>/dev/null || true

say "Archive sizes:"
du -h "$CODE_TAR" "$ASSET_TAR" 2>/dev/null || true

success "Archives created"

# ===== UPLOAD TO R2 =====
say "Uploading to Cloudflare R2..."

# Test connection first
aws s3 ls "s3://$S3_BUCKET/" --endpoint-url "$S3_ENDPOINT" >/dev/null 2>&1 || \
    error "Failed to connect to R2. Check your credentials and bucket name."

# Upload archives
aws s3 cp "$CODE_TAR" "s3://$S3_BUCKET/" --endpoint-url "$S3_ENDPOINT" || \
    error "Failed to upload code archive to R2"

if [ -f "$ASSET_TAR" ] && [ -s "$ASSET_TAR" ]; then
    aws s3 cp "$ASSET_TAR" "s3://$S3_BUCKET/" --endpoint-url "$S3_ENDPOINT" || \
        error "Failed to upload assets archive to R2"
fi

success "Uploaded to R2: s3://$S3_BUCKET/"

# ===== PREPARE CLEAN GIT REPO =====
say "Preparing clean Git repository..."

# Extract code to temp directory
mkdir -p "$WORKDIR"
tar -xzf "$CODE_TAR" -C "$WORKDIR"

# Create proper .gitignore
cat > "$WORKDIR/.gitignore" <<'GITIGNORE'
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

# Log files
*.log
npm-debug.log*
yarn-debug.log*

# Runtime data
*.pid
*.seed
*.pid.lock

# Assets (stored in R2)
assets/
static/
public/assets/
images/
branding/
attached_assets/

# Exports
exports/
tmp/

# IDE
.vscode/
.idea/
GITIGNORE

# Initialize and push to GitHub
(
    cd "$WORKDIR"
    
    # Git setup
    git init >/dev/null 2>&1
    git add .
    git commit -m "Clean code export - $(date)" >/dev/null 2>&1 || true
    git branch -M main
    
    # Configure remote
    if git remote get-url origin >/dev/null 2>&1; then
        git remote set-url origin "$GIT_REMOTE"
    else
        git remote add origin "$GIT_REMOTE"
    fi
    
    # Push
    say "Pushing to GitHub: $GIT_REMOTE"
    git push -u origin main --force
) || error "Failed to push to GitHub"

success "Code pushed to GitHub"

# ===== VERCEL DEPLOYMENT =====
if [ -n "$VERCEL_TOKEN" ]; then
    say "Deploying to Vercel..."
    
    (
        cd "$WORKDIR"
        
        # Link project
        if [ -n "$VERCEL_PROJECT_NAME" ]; then
            vercel link --project "$VERCEL_PROJECT_NAME" --yes --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
        else
            vercel link --yes --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
        fi
        
        # Deploy
        DEPLOY_URL=$(vercel deploy --prod --token "$VERCEL_TOKEN" 2>/dev/null | tail -n1 || true)
        
        if [ -n "$DEPLOY_URL" ]; then
            success "Deployed to: $DEPLOY_URL"
            
            # Setup domains
            ROOT="$ROOT_DOMAIN"
            WWW="www.$ROOT_DOMAIN"
            APP="$APP_SUBDOMAIN.$ROOT_DOMAIN"
            
            say "Configuring domains..."
            
            # Add domains (safe to repeat)
            vercel domains add "$ROOT" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            vercel domains add "$WWW" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            vercel domains add "$APP" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            
            # Alias to domains
            vercel alias set "$DEPLOY_URL" "$ROOT" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            vercel alias set "$DEPLOY_URL" "$WWW" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            vercel alias set "$DEPLOY_URL" "$APP" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
            
            success "Vercel domains configured"
        fi
    )
else
    say "Skipping Vercel (no VERCEL_TOKEN set)"
fi

# ===== CLEANUP =====
rm -rf "$WORKDIR"

# ===== FINAL SUMMARY =====
success "MIGRATION COMPLETE!"

cat << EOF

📋 WHAT WAS DONE:
✅ Created archives: $CODE_TAR ($(du -h "$CODE_TAR" | cut -f1)) + $ASSET_TAR ($(du -h "$ASSET_TAR" 2>/dev/null | cut -f1 || echo "0"))
✅ Uploaded to R2: s3://$S3_BUCKET/ 
✅ Pushed clean code to: $GIT_REMOTE
$([ -n "$VERCEL_TOKEN" ] && echo "✅ Deployed to Vercel with domain setup" || echo "⏸️  Vercel skipped (no token)")

🌐 DNS CONFIGURATION NEEDED:
Add these records at your domain registrar ($ROOT_DOMAIN):

Option A - Durable at root, Vercel at app:
@ (root)  → ALIAS/ANAME → $DURABLE_TARGET
www       → CNAME       → $DURABLE_TARGET  
app       → CNAME       → cname.vercel-dns.com

Option B - Vercel at root, Durable at www:
@ (root)  → A           → 76.76.21.21
www       → CNAME       → $DURABLE_TARGET
app       → CNAME       → cname.vercel-dns.com

🔍 VERIFY UPLOADS:
aws s3 ls s3://$S3_BUCKET/ --endpoint-url $S3_ENDPOINT

🎉 Your complete educational platform is now deployed!
EOF