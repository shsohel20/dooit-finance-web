"use client"

import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Activity, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetalPriceCard } from "./MetalPriceCard"
import { PriceChart } from "./PriceChart"
import { RecentTransactions } from "./RecentTransactions"
import { metals, portfolioHoldings } from "../data"


export default function PreciousMetalDashboard({ onNavigate }) {
  const totalValue = portfolioHoldings.reduce((acc, h) => acc + h.currentValue, 0)
  const totalProfitLoss = portfolioHoldings.reduce((acc, h) => acc + h.profitLoss, 0)
  const profitLossPercent = (totalProfitLoss / (totalValue - totalProfitLoss)) * 100
  const isPositive = totalProfitLoss >= 0

  const stats = [
    {
      title: "Total Portfolio Value",
      value: `$${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: `${isPositive ? "+" : ""}${profitLossPercent.toFixed(2)}%`,
      changeValue: `${isPositive ? "+" : ""}$${Math.abs(totalProfitLoss).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      isPositive,
      icon: Wallet,
    },
    {
      title: "Today's Gain/Loss",
      value: `$${(totalValue * 0.0085).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      change: "+0.85%",
      changeValue: "vs yesterday",
      isPositive: true,
      icon: TrendingUp,
    },
    {
      title: "Total Transactions",
      value: "248",
      change: "+12",
      changeValue: "this month",
      isPositive: true,
      icon: Activity,
    },
    {
      title: "Available Balance",
      value: "$24,850.00",
      change: "USD",
      changeValue: "Ready to invest",
      isPositive: true,
      icon: DollarSign,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="bg-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="rounded-lg bg-secondary p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span
                    className={`flex items-center text-sm font-medium ${
                      stat.isPositive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {stat.isPositive ? (
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="mr-1 h-4 w-4" />
                    )}
                    {stat.change}
                  </span>
                  <span className="text-sm text-muted-foreground">{stat.changeValue}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Metal Price Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-foreground">Live Prices</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metals.map((metal) => (
            <MetalPriceCard
              key={metal.id}
              metal={metal}
              onClick={() => onNavigate("trade")}
            />
          ))}
        </div>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PriceChart />
        </div>
        <div>
          <RecentTransactions onViewAll={() => onNavigate("transactions")} />
        </div>
      </div>
    </div>
  )
}
