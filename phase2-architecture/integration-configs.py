"""
TNT Corporate Lead System - Integration Configurations
Phase 2 Architecture - External System Connection Specifications

This module contains configuration classes and utilities for integrating with:
- FastTrack InVision (Dispatch Software)
- Zoho CRM (Customer Relationship Management)
- richweb.net SMTP (Email Automation)
- Slack (Team Notifications)
- SMS Gateway (Manager Alerts)

Author: TNT Limousine System Architecture
Generated using architect-mcp.json specifications
"""

import os
import json
import asyncio
from typing import Dict, List, Optional, Any, Union
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
import logging
from cryptography.fernet import Fernet
import aiohttp
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart

# =====================================================
# CONFIGURATION CLASSES
# =====================================================

class IntegrationType(Enum):
    """Types of external integrations supported"""
    CRM = "crm"
    DISPATCH = "dispatch"
    EMAIL = "email"
    NOTIFICATION = "notification"
    SMS = "sms"

class SyncFrequency(Enum):
    """Data synchronization frequency options"""
    REAL_TIME = "real_time"
    EVERY_5_MINUTES = "5_minutes"
    EVERY_15_MINUTES = "15_minutes"
    HOURLY = "hourly"
    DAILY = "daily"

@dataclass
class IntegrationConfig:
    """Base configuration for all integrations"""
    service_name: str
    integration_type: IntegrationType
    enabled: bool = True
    sync_frequency: SyncFrequency = SyncFrequency.REAL_TIME
    retry_attempts: int = 3
    timeout_seconds: int = 30
    rate_limit_per_minute: int = 60

    def __post_init__(self):
        self.created_at = datetime.utcnow()
        self.encryption_key = os.getenv('INTEGRATION_ENCRYPTION_KEY')
        if not self.encryption_key:
            raise ValueError("INTEGRATION_ENCRYPTION_KEY environment variable required")

# =====================================================
# ZOHO CRM INTEGRATION
# =====================================================

@dataclass
class ZohoCRMConfig(IntegrationConfig):
    """
    Zoho CRM integration configuration for TNT lead management

    Business Requirements:
    - Real-time lead creation in Zoho CRM
    - Bidirectional data sync for status updates
    - Activity tracking for all lead interactions
    - Revenue pipeline management
    """

    # OAuth 2.0 Configuration
    client_id: str = field(default_factory=lambda: os.getenv('ZOHO_CLIENT_ID', ''))
    client_secret: str = field(default_factory=lambda: os.getenv('ZOHO_CLIENT_SECRET', ''))
    refresh_token: str = field(default_factory=lambda: os.getenv('ZOHO_REFRESH_TOKEN', ''))

    # API Configuration
    base_url: str = "https://www.zohoapis.com/crm/v2"
    scopes: List[str] = field(default_factory=lambda: [
        "ZohoCRM.modules.ALL",
        "ZohoCRM.settings.READ",
        "ZohoCRM.users.READ"
    ])

    # Data Mapping Configuration
    lead_mapping: Dict[str, str] = field(default_factory=lambda: {
        # TNT Field -> Zoho Field
        "company_name": "Company",
        "contact_name": "Last_Name",
        "email": "Email",
        "phone": "Phone",
        "service_type": "Service_Type__c",  # Custom field
        "estimated_value": "Deal_Value__c",  # Custom field
        "lead_score": "Lead_Score__c",  # Custom field
        "source": "Lead_Source",
        "pickup_location": "Pickup_Location__c",  # Custom field
        "destination": "Destination__c",  # Custom field
        "service_date": "Service_Date__c"  # Custom field
    })

    # Sync Configuration
    webhook_url: str = field(default_factory=lambda: os.getenv('TNT_WEBHOOK_URL', '') + '/webhooks/crm-updates')
    sync_direction: str = "bidirectional"  # 'inbound', 'outbound', 'bidirectional'
    batch_size: int = 50

    def __post_init__(self):
        super().__post_init__()
        self.service_name = "zoho_crm"
        self.integration_type = IntegrationType.CRM

    def get_headers(self, access_token: str) -> Dict[str, str]:
        """Generate request headers for Zoho API calls"""
        return {
            "Authorization": f"Zoho-oauthtoken {access_token}",
            "Content-Type": "application/json",
            "User-Agent": "TNT-Lead-System/2.0"
        }

    def format_lead_for_zoho(self, tnt_lead: Dict[str, Any]) -> Dict[str, Any]:
        """Convert TNT lead data to Zoho CRM format"""
        zoho_lead = {}

        for tnt_field, zoho_field in self.lead_mapping.items():
            if tnt_field in tnt_lead and tnt_lead[tnt_field] is not None:
                zoho_lead[zoho_field] = tnt_lead[tnt_field]

        # Add TNT-specific metadata
        zoho_lead.update({
            "Lead_Source": tnt_lead.get("source", "TNT Website"),
            "TNT_Lead_ID__c": tnt_lead.get("lead_id"),
            "Created_by_TNT_System__c": True,
            "Lead_Priority__c": self._calculate_priority(tnt_lead.get("lead_score", 0))
        })

        return {"data": [zoho_lead]}

    def _calculate_priority(self, lead_score: int) -> str:
        """Convert TNT lead score to Zoho priority"""
        if lead_score >= 80:
            return "Critical"
        elif lead_score >= 60:
            return "High"
        elif lead_score >= 40:
            return "Medium"
        else:
            return "Low"

# =====================================================
# FASTTRACK INVISION INTEGRATION
# =====================================================

@dataclass
class FastTrackConfig(IntegrationConfig):
    """
    FastTrack InVision dispatch software integration

    Business Requirements:
    - Customer profile synchronization
    - Booking status updates
    - Vehicle availability checking
    - Trip assignment automation
    """

    # API Configuration
    api_endpoint: str = field(default_factory=lambda: os.getenv('FASTTRACK_API_ENDPOINT', ''))
    api_key: str = field(default_factory=lambda: os.getenv('FASTTRACK_API_KEY', ''))
    company_id: str = field(default_factory=lambda: os.getenv('FASTTRACK_COMPANY_ID', ''))

    # Feature Configuration
    auto_create_customers: bool = True
    auto_assign_trips: bool = False  # Requires manual approval
    check_vehicle_availability: bool = True
    sync_booking_status: bool = True

    # Data Mapping
    customer_mapping: Dict[str, str] = field(default_factory=lambda: {
        "company_name": "company_name",
        "contact_name": "contact_name",
        "email": "email_address",
        "phone": "phone_number",
        "billing_address": "address_line_1"
    })

    # Trip Configuration
    default_vehicle_type: str = "sedan"
    default_service_level: str = "corporate"
    booking_lead_time_hours: int = 2

    def __post_init__(self):
        super().__post_init__()
        self.service_name = "fasttrack_invision"
        self.integration_type = IntegrationType.DISPATCH
        self.sync_frequency = SyncFrequency.EVERY_15_MINUTES

    def get_headers(self) -> Dict[str, str]:
        """Generate request headers for FastTrack API"""
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "X-Company-ID": self.company_id,
            "User-Agent": "TNT-Lead-System/2.0"
        }

    def format_customer_for_fasttrack(self, tnt_lead: Dict[str, Any]) -> Dict[str, Any]:
        """Convert TNT lead to FastTrack customer format"""
        customer_data = {}

        for tnt_field, ft_field in self.customer_mapping.items():
            if tnt_field in tnt_lead and tnt_lead[tnt_field]:
                customer_data[ft_field] = tnt_lead[tnt_field]

        # Add FastTrack-specific fields
        customer_data.update({
            "customer_type": "corporate" if tnt_lead.get("company_name") else "individual",
            "source": "TNT Lead System",
            "tnt_lead_id": tnt_lead.get("lead_id"),
            "preferred_payment": "invoice",
            "vip_status": tnt_lead.get("lead_score", 0) >= 80
        })

        return customer_data

    def create_trip_quote(self, tnt_lead: Dict[str, Any]) -> Dict[str, Any]:
        """Generate trip quote for FastTrack system"""
        return {
            "pickup_address": tnt_lead.get("pickup_location"),
            "destination_address": tnt_lead.get("destination"),
            "service_date": tnt_lead.get("service_date"),
            "passenger_count": tnt_lead.get("passenger_count", 1),
            "vehicle_type": self._determine_vehicle_type(tnt_lead),
            "service_level": self.default_service_level,
            "estimated_duration": self._estimate_duration(tnt_lead),
            "special_instructions": tnt_lead.get("custom_fields", {}).get("special_instructions", ""),
            "billing_reference": tnt_lead.get("custom_fields", {}).get("billing_account", "")
        }

    def _determine_vehicle_type(self, tnt_lead: Dict[str, Any]) -> str:
        """Determine appropriate vehicle type based on passenger count and service type"""
        passenger_count = tnt_lead.get("passenger_count", 1)
        service_type = tnt_lead.get("service_type", "")

        if passenger_count >= 8:
            return "van"
        elif passenger_count >= 4 or service_type == "wedding":
            return "suv"
        elif service_type == "corporate":
            return "luxury_sedan"
        else:
            return "sedan"

    def _estimate_duration(self, tnt_lead: Dict[str, Any]) -> int:
        """Estimate trip duration in minutes"""
        service_type = tnt_lead.get("service_type", "")

        if service_type == "airport":
            return 90  # Average airport transfer time
        elif service_type == "hourly":
            return 120  # Default hourly booking
        elif service_type == "wedding":
            return 180  # Wedding service duration
        else:
            return 60   # Default corporate transfer

# =====================================================
# RICHWEB.NET SMTP INTEGRATION
# =====================================================

@dataclass
class RichWebSMTPConfig(IntegrationConfig):
    """
    richweb.net SMTP email automation configuration

    Business Requirements:
    - 5-minute automated response guarantee
    - Branded email templates with TNT styling
    - Email engagement tracking (opens, clicks)
    - Bounce handling and unsubscribe management
    """

    # SMTP Configuration
    smtp_host: str = "mail.richweb.net"
    smtp_port: int = 587
    use_tls: bool = True
    username: str = field(default_factory=lambda: os.getenv('RICHWEB_SMTP_USERNAME', ''))
    password: str = field(default_factory=lambda: os.getenv('RICHWEB_SMTP_PASSWORD', ''))

    # Email Configuration
    from_address: str = "TNT Limousine <noreply@tntlimousine.com>"
    reply_to: str = "info@tntlimousine.com"
    return_path: str = "bounce@tntlimousine.com"

    # Tracking Configuration
    track_opens: bool = True
    track_clicks: bool = True
    track_unsubscribes: bool = True
    bounce_webhook_url: str = field(default_factory=lambda: os.getenv('TNT_WEBHOOK_URL', '') + '/webhooks/email-engagement')

    # Rate Limiting
    daily_send_limit: int = 5000
    hourly_send_limit: int = 500
    max_recipients_per_email: int = 1

    # Template Configuration
    base_template_path: str = "email_templates/"
    include_unsubscribe_link: bool = True
    add_tracking_pixel: bool = True

    def __post_init__(self):
        super().__post_init__()
        self.service_name = "richweb_smtp"
        self.integration_type = IntegrationType.EMAIL

    def get_smtp_connection(self):
        """Create SMTP connection to richweb.net"""
        server = smtplib.SMTP(self.smtp_host, self.smtp_port)
        if self.use_tls:
            server.starttls()
        server.login(self.username, self.password)
        return server

    def create_email_message(self,
                           to_address: str,
                           subject: str,
                           text_content: str,
                           html_content: str = None,
                           tracking_id: str = None) -> MimeMultipart:
        """Create email message with TNT branding and tracking"""

        msg = MimeMultipart('alternative')
        msg['From'] = self.from_address
        msg['To'] = to_address
        msg['Subject'] = subject
        msg['Reply-To'] = self.reply_to
        msg['Return-Path'] = self.return_path

        # Add tracking headers
        if tracking_id:
            msg['X-TNT-Tracking-ID'] = tracking_id
            msg['X-TNT-Campaign'] = "automated_response"

        # Add text content
        text_part = MimeText(text_content, 'plain')
        msg.attach(text_part)

        # Add HTML content with tracking
        if html_content:
            if self.add_tracking_pixel and tracking_id:
                html_content = self._add_tracking_pixel(html_content, tracking_id)

            if self.include_unsubscribe_link:
                html_content = self._add_unsubscribe_link(html_content, to_address)

            html_part = MimeText(html_content, 'html')
            msg.attach(html_part)

        return msg

    def _add_tracking_pixel(self, html_content: str, tracking_id: str) -> str:
        """Add invisible tracking pixel for open tracking"""
        tracking_url = f"{os.getenv('TNT_API_URL')}/track/open/{tracking_id}"
        pixel = f'<img src="{tracking_url}" width="1" height="1" style="display:none;" />'

        # Insert before closing body tag
        if '</body>' in html_content:
            return html_content.replace('</body>', f'{pixel}</body>')
        else:
            return html_content + pixel

    def _add_unsubscribe_link(self, html_content: str, email: str) -> str:
        """Add unsubscribe link to email content"""
        unsubscribe_url = f"{os.getenv('TNT_API_URL')}/unsubscribe?email={email}"
        unsubscribe_html = f'''
        <div style="text-align: center; font-size: 12px; color: #666; margin-top: 20px;">
            <p>TNT Limousine | Richmond, VA | (804) 346-4141</p>
            <p><a href="{unsubscribe_url}" style="color: #666;">Unsubscribe from automated emails</a></p>
        </div>
        '''

        if '</body>' in html_content:
            return html_content.replace('</body>', f'{unsubscribe_html}</body>')
        else:
            return html_content + unsubscribe_html

# =====================================================
# SLACK INTEGRATION
# =====================================================

@dataclass
class SlackConfig(IntegrationConfig):
    """
    Slack integration for team notifications

    Business Requirements:
    - Real-time high-value lead alerts
    - Dispatcher team notifications
    - System status updates
    """

    # Webhook Configuration
    webhook_url: str = field(default_factory=lambda: os.getenv('SLACK_WEBHOOK_URL', ''))
    channel: str = "#tnt-leads"
    username: str = "TNT Lead Bot"
    icon_emoji: str = ":car:"

    # Notification Configuration
    notify_high_value_leads: bool = True
    high_value_threshold: float = 1000.0
    notify_system_errors: bool = True
    notify_integration_failures: bool = True

    def __post_init__(self):
        super().__post_init__()
        self.service_name = "slack"
        self.integration_type = IntegrationType.NOTIFICATION

    def format_lead_notification(self, tnt_lead: Dict[str, Any]) -> Dict[str, Any]:
        """Format lead data for Slack notification"""

        # Determine notification color based on lead score
        score = tnt_lead.get("lead_score", 0)
        if score >= 80:
            color = "danger"  # Red for critical
        elif score >= 60:
            color = "warning"  # Orange for high
        else:
            color = "good"    # Green for medium

        # Build attachment
        attachment = {
            "color": color,
            "title": f"🚗 New {tnt_lead.get('service_type', 'Lead').title()} Lead",
            "title_link": f"{os.getenv('TNT_DASHBOARD_URL')}/leads/{tnt_lead.get('lead_id')}",
            "fields": [
                {
                    "title": "Company",
                    "value": tnt_lead.get("company_name", "Individual"),
                    "short": True
                },
                {
                    "title": "Contact",
                    "value": tnt_lead.get("contact_name"),
                    "short": True
                },
                {
                    "title": "Estimated Value",
                    "value": f"${tnt_lead.get('estimated_value', 0):.2f}",
                    "short": True
                },
                {
                    "title": "Lead Score",
                    "value": f"{score}/100",
                    "short": True
                },
                {
                    "title": "Service Date",
                    "value": tnt_lead.get("service_date", "TBD"),
                    "short": True
                },
                {
                    "title": "Pickup",
                    "value": tnt_lead.get("pickup_location", "Not specified"),
                    "short": False
                }
            ],
            "footer": "TNT Lead System",
            "ts": int(datetime.utcnow().timestamp())
        }

        # Add urgent action message for high-value leads
        if tnt_lead.get("estimated_value", 0) >= self.high_value_threshold:
            attachment["pretext"] = "🚨 *HIGH VALUE LEAD ALERT* 🚨"

        return {
            "channel": self.channel,
            "username": self.username,
            "icon_emoji": self.icon_emoji,
            "text": f"New lead from {tnt_lead.get('contact_name')} at {tnt_lead.get('company_name', 'N/A')}",
            "attachments": [attachment]
        }

# =====================================================
# SMS NOTIFICATION INTEGRATION
# =====================================================

@dataclass
class SMSConfig(IntegrationConfig):
    """
    SMS notification configuration for manager alerts

    Business Requirements:
    - Immediate SMS for high-value leads (>$1,000)
    - Weekend/holiday coverage notifications
    - System alert notifications
    """

    # SMS Provider Configuration (Twilio)
    account_sid: str = field(default_factory=lambda: os.getenv('TWILIO_ACCOUNT_SID', ''))
    auth_token: str = field(default_factory=lambda: os.getenv('TWILIO_AUTH_TOKEN', ''))
    from_number: str = field(default_factory=lambda: os.getenv('TWILIO_FROM_NUMBER', ''))

    # Notification Configuration
    manager_numbers: List[str] = field(default_factory=lambda: [
        os.getenv('TNT_MANAGER_PHONE_1', ''),
        os.getenv('TNT_MANAGER_PHONE_2', '')
    ])

    high_value_threshold: float = 1000.0
    send_weekend_alerts: bool = True
    send_after_hours_alerts: bool = True
    rate_limit_minutes: int = 5  # Minimum time between SMS to same number

    def __post_init__(self):
        super().__post_init__()
        self.service_name = "sms_notifications"
        self.integration_type = IntegrationType.SMS
        # Filter out empty phone numbers
        self.manager_numbers = [num for num in self.manager_numbers if num]

    def format_lead_alert(self, tnt_lead: Dict[str, Any]) -> str:
        """Format lead data for SMS alert"""
        company = tnt_lead.get("company_name", "Individual")
        contact = tnt_lead.get("contact_name", "Unknown")
        value = tnt_lead.get("estimated_value", 0)
        service_type = tnt_lead.get("service_type", "service")

        message = f"🚨 TNT HIGH VALUE LEAD\n"
        message += f"Company: {company}\n"
        message += f"Contact: {contact}\n"
        message += f"Value: ${value:.2f}\n"
        message += f"Service: {service_type.title()}\n"
        message += f"Score: {tnt_lead.get('lead_score', 0)}/100\n"
        message += f"View: {os.getenv('TNT_DASHBOARD_URL')}/leads/{tnt_lead.get('lead_id')}"

        return message

# =====================================================
# INTEGRATION MANAGER
# =====================================================

class IntegrationManager:
    """
    Central manager for all external integrations
    Handles configuration, health monitoring, and coordination
    """

    def __init__(self):
        self.integrations: Dict[str, IntegrationConfig] = {}
        self.logger = logging.getLogger(__name__)
        self.health_status: Dict[str, Dict[str, Any]] = {}

        # Initialize all integrations
        self._initialize_integrations()

    def _initialize_integrations(self):
        """Initialize all configured integrations"""
        try:
            # Zoho CRM
            if os.getenv('ZOHO_CLIENT_ID'):
                self.integrations['zoho_crm'] = ZohoCRMConfig()
                self.logger.info("Initialized Zoho CRM integration")

            # FastTrack InVision
            if os.getenv('FASTTRACK_API_ENDPOINT'):
                self.integrations['fasttrack'] = FastTrackConfig()
                self.logger.info("Initialized FastTrack integration")

            # richweb.net SMTP
            if os.getenv('RICHWEB_SMTP_USERNAME'):
                self.integrations['richweb_smtp'] = RichWebSMTPConfig()
                self.logger.info("Initialized richweb.net SMTP integration")

            # Slack
            if os.getenv('SLACK_WEBHOOK_URL'):
                self.integrations['slack'] = SlackConfig()
                self.logger.info("Initialized Slack integration")

            # SMS Notifications
            if os.getenv('TWILIO_ACCOUNT_SID'):
                self.integrations['sms'] = SMSConfig()
                self.logger.info("Initialized SMS integration")

        except Exception as e:
            self.logger.error(f"Error initializing integrations: {str(e)}")
            raise

    def get_integration(self, service_name: str) -> Optional[IntegrationConfig]:
        """Get integration configuration by service name"""
        return self.integrations.get(service_name)

    def is_integration_enabled(self, service_name: str) -> bool:
        """Check if integration is enabled and configured"""
        integration = self.integrations.get(service_name)
        return integration is not None and integration.enabled

    async def health_check_all(self) -> Dict[str, Dict[str, Any]]:
        """Perform health check on all integrations"""
        health_results = {}

        for service_name, config in self.integrations.items():
            try:
                health_results[service_name] = await self._health_check_integration(service_name, config)
            except Exception as e:
                health_results[service_name] = {
                    "status": "error",
                    "error": str(e),
                    "timestamp": datetime.utcnow().isoformat()
                }

        self.health_status = health_results
        return health_results

    async def _health_check_integration(self, service_name: str, config: IntegrationConfig) -> Dict[str, Any]:
        """Perform health check on specific integration"""
        start_time = datetime.utcnow()

        try:
            if isinstance(config, ZohoCRMConfig):
                # Test Zoho API connectivity
                async with aiohttp.ClientSession() as session:
                    async with session.get(f"{config.base_url}/settings/modules") as response:
                        if response.status == 200:
                            status = "healthy"
                        else:
                            status = "warning"

            elif isinstance(config, FastTrackConfig):
                # Test FastTrack API connectivity
                async with aiohttp.ClientSession() as session:
                    headers = config.get_headers()
                    async with session.get(f"{config.api_endpoint}/health", headers=headers) as response:
                        status = "healthy" if response.status == 200 else "warning"

            elif isinstance(config, RichWebSMTPConfig):
                # Test SMTP connectivity
                try:
                    server = config.get_smtp_connection()
                    server.quit()
                    status = "healthy"
                except Exception:
                    status = "error"

            else:
                # Basic connectivity check for other services
                status = "healthy" if config.enabled else "disabled"

            response_time = (datetime.utcnow() - start_time).total_seconds()

            return {
                "status": status,
                "response_time_ms": int(response_time * 1000),
                "last_checked": datetime.utcnow().isoformat(),
                "enabled": config.enabled
            }

        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "last_checked": datetime.utcnow().isoformat(),
                "enabled": config.enabled
            }

    def get_sync_schedule(self) -> Dict[str, List[str]]:
        """Get synchronization schedule for all integrations"""
        schedule = {
            "real_time": [],
            "5_minutes": [],
            "15_minutes": [],
            "hourly": [],
            "daily": []
        }

        for service_name, config in self.integrations.items():
            if config.enabled:
                schedule[config.sync_frequency.value].append(service_name)

        return schedule

# =====================================================
# UTILITY FUNCTIONS
# =====================================================

def encrypt_sensitive_data(data: str) -> str:
    """Encrypt sensitive configuration data"""
    key = os.getenv('INTEGRATION_ENCRYPTION_KEY')
    if not key:
        raise ValueError("Encryption key not found")

    f = Fernet(key.encode())
    return f.encrypt(data.encode()).decode()

def decrypt_sensitive_data(encrypted_data: str) -> str:
    """Decrypt sensitive configuration data"""
    key = os.getenv('INTEGRATION_ENCRYPTION_KEY')
    if not key:
        raise ValueError("Encryption key not found")

    f = Fernet(key.encode())
    return f.decrypt(encrypted_data.encode()).decode()

def validate_environment_variables() -> Dict[str, bool]:
    """Validate that required environment variables are set"""
    required_vars = {
        'INTEGRATION_ENCRYPTION_KEY': os.getenv('INTEGRATION_ENCRYPTION_KEY'),
        'TNT_WEBHOOK_URL': os.getenv('TNT_WEBHOOK_URL'),
        'TNT_API_URL': os.getenv('TNT_API_URL'),
        'TNT_DASHBOARD_URL': os.getenv('TNT_DASHBOARD_URL')
    }

    # Optional but recommended variables
    optional_vars = {
        'ZOHO_CLIENT_ID': os.getenv('ZOHO_CLIENT_ID'),
        'FASTTRACK_API_ENDPOINT': os.getenv('FASTTRACK_API_ENDPOINT'),
        'RICHWEB_SMTP_USERNAME': os.getenv('RICHWEB_SMTP_USERNAME'),
        'SLACK_WEBHOOK_URL': os.getenv('SLACK_WEBHOOK_URL'),
        'TWILIO_ACCOUNT_SID': os.getenv('TWILIO_ACCOUNT_SID')
    }

    validation_results = {}

    # Check required variables
    for var_name, var_value in required_vars.items():
        validation_results[var_name] = bool(var_value)

    # Check optional variables
    for var_name, var_value in optional_vars.items():
        validation_results[f"{var_name}_optional"] = bool(var_value)

    return validation_results

# =====================================================
# EXAMPLE USAGE
# =====================================================

if __name__ == "__main__":
    """
    Example usage and testing of integration configurations
    """

    # Validate environment setup
    env_validation = validate_environment_variables()
    print("Environment Validation Results:")
    for var, is_set in env_validation.items():
        status = "✓" if is_set else "✗"
        print(f"  {status} {var}")

    # Initialize integration manager
    try:
        manager = IntegrationManager()
        print(f"\nInitialized {len(manager.integrations)} integrations:")
        for service_name in manager.integrations.keys():
            print(f"  • {service_name}")

        # Get sync schedule
        schedule = manager.get_sync_schedule()
        print("\nSync Schedule:")
        for frequency, services in schedule.items():
            if services:
                print(f"  {frequency}: {', '.join(services)}")

        # Example lead data
        sample_lead = {
            "lead_id": "550e8400-e29b-41d4-a716-446655440000",
            "company_name": "Richmond Financial Group",
            "contact_name": "Sarah Johnson",
            "email": "s.johnson@richmondfinancial.com",
            "phone": "+1-804-555-0123",
            "service_type": "corporate",
            "estimated_value": 1200.00,
            "lead_score": 85,
            "pickup_location": "1401 E Broad St, Richmond, VA 23219",
            "destination": "Richmond International Airport (RIC)",
            "passenger_count": 3
        }

        # Test Zoho CRM formatting
        if 'zoho_crm' in manager.integrations:
            zoho_config = manager.integrations['zoho_crm']
            zoho_formatted = zoho_config.format_lead_for_zoho(sample_lead)
            print(f"\nZoho CRM Format Preview:")
            print(f"  Company: {zoho_formatted['data'][0].get('Company')}")
            print(f"  Priority: {zoho_formatted['data'][0].get('Lead_Priority__c')}")

        # Test Slack notification formatting
        if 'slack' in manager.integrations:
            slack_config = manager.integrations['slack']
            slack_message = slack_config.format_lead_notification(sample_lead)
            print(f"\nSlack Notification Preview:")
            print(f"  Channel: {slack_message['channel']}")
            print(f"  Title: {slack_message['attachments'][0]['title']}")

    except Exception as e:
        print(f"Error: {str(e)}")
        print("Please check your environment variable configuration.")