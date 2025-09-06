#!/usr/bin/env bash
set -euo pipefail

# =========================
# COMPLETE ECOSYSTEM EXPORT
# =========================
# Exports EVERYTHING - no exclusions except the export folder itself
# This captures the full ecosystem exactly as it exists

TS="$(date +%Y%m%d-%H%M%S)"
OUTDIR="exports"
ARCHIVE="complete-ecosystem-${TS}.tar.gz"

mkdir -p "$OUTDIR"

echo "🚀 Creating COMPLETE ecosystem archive with EVERY file..."
echo "→ Archive: $OUTDIR/$ARCHIVE"

# Only exclude the exports folder to prevent infinite recursion
# Everything else gets included: node_modules, .git, build files, logs, caches - EVERYTHING
tar -czf "$OUTDIR/$ARCHIVE" --exclude="./exports" .

echo "✅ Complete ecosystem exported!"
du -h "$OUTDIR/$ARCHIVE" | awk '{print "Total size:", $1}'

# Show what's included
echo ""
echo "📋 This archive contains EVERYTHING:"
echo "   ✅ All source code and HTML files"
echo "   ✅ node_modules (all dependencies)"
echo "   ✅ All build and dist folders"
echo "   ✅ All cache and temporary files"
echo "   ✅ All logs and debugging files"
echo "   ✅ Git history (if present)"
echo "   ✅ All configuration files"
echo "   ✅ All assets, images, and media"
echo "   ✅ All marketplace listings and documents"
echo "   ✅ Every single file in the project"
echo ""
echo "📁 Download from: exports/$ARCHIVE"