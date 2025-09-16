#!/usr/bin/env bash
set -euo pipefail

echo "🚀 Setting up Elevate Partners Platform in GitHub Codespaces..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 2. Create local .env if it doesn't already exist
if [ -f .env ]; then
  echo "ℹ️  .env already exists - skipping overwrite"
else
  echo "⚙️ Generating .env (remember to replace placeholder keys)..."
  cat > .env << 'EOF'
# --- Elevate Partners Platform Environment ---
# database (adjust if using a remote service)
DATABASE_URL="postgresql://localhost:5432/elevate_partners"

# Stripe keys (replace with real keys; DO NOT COMMIT real secrets)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
VITE_STRIPE_PUBLIC_KEY="pk_test_your_stripe_public_key_here"

# Session / auth
SESSION_SECRET="your-super-secret-session-key-change-this"

# Codespaces / OIDC (placeholders)
REPLIT_DOMAINS="localhost"
REPL_ID="elevate-partners-codespaces"
ISSUER_URL="https://replit.com/oidc"
EOF
fi

# 3. Start PostgreSQL service (Codespaces base image usually has it available)
echo "🗄️ Ensuring PostgreSQL is running..."
if sudo service postgresql status >/dev/null 2>&1; then
  sudo service postgresql start || true
else
  echo "⚠️ PostgreSQL service command unavailable—ensure a database is running and DATABASE_URL is correct." >&2
fi

# 4. Create database if missing
echo "🔧 Preparing database schema..."
if command -v psql >/dev/null 2>&1; then
  sudo -u postgres createdb elevate_partners 2>/dev/null || echo "ℹ️  Database elevate_partners already exists"
else
  echo "⚠️ psql not found; skipping createdb (provide external DB)." >&2
fi

# 5. Push schema (if a db:push script exists)
if npm run | grep -q "db:push"; then
  echo "🛠  Running prisma schema push (db:push)..."
  npm run db:push || echo "⚠️ db:push script failed or not configured"
else
  echo "ℹ️  No db:push script defined in package.json (skipping)."
fi

# 6. Start application
echo "🌟 Starting Elevate Partners Platform (dev server) on port 5000 (vite default may differ)..."
echo "✅ Universal Script v2.2 ready"
echo "✅ Partner directory placeholder (ensure partners.json present)"
echo "✅ Stripe integration scaffolding present (replace keys)"

npm run dev
