// Central route metadata (source of truth for sitemap & routing)
export const ROUTES = [
  {
    path: "/",
    changefreq: "weekly",
    priority: 1.0,
    sitemap: true
  },
  {
    path: "/donate.html",
    changefreq: "monthly",
    priority: 0.7,
    sitemap: true
  }
  // Add more:
  // { path: "/about", changefreq: "monthly", priority: 0.6, sitemap: true }
];