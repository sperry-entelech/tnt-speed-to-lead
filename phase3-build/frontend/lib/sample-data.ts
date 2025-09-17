import { Lead, Notification, RevenueData, ResponseTimeMetrics, ConversionFunnelData, CommunicationRecord, CompetitiveAdvantage, AnalyticsData } from '@/types';

export const sampleLeads: Lead[] = [
  {
    id: '1',
    companyName: 'Fortune 500 Corp',
    contactName: 'Sarah Johnson',
    email: 'sarah.johnson@fortune500corp.com',
    phone: '+1 (555) 123-4567',
    score: 95,
    priority: 'urgent',
    source: 'referral',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'new',
    estimatedValue: 15000,
    responseTime: 3,
    serviceType: 'corporate',
    notes: 'Executive team transportation for quarterly board meeting. High-priority client.'
  },
  {
    id: '2',
    companyName: 'Tech Startup Inc',
    contactName: 'Mike Chen',
    email: 'mike@techstartup.com',
    phone: '+1 (555) 987-6543',
    score: 78,
    priority: 'high',
    source: 'website',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'contacted',
    estimatedValue: 2500,
    responseTime: 7,
    serviceType: 'corporate',
    lastContact: new Date(Date.now() - 1 * 60 * 60 * 1000),
    nextFollowUp: new Date(Date.now() + 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    companyName: 'Elite Wedding Co',
    contactName: 'Jennifer Smith',
    email: 'jen@elitewedding.com',
    phone: '+1 (555) 456-7890',
    score: 85,
    priority: 'high',
    source: 'referral',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'qualified',
    estimatedValue: 3200,
    responseTime: 12,
    serviceType: 'wedding',
    lastContact: new Date(Date.now() - 30 * 60 * 1000)
  },
  {
    id: '4',
    companyName: 'Global Enterprises',
    contactName: 'David Wilson',
    email: 'dwilson@globalent.com',
    phone: '+1 (555) 321-0987',
    score: 92,
    priority: 'urgent',
    source: 'website',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    status: 'new',
    estimatedValue: 8500,
    serviceType: 'corporate',
    notes: 'International client visit. Requires multiple vehicles.'
  }
];

export const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'high_value_lead',
    title: 'High-Value Lead Alert',
    message: 'Fortune 500 Corp submitted a $15,000 corporate transportation request',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: 'critical',
    leadId: '1',
    actionRequired: true
  },
  {
    id: '2',
    type: 'urgent_response',
    title: 'Response Time Critical',
    message: 'Global Enterprises lead requires immediate attention - 1 hour old',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    read: false,
    priority: 'high',
    leadId: '4',
    actionRequired: true
  },
  {
    id: '3',
    type: 'conversion',
    title: 'Lead Converted!',
    message: 'Elite Wedding Co confirmed booking for $3,200',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
    priority: 'medium',
    leadId: '3'
  }
];

export const sampleRevenueData: RevenueData[] = [
  { month: 'Jan', revenue: 125000, target: 120000, leads: 45, conversions: 28, conversionRate: 62.2 },
  { month: 'Feb', revenue: 135000, target: 130000, leads: 52, conversions: 34, conversionRate: 65.4 },
  { month: 'Mar', revenue: 145000, target: 140000, leads: 48, conversions: 31, conversionRate: 64.6 },
  { month: 'Apr', revenue: 155000, target: 150000, leads: 58, conversions: 39, conversionRate: 67.2 },
  { month: 'May', revenue: 165000, target: 160000, leads: 62, conversions: 42, conversionRate: 67.7 },
  { month: 'Jun', revenue: 175000, target: 170000, leads: 55, conversions: 38, conversionRate: 69.1 }
];

export const sampleResponseTimeMetrics: ResponseTimeMetrics = {
  average: 4.2,
  target: 5.0,
  within5Min: 87,
  within15Min: 12,
  over15Min: 1,
  totalLeads: 100
};

export const sampleConversionFunnelData: ConversionFunnelData[] = [
  { stage: 'New Leads', count: 150, percentage: 100, value: 450000 },
  { stage: 'Contacted', count: 135, percentage: 90, value: 405000 },
  { stage: 'Qualified', count: 108, percentage: 72, value: 324000 },
  { stage: 'Proposal Sent', count: 85, percentage: 57, value: 255000 },
  { stage: 'Converted', count: 68, percentage: 45, value: 204000 }
];

export const sampleCommunicationHistory: CommunicationRecord[] = [
  {
    id: '1',
    leadId: '1',
    type: 'phone',
    direction: 'outbound',
    subject: 'Initial Contact',
    message: 'Spoke with Sarah about corporate transportation needs. Very interested, requested detailed proposal.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    userId: 'user1',
    userName: 'John Martinez',
    successful: true,
    duration: 15
  },
  {
    id: '2',
    leadId: '2',
    type: 'email',
    direction: 'outbound',
    subject: 'TNT Corporate Transportation Proposal',
    message: 'Sent comprehensive proposal with pricing and vehicle options.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    userId: 'user2',
    userName: 'Lisa Chen',
    successful: true
  },
  {
    id: '3',
    leadId: '3',
    type: 'meeting',
    direction: 'inbound',
    subject: 'Wedding Transportation Planning',
    message: 'In-person consultation to discuss wedding day logistics and vehicle requirements.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    userId: 'user1',
    userName: 'John Martinez',
    successful: true,
    duration: 60
  }
];

export const sampleCompetitiveAdvantages: CompetitiveAdvantage[] = [
  {
    title: 'National Limousine Association Member',
    description: 'Certified member ensuring highest industry standards and professional service excellence.',
    icon: '🏆',
    impact: 'high',
    category: 'certification'
  },
  {
    title: 'Trust Analytica Top 10 Ranking',
    description: 'Ranked in top 10 most trusted transportation companies by independent analysis.',
    icon: '⭐',
    impact: 'high',
    category: 'certification'
  },
  {
    title: '15+ Years Experience',
    description: 'Over 15 years of proven track record in luxury transportation services.',
    icon: '📅',
    impact: 'high',
    category: 'experience'
  },
  {
    title: 'AI-Powered Lead Response',
    description: 'Advanced speed-to-lead system ensuring <5 minute response times.',
    icon: '🤖',
    impact: 'medium',
    category: 'technology'
  },
  {
    title: '24/7 Customer Support',
    description: 'Round-the-clock availability for all client needs and emergency situations.',
    icon: '🕐',
    impact: 'medium',
    category: 'service'
  },
  {
    title: 'Fleet Diversity',
    description: 'Comprehensive fleet including luxury sedans, SUVs, limos, and specialty vehicles.',
    icon: '🚗',
    impact: 'medium',
    category: 'service'
  }
];

export const sampleAnalyticsData: AnalyticsData = {
  totalLeads: 347,
  convertedLeads: 234,
  conversionRate: 67.4,
  averageResponseTime: 4.2,
  totalRevenue: 892000,
  averageDealSize: 3812,
  topSource: 'referral',
  competitorWins: 89
};