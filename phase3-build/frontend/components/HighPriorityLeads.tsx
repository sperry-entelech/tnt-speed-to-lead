'use client';

import React, { useState, useMemo } from 'react';
import { AlertTriangle, Phone, Mail, ExternalLink, Clock, DollarSign, Filter, SortAsc, SortDesc, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Lead } from '@/types';
import { formatCurrency, formatTimeAgo, getPriorityColor, getStatusColor } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface HighPriorityLeadsProps {
  leads?: Lead[];
  onLeadClick?: (lead: Lead) => void;
  onContactLead?: (lead: Lead, method: 'phone' | 'email') => void;
  className?: string;
}

type SortField = 'score' | 'estimatedValue' | 'createdAt' | 'responseTime';
type SortDirection = 'asc' | 'desc';

export default function HighPriorityLeads({
  leads = [],
  onLeadClick,
  onContactLead,
  className
}: HighPriorityLeadsProps) {
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter high priority leads (urgent and high priority)
  const highPriorityLeads = leads.filter(lead =>
    ['urgent', 'high'].includes(lead.priority)
  );

  const sortedAndFilteredLeads = useMemo(() => {
    let filtered = [...highPriorityLeads];

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(lead => lead.priority === filterPriority);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'estimatedValue':
          aValue = a.estimatedValue;
          bValue = b.estimatedValue;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'responseTime':
          aValue = a.responseTime || 999;
          bValue = b.responseTime || 999;
          break;
        default:
          return 0;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [highPriorityLeads, sortField, sortDirection, filterPriority, filterStatus]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  const urgentCount = sortedAndFilteredLeads.filter(lead => lead.priority === 'urgent').length;
  const highValueCount = sortedAndFilteredLeads.filter(lead => lead.estimatedValue >= 1000).length;
  const newLeadsCount = sortedAndFilteredLeads.filter(lead => lead.status === 'new').length;

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-tnt-red animate-pulse" />
            <span>High Priority Leads</span>
            {urgentCount > 0 && (
              <Badge variant="destructive" className="text-xs animate-pulse">
                {urgentCount} urgent
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center space-x-2">
            {/* Filters */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
              </select>
            </div>
            <Badge variant="secondary" className="text-xs">
              {sortedAndFilteredLeads.length} leads
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Quick Stats */}
        <div className="flex items-center justify-around p-4 bg-gray-50 border-b">
          <div className="text-center">
            <div className="text-xl font-bold text-red-600">{urgentCount}</div>
            <p className="text-xs text-gray-600">Urgent</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{highValueCount}</div>
            <p className="text-xs text-gray-600">$1K+ Value</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">{newLeadsCount}</div>
            <p className="text-xs text-gray-600">New Leads</p>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-tnt-red">
              {formatCurrency(sortedAndFilteredLeads.reduce((sum, lead) => sum + lead.estimatedValue, 0))}
            </div>
            <p className="text-xs text-gray-600">Total Value</p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12"></TableHead>
                <TableHead>Company</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('score')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Score</span>
                    {getSortIcon('score')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('estimatedValue')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Value</span>
                    {getSortIcon('estimatedValue')}
                  </div>
                </TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('createdAt')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created</span>
                    {getSortIcon('createdAt')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('responseTime')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Response</span>
                    {getSortIcon('responseTime')}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {sortedAndFilteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No high priority leads found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedAndFilteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b transition-colors hover:bg-gray-50 cursor-pointer ${
                        lead.priority === 'urgent' ? 'bg-red-50 hover:bg-red-100 border-l-4 border-l-red-500' :
                        lead.estimatedValue >= 5000 ? 'bg-green-50 hover:bg-green-100 border-l-4 border-l-green-500' : ''
                      }`}
                      onClick={() => onLeadClick?.(lead)}
                    >
                      <TableCell className="w-12">
                        {lead.priority === 'urgent' ? (
                          <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                        ) : lead.estimatedValue >= 5000 ? (
                          <DollarSign className="h-4 w-4 text-green-500" />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{lead.companyName}</p>
                          <p className="text-xs text-gray-600">{lead.contactName}</p>
                          <p className="text-xs text-gray-500">{lead.serviceType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs px-2 py-1 ${
                          lead.score >= 80 ? 'bg-green-100 text-green-700' :
                          lead.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {lead.score}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">
                          {formatCurrency(lead.estimatedValue)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs px-2 py-1 ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs px-2 py-1 ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-gray-600">
                          {formatTimeAgo(lead.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {lead.responseTime ? (
                          <div className={`text-xs font-medium ${
                            lead.responseTime <= 5 ? 'text-green-600' :
                            lead.responseTime <= 15 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {lead.responseTime}min
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-xs text-red-600">
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onContactLead?.(lead, 'phone');
                            }}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onContactLead?.(lead, 'email');
                            }}
                          >
                            <Mail className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLeadClick?.(lead);
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {/* Action Bar */}
        {sortedAndFilteredLeads.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {sortedAndFilteredLeads.length} high priority leads
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Export List
                </Button>
                <Button size="sm" className="bg-tnt-red hover:bg-tnt-red-dark">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Contact All Urgent
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}