/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import { describe, it, expect } from 'vitest';
import { frameworkSettings } from '../src/lib/frameworkSettings';

describe('Framework Settings', () => {
  it('should load framework configuration correctly', () => {
    const config = frameworkSettings.getConfig();
    
    expect(config).toBeDefined();
    expect(config.meta).toBeDefined();
    expect(config.frontend).toBeDefined();
    expect(config.build).toBeDefined();
  });

  it('should detect TypeScript is enabled', () => {
    expect(frameworkSettings.isTypescriptEnabled()).toBe(true);
  });

  it('should detect multi-site configuration', () => {
    expect(frameworkSettings.isMultiSiteEnabled()).toBe(true);
  });

  it('should return framework versions', () => {
    const versions = frameworkSettings.getFrameworkVersions();
    
    expect(versions.react).toBe('18.3.1');
    expect(versions.typescript).toBe('5.9.2');
    expect(versions.tailwind).toBe('3.4.10');
  });

  it('should validate framework compatibility', () => {
    const validation = frameworkSettings.validateFrameworkCompatibility();
    
    expect(validation).toHaveProperty('isValid');
    expect(validation).toHaveProperty('errors');
    expect(validation).toHaveProperty('warnings');
    expect(Array.isArray(validation.errors)).toBe(true);
    expect(Array.isArray(validation.warnings)).toBe(true);
  });

  it('should return sister sites configuration', () => {
    const sisterSites = frameworkSettings.getSisterSites();
    
    expect(Array.isArray(sisterSites)).toBe(true);
    expect(sisterSites.length).toBeGreaterThan(0);
    expect(sisterSites[0]).toHaveProperty('name');
    expect(sisterSites[0]).toHaveProperty('url');
  });

  it('should export configuration as JSON', () => {
    const exported = frameworkSettings.exportConfig();
    
    expect(typeof exported).toBe('string');
    expect(() => JSON.parse(exported)).not.toThrow();
  });

  it('should get section configurations', () => {
    expect(frameworkSettings.getBuildConfig()).toBeDefined();
    expect(frameworkSettings.getFrontendConfig()).toBeDefined();
    expect(frameworkSettings.getStylingConfig()).toBeDefined();
    expect(frameworkSettings.getTestingConfig()).toBeDefined();
    expect(frameworkSettings.getEcosystemConfig()).toBeDefined();
  });

  it('should handle optional configurations gracefully', () => {
    expect(() => frameworkSettings.getDevelopmentConfig()).not.toThrow();
    expect(() => frameworkSettings.getPerformanceConfig()).not.toThrow();
    expect(() => frameworkSettings.getSecurityConfig()).not.toThrow();
  });
});