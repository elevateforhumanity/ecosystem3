#!/usr/bin/env bash
set -euo pipefail

### === CONFIG: EDIT THESE 3 LINES ===
AWS_S3_BUCKET="${AWS_S3_BUCKET:-your-bucket-name-here}"        # e.g., efh-site-prod
CLOUDFRONT_DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-DXXXXXXXXXXXXX}"  # from your CloudFront console
SITE_URL="${SITE_URL:-https://www.example.com}"           # public URL used in sitemap

### Optional: HLS video upload (set ENABLE_HLS_UPLOAD=true to activate)
ENABLE_HLS_UPLOAD="${ENABLE_HLS_UPLOAD:-false}"
HLS_LOCAL_DIR="${HLS_LOCAL_DIR:-dist/hls}"      # local folder containing .m3u8/.ts (typically copied into dist)
HLS_S3_BUCKET="${HLS_S3_BUCKET:-$AWS_S3_BUCKET}" # default to same bucket as site unless overridden
HLS_PREFIX="${HLS_PREFIX:-hls}"                  # destination prefix in the bucket (e.g., hls/)
HLS_INVALIDATION_PATHS="${HLS_INVALIDATION_PATHS:-/hls/*}"
HLS_SOURCE_DIR="${HLS_SOURCE_DIR:-public/hls}"   # source folder to copy into dist/hls prior to upload

### Optional: Node version guard (keeps builds consistent)
REQUIRED_NODE_MAJOR=18
NODE_MAJOR=$(node -v | sed -E 's/^v([0-9]+).*/\1/')
if [[ "${NODE_MAJOR}" -ne "${REQUIRED_NODE_MAJOR}" ]]; then
  echo "⚠️  Node v${REQUIRED_NODE_MAJOR}.x recommended (you have $(node -v)). Continuing…"
fi

### 0) Pre-flight checks
command -v aws >/dev/null || { echo "❌ AWS CLI not found. Install & run: aws configure"; exit 1; }
aws sts get-caller-identity >/dev/null || { echo "❌ AWS not authenticated. Run: aws configure"; exit 1; }
command -v npm >/dev/null || { echo "❌ npm not found"; exit 1; }

### 1) Build (creates ./dist)
echo "🏗️  Building app…"
npm ci || npm i --legacy-peer-deps
npm run build

### 1b) If HLS source exists, copy into dist (so upload step has files)
if [[ -d "${HLS_SOURCE_DIR}" ]]; then
  echo "📦 Copying HLS from '${HLS_SOURCE_DIR}' -> '${HLS_LOCAL_DIR}'…"
  mkdir -p "${HLS_LOCAL_DIR}"
  rsync -a --delete "${HLS_SOURCE_DIR}/" "${HLS_LOCAL_DIR}/"
fi

### 2) Ensure robots.txt + sitemap.xml exist inside dist/
mkdir -p dist
# robots.txt (idempotent)
cat > dist/robots.txt <<EOF
User-agent: *
Allow: /
Sitemap: ${SITE_URL%/}/sitemap.xml
EOF

# sitemap.xml (basic generator from .html files)
echo "🗺️  Generating sitemap.xml…"
SITEMAP_TMP="$(mktemp)"
{
  echo '<?xml version="1.0" encoding="UTF-8"?>'
  echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  # root index
  if [[ -f "dist/index.html" ]]; then
    echo "  <url><loc>${SITE_URL%/}/</loc></url>"
  fi
  # other html files
  # maps dist/about/index.html -> /about/
  # maps dist/page.html -> /page.html
  while IFS= read -r -d '' file; do
    # strip leading dist/
    path="${file#dist/}"
    url_path=""
    if [[ "${path}" == "index.html" ]]; then
      continue
    elif [[ "${path}" == */index.html ]]; then
      url_path="/${path%/index.html}/"
    else
      url_path="/${path}"
    fi
    echo "  <url><loc>${SITE_URL%/}${url_path}</loc></url>"
  done < <(find dist -type f -name '*.html' -print0)
  echo '</urlset>'
} > "${SITEMAP_TMP}"
mv "${SITEMAP_TMP}" dist/sitemap.xml

### 3) Create bucket if missing (safe if exists)
echo "🪣 Ensuring bucket s3://${AWS_S3_BUCKET} exists…"
aws s3api head-bucket --bucket "${AWS_S3_BUCKET}" 2>/dev/null || \
  aws s3 mb "s3://${AWS_S3_BUCKET}"

### 4) Upload with smart caching
echo "⬆️  Uploading HTML with no-cache…"
aws s3 sync dist "s3://${AWS_S3_BUCKET}" \
  --delete \
  --exclude "*" --include "*.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html; charset=utf-8"

# Ensure correct content-type for robots.txt and sitemap.xml
if [[ -f dist/robots.txt ]]; then
  aws s3 cp dist/robots.txt "s3://${AWS_S3_BUCKET}/robots.txt" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/plain; charset=utf-8"
fi
if [[ -f dist/sitemap.xml ]]; then
  aws s3 cp dist/sitemap.xml "s3://${AWS_S3_BUCKET}/sitemap.xml" \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "application/xml; charset=utf-8"
fi

echo "⬆️  Uploading assets with long cache…"
# Exclude HLS from general asset sync when HLS upload is enabled to avoid overriding cache/content-type
ASSET_SYNC_EXCLUDES=("--exclude" "*.html" "--exclude" "robots.txt" "--exclude" "sitemap.xml")
if [[ "${ENABLE_HLS_UPLOAD}" == "true" ]]; then
  # If HLS_LOCAL_DIR is within dist/, add a relative exclude
  case "${HLS_LOCAL_DIR}" in
    dist/*)
      HLS_REL="${HLS_LOCAL_DIR#dist/}"
      ASSET_SYNC_EXCLUDES+=("--exclude" "${HLS_REL}/*")
      ;;
  esac
fi
aws s3 sync dist "s3://${AWS_S3_BUCKET}" \
  --delete \
  "${ASSET_SYNC_EXCLUDES[@]}" \
  --cache-control "public, max-age=31536000, immutable"

### 4b) Optional: Upload HLS assets (playlists no-cache, segments long cache)
if [[ "${ENABLE_HLS_UPLOAD}" == "true" ]]; then
  if [[ -d "${HLS_LOCAL_DIR}" ]]; then
    echo "🎬 Uploading HLS from '${HLS_LOCAL_DIR}' to s3://${HLS_S3_BUCKET}/${HLS_PREFIX}…"

    # Ensure destination bucket exists
    aws s3api head-bucket --bucket "${HLS_S3_BUCKET}" 2>/dev/null || \
      aws s3 mb "s3://${HLS_S3_BUCKET}"

    # 1) Playlists (*.m3u8) — short/no cache, correct content-type
    aws s3 sync "${HLS_LOCAL_DIR}" "s3://${HLS_S3_BUCKET}/${HLS_PREFIX}" \
      --delete \
      --exclude "*" --include "*.m3u8" \
      --cache-control "no-cache, no-store, must-revalidate" \
      --content-type "application/vnd.apple.mpegurl"

    # 2) Segments (*.ts, *.m4s, *.mp4, *.webm) — long cache
    aws s3 sync "${HLS_LOCAL_DIR}" "s3://${HLS_S3_BUCKET}/${HLS_PREFIX}" \
      --delete \
      --exclude "*.m3u8" \
      --cache-control "public, max-age=31536000, immutable"

    # Optional CloudFront invalidation scoped to HLS prefix (site-wide invalidation still runs below)
    if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID}" && -n "${HLS_INVALIDATION_PATHS}" ]]; then
      echo "🧼 Invalidate CloudFront HLS paths (${HLS_INVALIDATION_PATHS})…"
      aws cloudfront create-invalidation \
        --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
        --paths "${HLS_INVALIDATION_PATHS}" > /dev/null || true
    fi
  else
    echo "ℹ️  ENABLE_HLS_UPLOAD=true but directory '${HLS_LOCAL_DIR}' not found; skipping HLS upload."
  fi
fi

### 5) CloudFront cache bust
if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID}" ]]; then
  echo "🧹 Creating CloudFront invalidation…"
  aws cloudfront create-invalidation \
    --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
    --paths "/*" > /dev/null
  echo "✅ Invalidation requested."
else
  echo "ℹ️  No CLOUDFRONT_DISTRIBUTION_ID set—skipping invalidation."
fi

### 6) Done
echo "🎉 Deploy complete: ${SITE_URL}"

# Optional: verify public URLs after deploy
if [[ "${VERIFY_AFTER_DEPLOY:-false}" == "true" ]]; then
  if command -v node >/dev/null && [[ -f scripts/verify-deploy.mjs ]]; then
    echo "🔎 Verifying public URLs…"
    SITE_URL="${SITE_URL}" node scripts/verify-deploy.mjs || {
      echo "❌ Verification failed"; exit 3;
    }
  else
    echo "ℹ️  VERIFY_AFTER_DEPLOY=true but verifier missing; skipping."
  fi
fi

# --- Optional reference: CloudFront OAC + signed URLs for HLS ---
# To restrict direct S3 access and serve via CloudFront only, attach this
# bucket policy to the HLS bucket (replace placeholders):
#
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Sid": "AllowOAC",
#       "Effect": "Allow",
#       "Principal": { "AWS": "arn:aws:iam::CLOUDFRONT_ACCOUNT_ID:root" },
#       "Action": "s3:GetObject",
#       "Resource": "arn:aws:s3:::YOUR_HLS_BUCKET/YOUR_PREFIX/*",
#       "Condition": {
#         "StringEquals": { "AWS:SourceArn": "arn:aws:cloudfront::YOUR_AWS_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID" }
#       }
#     }
#   ]
# }
#
# Then configure CloudFront to require signed URLs or cookies for the HLS paths.
# Signed URL generation can be done server-side (Node) using AWS SDK CloudFrontSigner.
