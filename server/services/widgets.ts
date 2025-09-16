/*
  Copyright (c) 2025 Elevate for Humanity
  Commercial License. No resale, sublicensing, or redistribution allowed.
  See LICENSE file for details.
*/

import { brandingService } from './branding.js';

export interface Widget {
  widget: string;
  version: string;
  lastUpdated: string;
  [key: string]: any;
}

export interface WidgetScript {
  content: string;
  version: string;
  lastUpdated: string;
  contentType: string;
}

class WidgetService {
  private widgets: Map<string, Widget> = new Map();
  private integrationScript: WidgetScript | null = null;

  constructor() {
    this.initializeWidgets();
    this.generateIntegrationScript();
  }

  private initializeWidgets() {
    // Hero Content Widget
    this.widgets.set('hero-content', {
      widget: 'hero-content',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      hero: {
        headline: 'Launch Your AI & Data Science Career',
        subheadline: 'Federal workforce development programs designed to get you hired in high-demand tech roles',
        ctaText: 'Start Your Journey',
        ctaUrl: '/programs',
        backgroundImage: '/api/images/hero-ai-background.jpg',
        stats: [
          { label: 'Job Placement Rate', value: '87%' },
          { label: 'Average Salary Increase', value: '$24K' },
          { label: 'Federal Funding Available', value: '100%' },
          { label: 'Students Enrolled', value: '1,200+' },
        ],
      },
      branding: brandingService.getConfig(),
    });

    // Program Carousel Widget
    this.widgets.set('program-carousel', {
      widget: 'program-carousel',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      programs: [
        {
          id: 'ai-fundamentals',
          title: 'AI Fundamentals',
          description: 'Learn the basics of artificial intelligence and machine learning',
          duration: '12 weeks',
          format: 'Online with mentorship',
          funding: 'WIOA Eligible',
          image: '/api/images/ai-program.jpg',
        },
        {
          id: 'data-science-bootcamp',
          title: 'Data Science Bootcamp',
          description: 'Comprehensive data science training with real-world projects',
          duration: '16 weeks',
          format: 'Hybrid (Online + Lab)',
          funding: 'WIOA + WRG Eligible',
          image: '/api/images/data-science-program.jpg',
        },
        {
          id: 'machine-learning-advanced',
          title: 'Advanced Machine Learning',
          description: 'Advanced ML techniques for experienced developers',
          duration: '20 weeks',
          format: 'Online with capstone',
          funding: 'WIOA Eligible',
          image: '/api/images/ml-program.jpg',
        },
      ],
    });

    // Success Stories Widget
    this.widgets.set('success-stories', {
      widget: 'success-stories',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      stories: [
        {
          name: 'Maria Rodriguez',
          program: 'Data Science Bootcamp',
          outcome: 'Hired as Data Analyst at Tech Corp',
          salaryIncrease: '$28,000',
          testimonial: 'The program gave me the skills and confidence to transition into tech.',
          image: '/api/images/testimonial-maria.jpg',
        },
        {
          name: 'James Thompson',
          program: 'AI Fundamentals',
          outcome: 'Promoted to ML Engineer Role',
          salaryIncrease: '$35,000',
          testimonial: 'Federal funding made this career change possible for me.',
          image: '/api/images/testimonial-james.jpg',
        },
      ],
    });

    // Live Feed Widget
    this.widgets.set('live-feed', {
      widget: 'live-feed',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      feed: [
        {
          type: 'enrollment',
          message: 'Sarah M. just enrolled in AI Fundamentals',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          location: 'Miami, FL',
        },
        {
          type: 'completion',
          message: 'David L. completed Data Science Bootcamp',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          location: 'Orlando, FL',
        },
        {
          type: 'placement',
          message: 'Lisa K. got hired as ML Engineer - $82K salary',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          location: 'Tampa, FL',
        },
      ],
    });

    // Funding Calculator Widget
    this.widgets.set('funding-calculator', {
      widget: 'funding-calculator',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      calculator: {
        programs: [
          { id: 'ai-fundamentals', name: 'AI Fundamentals', cost: 1997 },
          { id: 'data-science-bootcamp', name: 'Data Science Bootcamp', cost: 2997 },
          { id: 'machine-learning-advanced', name: 'Advanced Machine Learning', cost: 3997 },
        ],
        fundingSources: [
          {
            id: 'wioa',
            name: 'WIOA Funding',
            coverage: 100,
            description: 'Complete coverage for eligible participants',
          },
          {
            id: 'wrg',
            name: 'Workforce Reentry Grant',
            coverage: 80,
            description: 'Up to 80% coverage for reentry participants',
          },
          {
            id: 'pell',
            name: 'Pell Grant',
            coverage: 60,
            description: 'Federal grant for eligible students',
          },
        ],
      },
    });
  }

  private generateIntegrationScript() {
    const script = `
/**
 * Elevate for Humanity Brain - Widget Integration Library
 * Version: 1.0
 * Last Updated: ${new Date().toISOString()}
 */

(function(window, document) {
  'use strict';

  class ElevateForHumanityBrain {
    constructor() {
      this.apiBase = 'https://www.elevateforhumanity.org/api';
      this.widgets = new Map();
      this.initialized = false;
    }

    async init(config = {}) {
      if (this.initialized) return;
      
      this.config = { ...this.getDefaultConfig(), ...config };
      this.initialized = true;
      
      console.log('Elevate for Humanity Brain initialized');
      
      // Auto-discover and load widgets
      await this.autoLoadWidgets();
    }

    getDefaultConfig() {
      return {
        autoLoad: true,
        theme: 'light',
        animationSpeed: 300,
        cacheEnabled: true,
      };
    }

    async loadWidget(name, container) {
      try {
        const response = await fetch(\`\${this.apiBase}/widgets/\${name}\`);
        const data = await response.json();
        
        if (container) {
          this.renderWidget(data, container);
        }
        
        this.widgets.set(name, data);
        return data;
      } catch (error) {
        console.error(\`Failed to load widget \${name}:\`, error);
        return null;
      }
    }

    renderWidget(data, container) {
      switch (data.widget) {
        case 'hero-content':
          this.renderHeroWidget(data, container);
          break;
        case 'program-carousel':
          this.renderProgramCarousel(data, container);
          break;
        case 'success-stories':
          this.renderSuccessStories(data, container);
          break;
        case 'live-feed':
          this.renderLiveFeed(data, container);
          break;
        case 'funding-calculator':
          this.renderFundingCalculator(data, container);
          break;
        default:
          console.warn(\`Unknown widget type: \${data.widget}\`);
      }
    }

    renderHeroWidget(data, container) {
      const { hero } = data;
      container.innerHTML = \`
        <div class="efh-hero-widget">
          <div class="efh-hero-content">
            <h1>\${hero.headline}</h1>
            <p>\${hero.subheadline}</p>
            <a href="\${hero.ctaUrl}" class="efh-cta-button">\${hero.ctaText}</a>
          </div>
          <div class="efh-hero-stats">
            \${hero.stats.map(stat => \`
              <div class="efh-stat">
                <div class="efh-stat-value">\${stat.value}</div>
                <div class="efh-stat-label">\${stat.label}</div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    renderProgramCarousel(data, container) {
      const { programs } = data;
      container.innerHTML = \`
        <div class="efh-program-carousel">
          <h2>Featured Programs</h2>
          <div class="efh-programs-grid">
            \${programs.map(program => \`
              <div class="efh-program-card">
                <h3>\${program.title}</h3>
                <p>\${program.description}</p>
                <div class="efh-program-meta">
                  <span>Duration: \${program.duration}</span>
                  <span>Format: \${program.format}</span>
                  <span>Funding: \${program.funding}</span>
                </div>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    renderSuccessStories(data, container) {
      const { stories } = data;
      container.innerHTML = \`
        <div class="efh-success-stories">
          <h2>Success Stories</h2>
          <div class="efh-stories-grid">
            \${stories.map(story => \`
              <div class="efh-story-card">
                <h3>\${story.name}</h3>
                <p class="efh-program">\${story.program}</p>
                <p class="efh-outcome">\${story.outcome}</p>
                <p class="efh-salary">Salary Increase: \${story.salaryIncrease}</p>
                <blockquote>"\${story.testimonial}"</blockquote>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    renderLiveFeed(data, container) {
      const { feed } = data;
      container.innerHTML = \`
        <div class="efh-live-feed">
          <h2>Live Activity</h2>
          <div class="efh-feed-items">
            \${feed.map(item => \`
              <div class="efh-feed-item efh-feed-\${item.type}">
                <p>\${item.message}</p>
                <small>\${item.location} • \${new Date(item.timestamp).toLocaleTimeString()}</small>
              </div>
            \`).join('')}
          </div>
        </div>
      \`;
    }

    renderFundingCalculator(data, container) {
      const { calculator } = data;
      container.innerHTML = \`
        <div class="efh-funding-calculator">
          <h2>Funding Calculator</h2>
          <div class="efh-calculator-form">
            <select id="efh-program-select">
              \${calculator.programs.map(program => \`
                <option value="\${program.id}" data-cost="\${program.cost}">
                  \${program.name} - $\${program.cost}
                </option>
              \`).join('')}
            </select>
            <div id="efh-funding-options">
              \${calculator.fundingSources.map(source => \`
                <div class="efh-funding-option">
                  <input type="radio" name="funding" value="\${source.id}" id="funding-\${source.id}">
                  <label for="funding-\${source.id}">
                    \${source.name} (\${source.coverage}% coverage)
                    <small>\${source.description}</small>
                  </label>
                </div>
              \`).join('')}
            </div>
            <div id="efh-calculation-result"></div>
          </div>
        </div>
      \`;
      
      this.initCalculatorEvents(container, calculator);
    }

    initCalculatorEvents(container, calculator) {
      const programSelect = container.querySelector('#efh-program-select');
      const fundingOptions = container.querySelectorAll('input[name="funding"]');
      const result = container.querySelector('#efh-calculation-result');

      const calculate = () => {
        const selectedProgram = calculator.programs.find(p => p.id === programSelect.value);
        const selectedFunding = Array.from(fundingOptions).find(radio => radio.checked);
        
        if (selectedProgram && selectedFunding) {
          const fundingSource = calculator.fundingSources.find(s => s.id === selectedFunding.value);
          const coveredAmount = Math.round(selectedProgram.cost * (fundingSource.coverage / 100));
          const outOfPocket = selectedProgram.cost - coveredAmount;
          
          result.innerHTML = \`
            <div class="efh-calculation">
              <h3>Your Funding Breakdown</h3>
              <p>Program Cost: <strong>$\${selectedProgram.cost}</strong></p>
              <p>Funding Coverage (\${fundingSource.coverage}%): <strong>$\${coveredAmount}</strong></p>
              <p>Your Cost: <strong>$\${outOfPocket}</strong></p>
            </div>
          \`;
        }
      };

      programSelect.addEventListener('change', calculate);
      fundingOptions.forEach(radio => radio.addEventListener('change', calculate));
      
      // Auto-calculate with first options
      if (fundingOptions.length > 0) {
        fundingOptions[0].checked = true;
        calculate();
      }
    }

    async autoLoadWidgets() {
      const containers = document.querySelectorAll('[data-efh-widget]');
      
      for (const container of containers) {
        const widgetName = container.dataset.efhWidget;
        await this.loadWidget(widgetName, container);
      }
    }
  }

  // Initialize global instance
  window.ElevateForHumanityBrain = new ElevateForHumanityBrain();

  // Auto-initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.ElevateForHumanityBrain.init();
    });
  } else {
    window.ElevateForHumanityBrain.init();
  }

})(window, document);
`;

    this.integrationScript = {
      content: script,
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      contentType: 'application/javascript',
    };
  }

  getWidget(name: string): Widget | null {
    return this.widgets.get(name) || null;
  }

  getAllWidgets(): Widget[] {
    return Array.from(this.widgets.values());
  }

  getIntegrationScript(): WidgetScript | null {
    return this.integrationScript;
  }

  updateWidget(name: string, updates: Partial<Widget>): Widget | null {
    const existing = this.widgets.get(name);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    this.widgets.set(name, updated);
    return updated;
  }
}

// Singleton widget service instance
export const widgetService = new WidgetService();