"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AlertTriangle, CalendarIcon, Clock, Shield } from "lucide-react"
import NumberFlow from "@number-flow/react"
import NumberAnimation from "@/components/NumberAnimation"
import { Map, MapControls, MapMarker, MarkerContent, MarkerPopup, MarkerTooltip } from "@/components/ui/map"

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
const locations = [
  {
    id: 1,
    name: "Empire State Building",
    lng: -73.9857,
    lat: 40.7484,
  },
  {
    id: 2,
    name: "Central Park",
    lng: -73.9654,
    lat: 40.7829,
  },
  { id: 3, name: "Times Square", lng: -73.9855, lat: 40.758 },
];

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
          {/* <Card className="bg-smoke-200 border-0"> */}

          <div className="">
            {/* <p className="text-sm text-muted-foreground mb-2">Most Users Locations</p> */}
            <div className="flex items-center justify-end gap-2">

              <div className="h-[200px] w-full rounded-md overflow-hidden">
                <Map center={[-73.98, 40.76]} zoom={7}>
                  {locations.map((location) => (
                    <MapMarker
                      key={location.id}
                      longitude={location.lng}
                      latitude={location.lat}
                    >
                      <MarkerContent>
                        <div className="size-4 rounded-full bg-primary border-2 border-white shadow-lg" />
                      </MarkerContent>
                      <MarkerTooltip>{location.name}</MarkerTooltip>
                      <MarkerPopup>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{location.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                          </p>
                        </div>
                      </MarkerPopup>
                    </MapMarker>
                  ))}
                </Map>
              </div>
            </div>
          </div>
          {/* </Card> */}
        </div>


      </div>
    </div>
  )
}
