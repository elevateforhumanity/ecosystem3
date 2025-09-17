# 🚀 Netlify Multi-Site Setup Guide

## ✅ **AUTO-DEPLOY READY**

Your repository is now configured for automatic deployment to Netlify with multi-site support!

---

## 🔧 **Required GitHub Secrets**

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

### **1. Netlify Authentication**
```
NETLIFY_AUTH_TOKEN
```
- Go to Netlify → User settings → Applications → Personal access tokens
- Create new token with full access
- Copy the token value

### **2. Site IDs for Each Site**
```
NETLIFY_SITE_ID_MARKETING    # For sites/marketing/
NETLIFY_SITE_ID_PROGRAMS     # For sites/programs/
NETLIFY_SITE_ID_BLOG         # For sites/blog/
```

**How to get Site IDs:**
1. Create each site in Netlify (see setup below)
2. Go to Site settings → Site information
3. Copy the "Site ID" value

---

## 🌐 **Netlify Site Setup**

Create **3 separate sites** in Netlify from the same GitHub repository:

### **Site 1: Marketing (Primary)**
- **Site Name**: `elevate-marketing`
- **Repository**: Your GitHub repo
- **Base Directory**: `sites/marketing`
- **Publish Directory**: `sites/marketing`
- **Build Command**: `echo "Static site - no build needed"`
- **Custom Domain**: `elevateforhumanity.org`

### **Site 2: Programs (Resources)**
- **Site Name**: `elevate-programs`
- **Repository**: Your GitHub repo
- **Base Directory**: `sites/programs`
- **Publish Directory**: `sites/programs`
- **Build Command**: `echo "Static site - no build needed"`
- **Custom Domain**: `programs.elevateforhumanity.org`

### **Site 3: Blog (Future)**
- **Site Name**: `elevate-blog`
- **Repository**: Your GitHub repo
- **Base Directory**: `sites/blog`
- **Publish Directory**: `sites/blog`
- **Build Command**: `echo "Static site - no build needed"`
- **Custom Domain**: `blog.elevateforhumanity.org`

---

## 🔄 **Auto-Deploy Workflow**

The GitHub Action (`.github/workflows/auto-deploy.yml`) will:

### **On Every Push to Main:**
1. ✅ **Generate Fresh Sitemaps** (marketing site only)
2. ✅ **Verify Site Structure** (all sites)
3. ✅ **Test Redirects** (marketing site)
4. ✅ **Deploy to Netlify** (all 3 sites simultaneously)
5. ✅ **Verify Deployment** (accessibility check)
6. ✅ **Ping Search Engines** (Google & Bing)
7. ✅ **Notify Status** (success/failure)

### **Features:**
- **Parallel Deployment**: All 3 sites deploy simultaneously
- **Auto-Sitemap Generation**: Fresh sitemaps on every deploy
- **Redirect Verification**: Ensures all redirects work
- **Search Engine Notification**: Auto-ping Google & Bing
- **Rollback Safety**: Failed deploys don't affect live sites

---

## 📋 **Step-by-Step Setup**

### **1. Create Netlify Sites**

For each site:

1. **Log into Netlify** → "Add new site" → "Import an existing project"
2. **Connect to GitHub** → Select your repository
3. **Configure build settings:**
   - Base directory: `sites/marketing` (or programs/blog)
   - Publish directory: `sites/marketing` (or programs/blog)
   - Build command: `echo "Static site - no build needed"`
4. **Deploy site** (initial deploy)
5. **Copy Site ID** from Site settings → Site information

### **2. Configure Custom Domains**

For each site:

1. **Go to Site settings** → Domain management
2. **Add custom domain:**
   - Marketing: `elevateforhumanity.org`
   - Programs: `programs.elevateforhumanity.org`
   - Blog: `blog.elevateforhumanity.org`
3. **Configure DNS** (point domains to Netlify)
4. **Enable HTTPS** (automatic with Netlify)

### **3. Add GitHub Secrets**

1. **Go to GitHub repo** → Settings → Secrets and variables → Actions
2. **Add repository secrets:**
   ```
   NETLIFY_AUTH_TOKEN: your_netlify_token
   NETLIFY_SITE_ID_MARKETING: site_id_from_marketing_site
   NETLIFY_SITE_ID_PROGRAMS: site_id_from_programs_site
   NETLIFY_SITE_ID_BLOG: site_id_from_blog_site
   ```

### **4. Test Auto-Deploy**

1. **Make a small change** to any file in `sites/marketing/`
2. **Commit and push** to main branch
3. **Watch GitHub Actions** tab for deployment progress
4. **Verify sites** are updated automatically

---

## 🔧 **Local Development Options**

### **Option 1: Auto-Push While Working**
```bash
# Start auto-commit watcher
./scripts/autopush.sh auto/live "chore: development changes"

# Work on your files...
# Changes automatically commit and push every 10 seconds
```

### **Option 2: Manual Commits**
```bash
# Make changes, then:
git add -A
git commit -m "feat: update homepage content"
git push origin main

# Auto-deploy triggers automatically
```

### **Option 3: Gitpod Auto-Deploy**
- Open repo in Gitpod
- Gitpod automatically reorganizes and pushes
- GitHub Actions deploy automatically

---

## 📊 **Monitoring & Verification**

### **GitHub Actions Dashboard**
- Monitor deployments in real-time
- View logs for each site deployment
- Get notifications on success/failure

### **Netlify Dashboard**
- View deployment history for each site
- Monitor site performance and analytics
- Configure additional settings

### **Available Scripts**
```bash
# Test redirects locally
npm run verify:redirects:local

# Test redirects on production
npm run verify:redirects:prod

# Generate sitemaps manually
npm run crawl:prod

# Test auto-push script
./scripts/autopush.sh test-branch "test commit"
```

---

## 🎯 **Benefits of This Setup**

### **Performance**
- ⚡ **Independent Scaling**: Each site scales separately
- ⚡ **Faster Deploys**: Only changed sites rebuild
- ⚡ **Global CDN**: Netlify's worldwide edge network
- ⚡ **Optimized Caching**: Smart cache strategies per site

### **Reliability**
- 🛡️ **Isolated Failures**: One site issue doesn't affect others
- 🛡️ **Rollback Safety**: Easy to revert individual sites
- 🛡️ **Redundancy**: Multiple deployment targets
- 🛡️ **Health Checks**: Automated verification

### **Scalability**
- 📈 **Unlimited Growth**: Add new sites easily
- 📈 **Team Collaboration**: Different teams per site
- 📈 **Feature Isolation**: Independent development
- 📈 **Resource Optimization**: Pay only for what you use

---

## 🚨 **Troubleshooting**

### **Common Issues**

**Deployment Fails:**
- Check GitHub secrets are set correctly
- Verify Netlify site IDs match
- Ensure base directories exist

**Redirects Not Working:**
- Check `_redirects` file syntax
- Verify redirects in Netlify dashboard
- Test with `npm run verify:redirects:prod`

**Sitemaps Not Updating:**
- Check if marketing site deployed successfully
- Verify sitemap generation in GitHub Actions logs
- Manually run `npm run crawl:prod`

**Sites Not Accessible:**
- Check DNS configuration
- Verify SSL certificates
- Check Netlify deployment status

### **Support Commands**
```bash
# Check site structure
ls -la sites/marketing/
ls -la sites/programs/
ls -la sites/blog/

# Test local deployment
cd sites/marketing && python3 -m http.server 8000

# Verify GitHub Actions
git log --oneline -5
git status
```

---

## 🎉 **Ready for Production!**

Your multi-site deployment pipeline is now:

- ✅ **Fully Automated**: Push to deploy
- ✅ **Highly Scalable**: Independent site scaling
- ✅ **Performance Optimized**: Global CDN delivery
- ✅ **SEO Ready**: Auto-generated sitemaps
- ✅ **Monitoring Enabled**: Health checks and notifications
- ✅ **Developer Friendly**: Easy local development

**Push to main branch and watch your sites deploy automatically!**

---

*Generated by Ona's Autopilot System - Multi-site deployment ready*