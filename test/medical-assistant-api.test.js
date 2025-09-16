import { describe, test, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';

// Create a simple test server for route testing
const app = express();

// Mock the route logic from simple-server.cjs
app.get('/api/programs/:slug', (req, res) => {
  const programSlug = req.params.slug;
  
  try {
    // Load all programs from config files
    const allPrograms = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/all-programs.json'), 'utf8'));
    const healthPrograms = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'config/health-programs.json'), 'utf8'));
    
    // Find the program in either file
    let program = allPrograms.find(p => p.slug === programSlug);
    if (!program) {
      program = healthPrograms.find(p => p.slug === programSlug);
    }
    
    if (program) {
      res.json(program);
    } else {
      res.status(404).json({ error: 'Program not found' });
    }
  } catch (e) {
    console.error('Error loading program data:', e);
    res.status(500).json({ error: 'Internal server error' });
  }
});

describe('Medical Assistant Program API', () => {
  test('should return medical assistant program data via API', async () => {
    const response = await request(app)
      .get('/api/programs/medical-assistant')
      .expect(200);
    
    expect(response.body).toBeDefined();
    expect(response.body.slug).toBe('medical-assistant');
    expect(response.body.name).toBe('Medical Assistant Program (WIOA/WRG Eligible)');
    expect(response.body.category).toBe('healthcare');
    expect(response.body.hours).toBe(750);
    expect(response.body.cip).toBe('51.0801');
    expect(response.body.onet).toBe('31-9092.00');
  });

  test('should return 404 for non-existent program', async () => {
    const response = await request(app)
      .get('/api/programs/non-existent-program')
      .expect(404);
    
    expect(response.body.error).toBe('Program not found');
  });

  test('should have all required fields for medical assistant program', async () => {
    const response = await request(app)
      .get('/api/programs/medical-assistant')
      .expect(200);
    
    const program = response.body;
    
    // Verify all required fields from the problem statement are present
    expect(program).toHaveProperty('hours', 750);
    expect(program).toHaveProperty('base_price', 8000);
    expect(program).toHaveProperty('funding');
    expect(program.funding).toEqual(['WIOA', 'WRG', 'JRI']);
    expect(program).toHaveProperty('cip', '51.0801');
    expect(program).toHaveProperty('onet', '31-9092.00');
    expect(program).toHaveProperty('nextStartDate', '2025-10-15');
    expect(program).toHaveProperty('priority', 0.8);
    expect(program).toHaveProperty('changefreq', 'weekly');
    expect(program).toHaveProperty('description');
    expect(program.description).toContain('Train for high-demand medical assistant roles');
  });
});