#!/usr/bin/env bash
set -euo pipefail

# ===================================================================
# EFH REPLIT DEPLOYMENT SCRIPT
# ===================================================================
# Uses local Git config and creates local archives
# ===================================================================

echo "🚀 EFH Replit Deployment Starting..."
echo "====================================="

# Helper functions
log() { echo "→ $*"; }
success() { echo "✅ $*"; }
error() { echo "❌ ERROR: $*" >&2; exit 1; }

# ===== SETUP =====
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
EXPORT_DIR="exports"
CODE_ARCHIVE="$EXPORT_DIR/efh-code-$TIMESTAMP.tar.gz"
DEPLOY_DIR="efh-deployment-$TIMESTAMP"

mkdir -p "$EXPORT_DIR"

log "Setting up deployment..."

# ===== CREATE DEPLOYMENT PACKAGE =====
log "Creating deployment package..."

# Create deployment directory with clean code
mkdir -p "$DEPLOY_DIR"

# Copy all files except unwanted ones
log "Copying files..."

# Use find and cp to copy files (avoiding unwanted directories)
find . -type f \
    ! -path './.git/*' \
    ! -path './node_modules/*' \
    ! -path './*/node_modules/*' \
    ! -path './dist/*' \
    ! -path './*/dist/*' \
    ! -path './build/*' \
    ! -path './*/build/*' \
    ! -path './.next/*' \
    ! -path '*/.next/*' \
    ! -path './out/*' \
    ! -path './*/out/*' \
    ! -path './.cache/*' \
    ! -path '*/.cache/*' \
    ! -path './coverage/*' \
    ! -path './*/coverage/*' \
    ! -path './.vercel/*' \
    ! -path '*/.vercel/*' \
    ! -path './tmp/*' \
    ! -path './*/tmp/*' \
    ! -path './exports/*' \
    ! -name '*.log' \
    ! -name '.env*' \
    ! -path './efh-deployment-*/*' \
    -exec sh -c 'mkdir -p "$1/$(dirname "$2")" && cp "$2" "$1/$2"' _ "$DEPLOY_DIR" {} \;

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

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
GITIGNORE

# Create archive
log "Creating archive..."
tar -czf "$CODE_ARCHIVE" -C "$DEPLOY_DIR" .

# Show sizes
CODE_SIZE=$(du -h "$CODE_ARCHIVE" | cut -f1)
log "Archive created: $CODE_SIZE"

success "Deployment package ready"

# ===== INITIALIZE LOCAL GIT REPO =====
log "Setting up Git repository..."

(
    cd "$DEPLOY_DIR"
    
    # Initialize repository
    git init >/dev/null 2>&1
    git add .
    git commit -m "EFH Educational Platform - Production Ready $(date)" >/dev/null 2>&1
    git branch -M main
    
    success "Local Git repository initialized"
)

# ===== CREATE DEPLOYMENT INSTRUCTIONS =====
cat > "$DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.md" << 'INSTRUCTIONS'
# EFH Platform Deployment Instructions

## Quick Deploy Options

### Option 1: GitHub + Vercel (Recommended)
1. Create a new repository on GitHub
2. Upload this folder or push with Git:
   ```bash
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
3. Connect to Vercel for instant deployment

### Option 2: Direct Upload to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow prompts for deployment

### Option 3: Other Hosting Platforms
- **Netlify**: Drag and drop this folder
- **Render**: Connect Git repository
- **Railway**: Connect Git repository

## Environment Variables Needed
Set these in your hosting platform:
- `DATABASE_URL` (if using database)
- `NODE_ENV=production`
- Any API keys your app requires

## Domain Configuration
For custom domains, configure DNS records:
- A record: @ → hosting provider IP
- CNAME: www → hosting provider domain

Your EFH platform is ready to deploy! 🚀
INSTRUCTIONS

# ===== FINAL REPORT =====
echo ""
echo "====================================="
success "DEPLOYMENT PACKAGE CREATED!"
echo "====================================="
echo ""

cat << EOF
📦 DEPLOYMENT READY:
   • Directory: $DEPLOY_DIR/
   • Archive: $CODE_ARCHIVE ($CODE_SIZE)
   • Instructions: $DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.md

🚀 NEXT STEPS:
1. Navigate to: cd $DEPLOY_DIR
2. Push to GitHub:
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
3. Deploy to Vercel or your preferred platform

📁 LOCAL FILES:
   • Clean code ready for production
   • Proper .gitignore configured
   • Git repository initialized

🌐 HOSTING OPTIONS:
   • Vercel (recommended)
   • Netlify
   • Railway
   • Render

🎉 Your EFH educational platform is ready for deployment!
EOF

echo ""
echo "====================================="
echo "💡 TIP: Check $DEPLOY_DIR/DEPLOYMENT_INSTRUCTIONS.md for detailed steps"
echo "====================================="