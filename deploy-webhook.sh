#!/bin/bash
# 🚀 ELEVATE WEBHOOK DEPLOYMENT SCRIPT

echo "🚀 Deploying Elevate Webhook Server..."

# Create webhook directory
mkdir -p elevate-webhook
cd elevate-webhook

# Copy files
cp ../enhanced-webhook.js ./webhook.js
cp ../webhook-package.json ./package.json
cp ../webhook-env-example.txt ./.env.example

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create required directories
mkdir -p licenses analytics assets

# Create sample license terms PDF (placeholder)
echo "Creating sample license terms..."
cat > assets/license-terms.txt << 'EOF'
ELEVATE PLATFORM LICENSE TERMS

1. This license grants you the right to use the Elevate Platform software
2. You may modify and customize the software for your organization
3. Redistribution requires written permission
4. Support is provided via email and Discord community
5. License is non-transferable

For full terms, visit: https://elevateforhumanity.com/license-terms
EOF

# Set up environment
echo "🔧 Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual credentials"
fi

# Test webhook server
echo "🧪 Testing webhook server..."
timeout 5s npm start &
sleep 2
if curl -s http://localhost:4242/health > /dev/null; then
    echo "✅ Webhook server is working!"
else
    echo "❌ Webhook server test failed"
fi

# Kill test server
pkill -f "node webhook.js" 2>/dev/null || true

echo ""
echo "🎯 DEPLOYMENT COMPLETE!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Stripe keys"
echo "2. Run: npm start"
echo "3. Add webhook URL to Stripe Dashboard"
echo "4. Test with: npm run test"
echo ""
echo "Webhook endpoints:"
echo "• POST /webhook - Stripe webhook handler"
echo "• GET /validate/:licenseKey - License validation"
echo "• GET /analytics - Sales analytics"
echo "• GET /health - Health check"
echo ""
echo "🚀 Ready to start selling!"