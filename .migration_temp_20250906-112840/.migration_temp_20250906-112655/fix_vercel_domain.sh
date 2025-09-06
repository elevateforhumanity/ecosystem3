#!/usr/bin/env bash
set -euo pipefail

# ---- Required env ----
: "${VERCEL_TOKEN:?Please export VERCEL_TOKEN}"
: "${DOMAIN:?Please export DOMAIN (e.g., elevateforhumanity.org)}"
PRIMARY="${PRIMARY:-root}"                       # root | www
PROJECT_NAME="${VERCEL_PROJECT_NAME:-}"

WWW_DOMAIN="www.${DOMAIN}"

# ---- Helpers ----
say() { printf "\n%s\n" "$*"; }
have() { command -v "$1" >/dev/null 2>&1; }

# ---- Install Vercel CLI if needed ----
if ! have vercel; then
  say "Installing Vercel CLI..."
  npm i -g vercel@latest
fi

# ---- Link project ----
if [[ -n "$PROJECT_NAME" ]]; then
  say "Linking to Vercel project: $PROJECT_NAME"
  vercel link --project "$PROJECT_NAME" --yes --token "$VERCEL_TOKEN" >/dev/null
else
  say "Linking this folder to a Vercel project (auto)."
  vercel link --yes --token "$VERCEL_TOKEN"
fi

# ---- Create vercel.json redirects (idempotent) ----
# PRIMARY=root => redirect www -> root
# PRIMARY=www  => redirect root -> www
cat > vercel.json <<'JSON'
{
  "redirects": []
}
JSON

if [[ "$PRIMARY" == "root" ]]; then
  # www -> root
  jq '.redirects += [{"source": "https://www.__DOMAIN__/(.*)", "destination": "https://__DOMAIN__/$1", "permanent": true}]' \
    vercel.json | sed "s/__DOMAIN__/${DOMAIN}/g" > vercel.json.tmp && mv vercel.json.tmp vercel.json
else
  # root -> www
  jq '.redirects += [{"source": "https://__DOMAIN__/(.*)", "destination": "https://www.__DOMAIN__/$1", "permanent": true}]' \
    vercel.json | sed "s/__DOMAIN__/${DOMAIN}/g" > vercel.json.tmp && mv vercel.json.tmp vercel.json
fi

# ---- Deploy to production ----
say "Deploying to Vercel (prod)..."
DEPLOY_URL="$(vercel deploy --prod --token "$VERCEL_TOKEN" | tail -n1)"
say "Deployed: $DEPLOY_URL"

# ---- Ensure domains exist on account ----
say "Adding domains to Vercel account (safe to re-run)..."
vercel domains add "$DOMAIN" --token "$VERCEL_TOKEN" || true
vercel domains add "$WWW_DOMAIN" --token "$VERCEL_TOKEN" || true

# ---- Alias deployment to domains ----
say "Aliasing deployment to $DOMAIN and $WWW_DOMAIN..."
vercel alias set "$DEPLOY_URL" "$DOMAIN" --token "$VERCEL_TOKEN" || true
vercel alias set "$DEPLOY_URL" "$WWW_DOMAIN" --token "$VERCEL_TOKEN" || true

# ---- Show DNS instructions you must paste at your registrar ----
say "DNS records required for $DOMAIN:"
vercel domains inspect "$DOMAIN" --token "$VERCEL_TOKEN" || true

say "DNS records required for $WWW_DOMAIN:"
vercel domains inspect "$WWW_DOMAIN" --token "$VERCEL_TOKEN" || true

# ---- Friendly summary ----
say "✅ Done.
1) Login to your domain registrar DNS.
2) Add the records shown above (A record for root, CNAME for www — or as Vercel recommends).
3) Wait a few minutes; pick the Primary domain in Vercel if needed (we set redirects via vercel.json).
"