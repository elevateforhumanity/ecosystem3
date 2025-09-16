import { describe, test, expect } from 'vitest';

describe('Medical Assistant Program Integration', () => {
  test('should have correct program structure matching problem statement', () => {
    // Load the program data
    const fs = require('fs');
    const allPrograms = JSON.parse(fs.readFileSync('config/all-programs.json', 'utf8'));
    const program = allPrograms.find(p => p.slug === 'medical-assistant');
    
    expect(program).toBeDefined();
    
    // Verify it matches the structure from the problem statement
    const expectedStructure = {
      path: "/programs/medical-assistant",
      title: "Medical Assistant Program (WIOA/WRG Eligible)",
      description: "Train for high-demand medical assistant roles. Evening & weekend cohorts. Tuition covered for eligible students.",
      hours: 750,
      tuition: 8000,
      funding: ["WIOA","WRG","JRI"],
      cip: "51.0801",
      onet: "31-9092.00",
      nextStartDate: "2025-10-15",
      priority: 0.8,
      changefreq: "weekly"
    };
    
    // Map our program structure to the expected structure
    expect(program.name).toBe(expectedStructure.title);
    expect(program.description).toBe(expectedStructure.description);
    expect(program.hours).toBe(expectedStructure.hours);
    expect(program.base_price).toBe(expectedStructure.tuition);
    expect(program.funding).toEqual(expectedStructure.funding);
    expect(program.cip).toBe(expectedStructure.cip);
    expect(program.onet).toBe(expectedStructure.onet);
    expect(program.nextStartDate).toBe(expectedStructure.nextStartDate);
    expect(program.priority).toBe(expectedStructure.priority);
    expect(program.changefreq).toBe(expectedStructure.changefreq);
    
    // The path should be handled by the route we created
    expect(program.slug).toBe('medical-assistant'); // This maps to /programs/medical-assistant
  });

  test('should be included in sitemap with correct attributes', () => {
    const fs = require('fs');
    
    // Check that sitemaps exist and contain the program
    expect(fs.existsSync('sitemaps/stable.xml')).toBe(true);
    expect(fs.existsSync('sitemaps/marketing.xml')).toBe(true);
    
    const stableSitemap = fs.readFileSync('sitemaps/stable.xml', 'utf8');
    const marketingSitemap = fs.readFileSync('sitemaps/marketing.xml', 'utf8');
    
    // Verify the medical assistant program is in both sitemaps
    expect(stableSitemap).toContain('/programs/medical-assistant');
    expect(marketingSitemap).toContain('/programs/medical-assistant');
    
    // Verify the changefreq is set to weekly as specified
    expect(stableSitemap).toContain('<changefreq>weekly</changefreq>');
    expect(marketingSitemap).toContain('<changefreq>weekly</changefreq>');
  });

  test('should have proper partner association with Indiana Health Association', () => {
    const fs = require('fs');
    const allPrograms = JSON.parse(fs.readFileSync('config/all-programs.json', 'utf8'));
    const partners = JSON.parse(fs.readFileSync('config/partners.json', 'utf8'));
    
    const program = allPrograms.find(p => p.slug === 'medical-assistant');
    const partner = partners.find(p => p.name === 'Indiana Hospital Association');
    
    expect(program.partner).toBe('indiana-health-association');
    expect(partner).toBeDefined();
    expect(partner.description).toContain('medical assistant');
  });

  test('should be properly configured for state funding', () => {
    const fs = require('fs');
    const allPrograms = JSON.parse(fs.readFileSync('config/all-programs.json', 'utf8'));
    const healthPrograms = JSON.parse(fs.readFileSync('config/health-programs.json', 'utf8'));
    
    const allProgram = allPrograms.find(p => p.slug === 'medical-assistant');
    const healthProgram = healthPrograms.find(p => p.slug === 'medical-assistant');
    
    // Should be in both files
    expect(allProgram).toBeDefined();
    expect(healthProgram).toBeDefined();
    
    // Should be configured for state funding
    expect(allProgram.track).toBe('state-funded');
    expect(allProgram.state_funded).toBe(true);
    expect(allProgram.wioa_eligible).toBe(true);
    
    expect(healthProgram.track).toBe('state-funded');
    expect(healthProgram.funding).toEqual(['WIOA', 'WRG', 'JRI']);
  });
});