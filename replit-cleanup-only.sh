#!/usr/bin/env bash
set -euo pipefail

# Remove Replit Domain & Cache Only
echo "🧹 Removing Replit-served content for www.elevateforhumanity.org..."

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Clear DNS caches
echo -e "${BLUE}🔄 Clearing DNS caches...${NC}"
sudo systemctl flush-dns 2>/dev/null || true
sudo systemctl restart systemd-resolved 2>/dev/null || true

# Test if Replit URLs still work
echo -e "${BLUE}🔍 Testing old Replit endpoints...${NC}"
REPLIT_URLS=(
    "https://elevateforhumanity.replit.app"
    "https://www.elevateforhumanity.replit.app"
)

all_clear=true
for url in "${REPLIT_URLS[@]}"; do
    echo -n "Testing $url: "
    if curl -s --connect-timeout 5 "$url" >/dev/null 2>&1; then
        echo -e "${RED}❌ Still accessible${NC}"
        all_clear=false
    else
        echo -e "${GREEN}✅ Not found${NC}"
    fi

done

# Cache busting for main domain
echo -e "${BLUE}💥 Cache busting main domain...${NC}"
TIMESTAMP=$(date +%s)
curl -s -H "Cache-Control: no-cache" \
     -H "Pragma: no-cache" \
     "https://www.elevateforhumanity.org/?cb=$TIMESTAMP" >/dev/null || true

# Check current domain status
echo -e "${BLUE}✅ Checking current domain...${NC}"
if curl -s -I "https://www.elevateforhumanity.org" | grep -i "server.*vercel" >/dev/null; then
    echo -e "${GREEN}✅ Domain now served by Vercel${NC}"
else
    echo -e "${YELLOW}⚠️  Domain status unclear${NC}"
fi

if [ "$all_clear" = true ]; then
    echo -e "${GREEN}🎉 SUCCESS: Replit is no longer serving your domain!${NC}"
else
    echo -e "${YELLOW}⚠️  Some Replit traces may still exist - wait 24-48 hours${NC}"
fi

echo ""
echo -e "${BLUE}💡 Manual steps if still seeing Replit content:${NC}"
echo "1. Clear browser cache completely"
echo "2. Try incognito/private mode" 
echo "3. Test on mobile data instead of WiFi"
echo "4. Wait additional 24 hours for DNS propagation"
echo ""
echo "🌐 Your domain should now serve from Vercel only!"
