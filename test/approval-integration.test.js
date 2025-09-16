/**
 * Test the approval system integration
 * This test verifies that the approval routes are properly integrated into the main server
 */

import { describe, test, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';

describe('Approval System Integration', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    
    // Mock environment to avoid Supabase dependency
    process.env.SUPABASE_URL = 'http://mock-supabase.com';
    process.env.SUPABASE_SERVICE_KEY = 'mock-service-key';
    process.env.APPROVAL_SECRET = 'test-secret';
    process.env.APPROVAL_BASE_URL = 'http://localhost:5000/approvals';
    
    // Import as CommonJS module
    const { registerApprovalRoutes } = require('../approval-integration');
    registerApprovalRoutes(app);
  });

  test('should register approval routes without errors', () => {
    expect(app._router).toBeDefined();
  });

  test('should have approval request endpoint', async () => {
    const response = await request(app)
      .post('/api/approvals/request')
      .send({
        student_email: 'test@example.com',
        program_slug: 'test-program',
        case_manager_email: 'manager@example.com'
      });
    
    // Should not return 404 (route exists) - may return 500 due to mock Supabase
    expect(response.status).not.toBe(404);
  });

  test('should have approval stats endpoint', async () => {
    const response = await request(app)
      .get('/api/approvals/stats');
    
    // Should not return 404 (route exists)
    expect(response.status).not.toBe(404);
  });

  test('should have approval list endpoint', async () => {
    const response = await request(app)
      .get('/api/approvals/list');
    
    // Should not return 404 (route exists)
    expect(response.status).not.toBe(404);
  });

  test('should have admin decision endpoint', async () => {
    const response = await request(app)
      .post('/api/approvals/admin_decide')
      .send({
        id: 'test-id',
        decision: 'approved'
      });
    
    // Should not return 404 (route exists)
    expect(response.status).not.toBe(404);
  });

  test('should have public approval endpoints', async () => {
    const acceptResponse = await request(app)
      .get('/approvals/accept?token=invalid-token');
    
    const declineResponse = await request(app)
      .get('/approvals/decline?token=invalid-token');
    
    // Should not return 404 (routes exist)
    expect(acceptResponse.status).not.toBe(404);
    expect(declineResponse.status).not.toBe(404);
  });
});