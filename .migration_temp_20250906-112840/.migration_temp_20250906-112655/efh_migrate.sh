#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n%s\n" "$*"; }
need(){ command -v "$1" >/dev/null 2>&1 || { echo "Missing $1"; exit 1; }; }

# ===== Env / inputs =====
: "${S3_BUCKET:?Set S3_BUCKET}"
: "${S3_ENDPOINT:?Set S3_ENDPOINT}"
: "${AWS_ACCESS_KEY_ID:?Set AWS_ACCESS_KEY_ID}"
: "${AWS_SECRET_ACCESS_KEY:?Set AWS_SECRET_ACCESS_KEY}"
: "${GIT_REMOTE:?Set GIT_REMOTE}"

VERCEL_TOKEN="${VERCEL_TOKEN:-}"
VERCEL_PROJECT_NAME="${VERCEL_PROJECT_NAME:-}"

ROOT_DOMAIN="${ROOT_DOMAIN:-example.com}"
PRIMARY_DOMAIN="${PRIMARY_DOMAIN:-root}"   # root | www
APP_SUBDOMAIN="${APP_SUBDOMAIN:-}"         # optional (e.g., "app")
DURABLE_TARGET="${DURABLE_TARGET:-}"       # optional

TS="$(date +%Y%m%d-%H%M%S)"
OUTDIR="exports"
CODE_TAR="$OUTDIR/code-only-$TS.tar.gz"
ASSET_TAR="$OUTDIR/assets-only-$TS.tar.gz"

mkdir -p "$OUTDIR"

# ===== Tools =====
if ! command -v aws >/dev/null 2>&1; then
  say "Installing AWS CLI (user scope)..."
  pip install --user awscli >/dev/null 2>&1 || true
  export PATH="$HOME/.local/bin:$PATH"
fi
if ! command -v vercel >/dev/null 2>&1 && [ -n "$VERCEL_TOKEN" ]; then
  say "Installing Vercel CLI..."
  npm i -g vercel@latest >/dev/null 2>&1 || true
fi
need tar; need gzip; need git

# ===== Build CODE archive (GitHub-safe) =====
say "→ Creating CODE archive (excludes node_modules, dist, build, caches, .git, assets folders)"
tar -I 'gzip -9' -chpf "$CODE_TAR" \
  --exclude='./.git' \
  --exclude='./node_modules' --exclude='./*/node_modules' \
  --exclude='./dist' --exclude='./*/dist' \
  --exclude='./build' --exclude='./*/build' \
  --exclude='./.next' --exclude='./*/.next' \
  --exclude='./out' --exclude='./*/out' \
  --exclude='./.cache' --exclude='./*/.cache' \
  --exclude='./coverage' --exclude='./*/coverage' \
  --exclude='./.vercel' --exclude='./*/.vercel' \
  --exclude='./tmp' --exclude='./*/tmp' \
  --exclude='./exports' \
  --exclude='./assets' --exclude='./static' --exclude='./public/assets' \
  --exclude='*.log' \
  .

# ===== Build ASSETS archive (best-effort) =====
say "→ Creating ASSETS archive (assets/, static/, public/assets/ if present)"
tar -I 'gzip -9' -chpf "$ASSET_TAR" \
  ./assets ./static ./public/assets 2>/dev/null || true

say "→ Archives created:"
du -h "$CODE_TAR" 2>/dev/null || true
du -h "$ASSET_TAR" 2>/dev/null || true

# ===== Upload to R2 =====
say "→ Uploading archives to R2: s3://$S3_BUCKET"
aws s3 cp "$CODE_TAR"  "s3://$S3_BUCKET/" --endpoint-url "$S3_ENDPOINT"
[ -f "$ASSET_TAR" ] && aws s3 cp "$ASSET_TAR" "s3://$S3_BUCKET/" --endpoint-url "$S3_ENDPOINT" || true

# ===== Prepare CLEAN Git repo (code only) and push =====
say "→ Preparing clean Git repo (code only)"
WORKDIR=".export_code_$TS"
mkdir -p "$WORKDIR"
tar -xzf "$CODE_TAR" -C "$WORKDIR"

cat > "$WORKDIR/.gitignore" <<'IGN'
node_modules/
dist/
build/
.next/
out/
.cache/
coverage/
*.log
.env
.env.*
exports/
tmp/
assets/
static/
public/assets/
IGN

( cd "$WORKDIR"
  git init >/dev/null 2>&1 || true
  git add .
  git commit -m "Initial commit: code-only export ($TS)" || true
  git branch -M main
  if git remote | grep -q origin; then
    git remote set-url origin "$GIT_REMOTE"
  else
    git remote add origin "$GIT_REMOTE"
  fi
  say "→ Pushing to $GIT_REMOTE"
  git push -u origin main --force
)

# ===== Vercel: link, deploy, domains =====
DEPLOY_URL=""
if [ -n "$VERCEL_TOKEN" ] && command -v vercel >/dev/null 2>&1; then
  say "→ Vercel: linking & deploying (prod)"
  if [ -n "$VERCEL_PROJECT_NAME" ]; then
    vercel link --project "$VERCEL_PROJECT_NAME" --yes --token "$VERCEL_TOKEN" >/dev/null || true
  else
    vercel link --yes --token "$VERCEL_TOKEN" || true
  fi
  DEPLOY_URL="$(vercel deploy --prod --token "$VERCEL_TOKEN" | tail -n1 || true)"
  [ -n "$DEPLOY_URL" ] && say "   Deployed: $DEPLOY_URL"

  ROOT="$ROOT_DOMAIN"
  WWW="www.$ROOT_DOMAIN"
  APP=""
  [ -n "$APP_SUBDOMAIN" ] && APP="$APP_SUBDOMAIN.$ROOT_DOMAIN"

  # Add domains (idempotent)
  vercel domains add "$ROOT" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
  vercel domains add "$WWW"  --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
  [ -n "$APP" ] && vercel domains add "$APP" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true

  # Alias current deploy to domains (safe to re-run)
  if [ -n "$DEPLOY_URL" ]; then
    vercel alias set "$DEPLOY_URL" "$ROOT" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
    vercel alias set "$DEPLOY_URL" "$WWW"  --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
    [ -n "$APP" ] && vercel alias set "$DEPLOY_URL" "$APP" --token "$VERCEL_TOKEN" >/dev/null 2>&1 || true
  fi

  say "→ DNS you need to set at your registrar:"
  say "  Inspect $ROOT"
  vercel domains inspect "$ROOT" --token "$VERCEL_TOKEN" || true
  say "  Inspect $WWW"
  vercel domains inspect "$WWW" --token "$VERCEL_TOKEN" || true
  if [ -n "$APP" ]; then
    say "  Inspect $APP"
    vercel domains inspect "$APP" --token "$VERCEL_TOKEN" || true
  fi
else
  say "→ Skipping Vercel step (no VERCEL_TOKEN). You can re-run later after exporting VERCEL_TOKEN."
fi

# ===== Final summary =====
say "✅ ALL DONE

What I did:
  1) Built archives:
       - $CODE_TAR
       - $ASSET_TAR
  2) Uploaded to R2:  s3://$S3_BUCKET   (endpoint: $S3_ENDPOINT)
  3) Pushed CLEAN code to GitHub: $GIT_REMOTE
  4) Vercel: linked/deployed & domains updated (if token provided)

Next:
  • Add DNS at your registrar, based on 'vercel domains inspect' above.
    Common patterns:
      - Root on Vercel:    A  @   -> 76.76.21.21
      - WWW on Vercel:     CNAME www -> cname.vercel-dns.com
      - APP on Vercel:     CNAME $APP_SUBDOMAIN -> cname.vercel-dns.com

  • Durable landing page (optional):
      - Point desired host (root or www) to your Durable CNAME target:
        $DURABLE_TARGET
      - Or keep root on Vercel and put Durable on a subdomain (e.g., 'home.' or 'www.')

  • Verify R2 upload now with:
      aws s3 ls s3://$S3_BUCKET/ --endpoint-url $S3_ENDPOINT
"