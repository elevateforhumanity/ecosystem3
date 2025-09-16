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
// Removed morgan in favor of pino structured logging + optional Sentry/OTel
import pino from "pino";
import pinoHttp from "pino-http";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");

// -------- Rate Limiting (basic) --------
// General limiter: broad protection for all requests (light throttle)
const generalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_GENERAL_MAX || '300', 10),
  standardHeaders: true,
  legacyHeaders: false
});
// Admin limiter: stricter for sensitive control endpoints
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: parseInt(process.env.RATE_ADMIN_MAX || '10', 10),
  standardHeaders: true,
  legacyHeaders: false
});
app.use(generalLimiter);

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

// ---- Structured Logger (daily rotation) ----
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
let logDate = new Date().toISOString().slice(0,10);
let logStream = fs.createWriteStream(path.join(logDir, `app-${logDate}.log`), { flags: 'a' });
function rotate(){
  const d = new Date().toISOString().slice(0,10);
  if (d !== logDate){
    try { logStream.end(); } catch(_){}
    logDate = d;
    logStream = fs.createWriteStream(path.join(logDir, `app-${logDate}.log`), { flags: 'a' });
  }
}
setInterval(rotate, 60_000).unref();
const logger = pino({ level: process.env.LOG_LEVEL || 'info' }, logStream);
app.use(pinoHttp({ logger }));

// ---- Optional Sentry (error tracking) ----
let sentryEnabled = false;
let sentryRef = null;
try {
  if (process.env.SENTRY_DSN) {
  const Sentry = await import('@sentry/node');
  Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: parseFloat(process.env.SENTRY_TRACES || '0.0') });
  sentryRef = Sentry;
    sentryEnabled = true;
    logger.info({ msg: 'sentry_initialized' });
  }
} catch (e) {
  logger.warn({ msg: 'sentry_init_failed', error: e.message });
}

// ---- Optional OpenTelemetry (basic traces) ----
if (process.env.ENABLE_OTEL === '1') {
  try {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { getNodeAutoInstrumentations } = await import('@opentelemetry/auto-instrumentations-node');
    const { OTLPTraceExporter } = await import('@opentelemetry/exporter-trace-otlp-http');
    const sdk = new NodeSDK({
      traceExporter: new OTLPTraceExporter({}),
      instrumentations: [getNodeAutoInstrumentations()]
    });
    sdk.start();
    logger.info({ msg: 'otel_started' });
    process.on('SIGTERM', () => sdk.shutdown().catch(()=>{}));
  } catch (e) {
    logger.warn({ msg: 'otel_init_failed', error: e.message });
  }
}

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

app.post("/_restart", adminLimiter, jsonParser, (req, res) => {
  if (!ADMIN_TOKEN) return res.status(500).json({ ok: false, error: "ADMIN_TOKEN not set" });
  if (!checkAdmin(req)) return res.status(403).json({ ok: false, error: "Forbidden" });
  res.json({ ok: true, restarting: true, at: new Date().toISOString() });
  setTimeout(() => process.exit(0), 150);
});

app.post("/_purge", adminLimiter, jsonParser, (req, res) => {
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
let totalErrors = 0;
app.use((err, _req, res, _next) => {
  totalErrors++;
  logger.error({ err }, 'app_error');
  if (sentryEnabled && sentryRef) {
    try { sentryRef.captureException(err); } catch(_) {}
  }
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
  logger.info({ msg: 'server_listen', port: PORT, mode: BUILD_MODE });
});

// ---- Enhanced heartbeat with memory & request tracking (every 30s)
let reqCount = 0;
let totalRequests = 0;
app.use((_req, _res, next) => { reqCount++; totalRequests++; next(); });

setInterval(() => {
  const m = process.memoryUsage();
  const mb = (x) => Math.round((x / 1024 / 1024) * 10) / 10;
  logger.info({
    msg: 'heartbeat',
    upSeconds: Math.round(process.uptime()),
    mode: BUILD_MODE,
    cache: CACHE_VERSION,
    mem: { rssMB: mb(m.rss), heapUsedMB: mb(m.heapUsed), heapTotalMB: mb(m.heapTotal), externalMB: mb(m.external) },
    requestsLastInterval: reqCount,
    totalRequests,
    totalErrors
  });
  reqCount = 0;
}, 30_000).unref();

// -------- Process safety nets --------
process.on("unhandledRejection", (reason, p) => {
  logger.error({ reason, promise: p }, 'unhandledRejection');
});
process.on("uncaughtException", (err) => {
  logger.error({ err }, 'uncaughtException');
  // choose to keep running; restart only via /_restart
});

// ---- Metrics endpoint (Prometheus format) ----
app.get('/metrics', (_req, res) => {
  const mem = process.memoryUsage();
  const lines = [
    '# HELP efh_requests_total Total requests since start',
    '# TYPE efh_requests_total counter',
    `efh_requests_total ${totalRequests}`,
    '# HELP efh_errors_total Total errors since start',
    '# TYPE efh_errors_total counter',
    `efh_errors_total ${totalErrors}`,
    '# HELP efh_process_memory_rss_bytes RSS memory',
    '# TYPE efh_process_memory_rss_bytes gauge',
    `efh_process_memory_rss_bytes ${mem.rss}`,
    '# HELP efh_process_uptime_seconds Uptime seconds',
    '# TYPE efh_process_uptime_seconds gauge',
    `efh_process_uptime_seconds ${Math.round(process.uptime())}`
  ];
  res.set('Content-Type', 'text/plain').send(lines.join('\n')+'\n');
});

const shutdown = (sig) => () => {
  logger.info({ msg: 'graceful_shutdown', signal: sig });
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2_000).unref();
};
process.on("SIGTERM", shutdown("SIGTERM"));
process.on("SIGINT", shutdown("SIGINT"));

// Exports for testing
export { app, server };