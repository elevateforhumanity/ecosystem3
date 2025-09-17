/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React, { useState } from "react";

const demoQuiz = {
  title: "Quiz 1: AI Basics",
  questions: [
    {
      q: "What does AI stand for?",
      options: ["Artificial Intelligence", "Automated Input", "Advanced Internet", "Analog Interface"],
      answer: 0,
    },
    {
      q: "Which is a type of machine learning?",
      options: ["Supervised", "Unsupervised", "Both", "Neither"],
      answer: 2,
    },
  ],
};

export default function Quiz() {
  const [answers, setAnswers] = useState(Array(demoQuiz.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  function handleSelect(qIdx, optIdx) {
    const next = [...answers];
    next[qIdx] = optIdx;
    setAnswers(next);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  const score = answers.reduce(
    (acc, ans, idx) => acc + (ans === demoQuiz.questions[idx].answer ? 1 : 0),
    0
  );

  return (
    <main style={{ padding: 32, maxWidth: 600, margin: "0 auto" }}>
      <h1>{demoQuiz.title}</h1>
      <form onSubmit={handleSubmit}>
        {demoQuiz.questions.map((q, i) => (
          <div key={i} style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: "bold" }}>{i + 1}. {q.q}</div>
            {q.options.map((opt, j) => (
              <label key={j} style={{ display: "block", marginLeft: 16 }}>
                <input
                  type="radio"
                  name={`q${i}`}
                  checked={answers[i] === j}
                  onChange={() => handleSelect(i, j)}
                  disabled={submitted}
                  required={!submitted}
                />{" "}
                {opt}
              </label>
            ))}
          </div>
        ))}
        {!submitted ? (
          <button type="submit" style={{ padding: "10px 24px", background: "#1976d2", color: "#fff", border: "none", borderRadius: 6 }}>
            Submit Quiz
          </button>
        ) : (
          <div style={{ marginTop: 24, fontWeight: "bold", color: "#388e3c" }}>
            You scored {score} out of {demoQuiz.questions.length}
          </div>
        )}
      </form>
    </main>
  );
}