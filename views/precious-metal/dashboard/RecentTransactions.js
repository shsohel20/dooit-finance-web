"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { transactions } from "../data"


const metalNames = {
  gold: "Gold",
  silver: "Silver",
  platinum: "Platinum",
  palladium: "Palladium",
}

export function RecentTransactions({ onViewAll }) {
  const recentTxns = transactions.slice(0, 5)

  return (
    <Card className="bg-card h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View All
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentTxns.map((txn) => (
          <div
            key={txn.id}
            className="flex items-center justify-between rounded-lg border border-border p-3"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  txn.type === "buy"
                    ? "bg-success/10 text-success"
                    : "bg-destructive/10 text-destructive"
                )}
              >
                {txn.type === "buy" ? (
                  <ArrowDownRight className="h-5 w-5" />
                ) : (
                  <ArrowUpRight className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {txn.type === "buy" ? "Bought" : "Sold"} {metalNames[txn.metal]}
                </p>
                <p className="text-sm text-muted-foreground">
                  {txn.quantity} oz @ ${txn.pricePerOz.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "font-medium",
                  txn.type === "buy" ? "text-foreground" : "text-success"
                )}
              >
                {txn.type === "buy" ? "-" : "+"}$
                {txn.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <Badge
                variant={
                  txn.status === "completed"
                    ? "default"
                    : txn.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
                className="mt-1 text-xs"
              >
                {txn.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
