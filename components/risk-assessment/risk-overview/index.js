'use client';

import { StatCard } from './stat-card';
import { RiskTrendChart } from './risk-trend-chart';
import { IndustryChart } from './industry-chart';
import { RiskDistributionChart } from './risk-distribution-chart';
import { CountryRiskChart } from './country-risk-chart';
import { ChannelChart } from './channel-chart';
import { Button } from '@/components/ui/button';
import {
  Users,
  TrendingDown,
  AlertTriangle,
  Activity,
  Download,
  CalendarDays,
  Search,
  Bell,
  Shield,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { RecentAssessments } from './risk-assesment';

export default function RiskAssessmentAnalyticsDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen ">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 px-4  text-sidebar-foreground border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <Shield className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <span className="text-sm font-bold text-sidebar-primary-foreground">
            RiskGuard
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-md hover:bg-sidebar-accent"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 backdrop-blur-xl border-b">
          <div className="flex items-center justify-between h-16 ">
            <div className="pt-14 lg:pt-0">
              <h2 className="text-lg font-bold tracking-tight">
                Analytics Overview
              </h2>
              <p className="text-xs text-muted-foreground">
                Monitor risk patterns and customer insights
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="h-9 w-64 rounded-lg border bg-card pl-9 pr-4 text-sm text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <CalendarDays className="h-3.5 w-3.5" />
                Last 30 days
              </Button>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
              <button
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="py-6 space-y-6 mt-14 lg:mt-0">
          {/* KPI Row */}
          <section aria-label="Key metrics">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Assessments"
                value="1,284"
                change={12.5}
                icon={<Users className="h-4 w-4" />}
                description="vs. last 30 days"
                sparklineData={[30, 40, 35, 50, 49, 60, 55, 70, 65, 80]}
                accentColor="hsl(221, 83%, 53%)"
              />
              <StatCard
                title="Avg. Risk Score"
                value="32.4"
                change={-5.2}
                icon={<TrendingDown className="h-4 w-4" />}
                description="vs. last 30 days"
                sparklineData={[50, 45, 48, 42, 40, 38, 35, 33, 34, 32]}
                accentColor="hsl(160, 84%, 39%)"
              />
              <StatCard
                title="High Risk Flagged"
                value="129"
                change={8.1}
                icon={<AlertTriangle className="h-4 w-4" />}
                description="vs. last 30 days"
                sparklineData={[10, 15, 12, 18, 20, 19, 22, 25, 23, 28]}
                accentColor="hsl(25, 95%, 53%)"
              />
              <StatCard
                title="Assessments Today"
                value="24"
                change={15.3}
                icon={<Activity className="h-4 w-4" />}
                description="vs. yesterday"
                sparklineData={[5, 8, 6, 12, 10, 15, 14, 18, 20, 24]}
                accentColor="hsl(262, 83%, 58%)"
              />
            </div>
          </section>

          {/* Row 2: Trend + Distribution */}
          <section aria-label="Risk trends and distribution">
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <RiskTrendChart />
              </div>
              <div className="lg:col-span-2">
                <RiskDistributionChart />
              </div>
            </div>
          </section>

          {/* Row 3: Industry + Channel + Country */}
          <section aria-label="Detailed analysis">
            <div className="grid gap-6 lg:grid-cols-3">
              <IndustryChart />
              <ChannelChart />
              <CountryRiskChart />
            </div>
          </section>

          {/* Row 4: Recent Table */}
          <section aria-label="Recent assessments">
            <RecentAssessments />
          </section>
        </div>
      </main>
    </div>
  );
}
