"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { fmtAUD, fmtAUDCompact } from "./constants";

const chartConfig = {
  volume: { label: "Volume (AUD)", color: "var(--chart-2)" },
};

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-foreground">{label}</p>
      <p className="text-muted-foreground">
        Volume: <span className="font-medium text-foreground">{fmtAUD(point?.volume)}</span>
      </p>
      <p className="text-muted-foreground">
        Transactions: <span className="font-medium text-foreground">{point?.count ?? 0}</span>
      </p>
    </div>
  );
}

export function TrustAccountTrend({ trend = [] }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Trust Account Activity</CardTitle>
        <CardDescription>Monthly transaction volume, last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {trend.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            No transactions recorded in the last 6 months
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart data={trend} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeOpacity={0.4} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={64}
                tickFormatter={(v) => fmtAUDCompact(v)}
              />
              <ChartTooltip cursor={{ fillOpacity: 0.15 }} content={<TrendTooltip />} />
              <Bar dataKey="volume" fill="var(--color-volume)" radius={[4, 4, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
