"use client"

import { useState } from "react"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { priceHistory } from "../data"

const timeRanges = [
  { label: "24h", value: "24h" },
  { label: "7D", value: "7d" },
  { label: "1M", value: "1m" },
  { label: "3M", value: "3m" },
  { label: "1Y", value: "1y" },
]

const metalColors = {
  gold: "#D4AF37",
  silver: "#C0C0C0",
  platinum: "#E5E4E2",
  palladium: "#CED0DD",
}


export function PriceChart({ selectedMetals = ["gold", "silver"] }) {
  const [timeRange, setTimeRange] = useState("1m")
  const [activeMetals, setActiveMetals] = useState(selectedMetals)

  const toggleMetal = (metal) => {
    if (activeMetals.includes(metal)) {
      if (activeMetals.length > 1) {
        setActiveMetals(activeMetals.filter((m) => m !== metal))
      }
    } else {
      setActiveMetals([...activeMetals, metal])
    }
  }

  const formatDate = (date) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <Card className="bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Price History</CardTitle>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <Button
              key={range.value}
              variant={timeRange === range.value ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-8 px-3 text-xs",
                timeRange === range.value && "bg-secondary text-primary"
              )}
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {(Object.keys(metalColors)).map((metal) => (
            <Button
              key={metal}
              variant="outline"
              size="sm"
              className={cn(
                "h-7 gap-2 text-xs capitalize",
                activeMetals.includes(metal) && "border-primary bg-primary/10"
              )}
              onClick={() => toggleMetal(metal)}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: metalColors[metal] }}
              />
              {metal}
            </Button>
          ))}
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={priceHistory}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              {activeMetals.includes("gold") && (
                <Line
                  type="monotone"
                  dataKey="gold"
                  stroke={metalColors.gold}
                  strokeWidth={2}
                  dot={false}
                  name="Gold"
                />
              )}
              {activeMetals.includes("silver") && (
                <Line
                  type="monotone"
                  dataKey="silver"
                  stroke={metalColors.silver}
                  strokeWidth={2}
                  dot={false}
                  name="Silver"
                />
              )}
              {activeMetals.includes("platinum") && (
                <Line
                  type="monotone"
                  dataKey="platinum"
                  stroke={metalColors.platinum}
                  strokeWidth={2}
                  dot={false}
                  name="Platinum"
                />
              )}
              {activeMetals.includes("palladium") && (
                <Line
                  type="monotone"
                  dataKey="palladium"
                  stroke={metalColors.palladium}
                  strokeWidth={2}
                  dot={false}
                  name="Palladium"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
