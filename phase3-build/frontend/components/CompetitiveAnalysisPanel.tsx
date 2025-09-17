'use client';

import React, { useState } from 'react';
import { Award, Star, Shield, Clock, Users, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CompetitiveAdvantage } from '@/types';
import { motion } from 'framer-motion';

interface CompetitiveAnalysisPanelProps {
  advantages?: CompetitiveAdvantage[];
  competitorWins?: number;
  marketPosition?: string;
  className?: string;
}

const defaultAdvantages: CompetitiveAdvantage[] = [
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

export default function CompetitiveAnalysisPanel({
  advantages = defaultAdvantages,
  competitorWins = 89,
  marketPosition = 'Top 10',
  className
}: CompetitiveAnalysisPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Filter advantages by category
  const filteredAdvantages = selectedCategory === 'all'
    ? advantages
    : advantages.filter(adv => adv.category === selectedCategory);

  // Get categories for filter buttons
  const categories = ['all', ...Array.from(new Set(advantages.map(adv => adv.category)))];

  const getImpactColor = (impact: CompetitiveAdvantage['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'certification':
        return <Award className="h-4 w-4" />;
      case 'experience':
        return <Star className="h-4 w-4" />;
      case 'technology':
        return <Shield className="h-4 w-4" />;
      case 'service':
        return <Users className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  // Calculate competitive metrics
  const highImpactCount = advantages.filter(adv => adv.impact === 'high').length;
  const certificationCount = advantages.filter(adv => adv.category === 'certification').length;
  const competitiveScore = Math.round((highImpactCount / advantages.length) * 100);

  const keyMetrics = [
    {
      label: 'Market Position',
      value: marketPosition,
      icon: <TrendingUp className="h-5 w-5 text-green-600" />,
      color: 'text-green-600'
    },
    {
      label: 'Competitive Wins',
      value: `${competitorWins}%`,
      icon: <Award className="h-5 w-5 text-blue-600" />,
      color: 'text-blue-600'
    },
    {
      label: 'High-Impact Advantages',
      value: highImpactCount.toString(),
      icon: <Star className="h-5 w-5 text-yellow-600" />,
      color: 'text-yellow-600'
    },
    {
      label: 'Industry Certifications',
      value: certificationCount.toString(),
      icon: <Shield className="h-5 w-5 text-purple-600" />,
      color: 'text-purple-600'
    }
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Award className="h-5 w-5 text-tnt-red" />
            <span>Competitive Analysis</span>
          </CardTitle>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {advantages.length} advantages
            </Badge>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${competitiveScore >= 70 ? 'bg-green-500' : competitiveScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-600">Strength Score: {competitiveScore}%</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {keyMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 rounded-lg bg-gray-50"
            >
              <div className="flex justify-center mb-2">
                {metric.icon}
              </div>
              <div className={`text-xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
              <p className="text-xs text-gray-600 mt-1">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="h-8 px-3 text-xs capitalize"
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? (
                <CheckCircle className="h-3 w-3 mr-1" />
              ) : (
                getCategoryIcon(category)
              )}
              <span className="ml-1">
                {category === 'all' ? 'All' : category}
                {category !== 'all' && (
                  <span className="ml-1 text-xs opacity-60">
                    ({advantages.filter(adv => adv.category === category).length})
                  </span>
                )}
              </span>
            </Button>
          ))}
        </div>

        {/* Advantages Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {filteredAdvantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer ${
                expandedCard === advantage.title ? 'border-tnt-red bg-red-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setExpandedCard(expandedCard === advantage.title ? null : advantage.title)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{advantage.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {advantage.title}
                    </h4>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge
                        className={`text-xs px-2 py-1 ${getImpactColor(advantage.impact)}`}
                      >
                        {advantage.impact} impact
                      </Badge>
                      <Badge variant="outline" className="text-xs px-2 py-1 capitalize">
                        {advantage.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                {getCategoryIcon(advantage.category)}
              </div>

              <p className="text-xs text-gray-600 mb-3">
                {advantage.description}
              </p>

              {/* Impact Visualization */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Competitive Impact</span>
                  <span className="font-medium">
                    {advantage.impact === 'high' ? '85%' : advantage.impact === 'medium' ? '65%' : '45%'}
                  </span>
                </div>
                <Progress
                  value={advantage.impact === 'high' ? 85 : advantage.impact === 'medium' ? 65 : 45}
                  className="h-1.5"
                />
              </div>

              {/* Expanded Details */}
              {expandedCard === advantage.title && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-gray-200"
                >
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Client Retention Impact:</span>
                      <span className="font-medium text-green-600">+15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lead Conversion Boost:</span>
                      <span className="font-medium text-blue-600">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Competitive Edge:</span>
                      <span className="font-medium text-purple-600">Strong</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Details
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* TNT Excellence Summary */}
        <div className="border-t pt-6">
          <div className="bg-gradient-to-r from-tnt-black to-tnt-red p-4 rounded-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">TNT Excellence</h3>
              <Badge className="bg-white text-tnt-black">
                Driven by Service, Defined by Excellence
              </Badge>
            </div>
            <p className="text-sm opacity-90 mb-4">
              With our proven track record, industry certifications, and advanced technology,
              TNT Transportation consistently outperforms competitors in service quality and customer satisfaction.
            </p>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">15+</div>
                <div className="text-xs opacity-80">Years Experience</div>
              </div>
              <div>
                <div className="text-2xl font-bold">95%</div>
                <div className="text-xs opacity-80">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-2xl font-bold">&lt;5min</div>
                <div className="text-xs opacity-80">Response Time</div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-4 bg-white text-tnt-black hover:bg-gray-100"
            >
              <Award className="h-4 w-4 mr-2" />
              View All Certifications
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}