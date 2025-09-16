## Compliance Checks (Stub Phase)

| ID | Name | Category | Description | Status Meaning |
|----|------|----------|-------------|----------------|
| wioa_eligibility | WIOA Title I Adult Program Eligibility | participant | Verifies participant meets eligibility criteria | PASS = no blocking rules |
| iep_compliance | Individual Employment Plan Compliance | planning | IEPs current and aligned with goals | PASS = all IEPs within review window |
| pirl_reporting | PIRL Data Quality and Timeliness | reporting | Data exports complete and timely | PASS = last export < 30 days |
| financial_compliance | Federal Cost Principles (2 CFR 200) | financial | Allowable cost allocation & documentation | PASS = no flagged transactions |
| equal_opportunity | Equal Opportunity & Non-Discrimination | governance | EO notices and grievance procedures in place | PASS = all required postings active |
| data_security | Data Security & Privacy Standards | security | Secure handling of PII and access controls | PASS = baseline controls active |

Current implementation returns static PASS values (Phase 1). Future phases will:
1. Pull dynamic data from audit logs / DB
2. Generate evidence artifacts
3. Provide remediation hints per failed check
4. Emit machine-readable schema for regulators

API Endpoints:
- GET /api/compliance -> summary (status, audits)
- GET /api/compliance/validate -> detailed validations + certifications

Version: 0.1 (stub)
