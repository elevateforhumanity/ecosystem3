# DNS settings for Cloudflare Pages hosting

A Record (apex domain):
- Name: @
- Type: A
- Value: 192.0.2.1 (Cloudflare Pages IP - will be provided by Cloudflare)
- Proxy: Enabled (orange cloud)

CNAME Record (www subdomain):
- Name: www
- Type: CNAME
- Value: elevateforhumanity.org
- Proxy: Enabled (orange cloud)

Instructions:
1. Add your domain to Cloudflare (if not already added).
2. Update nameservers to Cloudflare's nameservers.
3. In Cloudflare Pages dashboard, connect your GitHub repository.
4. Add elevateforhumanity.org as a custom domain in Pages settings.
5. Cloudflare will automatically provision SSL certificates.
6. DNS changes are immediate with Cloudflare.
