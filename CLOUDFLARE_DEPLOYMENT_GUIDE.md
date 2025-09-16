# 🚀 Cloudflare Pages Deployment Guide

## Overview
Deploy elevateforhumanity.org to Cloudflare Pages for fast, global CDN hosting with automatic SSL and edge optimization.

## Prerequisites
- Cloudflare account
- GitHub repository access
- Domain added to Cloudflare DNS

## Step 1: Setup Cloudflare Pages

### 1.1 Connect Repository
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
2. Click "Create a project" → "Connect to Git"
3. Select your GitHub repository
4. Choose the main/master branch

### 1.2 Configure Build Settings
```
Framework preset: None (or Vite)
Build command: npm run build
Output directory: dist
Root directory: / (leave empty)
```

### 1.3 Environment Variables
Add these in Pages → Settings → Environment Variables:
```
NODE_VERSION = 20.17.0
NPM_FLAGS = --production=false
```

## Step 2: Custom Domain Setup

### 2.1 Add Domain to Cloudflare
1. Go to Cloudflare Dashboard → Websites
2. Add site: `elevateforhumanity.org`
3. Update nameservers at your registrar to Cloudflare's nameservers

### 2.2 Configure DNS Records
In Cloudflare DNS settings:
```
Type: A
Name: @
Content: [Cloudflare Pages IP from dashboard]
Proxy: Enabled (orange cloud)

Type: CNAME  
Name: www
Content: elevateforhumanity.org
Proxy: Enabled (orange cloud)
```

### 2.3 Add Custom Domain to Pages
1. Go to Pages → Your Project → Custom domains
2. Add domain: `elevateforhumanity.org`
3. Add domain: `www.elevateforhumanity.org`
4. Cloudflare will automatically provision SSL certificates

## Step 3: Verify Deployment

### 3.1 Test Build
```bash
# Test locally first
npm run build
npx serve dist

# Check build output
ls -la dist/
```

### 3.2 Test Live Site
```bash
# Test main domain
curl -I https://elevateforhumanity.org

# Test www subdomain
curl -I https://www.elevateforhumanity.org

# Test redirects
curl -I https://elevateforhumanity.org/programs
```

### 3.3 Verify SEO
- Check robots.txt: `https://www.elevateforhumanity.org/robots.txt`
- Check sitemap: `https://www.elevateforhumanity.org/sitemap-index.xml`
- Verify canonical URLs in page source

## Step 4: Performance Optimization

### 4.1 Cloudflare Settings
Enable these in Cloudflare Dashboard:
- **Speed** → Auto Minify (CSS, JS, HTML)
- **Speed** → Brotli compression
- **Caching** → Browser Cache TTL: 4 hours
- **SSL/TLS** → Full (strict)

### 4.2 Page Rules (Optional)
Create page rules for:
- Cache everything: `*.elevateforhumanity.org/*`
- Always use HTTPS: `*elevateforhumanity.org/*`

## Step 5: Monitoring & Analytics

### 5.1 Cloudflare Analytics
- Monitor traffic in Cloudflare Dashboard → Analytics
- Track Core Web Vitals
- Monitor security threats

### 5.2 Google Search Console
1. Add property: `https://www.elevateforhumanity.org`
2. Verify via DNS TXT record
3. Submit sitemap: `https://www.elevateforhumanity.org/sitemap-index.xml`

## Troubleshooting

### Build Failures
- Check Node.js version (should be 20.17.0)
- Verify package.json scripts
- Check build logs in Pages dashboard

### DNS Issues
- Ensure nameservers point to Cloudflare
- Verify DNS records are proxied (orange cloud)
- Wait up to 24 hours for global propagation

### SSL Certificate Issues
- Ensure SSL/TLS mode is "Full (strict)"
- Check custom domain status in Pages
- Contact Cloudflare support if needed

## Files Created for Cloudflare
- `_headers` - Security headers and CORS configuration
- `_redirects` - URL redirects and SPA routing
- `CLOUDFLARE_BUILD_CONFIG.md` - Build configuration reference

## Expected Performance
- **Global CDN**: Sub-100ms response times worldwide
- **SSL**: Automatic certificate provisioning and renewal
- **Compression**: Brotli and Gzip compression enabled
- **Caching**: Intelligent edge caching
- **Security**: DDoS protection and WAF included

## Support Resources
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Community](https://community.cloudflare.com/)
- [Cloudflare Support](https://support.cloudflare.com/)

**Your site is now ready for deployment on Cloudflare Pages with optimal performance and security.**