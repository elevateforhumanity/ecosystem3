#!/usr/bin/env bash
set -euo pipefail

# Minimal Stripe setup: collect publishable key (frontend) and optional webhook secret.
# - Writes/updates values in .env (root)
# - Does NOT handle STRIPE_SECRET_KEY (server secret) to avoid accidental leakage
# - Injects a meta tag across HTML via scripts/inject-stripe-publishable-meta.js

echo "\n💳 Stripe setup (minimal)"

# Colors (optional)
BLUE='\033[0;34m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
ENV_FILE="$ROOT_DIR/.env"

prompt() {
  local label="$1"; local secret="${2:-false}"; local value
  echo -e "${BLUE}${label}${NC}" >&2
  if [[ "$secret" == "true" ]]; then
    read -r -s value
    echo "" >&2
  else
    read -r value
  fi
  echo "$value"
}

upsert_env() {
  local file="$1"; local key="$2"; local val="$3";
  mkdir -p "$(dirname "$file")"
  touch "$file"
  if grep -qE "^${key}=" "$file"; then
    # Replace existing line
    sed -i "s#^${key}=.*#${key}=${val//#/\\#}#" "$file"
  else
    printf "\n%s=%s\n" "$key" "$val" >> "$file"
  fi
}

# Read current values if present
existing_pk="${VITE_STRIPE_PUBLIC_KEY:-}"
existing_whsec="${STRIPE_WEBHOOK_SECRET:-}"

if [[ -z "$existing_pk" ]] && grep -qE '^VITE_STRIPE_PUBLIC_KEY=' "$ENV_FILE" 2>/dev/null; then
  existing_pk=$(grep -E '^VITE_STRIPE_PUBLIC_KEY=' "$ENV_FILE" | head -n1 | cut -d= -f2-)
fi
if [[ -z "$existing_whsec" ]] && grep -qE '^STRIPE_WEBHOOK_SECRET=' "$ENV_FILE" 2>/dev/null; then
  existing_whsec=$(grep -E '^STRIPE_WEBHOOK_SECRET=' "$ENV_FILE" | head -n1 | cut -d= -f2-)
fi

# Prompt for publishable key
echo -e "${YELLOW}Enter your Stripe publishable key (pk_live_ or pk_test_).${NC}"
if [[ -n "$existing_pk" ]]; then
  echo -e "Found existing: ${GREEN}${existing_pk:0:12}...${NC}"
fi
while :; do
  read -r -p "VITE_STRIPE_PUBLIC_KEY: " pk
  pk=${pk:-$existing_pk}
  if [[ -z "$pk" ]]; then
    echo -e "${RED}Publishable key cannot be empty.${NC}" >&2
    continue
  fi
  if [[ "$pk" != pk_live_* && "$pk" != pk_test_* ]]; then
    echo -e "${RED}Key must start with pk_live_ or pk_test_.${NC}" >&2
    continue
  fi
  break
done

# Prompt for webhook secret (optional)
echo -e "${YELLOW}Optional: enter your Stripe webhook secret (whsec_...). Press Enter to skip.${NC}"
read -r -p "STRIPE_WEBHOOK_SECRET: " whsec
whsec=${whsec:-$existing_whsec}

# Upsert into .env (no quotes to keep compatibility)
upsert_env "$ENV_FILE" "VITE_STRIPE_PUBLIC_KEY" "$pk"
if [[ -n "$whsec" ]]; then
  upsert_env "$ENV_FILE" "STRIPE_WEBHOOK_SECRET" "$whsec"
fi

echo -e "${GREEN}✅ Wrote to ${ENV_FILE}${NC}"

# Inject meta tag across HTML using our script
node "$ROOT_DIR/scripts/inject-stripe-publishable-meta.js" || true

echo -e "${GREEN}Done. Key: ${pk:0:12}...${NC}\n"
