# Google Console Setup and SEO Best Practices

This repository now includes automated tools for setting up Google Analytics, Google Search Console verification, and SEO best practices.

## Quick Setup

1. **Create your environment configuration**:
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local` with your actual values**:
   ```bash
   # Google Analytics 4 Measurement ID
   GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
   
   # Google Search Console verification code
   GOOGLE_SITE_VERIFICATION=your-google-verification-code-here
   
   # Your website's canonical domain
   CANONICAL_DOMAIN=https://your-domain.com
   ```

3. **Apply Google configurations**:
   ```bash
   npm run google:apply
   ```

4. **Generate and submit sitemaps**:
   ```bash
   npm run sitemaps:submit
   ```

## Available Commands

### Google Configuration
- `npm run google:apply` - Replaces Google Analytics and Search Console placeholders across all HTML files

### Sitemap Management
- `npm run sitemaps:generate` - Generates XML sitemaps with current domain
- `npm run sitemaps:ping` - Pings search engines about sitemap updates
- `npm run sitemaps:submit` - Generates and pings sitemaps in one command

### SEO Meta Tags
- Run `node enhanced-meta-tags-updater.js` to add enhanced meta tags to key pages

## Features Implemented

### ✅ Google Analytics Integration
- Automatic GA4 script injection
- Environment-based configuration
- Page tracking with custom titles

### ✅ Google Search Console Verification
- Automated verification meta tag insertion
- Environment-based verification codes

### ✅ SEO Best Practices
- Open Graph meta tags for social sharing
- Twitter Card meta tags
- Structured data (JSON-LD) for rich snippets
- Proper canonical URLs
- Security headers and robots meta tags

### ✅ Sitemap Generation
- Organized sitemap structure with groups (high-priority, compliance, partners, etc.)
- Automatic exclusion of admin and development files
- Environment-based canonical domain support
- Proper XML formatting and timestamps

### ✅ Robots.txt Configuration
- Properly configured to allow main content
- Blocks admin and development directories
- References generated sitemaps

## Production Deployment

1. Set your production environment variables:
   - `GOOGLE_ANALYTICS_ID` - Your Google Analytics 4 Measurement ID
   - `GOOGLE_SITE_VERIFICATION` - Your Google Search Console verification code
   - `CANONICAL_DOMAIN` - Your production domain URL

2. Run the configuration scripts:
   ```bash
   npm run google:apply
   npm run sitemaps:generate
   ```

3. Submit sitemaps to Google Search Console:
   - Go to Google Search Console
   - Add your sitemap URL: `https://your-domain.com/sitemap-index.xml`

## Verification

### Google Analytics
- Check that tracking is working in Google Analytics Real-time reports
- Verify GA4 configuration in browser developer tools

### Google Search Console
- Verify your site verification is working
- Submit your sitemap and check for errors
- Monitor crawl status and indexing

### SEO Meta Tags
- Use Google's Rich Results Test to validate structured data
- Check Open Graph tags with Facebook's Sharing Debugger
- Validate Twitter Cards with Twitter's Card Validator

## Files Modified

- `/scripts/apply-google-config.js` - New script for Google configuration
- `/package.json` - Added `google:apply` npm script
- `/enhanced-meta-tags-updater.js` - Updated to read environment variables
- `/google-site-verification.html` - Verification placeholder updated
- Various HTML files - Google Analytics IDs replaced

## Environment Variables

```bash
# Required for Google services
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=your-verification-code

# Optional
BING_SITE_VERIFICATION=your-bing-verification-code
CANONICAL_DOMAIN=https://your-domain.com
```