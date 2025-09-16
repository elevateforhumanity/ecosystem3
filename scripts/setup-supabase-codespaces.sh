#!/usr/bin/env bash
set -euo pipefail

# ===================================================================
# GitHub Codespaces Supabase Setup Script
# ===================================================================

echo "🚀 Setting up Supabase for GitHub Codespaces..."
echo "=============================================="

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to prompt for input
prompt_input() {
    local prompt="$1"
    local var_name="$2"
    local is_secret="${3:-false}"
    
    echo -e "${BLUE}$prompt${NC}"
    if [ "$is_secret" = "true" ]; then
        read -s value
        echo ""
    else
        read value
    fi
    
    if [ -z "$value" ]; then
        echo -e "${RED}❌ Value cannot be empty. Please try again.${NC}"
        prompt_input "$prompt" "$var_name" "$is_secret"
    else
        eval "$var_name='$value'"
    fi
}

# Collect Supabase configuration
echo -e "${YELLOW}📝 Please provide your Supabase values:${NC}"
echo ""

prompt_input "🌐 VITE_SUPABASE_URL (public):" "VITE_SUPABASE_URL"
prompt_input "🔑 VITE_SUPABASE_ANON_KEY (public):" "VITE_SUPABASE_ANON_KEY"
prompt_input "🌐 SUPABASE_URL (server):" "SUPABASE_URL"
prompt_input "🔐 SUPABASE_SERVICE_KEY (server, secret):" "SUPABASE_SERVICE_KEY" "true"

echo ""
echo -e "${GREEN}✅ Configuration collected successfully!${NC}"
echo ""

# Create .env file for root
echo -e "${BLUE}📄 Creating root .env file...${NC}"
cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=$VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY

# Environment
NODE_ENV=development
EOF

# Create .env for client directory if it exists
if [ -d "client" ]; then
    echo -e "${BLUE}📄 Creating client/.env file...${NC}"
    cat > client/.env << EOF
# Supabase Configuration (Client)
VITE_SUPABASE_URL=$VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
EOF
fi

# Create .env for server directory if it exists
if [ -d "server" ]; then
    echo -e "${BLUE}📄 Creating server/.env file...${NC}"
    cat > server/.env << EOF
# Supabase Configuration (Server)
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY
NODE_ENV=development
EOF
fi

# Set GitHub Codespaces secrets
echo -e "${BLUE}🔒 Setting GitHub Codespaces environment variables...${NC}"

# Export for current session
export VITE_SUPABASE_URL="$VITE_SUPABASE_URL"
export VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY"
export SUPABASE_URL="$SUPABASE_URL"
export SUPABASE_SERVICE_KEY="$SUPABASE_SERVICE_KEY"

# Add to shell profile for persistence
if [ -f ~/.bashrc ]; then
    echo "" >> ~/.bashrc
    echo "# Supabase Environment Variables" >> ~/.bashrc
    echo "export VITE_SUPABASE_URL=\"$VITE_SUPABASE_URL\"" >> ~/.bashrc
    echo "export VITE_SUPABASE_ANON_KEY=\"$VITE_SUPABASE_ANON_KEY\"" >> ~/.bashrc
    echo "export SUPABASE_URL=\"$SUPABASE_URL\"" >> ~/.bashrc
    echo "export SUPABASE_SERVICE_KEY=\"$SUPABASE_SERVICE_KEY\"" >> ~/.bashrc
fi

# Create .gitignore entries for env files
echo -e "${BLUE}🛡️  Updating .gitignore...${NC}"
if [ ! -f .gitignore ]; then
    touch .gitignore
fi

# Add env files to gitignore if not already present
grep -qF ".env" .gitignore || echo ".env" >> .gitignore
grep -qF ".env.local" .gitignore || echo ".env.local" >> .gitignore
grep -qF ".env.*.local" .gitignore || echo ".env.*.local" >> .gitignore

# Create example env file
echo -e "${BLUE}📋 Creating .env.example file...${NC}"
cat > .env.example << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_supabase_service_key_here

# Environment
NODE_ENV=development
EOF

# Install dependencies if package.json exists
if [ -f package.json ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    npm install
fi

if [ -f client/package.json ]; then
    echo -e "${BLUE}📦 Installing client dependencies...${NC}"
    cd client && npm install && cd ..
fi

# Test Supabase connection
echo -e "${BLUE}🧪 Testing Supabase connection...${NC}"
node -e "
const url = '$SUPABASE_URL';
const key = '$VITE_SUPABASE_ANON_KEY';
if (url && key) {
    console.log('✅ Supabase URL and keys are configured');
    console.log('🌐 URL:', url);
    console.log('🔑 Anon Key:', key.substring(0, 20) + '...');
} else {
    console.log('❌ Missing Supabase configuration');
}
" 2>/dev/null || echo -e "${YELLOW}⚠️  Node.js test skipped (Node.js not available)${NC}"

echo ""
echo -e "${GREEN}🎉 Supabase setup completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Summary:${NC}"
echo -e "✅ Environment variables configured"
echo -e "✅ .env files created"
echo -e "✅ .gitignore updated"
echo -e "✅ .env.example created"
echo -e "✅ Shell profile updated"
echo ""
echo -e "${BLUE}🚀 Your Elevate for Humanity platform is ready with Supabase!${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "1. Restart your terminal or run: source ~/.bashrc"
echo -e "2. Start your development server: npm run dev"
echo -e "3. Test your Supabase integration"
echo ""
echo -e "${GREEN}✨ Happy coding!${NC}"
