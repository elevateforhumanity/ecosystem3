/**
 * REVENUE SPLIT SYSTEM
 * Automated 50/50 revenue sharing with credentialing partners
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const partnerCatalog = require('./partner-programs-catalog.json');

class RevenueSplitSystem {
    constructor() {
        this.stripe = stripe;
        this.catalog = partnerCatalog;
        this.partnerAccounts = new Map(); // Cache for partner Stripe accounts
    }

    /**
     * Process enrollment payment with automatic revenue split
     */
    async processEnrollmentPayment(enrollmentData) {
        const {
            programId,
            partnerId,
            studentEmail,
            studentName,
            paymentMethodId
        } = enrollmentData;

        try {
            // Get program details
            const program = this.getProgramDetails(partnerId, programId);
            if (!program) {
                throw new Error(`Program ${programId} not found for partner ${partnerId}`);
            }

            // Get or create partner Connect account
            const partnerAccount = await this.getPartnerAccount(partnerId);
            
            // Calculate revenue split
            const totalAmount = program.student_price * 100; // Convert to cents
            const partnerRevenue = Math.round(totalAmount * 0.5);
            const elevateRevenue = totalAmount - partnerRevenue;

            // Create payment intent with automatic transfer
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: totalAmount,
                currency: 'usd',
                payment_method: paymentMethodId,
                confirmation_method: 'manual',
                confirm: true,
                return_url: 'https://elevateforhumanity.org/enrollment/complete',
                application_fee_amount: partnerRevenue,
                transfer_data: {
                    destination: partnerAccount.id
                },
                metadata: {
                    program_id: programId,
                    partner_id: partnerId,
                    student_email: studentEmail,
                    student_name: studentName,
                    partner_revenue: (partnerRevenue / 100).toString(),
                    elevate_revenue: (elevateRevenue / 100).toString(),
                    enrollment_type: 'partner_program',
                    dual_certification: 'true'
                }
            });

            // Record the transaction
            const transaction = await this.recordTransaction({
                payment_intent_id: paymentIntent.id,
                program_id: programId,
                partner_id: partnerId,
                student_email: studentEmail,
                total_amount: totalAmount / 100,
                partner_revenue: partnerRevenue / 100,
                elevate_revenue: elevateRevenue / 100,
                status: paymentIntent.status
            });

            return {
                success: true,
                payment_intent: paymentIntent,
                transaction: transaction,
                enrollment_details: {
                    program_name: program.name,
                    certification: program.certification,
                    duration: program.duration,
                    partner_name: this.catalog.credentialing_partners[partnerId].partner_name
                }
            };

        } catch (error) {
            console.error('Payment processing error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create Stripe Checkout session with revenue split
     */
    async createCheckoutSession(programId, partnerId, customerEmail, successUrl, cancelUrl) {
        const program = this.getProgramDetails(partnerId, programId);
        const partnerData = this.catalog.credentialing_partners[partnerId];
        const partnerAccount = await this.getPartnerAccount(partnerId);

        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: program.name,
                        description: `${program.description} - Dual certification from ${partnerData.partner_name} and Elevate for Humanity`,
                        images: [`https://elevateforhumanity.org/assets/certifications/${programId}.jpg`]
                    },
                    unit_amount: program.student_price * 100
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: cancelUrl,
            customer_email: customerEmail,
            metadata: {
                program_id: programId,
                partner_id: partnerId,
                partner_revenue: (program.student_price * 0.5).toString(),
                elevate_revenue: (program.student_price * 0.5).toString()
            },
            payment_intent_data: {
                application_fee_amount: Math.round(program.student_price * 100 * 0.5),
                transfer_data: {
                    destination: partnerAccount.id
                },
                metadata: {
                    enrollment_type: 'partner_program',
                    dual_certification: 'true'
                }
            }
        });

        return session;
    }

    /**
     * Get or create partner Stripe Connect account
     */
    async getPartnerAccount(partnerId) {
        // Check cache first
        if (this.partnerAccounts.has(partnerId)) {
            return this.partnerAccounts.get(partnerId);
        }

        const partnerData = this.catalog.credentialing_partners[partnerId];
        if (!partnerData) {
            throw new Error(`Partner ${partnerId} not found in catalog`);
        }

        try {
            // Try to find existing account
            const accounts = await this.stripe.accounts.list({
                limit: 100
            });

            let account = accounts.data.find(acc => 
                acc.metadata && acc.metadata.partner_id === partnerId
            );

            if (!account) {
                // Create new Express account
                account = await this.stripe.accounts.create({
                    type: 'express',
                    country: 'US',
                    email: `partnerships+${partnerId}@elevateforhumanity.org`,
                    capabilities: {
                        card_payments: { requested: true },
                        transfers: { requested: true }
                    },
                    business_type: 'company',
                    company: {
                        name: partnerData.partner_name
                    },
                    metadata: {
                        partner_id: partnerId,
                        revenue_split: partnerData.partner_split.toString(),
                        created_by: 'elevate_for_humanity'
                    }
                });

                console.log(`✅ Created new Connect account for ${partnerData.partner_name}`);
            }

            // Cache the account
            this.partnerAccounts.set(partnerId, account);
            return account;

        } catch (error) {
            console.error(`Error managing account for ${partnerId}:`, error);
            throw error;
        }
    }

    /**
     * Handle successful payment webhook
     */
    async handlePaymentSuccess(paymentIntent) {
        const metadata = paymentIntent.metadata;
        
        if (metadata.enrollment_type === 'partner_program') {
            // Trigger enrollment process
            await this.triggerEnrollment({
                payment_intent_id: paymentIntent.id,
                program_id: metadata.program_id,
                partner_id: metadata.partner_id,
                student_email: metadata.student_email,
                student_name: metadata.student_name
            });

            // Send confirmation emails
            await this.sendEnrollmentConfirmation(metadata);
            
            // Notify partner
            await this.notifyPartner(metadata);
        }
    }

    /**
     * Trigger enrollment in partner system
     */
    async triggerEnrollment(enrollmentData) {
        const program = this.getProgramDetails(enrollmentData.partner_id, enrollmentData.program_id);
        const partnerData = this.catalog.credentialing_partners[enrollmentData.partner_id];

        // Create enrollment record
        const enrollment = {
            id: `enroll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            student_email: enrollmentData.student_email,
            student_name: enrollmentData.student_name,
            program_id: enrollmentData.program_id,
            program_name: program.name,
            partner_id: enrollmentData.partner_id,
            partner_name: partnerData.partner_name,
            certification_target: program.certification,
            duration: program.duration,
            level: program.level,
            enrolled_at: new Date().toISOString(),
            status: 'enrolled',
            payment_intent_id: enrollmentData.payment_intent_id,
            course_access_url: this.generateCourseAccessUrl(enrollmentData.partner_id, enrollmentData.program_id),
            expected_completion: this.calculateCompletionDate(program.duration)
        };

        // Store enrollment (would integrate with database)
        console.log('📚 Enrollment created:', enrollment);

        return enrollment;
    }

    /**
     * Generate course access URL for student
     */
    generateCourseAccessUrl(partnerId, programId) {
        const baseUrls = {
            google_cloud: 'https://cloud.google.com/training',
            microsoft: 'https://learn.microsoft.com',
            comptia: 'https://www.comptia.org/training',
            ibew: 'https://www.ibew.org/training',
            milady: 'https://www.milady.com/training',
            nccer: 'https://www.nccer.org/training'
        };

        const baseUrl = baseUrls[partnerId] || 'https://elevateforhumanity.org/courses';
        return `${baseUrl}/${programId}?ref=elevate_for_humanity`;
    }

    /**
     * Calculate expected completion date
     */
    calculateCompletionDate(duration) {
        const weeks = parseInt(duration.split('-')[1] || duration.split(' ')[0]);
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + (weeks * 7));
        return completionDate.toISOString();
    }

    /**
     * Send enrollment confirmation to student
     */
    async sendEnrollmentConfirmation(metadata) {
        const program = this.getProgramDetails(metadata.partner_id, metadata.program_id);
        const partnerData = this.catalog.credentialing_partners[metadata.partner_id];

        const emailData = {
            to: metadata.student_email,
            subject: `🎓 Enrollment Confirmed: ${program.name}`,
            template: 'enrollment_confirmation',
            data: {
                student_name: metadata.student_name,
                program_name: program.name,
                partner_name: partnerData.partner_name,
                certification: program.certification,
                duration: program.duration,
                course_access_url: this.generateCourseAccessUrl(metadata.partner_id, metadata.program_id),
                support_email: 'support@elevateforhumanity.org'
            }
        };

        console.log('📧 Sending enrollment confirmation:', emailData);
        // Would integrate with email service (SendGrid, etc.)
    }

    /**
     * Get program details from catalog
     */
    getProgramDetails(partnerId, programId) {
        const partner = this.catalog.credentialing_partners[partnerId];
        if (!partner) return null;
        
        return partner.programs.find(p => p.id === programId);
    }

    /**
     * Record transaction for reporting
     */
    async recordTransaction(transactionData) {
        // Would store in database
        console.log('💰 Transaction recorded:', transactionData);
        return transactionData;
    }

    /**
     * Generate revenue report
     */
    async generateRevenueReport(startDate, endDate) {
        // Would query database for actual transactions
        const mockReport = {
            period: `${startDate} to ${endDate}`,
            total_revenue: 0,
            elevate_revenue: 0,
            partner_revenue: 0,
            transaction_count: 0,
            partner_breakdown: {},
            top_programs: []
        };

        return mockReport;
    }
}

module.exports = RevenueSplitSystem;

// Example usage
if (require.main === module) {
    const revenueSplit = new RevenueSplitSystem();
    
    console.log('🏦 REVENUE SPLIT SYSTEM INITIALIZED');
    console.log('💰 50% to Elevate for Humanity');
    console.log('🤝 50% to Credentialing Partners');
    console.log('🎓 Dual certification delivery');
    console.log('⚡ Automated enrollment process');
}