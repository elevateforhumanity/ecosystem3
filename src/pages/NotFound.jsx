import React from "react";
import AppLayout from "../layouts/AppLayout";
import { useAnalytics } from "../hooks/useAnalytics";

export default function NotFound() {
  useAnalytics("404");
  return (
    <AppLayout title="Not Found">
      <div style={{ padding: 40, textAlign: "center" }}>
        <h1>404</h1>
        <p>Page not found.</p>
        <a href="/">Return home</a>
      </div>
    </AppLayout>
  );
}