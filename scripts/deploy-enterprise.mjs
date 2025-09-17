#!/usr/bin/env node

/**
 * Quick Enterprise Deployment Script
 * Generates enterprise assets and deploys immediately
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = "sites/marketing";
const SM_DIR = path.join(OUT, "sitemaps");
const BASE = "https://www.elevateforhumanity.org";
const NOW = new Date();
const ISO = NOW.toISOString().slice(0, 10);

// Ensure directories exist
fs.mkdirSync(SM_DIR, { recursive: true });

console.log('🚀 Quick Enterprise Deployment Starting...');

// Generate sample enterprise sitemaps
const sampleUrls = [
  { url: `${BASE}/`, lastmod: ISO },
  { url: `${BASE}/about/`, lastmod: ISO },
  { url: `${BASE}/contact/`, lastmod: ISO },
  { url: `${BASE}/programs/`, lastmod: ISO },
  { url: `${BASE}/programs/cybersecurity/`, lastmod: ISO },
  { url: `${BASE}/programs/healthcare-cna/`, lastmod: ISO },
  { url: `${BASE}/programs/electrical-trades/`, lastmod: ISO },
  { url: `${BASE}/programs/construction/`, lastmod: ISO },
  { url: `${BASE}/programs/beauty-wellness/`, lastmod: ISO },
  { url: `${BASE}/blog/`, lastmod: ISO },
  { url: `${BASE}/employers/`, lastmod: ISO }
];

// Generate ultra-tiny sitemap
const generateSitemap = (urls, filename) => {
  const urlEntries = urls.map(u => 
    `  <url>\n    <loc>${u.url}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`
  ).join('\n');
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
  
  fs.writeFileSync(path.join(SM_DIR, filename), xml);
  return `${BASE}/sitemaps/${filename}`;
};

// Generate marketing sitemap
const marketingUrls = sampleUrls.filter(u => 
  u.url.includes('/about') || u.url.includes('/contact') || u.url === `${BASE}/`
);
const marketingSitemap = generateSitemap(marketingUrls, 'sitemap-marketing-2025-09-1.xml');

// Generate programs sitemap
const programUrls = sampleUrls.filter(u => u.url.includes('/programs'));
const programsSitemap = generateSitemap(programUrls, 'sitemap-programs-2025-09-1.xml');

// Generate latest sitemap
const latestSitemap = generateSitemap(sampleUrls.slice(0, 5), 'sitemap-latest.xml');

// Generate master sitemap index
const masterSitemaps = [marketingSitemap, programsSitemap, latestSitemap];
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${masterSitemaps.map(url => 
  `  <sitemap>\n    <loc>${url}</loc>\n    <lastmod>${ISO}</lastmod>\n  </sitemap>`
).join('\n')}
</sitemapindex>`;

fs.writeFileSync(path.join(OUT, "sitemap_index.xml"), indexXml);

// Generate enterprise robots.txt
const robotsContent = `User-agent: *
Allow: /

# Enterprise sitemaps
Sitemap: ${BASE}/sitemap_index.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1
`;

fs.writeFileSync(path.join(OUT, "robots.txt"), robotsContent);

// Generate enterprise schema
const schema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Elevate for Humanity Career & Training Institute",
  "url": BASE,
  "sameAs": [
    "https://www.facebook.com/elevateforhumanity",
    "https://www.linkedin.com/company/elevateforhumanity"
  ],
  "contactPoint": [{
    "@type": "ContactPoint",
    "telephone": "+1-317-555-1234",
    "contactType": "customer service"
  }],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Indianapolis",
    "addressRegion": "IN",
    "addressCountry": "US"
  },
  "description": "Enterprise-grade career training and workforce development programs"
};

fs.writeFileSync(path.join(OUT, "schema.json"), JSON.stringify(schema, null, 2));

// Update _redirects with enterprise rules
const redirects = `# Enterprise redirects
/career-uplift-services/certify-and-thrive-program   /programs/cybersecurity/ 301!
/career-uplift-services/secure-your-future--security---safety-training /programs/electrical-trades/ 301!
/career-uplift-services/healthcare-training          /programs/healthcare-cna/ 301!
/career-uplift-services/cloud-computing-training     /programs/cloud-computing/ 301!
/career-uplift-services/construction-skills-training /programs/construction/ 301!
/career-uplift-services/beauty-and-wellness          /programs/beauty-wellness/ 301!

# Blog redirects
/blog.php /blog/ 301!
/blog?p=:any /blog/ 301!

# Clean URL patterns
/programs/:program/index.html /programs/:program/ 301!

# Security headers
/*  /index.html  200
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
`;

fs.writeFileSync(path.join(OUT, "_redirects"), redirects);

// Generate deployment summary
const summary = {
  timestamp: new Date().toISOString(),
  engine: "EFH-Enterprise-Quick-Deploy/1.0",
  features: [
    "Ultra-tiny sitemaps generated",
    "Enterprise schema markup",
    "Netlify redirects configured",
    "SEO-optimized robots.txt"
  ],
  files: [
    "sitemap_index.xml",
    "sitemaps/sitemap-marketing-2025-09-1.xml",
    "sitemaps/sitemap-programs-2025-09-1.xml", 
    "sitemaps/sitemap-latest.xml",
    "robots.txt",
    "schema.json",
    "_redirects"
  ]
};

fs.writeFileSync(path.join(OUT, "deployment-summary.json"), JSON.stringify(summary, null, 2));

console.log('✅ Enterprise assets generated:');
console.log(`   • Master sitemap: sitemap_index.xml`);
console.log(`   • Ultra-tiny sitemaps: ${masterSitemaps.length} files`);
console.log(`   • Enterprise schema: schema.json`);
console.log(`   • Redirects: _redirects`);
console.log(`   • SEO robots: robots.txt`);
console.log('\n🚀 Ready for deployment!');