"use client"

import { useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { portfolioHoldings, metals } from "../data"

const metalColors = {
    gold: "#D4AF37",
    silver: "#C0C0C0",
    platinum: "#E5E4E2",
    palladium: "#CED0DD",
  }
  
  const metalNames= {
    gold: "Gold",
    silver: "Silver",
    platinum: "Platinum",
    palladium: "Palladium",
  }
  

export function PreciousMetalPortfolio({ onNavigate }) {
  const [selectedHolding, setSelectedHolding] = useState(null)

  const totalValue = portfolioHoldings.reduce((acc, h) => acc + h.currentValue, 0)
  const totalCost = portfolioHoldings.reduce((acc, h) => acc + h.avgCost * h.quantity, 0)
  const totalProfitLoss = totalValue - totalCost
  const totalProfitLossPercent = (totalProfitLoss / totalCost) * 100
  const isPositive = totalProfitLoss >= 0

  const pieData = portfolioHoldings.map((h) => ({
    name: metalNames[h.metal],
    value: h.currentValue,
    color: metalColors[h.metal],
    metal: h.metal,
  }))

  const barData = portfolioHoldings.map((h) => ({
    name: metalNames[h.metal],
    profit: h.profitLoss,
    fill: h.profitLoss >= 0 ? "#72C472" : "#E57373",
  }))

  const getMetal = (metalId) => metals.find((m) => m.id === metalId)

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Portfolio Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium",
                    isPositive
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {isPositive ? "+" : ""}
                  {totalProfitLossPercent.toFixed(2)}%
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Total Cost Basis</p>
                  <p className="font-medium text-foreground">
                    ${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div>
                  <p className="text-xs text-muted-foreground">Unrealized P&L</p>
                  <p
                    className={cn(
                      "font-medium",
                      isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    {isPositive ? "+" : ""}$
                    {Math.abs(totalProfitLoss).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Total Ounces Held</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {portfolioHoldings.reduce((acc, h) => acc + h.quantity, 0).toLocaleString()} oz
              </p>
              <p className="mt-2 text-xs text-muted-foreground">Across 4 metals</p>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">Best Performer</p>
              <p className="mt-1 text-2xl font-bold text-foreground">Silver</p>
              <p className="mt-2 flex items-center text-sm text-success">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +2.85%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Allocation Pie Chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Portfolio Allocation
                <TooltipUI>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Distribution of your holdings by value</p>
                  </TooltipContent>
                </TooltipUI>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      onMouseEnter={(_, index) =>
                        setSelectedHolding(pieData[index].metal)
                      }
                      onMouseLeave={() => setSelectedHolding(null)}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value) =>
                        `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      }
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* P&L Bar Chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                Profit & Loss by Metal
                <TooltipUI>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Unrealized gains/losses per metal</p>
                  </TooltipContent>
                </TooltipUI>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="name"
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
                      formatter={(value) =>
                        `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                      }
                    />
                    <Bar dataKey="profit" fill="#D4AF37" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings Detail */}
        <Card className="bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Holdings Detail</CardTitle>
              <Button variant="outline" size="sm" onClick={() => onNavigate("trade")}>
                Trade
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {portfolioHoldings.map((holding) => {
                const metal = getMetal(holding.metal)
                const allocation = (holding.currentValue / totalValue) * 100
                const isHoldingPositive = holding.profitLoss >= 0

                return (
                  <div
                    key={holding.metal}
                    className={cn(
                      "rounded-lg border border-border p-4 transition-colors",
                      selectedHolding === holding.metal && "border-primary bg-secondary/50"
                    )}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: `${metalColors[holding.metal]}20`,
                          }}
                        >
                          <span
                            className="text-xl font-bold"
                            style={{ color: metalColors[holding.metal] }}
                          >
                            {metal?.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {metalNames[holding.metal]}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {holding.quantity} oz @ ${holding.avgCost.toLocaleString()}/oz avg
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:text-right">
                        <div>
                          <p className="text-xs text-muted-foreground">Current Value</p>
                          <p className="font-semibold text-foreground">
                            ${holding.currentValue.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Spot Price</p>
                          <p className="font-semibold text-foreground">
                            ${metal?.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">P&L</p>
                          <p
                            className={cn(
                              "flex items-center font-semibold md:justify-end",
                              isHoldingPositive ? "text-success" : "text-destructive"
                            )}
                          >
                            {isHoldingPositive ? (
                              <ArrowUpRight className="mr-1 h-4 w-4" />
                            ) : (
                              <ArrowDownRight className="mr-1 h-4 w-4" />
                            )}
                            {isHoldingPositive ? "+" : ""}$
                            {Math.abs(holding.profitLoss).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">% Change</p>
                          <p
                            className={cn(
                              "font-semibold",
                              isHoldingPositive ? "text-success" : "text-destructive"
                            )}
                          >
                            {isHoldingPositive ? "+" : ""}
                            {holding.profitLossPercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-muted-foreground">Portfolio Allocation</span>
                        <span className="text-foreground">{allocation.toFixed(1)}%</span>
                      </div>
                      <Progress value={allocation} className="h-2" />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
