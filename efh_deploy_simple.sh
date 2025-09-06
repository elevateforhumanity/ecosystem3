#!/usr/bin/env bash
set -euo pipefail

# ===================================================================
# EFH SIMPLE DEPLOYMENT SCRIPT
# ===================================================================
# Quick deployment to GitHub for elevateforhumanity/ecosystem3
# ===================================================================

echo "🚀 EFH Simple Deployment Starting..."
echo "====================================="

# Helper functions
log() { echo "→ $*"; }
success() { echo "✅ $*"; }
error() { echo "❌ ERROR: $*" >&2; exit 1; }

# Configuration
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DEPLOY_DIR="efh-ecosystem3-$TIMESTAMP"
REPO_URL="https://github.com/elevateforhumanity/ecosystem3.git"

log "Setting up deployment for ecosystem3..."

# ===== CREATE DEPLOYMENT ARCHIVE =====
log "Creating deployment archive..."

tar -czf "efh-ecosystem3-$TIMESTAMP.tar.gz" \
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
    --exclude='efh-*' \
    --exclude='*.log' \
    --exclude='.env*' \
    .

ARCHIVE_SIZE=$(du -h "efh-ecosystem3-$TIMESTAMP.tar.gz" | cut -f1)
success "Archive created: $ARCHIVE_SIZE"

# ===== CREATE DEPLOYMENT DIRECTORY =====
log "Creating deployment directory..."
mkdir -p "$DEPLOY_DIR"
tar -xzf "efh-ecosystem3-$TIMESTAMP.tar.gz" -C "$DEPLOY_DIR"

# Create comprehensive .gitignore
cat > "$DEPLOY_DIR/.gitignore" << 'GITIGNORE'
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

# Export and temp directories
exports/
tmp/
temp/
efh-*

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
GITIGNORE

# ===== INITIALIZE GIT REPOSITORY =====
log "Setting up Git repository..."

(
    cd "$DEPLOY_DIR"
    
    # Initialize repository
    git init >/dev/null 2>&1
    git add .
    git commit -m "EFH Educational Platform - Ecosystem3 Deployment $(date)" >/dev/null 2>&1
    git branch -M main
    git remote add origin "$REPO_URL"
    
    success "Git repository initialized"
)

# ===== CREATE DEPLOYMENT GUIDE =====
cat > "$DEPLOY_DIR/DEPLOY_GUIDE.md" << 'GUIDE'
# EFH Ecosystem3 Deployment Guide

## 🚀 Quick GitHub Deploy

1. **Push to GitHub:**
   ```bash
   cd $(basename $(pwd))
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to vercel.com
   - Import from GitHub: elevateforhumanity/ecosystem3
   - Deploy automatically

## 🌐 Alternative Hosting

### Netlify
- Drag and drop this folder to netlify.com

### Railway
- Connect GitHub repository
- Auto-deploy on push

### Render
- Connect GitHub repository
- Set build command: `npm run build`

## 🔧 Environment Variables

Set these in your hosting platform:
- `NODE_ENV=production`
- `DATABASE_URL` (if using database)
- Add any API keys your app needs

## 📱 Custom Domain

1. Add domain in hosting provider
2. Configure DNS:
   - A record: @ → provider IP
   - CNAME: www → provider domain

Your EFH platform is ready! 🎉
GUIDE

# ===== FINAL REPORT =====
echo ""
echo "====================================="
success "DEPLOYMENT READY FOR ECOSYSTEM3!"
echo "====================================="
echo ""

cat << EOF
📦 FILES CREATED:
   • Archive: efh-ecosystem3-$TIMESTAMP.tar.gz ($ARCHIVE_SIZE)
   • Directory: $DEPLOY_DIR/
   • Guide: $DEPLOY_DIR/DEPLOY_GUIDE.md

🚀 NEXT STEPS:

1. PUSH TO GITHUB:
   cd $DEPLOY_DIR
   git push -u origin main

2. DEPLOY TO VERCEL:
   - Visit vercel.com
   - Import: elevateforhumanity/ecosystem3
   - Deploy automatically

📍 REPOSITORY: $REPO_URL

🎯 READY TO DEPLOY:
   • Clean code structure
   • Proper .gitignore
   • Git repository initialized
   • Remote origin set

🎉 Your EFH Educational Platform is ready for deployment!
EOF

echo ""
echo "====================================="
echo "💡 Check $DEPLOY_DIR/DEPLOY_GUIDE.md for detailed instructions"
echo "====================================="