'use client';

import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, TrendingDown, TrendingUp, Timer } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ResponseTimeMetrics } from '@/types';
import { motion } from 'framer-motion';

interface ResponseTimeAnalyticsProps {
  metrics?: ResponseTimeMetrics;
  historicalData?: { period: string; average: number; target: number }[];
  className?: string;
}

const defaultMetrics: ResponseTimeMetrics = {
  average: 4.2,
  target: 5.0,
  within5Min: 87,
  within15Min: 12,
  over15Min: 1,
  totalLeads: 100
};

const defaultHistoricalData = [
  { period: 'Week 1', average: 5.2, target: 5.0 },
  { period: 'Week 2', average: 4.8, target: 5.0 },
  { period: 'Week 3', average: 4.1, target: 5.0 },
  { period: 'Week 4', average: 4.2, target: 5.0 },
];

export default function ResponseTimeAnalytics({
  metrics = defaultMetrics,
  historicalData = defaultHistoricalData,
  className
}: ResponseTimeAnalyticsProps) {
  const [viewType, setViewType] = useState<'overview' | 'detailed'>('overview');

  // Calculate performance indicators
  const performanceScore = (metrics.target - metrics.average) / metrics.target * 100;
  const isUnderTarget = metrics.average <= metrics.target;
  const trend = historicalData.length >= 2
    ? historicalData[historicalData.length - 1].average < historicalData[historicalData.length - 2].average
      ? 'improving' : 'declining'
    : 'stable';

  // Data for pie chart
  const pieData = [
    { name: '≤5 minutes', value: metrics.within5Min, color: '#059669' },
    { name: '5-15 minutes', value: metrics.within15Min, color: '#D97706' },
    { name: '>15 minutes', value: metrics.over15Min, color: '#DC2626' }
  ];

  // Performance benchmarks
  const benchmarks = [
    { label: 'Excellent', range: '≤2 min', color: 'bg-green-500', threshold: 2 },
    { label: 'Good', range: '2-5 min', color: 'bg-blue-500', threshold: 5 },
    { label: 'Fair', range: '5-10 min', color: 'bg-yellow-500', threshold: 10 },
    { label: 'Poor', range: '>10 min', color: 'bg-red-500', threshold: Infinity }
  ];

  const getCurrentBenchmark = () => {
    return benchmarks.find(b => metrics.average <= b.threshold) || benchmarks[benchmarks.length - 1];
  };

  const currentBenchmark = getCurrentBenchmark();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900">{data.period}</p>
          <div className="space-y-1 mt-2">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-tnt-red" />
              <span>Average: {data.average.toFixed(1)} min</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-gray-400" />
              <span>Target: {data.target.toFixed(1)} min</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Timer className="h-5 w-5 text-tnt-red" />
            <span>Response Time Analytics</span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Badge
              variant={isUnderTarget ? "default" : "destructive"}
              className="text-xs"
            >
              {isUnderTarget ? 'On Target' : 'Above Target'}
            </Badge>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewType === 'overview' ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setViewType('overview')}
              >
                Overview
              </Button>
              <Button
                variant={viewType === 'detailed' ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setViewType('detailed')}
              >
                Detailed
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <motion.div
              className={`text-3xl font-bold ${isUnderTarget ? 'text-green-600' : 'text-red-600'}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {metrics.average.toFixed(1)}
            </motion.div>
            <p className="text-xs text-gray-600">Avg Response Time</p>
            <p className="text-xs text-gray-500">minutes</p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">
              {metrics.target.toFixed(1)}
            </div>
            <p className="text-xs text-gray-600">Target Time</p>
            <p className="text-xs text-gray-500">minutes</p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {metrics.within5Min}%
            </div>
            <p className="text-xs text-gray-600">Within 5 Min</p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">Excellent</span>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-tnt-red">
              {metrics.totalLeads}
            </div>
            <p className="text-xs text-gray-600">Total Leads</p>
            <div className="flex items-center justify-center space-x-1 mt-1">
              {trend === 'improving' ? (
                <>
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">Improving</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-3 w-3 text-orange-500" />
                  <span className="text-xs text-orange-600">Monitor</span>
                </>
              )}
            </div>
          </div>
        </div>

        {viewType === 'overview' ? (
          <>
            {/* Performance Indicator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Performance vs Target</h4>
                <Badge className={currentBenchmark.color.replace('bg-', 'bg-opacity-20 text-')}>
                  {currentBenchmark.label}
                </Badge>
              </div>
              <div className="relative">
                <Progress
                  value={Math.min(100, (metrics.target / Math.max(metrics.average, 1)) * 100)}
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Current: {metrics.average.toFixed(1)}min</span>
                  <span>Target: {metrics.target.toFixed(1)}min</span>
                </div>
              </div>
            </div>

            {/* Response Time Distribution */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Response Distribution</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, 'Leads']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Breakdown</h4>
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700">{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{item.value}%</span>
                      <Badge variant="outline" className="text-xs">
                        {Math.round((item.value / 100) * metrics.totalLeads)} leads
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Historical Trend */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Weekly Trend</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#E5E7EB' }}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#E5E7EB' }}
                      label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="average" fill="#DC2626" name="Average" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="target" fill="#E5E7EB" name="Target" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Performance Benchmarks */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Performance Benchmarks</h4>
              <div className="space-y-2">
                {benchmarks.map((benchmark, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${benchmark.color}`} />
                      <span className="text-sm font-medium">{benchmark.label}</span>
                      <span className="text-xs text-gray-500">{benchmark.range}</span>
                    </div>
                    {benchmark === currentBenchmark && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Suggestions */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Improvement Opportunities</h4>
              <div className="space-y-2 text-sm text-gray-600">
                {metrics.average > metrics.target && (
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <span>Average response time is above target. Consider implementing automated lead routing.</span>
                  </div>
                )}
                {metrics.over15Min > 5 && (
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <span>Too many leads taking over 15 minutes to respond. Review staffing during peak hours.</span>
                  </div>
                )}
                {metrics.within5Min < 80 && (
                  <div className="flex items-start space-x-2">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                    <span>Opportunity to increase 5-minute response rate through better notification systems.</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}