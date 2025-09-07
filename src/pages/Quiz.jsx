import React, { useState } from "react";

export default function Quiz() {
  const questions = [
    {
      id: 1,
      q: "What is financial literacy?",
      choices: [
        "Understanding how to manage money",
        "Only about investing in stocks",
        "Memorizing tax codes",
        "Tracking celebrities' net worth"
      ],
      answer: 0
    },
    {
      id: 2,
      q: "A budget helps you:",
      choices: [
        "Spend randomly",
        "Track and plan income vs. expenses",
        "Avoid saving",
        "Increase impulse purchases"
      ],
      answer: 1
    }
  ];

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const current = questions[step];
  const score = Object.entries(selected).filter(
    ([id, idx]) => questions.find(q => q.id === Number(id)).answer === idx
  ).length;

  function next() {
    if (step < questions.length - 1) setStep(s => s + 1);
  }
  function prev() {
    if (step > 0) setStep(s => s - 1);
  }
  function submit() {
    setSubmitted(true);
  }

  return (
    <main style={{ padding: 32, maxWidth: 640, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Quiz</h1>
      {!submitted ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <strong>
              Question {step + 1} / {questions.length}
            </strong>
          </div>
          <p style={{ fontSize: 18 }}>{current.q}</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {current.choices.map((c, idx) => {
              const chosen = selected[current.id] === idx;
              return (
                <li key={idx} style={{ marginBottom: 8 }}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelected(s => ({ ...s, [current.id]: idx }))
                    }
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      borderRadius: 6,
                      border: chosen
                        ? "2px solid #2563eb"
                        : "1px solid #cbd5e1",
                      background: chosen ? "#eff6ff" : "#fff",
                      cursor: "pointer"
                    }}
                  >
                    {c}
                  </button>
                </li>
              );
            })}
          </ul>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={prev} disabled={step === 0} style={{ padding: "8px 14px" }}>
              Back
            </button>
            {step < questions.length - 1 && (
              <button
                onClick={next}
                disabled={selected[current.id] === undefined}
                style={{ padding: "8px 14px" }}
              >
                Next
              </button>
            )}
            {step === questions.length - 1 && (
              <button
                onClick={submit}
                disabled={questions.some(q => selected[q.id] === undefined)}
                style={{
                  padding: "8px 14px",
                  background: "#2563eb",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4
                }}
              >
                Submit
              </button>
            )}
          </div>
        </>
      ) : (
        <section>
          <h2>Results</h2>
          <p>
            You scored {score} / {questions.length}
          </p>
            <ul>
              {questions.map(q => {
                const chosen = selected[q.id];
                const correct = q.answer;
                return (
                  <li key={q.id} style={{ marginBottom: 12 }}>
                    <strong>{q.q}</strong>
                    <div style={{ fontSize: 14 }}>
                      Your answer:{" "}
                      <span
                        style={{
                          color: chosen === correct ? "#15803d" : "#b91c1c"
                        }}
                      >
                        {q.choices[chosen] ?? "—"}
                      </span>{" "}
                      | Correct: {q.choices[correct]}
                    </div>
                  </li>
                );
              })}
            </ul>
        </section>
      )}
    </main>
  );
}