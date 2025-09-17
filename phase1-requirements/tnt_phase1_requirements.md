# TNT Corporate Lead Capture System - Phase 1 Requirements Document

## BUSINESS CONTEXT & PROBLEM ANALYSIS

### Company Profile: TNT Limousine
- **Location**: Richmond, VA (Glen Allen)
- **Current Revenue**: $15K-50K monthly (seasonal fluctuation)
- **Target Revenue**: Consistent $40K+ monthly
- **Fleet**: 8 owned vehicles + 20 Ford Transit access
- **Service Area**: 50-100 mile radius from Richmond
- **Mission**: "Driven by Service, Defined by Excellence"

### Critical Revenue Problem
**Problem Cost Analysis** (Nick Saraev Framework):
- **Current State**: Weekend/evening leads go 48-72 hours without response
- **Revenue Impact**: Losing 3-5 corporate bookings monthly = $15K+ lost revenue
- **Seasonal Volatility**: $35K revenue swings due to inconsistent lead capture
- **Competition**: Richmond Limousine, James Limousine, Love Limousine responding faster

### Existing Technology Stack
- **Dispatch**: FastTrack InVision
- **CRM**: Zoho CRM (recently implemented)
- **Email**: richweb.net SMTP services
- **Website**: Lead management system with basic form capture
- **Accounting**: Proprietary system + QuickBooks integration

## SYSTEM REQUIREMENTS SPECIFICATION

### Core Functionality Requirements

#### 1. Instant Lead Capture & Classification
```
TRIGGER: Website form submission
PROCESSING:
- Corporate detection logic (company name field + service type)
- Lead scoring algorithm (budget, group size, service frequency)
- Geographic validation (service area confirmation)
- Competition analysis integration
```

#### 2. Automated Response System
```
RESPONSE TIME: Maximum 5 minutes
EMAIL TEMPLATES:
- Corporate inquiry acknowledgment with TNT branding
- Service overview with competitive advantages
- ROI calculator showing savings vs competitors
- Booking process next steps
- Follow-up sequence for non-responders (3, 7, 14 days)
```

#### 3. Manager Notification System
```
HIGH-VALUE TRIGGERS:
- Corporate bookings >$1,000 estimated value
- Multi-vehicle requests
- Recurring service inquiries
- Premium service requests (airport, corporate travel)

NOTIFICATION CHANNELS:
- Instant SMS to management
- Email with lead details and recommended pricing
- Slack integration for dispatch team
```

#### 4. Integration Requirements
```
FASTTRACK INVISION:
- Bidirectional data sync for bookings
- Customer profile updates
- Vehicle availability checking
- Trip assignment automation

ZOHO CRM:
- Lead creation and tracking
- Follow-up task automation
- Revenue pipeline management
- Customer relationship history

RICHWEB.NET:
- SMTP configuration for branded emails
- Delivery tracking and analytics
- Template management system
```

### Performance Benchmarks & Success Metrics

#### Response Time Optimization
- **Current**: 2-48 hours (manual process)
- **Target**: 5 minutes maximum (automated)
- **Weekend Coverage**: 24/7 automated response capability

#### Conversion Rate Improvements
- **Current Corporate Conversion**: Unknown (no tracking)
- **Target**: 25%+ inquiry-to-booking rate
- **Revenue Impact**: 3-5 additional corporate bookings monthly

#### Competitive Positioning Data
```
TNT ADVANTAGES TO HIGHLIGHT:
- National Limousine Association member since 1992
- Trust Analytica Top 10 Richmond limousine company (2025)
- 17 employees with experienced drivers (15+ years)
- Certified airport access (Richmond, Dulles, Reagan, BWI)
- Strong capitalization for rapid scaling
```

## TECHNICAL ARCHITECTURE REQUIREMENTS

### Frontend Dashboard Components
```
MANAGER DASHBOARD:
- Real-time lead notifications
- Corporate prospect scoring
- Revenue pipeline visualization
- Response time analytics
- Competitive analysis tools

DISPATCHER INTERFACE:
- Lead-to-booking conversion tracking
- Customer communication history
- Vehicle assignment integration
- Follow-up task management
```

### Backend Processing Requirements
```
LEAD SCORING ALGORITHM:
- Company size estimation (employee count, industry)
- Service frequency prediction (one-time vs recurring)
- Budget tier classification ($500-1000, $1000-5000, $5000+)
- Geographic priority (Richmond metro vs extended area)
- Seasonal demand factor (wedding season, holiday events)

EMAIL AUTOMATION ENGINE:
- Template personalization with company details
- Send time optimization (business hours only)
- Delivery tracking and engagement metrics
- A/B testing capability for subject lines
```

### Integration Architecture
```
WEBHOOK ENDPOINTS:
- Website form submission handler
- FastTrack booking status updates
- Email engagement tracking
- Customer response processing

API CONNECTIONS:
- Zoho CRM lead creation
- FastTrack customer sync
- richweb.net email sending
- SMS notification service

DATABASE SCHEMA:
- Lead tracking with full attribution
- Customer interaction history
- Revenue analytics and reporting
- Competitive analysis data storage
```

## COMPETITIVE ANALYSIS & ROI CALCULATOR

### Local Competitor Pricing Data
```
RICHMOND LIMOUSINE:
- Airport runs: BWI $650, Dulles $450, National $440
- Hourly rates: $140-200 depending on vehicle

JAMES LIMOUSINE:
- Similar pricing structure to Richmond
- Focus on wedding market

TNT COMPETITIVE ADVANTAGES:
- Airport runs: BWI $657, Dulles $460, National $450
- Hourly rates: $100-208 depending on vehicle
- Superior vehicle quality and driver experience
- Faster response times with automation
```

### ROI Calculator Components
```
SAVINGS ANALYSIS:
- Fuel cost calculations vs self-drive
- Parking fee elimination
- Professional driver safety premium
- Time value optimization for executives
- Group transportation efficiency

COMPARISON MATRIX:
- Side-by-side pricing with competitors
- Service level differentiation
- Certification and safety credentials
- Customer review integration
```

## BRANDING & MESSAGING REQUIREMENTS

### TNT Brand Guidelines
```
COLORS: Black and Red
LOGO: TNT lettering
MESSAGING TONE: Professional, reliable, experienced
KEY PHRASES:
- "Driven by Service, Defined by Excellence"
- "33 years of transportation excellence"
- "Richmond's most experienced chauffeurs"
```

### Email Template Requirements
```
CORPORATE INQUIRY RESPONSE:
Subject: "TNT Limousine - Your Transportation Request [5-Minute Response]"
- Professional greeting with company name personalization
- Service overview highlighting competitive advantages
- ROI calculator link for cost comparison
- Direct booking link with preferred customer pricing
- Contact information with guaranteed response times

FOLLOW-UP SEQUENCE:
Day 3: Additional service information and case studies
Day 7: Special offers and volume discounts
Day 14: Final outreach with alternative solutions
```

## DEPLOYMENT ENVIRONMENT SPECIFICATIONS

### Hosting Requirements
```
PERFORMANCE:
- Sub-3-second page load times
- 99.9% uptime guarantee
- SSL certificate for secure data transmission
- Mobile-responsive design for tablet/phone access

SCALABILITY:
- Handle 100+ concurrent users during peak season
- Auto-scaling for traffic spikes
- Database optimization for large lead volumes
- CDN integration for fast global access
```

### Security Requirements
```
DATA PROTECTION:
- Customer information encryption
- PCI compliance for payment processing
- GDPR-compliant data handling
- Regular security audits and updates

ACCESS CONTROL:
- Role-based permissions (manager, dispatcher, admin)
- Two-factor authentication for admin access
- Audit trail for all system modifications
- Secure API key management
```

## SUCCESS CRITERIA & VALIDATION

### Measurable Outcomes (30-Day Validation)
```
RESPONSE TIME METRICS:
- Average response time under 5 minutes
- 100% weekend/holiday coverage
- Zero missed corporate inquiries

CONVERSION METRICS:
- 25%+ inquiry-to-booking conversion rate
- 20% increase in average booking value
- 3-5 additional corporate bookings monthly

REVENUE IMPACT:
- $10K+ monthly revenue increase
- Reduced seasonal revenue volatility
- Improved cash flow predictability
```

### Quality Assurance Checklist
```
FUNCTIONAL TESTING:
- End-to-end lead flow validation
- Email deliverability verification
- Integration accuracy with existing systems
- Manager notification reliability

USER ACCEPTANCE TESTING:
- Dispatcher workflow efficiency
- Manager dashboard usability
- Customer experience validation
- Mobile device compatibility
```

## HANDOFF & DOCUMENTATION REQUIREMENTS

### Training Materials Needed
```
DISPATCHER TRAINING:
- Lead qualification criteria
- Response template customization
- Follow-up scheduling procedures
- Integration troubleshooting

MANAGER TRAINING:
- Dashboard analytics interpretation
- ROI calculator customization
- Competitive analysis updates
- Performance metrics monitoring
```

### Maintenance Documentation
```
SYSTEM ADMINISTRATION:
- Email template updates
- Pricing calculator modifications
- Integration credential management
- Performance monitoring procedures

BUSINESS PROCESS DOCUMENTATION:
- Lead handling standard operating procedures
- Escalation protocols for high-value prospects
- Seasonal demand adjustment procedures
- Competitive analysis update schedules
```

---

## NEXT PHASE PREPARATION

This Phase 1 requirements document provides the foundation for Claude Code to generate:

**Phase 2**: Complete system architecture with detailed technical specifications
**Phase 3**: Frontend dashboard + backend API + integration connectors
**Phase 4**: TNT environment deployment with live URLs
**Phase 5**: Comprehensive QA testing suite
**Phase 6**: Complete handoff package with training materials

**Estimated Timeline**: 10-14 days for complete system deployment
**Expected ROI**: System pays for itself with 1-2 additional corporate bookings monthly