#!/usr/bin/env bash
set -euo pipefail

# Complete File Listing Script for Copy-Paste
echo "📂 COMPLETE FILE LISTING - Elevate for Humanity Project"
echo "======================================================="

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

# Output file
OUTPUT_FILE="complete-file-list.txt"

echo -e "${BLUE}🔍 Scanning all files in project...${NC}"

# Create comprehensive file listing
cat > "$OUTPUT_FILE" << HEADER
COMPLETE FILE LISTING - Elevate for Humanity Project
===================================================
Generated: $(date)
Total Project Files & Directories
==================================

HEADER

echo -e "${YELLOW}📊 Generating complete file listing...${NC}"

# Get total count first
TOTAL_FILES=$(find . -type f 2>/dev/null | wc -l)
TOTAL_DIRS=$(find . -type d 2>/dev/null | wc -l)

echo "PROJECT STATISTICS:" >> "$OUTPUT_FILE"
echo "Total Files: $TOTAL_FILES" >> "$OUTPUT_FILE"
echo "Total Directories: $TOTAL_DIRS" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Directory structure overview
echo "DIRECTORY STRUCTURE OVERVIEW:" >> "$OUTPUT_FILE"
echo "=============================" >> "$OUTPUT_FILE"
tree -a -I 'node_modules|.git|.replit|.upm' . 2>/dev/null >> "$OUTPUT_FILE" || {
    echo "Tree command not available, using alternative..." >> "$OUTPUT_FILE"
    find . -type d 2>/dev/null | head -100 | sort >> "$OUTPUT_FILE"
}
echo "" >> "$OUTPUT_FILE"

# Main directories
echo "MAIN DIRECTORIES:" >> "$OUTPUT_FILE"
echo "=================" >> "$OUTPUT_FILE"
find . -maxdepth 2 -type d 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# All HTML files
echo "ALL HTML FILES:" >> "$OUTPUT_FILE"
echo "===============" >> "$OUTPUT_FILE"
find . -name "*.html" -type f 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# All JavaScript/TypeScript files
echo "ALL JAVASCRIPT/TYPESCRIPT FILES:" >> "$OUTPUT_FILE"
echo "================================" >> "$OUTPUT_FILE"
find . \( -name "*.js" -o -name "*.mjs" -o -name "*.cjs" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" \) -type f 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# All CSS files
echo "ALL CSS/STYLING FILES:" >> "$OUTPUT_FILE"
echo "=======================" >> "$OUTPUT_FILE"
find . \( -name "*.css" -o -name "*.scss" -o -name "*.sass" -o -name "*.less" \) -type f 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# All JSON/Config files
echo "ALL JSON/CONFIG FILES:" >> "$OUTPUT_FILE"
echo "=======================" >> "$OUTPUT_FILE"
find . \( -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.toml" -o -name "*.ini" -o -name "*.config.*" \) -type f 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# All Image files
echo "ALL IMAGE FILES:" >> "$OUTPUT_FILE"
echo "================" >> "$OUTPUT_FILE"
find . \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.ico" \) -type f 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# All Markdown/Text files
echo "ALL MARKDOWN/TEXT FILES:" >> "$OUTPUT_FILE"
echo "========================" >> "$OUTPUT_FILE"
find . \( -name "*.md" -o -name "*.txt" -o -name "*.rst" -o -name "*.doc" \) -type f 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# All Shell/Script files
echo "ALL SHELL/SCRIPT FILES:" >> "$OUTPUT_FILE"
echo "=======================" >> "$OUTPUT_FILE"
find . \( -name "*.sh" -o -name "*.bash" -o -name "*.zsh" -o -name "*.fish" -o -name "*.py" -o -name "*.rb" -o -name "*.pl" \) -type f 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Database/Schema files
echo "ALL DATABASE/SCHEMA FILES:" >> "$OUTPUT_FILE"
echo "==========================" >> "$OUTPUT_FILE"
find . \( -name "*.sql" -o -name "*.db" -o -name "*.sqlite*" -o -name "*schema*" -o -name "*prisma*" \) -type f 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# All other files (catch-all)
echo "ALL OTHER FILES:" >> "$OUTPUT_FILE"
echo "================" >> "$OUTPUT_FILE"
find . -type f ! \( -name "*.html" -o -name "*.js" -o -name "*.mjs" -o -name "*.cjs" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" -o -name "*.css" -o -name "*.scss" -o -name "*.sass" -o -name "*.less" -o -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.toml" -o -name "*.ini" -o -name "*.config.*" -o -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.ico" -o -name "*.md" -o -name "*.txt" -o -name "*.rst" -o -name "*.doc" -o -name "*.sh" -o -name "*.bash" -o -name "*.zsh" -o -name "*.fish" -o -name "*.py" -o -name "*.rb" -o -name "*.pl" -o -name "*.sql" -o -name "*.db" -o -name "*.sqlite*" \) 2>/dev/null | sort >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# COMPLETE alphabetical listing
echo "COMPLETE ALPHABETICAL FILE LISTING:" >> "$OUTPUT_FILE"
echo "====================================" >> "$OUTPUT_FILE"
find . -type f 2>/dev/null | sort >> "$OUTPUT_FILE"

echo -e "${GREEN}✅ Complete file listing saved to: $OUTPUT_FILE${NC}"

# Display summary
echo ""
echo -e "${CYAN}📊 PROJECT SUMMARY:${NC}"
echo -e "📁 Total Directories: ${YELLOW}$TOTAL_DIRS${NC}"
echo -e "📄 Total Files: ${YELLOW}$TOTAL_FILES${NC}"
echo ""

# Show file by extension counts
echo -e "${CYAN}📊 FILE TYPE BREAKDOWN:${NC}"
echo -e "HTML files: ${GREEN}$(find . -name "*.html" -type f 2>/dev/null | wc -l)${NC}"
echo -e "JavaScript/TypeScript files: ${GREEN}$(find . \( -name "*.js" -o -name "*.mjs" -o -name "*.cjs" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" \) -type f 2>/dev/null | wc -l)${NC}"
echo -e "CSS/Style files: ${GREEN}$(find . \( -name "*.css" -o -name "*.scss" -o -name "*.sass" -o -name "*.less" \) -type f 2>/dev/null | wc -l)${NC}"
echo -e "JSON/Config files: ${GREEN}$(find . \( -name "*.json" -o -name "*.yaml" -o -name "*.yml" -o -name "*.toml" -o -name "*.ini" -o -name "*.config.*" \) -type f 2>/dev/null | wc -l)${NC}"
echo -e "Image files: ${GREEN}$(find . \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.webp" -o -name "*.ico" \) -type f 2>/dev/null | wc -l)${NC}"
echo -e "Markdown/Text files: ${GREEN}$(find . \( -name "*.md" -o -name "*.txt" -o -name "*.rst" -o -name "*.doc" \) -type f 2>/dev/null | wc -l)${NC}"
echo -e "Shell/Script files: ${GREEN}$(find . \( -name "*.sh" -o -name "*.bash" -o -name "*.zsh" -o -name "*.fish" -o -name "*.py" -o -name "*.rb" -o -name "*.pl" \) -type f 2>/dev/null | wc -l)${NC}"

echo ""
echo -e "${BLUE}📋 COPY-PASTE READY FILE LIST SAVED TO:${NC} $OUTPUT_FILE"
echo -e "${YELLOW}💡 You can now copy the entire contents of $OUTPUT_FILE${NC}"

# Also create a simple list version for easy copy-paste
SIMPLE_OUTPUT="simple-file-list.txt"
echo -e "${BLUE}📝 Creating simple copy-paste version...${NC}"

find . -type f 2>/dev/null | sort > "$SIMPLE_OUTPUT"

echo -e "${GREEN}✅ Simple file list saved to: $SIMPLE_OUTPUT${NC}"
echo ""
echo -e "${CYAN}🎯 TWO VERSIONS CREATED:${NC}"
echo -e "1. ${YELLOW}$OUTPUT_FILE${NC} - Detailed categorized listing"
echo -e "2. ${YELLOW}$SIMPLE_OUTPUT${NC} - Simple list for copy-paste"
echo ""
echo -e "${GREEN}🎉 All files catalogued and ready for copy-paste!${NC}"
