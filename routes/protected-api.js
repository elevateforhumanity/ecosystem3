
// Protected API routes for sensitive operations
const express = require('express');
const security = require('../lib/security');
const router = express.Router();

// Apply security middleware to all protected routes
router.use(security.createRateLimit());
router.use(security.requireAuth.bind(security));

// Student records (PII protected)
router.get('/students/:id', (req, res) => {
  try {
    // Mock student data - replace with actual database call
    const studentData = {
      id: req.params.id,
      name: 'John Doe',
      email: 'john@example.com',
      ssn: '123-45-6789',
      dob: '1990-01-01',
      enrollment_status: 'active',
      program: 'electrical-apprenticeship',
      progress: 75,
      certifications: ['OSHA 10', 'Basic Electrical']
    };

    const protectedData = security.handleProtectedData(studentData, req.user.role);
    res.json(protectedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student data' });
  }
});

// Financial records (admin only)
router.get('/financial/revenue', security.requireAdmin.bind(security), (req, res) => {
  try {
    const financialData = {
      total_revenue: 125000,
      monthly_revenue: 42000,
      partner_splits: {
        'ibew-local-481': 21000,
        'sheet-metal-workers': 18500,
        'beauty-professionals': 15200
      },
      pending_payments: 8500,
      compliance_funds: 62000
    };

    res.json(financialData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch financial data' });
  }
});

// DOL/DWD compliance data (admin only)
router.get('/compliance/reports', security.requireAdmin.bind(security), (req, res) => {
  try {
    const complianceData = {
      wioa_participants: 847,
      dol_reporting_status: 'current',
      audit_trail: [
        { date: '2024-01-15', action: 'Monthly report submitted', officer: 'admin@efh.com' },
        { date: '2024-01-10', action: 'Enrollment verification', officer: 'compliance@efh.com' }
      ],
      federal_funding: {
        allocated: 250000,
        spent: 187500,
        remaining: 62500
      }
    };

    res.json(complianceData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance data' });
  }
});

// Partner financial data (partner access only)
router.get('/partners/:partnerId/financials', (req, res) => {
  try {
    const partnerId = req.params.partnerId;
    
    // Verify user has access to this partner data
    if (req.user.role !== 'admin' && req.user.partner_id !== partnerId) {
      return res.status(403).json({ error: 'Access denied to partner data' });
    }

    const partnerFinancials = {
      partner_id: partnerId,
      revenue_share: 25000,
      students_enrolled: 156,
      completion_rate: 0.87,
      next_payout: '2024-02-01',
      ytd_earnings: 125000
    };

    res.json(partnerFinancials);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch partner financials' });
  }
});

// Secure document upload
router.post('/documents/upload', (req, res) => {
  try {
    // Validate file type and size
    const allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    // Mock upload - implement actual file handling
    const uploadResult = {
      file_id: security.encrypt(`doc_${Date.now()}`),
      uploaded_by: req.user.id,
      upload_time: new Date().toISOString(),
      status: 'encrypted_and_stored'
    };

    res.json(uploadResult);
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Audit log access (admin only)
router.get('/audit/logs', security.requireAdmin.bind(security), (req, res) => {
  try {
    const auditLogs = [
      { timestamp: '2024-01-15T10:30:00Z', user: 'admin@efh.com', action: 'viewed_student_data', resource: 'student_123' },
      { timestamp: '2024-01-15T09:15:00Z', user: 'partner@ibew.com', action: 'accessed_financials', resource: 'partner_data' },
      { timestamp: '2024-01-14T16:45:00Z', user: 'compliance@efh.com', action: 'generated_dol_report', resource: 'compliance_report' }
    ];

    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

module.exports = router;
