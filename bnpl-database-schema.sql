
-- Buy Now Pay Later (BNPL) Database Schema
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS bnpl_subscriptions (
    id SERIAL PRIMARY KEY,
    subscription_id VARCHAR(255) UNIQUE NOT NULL, -- Stripe subscription ID
    customer_id VARCHAR(255) NOT NULL, -- Stripe customer ID
    customer_email VARCHAR(255) NOT NULL,
    program_slug VARCHAR(255) NOT NULL,
    plan_id VARCHAR(50) NOT NULL, -- 3_months, 6_months, 12_months
    total_amount DECIMAL(10,2) NOT NULL, -- Total amount including interest
    installment_amount DECIMAL(10,2) NOT NULL, -- Amount per installment
    installments_total INTEGER NOT NULL, -- Total number of installments
    installments_paid INTEGER DEFAULT 0, -- Number of installments completed
    status VARCHAR(50) DEFAULT 'active', -- active, canceled, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    canceled_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    
    -- Indexes for performance
    INDEX idx_bnpl_customer_email (customer_email),
    INDEX idx_bnpl_subscription_id (subscription_id),
    INDEX idx_bnpl_program_slug (program_slug),
    INDEX idx_bnpl_status (status)
);

-- Table for tracking individual BNPL payments
CREATE TABLE IF NOT EXISTS bnpl_payments (
    id SERIAL PRIMARY KEY,
    subscription_id VARCHAR(255) NOT NULL,
    payment_intent_id VARCHAR(255), -- Stripe payment intent ID
    installment_number INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    due_date DATE NOT NULL,
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}',
    
    FOREIGN KEY (subscription_id) REFERENCES bnpl_subscriptions(subscription_id),
    INDEX idx_bnpl_payments_subscription (subscription_id),
    INDEX idx_bnpl_payments_status (status),
    INDEX idx_bnpl_payments_due_date (due_date)
);

-- View for easy BNPL reporting
CREATE OR REPLACE VIEW bnpl_overview AS
SELECT 
    bs.id,
    bs.subscription_id,
    bs.customer_email,
    bs.program_slug,
    bs.plan_id,
    bs.total_amount,
    bs.installment_amount,
    bs.installments_total,
    bs.installments_paid,
    bs.status,
    bs.created_at,
    (bs.installments_total - bs.installments_paid) as installments_remaining,
    (bs.installment_amount * (bs.installments_total - bs.installments_paid)) as amount_remaining,
    CASE 
        WHEN bs.installments_paid = bs.installments_total THEN 'completed'
        WHEN bs.status = 'canceled' THEN 'canceled'
        ELSE 'active'
    END as computed_status
FROM bnpl_subscriptions bs;

-- Function to update installment count when payment is made
CREATE OR REPLACE FUNCTION update_bnpl_installments()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'paid' AND OLD.status != 'paid' THEN
        UPDATE bnpl_subscriptions 
        SET installments_paid = installments_paid + 1,
            completed_at = CASE 
                WHEN installments_paid + 1 >= installments_total 
                THEN NOW() 
                ELSE completed_at 
            END,
            status = CASE 
                WHEN installments_paid + 1 >= installments_total 
                THEN 'completed' 
                ELSE status 
            END
        WHERE subscription_id = NEW.subscription_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update installment counts
CREATE TRIGGER trigger_update_bnpl_installments
    AFTER UPDATE ON bnpl_payments
    FOR EACH ROW
    EXECUTE FUNCTION update_bnpl_installments();

-- RLS (Row Level Security) policies
ALTER TABLE bnpl_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bnpl_payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own BNPL subscriptions
CREATE POLICY "Users can view own bnpl subscriptions" ON bnpl_subscriptions
    FOR SELECT USING (customer_email = auth.jwt() ->> 'email');

-- Policy: Users can only see their own BNPL payments
CREATE POLICY "Users can view own bnpl payments" ON bnpl_payments
    FOR SELECT USING (
        subscription_id IN (
            SELECT subscription_id FROM bnpl_subscriptions 
            WHERE customer_email = auth.jwt() ->> 'email'
        )
    );

-- Policy: Service role can do everything (for backend operations)
CREATE POLICY "Service role full access bnpl_subscriptions" ON bnpl_subscriptions
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

CREATE POLICY "Service role full access bnpl_payments" ON bnpl_payments
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
