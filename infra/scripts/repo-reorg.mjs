#!/usr/bin/env node

// Repo reorganization script for Elevate for Humanity
// Usage: node infra/scripts/repo-reorg.mjs

import fs from "fs";
import path from "path";

const mv = (src, dst) => {
  if (!fs.existsSync(src)) return false;
  try {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.renameSync(src, dst);
    return true;
  } catch (error) {
    console.warn(`Failed to move ${src} to ${dst}:`, error.message);
    return false;
  }
};

const copy = (src, dst) => {
  if (!fs.existsSync(src)) return false;
  try {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    return true;
  } catch (error) {
    console.warn(`Failed to copy ${src} to ${dst}:`, error.message);
    return false;
  }
};

const log = [];
const move = (from, to, copyOnly = false) => {
  const ok = copyOnly ? copy(from, to) : mv(from, to);
  log.push(`${ok ? "✅" : "❌"} ${from}  ->  ${to} ${copyOnly ? "(copy)" : ""}`);
  if (ok) console.log(`✅ Moved: ${from} -> ${to}`);
};

console.log("🚀 Starting repo reorganization...");

// Create target directories
const dirs = [
  "sites/marketing",
  "sites/programs", 
  "sites/blog",
  "infra/scripts",
  "infra/ci",
  "assets/shared"
];

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`📁 Created: ${dir}`);
});

// Marketing site (homepage + core pages)
console.log("\n📦 Moving marketing site files...");
const marketingMoves = [
  ["index.html", "sites/marketing/index.html"],
  ["robots.txt", "sites/marketing/robots.txt"],
  ["sitemap_index.xml", "sites/marketing/sitemap_index.xml"],
  ["sitemaps", "sites/marketing/sitemaps"],
  ["_headers", "sites/marketing/_headers"],
  ["_redirects", "sites/marketing/_redirects"],
  ["sitemap.html", "sites/marketing/sitemap.html"],
  ["about", "sites/marketing/about"],
  ["employers", "sites/marketing/employers"],
  ["contact", "sites/marketing/contact"],
  ["privacy", "sites/marketing/privacy"],
  ["programs", "sites/marketing/programs"],
  ["assets/site.js", "sites/marketing/assets/site.js"],
  ["assets/logo.png", "sites/marketing/assets/logo.png"],
  ["manifest.json", "sites/marketing/manifest.json"],
  ["404.html", "sites/marketing/404.html"],
  ["410.html", "sites/marketing/410.html"]
];

marketingMoves.forEach(([from, to]) => move(from, to, true)); // Copy first, don't move yet

// Blog site structure
console.log("\n📝 Setting up blog site...");
if (fs.existsSync("blog")) {
  move("blog", "sites/blog", true);
} else {
  // Create basic blog structure
  const blogIndex = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blog | Elevate for Humanity</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="site-header"></div>
    
    <main class="py-16">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-center mb-8">Career Training Blog</h1>
            <p class="text-xl text-center text-gray-600">Coming soon - insights and tips for your career journey</p>
        </div>
    </main>
    
    <div id="site-footer"></div>
    <script src="/assets/site.js"></script>
</body>
</html>`;
  
  fs.writeFileSync("sites/blog/index.html", blogIndex);
  log.push("✅ Created blog/index.html");
}

// Programs deep docs (if you have extensive curriculum beyond the 6 main pages)
console.log("\n📚 Setting up programs site...");
if (!fs.existsSync("sites/programs/index.html")) {
  const programsIndex = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Program Resources | Elevate for Humanity</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="site-header"></div>
    
    <main class="py-16">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl font-bold text-center mb-8">Program Resources</h1>
            <p class="text-xl text-center text-gray-600">Detailed curriculum, resources, and documentation</p>
        </div>
    </main>
    
    <div id="site-footer"></div>
    <script src="/assets/site.js"></script>
</body>
</html>`;
  
  fs.writeFileSync("sites/programs/index.html", programsIndex);
  log.push("✅ Created programs/index.html");
}

// Create marketing site redirects
console.log("\n🔀 Setting up redirects...");
const redirectsPath = "sites/marketing/_redirects";
const redirectsContent = `# Legacy Career Uplift paths → new Program pages
/career-uplift-services/certify-and-thrive-program        /programs/cybersecurity/        301!
/career-uplift-services/secure-your-future--security---safety-training  /programs/electrical-trades/ 301!
/career-uplift-services/healthcare-training               /programs/healthcare-cna/       301!
/career-uplift-services/cloud-computing-training          /programs/cloud-computing/      301!
/career-uplift-services/construction-skills-training      /programs/construction/         301!
/career-uplift-services/beauty-and-wellness               /programs/beauty-wellness/      301!

# Legacy program paths
/programs/cna-hha      /programs/healthcare-cna/    301!
/programs/electrical   /programs/electrical-trades/ 301!
/programs/beauty       /programs/beauty-wellness/   301!

# Blog variants → blog hub
/blog.php     /blog/   301!
/blog?p=*     /blog/   301!

# Old marketing slugs
/about-us     /about/     301!
/contact-us   /contact/   301!
/employer     /employers/ 301!

# Force trailing slashes for consistency
/programs     /programs/  301!
/about        /about/     301!
/contact      /contact/   301!
/employers    /employers/ 301!

# Legacy HTML extensions
/index.html   /           301!
/about.html   /about/     301!
/contact.html /contact/   301!

# Pass static assets straight through
/assets/*  /assets/:splat  200

# Old training paths
/training/*   /programs/:splat  301!
/courses/*    /programs/:splat  301!
/program/*    /programs/:splat  301!

# 410 for junk
/old-test/*   - 410
/tmp/*        - 410
/utm/*        - 410

# SPA fallback
/*          /index.html     200`;

fs.writeFileSync(redirectsPath, redirectsContent);
log.push("✅ Created marketing/_redirects");

// Create marketing site headers
const headersPath = "sites/marketing/_headers";
const headersContent = `/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://assets.calendly.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:

# Cache control for static assets
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# Cache control for CSS and JS
/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

# Cache control for images
/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*.jpeg
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable

# Short cache for HTML pages
/*.html
  Cache-Control: public, max-age=3600

/sitemap*.xml
  Content-Type: application/xml
  Cache-Control: public, max-age=86400

/robots.txt
  Content-Type: text/plain
  Cache-Control: public, max-age=86400

/manifest.json
  Content-Type: application/json
  Cache-Control: public, max-age=86400`;

fs.writeFileSync(headersPath, headersContent);
log.push("✅ Created marketing/_headers");

// Create Netlify configs for each site
console.log("\n⚙️ Creating Netlify configurations...");

const marketingNetlify = `[build]
  publish = "."
  command = "echo 'Static site - no build needed'"

[build.environment]
  NODE_VERSION = "18"

# Form handling
[forms]
  [forms.contact]
    name = "contact"
    action = "/thank-you/"
    
  [forms.eligibility]
    name = "eligibility"
    action = "/thank-you/"
    
  [forms.application]
    name = "application"
    action = "/thank-you/"`;

fs.writeFileSync("sites/marketing/netlify.toml", marketingNetlify);
log.push("✅ Created marketing/netlify.toml");

const programsNetlify = `[build]
  publish = "."
  command = "echo 'Static site - no build needed'"

[build.environment]
  NODE_VERSION = "18"`;

fs.writeFileSync("sites/programs/netlify.toml", programsNetlify);
log.push("✅ Created programs/netlify.toml");

// Move scripts to infra
console.log("\n🔧 Moving scripts to infra...");
const scriptMoves = [
  ["scripts/crawl-site.mjs", "infra/scripts/crawl-site.mjs"],
  ["scripts/verify-redirects.mjs", "infra/scripts/verify-redirects.mjs"],
  ["scripts/export-cap.sh", "infra/scripts/export-cap.sh"],
  ["scripts/image-optimizer.js", "infra/scripts/image-optimizer.js"],
  ["scripts/sitemap-chunk.js", "infra/scripts/sitemap-chunk.js"]
];

scriptMoves.forEach(([from, to]) => move(from, to, true));

// Update package.json scripts
console.log("\n📦 Updating package.json...");
if (fs.existsSync("package.json")) {
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  
  // Update script paths
  pkg.scripts = {
    ...pkg.scripts,
    "build:marketing": "echo 'Marketing site is static'",
    "build:programs": "echo 'Programs site is static'", 
    "build:blog": "echo 'Blog site is static'",
    "crawl:marketing": "node infra/scripts/crawl-site.mjs --base=http://localhost:8000 --max=100",
    "crawl:prod": "node infra/scripts/crawl-site.mjs --base=https://elevateforhumanity.org --max=10000",
    "verify:redirects:local": "node infra/scripts/verify-redirects.mjs --base=http://localhost:8000",
    "verify:redirects:prod": "node infra/scripts/verify-redirects.mjs --base=https://elevateforhumanity.org",
    "export:cap": "./infra/scripts/export-cap.sh",
    "optimize:images": "node infra/scripts/image-optimizer.js",
    "reorg": "node infra/scripts/repo-reorg.mjs"
  };
  
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  log.push("✅ Updated package.json scripts");
}

// Write log file
fs.writeFileSync("infra/scripts/reorg.log", log.join("\n"));

console.log("\n🎉 Repo reorganization complete!");
console.log(`📊 Processed ${log.length} operations`);
console.log("📄 See infra/scripts/reorg.log for details");

console.log("\n📁 New structure:");
console.log("├── sites/");
console.log("│   ├── marketing/     # Main site (homepage, programs, about, contact)");
console.log("│   ├── programs/      # Deep program resources");
console.log("│   └── blog/          # Blog site");
console.log("├── infra/");
console.log("│   ├── scripts/       # Build and deployment scripts");
console.log("│   └── ci/            # GitHub Actions");
console.log("└── assets/            # Shared assets");

console.log("\n🚀 Next steps:");
console.log("1. Create Netlify sites pointing to sites/marketing and sites/programs");
console.log("2. Set base directory and publish directory for each site");
console.log("3. Deploy and test!");

const successCount = log.filter(l => l.startsWith("✅")).length;
const failCount = log.filter(l => l.startsWith("❌")).length;

console.log(`\n📈 Results: ${successCount} successful, ${failCount} failed operations`);

if (failCount === 0) {
  console.log("✅ All operations completed successfully!");
} else {
  console.log("⚠️  Some operations failed - check the log for details");
}