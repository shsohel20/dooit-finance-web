import React from "react";
import { MetricCard } from "./metric-card";
import { AlertsChart } from "./alerts-chart";
import { CaseDistribution } from "./case-distribution";
import { ProcessStages } from "./process-stages";
import { CasesTable } from "./cases-table";
import { HighRiskCustomers } from "./high-risk-customers";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Clock, TrendingUp, AlertTriangle, CheckCircle2, Users } from "lucide-react";

export default function ClientDashboard() {
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="shadow-sm rounded-md bg-white sticky top-0 z-10">
        <div className=" px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">KYC Process Overview</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor and manage customer verification workflows
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Last 24 hours
              </Button>
              <Button size="sm">
                Export Report
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className=" mt-4">
        {/* Top Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <MetricCard
            title="Total Onboarded Customers"
            value="1,055"
            icon={<Users className="h-5 w-5" />}
            trend={{ value: "+12.5%", positive: true }}
          />
          <MetricCard
            title="Open Alerts & Cases"
            value="109"
            icon={<AlertTriangle className="h-5 w-5" />}
            trend={{ value: "-3.2%", positive: true }}
          />
          <MetricCard
            title="Recent Watchlist Matches"
            value="31"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={{ value: "+5.1%", positive: false }}
          />
          <MetricCard
            title="New This Week"
            value="56"
            icon={<CheckCircle2 className="h-5 w-5" />}
            trend={{ value: "+8.4%", positive: true }}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
          <AlertsChart />
          <CaseDistribution />
        </div>

        {/* Process Stages */}
        <div className="mb-8">
          <ProcessStages />
        </div>

        {/* Cases Table */}
        <div className="mb-8">
          <CasesTable />
        </div>

        {/* High Risk Customers */}
        <HighRiskCustomers />
      </main>
    </div>
  );
}
