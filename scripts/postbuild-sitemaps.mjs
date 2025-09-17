#!/usr/bin/env node
// 🧭 Dynamic sitemap generation for incremental deployments
import fs from "node:fs";
import path from "node:path";

const ROOT = "deploy";
const BASE_URL = "https://www.elevateforhumanity.org";

console.log("🧭 Generating sitemaps for incremental deployment...");

function exists(p) { 
  return fs.existsSync(path.join(ROOT, p)); 
}

function getLastMod(p) {
  try {
    const fullPath = path.join(ROOT, p);
    const stats = fs.statSync(fullPath);
    return stats.mtime.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

// Core pages that should always be in sitemap if they exist
const corePages = [
  { path: "", file: "index.html", priority: "1.0", changefreq: "daily" },
  { path: "programs/", file: "programs/index.html", priority: "0.9", changefreq: "weekly" },
  { path: "contracts/", file: "contracts/index.html", priority: "0.9", changefreq: "weekly" },
  { path: "students/", file: "students/index.html", priority: "0.8", changefreq: "weekly" },
  { path: "contact/", file: "contact/index.html", priority: "0.8", changefreq: "monthly" },
  { path: "about/", file: "about/index.html", priority: "0.7", changefreq: "monthly" }
];

// Legacy HTML files that might exist
const legacyPages = [
  { path: "programs.html", priority: "0.9", changefreq: "weekly" },
  { path: "government-services.html", priority: "0.9", changefreq: "weekly" },
  { path: "account.html", priority: "0.8", changefreq: "weekly" },
  { path: "connect.html", priority: "0.8", changefreq: "monthly" },
  { path: "hub.html", priority: "0.7", changefreq: "monthly" },
  { path: "compliance.html", priority: "0.6", changefreq: "monthly" },
  { path: "pay.html", priority: "0.6", changefreq: "monthly" }
];

// Policy pages
const policyPages = [
  { path: "policies/privacy.html", priority: "0.5", changefreq: "monthly" },
  { path: "policies/refund.html", priority: "0.5", changefreq: "monthly" },
  { path: "policies/terms.html", priority: "0.5", changefreq: "monthly" },
  { path: "accessibility/", file: "accessibility/index.html", priority: "0.6", changefreq: "monthly" }
];

// Generate XML for a set of URLs
function generateSitemapXML(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

// Collect existing pages
const coreUrls = corePages
  .filter(page => exists(page.file || page.path))
  .map(page => ({
    loc: `${BASE_URL}/${page.path}`,
    lastmod: getLastMod(page.file || page.path),
    changefreq: page.changefreq,
    priority: page.priority
  }));

const legacyUrls = legacyPages
  .filter(page => exists(page.path))
  .map(page => ({
    loc: `${BASE_URL}/${page.path}`,
    lastmod: getLastMod(page.path),
    changefreq: page.changefreq,
    priority: page.priority
  }));

const policyUrls = policyPages
  .filter(page => exists(page.file || page.path))
  .map(page => ({
    loc: `${BASE_URL}/${page.path}`,
    lastmod: getLastMod(page.file || page.path),
    changefreq: page.changefreq,
    priority: page.priority
  }));

// Auto-discover program pages
const programUrls = [];
const programsDir = path.join(ROOT, 'programs');
if (fs.existsSync(programsDir)) {
  try {
    const programFiles = fs.readdirSync(programsDir, { withFileTypes: true });
    programFiles.forEach(file => {
      if (file.isDirectory()) {
        const indexPath = path.join('programs', file.name, 'index.html');
        if (exists(indexPath)) {
          programUrls.push({
            loc: `${BASE_URL}/programs/${file.name}/`,
            lastmod: getLastMod(indexPath),
            changefreq: 'monthly',
            priority: '0.7'
          });
        }
      }
    });
  } catch (error) {
    console.log('⚠️  Could not scan programs directory');
  }
}

// Create sitemaps directory
const sitemapsDir = path.join(ROOT, 'sitemaps');
fs.mkdirSync(sitemapsDir, { recursive: true });

// Generate individual sitemaps
const sitemaps = [];

if (coreUrls.length > 0) {
  fs.writeFileSync(
    path.join(sitemapsDir, 'core.xml'),
    generateSitemapXML(coreUrls)
  );
  sitemaps.push('core.xml');
  console.log(`   📄 Core sitemap: ${coreUrls.length} pages`);
}

if (programUrls.length > 0) {
  fs.writeFileSync(
    path.join(sitemapsDir, 'programs.xml'),
    generateSitemapXML(programUrls)
  );
  sitemaps.push('programs.xml');
  console.log(`   📚 Programs sitemap: ${programUrls.length} pages`);
}

if (policyUrls.length > 0) {
  fs.writeFileSync(
    path.join(sitemapsDir, 'policies.xml'),
    generateSitemapXML(policyUrls)
  );
  sitemaps.push('policies.xml');
  console.log(`   📋 Policies sitemap: ${policyUrls.length} pages`);
}

if (legacyUrls.length > 0) {
  fs.writeFileSync(
    path.join(sitemapsDir, 'legacy.xml'),
    generateSitemapXML(legacyUrls)
  );
  sitemaps.push('legacy.xml');
  console.log(`   🔗 Legacy sitemap: ${legacyUrls.length} pages`);
}

// Generate sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${BASE_URL}/sitemaps/${sitemap}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapIndex);

const totalUrls = coreUrls.length + programUrls.length + policyUrls.length + legacyUrls.length;
console.log(`✅ Generated sitemap index with ${sitemaps.length} sitemaps covering ${totalUrls} URLs`);

// Generate sitemap summary for deployment manifest
const sitemapSummary = {
  totalSitemaps: sitemaps.length,
  totalUrls: totalUrls,
  sitemaps: sitemaps,
  lastGenerated: new Date().toISOString()
};

fs.writeFileSync(
  path.join(ROOT, 'sitemap-summary.json'),
  JSON.stringify(sitemapSummary, null, 2)
);