const fs = require("fs");
const path = require("path");

const BASE_URL = "https://elevateforhumanity.org";
const PAGES_DIR = "./";

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
      urls.push(`${BASE_URL}/${route}`);
    }
  }
}

crawl(PAGES_DIR);

// Add priority and change frequency
const sitemapEntries = urls.map(url => {
  let priority = "0.5";
  let changefreq = "monthly";
  
  if (url === BASE_URL + "/") {
    priority = "1.0";
    changefreq = "weekly";
  } else if (url.includes("sister-sites") || url.includes("programs") || url.includes("hub")) {
    priority = "0.8";
    changefreq = "weekly";
  }
  
  return `  <url>
    <loc>${url}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
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