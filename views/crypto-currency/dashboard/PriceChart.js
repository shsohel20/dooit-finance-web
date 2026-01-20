"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const timeframes = ["1H", "1D", "1W", "1M", "1Y", "ALL"]

const chartData = {
  "1H": [
    { time: "10:00", price: 97200 },
    { time: "10:15", price: 97350 },
    { time: "10:30", price: 97100 },
    { time: "10:45", price: 97500 },
    { time: "11:00", price: 97400 },
    { time: "11:15", price: 97600 },
    { time: "11:30", price: 97432 },
  ],
  "1D": [
    { time: "00:00", price: 96500 },
    { time: "04:00", price: 96800 },
    { time: "08:00", price: 97100 },
    { time: "12:00", price: 97000 },
    { time: "16:00", price: 97300 },
    { time: "20:00", price: 97500 },
    { time: "24:00", price: 97432 },
  ],
  "1W": [
    { time: "Mon", price: 95000 },
    { time: "Tue", price: 95500 },
    { time: "Wed", price: 96200 },
    { time: "Thu", price: 95800 },
    { time: "Fri", price: 96800 },
    { time: "Sat", price: 97200 },
    { time: "Sun", price: 97432 },
  ],
  "1M": [
    { time: "Week 1", price: 92000 },
    { time: "Week 2", price: 94500 },
    { time: "Week 3", price: 93800 },
    { time: "Week 4", price: 97432 },
  ],
  "1Y": [
    { time: "Jan", price: 42000 },
    { time: "Mar", price: 55000 },
    { time: "May", price: 48000 },
    { time: "Jul", price: 62000 },
    { time: "Sep", price: 75000 },
    { time: "Nov", price: 97432 },
  ],
  ALL: [
    { time: "2020", price: 10000 },
    { time: "2021", price: 45000 },
    { time: "2022", price: 35000 },
    { time: "2023", price: 42000 },
    { time: "2024", price: 70000 },
    { time: "2025", price: 97432 },
  ],
}

export function PriceChart() {
  const [activeTimeframe, setActiveTimeframe] = useState("1W")

  const data = chartData[activeTimeframe]

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">Bitcoin Price</CardTitle>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">$97,432.18</span>
            <span className="text-sm text-success">+2.34%</span>
          </div>
        </div>
        <div className="flex gap-1">
          {timeframes.map((tf) => (
            <Button
              key={tf}
              variant={activeTimeframe === tf ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTimeframe(tf)}
              className={activeTimeframe === tf ? "bg-primary text-primary-foreground" : ""}
            >
              {tf}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#888", fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                domain={["dataMin - 1000", "dataMax + 1000"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#888" }}
                formatter={(value) => [`$${value.toLocaleString()}`, "Price"]}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
