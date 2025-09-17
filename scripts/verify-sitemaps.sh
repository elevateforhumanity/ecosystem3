#!/bin/bash

# Ultra-Chunked Sitemap Verification Script
# Usage: ./scripts/verify-sitemaps.sh [domain]

DOMAIN=${1:-"https://www.elevateforhumanity.org"}

echo "🔍 Verifying Ultra-Chunked Sitemaps for: $DOMAIN"
echo "=================================================="

# Test 1: Master sitemap index
echo "📋 Testing Master Sitemap Index..."
curl -s "$DOMAIN/sitemap_index.xml" | head -10
if curl -s -f "$DOMAIN/sitemap_index.xml" > /dev/null; then
    echo "✅ Master sitemap index accessible"
else
    echo "❌ Master sitemap index failed"
fi
echo

# Test 2: Individual section sitemaps
echo "📄 Testing Section Sitemaps..."
for section in marketing programs blog employers misc; do
    echo "  Testing sitemap-$section-1.xml..."
    if curl -s -f "$DOMAIN/sitemaps/sitemap-$section-1.xml" > /dev/null; then
        echo "  ✅ sitemap-$section-1.xml accessible"
    else
        echo "  ❌ sitemap-$section-1.xml failed"
    fi
done
echo

# Test 3: Robots.txt points to master
echo "🤖 Testing Robots.txt..."
curl -s "$DOMAIN/robots.txt"
if curl -s "$DOMAIN/robots.txt" | grep -q "sitemap_index.xml"; then
    echo "✅ Robots.txt points to master sitemap"
else
    echo "❌ Robots.txt missing sitemap reference"
fi
echo

# Test 4: Sample program page from sitemap
echo "🔗 Testing Sample URLs from Sitemaps..."
curl -s "$DOMAIN/sitemaps/sitemap-programs-1.xml" | grep -o 'https://[^<]*' | head -3 | while read url; do
    echo "  Testing: $url"
    if curl -s -f "$url" > /dev/null; then
        echo "  ✅ $url accessible"
    else
        echo "  ❌ $url failed"
    fi
done
echo

echo "🎯 Verification Complete!"
echo "Next steps:"
echo "1. Submit $DOMAIN/sitemap_index.xml to Google Search Console"
echo "2. Monitor indexing status in GSC"
echo "3. Check for any 404s in sitemap URLs"