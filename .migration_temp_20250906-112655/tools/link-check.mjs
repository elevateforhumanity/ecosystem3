// tools/link-check.mjs
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const STARTS = [
  "http://localhost:5000/hub.html",
  "http://localhost:5000/programs.html", 
  "http://localhost:5000/connect.html",
  "http://localhost:5000/lms.html",
  "http://localhost:5000/partners.html",
  "http://localhost:5000/account.html"
];

const MAX_PAGES = 50;              // per domain
const SAME_ORIGIN_ONLY = true;     // don't crawl off-site
const seen = new Map();            // origin => Set(paths)
const issues = [];

function norm(u){ try{ return new URL(u);}catch{ return null; } }

async function crawl(start){
  const q = [start];
  const origin = new URL(start).origin;
  seen.set(origin, new Set());

  while(q.length && seen.get(origin).size < MAX_PAGES){
    const url = q.shift();
    const u = norm(url); if(!u) continue;
    if (SAME_ORIGIN_ONLY && u.origin !== origin) continue;
    const key = u.pathname + (u.search||"");
    if (seen.get(origin).has(key)) continue; seen.get(origin).add(key);

    let res;
    try{ res = await fetch(u.href, {redirect:"manual"}); }catch(e){
      issues.push({origin, path:key, status:"FETCH_ERROR", msg:String(e)});
      continue;
    }
    if (res.status >= 400) issues.push({origin, path:key, status:res.status});

    const ct = res.headers.get("content-type")||"";
    if (ct.includes("text/html")){
      const html = await res.text();
      const dom = new JSDOM(html);
      const as = [...dom.window.document.querySelectorAll("a[href]")];
      for (const a of as){
        const href = a.getAttribute("href");
        if(!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
        const next = norm(href.startsWith("http") ? href : new URL(href, u).href);
        if(!next) continue;
        if (SAME_ORIGIN_ONLY && next.origin !== origin) continue;
        if (!seen.get(origin).has(next.pathname + (next.search||""))) q.push(next.href);
      }
    }
  }
}

console.log("==== EFH Link Check Starting ====");
for (const s of STARTS){ 
  console.log(`Crawling: ${s}`);
  await crawl(s); 
}

// Duplicate route detection (case differences / trailing slashes)
for (const [origin, paths] of seen){
  const map = {};
  for (const p of paths){
    const canon = p.replace(/\/+$/,"").toLowerCase();
    map[canon] = map[canon] || [];
    map[canon].push(p);
  }
  for (const canon in map){
    if (map[canon].length > 1){
      issues.push({origin, path:map[canon].join(" , "), status:"DUPLICATE_ROUTE"});
    }
  }
}

console.log("\n==== EFH Link Report ====");
if (!issues.length) {
  console.log("✅ No broken links or duplicates found");
} else {
  issues.forEach(i => console.log(`❌ ${i.origin} ${i.status} ${i.path}${i.msg? " :: "+i.msg:""}`));
}

console.log(`\nScanned ${Array.from(seen.values()).reduce((acc, s) => acc + s.size, 0)} total pages`);