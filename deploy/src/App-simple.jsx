import React from "react";

export default function App() {
  // Add some basic global styles
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    document.body.style.lineHeight = '1.6';
    document.body.style.backgroundColor = '#ffffff';
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ color: '#1e40af', fontSize: '3rem', textAlign: 'center' }}>
        🚀 Elevate for Humanity
      </h1>
      <p style={{ fontSize: '1.5rem', textAlign: 'center', color: '#6b7280' }}>
        <strong>Government Contracting • Philanthropy • Workforce Development</strong>
      </p>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div style={{
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e40af' }}>
              🏛️ Government Contracting Services
            </h3>
            <p style={{ color: '#6b7280' }}>
              <strong>Veteran-Owned Small Business (VOSB)</strong> providing comprehensive workforce development and educational services to federal, state, and local government agencies.
            </p>
          </div>

          <div style={{
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#7c3aed' }}>
              💜 Philanthropy & Grant Management
            </h3>
            <p style={{ color: '#6b7280' }}>
              <strong>Elizabeth L. Greene Foundation</strong> - Creating pathways to prosperity through strategic giving and community partnerships.
            </p>
          </div>

          <div style={{
            padding: '2rem',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#f9fafb',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#059669' }}>
              ♿ Accessibility & Compliance Leadership
            </h3>
            <p style={{ color: '#6b7280' }}>
              <strong>WCAG 2.1 AA Compliance</strong> with comprehensive accessibility features ensuring equal access for all users.
            </p>
          </div>
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem',
          padding: '2rem',
          backgroundColor: '#eff6ff',
          borderRadius: '8px'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1e40af' }}>
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
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '3rem',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        }}>
          <h2>Ready to Partner with Us?</h2>
          <p><strong>Contact our specialized teams for your specific needs:</strong></p>
          <p>
            🏛️ <strong>Government Contracts:</strong> government@elevateforhumanity.org<br/>
            💜 <strong>Philanthropy & Grants:</strong> grants@elevateforhumanity.org<br/>
            ♿ <strong>Accessibility Services:</strong> accessibility@elevateforhumanity.org
          </p>
          <p style={{ marginTop: '20px' }}>
            📞 <strong>Phone:</strong> (555) 123-4567<br/>
            🏢 <strong>CAGE Code:</strong> 9ABC1 | <strong>DUNS:</strong> 123456789
          </p>
          <p style={{ marginTop: '20px', fontSize: '0.9em' }}>
            <strong>Elevate for Humanity</strong> - Veteran-Owned Small Business<br/>
            Creating pathways to prosperity through education, workforce development, and community impact.
          </p>
        </div>
      </div>
    </div>
  );
}