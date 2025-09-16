#!/usr/bin/env bash
set -euo pipefail

# SEO & Domain Configuration Script (Codespaces-safe)
# - Idempotent: updates .env via upsert, preserves/backs up robots.txt
# - Integrates with existing scripts: seo:meta:all, sitemaps:generate, sitemaps:ping

echo "🌐 SEO & Domain Setup..."
echo "========================"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

prompt() {
  local message="$1" var="$2" default="${3:-}"
  local current="${!var:-}"
  local shown_default="$current"
  if [[ -z "$shown_default" && -n "$default" ]]; then shown_default="$default"; fi
  if [[ -n "$shown_default" ]]; then
    echo -e "${BLUE}$message${NC} [${YELLOW}$shown_default${NC}]"
  else
    echo -e "${BLUE}$message${NC}"
  fi
  read -r value || value=""
  if [[ -z "$value" && -n "$shown_default" ]]; then value="$shown_default"; fi
  eval "$var=\"$value\""
}

upsert_env() {
  local key="$1" val="$2" file=".env"
  touch "$file"
  if grep -qE "^${key}=" "$file"; then
    sed -i "s|^${key}=.*|${key}=${val}|" "$file"
  else
    echo "${key}=${val}" >> "$file"
  fi
}

ensure_line_once() {
  local file="$1" line="$2"
  grep -qxF "$line" "$file" 2>/dev/null || echo "$line" >> "$file"
}

echo ""
echo -e "${YELLOW}Domain & Analytics${NC}"
prompt "CANONICAL_DOMAIN (e.g., https://elevateforhumanity.org)" CANONICAL_DOMAIN "${CANONICAL_DOMAIN:-}"
prompt "GOOGLE_ANALYTICS_ID (e.g., G-XXXX)" GOOGLE_ANALYTICS_ID "${GOOGLE_ANALYTICS_ID:-}"
prompt "GOOGLE_SITE_VERIFICATION (meta content value)" GOOGLE_SITE_VERIFICATION "${GOOGLE_SITE_VERIFICATION:-}"
prompt "BING_SITE_VERIFICATION (optional)" BING_SITE_VERIFICATION "${BING_SITE_VERIFICATION:-}"
prompt "CONTACT_EMAIL (optional)" CONTACT_EMAIL "${CONTACT_EMAIL:-contact@elevateforhumanity.org}"

echo -e "\n${BLUE}Writing env (.env upsert)...${NC}"
upsert_env CANONICAL_DOMAIN "$CANONICAL_DOMAIN"
upsert_env GOOGLE_ANALYTICS_ID "$GOOGLE_ANALYTICS_ID"
upsert_env GOOGLE_SITE_VERIFICATION "$GOOGLE_SITE_VERIFICATION"
upsert_env BING_SITE_VERIFICATION "${BING_SITE_VERIFICATION:-}"
upsert_env CONTACT_EMAIL "${CONTACT_EMAIL:-}"

export CANONICAL_DOMAIN GOOGLE_ANALYTICS_ID GOOGLE_SITE_VERIFICATION BING_SITE_VERIFICATION CONTACT_EMAIL

echo -e "\n${BLUE}Creating verification files...${NC}"
cat > google-site-verification.html <<EOF
<!DOCTYPE html>
<html><head>
<meta name="google-site-verification" content="$GOOGLE_SITE_VERIFICATION" />
<title>Google Site Verification</title>
</head><body>Google verification.</body></html>
EOF

if [[ -n "${BING_SITE_VERIFICATION:-}" ]]; then
  cat > bing-site-verification.html <<EOF
<!DOCTYPE html>
<html><head>
<meta name="msvalidate.01" content="$BING_SITE_VERIFICATION" />
<title>Bing Site Verification</title>
</head><body>Bing verification.</body></html>
EOF
fi

echo -e "\n${BLUE}Updating robots.txt (backed up if exists)...${NC}"
if [[ -f robots.txt ]]; then
  cp robots.txt robots.txt.bak
else
  printf "User-agent: *\nAllow: /\n" > robots.txt
fi
ensure_line_once robots.txt "Sitemap: ${CANONICAL_DOMAIN%/}/sitemap.xml"
ensure_line_once robots.txt "Allow: /robots.txt"
ensure_line_once robots.txt "Allow: /sitemap.xml"

echo -e "\n${BLUE}Running meta & sitemaps...${NC}"
if npm run -s seo:meta:all; then
  echo -e "${GREEN}✓ Meta updated${NC}"
else
  echo -e "${RED}✗ Meta update failed (continuing)${NC}"
fi

if npm run -s sitemaps:generate; then
  echo -e "${GREEN}✓ Sitemaps generated${NC}"
  npm run -s sitemaps:ping || echo -e "${YELLOW}⚠ Sitemap ping skipped/failed${NC}"
else
  echo -e "${RED}✗ Sitemap generation failed${NC}"
fi

echo -e "\n${GREEN}Done.${NC} Domain: $CANONICAL_DOMAIN"
echo "- Verification files: google-site-verification.html${BING_SITE_VERIFICATION:+, bing-site-verification.html}"
echo "- robots.txt updated (backup: robots.txt.bak if existed)"
echo "- You can re-run safely anytime."
