import React from "react";
import { Link } from "react-router-dom";
import { SEO } from "../lib/seo/SEO";

export default function HomePage() {
  return (
    <>
      <SEO
        title="Home"
        description="Elevate for Humanity drives mentorship, education, and community impact."
        canonical={`${import.meta.env.VITE_SITE_URL || ""}/`}
      />
      <main id="main-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1e40af' }}>
            Welcome to Elevate for Humanity
          </h1>
          <p style={{ fontSize: '1.5rem', color: '#6b7280' }}>
            Transforming potential through mentorship, education, and community impact.
          </p>
        </header>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center', color: '#1f2937' }}>
            Our Services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{
              padding: '2rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e40af' }}>
                🎓 Education & Training
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Comprehensive workforce development programs, apprenticeships, and skills training 
                designed to meet industry demands and create pathways to prosperity.
              </p>
              <Link to="/programs" style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#1e40af',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}>
                Explore Programs
              </Link>
            </div>

            <div style={{
              padding: '2rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#059669' }}>
                🏛️ Government Partnerships
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Certified government contractor providing workforce development, education services, 
                and compliance solutions for federal, state, and local agencies.
              </p>
              <Link to="/government" style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#059669',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}>
                Government Services
              </Link>
            </div>

            <div style={{
              padding: '2rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb',
              textAlign: 'center'
            }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#7c3aed' }}>
                💜 Philanthropy & Grants
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                Supporting communities through strategic giving, grant programs, and partnerships 
                that create lasting social impact and educational opportunities.
              </p>
              <Link to="/philanthropy" style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#7c3aed',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}>
                Learn More
              </Link>
            </div>
          </div>
        </section>

        <section style={{
          backgroundColor: '#eff6ff',
          padding: '3rem',
          borderRadius: '8px',
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e40af' }}>
            Ready to Get Started?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Whether you're an individual seeking training, an organization looking for partnerships, 
            or a government agency needing workforce solutions, we're here to help.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/student" style={{
              padding: '1rem 2rem',
              backgroundColor: '#1e40af',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '1.1rem'
            }}>
              Start Learning
            </Link>
            <Link to="/connect" style={{
              padding: '1rem 2rem',
              backgroundColor: 'white',
              color: '#1e40af',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '1.1rem',
              border: '2px solid #1e40af'
            }}>
              Contact Us
            </Link>
          </div>
        </section>

        <section style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1f2937' }}>
            Our Impact
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1e40af' }}>1,247</div>
              <div style={{ color: '#6b7280' }}>Learners Supported</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#059669' }}>87%</div>
              <div style={{ color: '#6b7280' }}>Graduation Rate</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#7c3aed' }}>$2.85M</div>
              <div style={{ color: '#6b7280' }}>Funding Distributed</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#dc2626' }}>82%</div>
              <div style={{ color: '#6b7280' }}>Job Placement Rate</div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}