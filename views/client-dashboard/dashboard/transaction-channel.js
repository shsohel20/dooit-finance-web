"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { transactionChannelData } from "@/lib/dashboard-data";
import { Globe, Smartphone, CreditCard, Building2, Users } from "lucide-react";

const CHANNEL_ICONS = {
  Online: Globe,
  Mobile: Smartphone,
  ATM: CreditCard,
  Branch: Building2,
  Agent: Users,
};

const CHANNEL_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function TransactionChannels() {
  const totalTransactions = transactionChannelData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="border-0 p-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Transaction Channels
            </CardTitle>
            <p className="text-sm text-muted-foreground">Volume distribution by channel</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {(totalTransactions / 1000).toFixed(0)}K Total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={transactionChannelData}
              margin={{ top: 10, right: 10, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="channel"
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [`${value.toLocaleString()} transactions`, ""]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {transactionChannelData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {transactionChannelData.map((channel, index) => {
            const Icon = CHANNEL_ICONS[channel.channel];
            return (
              <div
                key={channel.channel}
                className="flex flex-col items-center p-2 rounded-lg bg-secondary/50 text-center"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center mb-1"
                  style={{ backgroundColor: `${CHANNEL_COLORS[index]}20` }}
                >
                  <Icon className="h-4 w-4" style={{ color: CHANNEL_COLORS[index] }} />
                </div>
                <p className="text-xs text-muted-foreground">{channel.channel}</p>
                <p className="text-sm font-semibold text-foreground">{channel.percentage}%</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
