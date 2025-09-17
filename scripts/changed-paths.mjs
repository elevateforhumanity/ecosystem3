#!/usr/bin/env node
// 🔍 Detects changed files for incremental deployment
import { execSync } from "node:child_process";

function sh(cmd) { 
  try {
    return execSync(cmd, { stdio: ["pipe","pipe","ignore"] }).toString().trim(); 
  } catch (error) {
    return "";
  }
}

// Determine base commit for comparison
const base = process.env.GITHUB_BASE_REF
  ? `origin/${process.env.GITHUB_BASE_REF}`
  : process.env.VERCEL_GIT_PREVIOUS_SHA
  ? process.env.VERCEL_GIT_PREVIOUS_SHA
  : sh("git rev-parse HEAD^ 2>/dev/null || git rev-parse HEAD");

// Get all changed files
const changed = sh(`git diff --name-only ${base}...HEAD 2>/dev/null || git ls-files`)
  .split("\n").filter(Boolean);

// Filter for app-relevant changes
const appRelevant = changed.filter(p =>
  // HTML pages
  /\.html$/.test(p) ||
  // Assets and styles
  /^(assets|images|client|css|js)\//.test(p) ||
  // SEO files
  /^(sitemaps?|robots\.txt|sitemap\.xml)/.test(p) ||
  // Config files
  /^(index\.html|netlify\.toml|vercel\.json|package\.json)$/.test(p) ||
  // New page directories
  /^(programs|contracts|students|contact|about|policies|accessibility)\//.test(p)
);

// Categorize changes
const categories = {
  html: changed.filter(p => /\.html$/.test(p)),
  assets: changed.filter(p => /^(assets|images|client|css|js)\//.test(p)),
  seo: changed.filter(p => /^(sitemaps?|robots\.txt|sitemap\.xml)/.test(p)),
  config: changed.filter(p => /^(netlify\.toml|vercel\.json|package\.json)$/.test(p)),
  pages: changed.filter(p => /^(programs|contracts|students|contact|about)\//.test(p))
};

const result = {
  base,
  changed,
  appRelevant,
  categories,
  shouldBuild: appRelevant.length > 0,
  buildType: categories.html.length > 0 || categories.pages.length > 0 ? 'pages' : 
             categories.assets.length > 0 ? 'assets' : 
             categories.seo.length > 0 ? 'seo' : 'full'
};

// Output for CI consumption
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(result, null, 2));
} else {
  console.log(`📊 Change Analysis:`);
  console.log(`   Base: ${base}`);
  console.log(`   Total changed: ${changed.length} files`);
  console.log(`   App relevant: ${appRelevant.length} files`);
  console.log(`   Build type: ${result.buildType}`);
  console.log(`   Should build: ${result.shouldBuild ? '✅ Yes' : '❌ No'}`);
  
  if (appRelevant.length > 0) {
    console.log(`\n📝 Changed files:`);
    appRelevant.forEach(file => console.log(`   - ${file}`));
  }
}

// Exit with appropriate code for CI
process.exit(result.shouldBuild ? 1 : 0);