
#!/bin/bash

echo "🔄 Building EFH Platform..."

# Install dependencies
echo "📦 Installing server dependencies..."
npm install

# Build React client
echo "🏗️ Building React client..."
cd client
npm install
npm run build
cd ..

# Start server
echo "🚀 Starting server..."
node simple-server.js
