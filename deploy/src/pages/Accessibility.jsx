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

import React from "react";

export default function Accessibility() {
  return (
    <main id="main-content" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1e40af' }}>
          Accessibility Statement
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
          Elevate for Humanity is committed to ensuring digital accessibility for all users
        </p>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1f2937' }}>
          Our Commitment
        </h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#374151', marginBottom: '1rem' }}>
          Elevate for Humanity is committed to ensuring digital accessibility for all users, including 
          those with disabilities. We believe that everyone should have equal access to information, 
          education, and opportunities regardless of their abilities.
        </p>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#374151' }}>
          We continuously work to improve the accessibility of our digital platforms and services, 
          following established guidelines and best practices to create an inclusive experience for all users.
        </p>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1f2937' }}>
          Standards & Guidelines
        </h2>
        <div style={{ backgroundColor: '#eff6ff', padding: '1.5rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#1e40af' }}>
            WCAG 2.1 AA Compliance
          </h3>
          <p style={{ color: '#374151', marginBottom: '1rem' }}>
            Our website follows the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. 
            These guidelines explain how to make web content more accessible to people with disabilities.
          </p>
        </div>
        
        <div style={{ backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#166534' }}>
            Section 508 Compliance
          </h3>
          <p style={{ color: '#374151' }}>
            We also adhere to Section 508 of the Rehabilitation Act, ensuring our digital content 
            is accessible to federal employees and members of the public with disabilities.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1f2937' }}>
          Accessibility Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              🎯 Keyboard Navigation
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Full keyboard navigation support for users who cannot use a mouse
            </p>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              📖 Screen Reader Support
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Compatible with popular screen readers like JAWS, NVDA, and VoiceOver
            </p>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              🎨 High Contrast
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              High contrast color schemes for users with visual impairments
            </p>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              📝 Alternative Text
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Descriptive alt text for all images and visual content
            </p>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              📺 Captions & Transcripts
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Closed captions and transcripts for all video and audio content
            </p>
          </div>
          
          <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#1f2937' }}>
              🔍 Scalable Text
            </h4>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Text can be resized up to 200% without loss of functionality
            </p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1f2937' }}>
          Assistive Technology Support
        </h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#374151', marginBottom: '1rem' }}>
          Our website is designed to work with a variety of assistive technologies, including:
        </p>
        <ul style={{ fontSize: '1rem', color: '#374151', paddingLeft: '2rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Screen readers (JAWS, NVDA, VoiceOver, TalkBack)</li>
          <li style={{ marginBottom: '0.5rem' }}>Voice recognition software (Dragon NaturallySpeaking)</li>
          <li style={{ marginBottom: '0.5rem' }}>Switch navigation devices</li>
          <li style={{ marginBottom: '0.5rem' }}>Eye-tracking systems</li>
          <li style={{ marginBottom: '0.5rem' }}>Magnification software</li>
        </ul>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#1f2937' }}>
          Ongoing Efforts
        </h2>
        <div style={{ backgroundColor: '#fef3c7', padding: '1.5rem', borderRadius: '8px' }}>
          <p style={{ color: '#92400e', marginBottom: '1rem' }}>
            We regularly review and test our website for accessibility compliance. Our ongoing efforts include:
          </p>
          <ul style={{ color: '#92400e', paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Regular accessibility audits by third-party experts</li>
            <li style={{ marginBottom: '0.5rem' }}>User testing with individuals who use assistive technologies</li>
            <li style={{ marginBottom: '0.5rem' }}>Staff training on accessibility best practices</li>
            <li style={{ marginBottom: '0.5rem' }}>Continuous monitoring and improvement of our digital platforms</li>
          </ul>
        </div>
      </section>

      <section style={{
        backgroundColor: '#f3f4f6',
        padding: '2rem',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1f2937' }}>
          Need Help or Have Feedback?
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          If you encounter any accessibility barriers or have suggestions for improvement, 
          please don't hesitate to contact us.
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ color: '#1f2937' }}>Email:</strong>{' '}
          <a href="mailto:accessibility@elevateforhumanity.org" style={{ color: '#1e40af' }}>
            accessibility@elevateforhumanity.org
          </a>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ color: '#1f2937' }}>Phone:</strong>{' '}
          <span style={{ color: '#374151' }}>(555) 123-4567</span>
        </div>
        <div style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '1.5rem' }}>
          We aim to respond to accessibility feedback within 2 business days.
        </div>
      </section>

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
          <a href="/privacy-policy" style={{ color: '#1e40af', textDecoration: 'none', margin: '0 0.5rem' }}>
            Privacy Policy
          </a>
          |
          <a href="/refund-policy" style={{ color: '#1e40af', textDecoration: 'none', margin: '0 0.5rem' }}>
            Refund Policy
          </a>
          |
          <a href="/terms-of-service" style={{ color: '#1e40af', textDecoration: 'none', margin: '0 0.5rem' }}>
            Terms of Service
          </a>
          |
          <a href="/compliance" style={{ color: '#1e40af', textDecoration: 'none', margin: '0 0.5rem' }}>
            Compliance
          </a>
          |
          <a href="/sitemap" style={{ color: '#1e40af', textDecoration: 'none', margin: '0 0.5rem' }}>
            Sitemap
          </a>
        </div>
        <div style={{ marginTop: '1rem' }}>
          Last updated: January 15, 2025
        </div>
      </footer>
    </main>
  );
}