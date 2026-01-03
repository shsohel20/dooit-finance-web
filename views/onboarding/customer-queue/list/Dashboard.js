"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { AlertTriangle, Clock, Shield } from "lucide-react"
import NumberFlow from "@number-flow/react"
import NumberAnimation from "@/components/NumberAnimation"

// Sample data based on the customer data provided
const riskData = [
  { name: "Unacceptable", value: 6, color: "#ef4444" },
  { name: "High", value: 2, color: "#f97316" },
  { name: "Medium", value: 1, color: "#eab308" },
  { name: "Low", value: 1, color: "#22c55e" },
]

const kycStatusData = [
  { name: "Pending", value: 7, color: "#f59e0b" },
  { name: "Approved", value: 2, color: "#10b981" },
  { name: "Rejected", value: 1, color: "#ef4444" },
]

const authorizationData = [
  { name: "Not Authorized", value: 8, color: "#64748b" },
  { name: "Authorized", value: 2, color: "#06b6d4" },
]

export default function CustomerDashboard() {
  const totalCustomers = 10054
  const unacceptableRisk = 586
  const pendingKyc = 317
  const notAuthorized = 108

  return (
    <div className="mb-4">
      <div className="space-y-4">
        {/* <div className="space-y-2">
          <h1 className="font-sans text-4xl font-bold tracking-tight text-foreground">Customer Risk Dashboard</h1>
          <p className="text-lg text-muted-foreground">Overview of customer risk assessment and KYC status</p>
        </div> */}

        <div className="grid gap-6 md:grid-cols-3">
          {/* Risk Assessment Card */}
          <Card className="border-destructive/20 bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <AlertTriangle className="size-5 text-destructive" />
                  Risk Assessment
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">Customer risk levels distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-3xl font-bold text-foreground"><NumberAnimation value={totalCustomers} /></p>
                </div>
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-destructive/10 p-3">
                  <span className="text-sm font-medium text-foreground">Unacceptable</span>
                  <span className="text-lg font-bold text-destructive">{unacceptableRisk}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-muted-foreground">High</p>
                    <p className="font-semibold text-foreground"><NumberAnimation value={2} /></p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Medium</p>
                    <p className="font-semibold text-foreground"><NumberAnimation value={1} /></p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Low</p>
                    <p className="font-semibold text-foreground"><NumberAnimation value={1} /></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* KYC Status Card */}
          <Card className="border-amber-500/20 bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Clock className="size-5 text-amber-500" />
                  KYC Status
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">Customer verification progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-3xl font-bold text-foreground"><NumberAnimation value={pendingKyc} /></p>
                </div>
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie
                      data={kycStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {kycStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-amber-500/10 p-3">
                  <span className="text-sm font-medium text-foreground">Pending</span>
                  <span className="text-lg font-bold text-amber-600"><NumberAnimation value={pendingKyc} /></span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-emerald-500/10 p-2 text-center">
                    <p className="text-muted-foreground">Approved</p>
                    <p className="font-semibold text-emerald-600"><NumberAnimation value={2} /></p>
                  </div>
                  <div className="rounded-md bg-red-500/10 p-2 text-center">
                    <p className="text-muted-foreground">Rejected</p>
                    <p className="font-semibold text-red-600"><NumberAnimation value={1} /></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authorization Status Card */}
          <Card className="border-slate-500/20 bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Shield className="size-5 text-slate-500" />
                  Authorization
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">Document attestation status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Not Authorized</p>
                  <p className="text-3xl font-bold text-foreground"><NumberAnimation value={notAuthorized} /></p>
                </div>
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie
                      data={authorizationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={45}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {authorizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg bg-slate-500/10 p-3">
                  <span className="text-sm font-medium text-foreground">Incomplete</span>
                  <span className="text-lg font-bold text-slate-600"><NumberAnimation value={notAuthorized} /></span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-md bg-cyan-500/10 p-2 text-center">
                    <p className="text-muted-foreground">Authorized</p>
                    <p className="font-semibold text-cyan-600"><NumberAnimation value={2} /></p>
                  </div>
                  <div className="rounded-md bg-slate-500/10 p-2 text-center">
                    <p className="text-muted-foreground">Pending</p>
                    <p className="font-semibold text-slate-600"><NumberAnimation value={8} /></p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  )
}
