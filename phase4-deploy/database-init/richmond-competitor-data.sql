-- TNT Speed-to-Lead System - Production Database Initialization
-- Richmond, VA Competitor Analysis Data
-- Phase 4 Deployment - Database Setup

-- =====================================================
-- RICHMOND LIMOUSINE MARKET COMPETITIVE DATA
-- =====================================================

-- Initialize competitor pricing and service data
INSERT INTO competitors (
    id,
    company_name,
    business_type,
    location,
    years_in_business,
    website,
    phone,
    email,

    -- Airport Pricing
    airport_bwi_price,
    airport_dulles_price,
    airport_national_price,
    airport_richmond_price,

    -- Hourly Rates
    hourly_rate_min,
    hourly_rate_max,

    -- Service Specializations
    primary_specialization,
    secondary_services,

    -- Market Positioning
    response_time_hours,
    weekend_availability,
    online_booking,

    -- Fleet Information
    fleet_size_estimate,
    vehicle_types,

    -- Market Analysis
    estimated_market_share,
    strengths,
    weaknesses,

    -- Created tracking
    created_at,
    updated_at
) VALUES

-- Richmond Limousine (Primary Competitor)
(
    uuid_generate_v4(),
    'Richmond Limousine',
    'Limousine Service',
    'Richmond, VA',
    25,
    'https://richmondlimousine.com',
    '(804) 555-0150',
    'info@richmondlimousine.com',

    -- Airport Pricing
    650.00, -- BWI
    450.00, -- Dulles
    440.00, -- National
    120.00, -- Richmond International

    -- Hourly Rates
    140.00, -- Min hourly
    200.00, -- Max hourly

    -- Specializations
    'General Corporate Transportation',
    '["Airport Transfers", "Corporate Events", "Wedding Transportation"]',

    -- Market Positioning
    24, -- Response time in hours
    false, -- Limited weekend availability
    true, -- Online booking available

    -- Fleet
    15, -- Estimated fleet size
    '["Sedan", "SUV", "Stretch Limousine", "Party Bus"]',

    -- Market Analysis
    35.0, -- Estimated market share %
    '["Established brand", "Large fleet", "Corporate relationships"]',
    '["Slow response time", "Limited weekend coverage", "Higher pricing"]',

    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- James Limousine (Wedding Specialist)
(
    uuid_generate_v4(),
    'James Limousine',
    'Limousine & Wedding Transportation',
    'Richmond, VA',
    18,
    'https://jameslimousine.com',
    '(804) 555-0175',
    'bookings@jameslimousine.com',

    -- Airport Pricing (Similar to Richmond Limo)
    650.00, -- BWI
    450.00, -- Dulles
    440.00, -- National
    120.00, -- Richmond International

    -- Hourly Rates
    135.00, -- Min hourly
    195.00, -- Max hourly

    -- Specializations
    'Wedding Transportation',
    '["Bridal Parties", "Airport Transfers", "Special Events"]',

    -- Market Positioning
    48, -- Slower response time (wedding focus)
    true, -- Weekend availability (wedding market)
    true, -- Online booking

    -- Fleet
    8, -- Smaller, specialized fleet
    '["Luxury Sedan", "Stretch Limousine", "Vintage Cars", "Party Bus"]',

    -- Market Analysis
    20.0, -- Market share focused on weddings
    '["Wedding specialization", "Luxury vehicles", "Weekend availability"]',
    '["Very slow response", "Limited corporate focus", "Higher wedding premiums"]',

    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),

-- Love Limousine (Local Competitor)
(
    uuid_generate_v4(),
    'Love Limousine',
    'Transportation Services',
    'Richmond, VA',
    12,
    'https://lovelimousine.com',
    '(804) 555-0190',
    'contact@lovelimousine.com',

    -- Airport Pricing
    675.00, -- BWI (Higher pricing)
    465.00, -- Dulles
    455.00, -- National
    130.00, -- Richmond International

    -- Hourly Rates
    145.00, -- Min hourly
    210.00, -- Max hourly

    -- Specializations
    'Local Transportation',
    '["Airport Transfers", "Night Out", "Corporate"]',

    -- Market Positioning
    72, -- Manual processing, very slow
    false, -- Limited availability
    false, -- No online booking

    -- Fleet
    6, -- Small fleet
    '["Sedan", "SUV", "Stretch Limousine"]',

    -- Market Analysis
    15.0, -- Smaller market share
    '["Local knowledge", "Personal service"]',
    '["Very slow response", "Manual processes", "Limited availability", "Higher prices"]',

    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- =====================================================
-- TNT LIMOUSINE COMPETITIVE ADVANTAGES DATA
-- =====================================================

-- Initialize TNT company profile and advantages
INSERT INTO company_profile (
    id,
    company_name,
    business_type,
    location,
    years_in_business,
    founded_year,
    website,
    phone,
    email,

    -- Mission and Branding
    mission_statement,
    tagline,
    brand_colors,

    -- Airport Pricing (Competitive)
    airport_bwi_price,
    airport_dulles_price,
    airport_national_price,
    airport_richmond_price,

    -- Hourly Rates (Competitive Range)
    hourly_rate_min,
    hourly_rate_max,

    -- Service Excellence
    primary_specialization,
    service_areas,

    -- Competitive Advantages
    nla_member_since,
    trust_analytica_ranking,
    driver_experience_avg_years,
    airport_certifications,

    -- Automation Advantages
    response_time_guarantee,
    response_time_minutes,
    weekend_coverage,
    automation_enabled,

    -- Fleet and Capacity
    owned_vehicles,
    partner_vehicles,
    total_capacity,
    vehicle_types,

    -- Service Area
    primary_service_radius,
    extended_service_radius,

    -- Certifications and Credentials
    certifications,
    insurance_coverage,
    licenses,

    -- Performance Metrics
    on_time_performance,
    customer_satisfaction,
    repeat_customer_rate,

    -- Staff Information
    total_employees,
    full_time_drivers,
    part_time_drivers,

    created_at,
    updated_at
) VALUES (
    uuid_generate_v4(),
    'TNT Limousine',
    'Premium Transportation Services',
    'Richmond, VA (Glen Allen)',
    33, -- Years in business
    1992, -- Founded year
    'https://tntlimousine.com',
    '(804) 346-4141',
    'info@tntlimousine.com',

    -- Mission and Branding
    'To provide exceptional transportation services with unmatched reliability, professionalism, and customer care.',
    'Driven by Service, Defined by Excellence',
    '{"primary": "#000000", "secondary": "#DC2626", "accent": "#FFFFFF"}',

    -- Airport Pricing (Competitive with value)
    657.00, -- BWI ($7 more than Richmond Limo for superior service)
    460.00, -- Dulles ($10 more for quality)
    450.00, -- National ($10 more for experience)
    125.00, -- Richmond International

    -- Hourly Rates (Competitive range)
    100.00, -- Min hourly (LOWER than competitors)
    208.00, -- Max hourly (comparable premium)

    -- Service Excellence
    'Corporate Transportation & Airport Services',
    '["Richmond Metro", "Central Virginia", "Northern Virginia", "Hampton Roads"]',

    -- Competitive Advantages
    1992, -- NLA member since
    'Top 10 Richmond limousine company (2025)',
    15.5, -- Average driver experience
    '["RIC", "DCA", "IAD", "BWI"]',

    -- Automation Advantages
    'Under 5 minutes guaranteed',
    5, -- Max response time in minutes
    '24/7 including weekends and holidays',
    true, -- Automation enabled

    -- Fleet and Capacity
    8, -- Owned vehicles
    20, -- Ford Transit access
    28, -- Total capacity
    '["Luxury Sedan", "SUV", "Executive Van", "Ford Transit", "Stretch Limousine"]',

    -- Service Area
    50, -- Primary radius miles
    100, -- Extended radius miles

    -- Certifications
    '["National Limousine Association", "Virginia DOT", "Airport Authority Certified"]',
    '$5,000,000 liability coverage',
    '["Virginia Commercial License", "Chauffeur Permits", "Airport Access Permits"]',

    -- Performance Metrics
    99.9, -- On-time performance %
    4.8, -- Customer satisfaction (5.0 scale)
    75.0, -- Repeat customer rate %

    -- Staff
    17, -- Total employees
    12, -- Full-time drivers
    5, -- Part-time drivers

    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- =====================================================
-- COMPETITIVE ANALYSIS CALCULATIONS
-- =====================================================

-- Create competitive analysis view for real-time comparison
CREATE OR REPLACE VIEW competitive_analysis AS
SELECT
    -- TNT Advantages
    'TNT Limousine' as company,
    'ADVANTAGE' as comparison_type,
    'Response Time' as factor,
    '< 5 minutes automated' as tnt_value,
    '24-72 hours manual' as competitor_avg,
    'Automation provides 288x faster response' as advantage_description

UNION ALL

SELECT
    'TNT Limousine',
    'ADVANTAGE',
    'Weekend Coverage',
    '24/7 automated system',
    'Limited or no weekend service',
    'Complete weekend and holiday coverage'

UNION ALL

SELECT
    'TNT Limousine',
    'ADVANTAGE',
    'Experience',
    '33 years (since 1992)',
    '12-25 years average',
    'Longest established premium service'

UNION ALL

SELECT
    'TNT Limousine',
    'ADVANTAGE',
    'Driver Experience',
    '15+ years average',
    '5-10 years average',
    'Most experienced chauffeur team'

UNION ALL

SELECT
    'TNT Limousine',
    'ADVANTAGE',
    'Certifications',
    'NLA Member since 1992',
    'Limited industry certifications',
    'Longest standing industry certification'

UNION ALL

SELECT
    'TNT Limousine',
    'COMPETITIVE',
    'BWI Airport Pricing',
    '$657',
    '$650 (Richmond Limo)',
    'Slight premium for superior service quality'

UNION ALL

SELECT
    'TNT Limousine',
    'COMPETITIVE',
    'Dulles Airport Pricing',
    '$460',
    '$450 (Richmond Limo)',
    'Competitive pricing with added value'

UNION ALL

SELECT
    'TNT Limousine',
    'COMPETITIVE',
    'National Airport Pricing',
    '$450',
    '$440 (Richmond Limo)',
    'Competitive rate with reliability guarantee'

UNION ALL

SELECT
    'TNT Limousine',
    'ADVANTAGE',
    'Hourly Rate Range',
    '$100-208',
    '$135-210 average',
    'Lower starting rate, competitive premium';

-- =====================================================
-- ROI CALCULATOR DATA
-- =====================================================

-- Cost savings calculations for corporate clients
INSERT INTO roi_calculator_factors (
    factor_name,
    factor_category,
    calculation_type,
    base_value,
    comparison_value,
    savings_percentage,
    description
) VALUES

-- Fuel Cost Savings
('Fuel Cost Elimination', 'Cost Savings', 'per_trip', 45.00, 0.00, 100.0,
 'Average fuel cost for 60-mile round trip eliminated'),

-- Parking Fee Savings
('Airport Parking Elimination', 'Cost Savings', 'per_trip', 25.00, 0.00, 100.0,
 'BWI/Dulles long-term parking fees eliminated'),

-- Time Value Calculation
('Executive Time Value', 'Productivity', 'per_hour', 150.00, 0.00, 100.0,
 'Executive can work during transport vs. driving'),

-- Stress Reduction Value
('Stress-Free Travel', 'Quality of Life', 'qualitative', 0.00, 0.00, 0.0,
 'Professional driver handles traffic, parking, navigation'),

-- Group Transportation Efficiency
('Group Transport Efficiency', 'Cost Savings', 'per_person', 50.00, 20.00, 60.0,
 'Cost per person decreases with group bookings'),

-- Professional Image Value
('Corporate Image Enhancement', 'Brand Value', 'qualitative', 0.00, 0.00, 0.0,
 'Professional arrival enhances company image'),

-- Safety and Insurance
('Professional Driver Safety', 'Risk Reduction', 'qualitative', 0.00, 0.00, 0.0,
 'Professional drivers with clean records and training'),

-- Reliability Guarantee
('On-Time Guarantee', 'Reliability', 'percentage', 99.9, 85.0, 14.9,
 'TNT 99.9% on-time vs 85% average for self-drive'),

-- 24/7 Availability
('Round-the-Clock Service', 'Availability', 'hours', 24.0, 10.0, 140.0,
 'TNT available 24/7 vs typical 10-hour business day');

-- =====================================================
-- LEAD SCORING FACTORS FOR RICHMOND MARKET
-- =====================================================

-- Initialize lead scoring factors specific to Richmond market
INSERT INTO scoring_factors (
    factor_name,
    factor_category,
    weight,
    calculation_method,
    value_mappings,
    market_specific_notes,
    active
) VALUES

-- Company Size Estimation (Richmond-specific)
('Company Size Richmond', 'company', 15, 'range',
 '{"1-10 employees": 5, "11-50 employees": 10, "51-200 employees": 15, "200+ employees": 20}',
 'Richmond market: Focus on mid-size companies (50-200) for corporate transportation',
 true),

-- Service Type Priority (Richmond preferences)
('Service Type Richmond', 'service', 25, 'exact_match',
 '{"corporate": 25, "airport": 22, "events": 18, "wedding": 15, "hourly": 12}',
 'Richmond market shows high corporate and airport demand',
 true),

-- Geographic Proximity (Richmond-centric)
('Geographic Proximity Richmond', 'geographic', 20, 'range',
 '{"0-15 miles": 20, "16-30 miles": 15, "31-50 miles": 10, "51-100 miles": 5, "100+ miles": 2}',
 'TNT based in Glen Allen - closer proximity scores higher',
 true),

-- Timing and Urgency (Business hours consideration)
('Timing Urgency Richmond', 'timing', 10, 'calculation',
 '{"same_day_business_hours": 10, "same_day_after_hours": 8, "next_day": 6, "future_booking": 4}',
 'Richmond business community values quick response during business hours',
 true),

-- Industry Type (Richmond market focus)
('Industry Type Richmond', 'company', 15, 'exact_match',
 '{"healthcare": 15, "legal": 14, "financial": 13, "government": 12, "manufacturing": 10, "other": 8}',
 'Richmond has strong healthcare, legal, and financial sectors',
 true),

-- Competition Response Delay
('Competition Response Advantage', 'competitive', 15, 'calculation',
 '{"weekend_inquiry": 15, "after_hours_inquiry": 12, "holiday_inquiry": 15, "business_hours": 8}',
 'TNT automation advantage most valuable when competitors are unavailable',
 true);

-- =====================================================
-- EMAIL TEMPLATE PERFORMANCE TRACKING
-- =====================================================

-- Initialize email template performance baselines
INSERT INTO email_template_performance (
    template_name,
    template_type,
    target_audience,
    baseline_open_rate,
    baseline_click_rate,
    baseline_response_rate,
    industry_benchmark_open_rate,
    industry_benchmark_click_rate,
    notes
) VALUES

('Corporate Instant Response', 'automated_response', 'corporate_leads',
 0.35, 0.08, 0.15, 0.22, 0.04,
 'Corporate emails typically have higher engagement than consumer'),

('Airport Service Quote', 'service_specific', 'airport_travelers',
 0.40, 0.12, 0.20, 0.25, 0.06,
 'Airport travelers highly engaged due to immediate need'),

('Wedding Transportation', 'service_specific', 'wedding_planners',
 0.45, 0.15, 0.25, 0.30, 0.08,
 'Wedding industry has high engagement rates'),

('Follow-up Day 3', 'nurture_sequence', 'all_leads',
 0.25, 0.05, 0.08, 0.18, 0.03,
 'Follow-up emails have lower but still valuable engagement'),

('Follow-up Day 7', 'nurture_sequence', 'warm_leads',
 0.20, 0.04, 0.06, 0.15, 0.02,
 'Week follow-up targets warmer prospects'),

('Follow-up Day 14', 'final_outreach', 'lukewarm_leads',
 0.15, 0.03, 0.04, 0.12, 0.015,
 'Final attempt to re-engage before marking inactive');

-- =====================================================
-- SYSTEM CONFIGURATION
-- =====================================================

-- Set up system configuration parameters
INSERT INTO system_config (
    config_key,
    config_value,
    config_type,
    description,
    environment
) VALUES

-- Response Time Configuration
('max_response_time_minutes', '5', 'integer', 'Maximum automated response time guarantee', 'production'),
('response_time_warning_minutes', '3', 'integer', 'Warning threshold for response times', 'production'),
('response_time_critical_minutes', '5', 'integer', 'Critical alert threshold', 'production'),

-- Business Hours (Richmond, VA timezone)
('business_hours_start', '08:00', 'time', 'Business hours start time (EST)', 'production'),
('business_hours_end', '18:00', 'time', 'Business hours end time (EST)', 'production'),
('business_days', 'monday,tuesday,wednesday,thursday,friday', 'string', 'Business days of week', 'production'),

-- Lead Scoring Thresholds
('high_value_threshold', '1000', 'decimal', 'High-value lead threshold in USD', 'production'),
('critical_score_threshold', '80', 'integer', 'Critical lead score threshold', 'production'),
('hot_lead_score_threshold', '60', 'integer', 'Hot lead score threshold', 'production'),

-- Email Configuration
('from_email', 'automated@tntlimousine.com', 'string', 'System from email address', 'production'),
('reply_to_email', 'info@tntlimousine.com', 'string', 'Reply-to email address', 'production'),
('support_email', 'support@tntlimousine.com', 'string', 'Support email address', 'production'),

-- Notification Configuration
('manager_sms_enabled', 'true', 'boolean', 'Enable SMS notifications to managers', 'production'),
('slack_notifications_enabled', 'true', 'boolean', 'Enable Slack notifications', 'production'),
('email_notifications_enabled', 'true', 'boolean', 'Enable email notifications', 'production'),

-- Integration Settings
('zoho_sync_frequency_minutes', '15', 'integer', 'Zoho CRM sync frequency', 'production'),
('fasttrack_sync_frequency_minutes', '30', 'integer', 'FastTrack sync frequency', 'production'),
('webhook_retry_attempts', '3', 'integer', 'Number of webhook retry attempts', 'production');

-- =====================================================
-- PERFORMANCE BENCHMARKS
-- =====================================================

-- Set performance benchmarks for monitoring
INSERT INTO performance_benchmarks (
    metric_name,
    metric_type,
    target_value,
    warning_threshold,
    critical_threshold,
    unit,
    description
) VALUES

('Lead Response Time', 'response_time', 300, 180, 300, 'seconds', 'Time from lead submission to automated response'),
('Email Delivery Rate', 'percentage', 98.0, 95.0, 90.0, 'percent', 'Percentage of emails successfully delivered'),
('System Uptime', 'availability', 99.9, 99.5, 99.0, 'percent', 'System availability percentage'),
('API Response Time', 'response_time', 500, 1000, 2000, 'milliseconds', 'Average API endpoint response time'),
('Database Query Time', 'response_time', 100, 200, 500, 'milliseconds', 'Average database query execution time'),
('Lead Conversion Rate', 'percentage', 25.0, 20.0, 15.0, 'percent', 'Percentage of leads that convert to bookings'),
('Weekend Response Coverage', 'percentage', 100.0, 95.0, 90.0, 'percent', 'Percentage of weekend leads responded to within 5 minutes');

-- =====================================================
-- AUDIT AND COMPLIANCE
-- =====================================================

-- Create audit log for data changes
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by UUID,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for audit log
CREATE INDEX idx_audit_log_table_name ON audit_log (table_name);
CREATE INDEX idx_audit_log_changed_at ON audit_log (changed_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log (action);

COMMENT ON TABLE audit_log IS 'Audit trail for all data modifications in TNT Speed-to-Lead system';

-- =====================================================
-- INITIAL DATA VALIDATION
-- =====================================================

-- Validate competitor data
SELECT
    company_name,
    airport_bwi_price,
    hourly_rate_min,
    response_time_hours
FROM competitors
ORDER BY airport_bwi_price;

-- Validate TNT profile
SELECT
    company_name,
    tagline,
    response_time_guarantee,
    nla_member_since,
    trust_analytica_ranking
FROM company_profile
WHERE company_name = 'TNT Limousine';

-- Validate competitive analysis
SELECT
    factor,
    tnt_value,
    competitor_avg,
    advantage_description
FROM competitive_analysis
WHERE comparison_type = 'ADVANTAGE'
ORDER BY factor;

-- Database initialization complete
-- Richmond competitor data loaded
-- TNT competitive advantages configured
-- ROI calculator factors established
-- Lead scoring optimized for Richmond market
-- Performance benchmarks set
-- Audit logging enabled