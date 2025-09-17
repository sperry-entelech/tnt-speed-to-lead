'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';
import { RevenueData } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface RevenuePipelineChartProps {
  data?: RevenueData[];
  className?: string;
}

export default function RevenuePipelineChart({ data = [], className }: RevenuePipelineChartProps) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'combo'>('combo');
  const [timeRange, setTimeRange] = useState<'6m' | '12m' | 'ytd'>('6m');

  // Calculate key metrics
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalTarget = data.reduce((sum, item) => sum + item.target, 0);
  const totalLeads = data.reduce((sum, item) => sum + item.leads, 0);
  const totalConversions = data.reduce((sum, item) => sum + item.conversions, 0);
  const avgConversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
  const targetAchievement = totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;

  // Get latest month data for trends
  const latestMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];

  const revenueGrowth = previousMonth
    ? ((latestMonth?.revenue - previousMonth.revenue) / previousMonth.revenue) * 100
    : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.dataKey}:</span>
              <span className="font-medium">
                {entry.dataKey.includes('Rate')
                  ? `${entry.value.toFixed(1)}%`
                  : entry.dataKey.includes('revenue') || entry.dataKey.includes('target')
                    ? formatCurrency(entry.value)
                    : entry.value
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" fill="#DC2626" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="#E5E7EB" name="Target" radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#DC2626"
              name="Revenue"
              strokeWidth={3}
              dot={{ fill: '#DC2626', r: 6 }}
              activeDot={{ r: 8, fill: '#B91C1C' }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#6B7280"
              name="Target"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#6B7280', r: 4 }}
            />
          </LineChart>
        );

      case 'combo':
      default:
        return (
          <ComposedChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#E5E7EB' }}
              tickFormatter={(value) => `${value.toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="revenue"
              fill="#DC2626"
              name="Revenue"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="target"
              fill="#E5E7EB"
              name="Target"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="conversionRate"
              stroke="#059669"
              name="Conversion Rate"
              strokeWidth={3}
              dot={{ fill: '#059669', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        );
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5 text-tnt-red" />
            <span>Revenue Pipeline</span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            {/* Time Range Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: '6m', label: '6M' },
                { key: '12m', label: '12M' },
                { key: 'ytd', label: 'YTD' }
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={timeRange === option.key ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setTimeRange(option.key as '6m' | '12m' | 'ytd')}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {[
                { key: 'combo', label: 'Combo' },
                { key: 'bar', label: 'Bar' },
                { key: 'line', label: 'Line' }
              ].map((option) => (
                <Button
                  key={option.key}
                  variant={chartType === option.key ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-3 text-xs"
                  onClick={() => setChartType(option.key as 'bar' | 'line' | 'combo')}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(totalRevenue)}
              </span>
            </div>
            <p className="text-xs text-gray-600">Total Revenue</p>
            {revenueGrowth !== 0 && (
              <div className="flex items-center justify-center space-x-1 mt-1">
                <TrendingUp className={`h-3 w-3 ${revenueGrowth > 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-xs font-medium ${revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {revenueGrowth > 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%
                </span>
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="h-4 w-4 text-tnt-red" />
              <span className="text-2xl font-bold text-tnt-red">
                {targetAchievement.toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-gray-600">Target Achievement</p>
            <Badge
              variant={targetAchievement >= 100 ? "default" : "secondary"}
              className="text-xs mt-1"
            >
              {targetAchievement >= 100 ? 'Exceeded' : 'In Progress'}
            </Badge>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalLeads}</div>
            <p className="text-xs text-gray-600">Total Leads</p>
            <p className="text-xs text-gray-500 mt-1">{totalConversions} converted</p>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {avgConversionRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-600">Avg Conversion</p>
            <p className="text-xs text-gray-500 mt-1">This period</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>

        {/* Monthly Performance Table */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Monthly Performance</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs font-medium text-gray-500">Month</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500">Revenue</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500">Target</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500">Achievement</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500">Leads</th>
                  <th className="text-right py-2 text-xs font-medium text-gray-500">Conversion</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => {
                  const achievement = (item.revenue / item.target) * 100;
                  return (
                    <tr key={item.month} className="border-b border-gray-100">
                      <td className="py-2 font-medium">{item.month}</td>
                      <td className="text-right py-2 font-medium text-green-600">
                        {formatCurrency(item.revenue)}
                      </td>
                      <td className="text-right py-2 text-gray-600">
                        {formatCurrency(item.target)}
                      </td>
                      <td className="text-right py-2">
                        <Badge
                          variant={achievement >= 100 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {achievement.toFixed(0)}%
                        </Badge>
                      </td>
                      <td className="text-right py-2 text-gray-600">{item.leads}</td>
                      <td className="text-right py-2 text-blue-600">
                        {item.conversionRate.toFixed(1)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}