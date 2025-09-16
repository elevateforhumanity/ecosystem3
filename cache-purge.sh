#!/usr/bin/env bash
set -euo pipefail
# Env needed:
# CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID
# NETLIFY_BUILD_HOOK_URL

# Set Cloudflare credentials from previous builds
export CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-7W2pnC5oQxQKewWDjTLKB-1tY9Zd9xqEpA9qjyoB}"
export CLOUDFLARE_ZONE_ID="${CLOUDFLARE_ZONE_ID:-0cde07dbe1f6b3e3c25ec30421ee7ced}"

PURGE_URLS="${PURGE_URLS:-}"
say(){ printf "\n\033[1m%s\033[0m\n" "$*"; }

purge_cloudflare(){
  if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] || [ -z "${CLOUDFLARE_ZONE_ID:-}" ]; then
    echo "⚠️  Skipping Cloudflare (missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID)"; return 0; fi
  say "🚿 Cloudflare: purging cache…"
  
  # Test API access first
  if ! curl -s -f -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" >/dev/null 2>&1; then
    echo "⚠️  Cloudflare API access failed - check token permissions"; return 0; fi
  if [ -n "$PURGE_URLS" ]; then
    json='{"files":['; first=1
    for u in $PURGE_URLS; do if [ $first -eq 1 ]; then first=0; else json+=','; fi; json+="\"$u\""; done
    json+=']}'
    if curl -fsS -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
      --data "$json" "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" 2>/dev/null; then
      echo "✅ Cloudflare purged specific URLs."
    else
      echo "⚠️  Cloudflare purge failed - token may need 'Zone:Cache Purge' permission"
    fi
  else
    if curl -fsS -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
      --data '{"purge_everything":true}' "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" 2>/dev/null; then
      echo "✅ Cloudflare purge_everything completed."
    else
      echo "⚠️  Cloudflare purge failed - token may need 'Zone:Cache Purge' permission"
    fi
  fi
}

trigger_netlify_build(){
  if [ -z "${NETLIFY_BUILD_HOOK_URL:-}" ]; then
    echo "⚠️  Skipping Netlify build (missing NETLIFY_BUILD_HOOK_URL)"; return 0; fi
  say "🏗️  Netlify: triggering build hook…"
  curl -fsS -X POST -d '{}' "$NETLIFY_BUILD_HOOK_URL" \
    && echo "✅ Netlify build triggered."
}

purge_cloudflare
trigger_netlify_build
say "✨ Cache purge finished."
