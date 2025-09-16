import { describe, it, expect } from "vitest";
import { ROUTES } from "../routes.config.mjs";
import { readFileSync } from "node:fs";
import path from "node:path";

function extractRouterPaths(): string[] {
  const routerSrc = readFileSync(path.resolve("src/router.jsx"), "utf8");
  const re = /<Route\s+[^>]*path=["']([^"']+)["']/g;
  const out: string[] = [];
  let m;
  while ((m = re.exec(routerSrc)) !== null) out.push(m[1]);
  return out.filter(p => p !== "*" && !p.startsWith("/:"));
}

describe("Route sync", () => {
  const routerPaths = extractRouterPaths();
  const configPaths = ROUTES.filter(r => r.sitemap !== false).map(r => r.path);

  it("all router paths are in routes.config.mjs", () => {
    const missing = routerPaths.filter(p => !configPaths.includes(p));
    expect(missing).toEqual([]);
  });

  it("all routes.config.mjs sitemap paths exist in router", () => {
    const missing = configPaths.filter(p => !routerPaths.includes(p));
    expect(missing).toEqual([]);
  });
});