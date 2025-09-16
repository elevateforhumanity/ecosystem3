#!/usr/bin/env bash
set -euo pipefail

# List ONLY Project Files (Excluding Dependencies & Backups)
echo "📂 PROJECT FILES ONLY - Elevate for Humanity"
echo "============================================="

# Color codes  
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

OUTPUT_FILE="project-files-only.txt"

echo -e "${BLUE}🔍 Scanning project files (excluding dependencies)...${NC}"

# Count actual project files (excluding node_modules, backups, etc.)
PROJECT_FILES=$(find . -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/efh-deployment-*/*" \
  -not -path "*/efh-ecosystem3-*/*" \
  -not -path "*/.replit/*" \
  -not -path "*/.upm/*" \
  -not -path "*/attached_assets/Pasted-*" \
  2>/dev/null | wc -l)

echo -e "${YELLOW}📊 Found $PROJECT_FILES actual project files${NC}"

# Create clean project file listing
cat > "$OUTPUT_FILE" << HEADER
ELEVATE FOR HUMANITY - PROJECT FILES ONLY
==========================================
Generated: $(date)
Actual Project Files: $PROJECT_FILES
(Excludes: node_modules, git, deployment backups, pasted assets)

HEADER

# Main project files by category
echo "MAIN PROJECT STRUCTURE:" >> "$OUTPUT_FILE"
echo "=======================" >> "$OUTPUT_FILE"
find . -maxdepth 2 -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/efh-deployment-*/*" \
  -not -path "*/efh-ecosystem3-*/*" \
  -not -path "*/.replit/*" \
  2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# HTML Pages
echo "HTML PAGES:" >> "$OUTPUT_FILE"
echo "===========" >> "$OUTPUT_FILE"
find . -name "*.html" -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/efh-deployment-*/*" \
  -not -path "*/efh-ecosystem3-*/*" \
  2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# JavaScript/TypeScript (Your Code)
echo "YOUR JAVASCRIPT/TYPESCRIPT:" >> "$OUTPUT_FILE"
echo "============================" >> "$OUTPUT_FILE"
find . \( -name "*.js" -o -name "*.mjs" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/efh-deployment-*/*" \
  -not -path "*/efh-ecosystem3-*/*" \
  2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# CSS/Styles
echo "STYLES:" >> "$OUTPUT_FILE"
echo "=======" >> "$OUTPUT_FILE"
find . \( -name "*.css" -o -name "*.scss" -o -name "*.sass" \) -type f \
  -not -path "*/node_modules/*" \
  2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Config Files
echo "CONFIG FILES:" >> "$OUTPUT_FILE"
echo "=============" >> "$OUTPUT_FILE"
find . \( -name "*.json" -o -name "package*.json" -o -name "*.config.*" -o -name "tsconfig*" -o -name "tailwind*" -o -name "vite*" -o -name "vercel*" \) -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/efh-deployment-*/*" \
  2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Images (Your Assets)
echo "PROJECT IMAGES:" >> "$OUTPUT_FILE"
echo "===============" >> "$OUTPUT_FILE"
find . \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.svg" -o -name "*.gif" -o -name "*.webp" \) -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/attached_assets/Pasted-*" \
  2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Scripts & Tools
echo "SCRIPTS & TOOLS:" >> "$OUTPUT_FILE"
echo "================" >> "$OUTPUT_FILE"
find . \( -name "*.sh" -o -name "*.py" \) -type f \
  -not -path "*/node_modules/*" \
  2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Documentation
echo "DOCUMENTATION:" >> "$OUTPUT_FILE"
echo "=============" >> "$OUTPUT_FILE"
find . \( -name "*.md" -o -name "*.txt" \) -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/attached_assets/Pasted-*" \
  2>/dev/null | head -20 | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Complete project file list (clean)
echo "COMPLETE PROJECT FILE LIST:" >> "$OUTPUT_FILE"
echo "===========================" >> "$OUTPUT_FILE"
find . -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/efh-deployment-*/*" \
  -not -path "*/efh-ecosystem3-*/*" \
  -not -path "*/.replit/*" \
  -not -path "*/.upm/*" \
  -not -path "*/attached_assets/Pasted-*" \
  2>/dev/null | sort >> "$OUTPUT_FILE"

echo -e "${GREEN}✅ Clean project file list saved to: $OUTPUT_FILE${NC}"

# Show summary
echo ""
echo -e "${BLUE}📊 PROJECT FILES SUMMARY:${NC}"
echo -e "🎯 Your actual project files: ${YELLOW}$PROJECT_FILES${NC}"
echo -e "📄 HTML pages: ${GREEN}$(find . -name "*.html" -type f -not -path "*/node_modules/*" -not -path "*/efh-deployment-*/*" 2>/dev/null | wc -l)${NC}"
echo -e "💻 JS/TS files: ${GREEN}$(find . \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) -type f -not -path "*/node_modules/*" -not -path "*/efh-deployment-*/*" 2>/dev/null | wc -l)${NC}"
echo -e "🎨 CSS files: ${GREEN}$(find . -name "*.css" -type f -not -path "*/node_modules/*" 2>/dev/null | wc -l)${NC}"
echo -e "📷 Images: ${GREEN}$(find . \( -name "*.png" -o -name "*.jpg" -o -name "*.svg" \) -type f -not -path "*/node_modules/*" -not -path "*/attached_assets/Pasted-*" 2>/dev/null | wc -l)${NC}"

echo ""
echo -e "${YELLOW}💡 This excludes 180,000+ dependency/backup files${NC}"
echo -e "${GREEN}🎉 Now you have a manageable, copy-paste ready project file list!${NC}"
