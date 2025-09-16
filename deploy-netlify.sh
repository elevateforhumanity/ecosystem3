#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Deploying to Netlify from Gitpod..."

# Ensure Netlify CLI is in PATH
export PATH="/usr/local/node/bin:$PATH"

# Detect package manager
if command -v pnpm >/dev/null 2>&1; then PM=pnpm
elif command -v yarn >/dev/null 2>&1; then PM=yarn
else PM=npm
fi

echo "📦 Using package manager: $PM"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "📚 Installing dependencies..."
  if [ "$PM" = "npm" ]; then
    npm ci || npm install --legacy-peer-deps || npm install --force
  elif [ "$PM" = "yarn" ]; then
    yarn install --check-files || yarn install
  else
    pnpm install || pnpm install --no-frozen-lockfile
  fi
fi

# Build production site
echo "🏗️ Building production site..."
$PM run build

# Copy redirects to dist
echo "📄 Copying redirects..."
cp _redirects dist/_redirects 2>/dev/null || echo "No _redirects file found"

# Check if we're linked to a Netlify site
if [ ! -f ".netlify/state.json" ]; then
  echo "⚠️  Not linked to a Netlify site yet."
  echo "🔗 Run 'netlify link' first to connect this repo to your Netlify site."
  echo "💡 Or run 'netlify init' to create a new site."
  exit 1
fi

# Deploy to production
echo "🚀 Deploying to production..."
netlify deploy --dir=dist --prod

echo "✅ Deployment complete!"
echo "🌐 Your site should be live at: https://www.elevateforhumanity.org"

# Optional: run quality checks
echo "🔍 Running quality checks..."
sleep 5

# Check if assets load
echo "📦 Checking asset loading..."
curl -s https://www.elevateforhumanity.org | grep -Eo '/assets/[^"]+\.js' | head -3 | while read asset; do
  echo "  Testing: $asset"
  curl -I "https://www.elevateforhumanity.org$asset" | head -1
done

echo "🎉 Deployment and checks complete!"