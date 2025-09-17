type Metric = { name: string; value: number; id?: string };

export async function startWebVitals(report?: (m: Metric) => void) {
  try {
    const mod = await import("web-vitals");
    const cb = report ?? ((m: Metric) => console.log(`[web-vitals] ${m.name}:`, m.value, m.id ?? "")); // eslint-disable-line no-console
    mod.onCLS(cb);
    mod.onFID(cb);
    mod.onLCP(cb);
    if (typeof mod.onINP === "function") mod.onINP(cb);
    mod.onTTFB(cb);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("web-vitals not available or failed to load:", (e as Error)?.message ?? e);
  }
}

// Sentry (optional; enable when DSN is present)
const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn) {
  import('@sentry/browser').then(Sentry => {
    Sentry.init({ dsn, tracesSampleRate: 0.1, environment: import.meta.env.MODE })
  }).catch(() => {})
}
