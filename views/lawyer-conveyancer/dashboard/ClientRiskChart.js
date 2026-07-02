"use client";

import { Cell, Pie, PieChart } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { RISK_COLORS } from "./constants";

const RISK_ORDER = ["Low", "Medium", "High", "Unacceptable"];

function RiskTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0];
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{point.name}</p>
      <p className="text-muted-foreground">
        {point.value} assessment{point.value === 1 ? "" : "s"}
      </p>
    </div>
  );
}

export function ClientRiskChart({ risk }) {
  const total = risk?.total ?? 0;
  const data = RISK_ORDER.map((label) => ({
    name: label,
    value: risk?.byLabel?.[label] ?? 0,
  })).filter((d) => d.value > 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Client Risk Distribution</CardTitle>
        <CardDescription>
          {total > 0 ? `${total} customer risk assessments` : "Customer risk assessments"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            No risk assessments yet
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <ChartContainer config={{}} className="aspect-square h-[180px]">
              <PieChart>
                <ChartTooltip content={<RiskTooltip />} />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="var(--background)"
                  strokeWidth={2}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={RISK_COLORS[entry.name]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            {/* Legend with counts — identity is never color-alone */}
            <ul className="w-full space-y-1.5">
              {RISK_ORDER.map((label) => {
                const count = risk?.byLabel?.[label] ?? 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <li key={label} className="flex items-center gap-2 text-sm">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: RISK_COLORS[label] }}
                    />
                    <span className="text-foreground">{label}</span>
                    <span className="ml-auto text-muted-foreground">
                      {count} · {pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
