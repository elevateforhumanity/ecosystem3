import React from "react";
import { SEO } from "../lib/seo/SEO";

export default function DonatePage() {
  return (
    <>
      <SEO
        title="Donate"
        description="Support Elevate for Humanity with a donation."
        canonical={`${import.meta.env.VITE_SITE_URL || ""}/donate.html`}
      />
      <h1>Donate</h1>
      <p>Your support fuels education and mentorship programs.</p>
    </>
  );
}