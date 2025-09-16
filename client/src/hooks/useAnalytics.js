import { useEffect } from "react";

export function useAnalytics(pageName) {
  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", { page_title: pageName, page_path: window.location.pathname });
    }
  }, [pageName]);
}