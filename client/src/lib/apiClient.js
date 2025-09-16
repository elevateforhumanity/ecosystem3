const DEFAULT_TIMEOUT = 15000;

export async function apiFetch(path, { method = "GET", body, headers = {}, signal, timeout = DEFAULT_TIMEOUT } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const url = base.replace(/\/$/, "") + path;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": body ? "application/json" : undefined,
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: signal || controller.signal
    });
    if (!res.ok) {
      const text = await safeText(res);
      throw new ApiError(res.status, text || res.statusText);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return await res.json();
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function safeText(res) {
  try { return await res.text(); } catch { return ""; }
}

export class ApiError extends Error {
  constructor(status, message) {
    if (typeof status !== 'number' || status < 100 || status > 599) {
      throw new Error('Invalid HTTP status');
    }
    super(message);
    this.status = status;
  }
}