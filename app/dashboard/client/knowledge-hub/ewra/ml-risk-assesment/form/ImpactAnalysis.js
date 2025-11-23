'use client';

import React from 'react';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2, DollarSign, Shield } from 'lucide-react';

export default function ImpactAnalysis({
  currentImpactItems = [
    {
      title: 'Affected Processes',
      value: 'Customer Onboarding, Fraud Detection',
      description: 'Critical business processes impacted',
      icon: <AlertCircle className="w-6 h-6" />
    },
    {
      title: 'Customers Impacted',
      value: '850+ (85% of new applications)',
      description: 'Active user base affected',
      icon: <TrendingDown className="w-6 h-6" />
    },
    {
      title: 'Financial Exposure',
      value: 'Estimated $45,000 potential fraud risk',
      description: 'Direct financial impact',
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      title: 'Compliance Risk',
      value: 'Medium - Potential KYC regulation violations',
      description: 'Regulatory exposure',
      icon: <Shield className="w-6 h-6" />
    }
  ],
  mitigationBenefitsItems = [
    {
      title: 'Accuracy Improvement',
      value: 'Expected +22% (to 94% target)',
      description: 'Model performance enhancement',
      icon: <CheckCircle2 className="w-6 h-6" />
    },
    {
      title: 'Risk Reduction',
      value: '95% reduction in false positives',
      description: 'Decreased operational risk',
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      title: 'Cost Savings',
      value: 'Estimated $38,000 monthly savings',
      description: 'Financial benefit realized',
      icon: <DollarSign className="w-6 h-6" />
    },
    {
      title: 'Compliance Improvement',
      value: 'Full regulatory compliance restoration',
      description: 'Regulatory requirements met',
      icon: <CheckCircle2 className="w-6 h-6" />
    }
  ]
}) {
  return (
    <div className="">
      {/* Header */}
      <div className="mb-8  ">
        <h2 className=" font-bold text-foreground mb-1 tracking-tight">
          Impact Analysis
        </h2>
        <p className="text-muted-foreground ">
          Current state vs expected mitigation outcomes
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
        {/* Current Impact Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-bold text-foreground">Current Impact</h3>
          </div>

          <div className="space-y-4">
            {currentImpactItems.map((item, index) => (
              <div
                key={index}
                className="group p-5 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-destructive/30 transition-all duration-300 hover:shadow-lg hover:shadow-destructive/5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1 text-destructive/70 group-hover:text-destructive transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm font-medium text-foreground mb-2 leading-tight">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mitigation Benefits Section */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className=" font-bold text-foreground">Mitigation Benefits</h3>
          </div>

          <div className="space-y-4">
            {mitigationBenefitsItems.map((item, index) => (
              <div
                key={index}
                className="group p-5 rounded-xl border border-border bg-card/50 hover:bg-card  transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1 text-accent/70 group-hover:text-accent transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground text-sm uppercase tracking-wide mb-1">
                      {item.title}
                    </h4>
                    <p className="text-sm font-medium text-foreground mb-2 leading-tight">
                      {item.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
