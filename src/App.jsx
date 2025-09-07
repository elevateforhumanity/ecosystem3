/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Ecosystem from "./pages/Ecosystem";
import Student from "./pages/Student";
import Instructor from "./pages/Instructor";
import Analytics from "./pages/Analytics";
import Course from "./pages/Course";
import About from "./pages/About";
import Accessibility from "./pages/Accessibility";
import Sitemap from "./pages/Sitemap";
import StudentHandbook from "./pages/StudentHandbook";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import TermsOfService from "./pages/TermsOfService";
import Mentorship from "./pages/sisters/Mentorship";
import MentorDirectory from "./pages/sisters/MentorDirectory";
import MentorSignup from "./pages/sisters/MentorSignup";
import Volunteer from "./pages/sisters/Volunteer";
import VolunteerOpportunities from "./pages/sisters/VolunteerOpportunities";
import VolunteerStories from "./pages/sisters/VolunteerStories";
import Wellness from "./pages/sisters/Wellness";
import WellnessResources from "./pages/sisters/WellnessResources";
import PeerSupport from "./pages/sisters/PeerSupport";
import CloneLanding from "./pages/CloneLanding";
import ThankYou from "./pages/ThankYou";
import CourseBuilder from "./pages/CourseBuilder";
import UserManagement from "./pages/UserManagement";
import Ecommerce from "./pages/Ecommerce";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Community from "./pages/Community";
import Branding from "./pages/Branding";
import Integrations from "./pages/Integrations";
import MobileApp from "./pages/MobileApp";
import AccessibilitySettings from "./pages/AccessibilitySettings";
import Support from "./pages/Support";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Quiz from "./pages/Quiz";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/student" element={<Student />} />
          <Route path="/instructor" element={<Instructor />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/course/:id" element={<Course />} />
          <Route path="/about" element={<About />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/student-handbook" element={<StudentHandbook />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* Sister Sites */}
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/mentorship/directory" element={<MentorDirectory />} />
          <Route path="/mentorship/signup" element={<MentorSignup />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/volunteer/opportunities" element={<VolunteerOpportunities />} />
          <Route path="/volunteer/stories" element={<VolunteerStories />} />
          <Route path="/wellness" element={<Wellness />} />
          <Route path="/wellness/resources" element={<WellnessResources />} />
          <Route path="/wellness/peersupport" element={<PeerSupport />} />
          <Route path="/clone" element={<CloneLanding />} />
          <Route path="/thank-you" element={<ThankYou />} />
          {/* Admin/Advanced LMS Features */}
          <Route path="/course-builder" element={<CourseBuilder />} />
          <Route path="/user-management" element={<UserManagement />} />
          <Route path="/ecommerce" element={<Ecommerce />} />
          <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="/branding" element={<Branding />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/mobile-app" element={<MobileApp />} />
          <Route path="/accessibility-settings" element={<AccessibilitySettings />} />
          <Route path="/support" element={<Support />} />
          {/* New Routes */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/quiz" element={<Quiz />} />
        </Route>
      </Routes>
      <main style={{ fontFamily: "sans-serif", padding: 32 }}>
        <h1>App Running</h1>
        <p>Baseline environment ready.</p>
        <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>
      </main>
    </Router>
  );
}
