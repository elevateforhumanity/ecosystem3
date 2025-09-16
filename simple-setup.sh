#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up Elevate for Humanity - Static Site"

# ---------------------------
# 1) Create dist directory
# ---------------------------
mkdir -p dist
echo "📁 Created dist directory"

# ---------------------------
# 2) Copy professional site as index
# ---------------------------
if [ -f live-professional.html ]; then
  cp live-professional.html dist/index.html
  echo "✅ Copied live-professional.html → dist/index.html"
else
  echo "❌ live-professional.html not found"
fi

# ---------------------------
# 3) Copy student portal
# ---------------------------
if [ -f student-portal.html ]; then
  cp student-portal.html dist/
  echo "✅ Copied student-portal.html → dist/"
else
  echo "❌ student-portal.html not found"
fi

# ---------------------------
# 4) Copy other HTML files
# ---------------------------
for file in *.html; do
  if [ -f "$file" ] && [ "$file" != "live-professional.html" ]; then
    cp "$file" dist/
    echo "📄 Copied $file → dist/"
  fi
done

# ---------------------------
# 5) Create robots.txt
# ---------------------------
cat > dist/robots.txt <<'EOF'
User-agent: *
Allow: /

# Important pages
Allow: /student-portal
Allow: /enroll
Allow: /programs

Sitemap: https://www.elevateforhumanity.org/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1
EOF
echo "📝 Created robots.txt"

# ---------------------------
# 6) Create sitemap.xml
# ---------------------------
cat > dist/sitemap.xml <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.elevateforhumanity.org/</loc>
    <lastmod>2024-03-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.elevateforhumanity.org/student-portal.html</loc>
    <lastmod>2024-03-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.elevateforhumanity.org/programs</loc>
    <lastmod>2024-03-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
EOF
echo "📝 Created sitemap.xml"

# ---------------------------
# 7) Create _redirects for Netlify
# ---------------------------
cat > dist/_redirects <<'EOF'
# Student portal clean URLs
/student-portal /student-portal.html 200
/enroll /student-portal.html 200
/login /student-portal.html 200
/certificates /student-portal.html 200

# SPA fallback
/* /index.html 200
EOF
echo "📝 Created _redirects"

# ---------------------------
# 8) Create _headers for security
# ---------------------------
cat > dist/_headers <<'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;

/*.html
  Cache-Control: public, max-age=3600

/*.css
  Cache-Control: public, max-age=31536000

/*.js
  Cache-Control: public, max-age=31536000
EOF
echo "📝 Created _headers"

# ---------------------------
# 9) List what we created
# ---------------------------
echo ""
echo "📋 Files created in dist/:"
ls -la dist/
echo ""

# ---------------------------
# 10) Start server
# ---------------------------
echo "🌐 Starting server on port 8080..."
cd dist
python3 -m http.server 8080