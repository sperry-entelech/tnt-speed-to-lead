export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'dispatcher';
  avatar?: string;
}

export interface Lead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  score: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  source: string;
  createdAt: Date;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  estimatedValue: number;
  responseTime?: number; // in minutes
  lastContact?: Date;
  nextFollowUp?: Date;
  serviceType: 'corporate' | 'wedding' | 'airport' | 'special_event';
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'high_value_lead' | 'urgent_response' | 'missed_target' | 'conversion' | 'system_alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  leadId?: string;
  actionRequired?: boolean;
}

export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
  leads: number;
  conversions: number;
  conversionRate: number;
}

export interface ResponseTimeMetrics {
  average: number;
  target: number;
  within5Min: number;
  within15Min: number;
  over15Min: number;
  totalLeads: number;
}

export interface ConversionFunnelData {
  stage: string;
  count: number;
  percentage: number;
  value: number;
}

export interface CommunicationRecord {
  id: string;
  leadId: string;
  type: 'email' | 'phone' | 'sms' | 'meeting' | 'note';
  direction: 'inbound' | 'outbound';
  subject?: string;
  message: string;
  timestamp: Date;
  userId: string;
  userName: string;
  successful: boolean;
  duration?: number; // for phone calls, in minutes
}

export interface CompetitiveAdvantage {
  title: string;
  description: string;
  icon: string;
  impact: 'high' | 'medium' | 'low';
  category: 'experience' | 'certification' | 'technology' | 'service';
}

export interface DashboardFilters {
  dateRange: {
    start: Date;
    end: Date;
  };
  priority?: string[];
  source?: string[];
  status?: string[];
  serviceType?: string[];
}

export interface AnalyticsData {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  averageResponseTime: number;
  totalRevenue: number;
  averageDealSize: number;
  topSource: string;
  competitorWins: number;
}

// Authentication types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

// Role-based permissions
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  admin: [
    { resource: 'leads', actions: ['read', 'write', 'delete'] },
    { resource: 'users', actions: ['read', 'write', 'delete'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'settings', actions: ['read', 'write'] },
    { resource: 'communications', actions: ['read', 'write'] }
  ],
  manager: [
    { resource: 'leads', actions: ['read', 'write'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'communications', actions: ['read', 'write'] }
  ],
  dispatcher: [
    { resource: 'leads', actions: ['read', 'write'] },
    { resource: 'communications', actions: ['read', 'write'] }
  ]
};