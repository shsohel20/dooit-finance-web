"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"



export function MetalPriceCard({ metal, onClick }) {
  const isPositive = metal.change >= 0

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg",
        "bg-card"
      )}
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ backgroundColor: `${metal.color}20` }}
            >
              <span
                className="text-lg font-bold"
                style={{ color: metal.color }}
              >
                {metal.symbol.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-foreground">{metal.name}</h3>
              <p className="text-sm text-muted-foreground">{metal.symbol}/USD</p>
            </div>
          </div>
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              isPositive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {metal.changePercent.toFixed(2)}%
          </div>
        </div>

        <div className="mt-4">
          <p className="text-2xl font-bold text-foreground">
            ${metal.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <p
            className={cn(
              "mt-1 text-sm",
              isPositive ? "text-success" : "text-destructive"
            )}
          >
            {isPositive ? "+" : ""}${Math.abs(metal.change).toFixed(2)} today
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground">24h High</p>
            <p className="font-medium text-foreground">
              ${metal.high24h.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">24h Low</p>
            <p className="font-medium text-foreground">
              ${metal.low24h.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
