# 🚀 Complete EFH Ecosystem Setup Guide

This guide will help you set up your complete 97,000-file ecosystem in GitHub Codespaces.

## 📋 Prerequisites

1. **GitHub account** with access to elevateforhumanity organization
2. **GitHub Codespaces** enabled on your account
3. **Repository access** to all ecosystem repositories

## 🔧 Setup Instructions

### Option 1: Automatic Setup (Recommended)

1. **Open in GitHub Codespaces**
   ```
   https://github.com/elevateforhumanity/new-ecosysstem
   ```
   Click "Code" → "Codespaces" → "Create codespace on main"

2. **Wait for automatic setup**
   - The `setup-complete-ecosystem.sh` script will run automatically
   - This will attempt to clone all repositories and install dependencies

3. **Update repository list** (if needed)
   - Edit `setup-complete-ecosystem.sh`
   - Replace commented repository names with actual ones
   - Run the script again: `bash setup-complete-ecosystem.sh`

### Option 2: Manual Setup

1. **Open terminal in Codespaces**

2. **Navigate to workspaces**
   ```bash
   cd /workspaces
   ```

3. **Clone additional repositories**
   ```bash
   # Replace these with your actual repository names
   git clone https://github.com/elevateforhumanity/hub-site
   git clone https://github.com/elevateforhumanity/programs-platform
   git clone https://github.com/elevateforhumanity/lms-system
   git clone https://github.com/elevateforhumanity/connect-community
   git clone https://github.com/elevateforhumanity/payment-service
   git clone https://github.com/elevateforhumanity/compliance-portal
   git clone https://github.com/elevateforhumanity/admin-dashboard
   git clone https://github.com/elevateforhumanity/api-services
   git clone https://github.com/elevateforhumanity/shared-components
   git clone https://github.com/elevateforhumanity/database-schemas
   git clone https://github.com/elevateforhumanity/deployment-configs
   git clone https://github.com/elevateforhumanity/asset-storage
   ```

4. **Install dependencies in each repository**
   ```bash
   for dir in */; do
     if [ -f "$dir/package.json" ]; then
       cd "$dir" && npm install && cd ..
     fi
   done
   ```

5. **Build projects**
   ```bash
   for dir in */; do
     if [ -f "$dir/package.json" ]; then
       cd "$dir" && npm run build 2>/dev/null && cd ..
     fi
   done
   ```

## 📁 Expected Repository Structure

After setup, your `/workspaces` directory should contain:

```
/workspaces/
├── new-ecosysstem/           # Main ecosystem (brain)
├── hub-site/                 # Hub landing page
├── programs-platform/        # Programs catalog
├── lms-system/              # Learning management
├── connect-community/        # Community features
├── payment-service/         # Payment processing
├── compliance-portal/       # Compliance reporting
├── admin-dashboard/         # Admin interface
├── api-services/            # Backend APIs
├── shared-components/       # Shared UI components
├── database-schemas/        # Database definitions
├── deployment-configs/      # Infrastructure configs
└── asset-storage/           # Media and assets
```

## 🔍 Verification

### Check file count
```bash
find /workspaces -type f | wc -l
```
**Expected**: ~97,000 files

### Check repository status
```bash
for dir in /workspaces/*/; do
  if [ -d "$dir/.git" ]; then
    echo "$(basename "$dir"): $(find "$dir" -type f | wc -l) files"
  fi
done
```

### Start development servers
```bash
# Main ecosystem
cd /workspaces/new-ecosysstem && npm run dev

# Individual services (in separate terminals)
cd /workspaces/hub-site && npm run dev
cd /workspaces/programs-platform && npm run dev
# etc.
```

## 🚨 Troubleshooting

### Repository not found errors
- **Cause**: Repository names in script don't match actual names
- **Solution**: Update `setup-complete-ecosystem.sh` with correct names

### Permission denied errors
- **Cause**: Private repositories or insufficient access
- **Solution**: Ensure you have access to all repositories

### Missing dependencies
- **Cause**: Node.js/npm not available
- **Solution**: Rebuild Codespace or install manually

### Low file count
- **Cause**: Missing repositories or node_modules not installed
- **Solution**: Run `npm install` in each repository

## 📞 Support

If you encounter issues:

1. **Check the setup script output** for specific error messages
2. **Verify repository names** in the elevateforhumanity organization
3. **Ensure you have access** to all required repositories
4. **Run the setup script again** after fixing repository names

## 🎯 Next Steps

Once setup is complete:

1. **Start development servers** for the services you're working on
2. **Check the main README.md** in each repository for specific instructions
3. **Configure environment variables** as needed
4. **Run tests** to verify everything is working

---

**💡 Tip**: The setup script is idempotent - you can run it multiple times safely to update repositories and install missing dependencies.