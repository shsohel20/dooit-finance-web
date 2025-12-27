"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";
import {
  TrendingUp,
  AlertCircle,
  Globe,
  DollarSign,
  ArrowUpRight,
  Activity,
  Plus,
  Download,
  Flag,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";

//add a cash flow data for bar chart for 30 days
const cashFlowData = [
  { name: "Jan", value: -1000, fill: "var(--primary)" },
  { name: "Feb", value: 2000, fill: "var(--accent)" },
  { name: "Mar", value: 3000, fill: "var(--primary)" },
  { name: "Apr", value: 4000, fill: "var(--accent)" },
  { name: "May", value: -5000, fill: "var(--primary)" },
  { name: "Jun", value: 6000, fill: "var(--accent)" },
  { name: "Jul", value: 7000, fill: "var(--primary)" },
  { name: "Aug", value: -8000, fill: "var(--accent)" },
  { name: "Sep", value: 9000, fill: "var(--primary)" },
  { name: "Oct", value: 10000, fill: "var(--accent)" },
  { name: "Nov", value: 11000, fill: "var(--primary)" },
  { name: "Dec", value: 12000, fill: "var(--accent)" },
];

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
  ];

  // Process data for pie charts
  const statusData = Object.entries(
    transactionData.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const typeData = Object.entries(
    transactionData.reduce((acc, t) => {
      acc[t.type] = (acc[t.type] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));

  const countryData = Object.entries(
    transactionData.reduce((acc, t) => {
      acc[t.country] = (acc[t.country] || 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const statusColors = ["#3b82f6", "#10b981", "#f97316"];
  const typeColors = ["#8b5cf6", "#06b6d4", "#ec4899"];
  const countryColors = ["#6366f1", "#f59e0b", "#14b8a6", "#ec4899", "#10b981"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg px-3 py-2 ">
          <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
          <p className="text-xs text-muted-foreground">
            Count: <span className="font-semibold text-foreground">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-4  to-muted/20">
      <div className="bg-primary rounded-md p-8 text-white mb-4 space-y-2 flex items-center justify-between ">
        <div className="space-y-2">
          <h1 className=" font-bold tracking-tight ">Total Transactions (last 30 days)</h1>
          {/* <p className="text-sm ">Total transactions processed in the last 30 days</p> */}
          <div className="flex items-center gap-2">
            <p className="text-4xl font-bold tracking-tight">$89,589</p>{" "}
            <p className="flex items-center gap-1">
              <TrendingUp className="h-5 w-5 text-accent" />
              <span>4.5%</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Plus className="h-4 w-4" /> Add
          </Button>

          <Button className="bg-primary-light text-white hover:bg-primary-light/90">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      <main className=" grid grid-cols-4 gap-6 py-4">
        <div className="col-span-3 border rounded-md p-4">
          <div className="flex items-center gap-2 mb-10">
            <Calendar className="h-4 w-4 text-success" />
            <h5 className="text-base font-semibold text-heading tracking-tight">
              Transaction flow
            </h5>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData}>
              {/* need to add multiple colors for the bars */}
              <Bar dataKey="value" radius={[6, 6, 0, 0]} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
              <Tooltip />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="  col-span-1">
          <Card className="">
            {/* <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16"></div> */}
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-primary p-2">
                  <AlertCircle className="size-4 text-white" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-muted-foreground mb-1 tracking-tight">
                    Pending Review
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-foreground">547</p>
                    <Badge variant="secondary" className="text-xs rounded-full">
                      {(
                        ((statusData.find((s) => s.name === "Pending")?.value || 0) /
                          transactionData.length) *
                        100
                      ).toFixed(0)}
                      %
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-accent p-2">
                  <Flag className="size-4 text-white" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-muted-foreground mb-1 tracking-tight">
                    Flagged Items
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-foreground">97</p>
                    <Badge variant="secondary" className="text-xs rounded-full">
                      {(
                        ((statusData.find((s) => s.name === "Flagged")?.value || 0) /
                          transactionData.length) *
                        100
                      ).toFixed(0)}
                      %
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardContent className="pt-6 relative">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-xl bg-primary-light p-2">
                  <Globe className="size-4 text-white" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-muted-foreground mb-1 tracking-tight">
                    Active Countries
                  </p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-foreground">{countryData.length}</p>
                    <Badge variant="secondary" className="text-xs rounded-full">
                      {((countryData.length / transactionData.length) * 100 || 0).toFixed(0) || 0}%
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* <Card className="border-0 ">
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
                          <Cell
                            key={`cell-${index}`}
                            fill={statusColors[index % statusColors.length]}
                          />
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
                        <span className="font-bold text-foreground min-w-[2rem] text-right">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="">
          <div className="grid grid-cols-3 gap-6 ">
            <div className="">
              {/* <Card className="border-0 h-full">
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
                            <Cell
                              key={`cell-${index}`}
                              fill={typeColors[index % typeColors.length]}
                            />
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
              </Card> */}
            </div>
            <div>
              {/* Geographic Distribution Chart */}
              {/* <Card className="border-0 ">
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
                            <Cell
                              key={`cell-${index}`}
                              fill={countryColors[index % countryColors.length]}
                            />
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
              </Card> */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
