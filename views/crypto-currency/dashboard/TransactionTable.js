"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Search,
  Filter,
  ExternalLink,
  Copy,
  CheckCircle2,
} from "lucide-react"

const transactions = [
  {
    id: "tx1",
    type: "sent",
    amount: 0.5,
    symbol: "BTC",
    value: 48716.09,
    to: "0x742d35Cc6634C0532925a3b844Bc9e7595f5ABCD",
    date: "2025-01-19 14:32",
    status: "completed",
    hash: "0x8f7a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a",
  },
  {
    id: "tx2",
    type: "received",
    amount: 5.2,
    symbol: "ETH",
    value: 17975.26,
    from: "0x123f45Cc6634C0532925a3b844Bc9e7595f1234",
    date: "2025-01-19 12:15",
    status: "completed",
    hash: "0x2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b",
  },
  {
    id: "tx3",
    type: "swap",
    fromAmount: 1000,
    fromSymbol: "USDT",
    toAmount: 0.29,
    toSymbol: "ETH",
    date: "2025-01-18 23:45",
    status: "completed",
    hash: "0x4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
  },
  {
    id: "tx4",
    type: "sent",
    amount: 100,
    symbol: "SOL",
    value: 18945.0,
    to: "0x999d35Cc6634C0532925a3b844Bc9e7595f9999",
    date: "2025-01-18 18:20",
    status: "pending",
    hash: "0x5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e",
  },
  {
    id: "tx5",
    type: "received",
    amount: 2500,
    symbol: "XRP",
    value: 5850.0,
    from: "0x555f45Cc6634C0532925a3b844Bc9e7595f5555",
    date: "2025-01-17 09:10",
    status: "completed",
    hash: "0x6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f",
  },
]



export function TransactionsTable({ limit, showFilters = true }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [copiedId, setCopiedId] = useState(null)

  const filteredTransactions = transactions
    .filter((tx) => {
      if (typeFilter !== "all" && tx.type !== typeFilter) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          tx.symbol?.toLowerCase().includes(query) ||
          tx.hash.toLowerCase().includes(query) ||
          ("to" in tx && tx.to?.toLowerCase().includes(query)) ||
          ("from" in tx && tx.from?.toLowerCase().includes(query))
        )
      }
      return true
    })
    .slice(0, limit || transactions.length)

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
        {!showFilters && (
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address, hash, or token..."
                className="pl-10 bg-secondary border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px] bg-secondary border-border">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="received">Received</SelectItem>
                <SelectItem value="swap">Swapped</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    tx.type === "sent"
                      ? "bg-destructive/20 text-destructive"
                      : tx.type === "received"
                      ? "bg-success/20 text-success"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {tx.type === "sent" ? (
                    <ArrowUpRight className="h-5 w-5" />
                  ) : tx.type === "received" ? (
                    <ArrowDownLeft className="h-5 w-5" />
                  ) : (
                    <RefreshCw className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground capitalize">
                      {tx.type}
                    </span>
                    <Badge
                      variant={tx.status === "completed" ? "default" : "secondary"}
                      className={tx.status === "completed" ? "bg-success/20 text-success" : ""}
                    >
                      {tx.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{tx.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  {tx.type === "swap" ? (
                    <>
                      <p className="font-medium text-foreground">
                        {tx.fromAmount} {tx.fromSymbol} → {tx.toAmount} {tx.toSymbol}
                      </p>
                    </>
                  ) : (
                    <>
                      <p
                        className={`font-medium ${
                          tx.type === "sent" ? "text-destructive" : "text-success"
                        }`}
                      >
                        {tx.type === "sent" ? "-" : "+"}
                        {tx.amount} {tx.symbol}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${tx.value?.toLocaleString()}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyToClipboard(tx.hash, tx.id)}
                  >
                    {copiedId === tx.id ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
