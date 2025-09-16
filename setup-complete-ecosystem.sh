#!/usr/bin/env bash
set -euo pipefail

# ===================================================================
# COMPLETE ECOSYSTEM SETUP SCRIPT FOR GITHUB CODESPACES
# ===================================================================
# This script clones all repositories and sets up the complete 97K file ecosystem
# Run this in GitHub Codespaces to get access to all your files
# ===================================================================

echo "🚀 Setting up Complete EFH Ecosystem..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() { echo -e "${BLUE}→${NC} $*"; }
success() { echo -e "${GREEN}✅${NC} $*"; }
warn() { echo -e "${YELLOW}⚠️${NC} $*"; }
error() { echo -e "${RED}❌${NC} $*"; }

# Navigate to workspaces
cd /workspaces

# ===== CLONE ALL REPOSITORIES =====
log "Cloning all ecosystem repositories..."

# Main ecosystem repository (already exists, but ensure it's up to date)
if [ -d "new-ecosysstem" ]; then
    log "Updating main ecosystem repository..."
    cd new-ecosysstem && git pull && cd ..
else
    log "Cloning main ecosystem repository..."
    git clone https://github.com/elevateforhumanity/new-ecosysstem
fi

# Sister site repositories - UPDATE THESE WITH ACTUAL REPO NAMES
REPOS=(
    # "hub-site"                    # Replace with actual hub repository name
    # "programs-site"               # Replace with actual programs repository name  
    # "lms-platform"                # Replace with actual LMS repository name
    # "connect-community"           # Replace with actual connect repository name
    # "payment-service"             # Replace with actual payment repository name
    # "compliance-portal"           # Replace with actual compliance repository name
    # "admin-dashboard"             # Replace with actual admin repository name
    # "api-services"                # Replace with actual API repository name
    # "shared-components"           # Replace with actual shared components repository name
    # "database-schemas"            # Replace with actual database repository name
    # "deployment-configs"          # Replace with actual deployment repository name
    # "asset-storage"               # Replace with actual assets repository name
)

# Clone each repository
for repo in "${REPOS[@]}"; do
    if [ -d "$repo" ]; then
        log "Updating $repo..."
        cd "$repo" && git pull && cd ..
    else
        log "Cloning $repo..."
        if git clone "https://github.com/elevateforhumanity/$repo"; then
            success "Cloned $repo"
        else
            warn "Failed to clone $repo - repository may not exist or be private"
        fi
    fi
done

# ===== INSTALL DEPENDENCIES =====
log "Installing dependencies across all repositories..."

# Function to install dependencies in a directory
install_deps() {
    local dir=$1
    if [ -d "$dir" ]; then
        cd "$dir"
        log "Installing dependencies in $dir..."
        
        # Node.js projects
        if [ -f "package.json" ]; then
            if command -v npm &> /dev/null; then
                npm install
                success "Installed npm dependencies in $dir"
            else
                warn "npm not found - skipping Node.js dependencies in $dir"
            fi
        fi
        
        # Python projects
        if [ -f "requirements.txt" ]; then
            if command -v pip &> /dev/null; then
                pip install -r requirements.txt
                success "Installed Python dependencies in $dir"
            else
                warn "pip not found - skipping Python dependencies in $dir"
            fi
        fi
        
        # Go projects
        if [ -f "go.mod" ]; then
            if command -v go &> /dev/null; then
                go mod download
                success "Downloaded Go dependencies in $dir"
            else
                warn "go not found - skipping Go dependencies in $dir"
            fi
        fi
        
        cd ..
    fi
}

# Install dependencies in main repo
install_deps "new-ecosysstem"
install_deps "new-ecosysstem/client"

# Install dependencies in all cloned repos
for repo in "${REPOS[@]}"; do
    install_deps "$repo"
done

# ===== BUILD PROJECTS =====
log "Building projects..."

build_project() {
    local dir=$1
    if [ -d "$dir" ]; then
        cd "$dir"
        log "Building $dir..."
        
        # Node.js build
        if [ -f "package.json" ] && command -v npm &> /dev/null; then
            if npm run build 2>/dev/null; then
                success "Built $dir"
            else
                warn "No build script or build failed in $dir"
            fi
        fi
        
        cd ..
    fi
}

# Build main project
build_project "new-ecosysstem"
build_project "new-ecosysstem/client"

# Build all cloned repos
for repo in "${REPOS[@]}"; do
    build_project "$repo"
done

# ===== COUNT TOTAL FILES =====
log "Counting total files in ecosystem..."

TOTAL_FILES=$(find /workspaces -type f 2>/dev/null | wc -l)
ECOSYSTEM_FILES=$(find /workspaces -path "*/node_modules" -prune -o -path "*/.git" -prune -o -type f -print 2>/dev/null | wc -l)

success "Setup complete!"
echo ""
echo "📊 ECOSYSTEM STATISTICS:"
echo "========================"
echo "Total files (including system): $TOTAL_FILES"
echo "Ecosystem files (excluding node_modules/.git): $ECOSYSTEM_FILES"
echo ""

# ===== REPOSITORY STATUS =====
echo "📁 REPOSITORY STATUS:"
echo "===================="
for dir in /workspaces/*/; do
    if [ -d "$dir/.git" ]; then
        repo_name=$(basename "$dir")
        file_count=$(find "$dir" -type f | wc -l)
        echo "✅ $repo_name: $file_count files"
    fi
done

echo ""
echo "🎯 NEXT STEPS:"
echo "=============="
echo "1. Update the REPOS array in this script with your actual repository names"
echo "2. Ensure all repositories are public or you have access"
echo "3. Run this script again to clone missing repositories"
echo "4. Check individual repositories for specific setup instructions"
echo ""
echo "🔧 TO UPDATE REPOSITORY LIST:"
echo "Edit this script and replace the commented repo names with actual ones:"
echo "Example: Change # \"hub-site\" to \"your-actual-hub-repo-name\""
echo ""
echo "📍 Current working directory: $(pwd)"
echo "🚀 Ready to start development!"