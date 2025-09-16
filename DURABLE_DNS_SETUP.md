# 🚀 Durable Custom Domain Setup Guide

## Current Status
- **✅ Durable Site**: https://elevateforhumanity.durable.co (Live)
- **✅ Redirect Configured**: 308 redirect to elevateforhumanity.org
- **❌ Custom Domain**: elevateforhumanity.org (DNS not configured)

## Required DNS Configuration

### Step 1: Add DNS Records
At your DNS provider (systemdns.com), add these CNAME records:

```
Record Type: CNAME
Name: @
Value: elevateforhumanity.durable.co
TTL: 3600

Record Type: CNAME  
Name: www
Value: elevateforhumanity.durable.co
TTL: 3600
```

### Step 2: Configure in Durable Dashboard
1. Login to your Durable account
2. Go to your site settings
3. Navigate to "Custom Domain" or "Domain Settings"
4. Add `elevateforhumanity.org` as your custom domain
5. Complete any verification steps required

### Step 3: Verify Setup
After DNS propagation (15 minutes to 2 hours):

```bash
# Test custom domain
curl -I https://elevateforhumanity.org

# Test www subdomain
curl -I https://www.elevateforhumanity.org

# Run comprehensive test
./test-dns-fix.sh
```

## Expected Behavior After Setup

1. **https://elevateforhumanity.durable.co** → redirects to → **https://elevateforhumanity.org**
2. **https://elevateforhumanity.org** → serves your site
3. **https://www.elevateforhumanity.org** → serves your site

## SEO Configuration Status ✅

Your site is already optimized for search engines:
- **Canonical URLs**: Point to www.elevateforhumanity.org
- **Sitemaps**: Reference correct domain
- **Robots.txt**: Properly configured
- **Meta tags**: SEO optimized

## Troubleshooting

### If DNS doesn't work:
1. Verify CNAME records are correct
2. Check TTL settings (use 3600 or Auto)
3. Wait up to 24 hours for full propagation
4. Contact your DNS provider if issues persist

### If Durable doesn't recognize domain:
1. Ensure domain is added in Durable dashboard
2. Complete any verification steps
3. Check Durable's custom domain documentation
4. Contact Durable support if needed

## Monitoring Progress

Run this command to check DNS status:
```bash
watch -n 30 './test-dns-fix.sh'
```

This will check every 30 seconds until your domain is live.

**Once DNS is configured, your site will be fully accessible at elevateforhumanity.org with proper SEO indexing ready.**