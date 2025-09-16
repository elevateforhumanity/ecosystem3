import React from "react";
import { SEO } from "../lib/seo/SEO";

export default function NotFound() {
  return (
    <>
      <SEO title="404 Not Found" noindex description="Page not found." />
      <h1>404 - Not Found</h1>
      <p>The page you’re looking for doesn’t exist.</p>
    </>
  );
}