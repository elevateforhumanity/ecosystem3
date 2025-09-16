# Wire In Sister Sites – Unified Sitemap & Robots Automation

This kit generates a unified sitemap index for your main site and any number of sister sites, writes fallbacks when a site has no sitemap, and updates `public/robots.txt` to point search engines to the unified index. It also includes a GitHub Action to keep everything fresh weekly and on every push.

## Files

- `wire_in_sisters/sister_sites.yaml` – Configure your `main_domain` and sister sites
- `wire_in_sisters/generate_sitemaps.py` – Builds `public/sitemaps/sitemap_index.xml` and any fallbacks
- `wire_in_sisters/validate_sites.py` – Validates that each site is reachable and not accidentally `noindex`
- `wire_in_sisters/robots.txt.template` – Template used to write `public/robots.txt`
- `.github/workflows/sister-sites.yml` – CI job that runs weekly + on push

## Quick start

1. Edit `wire_in_sisters/sister_sites.yaml` with your real domains. Provide either `sitemap:` or `seed_pages:` for each sister.
2. Commit and push your changes to `main`.
3. Ensure your hosting serves `public/` at site root so the index is at:
   `https://<your-domain>/sitemaps/sitemap_index.xml`

## Local run (optional)

```bash
# Install deps (only for local validation)
pip install pyyaml requests

# Generate sitemaps and robots
python wire_in_sisters/generate_sitemaps.py

# Validate sites
python wire_in_sisters/validate_sites.py || true
```

Outputs:
- `public/sitemaps/sitemap_index.xml`
- `public/sitemaps/fallback-*.xml` as needed
- `public/robots.txt` (will point to unified index)

## Notes
- The Action intentionally avoids external crawling; it never fetches a site’s sitemap. It only links to provided sitemaps and builds fallbacks from `seed_pages`.
- If a site has both `sitemap` and `seed_pages`, the official `sitemap` will be used; fallbacks are skipped.