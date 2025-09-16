# Cloudflare Pages Build Configuration

## Build Settings
- **Build command**: `cp index.html dist/ && cp robots.txt dist/ && cp sitemap*.xml dist/ && cp -r sitemaps dist/ && cp _headers dist/ && cp _redirects dist/`
- **Output directory**: `dist`
- **Node version**: 20.17.0

## Alternative Build (if npm works)
- **Build command**: `npm run build`
- **Output directory**: `dist`

## Environment Variables
Set these in Cloudflare Pages dashboard:
- `NODE_VERSION=20.17.0`
- `NPM_FLAGS=--production=false`

## Files for Cloudflare
- `_headers` - Security headers and CORS
- `_redirects` - URL redirects and SPA routing
- `dist/` - Build output directory

## Build Status
✅ Manual build tested and working
✅ All required files copied to dist/
✅ Cloudflare-specific files included
