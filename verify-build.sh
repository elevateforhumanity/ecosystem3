#!/bin/bash

# 🚀 Build Verification Script for Elevate for Humanity
# Run this before deploying to Vercel to ensure everything works locally

echo "🔍 Starting build verification..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project root?"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous build
if [ -d "dist" ]; then
    echo "🧹 Cleaning previous build..."
    rm -rf dist
fi

# Run the build
echo "🔨 Building project..."
npm run build

# Check if build succeeded
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist/ directory not created"
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    echo "❌ Error: Build failed - dist/index.html not found"
    exit 1
fi

echo "✅ Build successful!"
echo "📁 Build output in: $(pwd)/dist"
echo "📄 Main file: $(pwd)/dist/index.html"

# Check file sizes
echo ""
echo "📊 Build size summary:"
du -sh dist/*
echo ""

# Optional: Start local server for testing
echo "🌐 To test locally, run:"
echo "    npx serve dist"
echo "    # or"
echo "    cd dist && python -m http.server 3000"
echo ""

echo "🎉 Ready for Vercel deployment!"
echo "   1. Push to GitHub"
echo "   2. Connect repo to Vercel"
echo "   3. Deploy!"
echo ""

# List important files for verification
echo "📋 Important files to verify:"
echo "   ✅ package.json - $(test -f package.json && echo 'Found' || echo 'Missing')"
echo "   ✅ vercel.json - $(test -f vercel.json && echo 'Found' || echo 'Missing')"
echo "   ✅ dist/index.html - $(test -f dist/index.html && echo 'Found' || echo 'Missing')"
echo "   ✅ dist/assets/ - $(test -d dist/assets && echo 'Found' || echo 'Missing')"
