const fs = require('fs');
const path = require('path');
// ...existing code...
let pagesCache = null;
function loadPages() {
  if (pagesCache) return pagesCache;
  const file = path.join(process.cwd(), 'content', 'pages.json');
  try {
    if (fs.existsSync(file)) {
      pagesCache = JSON.parse(fs.readFileSync(file, 'utf8'));
    } else pagesCache = { banners: [], pricing: [] };
  } catch { pagesCache = { banners: [], pricing: [] }; }
  return pagesCache;
}
function getBanners() { return loadPages().banners || []; }
function getPage(key) { const p = loadPages(); return (p.pages && p.pages[key]) || null; }
function getPricingPlans() {
  const p = loadPages();
  const pricing = Array.isArray(p.pricing) ? p.pricing : [];
  // Defensive: if pricing is an object (legacy format), attempt to extract values
  if (!Array.isArray(p.pricing) && p.pricing && typeof p.pricing === 'object') {
    try {
      const vals = Object.values(p.pricing);
      if (Array.isArray(vals)) return vals.map(plan => ({ ...plan }));
    } catch { /* ignore */ }
  }
  return pricing.map(plan => ({ ...plan }));
}
module.exports = { getBanners, getPage, getPricingPlans };
