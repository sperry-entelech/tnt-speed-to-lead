-- TNT Corporate Lead System - Database Schema
-- Phase 2 Architecture - PostgreSQL 15
-- Generated using architect-mcp.json specifications

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE service_type AS ENUM ('corporate', 'airport', 'wedding', 'hourly', 'events');
CREATE TYPE interaction_type AS ENUM ('email_sent', 'email_opened', 'email_clicked', 'call_made', 'meeting_scheduled', 'sms_sent');
CREATE TYPE sync_status AS ENUM ('success', 'error', 'pending');

-- =====================================================
-- CORE LEAD MANAGEMENT TABLES
-- =====================================================

-- Primary leads table with comprehensive tracking
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Company Information
    company_name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255),

    -- Service Requirements
    service_type service_type NOT NULL,
    service_date TIMESTAMP,
    pickup_location VARCHAR(500),
    destination VARCHAR(500),
    passenger_count INTEGER,
    vehicle_preference VARCHAR(100),

    -- Business Classification
    estimated_value DECIMAL(10,2),
    budget_tier VARCHAR(50), -- 'economy', 'premium', 'luxury'
    company_size_estimate INTEGER,
    industry VARCHAR(100),

    -- Lead Scoring & Status
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    status lead_status DEFAULT 'new',
    priority_level INTEGER DEFAULT 3 CHECK (priority_level >= 1 AND priority_level <= 5),

    -- Source Attribution
    source VARCHAR(100) NOT NULL, -- 'website', 'referral', 'social', 'paid_ads'
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    referrer_url TEXT,

    -- Geographic Data
    service_area VARCHAR(100),
    distance_from_base DECIMAL(5,2), -- miles from Richmond, VA

    -- Integration IDs
    zoho_lead_id VARCHAR(100),
    fasttrack_customer_id VARCHAR(100),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    converted_at TIMESTAMP,
    last_contact_at TIMESTAMP,

    -- Search optimization
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english',
            COALESCE(company_name, '') || ' ' ||
            COALESCE(contact_name, '') || ' ' ||
            COALESCE(email, '') || ' ' ||
            COALESCE(industry, '')
        )
    ) STORED
);

-- Performance indexes for leads table
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX idx_leads_status ON leads (status);
CREATE INDEX idx_leads_lead_score ON leads (lead_score DESC);
CREATE INDEX idx_leads_company_name ON leads (company_name);
CREATE INDEX idx_leads_service_type ON leads (service_type);
CREATE INDEX idx_leads_priority ON leads (priority_level DESC, created_at DESC);
CREATE INDEX idx_leads_source ON leads (source);
CREATE INDEX idx_leads_search ON leads USING GIN (search_vector);
CREATE INDEX idx_leads_zoho_id ON leads (zoho_lead_id) WHERE zoho_lead_id IS NOT NULL;

-- =====================================================
-- INTERACTION TRACKING TABLES
-- =====================================================

-- Track all interactions with leads
CREATE TABLE lead_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

    -- Interaction Details
    interaction_type interaction_type NOT NULL,
    subject VARCHAR(255),
    content TEXT,

    -- Automation & Attribution
    automated BOOLEAN DEFAULT false,
    template_used VARCHAR(100),
    user_id UUID, -- Reference to user who performed manual action

    -- Email Specific Data
    email_message_id VARCHAR(255), -- For tracking bounces/replies
    email_opened_at TIMESTAMP,
    email_clicked_at TIMESTAMP,
    click_count INTEGER DEFAULT 0,

    -- Outcome Tracking
    response_received BOOLEAN DEFAULT false,
    response_content TEXT,
    next_action VARCHAR(255),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP, -- For future scheduled interactions
    completed_at TIMESTAMP
);

CREATE INDEX idx_interactions_lead_id ON lead_interactions (lead_id, created_at DESC);
CREATE INDEX idx_interactions_type ON lead_interactions (interaction_type);
CREATE INDEX idx_interactions_scheduled ON lead_interactions (scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX idx_interactions_automated ON lead_interactions (automated, created_at DESC);

-- =====================================================
-- EMAIL AUTOMATION TABLES
-- =====================================================

-- Email templates and automation sequences
CREATE TABLE automated_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Template Information
    template_name VARCHAR(100) UNIQUE NOT NULL,
    subject_line VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    html_content TEXT,

    -- Targeting & Triggers
    trigger_conditions JSON NOT NULL, -- JSON object defining when to send
    service_types service_type[], -- Array of applicable service types
    lead_score_min INTEGER DEFAULT 0,
    lead_score_max INTEGER DEFAULT 100,

    -- A/B Testing
    a_b_test_variant VARCHAR(50),
    test_percentage DECIMAL(5,2) DEFAULT 100.00,

    -- Performance Tracking
    sent_count INTEGER DEFAULT 0,
    opened_count INTEGER DEFAULT 0,
    clicked_count INTEGER DEFAULT 0,
    responded_count INTEGER DEFAULT 0,

    -- Configuration
    active BOOLEAN DEFAULT true,
    send_delay_minutes INTEGER DEFAULT 0, -- Delay after trigger
    business_hours_only BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID
);

CREATE INDEX idx_responses_active ON automated_responses (active);
CREATE INDEX idx_responses_trigger ON automated_responses USING GIN (trigger_conditions);

-- Email sequence tracking for follow-ups
CREATE TABLE email_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

    -- Sequence Configuration
    sequence_name VARCHAR(100) NOT NULL,
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER NOT NULL,

    -- Timing
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_send_at TIMESTAMP,
    completed_at TIMESTAMP,

    -- Status
    active BOOLEAN DEFAULT true,
    paused_reason VARCHAR(255),

    -- Performance
    emails_sent INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    responses_received INTEGER DEFAULT 0
);

CREATE INDEX idx_sequences_lead_id ON email_sequences (lead_id);
CREATE INDEX idx_sequences_next_send ON email_sequences (next_send_at) WHERE active = true;

-- =====================================================
-- INTEGRATION & SYNC TABLES
-- =====================================================

-- Track external system integrations
CREATE TABLE external_integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Service Information
    service_name VARCHAR(100) UNIQUE NOT NULL, -- 'zoho_crm', 'fasttrack', 'richweb_smtp'
    api_endpoint VARCHAR(255),
    api_version VARCHAR(50),

    -- Authentication (encrypted)
    credentials_encrypted TEXT, -- Encrypted JSON with auth details

    -- Sync Status
    last_sync TIMESTAMP,
    sync_status sync_status DEFAULT 'pending',
    sync_frequency VARCHAR(50) DEFAULT '15_minutes', -- 'real_time', '15_minutes', 'hourly', 'daily'

    -- Error Handling
    error_message TEXT,
    consecutive_failures INTEGER DEFAULT 0,
    max_failures INTEGER DEFAULT 5,

    -- Configuration
    active BOOLEAN DEFAULT true,
    sync_direction VARCHAR(50) DEFAULT 'bidirectional', -- 'inbound', 'outbound', 'bidirectional'

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webhook event logs for debugging and replay
CREATE TABLE webhook_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Source Information
    source VARCHAR(100) NOT NULL, -- 'website_form', 'zoho_crm', 'email_provider'
    event_type VARCHAR(100) NOT NULL,

    -- Payload Data
    payload JSON NOT NULL,
    headers JSON,

    -- Processing Status
    processed BOOLEAN DEFAULT false,
    processed_at TIMESTAMP,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,

    -- Associated Records
    lead_id UUID REFERENCES leads(id),
    interaction_id UUID REFERENCES lead_interactions(id),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET
);

CREATE INDEX idx_webhooks_source ON webhook_logs (source, created_at DESC);
CREATE INDEX idx_webhooks_processed ON webhook_logs (processed, created_at);
CREATE INDEX idx_webhooks_lead_id ON webhook_logs (lead_id) WHERE lead_id IS NOT NULL;

-- =====================================================
-- ANALYTICS & REPORTING TABLES
-- =====================================================

-- Daily performance metrics aggregation
CREATE TABLE daily_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_date DATE UNIQUE NOT NULL,

    -- Lead Metrics
    leads_created INTEGER DEFAULT 0,
    leads_qualified INTEGER DEFAULT 0,
    leads_converted INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2),

    -- Response Metrics
    avg_response_time_minutes DECIMAL(8,2),
    responses_under_5min INTEGER DEFAULT 0,
    weekend_leads_count INTEGER DEFAULT 0,

    -- Email Metrics
    emails_sent INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    emails_clicked INTEGER DEFAULT 0,
    email_response_rate DECIMAL(5,2),

    -- Revenue Metrics
    estimated_pipeline_value DECIMAL(12,2),
    converted_revenue DECIMAL(12,2),
    avg_deal_size DECIMAL(10,2),

    -- Service Type Breakdown
    corporate_leads INTEGER DEFAULT 0,
    airport_leads INTEGER DEFAULT 0,
    wedding_leads INTEGER DEFAULT 0,
    hourly_leads INTEGER DEFAULT 0,

    -- Calculated at end of day
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_metrics_date ON daily_metrics (metric_date DESC);

-- Lead scoring factors and weights
CREATE TABLE scoring_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Factor Definition
    factor_name VARCHAR(100) UNIQUE NOT NULL,
    factor_category VARCHAR(50) NOT NULL, -- 'company', 'service', 'timing', 'geographic'

    -- Scoring Configuration
    weight INTEGER NOT NULL CHECK (weight >= 0 AND weight <= 100),
    calculation_method VARCHAR(50) NOT NULL, -- 'exact_match', 'range', 'calculation'

    -- Value Mappings (JSON)
    value_mappings JSON, -- Maps input values to scores

    -- Status
    active BOOLEAN DEFAULT true,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID
);

-- =====================================================
-- NOTIFICATION & ALERT TABLES
-- =====================================================

-- High-value lead notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,

    -- Notification Details
    notification_type VARCHAR(100) NOT NULL, -- 'high_value_lead', 'response_needed', 'conversion_opportunity'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),

    -- Delivery Channels
    send_email BOOLEAN DEFAULT true,
    send_sms BOOLEAN DEFAULT false,
    send_slack BOOLEAN DEFAULT false,

    -- Recipients
    recipient_user_ids UUID[],

    -- Status
    sent BOOLEAN DEFAULT false,
    sent_at TIMESTAMP,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,

    -- Actions
    action_required BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    action_completed BOOLEAN DEFAULT false,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_notifications_lead_id ON notifications (lead_id);
CREATE INDEX idx_notifications_sent ON notifications (sent, created_at DESC);
CREATE INDEX idx_notifications_priority ON notifications (priority DESC, created_at DESC);

-- =====================================================
-- USER MANAGEMENT & PERMISSIONS
-- =====================================================

-- System users (managers, dispatchers, admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- Basic Information
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50),

    -- Role & Permissions
    role VARCHAR(50) NOT NULL DEFAULT 'dispatcher', -- 'admin', 'manager', 'dispatcher'
    permissions JSON, -- Detailed permissions object

    -- Settings
    timezone VARCHAR(50) DEFAULT 'America/New_York',
    notification_preferences JSON,
    dashboard_config JSON,

    -- Status
    active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,

    -- Security
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_active ON users (active);

-- =====================================================
-- TRIGGERS FOR AUTOMATED UPDATES
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_responses_updated_at BEFORE UPDATE ON automated_responses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON external_integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate lead scores
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_record leads)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    factor RECORD;
BEGIN
    -- Base score factors
    IF lead_record.company_name IS NOT NULL AND length(lead_record.company_name) > 0 THEN
        score := score + 10; -- Has company name
    END IF;

    IF lead_record.estimated_value >= 1000 THEN
        score := score + 30; -- High value booking
    ELSIF lead_record.estimated_value >= 500 THEN
        score := score + 20; -- Medium value booking
    ELSE
        score := score + 10; -- Any estimated value
    END IF;

    -- Service type scoring
    CASE lead_record.service_type
        WHEN 'corporate' THEN score := score + 25;
        WHEN 'airport' THEN score := score + 20;
        WHEN 'events' THEN score := score + 15;
        WHEN 'wedding' THEN score := score + 15;
        WHEN 'hourly' THEN score := score + 10;
    END CASE;

    -- Geographic proximity (closer = higher score)
    IF lead_record.distance_from_base <= 25 THEN
        score := score + 15;
    ELSIF lead_record.distance_from_base <= 50 THEN
        score := score + 10;
    ELSIF lead_record.distance_from_base <= 100 THEN
        score := score + 5;
    END IF;

    -- Passenger count (group bookings score higher)
    IF lead_record.passenger_count >= 8 THEN
        score := score + 15;
    ELSIF lead_record.passenger_count >= 4 THEN
        score := score + 10;
    END IF;

    -- Cap score at 100
    RETURN LEAST(score, 100);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate lead score on insert/update
CREATE OR REPLACE FUNCTION update_lead_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.lead_score = calculate_lead_score(NEW);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_lead_score_trigger
    BEFORE INSERT OR UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_lead_score();

-- =====================================================
-- INITIAL DATA SETUP
-- =====================================================

-- Insert default automated response templates
INSERT INTO automated_responses (template_name, subject_line, content, trigger_conditions, service_types) VALUES
('corporate_instant_response',
 'TNT Limousine - Your Transportation Request [5-Minute Response]',
 'Dear {{contact_name}},

Thank you for contacting TNT Limousine for your corporate transportation needs. We have received your inquiry and a member of our team will contact you within the next 5 minutes.

TNT Limousine has been Richmond''s premier transportation provider since 1992, serving corporate clients with:
- Certified airport access (Richmond, Dulles, Reagan, BWI)
- Professional chauffeurs with 15+ years experience
- National Limousine Association member
- Trust Analytica Top 10 Richmond limousine company

Your estimated service details:
- Service Type: {{service_type}}
- Date: {{service_date}}
- Estimated Value: ${{estimated_value}}

We will contact you shortly at {{phone}} to discuss your requirements and provide detailed pricing.

Best regards,
TNT Limousine Team
"Driven by Service, Defined by Excellence"',
 '{"service_types": ["corporate"], "immediate": true}',
 ARRAY['corporate']::service_type[]
),
('airport_service_response',
 'TNT Airport Transportation - Competitive Pricing & Reliability',
 'Hello {{contact_name}},

Thank you for choosing TNT Limousine for your airport transportation needs.

Our certified airport service includes:
- BWI: $657 (vs Richmond Limousine $650)
- Dulles: $460 (vs Richmond Limousine $450)
- Reagan National: $450 (vs Richmond Limousine $440)

Why choose TNT:
✓ Superior vehicle quality and maintenance
✓ Experienced drivers (15+ years average)
✓ 99.9% on-time performance
✓ 24/7 availability and tracking

We will contact you within 5 minutes to confirm your booking details.

TNT Limousine
Richmond, VA',
 '{"service_types": ["airport"], "immediate": true}',
 ARRAY['airport']::service_type[]
);

-- Insert default scoring factors
INSERT INTO scoring_factors (factor_name, factor_category, weight, calculation_method, value_mappings) VALUES
('company_name_present', 'company', 10, 'exact_match', '{"present": 10, "absent": 0}'),
('estimated_value_tier', 'service', 30, 'range', '{"1000+": 30, "500-999": 20, "0-499": 10}'),
('service_type_priority', 'service', 25, 'exact_match', '{"corporate": 25, "airport": 20, "events": 15, "wedding": 15, "hourly": 10}'),
('geographic_proximity', 'geographic', 15, 'range', '{"0-25": 15, "26-50": 10, "51-100": 5, "100+": 0}'),
('group_size_factor', 'service', 15, 'range', '{"8+": 15, "4-7": 10, "1-3": 5}'),
('timing_urgency', 'timing', 5, 'calculation', '{"same_day": 5, "next_day": 3, "future": 1}');

-- Insert integration configurations
INSERT INTO external_integrations (service_name, api_endpoint, sync_frequency, active) VALUES
('zoho_crm', 'https://www.zohoapis.com/crm/v2/', 'real_time', true),
('fasttrack_invision', 'https://api.fasttrack.com/v1/', '15_minutes', true),
('richweb_smtp', 'mail.richweb.net:587', 'real_time', true),
('slack_notifications', 'https://hooks.slack.com/services/', 'real_time', true);

-- Create default admin user (password should be changed immediately)
INSERT INTO users (email, password_hash, first_name, last_name, role, permissions) VALUES
('admin@tntlimousine.com', '$2b$12$placeholder_hash_change_immediately', 'System', 'Administrator', 'admin',
 '{"leads": {"create": true, "read": true, "update": true, "delete": true}, "analytics": {"access": true}, "settings": {"manage": true}}');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- High-value leads requiring immediate attention
CREATE VIEW high_priority_leads AS
SELECT
    l.*,
    EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - l.created_at))/60 AS minutes_since_created,
    CASE
        WHEN l.lead_score >= 80 THEN 'Critical'
        WHEN l.lead_score >= 60 THEN 'High'
        WHEN l.lead_score >= 40 THEN 'Medium'
        ELSE 'Low'
    END AS priority_label
FROM leads l
WHERE l.status = 'new'
AND (l.lead_score >= 60 OR l.estimated_value >= 1000)
ORDER BY l.lead_score DESC, l.created_at ASC;

-- Lead conversion funnel metrics
CREATE VIEW conversion_funnel AS
SELECT
    DATE_TRUNC('day', created_at) AS date,
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE status IN ('contacted', 'qualified', 'converted')) AS contacted,
    COUNT(*) FILTER (WHERE status IN ('qualified', 'converted')) AS qualified,
    COUNT(*) FILTER (WHERE status = 'converted') AS converted,
    ROUND(
        100.0 * COUNT(*) FILTER (WHERE status = 'converted') /
        NULLIF(COUNT(*), 0), 2
    ) AS conversion_rate
FROM leads
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY date DESC;

-- Response time performance
CREATE VIEW response_time_metrics AS
SELECT
    DATE_TRUNC('day', l.created_at) AS date,
    COUNT(*) AS total_leads,
    COUNT(li.id) AS responded_leads,
    ROUND(AVG(EXTRACT(EPOCH FROM (li.created_at - l.created_at))/60), 2) AS avg_response_minutes,
    COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (li.created_at - l.created_at))/60 <= 5) AS under_5_minutes,
    ROUND(
        100.0 * COUNT(*) FILTER (WHERE EXTRACT(EPOCH FROM (li.created_at - l.created_at))/60 <= 5) /
        NULLIF(COUNT(*), 0), 2
    ) AS under_5_minutes_rate
FROM leads l
LEFT JOIN lead_interactions li ON l.id = li.lead_id
    AND li.interaction_type = 'email_sent'
    AND li.automated = true
WHERE l.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', l.created_at)
ORDER BY date DESC;

-- =====================================================
-- PERFORMANCE OPTIMIZATION
-- =====================================================

-- Analyze queries for optimization
ANALYZE;

-- Create materialized view for dashboard metrics (refresh daily)
CREATE MATERIALIZED VIEW dashboard_summary AS
SELECT
    -- Today's metrics
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) AS leads_today,
    COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE AND status = 'converted') AS conversions_today,
    SUM(estimated_value) FILTER (WHERE DATE(created_at) = CURRENT_DATE AND status = 'converted') AS revenue_today,

    -- This week's metrics
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) AS leads_this_week,
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE) AND status = 'converted') AS conversions_this_week,

    -- This month's metrics
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) AS leads_this_month,
    COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND status = 'converted') AS conversions_this_month,
    SUM(estimated_value) FILTER (WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND status = 'converted') AS revenue_this_month,

    -- Overall metrics
    COUNT(*) AS total_leads,
    COUNT(*) FILTER (WHERE status = 'converted') AS total_conversions,
    ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'converted') / NULLIF(COUNT(*), 0), 2) AS overall_conversion_rate,

    -- Generated timestamp
    CURRENT_TIMESTAMP AS last_updated
FROM leads;

-- Create index on materialized view
CREATE UNIQUE INDEX idx_dashboard_summary_last_updated ON dashboard_summary (last_updated);

COMMENT ON DATABASE tnt_lead_system IS 'TNT Corporate Lead Automation System - Phase 2 Database Schema';
COMMENT ON TABLE leads IS 'Primary lead tracking with comprehensive business intelligence';
COMMENT ON TABLE lead_interactions IS 'All customer touchpoints and engagement tracking';
COMMENT ON TABLE automated_responses IS 'Email templates and automation sequences';
COMMENT ON TABLE webhook_logs IS 'Integration event logs for debugging and replay';
COMMENT ON MATERIALIZED VIEW dashboard_summary IS 'Pre-calculated dashboard metrics for performance';