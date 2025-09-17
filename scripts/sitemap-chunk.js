#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Priority URLs for the site
const priorityUrls = [
    'https://elevateforhumanity.org/',
    'https://elevateforhumanity.org/programs/',
    'https://elevateforhumanity.org/programs/cybersecurity/',
    'https://elevateforhumanity.org/programs/cloud-computing/',
    'https://elevateforhumanity.org/programs/healthcare-cna/',
    'https://elevateforhumanity.org/programs/electrical-trades/',
    'https://elevateforhumanity.org/programs/construction/',
    'https://elevateforhumanity.org/programs/beauty-wellness/',
    'https://elevateforhumanity.org/about/',
    'https://elevateforhumanity.org/employers/',
    'https://elevateforhumanity.org/contact/',
    'https://elevateforhumanity.org/blog/',
    'https://elevateforhumanity.org/privacy/',
    'https://elevateforhumanity.org/terms/',
    'https://elevateforhumanity.org/accessibility/',
    'https://elevateforhumanity.org/faq/'
];

// Additional URLs (can be loaded from file or generated)
const additionalUrls = [
    // Blog posts
    'https://elevateforhumanity.org/blog/cybersecurity-career-guide/',
    'https://elevateforhumanity.org/blog/cloud-computing-trends/',
    'https://elevateforhumanity.org/blog/healthcare-job-outlook/',
    'https://elevateforhumanity.org/blog/skilled-trades-opportunities/',
    'https://elevateforhumanity.org/blog/wioa-funding-guide/',
    
    // Program variations
    'https://elevateforhumanity.org/programs/cybersecurity/curriculum/',
    'https://elevateforhumanity.org/programs/cybersecurity/schedule/',
    'https://elevateforhumanity.org/programs/cloud-computing/curriculum/',
    'https://elevateforhumanity.org/programs/cloud-computing/schedule/',
    
    // Location pages (if applicable)
    'https://elevateforhumanity.org/locations/',
    'https://elevateforhumanity.org/locations/main-campus/',
    
    // Resources
    'https://elevateforhumanity.org/resources/',
    'https://elevateforhumanity.org/resources/student-handbook/',
    'https://elevateforhumanity.org/resources/career-services/',
    'https://elevateforhumanity.org/resources/financial-aid/'
];

// Combine all URLs
const allUrls = [...priorityUrls, ...additionalUrls];

// Configuration
const CHUNK_SIZE = 50000; // Google's limit
const BASE_URL = 'https://elevateforhumanity.org';
const SITEMAPS_DIR = 'sitemaps';

// Ensure sitemaps directory exists
if (!fs.existsSync(SITEMAPS_DIR)) {
    fs.mkdirSync(SITEMAPS_DIR, { recursive: true });
}

// Generate sitemap chunks
const sitemapFiles = [];
for (let i = 0; i < allUrls.length; i += CHUNK_SIZE) {
    const chunk = allUrls.slice(i, i + CHUNK_SIZE);
    const chunkNumber = Math.floor(i / CHUNK_SIZE) + 1;
    const filename = `sitemap-${chunkNumber}.xml`;
    
    // Generate XML for this chunk
    const urlEntries = chunk.map(url => {
        const lastmod = new Date().toISOString().split('T')[0]; // Today's date
        let priority = '0.5';
        let changefreq = 'monthly';
        
        // Set priority based on URL importance
        if (url === BASE_URL + '/') {
            priority = '1.0';
            changefreq = 'weekly';
        } else if (url.includes('/programs/')) {
            priority = '0.9';
            changefreq = 'weekly';
        } else if (url.includes('/about/') || url.includes('/employers/') || url.includes('/contact/')) {
            priority = '0.8';
            changefreq = 'monthly';
        } else if (url.includes('/blog/')) {
            priority = '0.7';
            changefreq = 'weekly';
        }
        
        return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('\n');
    
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
    
    // Write sitemap file
    const filepath = path.join(SITEMAPS_DIR, filename);
    fs.writeFileSync(filepath, sitemapXml);
    sitemapFiles.push(filename);
    
    console.log(`Generated ${filename} with ${chunk.length} URLs`);
}

// Generate sitemap index
const sitemapIndexEntries = sitemapFiles.map(filename => {
    const lastmod = new Date().toISOString().split('T')[0];
    return `  <sitemap>
    <loc>${BASE_URL}/sitemaps/${filename}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;
}).join('\n');

const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapIndexEntries}
</sitemapindex>`;

// Write sitemap index
fs.writeFileSync('sitemap_index.xml', sitemapIndexXml);

console.log(`\nGenerated sitemap_index.xml with ${sitemapFiles.length} sitemap files`);
console.log(`Total URLs: ${allUrls.length}`);
console.log('\nFiles created:');
console.log('- sitemap_index.xml');
sitemapFiles.forEach(file => console.log(`- sitemaps/${file}`));

// Generate human-readable sitemap
const humanSitemapHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sitemap | Elevate for Humanity</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-8">Site Map</h1>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-bold mb-4 text-blue-600">Main Pages</h2>
                <ul class="space-y-2">
                    <li><a href="/" class="text-gray-700 hover:text-blue-600">Home</a></li>
                    <li><a href="/about/" class="text-gray-700 hover:text-blue-600">About Us</a></li>
                    <li><a href="/contact/" class="text-gray-700 hover:text-blue-600">Contact</a></li>
                    <li><a href="/employers/" class="text-gray-700 hover:text-blue-600">Employers</a></li>
                    <li><a href="/blog/" class="text-gray-700 hover:text-blue-600">Blog</a></li>
                </ul>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-bold mb-4 text-green-600">Training Programs</h2>
                <ul class="space-y-2">
                    <li><a href="/programs/" class="text-gray-700 hover:text-blue-600">All Programs</a></li>
                    <li><a href="/programs/cybersecurity/" class="text-gray-700 hover:text-blue-600">Cybersecurity</a></li>
                    <li><a href="/programs/cloud-computing/" class="text-gray-700 hover:text-blue-600">Cloud Computing</a></li>
                    <li><a href="/programs/healthcare-cna/" class="text-gray-700 hover:text-blue-600">CNA/HHA</a></li>
                    <li><a href="/programs/electrical-trades/" class="text-gray-700 hover:text-blue-600">Electrical</a></li>
                    <li><a href="/programs/construction/" class="text-gray-700 hover:text-blue-600">Construction</a></li>
                    <li><a href="/programs/beauty-wellness/" class="text-gray-700 hover:text-blue-600">Cosmetology</a></li>
                </ul>
            </div>
            
            <div class="bg-white p-6 rounded-lg shadow">
                <h2 class="text-xl font-bold mb-4 text-purple-600">Resources</h2>
                <ul class="space-y-2">
                    <li><a href="/resources/" class="text-gray-700 hover:text-blue-600">Student Resources</a></li>
                    <li><a href="/faq/" class="text-gray-700 hover:text-blue-600">FAQ</a></li>
                    <li><a href="/privacy/" class="text-gray-700 hover:text-blue-600">Privacy Policy</a></li>
                    <li><a href="/terms/" class="text-gray-700 hover:text-blue-600">Terms of Service</a></li>
                    <li><a href="/accessibility/" class="text-gray-700 hover:text-blue-600">Accessibility</a></li>
                </ul>
            </div>
        </div>
        
        <div class="mt-12 bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-bold mb-4">XML Sitemaps</h2>
            <p class="text-gray-600 mb-4">For search engines and automated tools:</p>
            <ul class="space-y-2">
                <li><a href="/sitemap_index.xml" class="text-blue-600 hover:underline">sitemap_index.xml</a> - Main sitemap index</li>
                ${sitemapFiles.map(file => 
                    `<li><a href="/sitemaps/${file}" class="text-blue-600 hover:underline">${file}</a></li>`
                ).join('\n                ')}
            </ul>
        </div>
    </div>
</body>
</html>`;

fs.writeFileSync('sitemap.html', humanSitemapHtml);
console.log('- sitemap.html (human-readable)');

console.log('\n✅ Sitemap generation complete!');