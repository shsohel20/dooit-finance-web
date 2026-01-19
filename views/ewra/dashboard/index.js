"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RiskSummaryCards } from "./risk-summary-card"
import { RiskHeatmap } from "./risk-heatmap"
import { ActionsList } from "./action-list"
import { AssessmentTable } from "./assessment-table"
import { RiskAssessmentConfig } from "./risk-assessment-config"
import { InherentRiskAssessment } from "./inherent-risk-assessment"
import { Plus, Upload } from "lucide-react"

export function EWRADashboard() {
  const [activeView, setActiveView] = useState("dashboard")

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="sticky top-0 z-50  bg-card/80 backdrop-blur-sm">
        <div className=" flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Enterprise-Wide Risk Assessment</h1>
            <p className="text-sm text-muted-foreground">Version: 2024.1 | Period: Q1 2025</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Upload className="h-4 w-4" />
              Import Template
            </Button>
            <Button className="gap-2" onClick={() => setActiveView("config")}>
              <Plus className="h-4 w-4" />
              New Assessment
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className=" bg-card">
        <div className=" px-6">
          <Tabs value={activeView} onValueChange={(v) => setActiveView(v)} className="w-full">
            <TabsList className="h-12 bg-transparent border-b-0">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Configuration
              </TabsTrigger>
              <TabsTrigger
                value="assessment"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
              >
                Risk Assessment
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className=" px-6 py-8">
        {activeView === "dashboard" && (
          <div className="space-y-8">
            <RiskSummaryCards />
            <RiskHeatmap />
            <div className="grid gap-8 lg:grid-cols-2">
              <ActionsList />
              <AssessmentTable />
            </div>
          </div>
        )}

        {activeView === "config" && <RiskAssessmentConfig />}

        {activeView === "assessment" && <InherentRiskAssessment />}
      </main>
    </div>
  )
}
