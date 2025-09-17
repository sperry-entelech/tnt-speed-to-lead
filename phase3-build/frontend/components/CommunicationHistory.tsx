'use client';

import React, { useState, useMemo } from 'react';
import { MessageSquare, Phone, Mail, User, Calendar, Clock, Filter, Search, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CommunicationRecord, Lead } from '@/types';
import { formatDateTime, formatTimeAgo } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CommunicationHistoryProps {
  communications?: CommunicationRecord[];
  leads?: Lead[];
  selectedLeadId?: string;
  onLeadSelect?: (leadId: string) => void;
  className?: string;
}

export default function CommunicationHistory({
  communications = [],
  leads = [],
  selectedLeadId,
  onLeadSelect,
  className
}: CommunicationHistoryProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDirection, setFilterDirection] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'timeline' | 'grouped'>('timeline');

  // Filter and sort communications
  const filteredCommunications = useMemo(() => {
    let filtered = [...communications];

    // Filter by selected lead
    if (selectedLeadId) {
      filtered = filtered.filter(comm => comm.leadId === selectedLeadId);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(comm => comm.type === filterType);
    }

    // Filter by direction
    if (filterDirection !== 'all') {
      filtered = filtered.filter(comm => comm.direction === filterDirection);
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(comm =>
        comm.message.toLowerCase().includes(term) ||
        comm.subject?.toLowerCase().includes(term) ||
        comm.userName.toLowerCase().includes(term)
      );
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [communications, selectedLeadId, filterType, filterDirection, searchTerm]);

  // Group communications by lead for grouped view
  const groupedCommunications = useMemo(() => {
    const groups: Record<string, CommunicationRecord[]> = {};
    filteredCommunications.forEach(comm => {
      if (!groups[comm.leadId]) {
        groups[comm.leadId] = [];
      }
      groups[comm.leadId].push(comm);
    });
    return groups;
  }, [filteredCommunications]);

  const getLeadByIds = (leadId: string) => leads.find(lead => lead.id === leadId);

  const getCommunicationIcon = (type: CommunicationRecord['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'note':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getCommunicationColor = (type: CommunicationRecord['type']) => {
    switch (type) {
      case 'email':
        return 'text-blue-600 bg-blue-100';
      case 'phone':
        return 'text-green-600 bg-green-100';
      case 'sms':
        return 'text-purple-600 bg-purple-100';
      case 'meeting':
        return 'text-orange-600 bg-orange-100';
      case 'note':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const communicationStats = useMemo(() => {
    const total = filteredCommunications.length;
    const byType = filteredCommunications.reduce((acc, comm) => {
      acc[comm.type] = (acc[comm.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const successful = filteredCommunications.filter(comm => comm.successful).length;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    const outbound = filteredCommunications.filter(comm => comm.direction === 'outbound').length;
    const inbound = total - outbound;

    return { total, byType, successRate, outbound, inbound };
  }, [filteredCommunications]);

  const TimelineView = () => (
    <ScrollArea className="h-96">
      <div className="space-y-4 p-4">
        <AnimatePresence>
          {filteredCommunications.map((comm, index) => {
            const lead = getLeadByIds(comm.leadId);
            return (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className="flex space-x-4 relative"
              >
                {/* Timeline Line */}
                {index < filteredCommunications.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200" />
                )}

                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getCommunicationColor(comm.type)}`}>
                  {getCommunicationIcon(comm.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {comm.subject || `${comm.type.charAt(0).toUpperCase() + comm.type.slice(1)} Communication`}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {comm.direction}
                      </Badge>
                      {comm.successful ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-600" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(comm.timestamp)}
                    </span>
                  </div>

                  <div className="mb-2">
                    <p className="text-sm text-gray-700">{comm.message}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{comm.userName}</span>
                      </span>
                      {lead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs"
                          onClick={() => onLeadSelect?.(lead.id)}
                        >
                          {lead.companyName}
                        </Button>
                      )}
                      {comm.duration && (
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{comm.duration}min</span>
                        </span>
                      )}
                    </div>
                    <span>{formatDateTime(comm.timestamp)}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredCommunications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No communications found</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );

  const GroupedView = () => (
    <ScrollArea className="h-96">
      <div className="space-y-4 p-4">
        {Object.entries(groupedCommunications).map(([leadId, comms]) => {
          const lead = getLeadByIds(leadId);
          return (
            <div key={leadId} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Lead Header */}
              <div
                className="bg-gray-50 p-3 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => onLeadSelect?.(leadId)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {lead?.companyName || 'Unknown Company'}
                    </h4>
                    <p className="text-sm text-gray-600">{lead?.contactName}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {comms.length} communications
                  </Badge>
                </div>
              </div>

              {/* Communications */}
              <div className="p-3 space-y-3">
                {comms.map((comm) => (
                  <div key={comm.id} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getCommunicationColor(comm.type)}`}>
                      {getCommunicationIcon(comm.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium">
                          {comm.subject || comm.type}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {comm.direction}
                        </Badge>
                        {comm.successful ? (
                          <CheckCircle className="h-3 w-3 text-green-600" />
                        ) : (
                          <XCircle className="h-3 w-3 text-red-600" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{comm.message}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{comm.userName}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(comm.timestamp)}</span>
                        {comm.duration && (
                          <>
                            <span>•</span>
                            <span>{comm.duration}min</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <MessageSquare className="h-5 w-5 text-tnt-red" />
            <span>Communication History</span>
            {selectedLeadId && (
              <Badge variant="secondary" className="text-xs">
                {getLeadByIds(selectedLeadId)?.companyName || 'Selected Lead'}
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'timeline' ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setViewMode('timeline')}
              >
                Timeline
              </Button>
              <Button
                variant={viewMode === 'grouped' ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setViewMode('grouped')}
              >
                By Lead
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats and Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-tnt-red">{communicationStats.total}</div>
            <p className="text-xs text-gray-600">Total Communications</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {communicationStats.successRate.toFixed(0)}%
            </div>
            <p className="text-xs text-gray-600">Success Rate</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{communicationStats.outbound}</div>
            <p className="text-xs text-gray-600">Outbound</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{communicationStats.inbound}</div>
            <p className="text-xs text-gray-600">Inbound</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1"
            >
              <option value="all">All Types</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="sms">SMS</option>
              <option value="meeting">Meeting</option>
              <option value="note">Note</option>
            </select>
          </div>

          <select
            value={filterDirection}
            onChange={(e) => setFilterDirection(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Directions</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>

          <div className="flex items-center space-x-1">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search communications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 w-48"
            />
          </div>

          {(filterType !== 'all' || filterDirection !== 'all' || searchTerm) && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => {
                setFilterType('all');
                setFilterDirection('all');
                setSearchTerm('');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Communication Timeline/Grouped View */}
        {viewMode === 'timeline' ? <TimelineView /> : <GroupedView />}

        {/* Type Breakdown */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Communication Breakdown</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(communicationStats.byType).map(([type, count]) => (
              <Badge
                key={type}
                variant="outline"
                className={`text-xs px-3 py-1 ${getCommunicationColor(type)}`}
              >
                <div className="flex items-center space-x-1">
                  {getCommunicationIcon(type as CommunicationRecord['type'])}
                  <span className="capitalize">{type}: {count}</span>
                </div>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}