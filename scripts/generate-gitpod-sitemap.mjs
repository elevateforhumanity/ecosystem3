#!/usr/bin/env node
// scripts/generate-gitpod-sitemap.mjs
// Crawls Gitpod preview URL and generates sitemap.xml

import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";

const GITPOD_WORKSPACE_ID = process.env.GITPOD_WORKSPACE_ID;
const GITPOD_WORKSPACE_CLUSTER_HOST = process.env.GITPOD_WORKSPACE_CLUSTER_HOST;
const PORT = process.env.PORT || "5173";

// Construct Gitpod preview URL
const PREVIEW_URL = GITPOD_WORKSPACE_ID && GITPOD_WORKSPACE_CLUSTER_HOST 
  ? `https://${PORT}-${GITPOD_WORKSPACE_ID}.${GITPOD_WORKSPACE_CLUSTER_HOST}`
  : `http://localhost:${PORT}`;

const PRODUCTION_DOMAIN = "https://www.elevateforhumanity.org";
const MAX_URLS = 1000;
const CONCURRENCY = 4;

console.log(`🕷️ Crawling Gitpod preview: ${PREVIEW_URL}`);

const sameOrigin = (url, base) => {
  try {
    const a = new URL(url, base);
    const b = new URL(base);
    return a.origin === b.origin;
  } catch { return false; }
};

const normalizeUrl = (url, base) => {
  try {
    const u = new URL(url, base);
    u.hash = ""; // Remove fragments
    if (u.pathname.endsWith("/") && u.pathname !== "/") {
      u.pathname = u.pathname.slice(0, -1);
    }
    return u.toString();
  } catch { return null; }
};

const extractLinks = (html, base) => {
  const links = new Set();
  const hrefRegex = /<a[^>]+href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html))) {
    const normalized = normalizeUrl(match[1], base);
    if (normalized) links.add(normalized);
  }
  return [...links];
};

async function crawl(seedUrl, maxUrls, concurrency) {
  const baseOrigin = new URL(seedUrl).origin;
  const queue = [normalizeUrl(seedUrl, baseOrigin)];
  const seen = new Set(queue.filter(Boolean));
  const results = new Set();

  async function worker() {
    while (queue.length && results.size < maxUrls) {
      const current = queue.shift();
      if (!current) continue;

      try {
        console.log(`📄 Crawling: ${current}`);
        const response = await fetch(current, { redirect: "follow" });
        const contentType = response.headers.get("content-type") || "";
        
        if (!contentType.includes("text/html")) {
          results.add(current);
          continue;
        }

        const html = await response.text();
        results.add(current);

        const links = extractLinks(html, current)
          .filter(url => sameOrigin(url, baseOrigin))
          .map(url => normalizeUrl(url, baseOrigin))
          .filter(Boolean);

        for (const link of links) {
          if (!seen.has(link) && results.size + queue.length < maxUrls) {
            seen.add(link);
            queue.push(link);
          }
        }
      } catch (error) {
        console.warn(`⚠️ Error crawling ${current}:`, error.message);
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  
  return [...results].filter(url => sameOrigin(url, baseOrigin));
}

function generateSitemap(urls, productionDomain) {
  const lastmod = new Date().toISOString();
  const entries = urls
    .map(url => {
      // Replace Gitpod URL with production domain
      const productionUrl = url.replace(new URL(url).origin, productionDomain);
      return `  <url><loc>${productionUrl.replace(/&/g, "&amp;")}</loc><lastmod>${lastmod}</lastmod></url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

async function writeSafe(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf8");
  console.log(`📝 Wrote ${path}`);
}

async function main() {
  try {
    // Test if preview server is accessible
    const testResponse = await fetch(PREVIEW_URL);
    if (!testResponse.ok) {
      throw new Error(`Preview server not accessible: ${testResponse.status}`);
    }

    const urls = await crawl(PREVIEW_URL, MAX_URLS, CONCURRENCY);
    console.log(`🔢 Found ${urls.length} URLs`);

    if (urls.length === 0) {
      console.warn("⚠️ No URLs found. Make sure the preview server is running.");
      return;
    }

    const sitemapXml = generateSitemap(urls, PRODUCTION_DOMAIN);
    await writeSafe(resolve("public/sitemap.xml"), sitemapXml);

    // Also write to dist if it exists
    try {
      await writeSafe(resolve("dist/sitemap.xml"), sitemapXml);
    } catch {
      // dist might not exist, that's ok
    }

    console.log(`✅ Generated sitemap with ${urls.length} URLs`);
    console.log(`🌐 Preview URL: ${PREVIEW_URL}`);
    console.log(`🚀 Production domain: ${PRODUCTION_DOMAIN}`);

  } catch (error) {
    console.error("❌ Error generating sitemap:", error.message);
    process.exit(1);
  }
}

main();