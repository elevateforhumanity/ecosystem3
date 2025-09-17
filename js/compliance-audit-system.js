/**
 * Elevate for Humanity - Compliance Audit System
 * Automated scanning and reporting for WIOA/ETPL compliance requirements
 */

class ComplianceAuditSystem {
  constructor() {
    this.auditResults = {
      programs: [],
      sitewide: {},
      summary: {
        totalIssues: 0,
        criticalIssues: 0,
        warningIssues: 0,
        complianceScore: 0
      }
    };
    
    this.requiredFields = {
      program: [
        'etplStatus',
        'performanceData',
        'fundingTypes',
        'tuitionDisplay',
        'credentials',
        'instructorInfo',
        'duration',
        'prerequisites',
        'lastUpdated'
      ],
      sitewide: [
        'equalOpportunityStatement',
        'accessibilityPolicy',
        'privacyPolicy',
        'complaintsPolicy',
        'fundingInformation',
        'wcagCompliance'
      ]
    };
    
    this.complianceRules = {
      // WIOA/ETPL specific rules
      WIOA_FUNDING_DISPLAY: {
        description: 'Programs with WIOA funding must not show tuition amounts',
        severity: 'critical',
        check: (program) => {
          if (program.fundingTypes && program.fundingTypes.includes('WIOA')) {
            return !program.showsTuitionAmount;
          }
          return true;
        }
      },
      
      PERFORMANCE_DATA_REQUIRED: {
        description: 'Established programs must display performance metrics',
        severity: 'critical',
        check: (program) => {
          if (program.isEstablished) {
            return program.hasPerformanceData;
          }
          return true;
        }
      },
      
      ETPL_STATUS_DISPLAY: {
        description: 'All programs must indicate ETPL/INTraining status',
        severity: 'critical',
        check: (program) => program.hasEtplStatus
      },
      
      INSTRUCTOR_CREDENTIALS: {
        description: 'Programs must list instructor qualifications',
        severity: 'warning',
        check: (program) => program.hasInstructorInfo
      },
      
      CREDENTIAL_INFORMATION: {
        description: 'Programs must specify credentials awarded',
        severity: 'critical',
        check: (program) => program.hasCredentialInfo
      },
      
      LAST_UPDATED_DATE: {
        description: 'Performance data must show last updated date',
        severity: 'warning',
        check: (program) => program.hasLastUpdated
      }
    };
  }

  // Main audit function
  async runCompleteAudit() {
    console.log('🔍 Starting Compliance Audit for Elevate for Humanity...');
    
    // Audit individual programs
    await this.auditPrograms();
    
    // Audit sitewide compliance
    await this.auditSitewideCompliance();
    
    // Generate compliance score
    this.calculateComplianceScore();
    
    // Generate report
    return this.generateAuditReport();
  }

  // Audit all program pages
  async auditPrograms() {
    const programPages = this.findProgramPages();
    
    for (const page of programPages) {
      const programAudit = await this.auditSingleProgram(page);
      this.auditResults.programs.push(programAudit);
    }
  }

  // Find all program pages on the site
  findProgramPages() {
    const programPages = [];
    
    // Check for program cards on main programs page
    const programCards = document.querySelectorAll('.program-card, [data-program-id]');
    programCards.forEach(card => {
      programPages.push({
        element: card,
        id: card.dataset.programId || card.querySelector('h3, h2')?.textContent,
        url: window.location.href
      });
    });
    
    // Check for individual program pages
    if (window.location.pathname.includes('/programs/')) {
      programPages.push({
        element: document.body,
        id: this.extractProgramIdFromUrl(),
        url: window.location.href
      });
    }
    
    return programPages;
  }

  // Audit a single program for compliance
  async auditSingleProgram(programPage) {
    const audit = {
      id: programPage.id,
      url: programPage.url,
      issues: [],
      warnings: [],
      compliant: [],
      data: this.extractProgramData(programPage.element)
    };

    // Check each compliance rule
    for (const [ruleId, rule] of Object.entries(this.complianceRules)) {
      const isCompliant = rule.check(audit.data);
      
      if (!isCompliant) {
        const issue = {
          rule: ruleId,
          description: rule.description,
          severity: rule.severity,
          element: programPage.element,
          recommendation: this.getRecommendation(ruleId)
        };
        
        if (rule.severity === 'critical') {
          audit.issues.push(issue);
          this.auditResults.summary.criticalIssues++;
        } else {
          audit.warnings.push(issue);
          this.auditResults.summary.warningIssues++;
        }
        
        this.auditResults.summary.totalIssues++;
      } else {
        audit.compliant.push(ruleId);
      }
    }

    return audit;
  }

  // Extract program data from DOM element
  extractProgramData(element) {
    return {
      title: this.extractText(element, 'h1, h2, h3, .program-title'),
      fundingTypes: this.extractFundingTypes(element),
      showsTuitionAmount: this.checkTuitionDisplay(element),
      hasPerformanceData: this.checkPerformanceData(element),
      hasEtplStatus: this.checkEtplStatus(element),
      hasInstructorInfo: this.checkInstructorInfo(element),
      hasCredentialInfo: this.checkCredentialInfo(element),
      hasLastUpdated: this.checkLastUpdated(element),
      isEstablished: this.checkIfEstablished(element),
      duration: this.extractText(element, '.duration, [data-duration]'),
      prerequisites: this.extractText(element, '.prerequisites, .prereqs')
    };
  }

  // Helper functions for data extraction
  extractText(element, selector) {
    const found = element.querySelector(selector);
    return found ? found.textContent.trim() : null;
  }

  extractFundingTypes(element) {
    const fundingElement = element.querySelector('[data-funding], .funding-types, .funding-badge');
    if (!fundingElement) return [];
    
    const fundingText = fundingElement.textContent || fundingElement.dataset.funding || '';
    const types = [];
    
    if (fundingText.includes('WIOA')) types.push('WIOA');
    if (fundingText.includes('WRG')) types.push('WRG');
    if (fundingText.includes('Apprenticeship')) types.push('APPRENTICESHIP');
    if (fundingText.includes('Self-Pay')) types.push('SELF_PAY');
    
    return types;
  }

  checkTuitionDisplay(element) {
    const tuitionElements = element.querySelectorAll('.tuition, .cost, .price, [data-tuition]');
    for (const el of tuitionElements) {
      if (el.textContent.match(/\$\d+/)) {
        return true;
      }
    }
    return false;
  }

  checkPerformanceData(element) {
    const performanceIndicators = [
      '.performance', '.outcomes', '.employment-rate', '.completion-rate',
      '.median-earnings', '.credential-rate', '[data-performance]'
    ];
    
    return performanceIndicators.some(selector => element.querySelector(selector));
  }

  checkEtplStatus(element) {
    const etplIndicators = [
      '.etpl-status', '.intraining-status', '[data-etpl]'
    ];
    
    const hasIndicator = etplIndicators.some(selector => element.querySelector(selector));
    const hasTextMention = element.textContent.toLowerCase().includes('etpl') || 
                          element.textContent.toLowerCase().includes('intraining');
    
    return hasIndicator || hasTextMention;
  }

  checkInstructorInfo(element) {
    const instructorIndicators = [
      '.instructor', '.faculty', '.instructor-bio', '.instructor-info'
    ];
    
    return instructorIndicators.some(selector => element.querySelector(selector));
  }

  checkCredentialInfo(element) {
    const credentialIndicators = [
      '.credential', '.certification', '.certificate', '.credential-info'
    ];
    
    const hasIndicator = credentialIndicators.some(selector => element.querySelector(selector));
    const hasTextMention = element.textContent.toLowerCase().includes('certification') ||
                          element.textContent.toLowerCase().includes('credential');
    
    return hasIndicator || hasTextMention;
  }

  checkLastUpdated(element) {
    const updateIndicators = [
      '.last-updated', '.updated', '[data-updated]', '.date-updated'
    ];
    
    return updateIndicators.some(selector => element.querySelector(selector));
  }

  checkIfEstablished(element) {
    // Assume program is established if no "new program" indicators
    const newProgramIndicators = [
      '.new-program', '.initial-eligibility', '[data-new]'
    ];
    
    return !newProgramIndicators.some(selector => element.querySelector(selector));
  }

  // Audit sitewide compliance requirements
  async auditSitewideCompliance() {
    this.auditResults.sitewide = {
      equalOpportunityStatement: this.checkEqualOpportunity(),
      accessibilityPolicy: this.checkAccessibilityPolicy(),
      privacyPolicy: this.checkPrivacyPolicy(),
      complaintsPolicy: this.checkComplaintsPolicy(),
      fundingInformation: this.checkFundingInformation(),
      wcagCompliance: this.checkWcagCompliance()
    };
  }

  // Sitewide compliance checks
  checkEqualOpportunity() {
    const indicators = ['equal opportunity', 'non-discrimination', 'civil rights'];
    return this.checkForContent(indicators);
  }

  checkAccessibilityPolicy() {
    const indicators = ['accessibility', 'accommodation', 'disability'];
    return this.checkForContent(indicators);
  }

  checkPrivacyPolicy() {
    const indicators = ['privacy policy', 'data protection', 'student data'];
    return this.checkForContent(indicators);
  }

  checkComplaintsPolicy() {
    const indicators = ['complaint', 'grievance', 'appeal'];
    return this.checkForContent(indicators);
  }

  checkFundingInformation() {
    const indicators = ['funding', 'wioa', 'financial aid'];
    return this.checkForContent(indicators);
  }

  checkWcagCompliance() {
    const issues = [];
    
    // Check for alt text on images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.alt) {
        issues.push('Missing alt text on image');
      }
    });
    
    // Check for proper heading structure
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      issues.push('No heading structure found');
    }
    
    // Check for form labels
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (!input.labels || input.labels.length === 0) {
        issues.push('Form input missing label');
      }
    });
    
    return {
      compliant: issues.length === 0,
      issues: issues
    };
  }

  checkForContent(indicators) {
    const bodyText = document.body.textContent.toLowerCase();
    return indicators.some(indicator => bodyText.includes(indicator));
  }

  // Calculate overall compliance score
  calculateComplianceScore() {
    const totalChecks = this.auditResults.programs.length * Object.keys(this.complianceRules).length;
    const passedChecks = totalChecks - this.auditResults.summary.totalIssues;
    
    this.auditResults.summary.complianceScore = totalChecks > 0 ? 
      Math.round((passedChecks / totalChecks) * 100) : 0;
  }

  // Generate recommendations for specific rule violations
  getRecommendation(ruleId) {
    const recommendations = {
      WIOA_FUNDING_DISPLAY: 'Remove tuition amounts for WIOA-funded programs. Display "Fully Funded for Eligible Students" instead.',
      PERFORMANCE_DATA_REQUIRED: 'Add performance metrics: employment rates (Q2, Q4), median earnings, completion rates, credential attainment.',
      ETPL_STATUS_DISPLAY: 'Add ETPL/INTraining status indicator to program description.',
      INSTRUCTOR_CREDENTIALS: 'Add instructor bios with qualifications, experience, and credentials.',
      CREDENTIAL_INFORMATION: 'Specify what credentials/certifications students will earn and the awarding body.',
      LAST_UPDATED_DATE: 'Add "Last updated: [date]" to performance data sections.'
    };
    
    return recommendations[ruleId] || 'Review compliance requirements for this item.';
  }

  // Generate comprehensive audit report
  generateAuditReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: this.auditResults.summary,
      programs: this.auditResults.programs,
      sitewide: this.auditResults.sitewide,
      recommendations: this.generatePriorityRecommendations()
    };

    // Display report in console for development
    this.displayConsoleReport(report);
    
    return report;
  }

  generatePriorityRecommendations() {
    const recommendations = [];
    
    // Critical issues first
    this.auditResults.programs.forEach(program => {
      program.issues.forEach(issue => {
        if (issue.severity === 'critical') {
          recommendations.push({
            priority: 'HIGH',
            program: program.id,
            issue: issue.description,
            action: issue.recommendation
          });
        }
      });
    });
    
    // Sitewide issues
    Object.entries(this.auditResults.sitewide).forEach(([key, value]) => {
      if (!value || (typeof value === 'object' && !value.compliant)) {
        recommendations.push({
          priority: 'HIGH',
          program: 'SITEWIDE',
          issue: `Missing ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`,
          action: `Create and publish ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} page/section`
        });
      }
    });
    
    return recommendations;
  }

  displayConsoleReport(report) {
    console.log('📊 COMPLIANCE AUDIT REPORT');
    console.log('==========================');
    console.log(`Compliance Score: ${report.summary.complianceScore}%`);
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`Warning Issues: ${report.summary.warningIssues}`);
    console.log('');
    
    if (report.recommendations.length > 0) {
      console.log('🚨 PRIORITY RECOMMENDATIONS:');
      report.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. [${rec.priority}] ${rec.program}: ${rec.issue}`);
        console.log(`   Action: ${rec.action}`);
      });
    }
    
    console.log('');
    console.log('📋 Full report available in returned object');
  }

  // Utility function to extract program ID from URL
  extractProgramIdFromUrl() {
    const path = window.location.pathname;
    const segments = path.split('/');
    return segments[segments.length - 1] || 'unknown';
  }
}

// Auto-run audit when script loads (for development/testing)
if (typeof window !== 'undefined') {
  window.ComplianceAuditSystem = ComplianceAuditSystem;
  
  // Add audit button to page for manual testing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addAuditButton);
  } else {
    addAuditButton();
  }
}

function addAuditButton() {
  const button = document.createElement('button');
  button.textContent = '🔍 Run Compliance Audit';
  button.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    background: #dc3545;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
  `;
  
  button.onclick = async () => {
    const auditor = new ComplianceAuditSystem();
    const report = await auditor.runCompleteAudit();
    
    // Create downloadable report
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  document.body.appendChild(button);
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComplianceAuditSystem;
}