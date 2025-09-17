'use client';

import React, { useState } from 'react';
import { BarChart3, Users, MessageSquare, TrendingUp, Settings, Menu, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TNTBrandHeader from './TNTBrandHeader';
import LeadNotificationCenter from './LeadNotificationCenter';
import ProspectScoringWidget from './ProspectScoringWidget';
import RevenuePipelineChart from './RevenuePipelineChart';
import ResponseTimeAnalytics from './ResponseTimeAnalytics';
import CompetitiveAnalysisPanel from './CompetitiveAnalysisPanel';
import HighPriorityLeads from './HighPriorityLeads';
import ConversionFunnel from './ConversionFunnel';
import CommunicationHistory from './CommunicationHistory';
import { AuthProvider, ProtectedRoute, useAuth } from './AuthenticationSystem';
import {
  sampleLeads,
  sampleNotifications,
  sampleRevenueData,
  sampleResponseTimeMetrics,
  sampleConversionFunnelData,
  sampleCommunicationHistory,
  sampleCompetitiveAdvantages,
  sampleAnalyticsData
} from '@/lib/sample-data';
import { Lead, Notification } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children?: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { authState, logout } = useAuth();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.leadId) {
      setSelectedLeadId(notification.leadId);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLeadClick = (lead: Lead) => {
    setSelectedLeadId(lead.id);
  };

  const handleContactLead = (lead: Lead, method: 'phone' | 'email') => {
    console.log(`Contacting ${lead.companyName} via ${method}`);
    // In a real app, this would integrate with communication systems
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <TNTBrandHeader
        user={authState.user || undefined}
        notificationCount={unreadNotificationCount}
        onNotificationClick={() => {}}
        onLogout={logout}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-4"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              <span className="ml-2">Menu</span>
            </Button>
          </div>

          {/* Sidebar - Notifications */}
          <AnimatePresence>
            {(sidebarOpen || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className={`${
                  sidebarOpen ? 'fixed inset-0 z-50 bg-black bg-opacity-50 lg:relative lg:bg-transparent' : ''
                } lg:w-96`}
              >
                <div className="bg-white lg:bg-transparent p-4 lg:p-0 h-full lg:h-auto overflow-y-auto">
                  <div className="lg:hidden mb-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(false)}
                      className="mb-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <LeadNotificationCenter
                    notifications={notifications}
                    onNotificationClick={handleNotificationClick}
                    onMarkAsRead={handleMarkAsRead}
                    onMarkAllRead={handleMarkAllRead}
                    className="mb-6"
                  />

                  <ProspectScoringWidget
                    leads={sampleLeads}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Dashboard */}
          <div className="flex-1">
            <Tabs defaultValue="overview" className="space-y-6">
              {/* Tab Navigation */}
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
                <TabsTrigger value="overview" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="leads" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Leads</span>
                </TabsTrigger>
                <TabsTrigger value="communications" className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Communications</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RevenuePipelineChart
                    data={sampleRevenueData}
                  />
                  <ResponseTimeAnalytics
                    metrics={sampleResponseTimeMetrics}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CompetitiveAnalysisPanel
                    advantages={sampleCompetitiveAdvantages}
                    competitorWins={89}
                    marketPosition="Top 10"
                  />
                  <ConversionFunnel
                    data={sampleConversionFunnelData}
                  />
                </div>

                {/* Key Metrics Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-tnt-red mb-1">
                      {sampleAnalyticsData.totalLeads}
                    </div>
                    <p className="text-sm text-gray-600">Total Leads</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {sampleAnalyticsData.conversionRate.toFixed(1)}%
                    </div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {sampleAnalyticsData.averageResponseTime.toFixed(1)}min
                    </div>
                    <p className="text-sm text-gray-600">Avg Response</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      ${(sampleAnalyticsData.totalRevenue / 1000).toFixed(0)}K
                    </div>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </Card>
                </div>
              </TabsContent>

              {/* Leads Tab */}
              <TabsContent value="leads" className="space-y-6">
                <HighPriorityLeads
                  leads={sampleLeads}
                  onLeadClick={handleLeadClick}
                  onContactLead={handleContactLead}
                />

                {/* All Leads Table */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">All Leads Overview</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Company</th>
                            <th className="text-left py-2">Contact</th>
                            <th className="text-left py-2">Score</th>
                            <th className="text-left py-2">Value</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sampleLeads.slice(0, 10).map((lead) => (
                            <tr key={lead.id} className="border-b hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleLeadClick(lead)}>
                              <td className="py-2 font-medium">{lead.companyName}</td>
                              <td className="py-2 text-gray-600">{lead.contactName}</td>
                              <td className="py-2">
                                <span className={`px-2 py-1 rounded text-xs ${
                                  lead.score >= 80 ? 'bg-green-100 text-green-700' :
                                  lead.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {lead.score}
                                </span>
                              </td>
                              <td className="py-2 font-medium">${lead.estimatedValue.toLocaleString()}</td>
                              <td className="py-2">
                                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-700 capitalize">
                                  {lead.status}
                                </span>
                              </td>
                              <td className="py-2 text-gray-500">
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Communications Tab */}
              <TabsContent value="communications" className="space-y-6">
                <CommunicationHistory
                  communications={sampleCommunicationHistory}
                  leads={sampleLeads}
                  selectedLeadId={selectedLeadId}
                  onLeadSelect={setSelectedLeadId}
                />
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponseTimeAnalytics
                    metrics={sampleResponseTimeMetrics}
                  />
                  <ConversionFunnel
                    data={sampleConversionFunnelData}
                  />
                </div>

                <RevenuePipelineChart
                  data={sampleRevenueData}
                />

                <CompetitiveAnalysisPanel
                  advantages={sampleCompetitiveAdvantages}
                  competitorWins={89}
                  marketPosition="Top 10"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-tnt-black to-tnt-red rounded">
                <span className="text-white font-bold text-sm">TNT</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">TNT Transportation</p>
                <p className="text-xs text-gray-600">Driven by Service, Defined by Excellence</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <span>15+ Years Experience</span>
              <span>•</span>
              <span>National Limousine Association Member</span>
              <span>•</span>
              <span>Trust Analytica Top 10</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function TNTDashboard() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    </AuthProvider>
  );
}