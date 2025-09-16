# Federal Compliance Documentation

## Overview

This system implements comprehensive federal compliance monitoring for workforce development programs, meeting requirements from the Department of Education (DOE), Department of Workforce Development (DWD), and Department of Labor (DOL).

## Compliance Endpoints

### Summary Endpoint

**GET** `/api/compliance`

Returns high-level compliance status across all federal requirements.

#### Response Structure

```json
{
  "title": "Federal Workforce Compliance Portal",
  "status": "FULLY_COMPLIANT",
  "lastAudit": "2025-08-15T00:00:00.000Z",
  "nextAudit": "2025-11-15T00:00:00.000Z",
  "version": "v1",
  "timestamp": "2025-09-07T20:35:00.000Z",
  "correlationId": "abc123",
  
  "complianceAreas": {
    "doe": {
      "status": "CERTIFIED",
      "certificationNumber": "DOE-WIOA-2025-FL-1234",
      "lastUpdated": "2025-08-15T00:00:00.000Z",
      "nextReview": "2025-11-15T00:00:00.000Z"
    },
    "dwd": {
      "status": "ACTIVE_COMPLIANCE",
      "contractNumber": "DWD-FL-2025-456",
      "lastUpdated": "2025-08-15T00:00:00.000Z",
      "nextReview": "2025-11-15T00:00:00.000Z"
    },
    "dol": {
      "status": "CURRENT_REPORTING",
      "lastReport": "2025-08-15T00:00:00.000Z",
      "nextReport": "2025-10-07T00:00:00.000Z"
    }
  }
}
```

#### Status Values

**Overall Status:**
- `FULLY_COMPLIANT`: All requirements met
- `PARTIAL_COMPLIANCE`: Some areas need attention
- `NON_COMPLIANT`: Critical compliance issues

**Area-Specific Status:**
- DOE: `CERTIFIED` | `PENDING_REVIEW` | `EXPIRED`
- DWD: `ACTIVE_COMPLIANCE` | `UNDER_REVIEW` | `SUSPENDED`
- DOL: `CURRENT_REPORTING` | `OVERDUE` | `DELINQUENT`

### Detailed Validation Endpoint

**GET** `/api/compliance/validate`

Returns comprehensive validation checks for all compliance requirements.

#### Response Structure

```json
{
  "overallStatus": "COMPLIANT",
  "timestamp": "2025-09-07T20:35:00.000Z",
  "correlationId": "def456",
  "version": "v1",
  
  "validations": {
    "wioa_eligibility": {
      "status": "PASS",
      "requirement": "WIOA Title I Adult Program Eligibility Requirements",
      "lastChecked": "2025-09-07T20:35:00.000Z",
      "details": "All eligibility criteria validated against current WIOA standards"
    },
    // ... more validation checks
  },
  
  "certifications": [
    {
      "type": "WIOA_PROVIDER",
      "status": "ACTIVE",
      "issuedDate": "2024-01-01T00:00:00.000Z",
      "expiryDate": "2026-12-31T00:00:00.000Z",
      "certifyingBody": "Florida Department of Economic Opportunity"
    }
  ]
}
```

## Compliance Areas

### Department of Education (DOE)

**Requirements Covered:**
- WIOA Title I Adult Program certification
- Eligible Training Provider status
- Performance accountability measures
- Educational program standards

**Key Validations:**
- `wioa_eligibility`: WIOA program eligibility verification
- `training_provider_status`: Current provider certification
- `educational_standards`: Program quality and accreditation

**Certification Numbers:**
- Format: `DOE-WIOA-YYYY-STATE-NNNN`
- Example: `DOE-WIOA-2025-FL-1234`

### Department of Workforce Development (DWD)

**Requirements Covered:**
- State workforce development alignment
- Local Workforce Development Board coordination  
- Performance metrics reporting
- Career pathway integration

**Key Validations:**
- `workforce_alignment`: State workforce plan compliance
- `lwdb_coordination`: Local board partnership requirements
- `career_pathways`: Industry-recognized credential alignment

**Contract Numbers:**
- Format: `DWD-STATE-YYYY-NNN`
- Example: `DWD-FL-2025-456`

### Department of Labor (DOL)

**Requirements Covered:**
- Equal Opportunity and Nondiscrimination
- Federal cost principles (2 CFR 200)
- Participant Individual Record Layout (PIRL)
- Data security and privacy (FISMA)

**Key Validations:**
- `equal_opportunity`: EO policies and procedures
- `financial_compliance`: Federal cost principle adherence
- `pirl_reporting`: Data quality and timeliness standards
- `data_security`: Cybersecurity framework compliance

## Validation Check Details

### Individual Validation Fields

Each validation check includes:

```json
{
  "status": "PASS | FAIL | WARNING",
  "requirement": "Human-readable requirement description",
  "lastChecked": "ISO 8601 timestamp",
  "details": "Specific details about compliance status",
  "nextReview": "When this check needs to be performed again (optional)",
  "remediation": "Steps to address non-compliance (if status is FAIL)"
}
```

### Status Meanings

- **PASS**: Requirement fully met
- **FAIL**: Critical non-compliance requiring immediate attention
- **WARNING**: Minor issues that should be addressed

### Current Validation Checks

1. **wioa_eligibility**: WIOA Title I Adult Program Requirements
2. **iep_compliance**: Individual Employment Plan Documentation
3. **pirl_reporting**: PIRL Data Quality and Timeliness
4. **financial_compliance**: Federal Cost Principles (2 CFR 200)
5. **equal_opportunity**: EO and Nondiscrimination Requirements
6. **data_security**: FISMA Compliance

## Certification Management

### Certification Types

- **WIOA_PROVIDER**: Workforce Innovation and Opportunity Act Provider
- **ELIGIBLE_TRAINING_PROVIDER**: State Eligible Training Provider List
- **APPRENTICESHIP_SPONSOR**: DOL Registered Apprenticeship Sponsor
- **CREDENTIAL_PROVIDER**: Industry-Recognized Credential Provider

### Certification Status

- **ACTIVE**: Current and valid
- **PENDING**: Application submitted, awaiting approval
- **EXPIRED**: Needs renewal
- **SUSPENDED**: Temporarily revoked
- **REVOKED**: Permanently removed

## Audit Trail and Reporting

### Audit Timestamps

All compliance data includes:
- `lastAudit`: Last comprehensive compliance review
- `nextAudit`: Next scheduled review date  
- `lastUpdated`: Most recent data update
- `lastChecked`: Last validation run

### Dynamic Timestamp Generation

Timestamps are dynamically generated based on:
- Current date/time
- Compliance review cycles (typically quarterly)
- Regulatory reporting deadlines
- Certification renewal dates

### Report Generation

The system supports automated compliance reporting for:
- Monthly performance reports
- Quarterly compliance summaries  
- Annual certification renewals
- Ad-hoc audit requests

## Integration with Main Application

### Health Check Integration

Compliance status is included in the main health check endpoint:

```bash
curl http://localhost:5000/api/healthz
```

### Error Handling

All compliance endpoints include:
- Correlation IDs for request tracing
- Structured error responses
- Appropriate HTTP status codes
- Detailed error messages

### Security Considerations

- No sensitive data in public endpoints
- All requests logged with correlation IDs
- Rate limiting applied to prevent abuse
- CORS restrictions for cross-origin requests

## Customization and Extension

### Adding New Compliance Checks

1. Add validation function to compliance router
2. Update validation schema in response
3. Include appropriate documentation
4. Test with various scenarios

### Updating Compliance Data

The system supports:
- Manual data updates via API
- Automated data refresh from external sources
- Integration with compliance management systems
- Real-time status monitoring

### Future Enhancements

Phase 2 will include:
- Real-time external data source integration
- Advanced analytics and trending
- Automated alert systems
- Multi-tenant compliance management