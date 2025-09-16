import { writeFileSync, mkdirSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { SitemapStream, streamToPromise } from "sitemap"

const DOMAIN = process.env.SITE_URL || process.env.VITE_SITE_URL || "https://yourdomain.com"

const routes = [
  "/",
  "/about",
  "/contact",
  // Add more or load dynamically
]

const CHUNK_SIZE = 50000
const chunks = []
for (let i = 0; i < routes.length; i += CHUNK_SIZE) chunks.push(routes.slice(i, i + CHUNK_SIZE))

const publicDir = resolve(process.cwd(), "public")
if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true })

const sitemapFiles = []

const today = new Date().toISOString().split("T")[0]

for (let i = 0; i < chunks.length; i++) {
  const chunk = chunks[i]
  const sm = new SitemapStream({ hostname: DOMAIN })
  chunk.forEach((p) => sm.write({ url: p, changefreq: "weekly", priority: p === "/" ? 1.0 : 0.8 }))
  sm.end()
  const data = await streamToPromise(sm)
  const fileName = `sitemap-${i + 1}.xml`
  writeFileSync(resolve(publicDir, fileName), data.toString())
  sitemapFiles.push(fileName)
}

const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map((f) => `  <sitemap><loc>${DOMAIN}/${f}</loc><lastmod>${today}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`
writeFileSync(resolve(publicDir, "sitemap-index.xml"), indexXml)

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap-index.xml
`
writeFileSync(resolve(publicDir, "robots.txt"), robotsTxt)

console.log("Sitemaps and robots.txt generated.")