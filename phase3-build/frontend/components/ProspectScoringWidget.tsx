'use client';

import React, { useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types';
import { getScoreColor, getScoreBgColor, formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ProspectScoringWidgetProps {
  leads?: Lead[];
  className?: string;
}

interface ScoreMetrics {
  averageScore: number;
  highScoreCount: number;
  mediumScoreCount: number;
  lowScoreCount: number;
  topProspects: Lead[];
  scoreDistribution: { range: string; count: number; percentage: number }[];
  totalValue: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

export default function ProspectScoringWidget({ leads = [], className }: ProspectScoringWidgetProps) {
  const scoreMetrics = useMemo((): ScoreMetrics => {
    if (leads.length === 0) {
      return {
        averageScore: 0,
        highScoreCount: 0,
        mediumScoreCount: 0,
        lowScoreCount: 0,
        topProspects: [],
        scoreDistribution: [],
        totalValue: 0,
        trend: 'stable',
        trendPercentage: 0
      };
    }

    const averageScore = Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length);
    const highScoreCount = leads.filter(lead => lead.score >= 80).length;
    const mediumScoreCount = leads.filter(lead => lead.score >= 60 && lead.score < 80).length;
    const lowScoreCount = leads.filter(lead => lead.score < 60).length;

    const topProspects = [...leads]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const scoreDistribution = [
      { range: '80-100', count: highScoreCount, percentage: Math.round((highScoreCount / leads.length) * 100) },
      { range: '60-79', count: mediumScoreCount, percentage: Math.round((mediumScoreCount / leads.length) * 100) },
      { range: '0-59', count: lowScoreCount, percentage: Math.round((lowScoreCount / leads.length) * 100) }
    ];

    const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);

    // Simulate trend calculation (in real app, this would compare with previous period)
    const trend: 'up' | 'down' | 'stable' = averageScore > 70 ? 'up' : averageScore < 60 ? 'down' : 'stable';
    const trendPercentage = Math.abs(averageScore - 65); // Mock trend percentage

    return {
      averageScore,
      highScoreCount,
      mediumScoreCount,
      lowScoreCount,
      topProspects,
      scoreDistribution,
      totalValue,
      trend,
      trendPercentage
    };
  }, [leads]);

  const getTrendIcon = () => {
    switch (scoreMetrics.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (scoreMetrics.trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-tnt-red" />
            <span>Prospect Scoring</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {leads.length} prospects
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Average Score Display */}
        <div className="text-center">
          <motion.div
            className={`text-4xl font-bold ${getScoreColor(scoreMetrics.averageScore)}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {scoreMetrics.averageScore}
          </motion.div>
          <p className="text-sm text-gray-600 mt-1">Average Lead Score</p>
          <div className="flex items-center justify-center space-x-1 mt-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getTrendColor()}`}>
              {scoreMetrics.trendPercentage.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">vs last period</span>
          </div>
        </div>

        {/* Score Distribution */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Score Distribution</h4>
          {scoreMetrics.scoreDistribution.map((dist, index) => (
            <div key={dist.range} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Score {dist.range}</span>
                <span className="font-medium">
                  {dist.count} leads ({dist.percentage}%)
                </span>
              </div>
              <Progress
                value={dist.percentage}
                className={`h-2 ${
                  dist.range === '80-100' ? 'bg-green-100' :
                  dist.range === '60-79' ? 'bg-yellow-100' : 'bg-red-100'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {scoreMetrics.highScoreCount}
            </div>
            <p className="text-xs text-gray-600">High-Quality Leads</p>
            <p className="text-xs text-gray-500">(80+ score)</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-tnt-red">
              {formatCurrency(scoreMetrics.totalValue)}
            </div>
            <p className="text-xs text-gray-600">Total Pipeline Value</p>
            <p className="text-xs text-gray-500">All scored leads</p>
          </div>
        </div>

        {/* Top Prospects */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Top Prospects</h4>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {scoreMetrics.topProspects.map((lead, index) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {lead.companyName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {lead.contactName} • {formatCurrency(lead.estimatedValue)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    className={`text-xs px-2 py-1 ${getScoreBgColor(lead.score)} ${getScoreColor(lead.score)}`}
                  >
                    {lead.score}
                  </Badge>
                  {index === 0 && (
                    <Award className="h-3 w-3 text-amber-500" />
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scoring Factors Legend */}
        <div className="border-t pt-4">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Scoring Factors</h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>• Lead value (40pts)</div>
            <div>• Response time (20pts)</div>
            <div>• Lead source (20pts)</div>
            <div>• Service type (20pts)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}