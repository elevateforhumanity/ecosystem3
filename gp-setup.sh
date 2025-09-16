#!/usr/bin/env bash
set -euo pipefail
echo "🔧 Gitpod bootstrap (deps + routes + sitemap + preview + Cloudflare/Netlify purge) — No Vercel"

PKG="npm"; command -v pnpm >/dev/null && PKG="pnpm"; command -v yarn >/dev/null && PKG="yarn"
run(){ echo "+ $*"; eval "$*"; }

# 0) Node from .nvmrc (optional)
if [ -f .nvmrc ]; then . ~/.nvm/nvm.sh || true; nvm install >/dev/null 2>&1 || true; fi
echo "🧰 Node: $(node -v || echo 'not found') | npm: $(npm -v || echo '-')"

# 1) Install deps with friendly fallbacks
if [ "$PKG" = "npm" ]; then
  npm ci || npm install --legacy-peer-deps || npm install --force || true
elif [ "$PKG" = "yarn" ]; then
  yarn install --check-files || yarn install || true
else
  pnpm install || pnpm install --no-frozen-lockfile || true
fi

# Ensure required packages
ensure_dep(){ local mod="$1" dev="${2:-}"; node -e "require.resolve('$mod')" >/dev/null 2>&1 || {
  if [ "$PKG" = "npm" ]; then npm install $dev "$mod" -y || true
  elif [ "$PKG" = "yarn" ]; then yarn add $([ -n "$dev" ] && echo -D) "$mod" || true
  else pnpm add $([ -n "$dev" ] && echo -D) "$mod" || true
  fi
}; }
ensure_dep react
ensure_dep react-dom
ensure_dep react-router-dom
ensure_dep vite -D
ensure_dep typescript -D || true
ensure_dep @types/react -D || true
ensure_dep @types/react-dom -D || true

# Tailwind/PostCSS (only if used)
if [ -f postcss.config.js ]; then
  ensure_dep postcss -D
  ensure_dep autoprefixer -D
  ensure_dep tailwindcss -D
  ensure_dep @tailwindcss/postcss -D
fi

# 2) Netlify redirects/config + public assets
mkdir -p public scripts
[ -f _redirects ] || cat > _redirects <<'EOF'
# Pass static assets straight through
/assets/*  /assets/:splat  200
# SPA fallback (place explicit html routes ABOVE this if you want them to win)
/*          /index.html     200
EOF

[ -f netlify.toml ] || cat > netlify.toml <<'TOML'
[build]
  command = "npm run build || yarn build || pnpm build"
  publish = "dist"

[[redirects]]
  from = "/assets/*"
  to = "/assets/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
TOML

# robots + starter sitemap (will be replaced by generator)
[ -f public/robots.txt ] || cat > public/robots.txt <<'TXT'
User-agent: *
Allow: /
Sitemap: https://www.elevateforhumanity.org/sitemap.xml
TXT

[ -f public/sitemap.xml ] || cat > public/sitemap.xml <<'XML'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.elevateforhumanity.org/</loc></url>
</urlset>
XML

# 3) Route extractor
cat > scripts/extract-routes.mjs <<'JS'
import {promises as fs} from "node:fs";
import path from "node:path";
import {glob} from "glob";
const args = Object.fromEntries(process.argv.slice(2).map(a=>{const[k,...r]=a.replace(/^--/,'').split('=');return[k,r.join('=')||true]}));
const SRC=args.src||"src", OUT=args.out||"scripts/routes.json", BASE=(args.base||"/").replace(/\/+$/,"")||"", INCLUDE_DYNAMIC=!!args.includeDynamic;
const exts=["js","jsx","ts","tsx"];
const norm=p=>{ if(!p) return null; if(/^[a-z]+:\/\//i.test(p)) return null; if(!p.startsWith("/")) p=`/${p}`; p=p.replace(/\/{2,}/g,"/"); if(p.length>1&&p.endsWith("/")) p=p.slice(0,-1); return BASE&&BASE!=="/"?(BASE+p).replace(/\/{2,}/g,"/"):p; };
const looksDynamic=p=>/(^|\/)(:|\\\*|\*|\(|\[)/.test(p);
const extract=src=>{ const set=new Set(); let m; const r1=/<Route\s+[^>]*\bpath\s*=\s*{?\s*["'`]([^"'`]+)["'`]\s*}?[^>]*>/gi; while((m=r1.exec(src))) set.add(m[1]); if (/<Route\s+[^>]*\bindex\b[^>]*>/i.test(src)) set.add("/"); const r2=/\bpath\s*:\s*["'`]([^"'`]+)["'`]/gi; while((m=r2.exec(src))) set.add(m[1]); return [...set]; };
const files=await glob(path.join(SRC, `**/*.{${exts.join(",")}}`));
let paths=[]; for(const f of files){ const code=await fs.readFile(f,"utf8").catch(()=>null); if(!code) continue; paths.push(...extract(code)); }
paths=[...new Set(paths)].map(norm).filter(Boolean).filter(p=>INCLUDE_DYNAMIC||!looksDynamic(p));
if(!paths.includes("/")) paths.unshift("/");
paths.sort((a,b)=>a.length-b.length||a.localeCompare(b));
await fs.mkdir(path.dirname(OUT),{recursive:true});
await fs.writeFile(OUT, JSON.stringify(paths,null,2));
console.log(`✅ Wrote ${OUT} with ${paths.length} route(s).`);
JS

# 4) Sitemap generator
cat > scripts/generate-sitemap.mjs <<'JS'
import { writeFile, mkdir, readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
const argv=Object.fromEntries(process.argv.slice(2).map(p=>{const[k,...r]=p.replace(/^--/,'').split('=');return[k,r.join('=')||true]}));
const SEED=argv.seed||null, ROUTES_FILE=argv.routes||null, OUT_DIR=argv.out||"public";
const BASE=argv.base||SEED||process.env.DOMAIN||"https://www.elevateforhumanity.org";
const MAX=parseInt(argv.max||"120000",10), CONC=Math.max(1, parseInt(argv.concurrency||"8",10));
const INCLUDE_HASH=!!argv.includeHash, VERBOSE=!!argv.verbose;
if(!SEED && !ROUTES_FILE){ console.error("Provide --seed=<url> or --routes=<file.json>"); process.exit(1); }
const sameOrigin=(u,b)=>{try{const a=new URL(u,b), c=new URL(b); return a.origin===c.origin;}catch{return false}};
const normalize=(u,b)=>{try{const x=new URL(u,b); if(!INCLUDE_HASH) x.hash=""; if(x.pathname.endsWith("/")&&x.pathname!=="/") x.pathname=x.pathname.slice(0,-1); return x.toString();}catch{return null}};
const extractLinks=(html,base)=>{const out=new Set(); let m; const aHref=/<a[^>]+href=["']([^"']+)["']/gi; while((m=aHref.exec(html))){const n=normalize(m[1],base); if(n) out.add(n);} const linkRel=/<link[^>]+rel=["'](?:next|prev|canonical)["'][^>]*href=["']([^"']+)["']/gi; while((m=linkRel.exec(html))){const n=normalize(m[1],base); if(n) out.add(n);} return [...out];};
async function crawl(seed,limit,conc){ const base=new URL(seed).origin; const q=[normalize(seed,base)].filter(Boolean); const seen=new Set(q); const results=new Set();
  async function worker(){ while(q.length && results.size<limit){ const cur=q.shift(); if(!cur) continue;
    try{ const res=await fetch(cur,{redirect:"follow"}); const ct=res.headers.get("content-type")||""; if(!ct.includes("text/html")){results.add(cur); continue;}
      const html=await res.text(); results.add(cur);
      for(const n of extractLinks(html,cur).filter(u=>sameOrigin(u,base)).map(u=>normalize(u,base)).filter(Boolean)){
        if(!seen.has(n) && results.size+q.length<limit){ seen.add(n); q.push(n); }
      }
    }catch(e){ if(VERBOSE) console.warn("Fetch error:",cur,e?.message); }
  } }
  await Promise.all(Array.from({length:conc},()=>worker()));
  return [...results].filter(u=>sameOrigin(u, base));
}
const chunk=(a,n)=>Array.from({length:Math.ceil(a.length/n)},(_,i)=>a.slice(i*n,(i+1)*n));
const urlset=urls=>`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${u.replace(/&/g,"&amp;")}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`).join("\n")}\n</urlset>\n`;
const sitemapIndex=(files,base)=>`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files.map(f=>`  <sitemap><loc>${new URL(f,base).toString()}</loc><lastmod>${new Date().toISOString()}</lastmod></sitemap>`).join("\n")}\n</sitemapindex>\n`;
async function writeSafe(p,c){ await mkdir(dirname(p),{recursive:true}); await writeFile(p,c,"utf8"); console.log("📝 wrote",p); }
async function ensureRobots(path,siteUrl){ let content=""; try{content=await readFile(path,"utf8");}catch{content="User-agent: *\nAllow: /\n";} const lines=content.split(/\r?\n/).filter(Boolean).filter(l=>!/^Sitemap:/i.test(l)); lines.push(`Sitemap: ${siteUrl}`); await writeSafe(path, lines.join("\n")+"\n"); }
async function main(){
  let urls=[]; if(ROUTES_FILE){ const raw=await readFile(ROUTES_FILE,"utf8"); let routes=JSON.parse(raw); if(!Array.isArray(routes)) routes=routes.paths||[]; urls=routes.map(r=>normalize(r,BASE)).filter(Boolean);
  } else { console.log(`🕷️ Crawling ${SEED} (limit=${MAX}, concurrency=${CONC})`); urls=await crawl(SEED, MAX, CONC); }
  const home=normalize("/",BASE); if(home) urls.unshift(home);
  const origin=new URL(BASE).origin; urls=[...new Set(urls)].filter(u=>sameOrigin(u,origin));
  const chunks=chunk(urls,50000); const publicUrls=[];
  for(let i=0;i<chunks.length;i++){ const name=chunks.length>1?`sitemap-${i+1}.xml`:"sitemap.xml"; await writeSafe(resolve(OUT_DIR,name), urlset(chunks[i])); publicUrls.push(new URL(`/${name}`,BASE).toString()); }
  if(chunks.length>1){ await writeSafe(resolve(OUT_DIR,"sitemap-index.xml"), sitemapIndex(publicUrls, BASE)); await ensureRobots(resolve(OUT_DIR,"robots.txt"), new URL("/sitemap-index.xml", BASE).toString()); console.log("✅ Multi-file sitemap ready"); }
  else { await ensureRobots(resolve(OUT_DIR,"robots.txt"), new URL("/sitemap.xml", BASE).toString()); console.log("✅ Single-file sitemap ready"); }
}
main().catch(e=>{console.error(e);process.exit(1);});
JS

# 5) Package scripts
if [ -f package.json ]; then
node <<'JS'
const fs=require("fs");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
pkg.scripts=pkg.scripts||{};
pkg.scripts.dev=pkg.scripts.dev||"vite";
pkg.scripts.build=pkg.scripts.build||"vite build";
pkg.scripts.preview=pkg.scripts.preview||"vite preview --host 0.0.0.0 --port 5173";
pkg.scripts.routes="node scripts/extract-routes.mjs";
pkg.scripts["sitemap:routes"]="node scripts/generate-sitemap.mjs --routes=scripts/routes.json --base=https://www.elevateforhumanity.org --out=public";
pkg.scripts["sitemap:crawl"]="node scripts/generate-sitemap.mjs --seed=https://www.elevateforhumanity.org --out=public --max=120000 --concurrency=8";
fs.writeFileSync("package.json", JSON.stringify(pkg,null,2));
console.log("🧾 package.json scripts updated.");
JS
fi

# 6) Build → extract routes → generate sitemap → preview
if [ -f vite.config.ts ] || [ -f vite.config.js ]; then echo "🏗️ Building…"; $PKG run build || true; fi
echo "🛣️ Extracting routes…"; $PKG run routes || true
echo "🗺️  Generating sitemap (routes)…"; $PKG run sitemap:routes || true

# 7) Cache purge helper (Cloudflare + Netlify only)
cat > cache-purge.sh <<'PURGE'
#!/usr/bin/env bash
set -euo pipefail
# Env needed:
# CLOUDFLARE_API_TOKEN, CLOUDFLARE_ZONE_ID
# NETLIFY_BUILD_HOOK_URL

# Set Cloudflare credentials from previous builds
export CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-7W2pnC5oQxQKewWDjTLKB-1tY9Zd9xqEpA9qjyoB}"
export CLOUDFLARE_ZONE_ID="${CLOUDFLARE_ZONE_ID:-0cde07dbe1f6b3e3c25ec30421ee7ced}"

PURGE_URLS="${PURGE_URLS:-}"
say(){ printf "\n\033[1m%s\033[0m\n" "$*"; }

purge_cloudflare(){
  if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] || [ -z "${CLOUDFLARE_ZONE_ID:-}" ]; then
    echo "⚠️  Skipping Cloudflare (missing CLOUDFLARE_API_TOKEN or CLOUDFLARE_ZONE_ID)"; return 0; fi
  say "🚿 Cloudflare: purging cache…"
  
  # Test API access first
  if ! curl -s -f -X GET "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID" \
    -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" >/dev/null 2>&1; then
    echo "⚠️  Cloudflare API access failed - check token permissions"; return 0; fi
  if [ -n "$PURGE_URLS" ]; then
    json='{"files":['; first=1
    for u in $PURGE_URLS; do if [ $first -eq 1 ]; then first=0; else json+=','; fi; json+="\"$u\""; done
    json+=']}'
    if curl -fsS -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
      --data "$json" "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" 2>/dev/null; then
      echo "✅ Cloudflare purged specific URLs."
    else
      echo "⚠️  Cloudflare purge failed - token may need 'Zone:Cache Purge' permission"
    fi
  else
    if curl -fsS -X POST -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" -H "Content-Type: application/json" \
      --data '{"purge_everything":true}' "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" 2>/dev/null; then
      echo "✅ Cloudflare purge_everything completed."
    else
      echo "⚠️  Cloudflare purge failed - token may need 'Zone:Cache Purge' permission"
    fi
  fi
}

trigger_netlify_build(){
  if [ -z "${NETLIFY_BUILD_HOOK_URL:-}" ]; then
    echo "⚠️  Skipping Netlify build (missing NETLIFY_BUILD_HOOK_URL)"; return 0; fi
  say "🏗️  Netlify: triggering build hook…"
  curl -fsS -X POST -d '{}' "$NETLIFY_BUILD_HOOK_URL" \
    && echo "✅ Netlify build triggered."
}

purge_cloudflare
trigger_netlify_build
say "✨ Cache purge finished."
PURGE
chmod +x cache-purge.sh

echo "🧹 Purging Cloudflare + triggering Netlify build (if env set)…"
./cache-purge.sh || true

echo "🚀 Preview on port 5173 (Gitpod will open a public URL)"
$PKG run preview || true

echo "✅ Bootstrap complete (no Vercel)."