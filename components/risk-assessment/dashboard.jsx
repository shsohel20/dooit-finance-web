'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskOverview } from './risk-overview';
import { InstitutionalRiskRegistry } from './institutional-risk-registry';
import { CustomerRiskAssessment } from './customer-risk-assessment';
import { RiskReports } from './risk-reports';
import { RiskMatrix } from './risk-matrix';
import RiskAssessmentAnalyticsDashboard from './risk-overview/index';

export function RiskAssessmentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Risk Assessment</h1>
        <p className="text-muted-foreground">
          Comprehensive ML/TF risk management based on Basel AML Index, AUSTRAC
          guidelines, and Australian standards
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customer">Customer Risk</TabsTrigger>
          {/* <TabsTrigger value="institutional">Institutional Risk</TabsTrigger> */}
          <TabsTrigger value="matrices">Matrices</TabsTrigger>
          {/* <TabsTrigger value="reports">Reports</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* <RiskOverview /> */}
          <RiskAssessmentAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="matrices" className="space-y-6">
          <RiskMatrix />
        </TabsContent>

        {/* <TabsContent value="institutional" className="space-y-6">
          <InstitutionalRiskRegistry />
        </TabsContent> */}

        <TabsContent value="customer" className="space-y-6">
          <CustomerRiskAssessment />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <RiskReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
