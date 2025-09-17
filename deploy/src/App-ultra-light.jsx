// Ultra-lightweight React app - no external dependencies
import React from "react";

export default function App() {
  return (
    <div style={{
      margin: 0,
      padding: '1rem',
      fontFamily: 'system-ui, sans-serif',
      lineHeight: 1.6,
      maxWidth: '1200px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          color: '#1e40af', 
          margin: '0 0 0.5rem 0' 
        }}>
          🚀 Elevate for Humanity
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#6b7280',
          margin: 0
        }}>
          <strong>Government Contracting • Philanthropy • Workforce Development</strong>
        </p>
      </header>

      {/* Services Grid */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f8fafc'
          }}>
            <h3 style={{ color: '#1e40af', margin: '0 0 1rem 0' }}>
              🏛️ Government Contracting
            </h3>
            <p style={{ margin: 0, color: '#374151' }}>
              Veteran-Owned Small Business providing workforce development and educational services to government agencies.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f8fafc'
          }}>
            <h3 style={{ color: '#7c3aed', margin: '0 0 1rem 0' }}>
              💜 Philanthropy & Grants
            </h3>
            <p style={{ margin: 0, color: '#374151' }}>
              Elizabeth L. Greene Foundation creating pathways to prosperity through strategic giving.
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f8fafc'
          }}>
            <h3 style={{ color: '#059669', margin: '0 0 1rem 0' }}>
              ♿ Accessibility & Compliance
            </h3>
            <p style={{ margin: 0, color: '#374151' }}>
              WCAG 2.1 AA Compliance with comprehensive accessibility features for all users.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        backgroundColor: '#eff6ff',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          textAlign: 'center', 
          color: '#1e40af',
          margin: '0 0 1rem 0'
        }}>
          Our Impact
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af' }}>1,247</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Learners</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>87%</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Graduation</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>$2.85M</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Funding</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>82%</div>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Job Placement</div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#1f2937', margin: '0 0 1rem 0' }}>
          Ready to Partner?
        </h2>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            🏛️ <strong>Government:</strong> government@elevateforhumanity.org
          </div>
          <div style={{ marginBottom: '0.5rem' }}>
            💜 <strong>Philanthropy:</strong> grants@elevateforhumanity.org
          </div>
          <div>
            ♿ <strong>Accessibility:</strong> accessibility@elevateforhumanity.org
          </div>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          📞 (555) 123-4567 | 🏢 CAGE: 9ABC1 | DUNS: 123456789
        </div>
      </section>
    </div>
  );
}