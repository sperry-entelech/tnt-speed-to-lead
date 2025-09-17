# TNT Corporate Lead System - Technical Architecture Overview

## Executive Summary

The TNT Corporate Lead Automation System is designed to eliminate the $15K+ monthly revenue loss from delayed lead responses by implementing a sub-5-minute automated response system. This Phase 2 document outlines the complete technical architecture following enterprise-grade patterns for scalability, reliability, and maintainability.

### Business Impact Goals
- **Response Time**: Reduce from 48-72 hours to <5 minutes (automated)
- **Revenue Recovery**: Capture 3-5 additional corporate bookings monthly
- **Conversion Rate**: Achieve 25%+ inquiry-to-booking conversion
- **Coverage**: Provide 24/7 weekend and holiday lead capture

## High-Level Architecture Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Website Form  │    │  Mobile Users   │    │ Direct Inquiries │
│   Submissions   │    │   & Social      │    │   Phone/Email   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    Load Balancer/CDN     │
                    │    (Cloudflare/AWS)      │
                    └─────────────┬─────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │     API Gateway          │
                    │  Authentication/Rate     │
                    │     Limiting/Logging     │
                    └─────────────┬─────────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
    ┌──────▼──────┐    ┌─────────▼─────────┐    ┌─────▼─────┐
    │  Frontend   │    │   Backend API     │    │ Webhooks  │
    │  Dashboard  │    │   (Express.js)    │    │ Processor │
    │ (Next.js)   │    │                   │    │           │
    └─────────────┘    └─────────┬─────────┘    └─────┬─────┘
                                 │                     │
                       ┌─────────▼─────────┐           │
                       │   Business Logic  │           │
                       │   - Lead Scoring  │           │
                       │   - Automation    │           │
                       │   - Notifications │           │
                       └─────────┬─────────┘           │
                                 │                     │
                       ┌─────────▼─────────┐           │
                       │  Queue System     │           │
                       │  (Bull + Redis)   │           │
                       └─────────┬─────────┘           │
                                 │                     │
           ┌─────────────────────┼─────────────────────┼─────────────┐
           │                     │                     │             │
    ┌──────▼──────┐    ┌─────────▼─────────┐    ┌─────▼─────┐ ┌─────▼─────┐
    │ PostgreSQL  │    │  Integration Hub  │    │   Email   │ │    SMS    │
    │  Database   │    │                   │    │ Automation│ │ Notifica- │
    │             │    └─────────┬─────────┘    │ (richweb) │ │   tions   │
    └─────────────┘              │              └───────────┘ └───────────┘
                                 │
           ┌─────────────────────┼─────────────────────┐
           │                     │                     │
    ┌──────▼──────┐    ┌─────────▼─────────┐    ┌─────▼─────┐
    │   Zoho CRM  │    │ FastTrack InVision│    │   Slack   │
    │ Integration │    │    Integration    │    │Integration│
    └─────────────┘    └───────────────────┘    └───────────┘
```

## Technology Stack

### Frontend Layer
- **Framework**: Next.js 14 (React 18+)
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand for global state
- **Data Fetching**: TanStack Query (React Query)
- **Charts/Analytics**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (optimized for Next.js)

### Backend Layer
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma (type-safe database access)
- **Queue System**: Bull Queue + Redis
- **Caching**: Redis (separate from queue)
- **Authentication**: JWT + refresh tokens
- **Email**: Nodemailer + richweb.net SMTP
- **Deployment**: Railway/Render (backend services)

### Infrastructure Layer
- **Database Hosting**: Railway PostgreSQL / Azure Database
- **Redis Hosting**: Railway Redis / Azure Cache
- **File Storage**: AWS S3 / Azure Blob Storage
- **CDN**: Cloudflare
- **Monitoring**: Sentry + custom analytics
- **SSL**: Let's Encrypt (auto-renewing)

## Data Flow Architecture

### Lead Capture Flow
```
Website Form → Webhook Validation → Lead Scoring → Database Insert
     ↓
Automated Response Selection → Email Queue → SMTP Delivery
     ↓
High-Value Detection → Manager Notification → SMS/Slack Alert
     ↓
CRM Integration → Zoho API → FastTrack Sync
```

### Real-time Processing Pipeline
1. **Form Submission** (0-1 seconds)
   - Webhook receives form data
   - Input validation and sanitization
   - Duplicate detection and deduplication

2. **Lead Analysis** (1-2 seconds)
   - Lead scoring algorithm execution
   - Geographic validation (service area check)
   - Company analysis (size estimation, industry classification)
   - Competitive positioning assessment

3. **Automated Response** (2-5 seconds)
   - Template selection based on service type and score
   - Personalization with company and contact details
   - Email composition and queuing
   - Delivery tracking setup

4. **Notification Processing** (3-5 seconds)
   - High-value lead detection (>$1,000 estimated value)
   - Manager SMS notification
   - Slack channel notification
   - Dashboard real-time update

5. **Integration Sync** (5-300 seconds)
   - Zoho CRM lead creation
   - FastTrack customer profile sync
   - Webhook confirmation and logging

## Database Architecture

### Core Tables Overview

#### Lead Management
- **`leads`**: Primary lead data with scoring and status
- **`lead_interactions`**: All touchpoints and engagement history
- **`email_sequences`**: Follow-up automation tracking

#### Automation Engine
- **`automated_responses`**: Email templates and trigger logic
- **`notifications`**: Manager alerts and action items
- **`webhook_logs`**: Event processing audit trail

#### Integration Layer
- **`external_integrations`**: Connection status and configuration
- **`daily_metrics`**: Performance analytics aggregation
- **`scoring_factors`**: Lead scoring algorithm weights

#### User Management
- **`users`**: System access and role management

### Performance Optimization
- **Indexes**: Optimized for common query patterns
- **Materialized Views**: Pre-calculated dashboard metrics
- **Partitioning**: Time-based partitioning for historical data
- **Connection Pooling**: PostgreSQL connection optimization

## API Architecture

### REST Endpoint Structure
```
/api/v2/leads                    # Lead CRUD operations
/api/v2/automation               # Email automation management
/api/v2/analytics                # Performance metrics
/api/v2/integrations             # External system status
/webhooks/form-submission        # Primary lead capture
/webhooks/email-engagement       # Email tracking
/webhooks/crm-updates           # Bidirectional CRM sync
```

### Authentication & Security
- **JWT Tokens**: Short-lived access tokens (15 minutes)
- **Refresh Tokens**: Long-lived refresh tokens (7 days)
- **Role-Based Access**: Admin, Manager, Dispatcher roles
- **API Rate Limiting**: Per-user and global limits
- **Request Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM parameterized queries

## Integration Architecture

### Zoho CRM Integration
```python
# Configuration Example
ZOHO_CONFIG = {
    "client_id": "zoho_client_id",
    "client_secret": "encrypted_secret",
    "refresh_token": "encrypted_refresh_token",
    "base_url": "https://www.zohoapis.com/crm/v2",
    "scopes": ["ZohoCRM.modules.ALL", "ZohoCRM.settings.READ"],
    "sync_frequency": "real_time",
    "retry_attempts": 3,
    "timeout": 30000
}
```

**Data Mappings**:
- TNT `leads` → Zoho `Leads` module
- TNT `lead_interactions` → Zoho `Activities`
- TNT `automated_responses` → Zoho `Email Templates`

### FastTrack InVision Integration
```python
FASTTRACK_CONFIG = {
    "api_endpoint": "https://api.fasttrack.com/v1",
    "api_key": "encrypted_api_key",
    "sync_frequency": "15_minutes",
    "batch_size": 50,
    "vehicle_availability_check": True,
    "automatic_booking_creation": False  # Manual approval required
}
```

**Sync Operations**:
- Customer profile synchronization
- Booking status updates
- Vehicle availability queries
- Trip assignment notifications

### richweb.net SMTP Configuration
```python
SMTP_CONFIG = {
    "host": "mail.richweb.net",
    "port": 587,
    "security": "STARTTLS",
    "auth_required": True,
    "username": "automated@tntlimousine.com",
    "password": "encrypted_password",
    "from_address": "TNT Limousine <noreply@tntlimousine.com>",
    "tracking_enabled": True,
    "bounce_handling": True,
    "daily_limit": 5000
}
```

## Lead Scoring Algorithm

### Scoring Factors and Weights
```sql
-- Lead Scoring Calculation
FUNCTION calculate_lead_score(lead_record) RETURNS INTEGER AS:
  Base Score: 0

  + Company Name Present: 10 points
  + Estimated Value Tier:
    - $1,000+: 30 points
    - $500-999: 20 points
    - $0-499: 10 points

  + Service Type Priority:
    - Corporate: 25 points
    - Airport: 20 points
    - Events: 15 points
    - Wedding: 15 points
    - Hourly: 10 points

  + Geographic Proximity:
    - 0-25 miles: 15 points
    - 26-50 miles: 10 points
    - 51-100 miles: 5 points
    - 100+ miles: 0 points

  + Group Size Factor:
    - 8+ passengers: 15 points
    - 4-7 passengers: 10 points
    - 1-3 passengers: 5 points

  Maximum Score: 100 points
```

### Score-Based Actions
- **80-100 points**: Critical priority, immediate manager notification
- **60-79 points**: High priority, automated response + follow-up sequence
- **40-59 points**: Medium priority, standard automated response
- **0-39 points**: Low priority, basic acknowledgment

## Email Automation System

### Template Architecture
```typescript
interface EmailTemplate {
  id: uuid;
  name: string;
  subject: string;
  content: string;
  htmlContent?: string;
  triggerConditions: {
    serviceTypes: ServiceType[];
    leadScoreMin: number;
    leadScoreMax: number;
    immediate: boolean;
    delayMinutes?: number;
  };
  personalizationFields: string[];
  abTestVariant?: string;
  performance: {
    sentCount: number;
    openRate: number;
    clickRate: number;
    responseRate: number;
  };
}
```

### Automation Sequences
1. **Immediate Response** (0-5 minutes)
   - Corporate inquiry acknowledgment
   - Service overview with competitive advantages
   - ROI calculator link
   - Direct booking contact information

2. **Follow-up Sequence** (3, 7, 14 days)
   - Day 3: Additional service information and case studies
   - Day 7: Special offers and volume discounts
   - Day 14: Final outreach with alternative solutions

3. **High-Value Lead Process**
   - Manager SMS notification within 2 minutes
   - Premium template with expedited response
   - Personal follow-up scheduling

## Performance Requirements

### Response Time Targets
- **API Response Time**: <500ms for standard requests
- **Database Query Time**: <100ms for indexed queries
- **Email Delivery**: <5 minutes guaranteed
- **Dashboard Load Time**: <3 seconds
- **Lead Processing**: End-to-end <5 minutes

### Scalability Specifications
- **Concurrent Users**: 100+ during peak season
- **Lead Volume**: 1,000+ leads per month
- **Email Volume**: 5,000+ emails per month
- **Storage Growth**: 10GB per year (estimated)

### Availability Requirements
- **System Uptime**: 99.9% availability
- **Database Backup**: Real-time replication + daily backups
- **Disaster Recovery**: <4 hour RTO, <1 hour RPO
- **Monitoring**: 24/7 automated monitoring with alerts

## Security Architecture

### Data Protection
- **Encryption at Rest**: AES-256 for database and file storage
- **Encryption in Transit**: TLS 1.3 for all communications
- **PII Handling**: GDPR-compliant data processing
- **Access Logging**: Complete audit trail for all data access

### Authentication & Authorization
```typescript
interface UserRoles {
  admin: {
    leads: ['create', 'read', 'update', 'delete'];
    users: ['create', 'read', 'update', 'delete'];
    settings: ['read', 'update'];
    analytics: ['read'];
  };
  manager: {
    leads: ['create', 'read', 'update'];
    analytics: ['read'];
    automation: ['read', 'update'];
  };
  dispatcher: {
    leads: ['read', 'update'];
    interactions: ['create', 'read'];
  };
}
```

### Security Monitoring
- **Failed Login Tracking**: Account lockout after 5 attempts
- **API Rate Limiting**: Per-user and global limits
- **Intrusion Detection**: Automated security scanning
- **Vulnerability Management**: Regular security updates

## Monitoring & Analytics

### Application Performance Monitoring
- **Error Tracking**: Sentry for exception monitoring
- **Performance Metrics**: Custom dashboards for business KPIs
- **Database Monitoring**: Query performance and connection health
- **Integration Health**: External API status and response times

### Business Intelligence
- **Lead Conversion Funnel**: Real-time conversion tracking
- **Revenue Attribution**: Source-to-revenue mapping
- **Response Time Analytics**: Performance against 5-minute target
- **Competitive Analysis**: Pricing and response time benchmarking

### Key Performance Indicators
```typescript
interface BusinessKPIs {
  responseTime: {
    average: number;           // Target: <5 minutes
    under5MinutesRate: number; // Target: >95%
    weekendCoverage: number;   // Target: 100%
  };
  conversion: {
    leadToContact: number;     // Target: >80%
    contactToQualified: number; // Target: >50%
    qualifiedToConverted: number; // Target: >50%
    overallConversion: number; // Target: >25%
  };
  revenue: {
    monthlyGrowth: number;     // Target: +$15K/month
    averageDealSize: number;   // Track trends
    pipelineValue: number;     // Forward-looking revenue
  };
}
```

## Deployment Architecture

### Environment Strategy
- **Development**: Local development with Docker Compose
- **Staging**: Full production replica for testing
- **Production**: Redundant, auto-scaling infrastructure

### CI/CD Pipeline
```yaml
# GitHub Actions Workflow
name: TNT Lead System Deployment
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Setup Node.js 18
      - Install dependencies
      - Run unit tests
      - Run integration tests
      - Security scanning

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - Build Docker images
      - Deploy to staging
      - Run smoke tests
      - Deploy to production
      - Health check verification
```

### Infrastructure as Code
- **Terraform**: Infrastructure provisioning
- **Docker**: Application containerization
- **Kubernetes/Docker Compose**: Container orchestration
- **GitHub Actions**: Automated deployment pipeline

## Data Backup & Recovery

### Backup Strategy
- **Database**: Real-time replication + automated daily backups
- **File Storage**: Versioned backups with 30-day retention
- **Configuration**: Infrastructure and application config backups
- **Disaster Recovery**: Multi-region backup storage

### Recovery Procedures
- **RTO (Recovery Time Objective)**: <4 hours
- **RPO (Recovery Point Objective)**: <1 hour
- **Backup Testing**: Monthly restore testing
- **Documentation**: Step-by-step recovery procedures

## Compliance & Governance

### Data Privacy
- **GDPR Compliance**: Right to deletion, data portability
- **CCPA Compliance**: California privacy requirements
- **Data Retention**: Configurable retention policies
- **Consent Management**: Explicit consent tracking

### Business Continuity
- **Redundancy**: Multiple availability zones
- **Failover**: Automated failover procedures
- **Load Balancing**: Traffic distribution across instances
- **Health Monitoring**: Automated health checks and alerting

## Future Scalability Considerations

### Phase 3+ Enhancements
- **AI-Powered Lead Scoring**: Machine learning optimization
- **Multi-Language Support**: Spanish language automation
- **Mobile App**: Native iOS/Android dispatcher app
- **Advanced Analytics**: Predictive analytics and forecasting

### Integration Expansion
- **Additional CRM Systems**: Salesforce, HubSpot integration
- **Payment Processing**: Stripe/Square integration
- **Accounting Systems**: QuickBooks Online automation
- **Marketing Platforms**: Mailchimp, Constant Contact integration

---

## Implementation Timeline

This Phase 2 architecture document provides the technical foundation for:

**Phase 3**: Frontend dashboard + backend API + integration development (5 days)
**Phase 4**: TNT environment deployment with live URLs (2 days)
**Phase 5**: Comprehensive QA testing suite (2 days)
**Phase 6**: Complete handoff package with training materials (1 day)

**Total Development Timeline**: 10 days for complete system deployment

The architecture is designed for immediate implementation while supporting future growth and feature expansion as TNT's business scales.