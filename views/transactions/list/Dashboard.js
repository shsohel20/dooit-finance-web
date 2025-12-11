"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp, AlertCircle, Globe, DollarSign, ArrowUpRight, Activity } from "lucide-react"

export default function DashboardPage() {
  // Sample transaction data based on the provided structure
  const transactionData = [
    { status: "pending", type: "wire", currency: "GBP", country: "Australia" },
    { status: "pending", type: "transfer", currency: "USD", country: "Bangladesh" },
    { status: "completed", type: "wire", currency: "EUR", country: "Australia" },
    { status: "pending", type: "payment", currency: "GBP", country: "UK" },
    { status: "completed", type: "transfer", currency: "USD", country: "Bangladesh" },
    { status: "flagged", type: "wire", currency: "GBP", country: "Australia" },
    { status: "pending", type: "payment", currency: "EUR", country: "Germany" },
    { status: "completed", type: "transfer", currency: "USD", country: "USA" },
    { status: "pending", type: "wire", currency: "GBP", country: "UK" },
    { status: "completed", type: "payment", currency: "USD", country: "Bangladesh" },
  ]

  // Process data for pie charts
  const statusData = Object.entries(
    transactionData.reduce(
      (acc, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1
        return acc
      },
      {},
    ),
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))

  const typeData = Object.entries(
    transactionData.reduce(
      (acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1
        return acc
      },
      {},
    ),
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))

  const countryData = Object.entries(
    transactionData.reduce(
      (acc, t) => {
        acc[t.country] = (acc[t.country] || 0) + 1
        return acc
      },
      {},
    ),
  ).map(([name, value]) => ({ name, value }))

  const statusColors = ["#3b82f6", "#10b981", "#f97316"]
  const typeColors = ["#8b5cf6", "#06b6d4", "#ec4899"]
  const countryColors = ["#6366f1", "#f59e0b", "#14b8a6", "#ec4899", "#10b981"]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 ">
          <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground">
            Count: <span className="font-semibold text-foreground">{payload[0].value}</span>
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">


      <main className=" ">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="relative overflow-hidden border-0  bg-gradient-to-br from-blue-500/10 via-card to-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl bg-blue-500/10 p-3 ring-1 ring-blue-500/20">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Transactions</p>
              <p className="text-4xl font-bold text-foreground">{transactionData.length}</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0  bg-gradient-to-br from-purple-500/10 via-card to-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl bg-purple-500/10 p-3 ring-1 ring-purple-500/20">
                  <AlertCircle className="h-6 w-6 text-purple-500" />
                </div>
                <Badge variant="secondary" className="text-xs rounded-full">
                  {(
                    ((statusData.find((s) => s.name === "Pending")?.value || 0) / transactionData.length) *
                    100
                  ).toFixed(0)}
                  %
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Pending Review</p>
              <p className="text-4xl font-bold text-foreground">
                {statusData.find((s) => s.name === "Pending")?.value || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0  bg-gradient-to-br from-orange-500/10 via-card to-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl bg-orange-500/10 p-3 ring-1 ring-orange-500/20">
                  <AlertCircle className="h-6 w-6 text-orange-500" />
                </div>
                <Badge variant="destructive" className="text-xs rounded-full">
                  Alert
                </Badge>
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Flagged Items</p>
              <p className="text-4xl font-bold text-foreground">
                {statusData.find((s) => s.name === "Flagged")?.value || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0  bg-gradient-to-br from-teal-500/10 via-card to-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16"></div>
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="rounded-xl bg-teal-500/10 p-3 ring-1 ring-teal-500/20">
                  <Globe className="h-6 w-6 text-teal-500" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-teal-500" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Active Countries</p>
              <p className="text-4xl font-bold text-foreground">{countryData.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Key Insights */}
          <div className="lg:col-span-1">
            <Card className="border-0  h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="group p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10 hover:border-blue-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2 mt-1">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-sm text-foreground">Pending Review</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {statusData.find((s) => s.name === "Pending")?.value || 0} transactions need attention,{" "}
                        {(
                          ((statusData.find((s) => s.name === "Pending")?.value || 0) / transactionData.length) *
                          100
                        ).toFixed(0)}
                        % of total volume
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/10 hover:border-purple-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-purple-500/10 p-2 mt-1">
                      <DollarSign className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-sm text-foreground">Most Common Type</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {typeData.sort((a, b) => b.value - a.value)[0]?.name} leads with{" "}
                        {typeData.sort((a, b) => b.value - a.value)[0]?.value} transactions
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 rounded-xl bg-gradient-to-br from-teal-500/5 to-transparent border border-teal-500/10 hover:border-teal-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-teal-500/10 p-2 mt-1">
                      <Globe className="h-4 w-4 text-teal-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-sm text-foreground">Geographic Reach</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Active in {countryData.length} countries,{" "}
                        {countryData.sort((a, b) => b.value - a.value)[0]?.name} is top region
                      </p>
                    </div>
                  </div>
                </div>

                <div className="group p-4 rounded-xl bg-gradient-to-br from-green-500/5 to-transparent border border-green-500/10 hover:border-green-500/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-green-500/10 p-2 mt-1">
                      <Activity className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1 text-sm text-foreground">Success Rate</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {statusData.find((s) => s.name === "Completed")?.value || 0} completed with{" "}
                        {(
                          ((statusData.find((s) => s.name === "Completed")?.value || 0) / transactionData.length) *
                          100
                        ).toFixed(0)}
                        % completion rate
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Pie Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Status Chart */}
            <Card className="border-0 ">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    Transaction Status Distribution
                  </CardTitle>
                  <Badge variant="outline" className="rounded-full text-xs">
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="w-full lg:w-1/2">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={statusColors[index % statusColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full lg:w-1/2 space-y-3">
                    {statusData.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full ring-2 ring-background"
                            style={{ backgroundColor: statusColors[index % statusColors.length] }}
                          ></div>
                          <span className="font-medium text-sm text-foreground">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground">
                            {((item.value / transactionData.length) * 100).toFixed(0)}%
                          </span>
                          <span className="font-bold text-foreground min-w-[2rem] text-right">{item.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Two Charts Side by Side */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Transaction Type Chart */}
              <Card className="border-0 ">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Transaction Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={typeData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {typeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={typeColors[index % typeColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {typeData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: typeColors[index % typeColors.length] }}
                          ></div>
                          <span className="text-muted-foreground text-xs">{item.name}</span>
                        </div>
                        <span className="font-semibold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Distribution Chart */}
              <Card className="border-0 ">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Globe className="h-4 w-4 text-primary" />
                    Geographic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={countryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {countryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={countryColors[index % countryColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {countryData.map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: countryColors[index % countryColors.length] }}
                          ></div>
                          <span className="text-muted-foreground text-xs">{item.name}</span>
                        </div>
                        <span className="font-semibold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
