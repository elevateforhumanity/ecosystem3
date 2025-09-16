#!/usr/bin/env bash
set -euo pipefail
# Env needed:
# CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID
# NETLIFY_BUILD_HOOK_URL
PURGE_URLS="${PURGE_URLS:-}"
say(){ printf "\n\033[1m%s\033[0m\n" "$*"; }

purge_cloudflare(){
  if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] || [ -z "${CLOUDFLARE_ZONE_ID:-}" ]; then
    echo "⚠️  Skipping Cloudflare (missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID)"; return 0; fi
  say "🚿 Cloudflare: purging cache…"
  if [ -n "$PURGE_URLS" ]; then
    json='{"files":['; first=1
    for u in $PURGE_URLS; do if [ $first -eq 1 ]; then first=0; else json+=','; fi; json+="\"$u\""; done
    json+=']}'
    curl -fsS -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
      --data "$json" "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
      && echo "✅ Cloudflare purged specific URLs."
  else
    curl -fsS -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
      --data '{"purge_everything":true}' "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
      && echo "✅ Cloudflare purge_everything completed."
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
