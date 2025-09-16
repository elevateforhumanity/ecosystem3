#!/usr/bin/env bash
set -euo pipefail

# COMPLETE PROJECT EXPORT - Everything in One Script
echo "📦 COMPLETE PROJECT EXPORT - Elevate for Humanity"
echo "================================================="

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

OUTPUT_FILE="complete-project-export.txt"

echo -e "${BLUE}🚀 Creating complete project export...${NC}"

# Function to add file content with header
add_file_content() {
    local file_path="$1"
    local file_type="$2"
    if [ -f "$file_path" ]; then
        echo "" >> "$OUTPUT_FILE"
        echo "################################################################" >> "$OUTPUT_FILE"
        echo "# $file_type: $file_path" >> "$OUTPUT_FILE"
        echo "################################################################" >> "$OUTPUT_FILE"
        cat "$file_path" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo "# END OF FILE: $file_path" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
}

# Function to add directory listing
add_directory_listing() {
    local dir_path="$1"
    local description="$2"
    if [ -d "$dir_path" ]; then
        echo "" >> "$OUTPUT_FILE"
        echo "################################################################" >> "$OUTPUT_FILE"
        echo "# $description: $dir_path" >> "$OUTPUT_FILE"
        echo "################################################################" >> "$OUTPUT_FILE"
        find "$dir_path" -type f \
            -not -path "*/node_modules/*" \
            2>/dev/null | sort >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
    fi
}

# Start the export file
cat > "$OUTPUT_FILE" << HEADER
################################################################################
#                    ELEVATE FOR HUMANITY - COMPLETE PROJECT EXPORT
################################################################################
#
# Generated: $(date)
# Project: Multi-Site Workforce Development Platform
# Architecture: Sister Sites Ecosystem (Hub, Programs, LMS, Connect, Pay)
#
# This file contains the COMPLETE project:
# - All HTML pages and content
# - All JavaScript/TypeScript code
# - All CSS styles and configurations
# - All database schemas and API routes
# - All configuration files
# - All documentation and markdown
# - All shell scripts and tools
# - All project assets catalog
# - Complete directory structure
#
################################################################################

HEADER

echo -e "${CYAN}📊 Analyzing project structure...${NC}"

# Count files for summary
PROJECT_FILES=$(find . -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/efh-deployment-*/*" \
    -not -path "*/efh-ecosystem3-*/*" \
    -not -path "*/.replit/*" \
    -not -path "*/.upm/*" \
    -not -path "*/attached_assets/Pasted-*" \
    2>/dev/null | wc -l)

echo -e "${YELLOW}📈 Exporting $PROJECT_FILES project files...${NC}"

# Add project statistics to file
cat >> "$OUTPUT_FILE" << STATS

################################################################################
#                              PROJECT STATISTICS
################################################################################

Total Project Files: $PROJECT_FILES
HTML Pages: $(find . -name "*.html" -type f -not -path "*/node_modules/*" -not -path "*/efh-deployment-*/*" 2>/dev/null | wc -l)
JavaScript/TypeScript Files: $(find . \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) -type f -not -path "*/node_modules/*" -not -path "*/efh-deployment-*/*" 2>/dev/null | wc -l)
CSS Files: $(find . -name "*.css" -type f -not -path "*/node_modules/*" 2>/dev/null | wc -l)
Configuration Files: $(find . \( -name "*.json" -o -name "*.config.*" \) -type f -not -path "*/node_modules/*" -not -path "*/efh-deployment-*/*" 2>/dev/null | wc -l)
Shell Scripts: $(find . -name "*.sh" -type f -not -path "*/node_modules/*" 2>/dev/null | wc -l)
Images: $(find . \( -name "*.png" -o -name "*.jpg" -o -name "*.svg" \) -type f -not -path "*/node_modules/*" -not -path "*/attached_assets/Pasted-*" 2>/dev/null | wc -l)
Markdown Files: $(find . -name "*.md" -type f -not -path "*/node_modules/*" -not -path "*/attached_assets/Pasted-*" 2>/dev/null | wc -l)

STATS

echo -e "${CYAN}🏗️ Adding directory structure...${NC}"

# Directory Structure
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                              DIRECTORY STRUCTURE" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

tree -a -I 'node_modules|.git|.replit|.upm|efh-deployment-*|efh-ecosystem3-*|attached_assets/Pasted-*' . 2>/dev/null >> "$OUTPUT_FILE" || {
    echo "# Tree view not available, using find instead:" >> "$OUTPUT_FILE"
    find . -type d \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/efh-deployment-*" \
        -not -path "*/efh-ecosystem3-*" \
        2>/dev/null | sort >> "$OUTPUT_FILE"
}

echo -e "${BLUE}📄 Exporting HTML pages...${NC}"

# HTML PAGES
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"  
echo "#                                 HTML PAGES" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

find . -name "*.html" -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/efh-deployment-*/*" \
    -not -path "*/efh-ecosystem3-*/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "HTML PAGE"
    echo -e "${GREEN}✅ Added HTML: $file${NC}"
done

echo -e "${BLUE}💻 Exporting JavaScript/TypeScript...${NC}"

# JAVASCRIPT/TYPESCRIPT CODE  
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                           JAVASCRIPT/TYPESCRIPT CODE" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

find . \( -name "*.js" -o -name "*.mjs" -o -name "*.cjs" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/efh-deployment-*/*" \
    -not -path "*/efh-ecosystem3-*/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "JAVASCRIPT/TYPESCRIPT"
    echo -e "${GREEN}✅ Added JS/TS: $file${NC}"
done

echo -e "${BLUE}🎨 Exporting CSS styles...${NC}"

# CSS STYLES
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                                CSS STYLES" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

find . \( -name "*.css" -o -name "*.scss" -o -name "*.sass" -o -name "*.less" \) -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "CSS STYLES"
    echo -e "${GREEN}✅ Added CSS: $file${NC}"
done

echo -e "${BLUE}⚙️ Exporting configurations...${NC}"

# CONFIGURATION FILES
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                           CONFIGURATION FILES" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

# Package.json files
find . -name "package*.json" -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/efh-deployment-*/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "PACKAGE.JSON CONFIG"
done

# TypeScript configs
find . -name "tsconfig*.json" -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "TYPESCRIPT CONFIG"
done

# Vite configs
find . -name "vite.config.*" -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "VITE CONFIG"
done

# Tailwind configs
find . -name "tailwind.config.*" -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "TAILWIND CONFIG"
done

# PostCSS configs
find . -name "postcss.config.*" -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "POSTCSS CONFIG"
done

# Vercel configs
find . -name "vercel.json" -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "VERCEL CONFIG"
done

# Other config files
find . -name "*.config.*" -type f \
    -not -path "*/node_modules/*" \
    -not -name "vite.config.*" \
    -not -name "tailwind.config.*" \
    -not -name "postcss.config.*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "CONFIG FILE"
done

echo -e "${BLUE}🗄️ Exporting database schemas...${NC}"

# DATABASE SCHEMAS
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                            DATABASE SCHEMAS" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

find . \( -name "schema.prisma" -o -name "*.schema.*" -o -name "schema.ts" -o -name "*.sql" \) -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "DATABASE SCHEMA"
    echo -e "${GREEN}✅ Added Schema: $file${NC}"
done

echo -e "${BLUE}📋 Exporting documentation...${NC}"

# DOCUMENTATION
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                              DOCUMENTATION" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

find . \( -name "*.md" -o -name "README*" -o -name "*.txt" \) -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/attached_assets/Pasted-*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "DOCUMENTATION"
    echo -e "${GREEN}✅ Added Doc: $file${NC}"
done

echo -e "${BLUE}🔧 Exporting shell scripts...${NC}"

# SHELL SCRIPTS
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                              SHELL SCRIPTS" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

find . \( -name "*.sh" -o -name "*.bash" -o -name "*.zsh" \) -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "SHELL SCRIPT"
    echo -e "${GREEN}✅ Added Script: $file${NC}"
done

echo -e "${BLUE}🔐 Exporting important configs...${NC}"

# IMPORTANT ROOT FILES
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                            IMPORTANT ROOT FILES" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

ROOT_FILES=(
    ".gitignore"
    "robots.txt"
    "sitemap.xml"
    ".replit"
    "replit.nix"
    "LICENSE"
    "CHANGELOG.md"
)

for file in "${ROOT_FILES[@]}"; do
    if [ -f "./$file" ]; then
        add_file_content "./$file" "ROOT FILE"
        echo -e "${GREEN}✅ Added Root: $file${NC}"
    fi
done

echo -e "${BLUE}📷 Cataloging images...${NC}"

# IMAGES CATALOG
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                              IMAGES CATALOG" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "# Complete listing of all project images:" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

find . \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.ico" \) -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/attached_assets/Pasted-*" \
    2>/dev/null | sort | while read -r file; do
    echo "IMAGE: $file" >> "$OUTPUT_FILE"
    if command -v file >/dev/null; then
        file_info=$(file "$file" 2>/dev/null || echo "Info not available")
        echo "  Info: $file_info" >> "$OUTPUT_FILE"
    fi
    if [ -f "$file" ]; then
        file_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo "Unknown")
        echo "  Size: $file_size bytes" >> "$OUTPUT_FILE"
    fi
    echo "" >> "$OUTPUT_FILE"
done

echo -e "${BLUE}📁 Adding config directories...${NC}"

# CONFIG DIRECTORIES CONTENT
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                          CONFIG DIRECTORIES CONTENT" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

find . -path "*/config/*" -name "*.json" -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | sort | while read -r file; do
    add_file_content "$file" "CONFIG DIRECTORY FILE"
    echo -e "${GREEN}✅ Added Config: $file${NC}"
done

# Add environment template (without values)
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                         ENVIRONMENT VARIABLES TEMPLATE" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "# Environment variables needed (values not included for security):" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

if [ -f ".env" ] || [ -f ".env.example" ] || [ -f ".env.template" ]; then
    echo "# Based on found .env files in project:" >> "$OUTPUT_FILE"
    for env_file in .env .env.example .env.template; do
        if [ -f "$env_file" ]; then
            echo "# From $env_file:" >> "$OUTPUT_FILE"
            grep -E '^[A-Z_]+=|^#' "$env_file" 2>/dev/null | sed 's/=.*$/=<VALUE_REQUIRED>/' >> "$OUTPUT_FILE" || true
            echo "" >> "$OUTPUT_FILE"
        fi
    done
else
    echo "# No .env files found, but based on code analysis, you may need:" >> "$OUTPUT_FILE"
    echo "DATABASE_URL=<VALUE_REQUIRED>" >> "$OUTPUT_FILE"
    echo "STRIPE_SECRET_KEY=<VALUE_REQUIRED>" >> "$OUTPUT_FILE"
    echo "STRIPE_PUBLISHABLE_KEY=<VALUE_REQUIRED>" >> "$OUTPUT_FILE"
    echo "VITE_SUPABASE_URL=<VALUE_REQUIRED>" >> "$OUTPUT_FILE"
    echo "VITE_SUPABASE_ANON_KEY=<VALUE_REQUIRED>" >> "$OUTPUT_FILE"
    echo "SENDGRID_API_KEY=<VALUE_REQUIRED>" >> "$OUTPUT_FILE"
    echo "TWILIO_ACCOUNT_SID=<VALUE_REQUIRED>" >> "$OUTPUT_FILE"
    echo "TWILIO_AUTH_TOKEN=<VALUE_REQUIRED>" >> "$OUTPUT_FILE"
fi

# Final summary
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "#                              EXPORT COMPLETE" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Export completed: $(date)" >> "$OUTPUT_FILE"
echo "Total project files exported: $PROJECT_FILES" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "This file contains:" >> "$OUTPUT_FILE"
echo "- Complete directory structure" >> "$OUTPUT_FILE"
echo "- All HTML pages with full content" >> "$OUTPUT_FILE"  
echo "- All JavaScript/TypeScript code" >> "$OUTPUT_FILE"
echo "- All CSS styles and configurations" >> "$OUTPUT_FILE"
echo "- All database schemas and API routes" >> "$OUTPUT_FILE"
echo "- All configuration files" >> "$OUTPUT_FILE"
echo "- All documentation and markdown files" >> "$OUTPUT_FILE"
echo "- All shell scripts and development tools" >> "$OUTPUT_FILE"
echo "- Complete images catalog with file info" >> "$OUTPUT_FILE"
echo "- Environment variables template" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "Ready for deployment, migration, or backup purposes." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"
echo "################################################################################" >> "$OUTPUT_FILE"

echo -e "${GREEN}✅ Complete project export saved to: $OUTPUT_FILE${NC}"

# Show final summary
echo ""
echo -e "${CYAN}🎉 EXPORT COMPLETE!${NC}"
echo "================================"
echo -e "📊 Total files exported: ${YELLOW}$PROJECT_FILES${NC}"
echo -e "📄 HTML pages: ${GREEN}$(find . -name "*.html" -type f -not -path "*/node_modules/*" -not -path "*/efh-deployment-*/*" 2>/dev/null | wc -l)${NC}"
echo -e "💻 JS/TS files: ${GREEN}$(find . \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) -type f -not -path "*/node_modules/*" -not -path "*/efh-deployment-*/*" 2>/dev/null | wc -l)${NC}"
echo -e "🎨 CSS files: ${GREEN}$(find . -name "*.css" -type f -not -path "*/node_modules/*" 2>/dev/null | wc -l)${NC}"
echo -e "⚙️ Config files: ${GREEN}$(find . \( -name "*.json" -o -name "*.config.*" \) -type f -not -path "*/node_modules/*" -not -path "*/efh-deployment-*/*" 2>/dev/null | wc -l)${NC}"
echo -e "🔧 Shell scripts: ${GREEN}$(find . -name "*.sh" -type f -not -path "*/node_modules/*" 2>/dev/null | wc -l)${NC}"
echo -e "📷 Images: ${GREEN}$(find . \( -name "*.png" -o -name "*.jpg" -o -name "*.svg" \) -type f -not -path "*/node_modules/*" -not -path "*/attached_assets/Pasted-*" 2>/dev/null | wc -l)${NC}"

file_size=$(du -h "$OUTPUT_FILE" 2>/dev/null | cut -f1 || echo "Unknown")
echo ""
echo -e "${BLUE}📦 Export file size: $file_size${NC}"
echo -e "${BLUE}📄 Export file: $OUTPUT_FILE${NC}"
echo ""
echo -e "${GREEN}🚀 Your complete project is now in one copy-paste ready file!${NC}"
echo -e "${YELLOW}💡 This includes EVERYTHING except node_modules and backup folders${NC}"
