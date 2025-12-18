"use client"

import { PageDescription, PageHeader, PageTitle } from "@/components/common"
import { ChevronRight, Download, Eye, Filter } from "lucide-react"
import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Details from "./form/Details"

const performanceData = [
  { month: "Jan", accuracy: 78, precision: 72, recall: 65 },
  { month: "Feb", accuracy: 82, precision: 75, recall: 70 },
  { month: "Mar", accuracy: 85, precision: 80, recall: 75 },
  { month: "Apr", accuracy: 88, precision: 85, recall: 80 },
  { month: "May", accuracy: 90, precision: 88, recall: 85 },
  { month: "Jun", accuracy: 92, precision: 90, recall: 88 },
]

const complianceData = [
  { name: "Compliant", value: 1200, color: "oklch(0.5 0.24 264)" },
  { name: "Non-compliant", value: 180, color: "oklch(0.62 0.2 25)" },
  { name: "Pending", value: 92, color: "oklch(0.75 0.14 85)" },
  { name: "Not Applicable", value: 55, color: "oklch(0.7 0.1 250)" },
]

const riskImpactMatrix = [
  { label: "Critical", count: "2", percent: "6.3%", bg: "bg-red-50 dark:bg-red-950/30", border: "border-red-200 dark:border-red-800" },
  { label: "High", count: "7", percent: "21%", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
  { label: "Medium", count: "11", percent: "34%", bg: "bg-yellow-50 dark:bg-yellow-950/30", border: "border-yellow-200 dark:border-yellow-800" },
  { label: "Low", count: "12", percent: "37%", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
]
const activeRiskMitigation = [
  {
    id: 1,
    event: "KYC Fraud Detection",
    description: "Performance degradation detected. Accuracy dropped from 84% to 72%.",
    severity: "Critical",
    severityColor: "bg-red-100/50 text-red-700 border-red-200/50",
    time: "2 hours ago",
    date: "19 May, 14:30",
    assigned: "Robert Smith",
    role: "ML Engineer",
    sla: "Due in 4h",
    slaColor: "bg-red-50 text-red-600",
  },
  {
    id: 2,
    event: "Credit Scoring - High Risk Detected",
    description: "Demographic bias score exceeded threshold (0.54).",
    severity: "High",
    severityColor: "bg-orange-100/50 text-orange-700 border-orange-200/50",
    time: "1 day ago",
    date: "17 May, 09:45",
    assigned: "Miss Thompson",
    role: "Data Scientist",
    sla: "Due in 2d",
    slaColor: "bg-orange-50 text-orange-600",
  },
  {
    id: 3,
    event: "Customer Segmentation",
    description: "EU AI Act Article 8 compliance requirements.",
    description2: "Compliance Gap",
    severity: "Medium",
    severityColor: "bg-amber-100/50 text-amber-700 border-amber-200/50",
    time: "2 days ago",
    date: "16 May, 14:20",
    assigned: "Lisa Davis",
    role: "Risk Analyst",
    sla: "Due in 5d",
    slaColor: "bg-amber-50 text-amber-600",
  },
]

const detailedModelRiskAssessment = [
  {
    id: 1,
    name: "KYC Fraud Detection",
    version: "v2.5.3 | MLOps Integrated",
    performance: 75,
    performanceColor: "bg-red-100/50",
    risk: "Critical",
    riskColor: "bg-red-100 text-red-700",
    dataQuality: "Poor",
    dataQualityColor: "bg-orange-100 text-orange-700",
    compliance: "Partial",
    complianceColor: "bg-yellow-100 text-yellow-700",
    updated: "2023-05-15",
  },
  {
    id: 2,
    name: "Credit Scoring",
    version: "v1.4.2 | API Integrated",
    performance: 88,
    performanceColor: "bg-yellow-100/50",
    risk: "High",
    riskColor: "bg-orange-100 text-orange-700",
    dataQuality: "Fair",
    dataQualityColor: "bg-yellow-100 text-yellow-700",
    compliance: "Compliant",
    complianceColor: "bg-green-100 text-green-700",
    updated: "2023-05-15",
  },
  {
    id: 3,
    name: "Transaction Monitoring",
    version: "v3.0.1 | AML Compliance",
    performance: 94,
    performanceColor: "bg-cyan-100/50",
    risk: "Medium",
    riskColor: "bg-amber-100 text-amber-700",
    dataQuality: "Good",
    dataQualityColor: "bg-green-100 text-green-700",
    compliance: "Compliant",
    complianceColor: "bg-green-100 text-green-700",
    updated: "2023-05-15",
  },
]

export default function Page() {
  const [openRiskDetails, setOpenRiskDetails] = useState(false);
  return (
    <div className=" space-y-12 blurry-overlay">
      <div className="">

        <PageHeader>
          <PageTitle>Risk Management Dashboard</PageTitle>
          <PageDescription>Real-time compliance metrics and model performance</PageDescription>
        </PageHeader>
      </div>

      {/* Main Content */}
      <div className="  space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
          <div className="stat-card">
            <div className="subsection-text mb-2">Total Models</div>
            <div className="text-3xl font-bold text-primary">1527</div>
          </div>
          <div className="stat-card">
            <div className="subsection-text mb-2">Critical Risk</div>
            <div className="text-3xl font-bold text-destructive">15</div>
          </div>
          <div className="stat-card">
            <div className="subsection-text mb-2">High Risk</div>
            <div className="text-3xl font-bold text-warning">8</div>
          </div>
          <div className="stat-card">
            <div className="subsection-text mb-2">Medium Risk</div>
            <div className="text-3xl font-bold text-primary">102</div>
          </div>
          <div className="stat-card">
            <div className="subsection-text mb-2">Low Risk Case</div>
            <div className="text-3xl font-bold text-success">11</div>
          </div>
          <div className="stat-card">
            <div className="subsection-text mb-2">Compliance Rate</div>
            <div className="text-3xl font-bold text-primary">86%</div>
          </div>
        </div>

        <div className="card-subtle ">
          <h2 className="section-title mb-8">Risk Impact Matrix</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {riskImpactMatrix.map((item, i) => (
              <div
                key={i}
                className={`rounded-lg ${item.bg} border ${item.border} p-5 text-center transition-all hover:shadow-sm`}
              >
                <div className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">{item.label}</div>
                <div className="text-2xl font-bold text-foreground mb-2">{item.count}</div>
                <div className="text-xs  font-medium">{item.percent}</div>
              </div>
            ))}
          </div>
          <div className="h-2 rounded-full bg-muted/50 overflow-hidden mb-3">
            <div className="flex h-full">
              <div className="w-1/4 bg-red-500/80" />
              <div className="w-1/4 bg-orange-500/80" />
              <div className="w-1/4 bg-yellow-500/80" />
              <div className="w-1/4 bg-emerald-500/80" />
            </div>
          </div>
          <div className="flex justify-between text-xs  font-medium">
            <span>Low: 0-25</span>
            <span>Medium: 26-50</span>
            <span>High: 51-75</span>
            <span>Critical: 76-100</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 ">
          {/* Performance Chart */}
          <div className="card-subtle border rounded-md p-8">
            <h2 className="section-title mb-8">Model Performance & Risk Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: "0.875rem" }} />
                <YAxis stroke="var(--muted-foreground)" style={{ fontSize: "0.875rem" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}
                  labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "0.875rem" }} />
                <Bar dataKey="accuracy" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="precision" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recall" fill="var(--chart-4)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Compliance Distribution */}
          <div className="card-subtle border rounded-md p-8">
            <h2 className="section-title mb-8">Compliance Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={complianceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3 mt-6">
              {complianceData.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div
                    className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color, opacity: 0.85 }}
                  />
                  <span className="text-foreground font-medium">{item.name}</span>
                  <span className=" ml-auto">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-subtle ">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Alert Center</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors">
              See All
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                severity: "CRITICAL",
                title: "KYC Fraud Detection",
                description: "Performance degradation detected. Accuracy dropped from 84% to 72%.",
                timestamp: "Detected: 2h ago",
                color: "bg-red-50 dark:bg-red-950/20",
                borderColor: "border-red-200 dark:border-red-800",
                badgeBg: "bg-red-100 dark:bg-red-900/40",
                badgeText: "text-red-700 dark:text-red-400",
              },
              {
                severity: "HIGH PRIORITY",
                title: "Credit Scoring Bias",
                description: "High bias detected against demographic groups. Requires immediate review.",
                timestamp: "Detected: 1h ago",
                color: "bg-amber-50 dark:bg-amber-950/20",
                borderColor: "border-amber-200 dark:border-amber-800",
                badgeBg: "bg-amber-100 dark:bg-amber-900/40",
                badgeText: "text-amber-700 dark:text-amber-400",
              },
              {
                severity: "CRITICAL",
                title: "KYC Fraud Detection",
                description: "Performance degradation detected. Accuracy dropped from 84% to 72%.",
                timestamp: "Detected: 2h ago",
                color: "bg-red-50 dark:bg-red-950/20",
                borderColor: "border-red-200 dark:border-red-800",
                badgeBg: "bg-red-100 dark:bg-red-900/40",
                badgeText: "text-red-700 dark:text-red-400",
              },
              {
                severity: "HIGH PRIORITY",
                title: "Credit Scoring Bias",
                description: "High bias detected against demographic groups. Requires immediate review.",
                timestamp: "Detected: 1h ago",
                color: "bg-amber-50 dark:bg-amber-950/20",
                borderColor: "border-amber-200 dark:border-amber-800",
                badgeBg: "bg-amber-100 dark:bg-amber-900/40",
                badgeText: "text-amber-700 dark:text-amber-400",
              },
            ].map((alert, i) => (
              <div
                key={i}
                className={`rounded-lg border ${alert.borderColor} ${alert.color} p-5 transition-all hover:shadow-sm`}
              >
                <div
                  className={`inline-block ${alert.badgeBg} px-2.5 py-1 rounded-md text-xs font-semibold ${alert.badgeText} mb-3`}
                >
                  {alert.severity}
                </div>
                <h3 className="font-semibold text-foreground mb-1 text-sm">{alert.title}</h3>
                <p className="text-sm /90 mb-4 leading-relaxed">{alert.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border/30">
                  <span className="text-xs  font-medium">{alert.timestamp}</span>
                  <button
                    className={`text-xs font-semibold px-2.5 py-1 rounded transition-all hover:opacity-80 ${alert.badgeText}`}
                  >
                    {alert.severity === "CRITICAL" ? "Critical" : "In Progress"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="">
        <div className=" ">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">Risk Mitigation</h1>
              <p className="text-sm  mt-2">Active incidents and model assessment</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              Refresh Status
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="">
        {/* Active Risk Mitigation Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Active Risk Mitigation</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="space-y-3">
            {activeRiskMitigation.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border bg-card/50 backdrop-blur-sm p-5 hover:border-border/60 hover:bg-card/80 transition-all duration-200 cursor-pointer hover:shadow-sm "
                onClick={() => setOpenRiskDetails(true)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground text-sm">{item.event}</h3>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${item.severityColor}`}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-xs  leading-relaxed mb-3">{item.description}</p>
                    {item.description2 && (
                      <p className="text-xs  leading-relaxed mb-3">{item.description2}</p>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p className=" mb-0.5">Detection</p>
                        <p className="text-foreground/80">{item.time}</p>
                        <p className="">{item.date}</p>
                      </div>
                      <div>
                        <p className=" mb-0.5">Assigned To</p>
                        <p className="text-foreground/80 font-medium">{item.assigned}</p>
                        <p className="">{item.role}</p>
                      </div>
                      <div>
                        <p className=" mb-0.5">SLA Status</p>
                        <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${item.slaColor}`}>
                          {item.sla}
                        </div>
                      </div>
                      <div className="flex items-end gap-2">
                        <button className="p-1.5 hover:bg-muted rounded transition-colors">
                          <Eye className="w-4 h-4 " />
                        </button>
                        <button className="p-1.5 hover:bg-muted rounded transition-colors">
                          <Download className="w-4 h-4 " />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Model Risk Assessment Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Detailed Model Risk Assessment</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="space-y-3">
            {detailedModelRiskAssessment.map((model) => (
              <div
                key={model.id}
                className="rounded-lg border bg-card/50 backdrop-blur-sm p-5 hover:border-border/60 hover:bg-card/80 transition-all duration-200 cursor-pointer hover:shadow-sm"
                onClick={() => setOpenRiskDetails(true)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="mb-3">
                      <h3 className="font-semibold text-foreground text-sm">{model.name}</h3>
                      <p className="text-xs ">{model.version}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                      <div>
                        <p className=" mb-2">Performance</p>
                        <div className="h-1.5 bg-muted/40 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${model.performanceColor}`}
                            style={{ width: `${model.performance}%` }}
                          />
                        </div>
                        <p className="text-foreground/80 mt-1 font-medium">{model.performance}%</p>
                      </div>
                      <div>
                        <p className=" mb-2">Risk Level</p>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${model.riskColor}`}
                        >
                          {model.risk}
                        </span>
                      </div>
                      <div>
                        <p className=" mb-2">Data Quality</p>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${model.dataQualityColor}`}
                        >
                          {model.dataQuality}
                        </span>
                      </div>
                      <div>
                        <p className=" mb-2">Compliance</p>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${model.complianceColor}`}
                        >
                          {model.compliance}
                        </span>
                      </div>
                      <div>
                        <p className=" mb-2">Last Updated</p>
                        <p className="text-foreground/80 font-medium">{model.updated}</p>
                      </div>
                    </div>
                  </div>
                  <button className="p-1.5 hover:bg-muted rounded transition-colors flex-shrink-0">
                    <Eye className="w-4 h-4 " />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 ">
            <button className="text-sm  hover:text-foreground transition-colors">
              ← Previous
            </button>
            <div className="flex items-center gap-2">
              {[1, 2, 3, "...", 67, 68].map((page, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded text-sm transition-colors ${page === 1 ? "bg-primary text-primary-foreground" : " hover:text-foreground"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button className="text-sm  hover:text-foreground transition-colors">Next →</button>
          </div>
        </div>
      </div>
      {openRiskDetails && <Details open={openRiskDetails} setOpen={setOpenRiskDetails} />}
    </div>
  )
}
