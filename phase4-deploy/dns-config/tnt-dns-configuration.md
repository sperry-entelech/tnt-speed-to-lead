# TNT Limousine DNS Configuration Guide
## Speed-to-Lead System Deployment - Phase 4

### Overview
This document provides step-by-step DNS configuration instructions for TNT Limousine to set up the Speed-to-Lead system subdomains with SSL certificates and email routing.

---

## DNS Records Required

### Primary Domain: tntlimousine.com

| Record Type | Name | Value | TTL | Purpose |
|-------------|------|--------|-----|---------|
| **A** | @ | `192.0.2.1` | 300 | Root domain (current website) |
| **CNAME** | leads | `tnt-speed-lead.vercel.app` | 300 | Lead management dashboard |
| **CNAME** | api | `tnt-backend.railway.app` | 300 | API endpoints |
| **CNAME** | status | `tnt-status.github.io` | 300 | System status page |
| **MX** | @ | `mail.tntlimousine.com` | 300 | Email routing (see email section) |

### SSL Certificate Configuration
- **Type**: Let's Encrypt Wildcard Certificate
- **Coverage**: `*.tntlimousine.com` and `tntlimousine.com`
- **Auto-renewal**: Enabled (90-day cycle)
- **Security Level**: TLS 1.3 minimum

---

## Email Provider Research & Configuration

### Current Email Investigation Required

**ACTION NEEDED FROM TNT:**
1. **Identify Current Email Provider**
   - Who hosts your current email (info@tntlimousine.com)?
   - Do you use GoDaddy, Office 365, Gmail Workspace, or other?
   - What are your current MX records?

2. **Access Requirements**
   - Admin access to email hosting control panel
   - Ability to create new email addresses
   - SMTP configuration permissions

### Recommended Email Setup Options

#### Option 1: Use Current Provider (Recommended)
```
New Email Addresses Needed:
- automated@tntlimousine.com (system automation)
- noreply@tntlimousine.com (no-reply responses)
- alerts@tntlimousine.com (manager notifications)

SMTP Configuration Required:
- Host: [Your current SMTP server]
- Port: 587 (STARTTLS) or 465 (SSL)
- Username: automated@tntlimousine.com
- Password: [Secure password]
- Authentication: Yes
```

#### Option 2: Google Workspace Business
```
Cost: $6/user/month
Benefits:
- Professional email addresses
- 30GB storage per user
- Built-in security features
- Easy SMTP configuration

SMTP Settings:
- Host: smtp.gmail.com
- Port: 587
- Security: STARTTLS
- Authentication: OAuth2 or App Password
```

#### Option 3: Microsoft 365 Business Basic
```
Cost: $8/user/month
Benefits:
- Professional email with Outlook
- 50GB mailbox storage
- Advanced security features
- Teams integration

SMTP Settings:
- Host: smtp.office365.com
- Port: 587
- Security: STARTTLS
- Authentication: Modern Auth
```

---

## Production Database Setup

### PostgreSQL Configuration
```sql
-- Production Database: Railway PostgreSQL
-- Size: 4GB RAM, 50GB Storage
-- Region: US East (Virginia) - closest to Richmond, VA
-- Backup: Daily automated backups at 2:00 AM EST

-- Richmond Competitor Data Initialization
INSERT INTO competitors (name, airport_bwi, airport_dulles, airport_national, hourly_min, hourly_max, specialization) VALUES
('Richmond Limousine', 650, 450, 440, 140, 200, 'General transportation'),
('James Limousine', 650, 450, 440, 140, 200, 'Wedding market focus'),
('Love Limousine', 650, 450, 440, 140, 200, 'Local competitor');

-- TNT Competitive Advantages
INSERT INTO company_profile (
  company_name,
  airport_bwi_price,
  airport_dulles_price,
  airport_national_price,
  hourly_rate_min,
  hourly_rate_max,
  nla_member_since,
  trust_analytica_ranking,
  driver_experience_avg,
  certifications,
  response_time_guarantee,
  coverage
) VALUES (
  'TNT Limousine',
  657,
  460,
  450,
  100,
  208,
  1992,
  'Top 10 Richmond (2025)',
  '15+ years',
  '["RIC", "DCA", "IAD", "BWI"]',
  '< 5 minutes',
  '24/7 including weekends'
);
```

### Database Security
- SSL connections required
- Encrypted at rest (AES-256)
- Connection pooling enabled
- Read replicas for analytics queries

---

## Hosting Platform Configuration

### Frontend: Vercel Deployment
```bash
# Vercel Configuration
Domain: leads.tntlimousine.com
Framework: Next.js 14
Region: Washington D.C. (closest to Richmond)
SSL: Automatic Let's Encrypt
CDN: Global edge network

# Environment Variables
NEXT_PUBLIC_API_URL=https://api.tntlimousine.com
NEXT_PUBLIC_SITE_URL=https://leads.tntlimousine.com
```

### Backend: Railway Deployment
```bash
# Railway Configuration
Domain: api.tntlimousine.com
Runtime: Node.js 18
Database: PostgreSQL 15
Redis: Queue processing
Auto-scaling: Enabled

# Environment Variables (Encrypted)
DATABASE_URL=[Railway provides]
REDIS_URL=[Railway provides]
JWT_SECRET=[256-bit random string]
SMTP_HOST=[TNT email provider]
SMTP_USER=automated@tntlimousine.com
SMTP_PASS=[Secure password]
```

---

## Email Templates with TNT Branding

### Corporate Instant Response Template
```html
Subject: TNT Limousine - Your Transportation Request [5-Minute Response]
From: TNT Limousine <automated@tntlimousine.com>
Reply-To: info@tntlimousine.com

<!DOCTYPE html>
<html>
<head>
  <style>
    .tnt-header { background: linear-gradient(135deg, #000000, #DC2626); color: white; padding: 20px; }
    .tnt-logo { font-family: 'Arial Black', Arial; font-size: 24px; font-weight: bold; }
    .tnt-tagline { font-style: italic; margin-top: 5px; }
    .content { padding: 20px; line-height: 1.6; }
    .advantages { background: #f8f9fa; padding: 15px; margin: 20px 0; border-left: 4px solid #DC2626; }
    .cta-button { background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="tnt-header">
    <div class="tnt-logo">TNT LIMOUSINE</div>
    <div class="tnt-tagline">Driven by Service, Defined by Excellence</div>
  </div>

  <div class="content">
    <p>Dear {{contact_name}},</p>

    <p>Thank you for contacting TNT Limousine for your {{service_type}} transportation needs. We have received your inquiry and a member of our team will contact you within the next 5 minutes.</p>

    <div class="advantages">
      <h3>Why Choose TNT Limousine?</h3>
      <ul>
        <li><strong>33 years of excellence</strong> - Serving Richmond since 1992</li>
        <li><strong>National Limousine Association member</strong> - Industry certified</li>
        <li><strong>Trust Analytica Top 10</strong> - Richmond limousine company (2025)</li>
        <li><strong>Experienced chauffeurs</strong> - 15+ years average experience</li>
        <li><strong>Airport certified</strong> - Access to RIC, DCA, IAD, BWI</li>
        <li><strong>Competitive pricing</strong> - Superior service quality</li>
      </ul>
    </div>

    <p><strong>Your Service Details:</strong></p>
    <ul>
      <li>Service Type: {{service_type}}</li>
      <li>Date: {{service_date}}</li>
      <li>Estimated Value: ${{estimated_value}}</li>
    </ul>

    <p>We will contact you shortly at {{phone}} to discuss your requirements and provide detailed pricing.</p>

    <p style="text-align: center; margin: 30px 0;">
      <a href="https://leads.tntlimousine.com/quote/{{lead_id}}" class="cta-button">View Your Quote</a>
    </p>

    <p>Best regards,<br>
    <strong>TNT Limousine Team</strong><br>
    Richmond, VA | (804) 346-4141<br>
    <em>"Driven by Service, Defined by Excellence"</em></p>
  </div>
</body>
</html>
```

### Airport Service Pricing Template
```html
Subject: TNT Airport Transportation - Competitive Pricing & Reliability

<div class="pricing-comparison">
  <h3>Our Competitive Airport Rates:</h3>
  <table>
    <tr><th>Destination</th><th>TNT Price</th><th>Richmond Limo</th><th>TNT Advantage</th></tr>
    <tr><td>BWI Airport</td><td>$657</td><td>$650</td><td>Superior vehicle quality</td></tr>
    <tr><td>Dulles Airport</td><td>$460</td><td>$450</td><td>99.9% on-time performance</td></tr>
    <tr><td>Reagan National</td><td>$450</td><td>$440</td><td>24/7 availability</td></tr>
  </table>
</div>
```

---

## System Monitoring Setup

### Uptime Monitoring
```javascript
// Uptime Robot Configuration
Monitor URLs:
- https://leads.tntlimousine.com (Dashboard)
- https://api.tntlimousine.com/health (API Health)
- https://api.tntlimousine.com/webhooks/form-submission (Webhook Endpoint)

Check Interval: Every 1 minute
Alert Methods: Email, SMS, Slack
Response Time Threshold: > 3 seconds
```

### Performance Analytics
```javascript
// Google Analytics 4 + Custom Tracking
Goals:
- Lead form submissions
- Email link clicks
- Booking conversions
- Response time performance

// Sentry Error Tracking
Error Rate Alert: > 1%
Performance Alert: > 2 seconds avg response
Memory Usage Alert: > 80%
```

---

## Security Configuration

### SSL/TLS Settings
```nginx
# Security Headers
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self' https:
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Firewall Rules
```bash
# Allow only necessary traffic
- HTTPS (443): Allow from anywhere
- HTTP (80): Redirect to HTTPS
- Database (5432): Allow from API server only
- SSH (22): Allow from TNT office IP only
```

---

## Integration Requirements

### Information Needed from TNT

#### FastTrack InVision Integration
- [ ] FastTrack API endpoint URL
- [ ] API credentials (username/password or API key)
- [ ] Test environment access
- [ ] Current customer database export format
- [ ] Vehicle management system integration requirements

#### Zoho CRM Integration
- [ ] Zoho CRM administrator access
- [ ] Custom field creation permissions
- [ ] Webhook configuration access
- [ ] Current lead management workflow
- [ ] Sales pipeline stages and requirements

#### Current Website Integration
- [ ] Website hosting details
- [ ] Form submission current handling
- [ ] Google Analytics access
- [ ] Any existing tracking pixels or scripts

---

## Go-Live Checklist

### Pre-Launch (TNT Actions Required)
- [ ] DNS records updated by TNT IT team
- [ ] Email provider configuration completed
- [ ] FastTrack integration credentials provided
- [ ] Zoho CRM access granted
- [ ] Current website backup created
- [ ] Manager phone numbers for SMS alerts confirmed

### Launch Day
- [ ] SSL certificates verified active
- [ ] Email delivery tested
- [ ] Lead capture form tested end-to-end
- [ ] Manager notification system tested
- [ ] Dashboard access verified for all users
- [ ] Integration sync tested
- [ ] Performance monitoring active

### Post-Launch (First 48 Hours)
- [ ] Lead response time monitoring
- [ ] Email delivery rate monitoring
- [ ] System health dashboard review
- [ ] Integration sync verification
- [ ] User feedback collection
- [ ] Performance optimization if needed

---

## Support & Maintenance

### System Status
- **Status Page**: https://status.tntlimousine.com
- **Uptime Target**: 99.9% (8.76 hours downtime/year max)
- **Response Time Target**: <5 minutes for lead processing

### Emergency Contacts
- **Technical Support**: admin@tntlimousine.com
- **Emergency Phone**: [TNT Manager Phone]
- **System Alerts**: alerts@tntlimousine.com

### Monthly Costs
- **Hosting**: $105/month (Vercel + Railway + monitoring)
- **Setup**: $0 one-time (automated deployment)
- **Maintenance**: Included in hosting costs

---

## Next Steps for TNT

1. **Contact Current Email Provider**
   - Determine SMTP capabilities
   - Request credentials for automated@tntlimousine.com

2. **Update DNS Records**
   - Add CNAME records for leads.tntlimousine.com
   - Add CNAME records for api.tntlimousine.com

3. **Provide Integration Access**
   - FastTrack InVision API credentials
   - Zoho CRM administrator access

4. **Test Email Configuration**
   - Verify automated email sending
   - Test manager SMS notifications

5. **Schedule Training Session**
   - Manager dashboard walkthrough
   - Dispatcher interface training
   - System administration basics

**Timeline**: Phase 4 deployment can be completed within 2-3 business days once TNT provides the required access and credentials.

**Expected ROI**: System will begin capturing and responding to leads within 5 minutes, targeting 3-5 additional corporate bookings monthly worth $15K+ revenue recovery.