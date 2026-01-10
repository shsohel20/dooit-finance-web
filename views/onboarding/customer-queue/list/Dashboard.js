"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AlertTriangle, CalendarIcon, Clock, Shield } from "lucide-react"
import NumberFlow from "@number-flow/react"
import NumberAnimation from "@/components/NumberAnimation"

// Sample data based on the customer data provided
const riskData = [
  { name: "Unacceptable", value: 6, color: "var(--primary)" },
  { name: "High", value: 2, color: "var(--danger)" },
  { name: "Medium", value: 1, color: "var(--warning)" },
  { name: "Low", value: 1, color: "var(--accent)" },
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
const mostUsersCountryData = [

  { name: "Australia", value: 40 },
  { name: "Afghanistan", value: 20 },
  { name: "Bangladesh", value: 100 },
]

export default function CustomerDashboard() {
  const totalCustomers = 10054
  const unacceptableRisk = 586
  const pendingKyc = 317
  const notAuthorized = 108

  return (
    <div className="mb-4">
      <div className="space-y-4">

        <div className="grid gap-6 md:grid-cols-3">
          {/* Risk Assessment Card */}
          <Card className="bg-smoke-200 border-0">
            {/* <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <AlertTriangle className="size-5 text-destructive" />
                  Risk Assessment
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">Customer risk levels distribution</CardDescription>
            </CardHeader> */}
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Risk Assessment</p>
                  <div>
                    <p className="text-3xl font-bold text-foreground"><NumberAnimation value={totalCustomers} /></p>
                    <p className="flex items-center gap-1" ><CalendarIcon className="size-4" /><span> Last 30 days</span> </p>
                  </div>
                </div>
                <div className="size-[100px]">
                  <ResponsiveContainer width={'100%'} height={"100%"}>
                    <PieChart >
                      <Tooltip />
                      {/* <Legend /> */}
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
                          <Cell key={`cell-${index}`} fill={entry.color} tooltip={`${entry.name}: ${entry.value}`} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>

              </div>
              <div className="flex items-center justify-end gap-2">
                {riskData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs ">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* KYC Status Card */}
          <Card className="bg-smoke-200 border-0">

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">KYC Status</p>
                  <p className="text-3xl font-bold text-foreground"><NumberAnimation value={pendingKyc} /></p>
                  <p>Pending</p>
                </div>
                <div className="size-[100px]">
                  <ResponsiveContainer width={'100%'} height={"100%"}>
                    <PieChart>
                      <Tooltip />
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
              </div>
              <div className="flex items-center justify-end gap-2">
                {kycStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs ">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Authorization Status Card */}
          <Card className="bg-smoke-200 border-0">

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Country of Origin</p>
                  <p className="text-3xl font-bold text-foreground"><NumberAnimation value={mostUsersCountryData.length} /></p>
                </div>
                <div className="w-[200px] h-[80px]">
                  <ResponsiveContainer width={'100%'} height={"100%"}>
                    {/* <PieChart>
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
                    </PieChart> */}
                    <BarChart
                      style={{ width: '100%', maxWidth: '300px', maxHeight: '100px', aspectRatio: 1.618 }}
                      responsive
                      data={mostUsersCountryData}
                    >
                      <Bar dataKey="value" fill={["var(--accent)"]} radius={[6, 6, 0, 0]} />
                      <Bar dataKey="value" fill={["var(--primary)"]} radius={[6, 6, 0, 0]} />
                      {/* <XAxis dataKey="name" /> */}
                      {/* <YAxis dataKey="value" /> */}
                      <Tooltip />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>
              <div className="flex items-center justify-end gap-2">
                {mostUsersCountryData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2  rounded-md p-2 bg-smoke-300">
                    <span className="text-xs ">{item.name}</span>
                    <span className="text-xs text-primary font-extrabold">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  )
}
