# Approval System Integration

This document describes the case manager approval system that has been integrated into the EFH ecosystem.

## Overview

The approval system allows students to request enrollment approval from case managers through a secure token-based workflow. This system has been integrated into the main server (`simple-server.cjs`) and provides both API endpoints and web interfaces for managing approvals.

## What Was Fixed

The problem was that the approval routes (`pay-approval-routes.js` and `pay-admin-approval-routes.js`) existed as ES modules but were not integrated into the main CommonJS server. The system could not "proceed" because:

1. **Routes Not Integrated**: The approval routes were defined but not registered with the main Express app
2. **Module Format Mismatch**: The routes were ES modules while the main server uses CommonJS
3. **Missing Dependencies**: The `jsonwebtoken` package was not installed
4. **No Integration Layer**: There was no bridge between the approval modules and the main server

## Solution Implemented

1. **Added Dependencies**: Installed `jsonwebtoken` package
2. **Created Integration Module**: Created `approval-integration.js` as a CommonJS module that:
   - Converts the ES module approval routes to CommonJS
   - Provides graceful fallbacks when Supabase is not configured
   - Implements all approval endpoints and logic
3. **Integrated with Main Server**: Modified `simple-server.cjs` to register the approval routes
4. **Added Error Handling**: System continues to work even if approval system fails to initialize

## Endpoints Provided

### API Endpoints

- `POST /api/approvals/request` - Submit a new approval request
- `GET /api/approvals/list` - List all approval requests (with filtering)
- `GET /api/approvals/stats` - Get approval statistics
- `POST /api/approvals/admin_decide` - Admin manual approval/decline

### Public Endpoints

- `GET /approvals/accept?token=<jwt>` - Approve enrollment via email link
- `GET /approvals/decline?token=<jwt>` - Decline enrollment via email link

## Configuration

The system requires these environment variables:

```bash
# Required for approval system to function
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT signing (uses JWT_SECRET as fallback)
APPROVAL_SECRET=your-approval-secret

# Base URL for email links (optional)
APPROVAL_BASE_URL=https://your-domain.com/approvals
```

If these are not configured, the system will:
- Show warnings in logs
- Return appropriate error messages to API calls
- Continue running without crashing the main server

## Usage Examples

### Request Approval
```javascript
POST /api/approvals/request
{
  "student_email": "student@example.com",
  "program_slug": "advanced-training",
  "case_manager_email": "manager@example.com",
  "voucher_id": "VOUCHER123",
  "funding_source": "scholarship"
}
```

### Admin Approval
```javascript
POST /api/approvals/admin_decide
{
  "id": "approval-record-id",
  "decision": "approved"
}
```

### Email Workflow
1. Student submits approval request
2. Case manager receives email with approve/decline links
3. Case manager clicks link to make decision
4. System automatically processes the decision and activates enrollment if approved

## Database Tables

The system expects these Supabase tables:
- `case_manager_approvals` - Stores approval requests and decisions
- `app_users` - User records
- `enrollments` - Course enrollments
- `notes` - Audit trail and funding notes

## Security Features

- JWT tokens with 72-hour expiration
- Token hashing for secure storage
- One-time use tokens (marked as used after decision)
- Admin authentication for manual decisions
- Rate limiting through main server

## Testing

Run the approval integration tests:
```bash
npm test test/approval-integration.test.js
```

## Troubleshooting

### System Not Working
- Check Supabase credentials are configured
- Verify JWT_SECRET or APPROVAL_SECRET is set
- Check server logs for integration warnings

### Email Links Not Working
- Verify APPROVAL_BASE_URL matches your domain
- Check token expiration (72 hours)
- Ensure tokens haven't been used already

### Database Errors
- Run Supabase migrations for required tables
- Check service role key permissions
- Verify table schemas match expected format

## Integration Status

✅ **COMPLETED**: The approval system can now "proceed" successfully!

- Routes are integrated into main server
- All endpoints are functional
- Error handling is robust
- System degrades gracefully without configuration
- Full workflow is operational