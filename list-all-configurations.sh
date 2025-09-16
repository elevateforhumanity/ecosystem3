#!/usr/bin/env bash
set -euo pipefail

# All Project Configurations Script
echo "⚙️ ALL PROJECT CONFIGURATIONS - Elevate for Humanity"
echo "===================================================="

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

OUTPUT_FILE="all-configurations.txt"

echo -e "${BLUE}🔍 Scanning all configuration files...${NC}"

# Create configurations listing
cat > "$OUTPUT_FILE" << HEADER
ELEVATE FOR HUMANITY - ALL CONFIGURATIONS
==========================================
Generated: $(date)
Complete Configuration Files & Contents
=======================================

HEADER

# Function to add file content with header
add_file_content() {
    local file_path="$1"
    if [ -f "$file_path" ]; then
        echo "" >> "$OUTPUT_FILE"
        echo "============================================================" >> "$OUTPUT_FILE"
        echo "FILE: $file_path" >> "$OUTPUT_FILE"
        echo "============================================================" >> "$OUTPUT_FILE"
        cat "$file_path" >> "$OUTPUT_FILE"
        echo "" >> "$OUTPUT_FILE"
        echo -e "${GREEN}✅ Added: $file_path${NC}"
    fi
}

# Function to find and add multiple files of same pattern
add_pattern_files() {
    local pattern="$1"
    local description="$2"
    
    echo -e "${CYAN}📋 Finding $description...${NC}"
    echo "" >> "$OUTPUT_FILE"
    echo "######## $description ########" >> "$OUTPUT_FILE"
    
    find . -name "$pattern" -type f \
        -not -path "*/node_modules/*" \
        -not -path "*/.git/*" \
        -not -path "*/efh-deployment-*/*" \
        -not -path "*/efh-ecosystem3-*/*" \
        2>/dev/null | while read -r file; do
        add_file_content "$file"
    done
}

echo -e "${YELLOW}📊 Collecting all configuration files...${NC}"

# 1. Package.json files
add_pattern_files "package*.json" "PACKAGE.JSON FILES"

# 2. TypeScript configs
add_pattern_files "tsconfig*.json" "TYPESCRIPT CONFIGURATIONS"

# 3. Vite configs
add_pattern_files "vite.config.*" "VITE CONFIGURATIONS"

# 4. Tailwind configs
add_pattern_files "tailwind.config.*" "TAILWIND CONFIGURATIONS"

# 5. PostCSS configs
add_pattern_files "postcss.config.*" "POSTCSS CONFIGURATIONS"

# 6. Vercel configs
add_pattern_files "vercel.json" "VERCEL CONFIGURATIONS"

# 7. Replit configs
add_pattern_files ".replit" "REPLIT CONFIGURATIONS"
add_pattern_files "replit.nix" "REPLIT NIX CONFIGURATIONS"

# 8. Environment configs
echo -e "${CYAN}📋 Finding Environment Files...${NC}"
echo "" >> "$OUTPUT_FILE"
echo "######## ENVIRONMENT FILES ########" >> "$OUTPUT_FILE"

find . \( -name ".env*" -o -name "*.env" \) -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | while read -r file; do
    echo "" >> "$OUTPUT_FILE"
    echo "============================================================" >> "$OUTPUT_FILE"
    echo "FILE: $file (CONTENT REDACTED FOR SECURITY)" >> "$OUTPUT_FILE"
    echo "============================================================" >> "$OUTPUT_FILE"
    echo "# Environment file exists but content not shown for security" >> "$OUTPUT_FILE"
    echo -e "${YELLOW}⚠️ Found (redacted): $file${NC}"
done

# 9. Prisma configs
add_pattern_files "schema.prisma" "PRISMA SCHEMA CONFIGURATIONS"

# 10. Drizzle configs
add_pattern_files "drizzle.config.*" "DRIZZLE CONFIGURATIONS"

# 11. ESLint configs
add_pattern_files ".eslintrc*" "ESLINT CONFIGURATIONS"
add_pattern_files "eslint.config.*" "ESLINT CONFIGURATIONS"

# 12. Prettier configs
add_pattern_files ".prettierrc*" "PRETTIER CONFIGURATIONS"
add_pattern_files "prettier.config.*" "PRETTIER CONFIGURATIONS"

# 13. Jest/Testing configs
add_pattern_files "jest.config.*" "JEST CONFIGURATIONS"
add_pattern_files "*.test.config.*" "TEST CONFIGURATIONS"

# 14. Webpack configs (if any)
add_pattern_files "webpack.config.*" "WEBPACK CONFIGURATIONS"

# 15. Babel configs
add_pattern_files ".babelrc*" "BABEL CONFIGURATIONS" 
add_pattern_files "babel.config.*" "BABEL CONFIGURATIONS"

# 16. Docker configs
add_pattern_files "Dockerfile*" "DOCKER CONFIGURATIONS"
add_pattern_files "docker-compose.*" "DOCKER COMPOSE CONFIGURATIONS"

# 17. GitHub configs
echo -e "${CYAN}📋 Finding GitHub Configurations...${NC}"
echo "" >> "$OUTPUT_FILE"
echo "######## GITHUB CONFIGURATIONS ########" >> "$OUTPUT_FILE"

find . -path "*/.github/*" -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | while read -r file; do
    add_file_content "$file"
done

# 18. Robots.txt and sitemap
add_pattern_files "robots.txt" "ROBOTS.TXT FILES"
add_pattern_files "sitemap.xml" "SITEMAP FILES"

# 19. Any other .config files
echo -e "${CYAN}📋 Finding Other Config Files...${NC}"
echo "" >> "$OUTPUT_FILE" 
echo "######## OTHER CONFIGURATION FILES ########" >> "$OUTPUT_FILE"

find . -name "*.config.*" -type f \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -name "vite.config.*" \
    -not -name "tailwind.config.*" \
    -not -name "postcss.config.*" \
    2>/dev/null | while read -r file; do
    add_file_content "$file"
done

# 20. JSON config files in config/ directories
echo -e "${CYAN}📋 Finding Config Directory Files...${NC}"
echo "" >> "$OUTPUT_FILE"
echo "######## CONFIG DIRECTORY FILES ########" >> "$OUTPUT_FILE"

find . -path "*/config/*" -name "*.json" -type f \
    -not -path "*/node_modules/*" \
    2>/dev/null | while read -r file; do
    add_file_content "$file"
done

# 21. Root-level important files
echo -e "${CYAN}📋 Adding Root-Level Important Files...${NC}"
echo "" >> "$OUTPUT_FILE"
echo "######## ROOT-LEVEL IMPORTANT FILES ########" >> "$OUTPUT_FILE"

ROOT_FILES=(
    "README.md"
    "replit.md" 
    "DEPLOYMENT_CHECKLIST.md"
    "setup-guide.md"
    ".gitignore"
    "LICENSE"
    "CHANGELOG.md"
)

for file in "${ROOT_FILES[@]}"; do
    if [ -f "./$file" ]; then
        add_file_content "./$file"
    fi
done

# Summary at the end
echo "" >> "$OUTPUT_FILE"
echo "============================================================" >> "$OUTPUT_FILE"
echo "CONFIGURATION SUMMARY" >> "$OUTPUT_FILE"
echo "============================================================" >> "$OUTPUT_FILE"
echo "Generated: $(date)" >> "$OUTPUT_FILE"
echo "Total configuration files found and included above." >> "$OUTPUT_FILE"
echo "Environment files were found but content redacted for security." >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo -e "${GREEN}✅ All configurations saved to: $OUTPUT_FILE${NC}"

# Show summary stats
echo ""
echo -e "${CYAN}📊 CONFIGURATION SUMMARY:${NC}"
echo -e "📦 Package.json files: ${GREEN}$(find . -name "package*.json" -not -path "*/node_modules/*" -not -path "*/efh-deployment-*/*" 2>/dev/null | wc -l)${NC}"
echo -e "⚙️ TypeScript configs: ${GREEN}$(find . -name "tsconfig*.json" -not -path "*/node_modules/*" 2>/dev/null | wc -l)${NC}"
echo -e "🎨 Tailwind configs: ${GREEN}$(find . -name "tailwind.config.*" -not -path "*/node_modules/*" 2>/dev/null | wc -l)${NC}"
echo -e "⚡ Vite configs: ${GREEN}$(find . -name "vite.config.*" -not -path "*/node_modules/*" 2>/dev/null | wc -l)${NC}"
echo -e "🌐 Vercel configs: ${GREEN}$(find . -name "vercel.json" -not -path "*/node_modules/*" 2>/dev/null | wc -l)${NC}"
echo -e "🔒 Environment files: ${YELLOW}$(find . \( -name ".env*" -o -name "*.env" \) -not -path "*/node_modules/*" 2>/dev/null | wc -l)${NC} (content redacted)"
echo -e "📋 Config directory files: ${GREEN}$(find . -path "*/config/*" -name "*.json" -not -path "*/node_modules/*" 2>/dev/null | wc -l)${NC}"
echo ""
echo -e "${BLUE}📄 Complete configuration file with all contents: $OUTPUT_FILE${NC}"
echo -e "${GREEN}�� Ready for copy-paste - all your configurations in one place!${NC}"
