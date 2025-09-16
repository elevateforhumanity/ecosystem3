#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Gitpod bootstrap starting…"

# ---------------------------
# 0) Detect package manager
# ---------------------------
PKG="npm"
command -v pnpm >/dev/null && PKG="pnpm"
command -v yarn >/dev/null && PKG="yarn"
echo "📦 Using package manager: $PKG"

run() {
  echo "+ $*"
  eval "$*"
}

# ---------------------------
# 1) Node version sanity
# ---------------------------
if [ -f .nvmrc ]; then
  echo "🟢 Using Node from .nvmrc"
  . ~/.nvm/nvm.sh || true
  nvm install >/dev/null 2>&1 || true
fi
echo "🧰 Node: $(node -v || echo 'not found')  |  npm: $(npm -v || echo '-')"

# ---------------------------
# 2) Ensure minimal deps
#    (fixes typical Vite/React/Tailwind errors)
# ---------------------------
ensure_dep() {
  local dep="$1"
  node -e "try{require.resolve('$dep');process.exit(0)}catch(e){process.exit(1)}" \
    || { echo "⬇️  Installing $dep"; $PKG add -D "$dep" || $PKG install "$dep" -D || true; }
}

ensure_runtime_dep() {
  local dep="$1"
  node -e "try{require.resolve('$dep');process.exit(0)}catch(e){process.exit(1)}" \
    || { echo "⬇️  Installing runtime $dep"; $PKG add "$dep" || $PKG install "$dep" || true; }
}

echo "📚 Installing deps (with conflict fallbacks)…"
if [ "$PKG" = "npm" ]; then
  npm ci || npm install --legacy-peer-deps || npm install --force || true
elif [ "$PKG" = "yarn" ]; then
  yarn install --check-files || yarn install || true
else
  pnpm install || pnpm install --no-frozen-lockfile || true
fi

# Core runtime deps
ensure_runtime_dep react
ensure_runtime_dep react-dom
ensure_runtime_dep react-router-dom

# Tooling / build deps
ensure_dep vite
ensure_dep typescript || true
ensure_dep @types/react || true
ensure_dep @types/react-dom || true

# Tailwind/PostCSS common fix
[ -f postcss.config.js ] && {
  ensure_dep postcss
  ensure_dep autoprefixer
  # Netlify's newer guides use @tailwindcss/postcss as the plugin package name
  # (works fine for Tailwind v3.4+)
  ensure_dep tailwindcss
  ensure_dep @tailwindcss/postcss
}

# ---------------------------
# 3) Create SPA redirects (Netlify + Vercel)
# ---------------------------
mkdir -p public

# Netlify: _redirects
if [ ! -f _redirects ]; then
  cat > _redirects <<'EOF'
# Pass through built assets
/assets/*  /assets/:splat   200

# Student portal clean URLs
/student-portal /student-portal.html 200
/enroll /student-portal.html 200
/login /student-portal.html 200
/certificates /student-portal.html 200

# SPA fallback (keeps client routing)
/*          /index.html     200
EOF
  echo "📝 Wrote _redirects"
fi

# Netlify: netlify.toml (optional but helpful)
if [ ! -f netlify.toml ]; then
  cat > netlify.toml <<'TOML'
[build]
  command = "npm run build || yarn build || pnpm build"
  publish = "dist"

[build.environment]
  SECRETS_SCAN_SMART_DETECTION_ENABLED = "false"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"

[[redirects]]
  from = "/assets/*"
  to = "/assets/:splat"
  status = 200

[[redirects]]
  from = "/student-portal"
  to = "/student-portal.html"
  status = 200

[[redirects]]
  from = "/enroll"
  to = "/student-portal.html"
  status = 200

# Catch-all SPA
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
TOML
  echo "📝 Wrote netlify.toml"
fi

# Vercel: vercel.json
if [ ! -f vercel.json ]; then
  cat > vercel.json <<'JSON'
{
  "version": 2,
  "builds": [{ "src": "index.html", "use": "@vercel/static" }],
  "routes": [
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/student-portal", "dest": "/student-portal.html" },
    { "src": "/enroll", "dest": "/student-portal.html" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
JSON
  echo "📝 Wrote vercel.json"
fi

# ---------------------------
# 4) robots.txt + sitemap stub
# ---------------------------
if [ ! -f public/robots.txt ]; then
  cat > public/robots.txt <<'TXT'
User-agent: *
Allow: /

# Important pages
Allow: /student-portal
Allow: /enroll
Allow: /programs

Sitemap: https://www.elevateforhumanity.org/sitemap.xml

# Crawl delay for politeness
Crawl-delay: 1
TXT
  echo "📝 Wrote public/robots.txt"
fi

if [ ! -f public/sitemap.xml ]; then
  cat > public/sitemap.xml <<'XML'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.elevateforhumanity.org/</loc>
    <lastmod>2024-03-12</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.elevateforhumanity.org/student-portal</loc>
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
XML
  echo "📝 Wrote public/sitemap.xml (starter)"
fi

# ---------------------------
# 5) Vite config guard (ensures /assets base)
# ---------------------------
if [ -f vite.config.ts ] || [ -f vite.config.js ]; then
  echo "🛡️  Checking Vite base path…"
  FILE=$( [ -f vite.config.ts ] && echo vite.config.ts || echo vite.config.js )
  if ! grep -q "base:" "$FILE"; then
    # Insert base: '/'; if you deploy under subpath, adjust later
    sed -i.bak 's|defineConfig({|defineConfig({ base: "/",|g' "$FILE" || true
    echo "🔩 Updated $FILE with base: \"/\""
  fi
fi

# ---------------------------
# 6) Add helpful npm scripts (idempotent)
# ---------------------------
if [ -f package.json ]; then
  node <<'JS'
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
pkg.scripts = pkg.scripts || {};
pkg.scripts.dev = pkg.scripts.dev || "vite";
pkg.scripts.build = pkg.scripts.build || "vite build";
pkg.scripts.preview = pkg.scripts.preview || "vite preview --host 0.0.0.0 --port 5173";
pkg.scripts.sitemap = pkg.scripts.sitemap || "node scripts/generate-sitemap.mjs";
pkg.scripts["serve-static"] = "python3 -m http.server 8080";
fs.writeFileSync('package.json', JSON.stringify(pkg,null,2));
console.log("🧾 Ensured package.json scripts (dev/build/preview/sitemap)");
JS
fi

# ---------------------------
# 7) For static HTML sites, copy files to dist
# ---------------------------
echo "🏗️  Setting up static site structure…"
mkdir -p dist

# Copy our professional HTML files
if [ -f live-professional.html ]; then
  cp live-professional.html dist/index.html
  echo "📄 Copied live-professional.html → dist/index.html"
fi

if [ -f student-portal.html ]; then
  cp student-portal.html dist/
  echo "📄 Copied student-portal.html → dist/"
fi

# Copy any other HTML files
for file in *.html; do
  [ -f "$file" ] && [ "$file" != "live-professional.html" ] && [ "$file" != "student-portal.html" ] && {
    cp "$file" dist/
    echo "📄 Copied $file → dist/"
  }
done

# Copy static assets
[ -d public ] && cp -r public/* dist/ 2>/dev/null || true
[ -f _redirects ] && cp _redirects dist/
[ -f _headers ] && cp _headers dist/

# ---------------------------
# 8) Start static server for preview
# ---------------------------
echo "🚀 Starting static preview server on port 8080…"
echo "   Gitpod will expose this as a public URL"

cd dist
python3 -m http.server 8080 &
SERVER_PID=$!
cd ..

# ---------------------------
# 9) Quick health check
# ---------------------------
sleep 3
if command -v curl >/dev/null; then
  echo "🔍 Local health check:"
  curl -I localhost:8080 2>/dev/null || echo "Server starting up..."
fi

echo "✅ Gitpod bootstrap complete."
echo "🌐 Your site should be available at the Gitpod preview URL"
echo "📝 Server PID: $SERVER_PID (use 'kill $SERVER_PID' to stop)"

# Keep script running so server stays up
wait $SERVER_PID 2>/dev/null || true