/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import frameworkConfig from '../../config/framework.config.json';

export interface FrameworkConfig {
  meta: {
    version: string;
    lastUpdated: string;
    description: string;
  };
  build: {
    framework: string;
    target: string;
    minify: boolean;
    sourcemap: boolean;
    outDir: string;
  };
  frontend: {
    framework: string;
    version: string;
    features: string[];
  };
  styling: {
    framework: string;
    version: string;
  };
  typescript: {
    enabled: boolean;
    strict: boolean;
    target: string;
  };
  testing: {
    framework: string;
    environment: string;
  };
  ecosystem: {
    multiSite: boolean;
    sisterSites: Array<{
      name: string;
      url: string;
    }>;
  };
  development?: any;
  performance?: any;
  security?: any;
}

class FrameworkSettings {
  private config: FrameworkConfig;

  constructor() {
    this.config = frameworkConfig as FrameworkConfig;
    this.validateConfig();
  }

  private validateConfig(): void {
    const required = ['meta', 'build', 'frontend', 'styling', 'typescript', 'testing'];
    for (const section of required) {
      if (!this.config[section as keyof FrameworkConfig]) {
        throw new Error(`Missing required configuration section: ${section}`);
      }
    }
  }

  // Get configuration sections
  getConfig(): FrameworkConfig {
    return this.config;
  }

  getBuildConfig() {
    return this.config.build;
  }

  getFrontendConfig() {
    return this.config.frontend;
  }

  getStylingConfig() {
    return this.config.styling;
  }

  getTypescriptConfig() {
    return this.config.typescript;
  }

  getTestingConfig() {
    return this.config.testing;
  }

  getEcosystemConfig() {
    return this.config.ecosystem;
  }

  // Feature detection
  isTypescriptEnabled(): boolean {
    return this.config.typescript.enabled;
  }

  isMultiSiteEnabled(): boolean {
    return this.config.ecosystem.multiSite;
  }

  getSisterSites() {
    return this.config.ecosystem.sisterSites;
  }

  // Framework version info
  getFrameworkVersions() {
    return {
      react: this.config.frontend.version,
      typescript: this.config.typescript.enabled ? '5.9.2' : 'disabled',
      tailwind: this.config.styling.version,
      vite: 'Latest',
      vitest: this.config.testing.framework === 'vitest' ? '1.6.0' : 'Not used'
    };
  }

  // Development settings
  getDevelopmentConfig() {
    return this.config.development || {
      server: { host: true, port: 3000, open: false }
    };
  }

  // Performance settings
  getPerformanceConfig() {
    return this.config.performance || {
      bundleAnalysis: { enabled: true },
      lighthouse: { enabled: true }
    };
  }

  // Security settings
  getSecurityConfig() {
    return this.config.security || {
      helmet: { enabled: true },
      rateLimit: { enabled: true }
    };
  }

  // Update configuration (for settings UI)
  updateConfig(section: keyof FrameworkConfig, updates: Partial<any>): void {
    this.config[section] = { ...this.config[section], ...updates } as any;
  }

  // Export current config for saving
  exportConfig(): string {
    return JSON.stringify(this.config, null, 2);
  }

  // Validate framework compatibility
  validateFrameworkCompatibility(): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check React version compatibility
    const reactVersion = this.config.frontend.version;
    if (reactVersion < '18.0.0') {
      errors.push('React version should be 18.0.0 or higher for optimal performance');
    }

    // Check TypeScript configuration
    if (this.config.typescript.enabled && this.config.typescript.target < 'ES2022') {
      warnings.push('Consider upgrading TypeScript target to ES2022 for better performance');
    }

    // Check if testing is properly configured
    if (!this.config.testing.framework) {
      warnings.push('No testing framework configured - consider adding Vitest');
    }

    // Check ecosystem configuration for multi-site
    if (this.config.ecosystem.multiSite && (!this.config.ecosystem.sisterSites || this.config.ecosystem.sisterSites.length === 0)) {
      errors.push('Multi-site enabled but no sister sites configured');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export singleton instance
export const frameworkSettings = new FrameworkSettings();
export default frameworkSettings;