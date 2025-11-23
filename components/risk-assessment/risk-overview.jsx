"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, TrendingUp, Users } from "lucide-react"
import { RiskMatrix } from "./risk-matrix"
import { RiskDistributionChart } from "./risk-distribution-chart"

export function RiskOverview() {
  const stats = [
    {
      title: "Total Risk Items",
      value: "156",
      change: "+12 this month",
      icon: Shield,
      color: "text-blue-600",
    },
    {
      title: "High/Critical Risks",
      value: "23",
      change: "-3 from last month",
      icon: AlertTriangle,
      color: "text-red-600",
    },
    {
      title: "Customer Assessments",
      value: "1,247",
      change: "+89 this week",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Risk Trend",
      value: "Improving",
      change: "15% reduction",
      icon: TrendingUp,
      color: "text-emerald-600",
    },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Risk Assessment Framework</CardTitle>
          <CardDescription>
            Built on globally and locally recognized standards for robust ML/TF risk management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="space-y-1">
              <div className="font-semibold text-base">Overall Methodology & Jurisdiction Risk</div>
              <p className="text-muted-foreground leading-relaxed">
                Informed by the <strong>Basel AML Index</strong> and aligned with <strong>AUSTRAC's</strong> risk-based
                approach guidance. Jurisdiction risk is classified using the Basel AML Index, FATF's lists of High-Risk
                and Monitored Jurisdictions, and major international sanctions lists.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-base">Occupation Risk</div>
              <p className="text-muted-foreground leading-relaxed">
                Categorised using the latest <strong>ANZSCO</strong> (Australian and New Zealand Standard Classification
                of Occupations) classifications, enhanced by internal risk factors related to exposure to cash,
                crypto-assets, and other ML/TF predicate activities.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-base">Industry Risk</div>
              <p className="text-muted-foreground leading-relaxed">
                Classified using the <strong>ANZSIC</strong> (Australian and New Zealand Standard Industrial
                Classification) industry standards, calibrated for ML/TF exposure levels as identified in AUSTRAC's
                typologies and national risk assessments.
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-semibold text-base">Customer Risk Scoring</div>
              <p className="text-muted-foreground leading-relaxed">
                Customers are assigned a risk rating based on a composite score of the above factors:
              </p>
              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 mt-2">
                <div className="rounded-lg border bg-green-50 p-3">
                  <div className="font-semibold text-green-700">Low Risk</div>
                  <div className="text-sm text-green-600">&lt; 18</div>
                  <div className="text-xs text-muted-foreground mt-1">Standard due diligence</div>
                </div>
                <div className="rounded-lg border bg-yellow-50 p-3">
                  <div className="font-semibold text-yellow-700">Medium Risk</div>
                  <div className="text-sm text-yellow-600">18 - 20</div>
                  <div className="text-xs text-muted-foreground mt-1">Enhanced monitoring</div>
                </div>
                <div className="rounded-lg border bg-orange-50 p-3">
                  <div className="font-semibold text-orange-700">High Risk</div>
                  <div className="text-sm text-orange-600">21+</div>
                  <div className="text-xs text-muted-foreground mt-1">Enhanced due diligence</div>
                </div>
                <div className="rounded-lg border bg-red-50 p-3">
                  <div className="font-semibold text-red-700">Unacceptable</div>
                  <div className="text-sm text-red-600">1000+</div>
                  <div className="text-xs text-muted-foreground mt-1">Decline or exit</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Matrix</CardTitle>
            <CardDescription>Inherent risk distribution by likelihood and impact</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskMatrix />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution by Category</CardTitle>
            <CardDescription>Breakdown of risks across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <RiskDistributionChart />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
