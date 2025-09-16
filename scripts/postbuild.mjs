import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { SitemapStream, streamToPromise } from "sitemap";
import { ROUTES } from "../routes.config.mjs";
import { readFileSync } from "node:fs";

const routerSrc = readFileSync("src/router.jsx", "utf8");
const routeRegex = /<Route\s+[^>]*path=["']([^"']+)["']/g;
const routerPaths = [];
let mm;
while ((mm = routeRegex.exec(routerSrc)) !== null) routerPaths.push(mm[1]);
const realRouterPaths = routerPaths.filter(p => p !== "*" && !p.startsWith("/:"));
const configPaths = ROUTES.filter(r => r.sitemap !== false).map(r => r.path);
const driftA = realRouterPaths.filter(p => !configPaths.includes(p));
const driftB = configPaths.filter(p => !realRouterPaths.includes(p));
if (driftA.length || driftB.length) {
  console.error("Route drift detected:", { missingInConfig: driftA, missingInRouter: driftB });
  // continue (warn) or uncomment next line to hard fail:
  // process.exit(1);
}

const distDir = path.resolve("dist");
if (!existsSync(distDir)) {
  console.error("dist/ not found. Run build first.");
  process.exit(1);
}

const siteUrl =
  process.env.VITE_SITE_URL ||
  process.env.SITE_URL ||
  "https://www.elevateforhumanity.org";

const routesForSitemap = ROUTES
  .filter(r => r.sitemap !== false)
  .map(r => ({
    url: r.path,
    changefreq: r.changefreq || "monthly",
    priority: r.priority ?? 0.5
  }));

async function buildSitemap() {
  const smStream = new SitemapStream({ hostname: siteUrl });
  routesForSitemap.forEach(r => smStream.write(r));
  smStream.end();
  const data = await streamToPromise(smStream);
  await writeFile(path.join(distDir, "sitemap.xml"), data.toString("utf8"));
}

async function buildRobots() {
  const content = `User-agent: *
Allow: /
Sitemap: ${siteUrl.replace(/\/+$/, "")}/sitemap.xml
`;
  await writeFile(path.join(distDir, "robots.txt"), content, "utf8");
}

async function verificationFiles() {
  const spec = process.env.VERIFICATION_FILES;
  if (!spec) return;
  const parts = spec.split(",").map(s => s.trim()).filter(Boolean);
  for (const p of parts) {
    const [filename, ...rest] = p.split("|");
    if (!filename) continue;
    const body = rest.join("|") || "";
    await writeFile(path.join(distDir, filename), body, "utf8");
  }
}

(async () => {
  await mkdir(distDir, { recursive: true });
  await Promise.all([buildSitemap(), buildRobots(), verificationFiles()]);
  console.log(
    `Postbuild: sitemap.xml (${routesForSitemap.length} routes), robots.txt, verification files done.`
  );
})();