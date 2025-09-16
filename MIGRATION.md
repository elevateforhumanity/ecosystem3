# Migration Guide: Moving off Vercel/Netlify

This repo is ready to deploy to AWS S3 + CloudFront via the included `deploy.sh`. Use this guide to cut over from Vercel or Netlify with minimal downtime and a clean rollback path.

## 0) TL;DR (Minimal Downtime)
- Ship to AWS with `npm run deploy` (or `ENABLE_HLS_UPLOAD=true npm run deploy`)
- Validate with `SITE_URL="https://your-domain" npm run verify:deploy`
- Point DNS to CloudFront (ALIAS/AAAA to your distribution)
- Keep old host active for 24–48 hours as rollback

## 1) Pre‑flight Checklist
- Domains: list primary and alternate domains (www/non-www)
- DNS provider access (Route53, Cloudflare, etc.)
- AWS account and IAM credentials with:
  - s3:List/Get/Put/DeleteObject on target buckets
  - cloudfront:CreateInvalidation
  - acm:RequestCertificate/Describe (if setting up TLS)
- Budget guardrails (set a Billing alert) – CloudFront/S3 are low cost but set alerts
- Confirm SPA vs MPA:
  - SPA needs CloudFront error mapping 403/404 -> `/index.html`

## 2) AWS Setup
### Certificates (TLS)
- Request/validate an ACM certificate in us-east-1 (N. Virginia) for your domain (e.g., `example.com`, `www.example.com`).

### S3 Bucket(s)
- Create a bucket for the site (e.g., `example-site-prod`). Keep "Block Public Access" ON.
- Do NOT enable S3 static website hosting (CloudFront will access the bucket via OAC).

### CloudFront Distribution
- Origin: your S3 bucket (via "Origin Access Control" / OAC)
- Cache behavior:
  - Default root object: `index.html`
  - Add custom error responses mapping 403/404 to `/index.html` with response code 200 (SPA)
  - Compress objects automatically: ON
  - Caching policy: honor cache-control headers (set by the deploy script)
- Alternate domain names (CNAMEs): `example.com`, `www.example.com`
- Custom SSL certificate: the ACM cert you validated
- (Optional) Logging to S3 bucket + CloudFront real-time logs

### S3 Bucket Policy (OAC)
- Attach a bucket policy allowing reads from your CloudFront distribution OAC only (see `deploy.sh` for a template comment).

## 3) Deploy Pipeline
- Configure `deploy.sh` variables:
  - `AWS_S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `SITE_URL`
- Run a deploy:
  - `npm run deploy`
- Optional HLS:
  - `ENABLE_HLS_UPLOAD=true` to upload playlists (no-cache) and segments (long cache)
  - Vars: `HLS_SOURCE_DIR`, `HLS_LOCAL_DIR`, `HLS_S3_BUCKET`, `HLS_PREFIX`, `HLS_INVALIDATION_PATHS`
- Verify public URLs:
  - `SITE_URL="https://your-domain" npm run verify:deploy`

What the script ensures:
- Fresh build, robots.txt + sitemap.xml generated
- HTML: `no-cache`; assets: `immutable, max-age=31536000`
- Correct content-types for robots/sitemap
- CloudFront invalidation triggered

## 4) DNS Cutover
- Create ALIAS/AAAA record(s) pointing your domain(s) to the CloudFront distribution
  - If using Route53: "Alias to CloudFront distribution"
  - If external DNS: use the distribution hostname (e.g., `dxxxxx.cloudfront.net`)
- Lower TTL (e.g., 60s) ahead of time to accelerate switch
- Staged rollout: flip a sand-box subdomain first (e.g., `preview.example.com`) and verify

## 5) Rollback Plan
- Keep Vercel/Netlify project active for 24–48 hours post-cutover
- If any critical issues arise:
  - Repoint DNS back to the old host
  - Investigate with `npm run verify:deploy` and CloudFront/S3 logs

## 6) Decommission Legacy Host (Optional)
- Remove Vercel/Netlify webhooks and secrets
- Archive or remove `vercel.json` / `netlify.toml` once fully cut over
- Update badges/docs referencing Vercel/Netlify

## 7) Post‑Cutover Validation
- Re-run `npm run verify:deploy` against your production `SITE_URL`
- Validate:
  - 200s on main pages
  - robots.txt and sitemap.xml accessible; submit sitemap to Google/Bing
  - TLS is valid and correct domains/CNAMEs respond
  - Assets are cached (immutable) and HTML is not

## 8) Cost & Observability Notes
- Costs are mainly CloudFront egress + S3 storage/requests
- Enable:
  - S3 access logs (optional)
  - CloudFront standard or real-time logs
  - CloudWatch alarms on 4xx/5xx spikes

## Commands Reference
```bash
# Deploy
npm run deploy

# Deploy with HLS and auto-verify
ENABLE_HLS_UPLOAD=true \
VERIFY_AFTER_DEPLOY=true \
SITE_URL="https://www.example.com" \
npm run deploy

# Verify only
SITE_URL="https://www.example.com" npm run verify:deploy
```

If you’re migrating to a different provider (e.g., Cloudflare Pages, Firebase Hosting, GitHub Pages), this project can adapt—ping me and I’ll script that target as well.
