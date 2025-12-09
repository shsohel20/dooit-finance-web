"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FileText, Users, TrendingUp, Globe, Calendar, Paperclip } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts"

// Mock data - in production, this would come from an API
const mockData = {
  totalReports: 1247,
  completedReports: 856,
  draftReports: 391,
  totalTransactions: 3421,
  customerReports: 734,
  reportsThisWeek: 42,
  lastReportDate: "2025-11-29T07:40:06.593Z",
}

const statusData = [
  { name: "Completed", value: 856, color: "var(--chart-2)" },
  { name: "Draft", value: 391, color: "var(--chart-3)" },
]

const suspicionData = [
  { name: "ATM/Cheque Fraud", value: 387, color: "var(--chart-1)" },
  { name: "Money Laundering", value: 312, color: "var(--chart-2)" },
  { name: "Structuring", value: 265, color: "var(--chart-3)" },
  { name: "Identity Theft", value: 189, color: "var(--chart-4)" },
  { name: "Other", value: 94, color: "var(--chart-5)" },
]

const offenceData = [
  { name: "Financing of Terrorism", value: 423, color: "var(--chart-1)" },
  { name: "Money Laundering", value: 389, color: "var(--chart-2)" },
  { name: "Tax Evasion", value: 267, color: "var(--chart-3)" },
  { name: "Fraud", value: 168, color: "var(--chart-4)" },
]

const monthlyReportsData = [
  { month: "Jan", reports: 98 },
  { month: "Feb", reports: 112 },
  { month: "Mar", reports: 127 },
  { month: "Apr", reports: 95 },
  { month: "May", reports: 143 },
  { month: "Jun", reports: 156 },
  { month: "Jul", reports: 134 },
  { month: "Aug", reports: 121 },
  { month: "Sep", reports: 108 },
  { month: "Oct", reports: 89 },
  { month: "Nov", reports: 142 },
  { month: "Dec", reports: 122 },
]

const monthlyTransactionData = [
  { month: "Jan", amount: 284000 },
  { month: "Feb", amount: 312000 },
  { month: "Mar", amount: 298000 },
  { month: "Apr", amount: 267000 },
  { month: "May", amount: 345000 },
  { month: "Jun", amount: 389000 },
  { month: "Jul", amount: 356000 },
  { month: "Aug", amount: 298000 },
  { month: "Sep", amount: 267000 },
  { month: "Oct", amount: 234000 },
  { month: "Nov", amount: 378000 },
  { month: "Dec", amount: 312000 },
]

const serviceData = [
  { service: "AFSL holder arranging service", count: 487 },
  { service: "Financial institution", count: 356 },
  { service: "Remittance provider", count: 234 },
  { service: "Money exchange", count: 170 },
]

const countryData = [
  { country: "Australia", count: 487 },
  { country: "United States", count: 234 },
  { country: "United Kingdom", count: 189 },
  { country: "China", count: 167 },
  { country: "Singapore", count: 145 },
]

export function SMRDashboard() {
  const formatCurrency = (value) => {
    return `$${(value / 1000).toFixed(0)}k`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className=" space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader
            className="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle
              className="text-sm font-medium"
            >
              Total Reports
            </CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold">
              {mockData.totalReports.toLocaleString()}
            </div>
            <p
              className="text-xs text-muted-foreground mt-1">
              {mockData.completedReports} completed, {mockData.draftReports} draft
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.totalTransactions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all SMR reports</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Reports</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.customerReports}</div>
            <p className="text-xs text-muted-foreground mt-1">Reports involving known customers</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.reportsThisWeek}</div>
            <p className="text-xs text-muted-foreground mt-1">New reports created</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border h-full">
          <CardHeader>
            <CardTitle className="text-base">Status Distribution</CardTitle>
            <CardDescription>Reports by completion status</CardDescription>
          </CardHeader>
          <CardContent >
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 ">
              {statusData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Suspicion Reasons</CardTitle>
            <CardDescription>Most common suspicion types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={suspicionData} cx="50%" cy="50%" outerRadius={80} paddingAngle={2} dataKey="value">
                  {suspicionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {suspicionData.slice(0, 4).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border h-full">
          <CardHeader>
            <CardTitle className="text-base">Likely Offences</CardTitle>
            <CardDescription>Reported offence breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={offenceData} layout="vertical">
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {offenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>



      {/* Summary Cards Row */}
      {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Most Frequent Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">AFSL holder arranging service</p>
              <p className="text-2xl font-bold">487 reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="size-4" />
              Top Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Australia</p>
              <p className="text-2xl font-bold">487 reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Paperclip className="size-4" />
              With Attachments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Documents included</p>
              <p className="text-2xl font-bold">342 reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="size-4" />
              Unidentified Persons
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm font-medium">Reports with unknown subjects</p>
              <p className="text-2xl font-bold">156 reports</p>
            </div>
          </CardContent>
        </Card>
      </div> */}




    </div>
  )
}
