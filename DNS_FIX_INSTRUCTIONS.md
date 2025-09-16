# 🚨 DNS Configuration Fix for elevateforhumanity.org

## Current Problem
- **Domain**: elevateforhumanity.org
- **Error**: ERR_NAME_NOT_RESOLVED
- **Issue**: No A records configured for the domain
- **Nameservers**: ns1.systemdns.com, ns2.systemdns.com, ns3.systemdns.com (Active)

## Root Cause Analysis
✅ **Domain Registration**: Active and valid
✅ **Nameservers**: Working (systemdns.com)
❌ **DNS Records**: Missing A and CNAME records

## Required DNS Records

### For Cloudflare Pages Hosting
Configure these records in Cloudflare DNS:

```
# Root domain (elevateforhumanity.org)
Type: A
Name: @
Value: [Cloudflare Pages IP - provided in dashboard]
Proxy: Enabled (orange cloud)

# WWW subdomain (www.elevateforhumanity.org)
Type: CNAME
Name: www
Value: elevateforhumanity.org
Proxy: Enabled (orange cloud)
```

## Step-by-Step Fix

### Step 1: Access DNS Management
1. Log into your domain registrar/DNS provider
2. Look for "DNS Management" or "DNS Records"
3. Find the zone for elevateforhumanity.org

### Step 2: Add Root Domain A Record
```
Record Type: A
Host/Name: @ (or leave blank for root)
Points to/Value: [Cloudflare Pages IP from dashboard]
Proxy: Enabled (orange cloud)
```

### Step 3: Add WWW CNAME Record
```
Record Type: CNAME
Host/Name: www
Points to/Value: elevateforhumanity.org
Proxy: Enabled (orange cloud)
```

### Step 4: Configure Cloudflare Pages
1. Go to Cloudflare dashboard → Pages
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add custom domain: elevateforhumanity.org
6. Enable automatic deployments

## Testing Commands

After adding records, test with:

```bash
# Test root domain
curl -I https://elevateforhumanity.org

# Test www subdomain  
curl -I https://www.elevateforhumanity.org

# Check DNS propagation
dig elevateforhumanity.org A
dig www.elevateforhumanity.org CNAME
```

## Expected Timeline
- **DNS Propagation**: 15 minutes to 2 hours
- **Global Propagation**: Up to 24 hours
- **Vercel SSL**: Automatic after DNS resolves

## Verification Checklist
- [ ] A record added for root domain
- [ ] CNAME record added for www subdomain
- [ ] Domains added to Vercel project
- [ ] DNS propagation complete
- [ ] Site loads at both URLs
- [ ] HTTPS certificate active

## Common DNS Providers

### If using Cloudflare:
1. Login to Cloudflare dashboard
2. Select elevateforhumanity.org domain
3. Go to DNS → Records
4. Add the A and CNAME records above

### If using Google Domains:
1. Login to Google Domains
2. Select elevateforhumanity.org
3. Go to DNS → Custom records
4. Add the A and CNAME records above

### If using GoDaddy:
1. Login to GoDaddy
2. Go to My Products → DNS
3. Select elevateforhumanity.org
4. Add the A and CNAME records above

## Emergency Contact
If you need immediate assistance:
- Check your domain registrar's support documentation
- Contact your DNS provider's support team
- Verify you have admin access to the domain

**This is a DNS configuration issue, not a code problem. Your Durable site is live at elevateforhumanity.durable.co and redirects to elevateforhumanity.org, but the custom domain needs DNS configuration.**