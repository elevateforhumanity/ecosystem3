/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

export interface BrandingConfig {
  version: string;
  lastUpdated: string;
  logo: {
    favicon: string;
    header: string;
    footer: string;
    requirements: {
      format: string;
      type: string;
      maxSize: string;
      dimensions: string;
    };
  };
  footerBackground: {
    image: string;
    alt: string;
    requirements: {
      theme: string;
      type: string;
      format: string;
      maxSize: string;
      dimensions: string;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    success: string;
    warning: string;
    error: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    codeFont: string;
  };
  spacing: {
    unit: number;
    scale: number[];
  };
}

class BrandingService {
  private config: BrandingConfig;

  constructor() {
    this.config = this.buildConfig();
  }

  private buildConfig(): BrandingConfig {
    return {
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      
      logo: {
        favicon: '/api/images/favicon.ico',
        header: '/api/images/logo-header.svg',
        footer: '/api/images/logo-footer.svg',
        requirements: {
          format: 'SVG preferred, PNG backup',
          type: 'LOGO_REQUIRED',
          maxSize: '500KB',
          dimensions: 'flexible',
        },
      },
      
      footerBackground: {
        image: '/api/images/footer-education-bg.jpg',
        alt: 'Education and workforce development background',
        requirements: {
          theme: 'education/workforce development',
          type: 'EDUCATION_BACKGROUND_REQUIRED',
          format: 'JPEG/PNG',
          maxSize: '2MB',
          dimensions: '1920x400 recommended',
        },
      },
      
      colors: {
        primary: '#1e40af',
        secondary: '#7c3aed',
        accent: '#059669',
        neutral: '#6b7280',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        background: '#f9fafb',
      },
      
      typography: {
        headingFont: 'Inter, system-ui, sans-serif',
        bodyFont: 'Inter, system-ui, sans-serif',
        codeFont: 'Fira Code, Consolas, monospace',
      },
      
      spacing: {
        unit: 4, // Base spacing unit in pixels
        scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96],
      },
    };
  }

  getConfig(): BrandingConfig {
    return { ...this.config };
  }

  updateConfig(updates: Partial<BrandingConfig>): BrandingConfig {
    this.config = {
      ...this.config,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    return this.getConfig();
  }

  getCSSVariables(): Record<string, string> {
    const config = this.getConfig();
    return {
      '--color-primary': config.colors.primary,
      '--color-secondary': config.colors.secondary,
      '--color-accent': config.colors.accent,
      '--color-neutral': config.colors.neutral,
      '--color-success': config.colors.success,
      '--color-warning': config.colors.warning,
      '--color-error': config.colors.error,
      '--color-background': config.colors.background,
      '--font-heading': config.typography.headingFont,
      '--font-body': config.typography.bodyFont,
      '--font-code': config.typography.codeFont,
      '--spacing-unit': `${config.spacing.unit}px`,
    };
  }

  generateCSS(): string {
    const variables = this.getCSSVariables();
    const cssVars = Object.entries(variables)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');

    return `:root {\n${cssVars}\n}`;
  }
}

// Singleton branding service instance
export const brandingService = new BrandingService();