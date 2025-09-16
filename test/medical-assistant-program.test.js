import { describe, test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Medical Assistant Program', () => {
  test('should be present in all-programs.json', () => {
    const allPrograms = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/all-programs.json'), 'utf8'));
    
    const medicalAssistantProgram = allPrograms.find(program => program.slug === 'medical-assistant');
    
    expect(medicalAssistantProgram).toBeDefined();
    expect(medicalAssistantProgram.name).toBe('Medical Assistant Program (WIOA/WRG Eligible)');
    expect(medicalAssistantProgram.category).toBe('healthcare');
    expect(medicalAssistantProgram.hours).toBe(750);
    expect(medicalAssistantProgram.base_price).toBe(8000);
    expect(medicalAssistantProgram.funding).toEqual(['WIOA', 'WRG', 'JRI']);
    expect(medicalAssistantProgram.cip).toBe('51.0801');
    expect(medicalAssistantProgram.onet).toBe('31-9092.00');
    expect(medicalAssistantProgram.nextStartDate).toBe('2025-10-15');
    expect(medicalAssistantProgram.priority).toBe(0.8);
    expect(medicalAssistantProgram.changefreq).toBe('weekly');
  });

  test('should be present in health-programs.json', () => {
    const healthPrograms = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/health-programs.json'), 'utf8'));
    
    const medicalAssistantProgram = healthPrograms.find(program => program.slug === 'medical-assistant');
    
    expect(medicalAssistantProgram).toBeDefined();
    expect(medicalAssistantProgram.name).toBe('Medical Assistant Program (WIOA/WRG Eligible)');
    expect(medicalAssistantProgram.track).toBe('state-funded');
    expect(medicalAssistantProgram.hours).toBe(750);
    expect(medicalAssistantProgram.tuition).toBe(8000);
    expect(medicalAssistantProgram.funding).toEqual(['WIOA', 'WRG', 'JRI']);
    expect(medicalAssistantProgram.cip).toBe('51.0801');
    expect(medicalAssistantProgram.onet).toBe('31-9092.00');
  });

  test('should have proper partner assignment', () => {
    const allPrograms = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/all-programs.json'), 'utf8'));
    
    const medicalAssistantProgram = allPrograms.find(program => program.slug === 'medical-assistant');
    
    expect(medicalAssistantProgram.partner).toBe('indiana-health-association');
    expect(medicalAssistantProgram.partner_connect_acc).toBe('acct_iha_partner');
  });

  test('should have proper funding and eligibility flags', () => {
    const allPrograms = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/all-programs.json'), 'utf8'));
    
    const medicalAssistantProgram = allPrograms.find(program => program.slug === 'medical-assistant');
    
    expect(medicalAssistantProgram.state_funded).toBe(true);
    expect(medicalAssistantProgram.wioa_eligible).toBe(true);
    expect(medicalAssistantProgram.track).toBe('state-funded');
  });
});