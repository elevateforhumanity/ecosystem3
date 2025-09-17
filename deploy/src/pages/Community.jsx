/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React, { useState } from "react";

const demoThreads = [
  { id: 1, title: "Welcome to the Community!", posts: 5 },
  { id: 2, title: "Share your progress", posts: 3 },
];

export default function Community() {
  const [threads] = useState(demoThreads);
  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Community Forum</h1>
      <ul>
        {threads.map(t => (
          <li key={t.id} style={{ marginBottom: 12 }}>
            <strong>{t.title}</strong> ({t.posts} posts)
          </li>
        ))}
      </ul>
      {/* TODO: Add thread view, post creation, comments */}
    </main>
  );
}