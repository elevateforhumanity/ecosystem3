import React from "react";

export default function Compliance() {
  return (
    <main id="main-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1e40af' }}>
          Compliance & Standards
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '800px', margin: '0 auto' }}>
          Elevate for Humanity maintains the highest standards of compliance across all regulatory 
          frameworks, ensuring quality, accessibility, and legal adherence in all our programs and services.
        </p>
      </header>

      {/* Federal Compliance */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>
          Federal Compliance Standards
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f0fdf4'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#166534' }}>
              ✅ Section 508 Compliance
            </h3>
            <p style={{ color: '#374151', marginBottom: '1rem' }}>
              Full accessibility compliance ensuring equal access to digital content and services 
              for individuals with disabilities.
            </p>
            <div style={{ fontSize: '0.875rem', color: '#059669' }}>
              Certified: January 2025
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f0fdf4'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#166534' }}>
              ✅ WIOA Compliance
            </h3>
            <p style={{ color: '#374151', marginBottom: '1rem' }}>
              Workforce Innovation and Opportunity Act compliance for all workforce development 
              and training programs.
            </p>
            <div style={{ fontSize: '0.875rem', color: '#059669' }}>
              Certified: December 2024
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f0fdf4'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#166534' }}>
              ✅ FERPA Compliance
            </h3>
            <p style={{ color: '#374151', marginBottom: '1rem' }}>
              Family Educational Rights and Privacy Act compliance protecting student 
              educational records and privacy.
            </p>
            <div style={{ fontSize: '0.875rem', color: '#059669' }}>
              Certified: November 2024
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f0fdf4'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#166534' }}>
              ✅ Equal Opportunity
            </h3>
            <p style={{ color: '#374151', marginBottom: '1rem' }}>
              Equal Employment Opportunity and non-discrimination compliance across 
              all programs and services.
            </p>
            <div style={{ fontSize: '0.875rem', color: '#059669' }}>
              Certified: Ongoing
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Standards */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>
          Accessibility Standards
        </h2>
        <div style={{ backgroundColor: '#eff6ff', padding: '2rem', borderRadius: '8px', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e40af' }}>
            WCAG 2.1 AA Compliance
          </h3>
          <p style={{ color: '#374151', marginBottom: '1rem' }}>
            Our digital platforms meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards, 
            ensuring accessibility for users with diverse abilities and assistive technologies.
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ padding: '0.25rem 0', color: '#374151' }}>✓ Screen reader compatibility</li>
            <li style={{ padding: '0.25rem 0', color: '#374151' }}>✓ Keyboard navigation support</li>
            <li style={{ padding: '0.25rem 0', color: '#374151' }}>✓ High contrast color schemes</li>
            <li style={{ padding: '0.25rem 0', color: '#374151' }}>✓ Alternative text for images</li>
            <li style={{ padding: '0.25rem 0', color: '#374151' }}>✓ Closed captioning for videos</li>
          </ul>
        </div>
      </section>

      {/* Data Protection */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>
          Data Protection & Privacy
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{
            padding: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#1f2937' }}>
              SOC 2 Type II
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Security, availability, and confidentiality controls
            </p>
          </div>

          <div style={{
            padding: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#1f2937' }}>
              GDPR Compliant
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              European data protection regulation compliance
            </p>
          </div>

          <div style={{
            padding: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔐</div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#1f2937' }}>
              COPPA Compliant
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Children's online privacy protection
            </p>
          </div>

          <div style={{
            padding: '1rem',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#1f2937' }}>
              CCPA Compliant
            </h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              California consumer privacy act compliance
            </p>
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>
          Quality Assurance & Certifications
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fefce8'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#a16207' }}>
              🏆 ISO 9001:2015
            </h3>
            <p style={{ color: '#374151', marginBottom: '1rem' }}>
              Quality management system certification ensuring consistent delivery 
              of high-quality educational services.
            </p>
            <div style={{ fontSize: '0.875rem', color: '#a16207' }}>
              Certified: March 2024
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fefce8'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#a16207' }}>
              📚 ACCET Accredited
            </h3>
            <p style={{ color: '#374151', marginBottom: '1rem' }}>
              Accrediting Council for Continuing Education & Training accreditation 
              for our educational programs.
            </p>
            <div style={{ fontSize: '0.875rem', color: '#a16207' }}>
              Accredited: June 2024
            </div>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fefce8'
          }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#a16207' }}>
              🎯 ETPL Approved
            </h3>
            <p style={{ color: '#374151', marginBottom: '1rem' }}>
              Eligible Training Provider List approval for workforce development 
              programs across multiple states.
            </p>
            <div style={{ fontSize: '0.875rem', color: '#a16207' }}>
              Approved: Multiple States
            </div>
          </div>
        </div>
      </section>

      {/* Audit & Reporting */}
      <section style={{
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>
          Audit & Reporting
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          We maintain transparent reporting and undergo regular third-party audits to ensure 
          continued compliance with all applicable standards and regulations.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1e40af',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            Download Compliance Report
          </button>
          <button style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'white',
            color: '#1e40af',
            border: '2px solid #1e40af',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}>
            View Certifications
          </button>
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <div>Last Updated: January 15, 2025</div>
          <div>Next Audit: March 2025</div>
        </div>
      </section>
    </main>
  );
}