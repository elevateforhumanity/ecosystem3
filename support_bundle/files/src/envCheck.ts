const REQUIRED = ['VITE_SENTRY_DSN'] as const  // add more as needed

function isProd() {
  return import.meta.env.MODE === 'production'
}

export function assertEnv() {
  const missing = REQUIRED.filter(k => !import.meta.env[k])
  if (missing.length) {
    const msg = `Missing required env vars: ${missing.join(', ')}`
    if (isProd()) {
      // eslint-disable-next-line no-console
      console.error(msg)
    } else {
      // eslint-disable-next-line no-console
      console.warn(msg)
    }
  }
}

export function checkEnv(requiredKeys: string[] = []): string[] {
  const env = import.meta.env ?? {};
  const missing: string[] = [];
  for (const key of requiredKeys) {
    const val = (env as any)[key] ?? (typeof process !== "undefined" ? (process.env as any)?.[key] : undefined);
    if (val === undefined || val === null || String(val).length === 0) missing.push(key);
  }
  return missing;
}

{
  "terminal.integrated.profiles.linux": {
    "bash (clean)": { "path": "/bin/bash", "args": ["--noprofile","--norc","-l"] }
  },
  "terminal.integrated.defaultProfile.linux": "bash (clean)"
}
