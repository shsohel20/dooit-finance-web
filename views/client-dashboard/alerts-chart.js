"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Sanctions\nMatches", value: 25, fill: "var(--primary)" },
  { name: "Watchlist\nMatches", value: 45, fill: "var(--primary-light)" },
  { name: "KYC\nArtifacts", value: 30, fill: "var(--accent)" },
  { name: "Sanctions\nOngoing", value: 15, fill: "var(--success)" },
];

export function AlertsChart() {
  return (
    <Card className="border bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Alerts by Type</CardTitle>
        <p className="text-sm text-muted-foreground">Distribution of alert categories</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
              // className="text-primary-gray"
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={false}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <Tooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
