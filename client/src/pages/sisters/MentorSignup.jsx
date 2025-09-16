import React, { useState } from "react";

export default function MentorSignup() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    expertise: "",
    bio: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    // TODO: Send mentor signup data to backend or database
  }

  return (
    <main style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      <h1>Mentor Signup</h1>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
          </label>
          <label>
            Email:
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
          </label>
          <label>
            Area of Expertise:
            <input
              name="expertise"
              value={form.expertise}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
          </label>
          <label>
            Short Bio:
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              style={{ width: "100%", marginBottom: 12, padding: 8 }}
            />
          </label>
          <button type="submit" style={{ padding: "10px 24px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 6 }}>
            Submit
          </button>
        </form>
      ) : (
        <div style={{ marginTop: 24, color: "#388e3c", fontWeight: "bold" }}>
          Thank you for signing up as a mentor! We will contact you soon.
        </div>
      )}
    </main>
  );
}