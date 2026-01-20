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
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="border rounded-md bg-white  z-10">
        <div className=" px-6 py-4 bg-primary rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-body tracking-tighter">
                KYC Process Overview
              </h1>
              <p className="text-sm text-body ">
                Monitor and manage customer verification workflows
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className={"bg-accent border-accent"}>
                <Clock className="h-4 w-4 mr-2" />
                Last 24 hours
              </Button>
              <Button size="sm" className={"bg-primary-light"}>
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
            title="Onboarded Customers"
            value="1,055,000"
            icon={<Users className="size-4" />}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <AlertsChart />
          <CaseDistribution />
          <ProcessStages />
        </div>
        {/* Process Stages */}
        <div className="mb-8"></div>
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
