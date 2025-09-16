import { Helmet } from "react-helmet-async";
import { orgJsonLd, websiteJsonLd } from "./jsonld";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  image?: string;
}

const siteUrl = import.meta.env.VITE_SITE_URL || "";
const defaultTitle = import.meta.env.VITE_SITE_DEFAULT_TITLE || "";
const defaultDesc = import.meta.env.VITE_SITE_DEFAULT_DESC || "";
const defaultImage = import.meta.env.VITE_SITE_OG_IMAGE || "";
const twitter = import.meta.env.VITE_SITE_TWITTER || "";

export function SEO({
  title,
  description,
  canonical,
  noindex,
  image
}: SEOProps) {
  const fullTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const desc = description || defaultDesc;
  const img = image || defaultImage;
  const url = canonical || siteUrl;

  const googleVer = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION;
  const bingVer = import.meta.env.VITE_BING_SITE_VERIFICATION;
  const yandexVer = import.meta.env.VITE_YANDEX_SITE_VERIFICATION;
  const fbVer = import.meta.env.VITE_FACEBOOK_DOMAIN_VERIFICATION;
  const pinVer = import.meta.env.VITE_PINTEREST_SITE_VERIFICATION;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow" />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      {twitter && <meta name="twitter:site" content={twitter} />}
      {googleVer && <meta name="google-site-verification" content={googleVer} />}
      {bingVer && <meta name="msvalidate.01" content={bingVer} />}
      {yandexVer && <meta name="yandex-verification" content={yandexVer} />}
      {fbVer && <meta name="facebook-domain-verification" content={fbVer} />}
      {pinVer && <meta name="p:domain_verify" content={pinVer} />}
      <script type="application/ld+json">
        {JSON.stringify(orgJsonLd())}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteJsonLd())}
      </script>
    </Helmet>
  );
}