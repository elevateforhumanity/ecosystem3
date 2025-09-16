/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React, { useState } from "react";

export default function CourseBuilder() {
  const [modules, setModules] = useState([
    { title: "Module 1", lessons: ["Lesson 1"] }
  ]);
  const [newModule, setNewModule] = useState("");
  const [newLesson, setNewLesson] = useState("");
  const [selectedModule, setSelectedModule] = useState(0);

  function addModule(e) {
    e.preventDefault();
    if (newModule.trim()) {
      setModules([...modules, { title: newModule, lessons: [] }]);
      setNewModule("");
    }
  }

  function addLesson(e) {
    e.preventDefault();
    if (newLesson.trim()) {
      setModules(modules.map((m, i) =>
        i === selectedModule
          ? { ...m, lessons: [...m.lessons, newLesson] }
          : m
      ));
      setNewLesson("");
    }
  }

  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1>Course Builder</h1>
      <form onSubmit={addModule} style={{ marginBottom: 16 }}>
        <input
          value={newModule}
          onChange={e => setNewModule(e.target.value)}
          placeholder="New Module Title"
          style={{ padding: 8, marginRight: 8 }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>Add Module</button>
      </form>
      <div style={{ display: "flex", gap: 32 }}>
        <div style={{ flex: 1 }}>
          <h2>Modules</h2>
          <ul>
            {modules.map((mod, i) => (
              <li
                key={i}
                style={{
                  cursor: "pointer",
                  fontWeight: i === selectedModule ? "bold" : "normal",
                  marginBottom: 8
                }}
                onClick={() => setSelectedModule(i)}
              >
                {mod.title}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 2 }}>
          <h2>Lessons in {modules[selectedModule]?.title}</h2>
          <ul>
            {modules[selectedModule]?.lessons.map((lesson, j) => (
              <li key={j}>{lesson}</li>
            ))}
          </ul>
          <form onSubmit={addLesson} style={{ marginTop: 12 }}>
            <input
              value={newLesson}
              onChange={e => setNewLesson(e.target.value)}
              placeholder="New Lesson Title"
              style={{ padding: 8, marginRight: 8 }}
            />
            <button type="submit" style={{ padding: "8px 16px" }}>Add Lesson</button>
          </form>
        </div>
      </div>
    </main>
  );
}