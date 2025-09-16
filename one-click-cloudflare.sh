#!/bin/bash

echo "🤖 One-Click CloudFlare Setup for Elevate for Humanity"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "quick-deploy.html" ]; then
    echo "❌ Error: quick-deploy.html not found"
    echo "💡 Make sure you're in the project directory"
    exit 1
fi

echo "✅ Project files found"

# Create deployment package
echo "📦 Creating deployment package..."
cp quick-deploy.html index.html
echo "✅ Deployment package ready"

# Show CloudFlare setup commands
echo ""
echo "🚀 CloudFlare Pages Setup Commands:"
echo "=================================="
echo ""
echo "1. Go to: https://dash.cloudflare.com/pages"
echo "2. Click: 'Create a project'"
echo "3. Click: 'Connect to Git'"
echo "4. Select: 'elevateforhumanity/new-ecosysstem'"
echo "5. Use these settings:"
echo ""
echo "   Project name: elevateforhumanity"
echo "   Production branch: main"
echo "   Build command: cp quick-deploy.html index.html"
echo "   Output directory: ./"
echo ""
echo "6. Click: 'Save and Deploy'"
echo ""
echo "🎉 Your site will be live in 2-3 minutes!"
echo ""
echo "📱 Expected URLs:"
echo "   • https://elevateforhumanity.pages.dev"
echo "   • https://elevateforhumanity.org (after DNS)"
echo ""
echo "✅ Features included:"
echo "   • Government contracting services"
echo "   • Philanthropy & grant management"
echo "   • Accessibility compliance"
echo "   • Veteran services"
echo "   • Performance metrics"
echo ""
echo "🔗 Backup site (already live):"
echo "   • https://elevateforhumanity.github.io/new-ecosysstem/"
echo ""
echo "🤖 Autopilot setup complete!"