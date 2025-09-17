import { useEffect, PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";

const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
const posthogHost = import.meta.env.VITE_POSTHOG_HOST || "https://us.posthog.com";
const vercelAnalytics = import.meta.env.VITE_VERCEL_ANALYTICS === "1";

export function AnalyticsProvider({ children }: PropsWithChildren) {
  const loc = useLocation();
  const isProd = import.meta.env.PROD;

  // Load scripts only in production
  useEffect(() => {
    if (!isProd) return;
    if (gaId && !window.gtag) {
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      // @ts-ignore
      function gtag(){ dataLayer.push(arguments); }
      // @ts-ignore
      window.gtag = gtag;
      // @ts-ignore
      gtag("js", new Date());
      // @ts-ignore
      gtag("config", gaId);
    }
    if (plausibleDomain && !document.getElementById("plausible-script")) {
      const ps = document.createElement("script");
      ps.id = "plausible-script";
      ps.defer = true;
      ps.setAttribute("data-domain", plausibleDomain);
      ps.src = "https://plausible.io/js/script.js";
      document.head.appendChild(ps);
    }
    if (posthogKey && !window.posthog) {
      const ph = document.createElement("script");
      ph.defer = true;
      ph.src = `${posthogHost}/static/array.js`;
      ph.onload = () => {
        // @ts-ignore
        window.posthog.init(posthogKey, { api_host: posthogHost });
      };
      document.head.appendChild(ph);
    }
    if (vercelAnalytics && !document.getElementById("vercel-analytics")) {
      const va = document.createElement("script");
      va.id = "vercel-analytics";
      va.src = "/_vercel/insights/script.js";
      va.defer = true;
      document.head.appendChild(va);
    }
  }, [isProd]);

  // Pageview tracking on route change (prod only)
  useEffect(() => {
    if (!isProd) return;
    if (gaId && window.gtag) {
      // @ts-ignore
      window.gtag("event", "page_view", { page_location: window.location.href });
    }
    if (plausibleDomain && (window as any).plausible) {
      (window as any).plausible("pageview");
    }
    if (posthogKey && (window as any).posthog) {
      (window as any).posthog.capture("$pageview");
    }
  }, [loc.pathname, isProd]);

  return <>{children}</>;
}