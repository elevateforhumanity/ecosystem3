#!/usr/bin/env python3
"""
Generate unified sitemap index for main + sister sites.

Outputs:
- public/sitemaps/sitemap_index.xml
- public/sitemaps/fallback-<slug>.xml (only when a site has no sitemap)

Reads config from wire_in_sisters/sister_sites.yaml
"""
import os
import sys
import re
import time
import json
import hashlib
from urllib.parse import urljoin

try:
    import yaml  # type: ignore
except Exception as e:
    print("Missing dependency: pyyaml. Falling back to simple parser failed.", file=sys.stderr)
    print("Please add pyyaml to your environment if running locally: pip install pyyaml", file=sys.stderr)
    raise


ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, 'wire_in_sisters', 'sister_sites.yaml')
PUBLIC = os.path.join(ROOT, 'public')
SITEMAPS_DIR = os.path.join(PUBLIC, 'sitemaps')
ROBOTS_TEMPLATE = os.path.join(ROOT, 'wire_in_sisters', 'robots.txt.template')
ROBOTS_OUT = os.path.join(PUBLIC, 'robots.txt')


def slugify(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def ensure_dirs():
    os.makedirs(SITEMAPS_DIR, exist_ok=True)


def load_config():
    with open(CONFIG, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def write_file(path: str, content: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)


def iso_date(ts: float | None = None) -> str:
    if ts is None:
        ts = time.time()
    return time.strftime('%Y-%m-%d', time.gmtime(ts))


def build_fallback_sitemap(base_url: str, pages: list[str]) -> str:
    today = iso_date()
    urls = []
    for p in pages:
        loc = p
        if not (p.startswith('http://') or p.startswith('https://')):
            loc = urljoin(base_url.rstrip('/') + '/', p.lstrip('/'))
        urls.append(f"  <url><loc>{loc}</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>")
    return """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{urls}
</urlset>
""".replace('{urls}', "\n".join(urls))


def build_index(entries: list[tuple[str, str]]):
    # entries: list of (loc, lastmod)
    items = [f"  <sitemap><loc>{loc}</loc><lastmod>{lastmod}</lastmod></sitemap>" for loc, lastmod in entries]
    return """<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{items}
</sitemapindex>
""".replace('{items}', "\n".join(items))


def main():
    cfg = load_config()
    ensure_dirs()

    main_domain: str = cfg.get('main_domain', '').rstrip('/')
    sites: list[dict] = cfg.get('sites', [])

    if not main_domain:
        print('main_domain missing in wire_in_sisters/sister_sites.yaml', file=sys.stderr)
        sys.exit(1)

    index_entries: list[tuple[str, str]] = []
    today = iso_date()

    for site in sites:
        url = site.get('url', '').rstrip('/')
        name = site.get('name') or url
        slug = slugify(name or url)
        sitemap_url = site.get('sitemap')
        seed_pages = site.get('seed_pages') or []

        if sitemap_url:
            index_entries.append((sitemap_url, today))
        elif seed_pages:
            # write fallback sitemap
            fallback_name = f"fallback-{slug}.xml"
            fallback_path = os.path.join(SITEMAPS_DIR, fallback_name)
            fallback_content = build_fallback_sitemap(url, seed_pages)
            write_file(fallback_path, fallback_content)
            fallback_public_url = f"{main_domain}/sitemaps/{fallback_name}"
            index_entries.append((fallback_public_url, today))
        else:
            # minimal: include just the home page
            fallback_name = f"fallback-{slug}.xml"
            fallback_path = os.path.join(SITEMAPS_DIR, fallback_name)
            fallback_content = build_fallback_sitemap(url, ['/'])
            write_file(fallback_path, fallback_content)
            fallback_public_url = f"{main_domain}/sitemaps/{fallback_name}"
            index_entries.append((fallback_public_url, today))

    index_xml = build_index(index_entries)
    index_path = os.path.join(SITEMAPS_DIR, 'sitemap_index.xml')
    write_file(index_path, index_xml)
    print(f"Wrote {index_path} with {len(index_entries)} entries")

    # Render robots.txt from template
    try:
        with open(ROBOTS_TEMPLATE, 'r', encoding='utf-8') as f:
            tpl = f.read()
        robots = tpl.replace('{{ main_domain }}', main_domain)
        write_file(ROBOTS_OUT, robots)
        print(f"Wrote {ROBOTS_OUT}")
    except FileNotFoundError:
        print("robots.txt.template not found; skipping robots write", file=sys.stderr)


if __name__ == '__main__':
    main()
