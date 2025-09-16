# Dev → Push → Deploy (Netlify + Codespaces)

## 1) Develop (Codespaces)
- Start dev server:
  - npm run dev
- Preview in browser:
  - "$BROWSER" http://localhost:5173  # or the Codespaces forwarded URL

## 2) Preflight (optional local check)
- Fresh install/build:
  - npm ci
  - npm run build
  - npm run preview &
  - sleep 2
  - curl -fsS http://localhost:3000/robots.txt >/dev/null && echo "robots OK"
  - curl -fsS http://localhost:3000/sitemap-index.xml >/dev/null && echo "sitemap OK"
  - kill %1

## 3) Push to GitHub
- git add -A
- git commit -m "feat: update site" --no-gpg-sign
- git push origin main

## 4) Netlify Deploy (auto)
- Repo connected in Netlify
- Build command: npm run build
- Publish dir: dist
- Environment:
  - SITE_URL = https://your-site.netlify.app (or custom domain)
  - NODE_VERSION = 20

## 5) Verify live
- curl -I "$SITE_URL"
- "$BROWSER" "$SITE_URL"
- "$BROWSER" "$SITE_URL/sitemap-index.xml"
- "$BROWSER" "$SITE_URL/robots.txt"

## Troubleshooting
- 404 or health check fails:
  - Ensure SITE_URL is set in Netlify env
  - Confirm postbuild generates sitemap/robots (dist/robots.txt, dist/sitemap-index.xml)
  - Check generate-sitemap.ts uses process.env.SITE_URL
- Redeploy:
  - Trigger from Netlify UI or push an empty commit:
    - git commit --allow-empty -m "chore: redeploy" && git push