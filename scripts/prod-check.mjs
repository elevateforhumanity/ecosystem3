import { execSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const steps = [
  { name: "Missing imports", cmd: "node scripts/check-missing-imports.mjs" },
  { name: "Lint", cmd: "npm run lint --silent" },
  { name: "Typecheck", cmd: "npm run typecheck --silent" },
  { name: "Tests", cmd: "npm run test --silent" },
  { name: "Build", cmd: "npm run build --silent" }
];

let failed = false;
for (const s of steps) {
  process.stdout.write(`→ ${s.name}... `);
  try {
    execSync(s.cmd, { stdio: "inherit" });
    console.log("OK");
  } catch {
    console.log("FAIL");
    failed = true;
  }
}

if (!failed) {
  const dist = "dist";
  if (existsSync(dist)) {
    const assets = path.join(dist, "assets");
    if (existsSync(assets)) {
      const large = [];
      for (const f of await readdir(assets)) {
        const full = path.join(assets, f);
        const st = statSync(full);
        if (st.isFile() && st.size > 250 * 1024) {
          large.push({ f, kb: Math.round(st.size / 1024) });
        }
      }
      if (large.length) {
        console.log("⚠ Large bundles:");
        large.forEach(l => console.log(`  ${l.f} ~${l.kb}KB`));
      }
    }
  }
  console.log("✓ Production checklist baseline passed");
  process.exit(0);
} else {
  console.log("✗ Fix failures above");
  process.exit(1);
}