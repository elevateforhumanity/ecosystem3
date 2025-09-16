const fs = require("fs");
const path = require("path");

const BASE_URL = "https://elevateforhumanity.org";
const PAGES_DIR = "./";

// Fine-grained URL structure for better crawling
const urlStructure = {
  // Core pages with high priority
  core: [
    { url: "", priority: "1.0", changefreq: "daily", lastmod: new Date().toISOString().split('T')[0] },
    { url: "programs", priority: "0.9", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] },
    { url: "hub", priority: "0.9", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] },
    { url: "connect", priority: "0.9", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] }
  ],
  // Ecosystem pages
  ecosystem: [
    { url: "sister-sites", priority: "0.8", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] },
    { url: "healthcare-services", priority: "0.8", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] },
    { url: "operational-agreements", priority: "0.7", changefreq: "monthly", lastmod: new Date().toISOString().split('T')[0] }
  ],
  // Program-specific pages
  programs: [
    { url: "programs/ai-data-science", priority: "0.8", changefreq: "weekly" },
    { url: "programs/wioa-workforce", priority: "0.8", changefreq: "weekly" },
    { url: "programs/professional-certifications", priority: "0.8", changefreq: "weekly" },
    { url: "programs/community-connect", priority: "0.7", changefreq: "weekly" }
  ],
  // Support pages
  support: [
    { url: "lms", priority: "0.7", changefreq: "weekly", lastmod: new Date().toISOString().split('T')[0] },
    { url: "compliance", priority: "0.6", changefreq: "monthly" },
    { url: "pay", priority: "0.6", changefreq: "monthly" },
    { url: "partners", priority: "0.5", changefreq: "monthly" }
  ]
};

let urls = [];

function crawl(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== 'scripts') {
      crawl(full);
    } else if (file.endsWith(".html")) {
      let route = full.replace(PAGES_DIR, "").replace(/\\/g, "/");
      if (route === "index.html") route = "";
      else if (route.endsWith("/index.html")) route = route.replace("/index.html", "/");
      
      // Add discovered URLs with default metadata
      if (!urls.find(u => u.url === route)) {
        urls.push({
          url: route,
          priority: "0.5",
          changefreq: "monthly",
          lastmod: new Date().toISOString().split('T')[0]
        });
      }
    }
  }
}

// Combine structured URLs with discovered URLs
const allUrls = [
  ...urlStructure.core,
  ...urlStructure.ecosystem,
  ...urlStructure.programs,
  ...urlStructure.support
];

// Crawl for additional pages
crawl(PAGES_DIR);

// Merge discovered URLs with structured URLs
allUrls.forEach(structuredUrl => {
  const existingIndex = urls.findIndex(u => u.url === structuredUrl.url);
  if (existingIndex >= 0) {
    urls[existingIndex] = structuredUrl; // Replace with structured data
  } else {
    urls.push(structuredUrl); // Add new structured URL
  }
});

// Create fine-grained sitemap entries
const sitemapEntries = urls.map(urlObj => {
  const fullUrl = urlObj.url ? `${BASE_URL}/${urlObj.url}` : BASE_URL;
  
  return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${urlObj.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${urlObj.changefreq || 'monthly'}</changefreq>
    <priority>${urlObj.priority || '0.5'}</priority>
  </url>`;
}).join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>`;

const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /private/
Disallow: /.git/
Disallow: /node_modules/
Disallow: /scripts/

# Allow important pages
Allow: /programs
Allow: /hub
Allow: /connect
Allow: /sister-sites
Allow: /healthcare-services
Allow: /operational-agreements`;

fs.writeFileSync("sitemap.xml", sitemap);
fs.writeFileSync("robots.txt", robots);

console.log("✅ Sitemap and robots.txt created successfully!");
console.log(`📄 Generated ${urls.length} URLs:`);
urls.forEach(url => console.log(`   ${url}`));