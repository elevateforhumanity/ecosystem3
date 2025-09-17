#!/usr/bin/env node
/**
 * prepare-support-bundle.mjs
 * One-shot: inventory + config capture + lightweight validator.
 * Works cross-platform; no external deps.
 *
 * Usage:
 *   node scripts/prepare-support-bundle.mjs
 *   node scripts/prepare-support-bundle.mjs maxFiles=120000 hashLimit=524288 print=true gzip=true
 */

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import os from "node:os";
import { execSync } from "node:child_process";
import zlib from "node:zlib";
import React from "react";

// -------- CLI / ENV --------
const args = new URLSearchParams(process.argv.slice(2).join("&"));
const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "support_bundle");
const OUT_FILE = path.join(OUT_DIR, "chatgpt-bundle.json");
const MAX_FILES = parseInt(args.get("maxFiles") || process.env.MAX_FILES || "120000", 10);
const HASH_LIMIT_BYTES = parseInt(args.get("hashLimit") || process.env.HASH_LIMIT || String(512 * 1024), 10);
const PRINT = String(args.get("print") || "false").toLowerCase() === "true";
const GZIP = String(args.get("gzip") || "false").toLowerCase() === "true";

const SEP = "[\\\\\\/]";
const SKIP_RE = new RegExp(
  `(^|${SEP})(node_modules|\\.git|dist|build|\\.next|\\.output|\\.turbo|\\.cache|coverage|cypress|\\.parcel-cache)(${SEP}|$)`
);
const SECRET_FILE_RE = new RegExp(
  `(^|${SEP})(\\.env(\\..+)?|\\.envrc|id_rsa|id_ed25519|\\.aws|\\.gcloud|\\.npmrc|\\.netrc|\\.git-credentials)($|${SEP})`
);

// -------- helpers --------
const exists = (p) => fs.existsSync(p);
const read = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };
const readJSON = (p) => { const s = read(p); if (!s) return null; try { return JSON.parse(s); } catch { return null; } };
const rel = (p) => path.relative(ROOT, p);
const sh = (cmd) => { try { return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"], shell: "/bin/bash" }).toString().trim(); } catch { return null; } };
const statSafe = (p) => { try { return fs.statSync(p); } catch { return null; } };
const fmt = (n) => { const u = ["B","KB","MB","GB","TB"]; let i=0, x=Number(n||0); while (x>=1024 && i<u.length-1) { x/=1024; i++; } return `${x.toFixed(2)} ${u[i]}`; };
const hashBuf = (buf) => crypto.createHash("sha256").update(buf).digest("hex");
const hashFile = (fullPath, size) => {
  if (size > HASH_LIMIT_BYTES) return null;
  try { return hashBuf(fs.readFileSync(fullPath)); } catch { return null; }
};

const duBytes = (p) => {
  // Fast path for Linux GNU du
  try {
    const out = execSync(`du -sb "${p}" 2>/dev/null | awk '{print $1}'`, { shell: "/bin/bash" }).toString().trim();
    if (out) return Number(out);
  } catch {}
  // Portable fallback
  const st = statSafe(p); if (!st) return 0;
  if (st.isFile()) return st.size;
  let total = 0;
  try {
    for (const dirent of fs.readdirSync(p, { withFileTypes: true })) {
      total += duBytes(path.join(p, dirent.name));
    }
  } catch {}
  return total;
};

// -------- walk pages/roots --------
function walk(dir, collector, cutoff) {
  const st = statSafe(dir);
  if (!st || !st.isDirectory()) return;
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries = [];
    try { entries = fs.readdirSync(cur, { withFileTypes: true }); } catch { continue; }
    for (const ent of entries) {
      const full = path.join(cur, ent.name);
      if (collector.files.length >= cutoff) return;
      if (ent.isDirectory()) {
        if (SKIP_RE.test(full)) continue;
        stack.push(full);
      } else if (ent.isFile()) {
        if (SECRET_FILE_RE.test(full)) continue;
        const s = statSafe(full); if (!s) continue;
        collector.files.push({ path: rel(full), size: s.size, sha256: hashFile(full, s.size) });
      }
    }
  }
}

// -------- collect core data --------
const pkgPath = path.join(ROOT, "package.json");
const pkg = readJSON(pkgPath);
const pkgRaw = read(pkgPath);

const lockFiles = ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb"]
  .map(f => ({ f, p: path.join(ROOT, f) }))
  .filter(({ p }) => exists(p))
  .map(({ f, p }) => ({ name: f, sha256: (() => { try { return hashBuf(fs.readFileSync(p)); } catch { return null; } })() }));

const configs = {
  netlifyTomlRaw: read(path.join(ROOT, "netlify.toml")),
  vercelJsonRaw: read(path.join(ROOT, "vercel.json")),
  wranglerTomlRaw: read(path.join(ROOT, "wrangler.toml")),
  viteConfigRaw: read(path.join(ROOT, "vite.config.ts")) ?? read(path.join(ROOT, "vite.config.js")),
  devcontainerRaw: read(path.join(ROOT, ".devcontainer/devcontainer.json")),
  nvmrcRaw: read(path.join(ROOT, ".nvmrc")),
  npmrcRaw: read(path.join(ROOT, ".npmrc")),
  envExampleRaw: read(path.join(ROOT, ".env.example")),
  indexHtmlRaw: read(path.join(ROOT, "index.html")),
  robotsTxtRaw: read(path.join(ROOT, "public/robots.txt")),
  sitemapIndexRaw: read(path.join(ROOT, "public/sitemap.xml")),
  stripeWebhookRaw:
    read(path.join(ROOT, "netlify/functions/stripe-webhook.mjs")) ??
    read(path.join(ROOT, "functions/stripe-webhook.mjs")) ??
    read(path.join(ROOT, "api/stripe/webhook.ts")) ??
    read(path.join(ROOT, "api/stripe/webhook.mjs")) ??
    null,
};

const supabase = {
  schemaRaw: read(path.join(ROOT, "supabase", "schema.sql")),
  migrations: (() => {
    const dir = path.join(ROOT, "supabase/migrations");
    if (!exists(dir)) return [];
    return fs.readdirSync(dir).filter(f => f.endsWith(".sql")).slice(0, 1000);
  })(),
};

// size snapshot
const sizes = {
  workspaceBytes: duBytes("."),
  nodeModulesBytes: duBytes("node_modules"),
  distBytes: duBytes("dist"),
  srcBytes: duBytes("src"),
};
const sizesHuman = {
  workspace: fmt(sizes.workspaceBytes),
  node_modules: fmt(sizes.nodeModulesBytes),
  dist: fmt(sizes.distBytes),
  src: fmt(sizes.srcBytes),
};

// likely page roots
const pageCandidates = ["src/pages", "pages", "app", "src/app", "src/routes", "public"]
  .map(p => path.join(ROOT, p)).filter(exists);
const collector = { files: [] };
pageCandidates.forEach(r => walk(r, collector, MAX_FILES));

const bundle = {
  generatedAt: new Date().toISOString(),
  host: {
    os: os.platform() + " " + os.release(),
    arch: os.arch(),
    node: process.version,
    npm: sh("npm -v"),
    container: Boolean(process.env.CODESPACES || process.env.GITPOD_WORKSPACE_ID || process.env.CONTAINER),
  },
  repo: {
    remote: sh("git remote get-url origin"),
    branch: sh("git rev-parse --abbrev-ref HEAD"),
    commit: sh("git rev-parse --short HEAD"),
  },
  packageJson: { parsed: pkg, raw: pkgRaw, lockFiles },
  configs,
  supabase,
  sizes: { ...sizes, human: sizesHuman },
  pages: {
    roots: pageCandidates.map(rel),
    fileCount: collector.files.length,
    truncated: collector.files.length >= MAX_FILES,
    note: "Increase maxFiles= to capture more.",
    files: collector.files
  }
};

// -------- validator --------
function validate(bundle) {
  const findings = [];
  const warn = (msg) => findings.push({ level: "warn", msg });
  const err  = (msg) => findings.push({ level: "error", msg });
  const ok   = (msg) => findings.push({ level: "ok", msg });

  // Node version
  const nodeOk = /^v18\./.test(bundle.host.node);
  if (!nodeOk) warn(`Node ${bundle.host.node} detected; recommend 18.x (e.g., 18.20.4).`);

  // Package manager drift
  const locks = (bundle.packageJson.lockFiles || []).map(l => l.name);
  if (locks.length > 1) warn(`Multiple lockfiles present: ${locks.join(", ")}. Prefer a single package manager.`);
  if (locks.length === 0) warn(`No lockfile found. Install to generate one (npm or pnpm).`);

  // Vite presence
  const devDeps = Object.assign({}, bundle.packageJson.parsed?.devDependencies || {});
  const deps = Object.assign({}, bundle.packageJson.parsed?.dependencies || {});
  const hasVite = Boolean(devDeps.vite || deps.vite);
  if (!hasVite) warn(`'vite' not found in dependencies. If you build with Vite, add it to devDependencies.`);

  // Host conflicts
  if (bundle.configs.netlifyTomlRaw && bundle.configs.vercelJsonRaw) {
    warn("Both Netlify and Vercel configs detected. Use one host to reduce build friction.");
  }

  // Stripe webhook
  if (!bundle.configs.stripeWebhookRaw) {
    warn("Stripe webhook handler not found (netlify/functions/... or api/stripe/webhook...). Add one to enable upgrades.");
  }

  // Supabase multitenancy basics
  const schema = (bundle.supabase.schemaRaw || "").toLowerCase();
  if (!schema.includes("organizations") || !schema.includes("memberships")) {
    warn("Supabase schema may be missing multitenancy tables (organizations/memberships).");
  }
  if (!schema.includes("enable row level security") && !schema.includes("row level security")) {
    warn("Supabase RLS not detected in schema.sql (ensure RLS is enabled for org-scoped tables).");
  }

  // Secrets risk
  if (exists(path.join(ROOT, ".env")) || exists(path.join(ROOT, ".env.local"))) {
    warn("Found .env in repo root. Ensure it's .gitignored and not committed; rotate any leaked keys.");
  }

  // Sitemap/robots
  if (!bundle.configs.robotsTxtRaw) warn("robots.txt not found in /public. Add one that points to sitemap index.");
  if (!bundle.configs.sitemapIndexRaw) warn("sitemap.xml index not found in /public. Generate index + child sitemaps.");

  // Pages coverage
  if (bundle.pages.truncated) warn(`Pages listing truncated at ${MAX_FILES}. Increase maxFiles= if needed.`);

  ok("Bundle created. Proceed to deploy & wire subscriptions.");
  return findings;
}

const findings = validate(bundle);

// -------- write outputs --------
await fsp.mkdir(OUT_DIR, { recursive: true });
await fsp.writeFile(OUT_FILE, JSON.stringify(bundle, null, 2), "utf8");
if (GZIP) {
  const gzOut = fs.createWriteStream(OUT_FILE + ".gz");
  const source = fs.createReadStream(OUT_FILE);
  await new Promise((res, rej) => source.pipe(zlib.createGzip()).pipe(gzOut).on("finish", res).on("error", rej));
}

// Pretty console report
const pad = (s, n=7) => s.padEnd(n);
console.log(`\n✅ Wrote ${rel(OUT_FILE)}  (${bundle.pages.fileCount} files, truncated=${bundle.pages.truncated})`);
console.log(`   Sizes: workspace=${bundle.sizes.human.workspace}, node_modules=${bundle.sizes.human.node_modules}, dist=${bundle.sizes.human.dist}`);
console.log(`   Host: node=${bundle.host.node}, npm=${bundle.host.npm}, os=${bundle.host.os}\n`);
for (const f of findings) {
  const tag = f.level === "error" ? "ERROR" : f.level === "warn" ? "WARN" : "OK";
  console.log(`${pad(tag)}  ${f.msg}`);
}
if (PRINT) {
  console.log("\n--- bundle JSON ---\n");
  console.log(JSON.stringify(bundle, null, 2));
}

export default function FundingImpact() {
  return (
    <main style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Funding & Impact</h1>
      <p>Elevate for Humanity + Selfish Inc. align workforce training with public and philanthropic funding.</p>
    </main>
  );
}