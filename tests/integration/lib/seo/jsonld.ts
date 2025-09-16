export function orgJsonLd() {
  const name = import.meta.env.VITE_SITE_NAME;
  const url = import.meta.env.VITE_SITE_URL;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": url,
    "name": name
  };
}

export function websiteJsonLd() {
  const url = import.meta.env.VITE_SITE_URL;
  const name = import.meta.env.VITE_SITE_NAME;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": url,
    "name": name
  };
}