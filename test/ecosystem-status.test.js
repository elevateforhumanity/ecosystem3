import { test, expect, describe } from 'vitest';
import EcosystemStatusChecker from '../ecosystem-status-checker.js';

describe('Ecosystem Status Dashboard', () => {
  test('should perform comprehensive system health checks', async () => {
    const statusChecker = new EcosystemStatusChecker();
    const result = await statusChecker.runAllChecks();
    
    // Verify structure
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('overallHealth');
    expect(result).toHaveProperty('sections');
    expect(result).toHaveProperty('summary');
    
    // Verify sections
    expect(result.sections).toHaveLength(6);
    
    const sectionNames = result.sections.map(s => s.name);
    expect(sectionNames).toContain('Core Infrastructure');
    expect(sectionNames).toContain('Sister Sites');
    expect(sectionNames).toContain('Payment System');
    expect(sectionNames).toContain('Learning Management');
    expect(sectionNames).toContain('Testing & Quality');
    expect(sectionNames).toContain('Deployment Readiness');
  });

  test('should verify core infrastructure files exist', async () => {
    const statusChecker = new EcosystemStatusChecker();
    const result = await statusChecker.runAllChecks();
    
    const coreInfra = result.sections.find(s => s.name === 'Core Infrastructure');
    
    expect(coreInfra.checks.packageJson.status).toBe('working');
    expect(coreInfra.checks.buildScript.status).toBe('working');
    expect(coreInfra.checks.startScript.status).toBe('working');
  });

  test('should verify sister sites are present', async () => {
    const statusChecker = new EcosystemStatusChecker();
    const result = await statusChecker.runAllChecks();
    
    const sisterSites = result.sections.find(s => s.name === 'Sister Sites');
    
    expect(sisterSites.checks.indexSite.status).toBe('working');
    expect(sisterSites.checks.programsSite.status).toBe('working');
    expect(sisterSites.checks.lmsSite.status).toBe('working');
    expect(sisterSites.checks.connectSite.status).toBe('working');
  });

  test('should calculate overall health percentage', async () => {
    const statusChecker = new EcosystemStatusChecker();
    const result = await statusChecker.runAllChecks();
    
    expect(result.overallHealth.percentage).toBeGreaterThan(0);
    expect(result.overallHealth.percentage).toBeLessThanOrEqual(100);
    expect(result.overallHealth.totalChecks).toBeGreaterThan(0);
    expect(result.overallHealth.workingChecks).toBeGreaterThanOrEqual(0);
    expect(result.overallHealth.errorChecks).toBeGreaterThanOrEqual(0);
    expect(result.overallHealth.warningChecks).toBeGreaterThanOrEqual(0);
  });

  test('should provide production readiness assessment', async () => {
    const statusChecker = new EcosystemStatusChecker();
    const result = await statusChecker.runAllChecks();
    
    expect(result.summary).toHaveProperty('readyForProduction');
    expect(result.summary).toHaveProperty('majorIssues');
    expect(result.summary).toHaveProperty('nextSteps');
    expect(result.summary).toHaveProperty('recommendations');
  });

  test('should answer "where are we at now" comprehensively', async () => {
    const statusChecker = new EcosystemStatusChecker();
    const result = await statusChecker.runAllChecks();
    
    // Should provide timestamp for "now"
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp)).toBeInstanceOf(Date);
    
    // Should assess current state of all major components
    const componentsCovered = result.sections.map(s => s.name);
    expect(componentsCovered).toEqual([
      'Core Infrastructure',
      'Sister Sites', 
      'Payment System',
      'Learning Management',
      'Testing & Quality',
      'Deployment Readiness'
    ]);
    
    // Should provide actionable insights
    expect(result.summary.nextSteps).toBeInstanceOf(Array);
    expect(result.summary.recommendations).toBeInstanceOf(Array);
    
    // Should give clear production readiness answer
    expect(typeof result.summary.readyForProduction).toBe('boolean');
  });
});