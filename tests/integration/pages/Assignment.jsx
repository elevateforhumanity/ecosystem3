/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React, { useState } from "react";

export default function Assignment() {
  const [submitted, setSubmitted] = useState(false);
  const [text, setText] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <main style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      <h1>Assignment: AI Essay</h1>
      <p>
        Write a short essay (100-300 words):<br />
        <strong>“How will AI change the world in the next 10 years?”</strong>
      </p>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            rows={8}
            style={{ width: "100%", marginBottom: 16, padding: 8 }}
            required
            minLength={100}
            maxLength={300}
          />
          <button type="submit" style={{ padding: "10px 24px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 6 }}>
            Submit Assignment
          </button>
        </form>
      ) : (
        <div style={{ marginTop: 24, fontWeight: "bold", color: "#388e3c" }}>
          Assignment submitted! (Demo)
        </div>
      )}
    </main>
  );
}