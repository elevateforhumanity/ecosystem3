// tools/image-audit.mjs
import fetch from "node-fetch";
import { JSDOM } from "jsdom";

const SITES = [
  "http://localhost:5000/hub.html",
  "http://localhost:5000/programs.html",
  "http://localhost:5000/connect.html",
  "http://localhost:5000/lms.html",
  "http://localhost:5000/partners.html"
];

const BAD_PATTERNS = [/placeholder/i, /lorem/i, /dummy/i, /temp/i];

async function check(url){
  console.log(`Checking images on: ${url}`);
  
  let res;
  try {
    res = await fetch(url);
  } catch(e) {
    return {url, ok:false, status:"FETCH_ERROR", error: e.message};
  }
  
  if(!res.ok) return {url, ok:false, status:res.status};
  
  const ct = res.headers.get("content-type")||"";
  if (!ct.includes("text/html")) return {url, ok:true, html:false};
  
  const html = await res.text();
  const dom = new JSDOM(html);
  const imgs = [...dom.window.document.querySelectorAll("img[src]")].map(img=>({
    src: img.getAttribute("src").startsWith("http") ? img.getAttribute("src") : new URL(img.getAttribute("src"), url).href,
    w: img.getAttribute("width"),
    h: img.getAttribute("height"),
    alt: img.getAttribute("alt")||""
  }));
  
  const out = [];
  for (const i of imgs){
    const badName = BAD_PATTERNS.some(rx=> rx.test(i.src) || rx.test(i.alt));
    try{
      const r = await fetch(i.src, {method:"HEAD"});
      const len = +(r.headers.get("content-length")||0);
      if(!r.ok || len===0 || badName){
        out.push({img:i.src, ok:r.ok, len, badName, w:i.w, h:i.h, status: r.status});
      }
    }catch(e){ 
      out.push({img:i.src, ok:false, err:String(e)}); 
    }
  }
  return {url, ok:true, images_total: imgs.length, issues: out};
}

console.log("==== EFH Image Audit Starting ====");

const results = [];
for (const s of SITES){ 
  results.push(await check(s)); 
}

console.log("\n==== EFH Image Audit Report ====");
let totalIssues = 0;

for (const r of results){
  if (!r.ok) { 
    console.log(`❌ ${r.url} FAILED ${r.status} ${r.error || ""}`); 
    totalIssues++;
    continue; 
  }
  
  if(!r.html) {
    console.log(`⚠️  ${r.url} - Not HTML`);
    continue;
  }
  
  console.log(`📄 ${r.url} - ${r.images_total} images found`);
  
  if(r.issues && r.issues.length > 0) {
    r.issues.forEach(i => {
      console.log(`  ❌ ${i.img} - Status:${i.status || i.ok} Size:${i.len||"?"}B Bad:${i.badName ? "YES" : "NO"} Dims:${i.w||"?"}x${i.h||"?"} ${i.err || ""}`);
      totalIssues++;
    });
  } else {
    console.log(`  ✅ All images OK`);
  }
}

console.log(`\n==== Summary ====`);
if(totalIssues === 0) {
  console.log("✅ No image issues found!");
} else {
  console.log(`❌ Found ${totalIssues} image issues that need attention`);
}