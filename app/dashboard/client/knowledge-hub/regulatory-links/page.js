'use client';

import React from 'react';
import { AlertCircle, CheckCircle2, Clock, FileText, Download, Eye, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ComplianceDashboard() {
  const metrics = [
    { label: 'Total Regulatory Links', value: '148', color: 'bg-blue-50 text-blue-400' },
    { label: 'Updated This Month', value: '28', color: 'bg-purple-50 text-purple-400' },
    { label: 'High Priority Items', value: '14', color: 'bg-amber-50 text-amber-400' },
    { label: 'Require Immediate Attention', value: '8', color: 'bg-red-50 text-red-400' },
  ];

  const deadlines = [
    {
      date: 'May 28, 2025',
      title: 'Regulatory AML Report Submission',
      days: 'Due in 5 days',
      severity: 'critical',
    },
    {
      date: 'TX 4004-2023',
      title: 'CFPB&a 2030 - Cryptocurrency exchange',
      days: 'Due in 15 days',
      severity: 'high',
    },
    {
      date: 'TX 4094-2023',
      title: 'CFPB&a 2030 - Cryptocurrency exchange',
      days: 'Due in 30 days',
      severity: 'medium',
    },
  ];

  const resources = [
    {
      title: 'Financial Conduct Authority (FCA) Handbook',
      description: 'The FCA handbook definition of rules and guidance for financial firms',
      category: 'Regulatory',
      uploaded: '12 May 2023',
      downloads: '1.4K',
      views: '2.8K',
      badge: 'FCA',
    },
    {
      title: 'Bank Secrecy Act (BSA) & Anti-Money Laundering (AML) Regulations',
      description: 'US federal laws requiring financial institutions to assist government agencies in detecting and preventing money laundering',
      category: 'Regulatory',
      uploaded: '15 May 2023',
      downloads: '2.1K',
      views: '5.2K',
      badge: 'BSA',
    },
    {
      title: 'EU Anti-Money Laundering Directive (AML-D) - Full Text',
      description: 'The 5th EU Anti-Money Laundering Directive of the European Union, essential and immediate actions for customer due diligence',
      category: 'Regulatory',
      uploaded: '18 May 2023',
      downloads: '1.8K',
      views: '4.1K',
      badge: 'EU',
    },
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-gradient-to-r from-red-400/30 to-red-500/20 text-red-300 border border-red-700/60 shadow-lg shadow-red-500/10 hover:shadow-red-500/20';
      case 'high':
        return 'bg-gradient-to-r from-orange-400/30 to-orange-500/20 text-orange-300 border border-orange-700/60 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-400/30 to-yellow-500/20 text-yellow-300 border border-yellow-700/60 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20';
      default:
        return 'bg-gradient-to-r from-green-400/30 to-green-500/20 text-green-300 border border-green-700/60 shadow-lg shadow-green-500/10 hover:shadow-green-500/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'high':
        return <Clock className="w-5 h-5 text-amber-400" />;
      case 'medium':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Monitor regulatory requirements and manage compliance tasks</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                <div className={`inline-block px-3 py-2 rounded-lg ${metric.color}`}>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Compliance Status */}
          <Card className="border border-border bg-card/50 backdrop-blur-sm lg:col-span-1 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Compliance Status</h2>
            <div className="flex flex-col items-center justify-center py-8">
              <svg className="w-32 h-32 mb-4" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1e3a8a" strokeWidth="20" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#3b82f6" strokeWidth="20" strokeDasharray="314 314" strokeDashoffset="31" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#f59e0b" strokeWidth="20" strokeDasharray="157 314" strokeDashoffset="-157" />
              </svg>
              <div className="space-y-2 text-center text-sm">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                  <span className="text-muted-foreground">Compliant - 65%</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span className="text-muted-foreground">Pending - 25%</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span className="text-muted-foreground">At Risk - 10%</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="border border-border bg-card/50 backdrop-blur-sm lg:col-span-2 p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {deadlines.map((deadline, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${getSeverityColor(deadline.severity)} flex items-start justify-between gap-4 transition-all hover:border-opacity-100`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(deadline.severity)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{deadline.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{deadline.date}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="whitespace-nowrap">{deadline.days}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Regulatory Resources */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Regulatory Resources</h2>
          <div className="space-y-3">
            {resources.map((resource, idx) => (
              <Card key={idx} className="border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-foreground text-sm md:text-base">{resource.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{resource.description}</p>
                    </div>
                    <Badge className="bg-primary/20 text-primary border border-primary/30 whitespace-nowrap">{resource.badge}</Badge>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-6 text-xs text-muted-foreground">
                      <span>Uploaded {resource.uploaded}</span>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {resource.downloads}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {resource.views}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border border-border text-muted-foreground hover:text-foreground">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border border-border text-muted-foreground hover:text-foreground">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
