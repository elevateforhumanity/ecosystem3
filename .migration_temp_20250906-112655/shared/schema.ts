import { pgTable, varchar, text, timestamp, json, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table - core identity (matches existing database structure)
export const users = pgTable('app_users', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  email: text('email').notNull().unique(),
  authUserId: varchar('auth_user_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Enrollments table - program participation tracking (matches existing database structure)
export const enrollments = pgTable('enrollments', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  programSlug: text('program_slug').notNull(),
  status: text('status').default('pending'),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Notes table - administrative records (matches existing database structure)
export const notes = pgTable('notes', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  author: text('author').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Digital binders table - progress tracking
export const digitalBinders = pgTable('digital_binders', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  programSlug: text('program_slug').notNull(),
  binderId: text('binder_id').notNull(),
  partner: text('partner'),
  status: text('status').default('active'),
  progressData: json('progress_data'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// Course access logs table
export const courseAccessLogs = pgTable('course_access_logs', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  programSlug: text('program_slug').notNull(),
  accessLink: text('access_link'),
  sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow()
});

// Admin notifications table
export const adminNotifications = pgTable('admin_notifications', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  type: text('type').notNull(),
  data: json('data'),
  status: text('status').default('unread'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Certificates table
export const certificates = pgTable('certificates', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  programSlug: text('program_slug').notNull(),
  certificateType: text('certificate_type'),
  certificateData: json('certificate_data'),
  issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow()
});

// Social media posts table
export const socialMediaPosts = pgTable('social_media_posts', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  content: text('content').notNull(),
  platforms: json('platforms'),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).defaultNow(),
  status: text('status').default('pending'),
  automated: boolean('automated').default(false)
});

// Coupons table (matches existing database structure)
export const coupons = pgTable('coupons', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  code: text('code').notNull().unique(),
  type: text('type').notNull(), // 'amount' or 'percent'
  value: json('value').notNull(), // amount in cents or percentage
  active: boolean('active').default(true),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  maxRedemptions: json('max_redemptions'),
  redeemedCount: json('redeemed_count').default('0'),
  allowedPrograms: json('allowed_programs'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({ id: true, createdAt: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true });
export const insertDigitalBinderSchema = createInsertSchema(digitalBinders).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCertificateSchema = createInsertSchema(certificates).omit({ id: true, issuedAt: true });
export const insertCouponSchema = createInsertSchema(coupons).omit({ id: true, createdAt: true, redeemedCount: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type DigitalBinder = typeof digitalBinders.$inferSelect;
export type InsertDigitalBinder = z.infer<typeof insertDigitalBinderSchema>;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type CourseAccessLog = typeof courseAccessLogs.$inferSelect;
export type AdminNotification = typeof adminNotifications.$inferSelect;
export type SocialMediaPost = typeof socialMediaPosts.$inferSelect;

// DOL/DWD Compliance Tables for Federal Workforce Development

// Individual Employment Plans (IEP) - Federal requirement
export const individualEmploymentPlans = pgTable('individual_employment_plans', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  participantName: text('participant_name').notNull(),
  programSlug: text('program_slug').notNull(),
  employmentGoal: text('employment_goal'),
  barrierAssessment: json('barrier_assessment'),
  servicesNeeded: json('services_needed'),
  timeline: json('timeline'),
  status: text('status').default('draft'),
  createdBy: varchar('created_by'),
  approvedBy: varchar('approved_by'),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
});

// PIRL (Participant Individual Record Layout) - Federal reporting
export const pirlReports = pgTable('pirl_reports', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  reportingPeriod: text('reporting_period').notNull(),
  participantData: json('participant_data'),
  employmentData: json('employment_data'),
  educationData: json('education_data'),
  demographicData: json('demographic_data'),
  reportStatus: text('report_status').default('draft'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  submittedBy: varchar('submitted_by'),
  federalId: text('federal_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Eligibility Verification - Federal compliance requirement
export const eligibilityVerifications = pgTable('eligibility_verifications', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  programType: text('program_type').notNull(), // WIO, WEX, WRG, OJT, ETPL
  eligibilityCriteria: json('eligibility_criteria'),
  documentationProvided: json('documentation_provided'),
  verificationStatus: text('verification_status').default('pending'),
  verifiedBy: varchar('verified_by'),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Skills Assessments - Pre/post program evaluation
export const skillsAssessments = pgTable('skills_assessments', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  assessmentType: text('assessment_type').notNull(), // pre, post, follow-up
  programSlug: text('program_slug').notNull(),
  skillAreas: json('skill_areas'),
  scores: json('scores'),
  assessorId: varchar('assessor_id'),
  assessmentDate: timestamp('assessment_date', { withTimezone: true }),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Employer Partners - Job placement tracking
export const employerPartners = pgTable('employer_partners', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  industry: text('industry'),
  address: json('address'),
  hiringCommitments: json('hiring_commitments'),
  partnershipStatus: text('partnership_status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Job Placements - Employment outcome tracking
export const jobPlacements = pgTable('job_placements', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  employerId: varchar('employer_id').references(() => employerPartners.id),
  jobTitle: text('job_title').notNull(),
  startingSalary: json('starting_salary'),
  employmentType: text('employment_type'), // full-time, part-time, temporary
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  placementStatus: text('placement_status').default('placed'),
  retentionChecks: json('retention_checks'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Performance Outcomes - Federal reporting metrics
export const performanceOutcomes = pgTable('performance_outcomes', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  programSlug: text('program_slug').notNull(),
  outcomeType: text('outcome_type').notNull(), // employment, education, training
  measurementPeriod: text('measurement_period'), // 2nd quarter, 4th quarter
  outcomeAchieved: boolean('outcome_achieved'),
  outcomeData: json('outcome_data'),
  reportingQuarter: text('reporting_quarter'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Audit Logs - Comprehensive compliance tracking
export const auditLogs = pgTable('audit_logs', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id'),
  actionType: text('action_type').notNull(),
  resourceType: text('resource_type'),
  resourceId: varchar('resource_id'),
  actionDetails: json('action_details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  sessionId: varchar('session_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Cost Tracking - Federal funding accountability
export const costTracking = pgTable('cost_tracking', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  userId: varchar('user_id').references(() => users.id),
  programSlug: text('program_slug').notNull(),
  costCategory: text('cost_category').notNull(), // instruction, support, administration
  amount: json('amount'), // stored as cents
  fundingSource: text('funding_source'), // WIO, WEX, state, federal
  reportingPeriod: text('reporting_period'),
  costDescription: text('cost_description'),
  approvedBy: varchar('approved_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// State Contracts - Multi-tenant configuration
export const stateContracts = pgTable('state_contracts', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  stateName: text('state_name').notNull(),
  stateCode: text('state_code').notNull(),
  contractNumber: text('contract_number'),
  programTypes: json('program_types'), // WIO, WEX, WRG, OJT, ETPL
  contractValue: json('contract_value'),
  startDate: timestamp('start_date', { withTimezone: true }),
  endDate: timestamp('end_date', { withTimezone: true }),
  performanceMetrics: json('performance_metrics'),
  contactInfo: json('contact_info'),
  contractStatus: text('contract_status').default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Federal API Integration Logs
export const federalApiLogs = pgTable('federal_api_logs', {
  id: varchar('id').primaryKey().default(sql`uuid_generate_v4()`),
  apiEndpoint: text('api_endpoint').notNull(),
  requestType: text('request_type'), // submission, query, update
  requestData: json('request_data'),
  responseData: json('response_data'),
  responseStatus: text('response_status'),
  errorMessage: text('error_message'),
  processingTime: json('processing_time'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow()
});

// Compliance Insert Schemas
export const insertIEPSchema = createInsertSchema(individualEmploymentPlans).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPIRLSchema = createInsertSchema(pirlReports).omit({ id: true, createdAt: true });
export const insertEligibilitySchema = createInsertSchema(eligibilityVerifications).omit({ id: true, createdAt: true });
export const insertSkillsAssessmentSchema = createInsertSchema(skillsAssessments).omit({ id: true, createdAt: true });
export const insertEmployerSchema = createInsertSchema(employerPartners).omit({ id: true, createdAt: true });
export const insertJobPlacementSchema = createInsertSchema(jobPlacements).omit({ id: true, createdAt: true });
export const insertPerformanceSchema = createInsertSchema(performanceOutcomes).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });
export const insertCostTrackingSchema = createInsertSchema(costTracking).omit({ id: true, createdAt: true });
export const insertStateContractSchema = createInsertSchema(stateContracts).omit({ id: true, createdAt: true });

// Compliance Types
export type IndividualEmploymentPlan = typeof individualEmploymentPlans.$inferSelect;
export type InsertIEP = z.infer<typeof insertIEPSchema>;
export type PIRLReport = typeof pirlReports.$inferSelect;
export type InsertPIRL = z.infer<typeof insertPIRLSchema>;
export type EligibilityVerification = typeof eligibilityVerifications.$inferSelect;
export type InsertEligibility = z.infer<typeof insertEligibilitySchema>;
export type SkillsAssessment = typeof skillsAssessments.$inferSelect;
export type InsertSkillsAssessment = z.infer<typeof insertSkillsAssessmentSchema>;
export type EmployerPartner = typeof employerPartners.$inferSelect;
export type InsertEmployer = z.infer<typeof insertEmployerSchema>;
export type JobPlacement = typeof jobPlacements.$inferSelect;
export type InsertJobPlacement = z.infer<typeof insertJobPlacementSchema>;
export type PerformanceOutcome = typeof performanceOutcomes.$inferSelect;
export type InsertPerformanceOutcome = z.infer<typeof insertPerformanceSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type CostTracking = typeof costTracking.$inferSelect;
export type InsertCostTracking = z.infer<typeof insertCostTrackingSchema>;
export type StateContract = typeof stateContracts.$inferSelect;
export type InsertStateContract = z.infer<typeof insertStateContractSchema>;
export type FederalApiLog = typeof federalApiLogs.$inferSelect;