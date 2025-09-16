/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import VolunteerStories from "./pages/sisters/VolunteerStories";

const demoCourses = {
  "ai-for-beginners": {
    title: "AI for Beginners",
    coverUrl: "/images/ai-course.jpg",
    description: "Learn the basics of AI and machine learning.",
    modules: [
      {
        title: "Introduction to AI",
        lessons: ["What is AI?", "History of AI", "Applications of AI"],
      },
      {
        title: "Machine Learning Basics",
        lessons: ["Supervised vs Unsupervised", "Neural Networks"],
      },
    ],
    quizzes: [
      { title: "Quiz 1: AI Basics", questions: 5 },
      { title: "Quiz 2: Machine Learning", questions: 7 },
    ],
  },
  "workforce-readiness": {
    title: "Workforce Readiness",
    coverUrl: "/images/workforce.jpg",
    description: "Prepare for the modern workforce with essential skills.",
    modules: [
      {
        title: "Professional Skills",
        lessons: ["Resume Writing", "Interview Skills"],
      },
      {
        title: "Workplace Communication",
        lessons: ["Email Etiquette", "Teamwork"],
      },
    ],
    quizzes: [{ title: "Quiz 1: Professional Skills", questions: 6 }],
  },
  "healthcare-fundamentals": {
    title: "Healthcare Fundamentals",
    coverUrl: "/images/healthcare.jpg",
    description: "Essential knowledge for entering the healthcare industry.",
    modules: [
      {
        title: "Healthcare Basics",
        lessons: ["Healthcare Systems", "Patient Care"],
      },
    ],
    quizzes: [{ title: "Quiz 1: Healthcare Basics", questions: 8 }],
  },
  "digital-marketing-essentials": {
    title: "Digital Marketing Essentials",
    coverUrl: "/images/marketing.jpg",
    description: "Master digital marketing strategies and tools.",
    modules: [
      {
        title: "Marketing Channels",
        lessons: ["SEO", "Social Media", "Email Marketing"],
      },
      {
        title: "Analytics",
        lessons: ["Google Analytics", "KPIs"],
      },
    ],
    quizzes: [{ title: "Quiz 1: Marketing Channels", questions: 5 }],
  },
};

export default function CourseDetail() {
  const { id } = useParams();
  const course = demoCourses[id];
  const [enrolled, setEnrolled] = useState(false);



  return (
    <main style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
      <h1 style={{ fontSize: 32 }}>{course.title}</h1>
      <img
        src={course.coverUrl}
        alt={course.title}
        title={course.title}
        style={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 10,
          margin: "24px 0",
        }}
      />
      <p style={{ fontSize: 18, color: "#444" }}>{course.description}</p>
      <h2 style={{ marginTop: 32 }}>Modules</h2>
      <ul>
        {course.modules.map((mod, i) => (
          <li key={i} style={{ marginBottom: 12 }}>
            <strong>{mod.title}</strong>
            <ul>
              {mod.lessons.map((lesson, j) => (
                <li key={j}>{lesson}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <h2 style={{ marginTop: 32 }}>Quizzes</h2>
      <ul>
        {course.quizzes.map((quiz, i) => (
          <li key={i}>
            {quiz.title} ({quiz.questions} questions)
          </li>
        ))}
      </ul>
      {!enrolled ? (
        <button
          style={{
            marginTop: 32,
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "12px 24px",
            fontWeight: "bold",
            fontSize: 18,
            cursor: "pointer",
          }}
          onClick={() => setEnrolled(true)}
        >
          Enroll Now
        </button>
      ) : (
        <div style={{ marginTop: 32, color: "#388e3c", fontWeight: "bold" }}>
          You are enrolled! Progress tracking is now enabled.
        </div>
      )}
    </main>
  );
}

// In your App.jsx, add:
// import CourseDetail from "./pages/CourseDetail";
// <Route path="/course/:id" element={<CourseDetail />}