/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import React, { useState, useEffect } from 'react';

export default function Government() {
  const [contractData, setContractData] = useState(null);
  const [complianceData, setComplianceData] = useState(null);
  const [veteranData, setVeteranData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractRes, complianceRes, veteranRes] = await Promise.all([
          fetch('/api/government/contracts'),
          fetch('/api/government/compliance'),
          fetch('/api/government/veterans')
        ]);

        const [contracts, compliance, veterans] = await Promise.all([
          contractRes.json(),
          complianceRes.json(),
          veteranRes.json()
        ]);

        setContractData(contracts);
        setComplianceData(compliance);
        setVeteranData(veterans);
      } catch (error) {
        console.error('Error fetching government data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading government services...</div>
      </div>
    );
  }

  return (
    <main id="main-content" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1e40af' }}>
          Government Partnerships
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', maxWidth: '800px', margin: '0 auto' }}>
          Elevate for Humanity partners with federal, state, and local government agencies to deliver 
          workforce development, education, and training programs that meet the highest standards of 
          compliance and effectiveness.
        </p>
      </header>

      {/* Contract Capabilities */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>
          Government Contract Capabilities
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {contractData?.capabilities?.map((capability, index) => (
            <div key={index} style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb'
            }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
                {capability.title}
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                {capability.description}
              </p>
              <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                <strong>Contract Types:</strong> {capability.contractTypes.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Compliance Standards */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>
          Compliance & Standards
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {complianceData?.standards?.map((standard, index) => (
            <div key={index} style={{
              padding: '1rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: '#ffffff',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {standard.certified ? '✅' : '🔄'}
              </div>
              <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: '#1f2937' }}>
                {standard.name}
              </h4>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {standard.description}
              </p>
              {standard.certificationDate && (
                <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '0.5rem' }}>
                  Certified: {standard.certificationDate}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Veteran Services */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>
          Veteran & Military Services
        </h2>
        <div style={{ backgroundColor: '#fef3c7', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#92400e' }}>
            🎖️ Veteran-Owned Small Business (VOSB)
          </h3>
          <p style={{ color: '#92400e' }}>
            Elevate for Humanity is a certified Veteran-Owned Small Business, providing priority access 
            to federal contracting opportunities and specialized support for veteran entrepreneurs.
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {veteranData?.services?.map((service, index) => (
            <div key={index} style={{
              padding: '1.5rem',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#ffffff'
            }}>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1f2937' }}>
                {service.title}
              </h4>
              <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
                {service.description}
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {service.features.map((feature, idx) => (
                  <li key={idx} style={{ 
                    padding: '0.25rem 0', 
                    color: '#374151',
                    fontSize: '0.875rem'
                  }}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Performance Metrics */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1f2937' }}>
          Performance Metrics
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {contractData?.metrics?.map((metric, index) => (
            <div key={index} style={{
              padding: '1.5rem',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e40af', marginBottom: '0.5rem' }}>
                {metric.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#1f2937', fontWeight: '500' }}>
                {metric.label}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                {metric.period}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section style={{
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>
          Ready to Partner?
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          Contact our government relations team to discuss partnership opportunities, 
          contract capabilities, and how we can support your agency's mission.
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
            Request Capabilities Statement
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
            Schedule Consultation
          </button>
        </div>
        <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <div>📧 government@elevateforhumanity.org</div>
          <div>📞 (555) 123-4567</div>
          <div>🏢 CAGE Code: 9ABC1 | DUNS: 123456789</div>
        </div>
      </section>
    </main>
  );
}