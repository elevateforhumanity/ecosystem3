#!/bin/bash
set -e

echo "🚀 Building Elevate Platform for deployment..."

# Create deploy directory
mkdir -p deploy

# Copy all HTML files
cp *.html deploy/ 2>/dev/null || true

# Copy JavaScript files
cp *.js deploy/ 2>/dev/null || true

# Copy CSS files
cp *.css deploy/ 2>/dev/null || true

# Copy JSON files (manifest, package.json, etc.)
cp *.json deploy/ 2>/dev/null || true

# Copy text files
cp *.txt deploy/ 2>/dev/null || true

# Copy directories
cp -r icons/ deploy/ 2>/dev/null || true
cp -r certificates/ deploy/ 2>/dev/null || true
cp -r api/ deploy/ 2>/dev/null || true
cp -r assets/ deploy/ 2>/dev/null || true
cp -r images/ deploy/ 2>/dev/null || true
cp -r public/ deploy/ 2>/dev/null || true
cp -r src/ deploy/ 2>/dev/null || true
cp -r programs/ deploy/ 2>/dev/null || true
cp -r students/ deploy/ 2>/dev/null || true
cp -r contact/ deploy/ 2>/dev/null || true
cp -r contracts/ deploy/ 2>/dev/null || true

# Copy important config files
cp _redirects deploy/ 2>/dev/null || true
cp _headers deploy/ 2>/dev/null || true
cp robots.txt deploy/ 2>/dev/null || true
cp sitemap.xml deploy/ 2>/dev/null || true

echo "✅ Deploy directory created with all necessary files"
echo "📁 Files in deploy directory:"
ls -la deploy/ | head -20

echo "🎯 Flash Sale Store ready for deployment!"