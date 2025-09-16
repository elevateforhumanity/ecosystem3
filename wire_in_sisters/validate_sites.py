#!/usr/bin/env python3
"""
Validate sister sites: HTTP status, page title, canonical tag, robots noindex.
Prints a compact report to stdout for CI consumption.
"""
import sys
import os
import re
from html.parser import HTMLParser

try:
    import yaml  # type: ignore
except Exception:
    print("Please install pyyaml to run validator locally: pip install pyyaml", file=sys.stderr)
    raise

try:
    import requests  # type: ignore
except Exception:
    print("Please install requests to run validator locally: pip install requests", file=sys.stderr)
    raise

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG = os.path.join(ROOT, 'wire_in_sisters', 'sister_sites.yaml')


class MetaParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = None
        self.canon = None
        self.noindex = False
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        if tag.lower() == 'title':
            self._in_title = True
        if tag.lower() == 'link':
            d = dict(attrs)
            if d.get('rel') == 'canonical' and 'href' in d:
                self.canon = d['href']
        if tag.lower() == 'meta':
            d = dict(attrs)
            name = (d.get('name') or d.get('property') or '').lower()
            if name in ('robots', 'googlebot'):
                content = (d.get('content') or '').lower()
                if 'noindex' in content:
                    self.noindex = True

    def handle_endtag(self, tag):
        if tag.lower() == 'title':
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title = (self.title or '') + data.strip()


def load_config():
    with open(CONFIG, 'r', encoding='utf-8') as f:
        return yaml.safe_load(f)


def check(url: str):
    try:
        r = requests.get(url, timeout=15)
        status = r.status_code
        ok = 200 <= status < 400
        parser = MetaParser()
        if ok and r.text:
            parser.feed(r.text)
        return {
            'url': url,
            'status': status,
            'ok': ok,
            'title': parser.title,
            'canonical': parser.canon,
            'noindex': parser.noindex,
        }
    except Exception as e:
        return {'url': url, 'status': 0, 'ok': False, 'error': str(e)}


def main():
    cfg = load_config()
    sites = cfg.get('sites', [])
    results = []
    for s in sites:
        url = s.get('url')
        if not url:
            continue
        results.append(check(url))

    # Print a compact report
    print("Sister Sites Validation Report:")
    for r in results:
        line = f"- {r['url']} → {r.get('status')} {'OK' if r.get('ok') else 'FAIL'}"
        extras = []
        if r.get('title'):
            extras.append(f"title='{r['title'][:80]}'")
        if r.get('canonical'):
            extras.append(f"canonical={r['canonical']}")
        if r.get('noindex'):
            extras.append("NOINDEX")
        if r.get('error'):
            extras.append(f"error={r['error']}")
        if extras:
            line += " (" + ", ".join(extras) + ")"
        print(line)

    # Non-zero exit if any fails
    if any(not r.get('ok') for r in results):
        sys.exit(1)


if __name__ == '__main__':
    main()
