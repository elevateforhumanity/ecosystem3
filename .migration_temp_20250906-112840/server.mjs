// EFH Hardened server.mjs
// Drop this at project root (next to .replit). Requires: express, compression, helmet, morgan
// ENV needed: ADMIN_TOKEN (for /_restart and /_purge), optional RUN_MODE

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import http from "http";
import compression from "compression";
import helmet from "helmet";
import morgan from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");

// -------- Build mode & cache version --------
const BUILD_MODE = (() => {
  if (process.env.RUN_MODE) return process.env.RUN_MODE;
  const quick = path.join(__dirname, ".buildmode-quick");
  const clean = path.join(__dirname, ".buildmode-clean");
  if (fs.existsSync(clean)) return "clean";
  if (fs.existsSync(quick)) return "quick";
  return "unknown";
})();
let CACHE_VERSION = Date.now();

// -------- Paths --------
const distPath = path.join(__dirname, "client", "dist");

// -------- Global middleware (order matters) --------
app.use(helmet({
  contentSecurityPolicy: false, // keep simple for SPA assets
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());

// Cache/version headers for every response
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store"); // avoid sticky blanks while stabilizing
  res.set("X-Cache-Version", String(CACHE_VERSION));
  res.set("X-Build-Mode", BUILD_MODE);
  next();
});

// Access logs (short)
app.use(morgan("tiny"));

// Only parse JSON on the few endpoints that need it
const jsonParser = express.json({ limit: "200kb" });

// -------- Telemetry (from SPA) --------
let lastClientTelemetry = { tailwindOk: null, ts: null };
app.post("/_telemetry", jsonParser, (req, res) => {
  const ok = !!req.body?.tailwindOk;
  lastClientTelemetry = { tailwindOk: ok, ts: Date.now() };
  res.sendStatus(204);
});

// -------- Admin: restart & purge (protected) --------
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
function checkAdmin(req) {
  const provided = req.get("X-Admin-Token") || req.body?.token || "";
  return ADMIN_TOKEN && provided === ADMIN_TOKEN;
}

app.post("/_restart", jsonParser, (req, res) => {
  if (!ADMIN_TOKEN) return res.status(500).json({ ok: false, error: "ADMIN_TOKEN not set" });
  if (!checkAdmin(req)) return res.status(403).json({ ok: false, error: "Forbidden" });
  res.json({ ok: true, restarting: true, at: new Date().toISOString() });
  setTimeout(() => process.exit(0), 150);
});

app.post("/_purge", jsonParser, (req, res) => {
  if (!ADMIN_TOKEN) return res.status(500).json({ ok: false, error: "ADMIN_TOKEN not set" });
  if (!checkAdmin(req)) return res.status(403).json({ ok: false, error: "Forbidden" });
  CACHE_VERSION = Date.now();
  res.json({ ok: true, cacheVersion: CACHE_VERSION });
});

// -------- Health --------
app.get("/health", (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: "healthy",
    mode: BUILD_MODE,
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5000,
    pid: process.pid,
    uptimeSec: Math.round(process.uptime()),
    memory: {
      rss: mem.rss,
      heapUsed: mem.heapUsed,
      heapTotal: mem.heapTotal,
      external: mem.external,
    },
    tailwind: {
      ok: lastClientTelemetry.tailwindOk,
      lastPingIso: lastClientTelemetry.ts ? new Date(lastClientTelemetry.ts).toISOString() : null,
    },
    cacheVersion: CACHE_VERSION,
    ready: fs.existsSync(distPath),
  });
});

// -------- Static assets & SPA fallback --------
if (!fs.existsSync(distPath)) {
  console.warn("[WARN] dist folder missing at:", distPath);
}
app.use(express.static(distPath, { etag: false, lastModified: false, maxAge: 0 }));
// Serve SPA if present, else a safe fallback (prevents 'blank' hard failures)
app.get("*", (_req, res) => {
  const indexFile = path.join(distPath, "index.html");
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }
  // Fallback HTML so the server still responds even if build failed
  res
    .status(200)
    .type("html")
    .send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>EFH — Server Ready</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 2rem; }
    .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 1rem; }
    code { background: #f3f4f6; padding: 2px 4px; border-radius: 6px; }
  </style>
</head>
<body>
  <h1>EFH server is running</h1>
  <div class="card">
    <p>The client build wasn't found (<code>${indexFile}</code>).</p>
    <p>Use your React <a href="/debug">/debug</a> page to check Tailwind status, or rebuild:</p>
    <pre><code>cd client
npm run clean
cd ..
npm run start</code></pre>
  </div>
  <p>Health: <a href="/health">/health</a></p>
</body>
</html>`);
});

// -------- Error handling (last) --------
// 404 is handled by SPA fallback; generic error handler below
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[ERROR]", err);
  res.status(500).json({ ok: false, error: "Internal Server Error" });
});

// -------- HTTP server + timeouts --------
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Keep these generous to avoid random client disconnects
server.keepAliveTimeout = 60_000;      // 60s
server.headersTimeout = 65_000;        // must be > keepAliveTimeout
server.requestTimeout = 60_000;        // 60s

server.listen(PORT, () => {
  console.log(`EFH server running on http://localhost:${PORT} | mode=${BUILD_MODE}`);
});

// ---- Enhanced heartbeat with memory & request tracking (every 30s)
let reqCount = 0;
app.use((_req, _res, next) => { reqCount++; next(); });

setInterval(() => {
  const m = process.memoryUsage();
  const mb = (x) => Math.round((x / 1024 / 1024) * 10) / 10;
  console.log(
    `[heartbeat] up=${Math.round(process.uptime())}s ` +
    `mode=${BUILD_MODE} cache=${CACHE_VERSION} ` +
    `mem rss=${mb(m.rss)}MB heap=${mb(m.heapUsed)}/${mb(m.heapTotal)}MB ext=${mb(m.external)}MB ` +
    `reqs_since_last=${reqCount}`
  );
  reqCount = 0;
}, 30_000).unref();

// -------- Process safety nets --------
process.on("unhandledRejection", (reason, p) => {
  console.error("[unhandledRejection]", reason, "at", p);
});
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
  // choose to keep running; restart only via /_restart
});

const shutdown = (sig) => () => {
  console.log(`[${sig}] graceful shutdown...`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2_000).unref();
};
process.on("SIGTERM", shutdown("SIGTERM"));
process.on("SIGINT", shutdown("SIGINT"));