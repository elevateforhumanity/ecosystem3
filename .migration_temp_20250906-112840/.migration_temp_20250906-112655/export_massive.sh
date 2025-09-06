#!/usr/bin/env bash
set -euo pipefail

# =========================
# Massive Project Exporter
# =========================
# Creates a single tar.gz of your entire project (excluding heavy/junk folders),
# optionally auto-splits into <2GB parts for easier downloading,
# and can upload the single archive to S3-compatible storage (S3/R2/B2).
#
# Usage:
#   ./export_massive.sh                 # single tar.gz in exports/
#   SPLIT_MB=1900 ./export_massive.sh   # auto-split into ~1.9GB parts + join script
#   TO_S3=1 S3_BUCKET=my-bucket \
#     S3_ENDPOINT=https://<endpoint> \
#     AWS_ACCESS_KEY_ID=... \
#     AWS_SECRET_ACCESS_KEY=... \
#     ./export_massive.sh               # upload single archive to S3-compatible storage
#
# Notes:
# - Excludes node_modules, build folders, caches, .git, etc. (customize below)
# - Archive lands in exports/ with a timestamp
# - Join script provided when SPLIT_MB is set
# =========================

TS="$(date +%Y%m%d-%H%M%S)"
OUTDIR="exports"
ARCHIVE="massive-export-${TS}.tar.gz"

# Exclusions: add/remove as needed for your stack
EXCLUDES=(
  --exclude='.git'
  --exclude='node_modules'
  --exclude='*/node_modules'
  --exclude='dist'
  --exclude='*/dist'
  --exclude='build'
  --exclude='*/build'
  --exclude='.next'
  --exclude='*/.next'
  --exclude='out'
  --exclude='*/out'
  --exclude='.cache'
  --exclude='*/.cache'
  --exclude='coverage'
  --exclude='*/coverage'
  --exclude='.vercel'
  --exclude='*/.vercel'
  --exclude='.DS_Store'
  --exclude='tmp'
  --exclude='*/tmp'
  --exclude='exports'
  --exclude='*.log'
  --exclude='**/*.log'
  --exclude='.vscode'
  --exclude='*/.vscode'
  --exclude='.idea'
  --exclude='*/.idea'
  --exclude='.env'
  --exclude='.env.*'
  --exclude='*/.env'
  --exclude='*/.env.*'
)

mkdir -p "$OUTDIR"

echo "→ Creating single archive: $OUTDIR/$ARCHIVE"
# -p to preserve permissions; -h to de-reference symlinks (optional; remove -h if you want symlinks preserved as links)
tar -I 'gzip -9' -chpf "$OUTDIR/$ARCHIVE" "${EXCLUDES[@]}" .

# If requested, split the archive into parts of SPLIT_MB megabytes
SPLIT_MB="${SPLIT_MB:-}"
if [[ -n "${SPLIT_MB// }" ]]; then
  echo "→ Splitting archive into ~${SPLIT_MB}MB parts..."
  (cd "$OUTDIR" && split -b "${SPLIT_MB}m" -d -a 3 "$ARCHIVE" "${ARCHIVE}.part.")
  echo "→ Generating join script exports/join_${ARCHIVE}.sh"
  cat > "$OUTDIR/join_${ARCHIVE}.sh" <<JOIN
#!/usr/bin/env bash
set -euo pipefail
cat ${ARCHIVE}.part.* > ${ARCHIVE}
echo "✅ Reassembled ${ARCHIVE}"
echo "To extract: tar -xzpf ${ARCHIVE}"
JOIN
  chmod +x "$OUTDIR/join_${ARCHIVE}.sh"
  echo "→ You can now download the parts from $OUTDIR and later run: bash join_${ARCHIVE}.sh"
fi

# Optional: upload single archive to S3-compatible storage
TO_S3="${TO_S3:-0}"
if [[ "$TO_S3" == "1" ]]; then
  : "${S3_BUCKET:?Set S3_BUCKET (bucket name)}"
  : "${S3_ENDPOINT:?Set S3_ENDPOINT (e.g., https://<account>.r2.cloudflarestorage.com)}"
  : "${AWS_ACCESS_KEY_ID:?Set AWS_ACCESS_KEY_ID}"
  : "${AWS_SECRET_ACCESS_KEY:?Set AWS_SECRET_ACCESS_KEY}"

  echo "→ Installing AWS CLI (user scope)..."
  pip install --user awscli >/dev/null 2>&1 || true
  export PATH="$HOME/.local/bin:$PATH"

  echo "→ Uploading $OUTDIR/$ARCHIVE to s3://$S3_BUCKET/"
  aws s3 cp "$OUTDIR/$ARCHIVE" "s3://$S3_BUCKET/$ARCHIVE" --endpoint-url="$S3_ENDPOINT"

  echo "✅ Uploaded. Keep this path handy: s3://$S3_BUCKET/$ARCHIVE"
  echo "If your provider exposes public URLs, you can share a single download link."
fi

echo "✅ Done."
du -h "$OUTDIR/$ARCHIVE" | awk '{print "Archive size:", $1}'
echo "Archives are in: $OUTDIR/"