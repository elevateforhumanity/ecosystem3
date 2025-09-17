/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';

export default function AccessibilitySettings() {
  const { settings, updateSetting, announce } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (setting, value) => {
    updateSetting(setting, value);
    announce(`${setting} ${value ? 'enabled' : 'disabled'}`, 'polite');
  };

  return (
    <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        style={{
          background: '#1e40af',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          fontSize: '20px',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
        title="Accessibility Settings"
        aria-label="Open accessibility settings"
      >
        ♿
      </button>

      {isOpen && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-labelledby="accessibility-title"
          style={{
            position: 'absolute',
            top: '60px',
            right: '0',
            background: 'white',
            border: '2px solid #1e40af',
            borderRadius: '8px',
            padding: '1rem',
            minWidth: '280px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1001
          }}
        >
          <h3 id="accessibility-title" style={{ margin: '0 0 1rem 0', color: '#1e40af' }}>
            Accessibility Settings
          </h3>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => handleToggle('highContrast', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
                aria-describedby="high-contrast-desc"
              />
              High Contrast Mode
            </label>
            <div id="high-contrast-desc" style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
              Increases contrast for better visibility
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.largeText}
                onChange={(e) => handleToggle('largeText', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
                aria-describedby="large-text-desc"
              />
              Large Text
            </label>
            <div id="large-text-desc" style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
              Increases text size by 20%
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.reducedMotion}
                onChange={(e) => handleToggle('reducedMotion', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
                aria-describedby="reduced-motion-desc"
              />
              Reduce Motion
            </label>
            <div id="reduced-motion-desc" style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
              Minimizes animations and transitions
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="checkbox"
                checked={settings.screenReaderMode}
                onChange={(e) => handleToggle('screenReaderMode', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
                aria-describedby="screen-reader-desc"
              />
              Screen Reader Mode
            </label>
            <div id="screen-reader-desc" style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1.5rem' }}>
              Shows hidden content for screen readers
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Close Settings
            </button>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#6b7280', textAlign: 'center' }}>
            Settings are saved automatically
          </div>
        </div>
      )}

      {/* Overlay to close panel when clicking outside */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'transparent',
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}