'use client';

import React, { useState } from 'react';
import { TrendingDown, Users, Target, DollarSign, ArrowRight, AlertCircle } from 'lucide-react';
import { FunnelChart, Funnel, LabelList, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ConversionFunnelData } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ConversionFunnelProps {
  data?: ConversionFunnelData[];
  className?: string;
}

const defaultData: ConversionFunnelData[] = [
  { stage: 'New Leads', count: 150, percentage: 100, value: 450000 },
  { stage: 'Contacted', count: 135, percentage: 90, value: 405000 },
  { stage: 'Qualified', count: 108, percentage: 72, value: 324000 },
  { stage: 'Proposal Sent', count: 85, percentage: 57, value: 255000 },
  { stage: 'Converted', count: 68, percentage: 45, value: 204000 }
];

export default function ConversionFunnel({
  data = defaultData,
  className
}: ConversionFunnelProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'detailed'>('chart');
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  // Calculate conversion rates between stages
  const conversionRates = data.map((stage, index) => {
    if (index === 0) return null;
    const previousStage = data[index - 1];
    return {
      from: previousStage.stage,
      to: stage.stage,
      rate: (stage.count / previousStage.count) * 100,
      dropped: previousStage.count - stage.count
    };
  }).filter(Boolean);

  // Calculate key metrics
  const overallConversionRate = data.length > 0 ? (data[data.length - 1].count / data[0].count) * 100 : 0;
  const totalLeadsLost = data.length > 0 ? data[0].count - data[data.length - 1].count : 0;
  const averageStageConversion = conversionRates.length > 0
    ? conversionRates.reduce((sum, rate) => sum + rate!.rate, 0) / conversionRates.length
    : 0;

  // Find bottlenecks (stages with conversion rates below 70%)
  const bottlenecks = conversionRates.filter(rate => rate!.rate < 70);

  // Color scheme for funnel stages
  const stageColors = [
    '#DC2626', // Red for new leads
    '#EA580C', // Orange for contacted
    '#D97706', // Amber for qualified
    '#65A30D', // Lime for proposals
    '#059669'  // Green for converted
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload.payload;
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900 mb-2">{data.stage}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Count:</span>
              <span className="font-medium">{data.count} leads</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Percentage:</span>
              <span className="font-medium">{data.percentage.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Value:</span>
              <span className="font-medium">{formatCurrency(data.value)}</span>
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
            <TrendingDown className="h-5 w-5 text-tnt-red" />
            <span>Conversion Funnel</span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Badge
              variant={overallConversionRate >= 50 ? "default" : "destructive"}
              className="text-xs"
            >
              {overallConversionRate.toFixed(1)}% conversion
            </Badge>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'chart' ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setViewMode('chart')}
              >
                Chart
              </Button>
              <Button
                variant={viewMode === 'detailed' ? "default" : "ghost"}
                size="sm"
                className="h-7 px-3 text-xs"
                onClick={() => setViewMode('detailed')}
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
            <div className="text-2xl font-bold text-tnt-red">
              {data[0]?.count || 0}
            </div>
            <p className="text-xs text-gray-600">Initial Leads</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {data[data.length - 1]?.count || 0}
            </div>
            <p className="text-xs text-gray-600">Converted</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {totalLeadsLost}
            </div>
            <p className="text-xs text-gray-600">Leads Lost</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {averageStageConversion.toFixed(0)}%
            </div>
            <p className="text-xs text-gray-600">Avg Stage Rate</p>
          </div>
        </div>

        {viewMode === 'chart' ? (
          <>
            {/* Funnel Chart */}
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <FunnelChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Funnel
                    dataKey="count"
                    data={data}
                    isAnimationActive
                    animationDuration={1000}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={stageColors[index % stageColors.length]}
                        onClick={() => setSelectedStage(entry.stage)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                    <LabelList
                      position="center"
                      fill="#fff"
                      stroke="none"
                      fontSize={12}
                      formatter={(value: number, entry: any) =>
                        `${entry.stage}: ${value} (${entry.percentage.toFixed(0)}%)`
                      }
                    />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </div>

            {/* Stage Conversion Rates */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Stage-to-Stage Conversion</h4>
              <div className="space-y-2">
                {conversionRates.map((rate, index) => (
                  <motion.div
                    key={`${rate!.from}-${rate!.to}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: stageColors[index + 1] }} />
                      <span className="text-sm font-medium">
                        {rate!.from} → {rate!.to}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className={`text-sm font-bold ${
                          rate!.rate >= 80 ? 'text-green-600' :
                          rate!.rate >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {rate!.rate.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          -{rate!.dropped} leads
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Detailed View */}
            <div className="space-y-4">
              {data.map((stage, index) => {
                const previousStage = data[index - 1];
                const conversionFromPrevious = previousStage
                  ? (stage.count / previousStage.count) * 100
                  : 100;
                const dropped = previousStage ? previousStage.count - stage.count : 0;

                return (
                  <motion.div
                    key={stage.stage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      selectedStage === stage.stage
                        ? 'border-tnt-red bg-red-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedStage(selectedStage === stage.stage ? null : stage.stage)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: stageColors[index] }}
                        />
                        <h4 className="text-lg font-semibold">{stage.stage}</h4>
                        {conversionFromPrevious < 60 && index > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            Bottleneck
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{stage.count}</div>
                        <div className="text-xs text-gray-500">leads</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-sm font-medium text-gray-700">Percentage of Total</div>
                        <div className="text-lg font-bold text-blue-600">{stage.percentage.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">Pipeline Value</div>
                        <div className="text-lg font-bold text-green-600">{formatCurrency(stage.value)}</div>
                      </div>
                      {index > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-700">Conversion Rate</div>
                          <div className={`text-lg font-bold ${
                            conversionFromPrevious >= 80 ? 'text-green-600' :
                            conversionFromPrevious >= 60 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {conversionFromPrevious.toFixed(1)}%
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Progress through funnel</span>
                        <span>{stage.percentage.toFixed(1)}% of initial leads</span>
                      </div>
                      <Progress
                        value={stage.percentage}
                        className="h-2"
                        style={{
                          backgroundColor: `${stageColors[index]}20`
                        }}
                      />
                    </div>

                    {/* Dropped Leads Info */}
                    {index > 0 && dropped > 0 && (
                      <div className="mt-3 p-2 bg-red-50 rounded border-l-4 border-l-red-400">
                        <div className="flex items-center space-x-2 text-sm">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <span className="text-red-800">
                            {dropped} leads lost from previous stage
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Expanded Details */}
                    {selectedStage === stage.stage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Average Deal Size:</span>
                            <span className="ml-2 font-medium">
                              {formatCurrency(stage.value / stage.count)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Time in Stage:</span>
                            <span className="ml-2 font-medium">2.3 days avg</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Success Rate:</span>
                            <span className="ml-2 font-medium text-green-600">
                              {conversionFromPrevious.toFixed(0)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Value Velocity:</span>
                            <span className="ml-2 font-medium">$12K/day</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Bottleneck Analysis */}
            {bottlenecks.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Identified Bottlenecks</h4>
                <div className="space-y-2">
                  {bottlenecks.map((bottleneck, index) => (
                    <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">
                          {bottleneck!.from} → {bottleneck!.to}: {bottleneck!.rate.toFixed(1)}% conversion
                        </p>
                        <p className="text-xs text-red-700">
                          Below target threshold - losing {bottleneck!.dropped} leads at this stage
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Action Items */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Overall conversion rate: <span className="font-semibold">{overallConversionRate.toFixed(1)}%</span>
            </div>
            <Button size="sm" className="bg-tnt-red hover:bg-tnt-red-dark">
              <Target className="h-4 w-4 mr-1" />
              Optimize Funnel
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}