spaces/new-ecosysstem/netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18.20.4"
  NPM_FLAGS = "--legacy-peer-deps"

# SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200