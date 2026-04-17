"use client";
import React from "react";
import { Users, CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
// } from "recharts";
import * as Recharts from "recharts";
const { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } =
  Recharts;

const reviewItems = [
  {
    id: "CR-10234",
    reviewType: "ECDD",
    status: "completed",
    caseType: "High Risk Individual",
    analyst: "Ariyan Rahman",
    openedAt: "2026-04-16T08:05:00.000Z",
    completedAt: "2026-04-16T09:02:00.000Z",
  },
  {
    id: "CR-10235",
    reviewType: "CDD",
    status: "open",
    caseType: "Business Account",
    analyst: "Nabila Islam",
    openedAt: "2026-04-16T08:25:00.000Z",
    completedAt: null,
  },
  {
    id: "CR-10236",
    reviewType: "ECDD",
    status: "completed",
    caseType: "Sanctions Alert",
    analyst: "Ariyan Rahman",
    openedAt: "2026-04-16T07:45:00.000Z",
    completedAt: "2026-04-16T08:50:00.000Z",
  },
  {
    id: "CR-10237",
    reviewType: "PEP Review",
    status: "open",
    caseType: "PEP Escalation",
    analyst: "Tanvir Hasan",
    openedAt: "2026-04-16T09:20:00.000Z",
    completedAt: null,
  },
  {
    id: "CR-10238",
    reviewType: "ECDD",
    status: "completed",
    caseType: "High Risk Individual",
    analyst: "Nabila Islam",
    openedAt: "2026-04-16T06:30:00.000Z",
    completedAt: "2026-04-16T07:20:00.000Z",
  },
  {
    id: "CR-10239",
    reviewType: "ECDD",
    status: "open",
    caseType: "Adverse Media",
    analyst: "Tanvir Hasan",
    openedAt: "2026-04-16T09:05:00.000Z",
    completedAt: null,
  },
];

function formatMinutes(minutes) {
  const safeMinutes = Math.max(0, Math.round(minutes));
  const hour = Math.floor(safeMinutes / 60);
  const min = safeMinutes % 60;
  if (!hour) return `${min}m`;
  return `${hour}h ${min}m`;
}

function buildAnalytics(rows) {
  const ecddReviewCount = rows.filter((item) => item.reviewType === "ECDD").length;
  const completedReviewCount = rows.filter((item) => item.status === "completed").length;
  const openedReviewCount = rows.filter((item) => item.status === "open").length;

  const analystTimeMap = {};
  const caseTypeMap = {};

  rows.forEach((item) => {
    caseTypeMap[item.caseType] = (caseTypeMap[item.caseType] || 0) + 1;

    if (!analystTimeMap[item.analyst]) {
      analystTimeMap[item.analyst] = {
        analyst: item.analyst,
        completedCases: 0,
        totalMinutes: 0,
      };
    }

    if (item.status === "completed" && item.completedAt) {
      const openedAt = new Date(item.openedAt).getTime();
      const completedAt = new Date(item.completedAt).getTime();
      const minutes = (completedAt - openedAt) / 60000;
      analystTimeMap[item.analyst].completedCases += 1;
      analystTimeMap[item.analyst].totalMinutes += minutes;
    }
  });

  const analystTimeline = Object.values(analystTimeMap)
    .map((item) => ({
      ...item,
      averageMinutes: item.completedCases ? item.totalMinutes / item.completedCases : 0,
    }))
    .sort((a, b) => b.totalMinutes - a.totalMinutes);

  const caseTypeBreakdown = Object.entries(caseTypeMap)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);

  return {
    ecddReviewCount,
    completedReviewCount,
    openedReviewCount,
    analystTimeline,
    caseTypeBreakdown,
  };
}

const chartConfig = {
  completedCases: {
    label: "Completed Cases",
    color: "hsl(var(--chart-1))",
  },
  averageMinutes: {
    label: "Average Time (minutes)",
    color: "hsl(var(--chart-2))",
  },
};

const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Page() {
  const analytics = buildAnalytics(reviewItems);

  const analystChartData = analytics.analystTimeline.map((item, index) => ({
    analyst: item.analyst,
    completedCases: item.completedCases,
    averageMinutes: Math.round(item.averageMinutes),
  }));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Review insights for ECDD, completion status, currently open reviews, analyst timeline, and
          case-type distribution.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ECDD Review Count</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.ecddReviewCount}</div>
            <p className="text-xs text-muted-foreground">Total ECDD reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.completedReviewCount}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.openedReviewCount}</div>
            <p className="text-xs text-muted-foreground">Currently in progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analyst Performance</CardTitle>
            <CardDescription>
              Completed cases and average resolution time per analyst
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart data={analystChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="analyst" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar yAxisId="left" dataKey="completedCases" fill="var(--color-completedCases)" />
                <Bar yAxisId="right" dataKey="averageMinutes" fill="var(--color-averageMinutes)" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Type Distribution</CardTitle>
            <CardDescription>Breakdown of cases by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <PieChart>
                <Pie
                  data={analytics.caseTypeBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) =>
                    percent > 0.1 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.caseTypeBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analyst Timeline Details</CardTitle>
          <CardDescription>Detailed breakdown of analyst performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Analyst</TableHead>
                <TableHead className="text-right">Completed</TableHead>
                <TableHead className="text-right">Total Time</TableHead>
                <TableHead className="text-right">Avg Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analytics.analystTimeline.map((item) => (
                <TableRow key={item.analyst}>
                  <TableCell>{item.analyst}</TableCell>
                  <TableCell className="text-right">{item.completedCases}</TableCell>
                  <TableCell className="text-right">{formatMinutes(item.totalMinutes)}</TableCell>
                  <TableCell className="text-right">{formatMinutes(item.averageMinutes)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
