/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React, { useState } from "react";

export default function CurriculumUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [coursePreview, setCoursePreview] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus("Processing...");
    // TODO: Integrate with backend AI service for parsing
    setTimeout(() => {
      setCoursePreview({
        title: "Sample Course from Upload",
        modules: [
          { title: "Module 1: Introduction", lessons: ["Lesson 1", "Lesson 2"] },
          { title: "Module 2: Advanced Topics", lessons: ["Lesson 3"] },
        ],
        quizzes: [{ title: "Quiz 1", questions: 5 }],
        coverUrl: "/images/sample-cover.jpg",
      });
      setStatus("Preview generated! Review and publish.");
    }, 2000);
  };

  return (
    <main style={{ padding: 32 }}>
      <h1>AI Curriculum Upload</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".pdf,.docx,.txt,.mp4"
          onChange={e => setFile(e.target.files[0])}
          required
        />
        <button type="submit" style={{ marginLeft: 16 }}>Upload & Generate</button>
      </form>
      <div style={{ marginTop: 24 }}>{status}</div>
      {coursePreview && (
        <div style={{ marginTop: 32, border: "1px solid #ccc", borderRadius: 8, padding: 24 }}>
          <h2>{coursePreview.title}</h2>
          <img src={coursePreview.coverUrl} alt="Course Cover" style={{ width: 200, borderRadius: 8 }} />
          <h3>Modules</h3>
          <ul>
            {coursePreview.modules.map((mod, i) => (
              <li key={i}><strong>{mod.title}</strong>
                <ul>
                  {mod.lessons.map((l, j) => <li key={j}>{l}</li>)}
                </ul>
              </li>
            ))}
          </ul>
          <h3>Quizzes</h3>
          <ul>
            {coursePreview.quizzes.map((q, i) => (
              <li key={i}>{q.title} ({q.questions} questions)</li>
            ))}
          </ul>
          <button style={{ marginTop: 16 }}>Publish Course</button>
        </div>
      )}
    </main>
  );
}