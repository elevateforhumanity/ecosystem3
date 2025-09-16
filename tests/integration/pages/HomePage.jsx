import React from "react";
import { SEO } from "../lib/seo/SEO";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Home"
        description="Elevate for Humanity drives mentorship, education, and community impact."
        canonical={`${import.meta.env.VITE_SITE_URL || ""}/`}
      />
      <h1>Welcome to Elevate for Humanity</h1>
      <p>Transforming potential through mentorship and learning.</p>
    </>
  );
}