"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

const cryptoAssets = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    price: 97432.18,
    change: 2.34,
    holdings: 1.234,
    value: 120234.56,
    color: "#F7931A",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change: -1.23,
    holdings: 15.5,
    value: 53580.09,
    color: "#627EEA",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    price: 189.45,
    change: 5.67,
    holdings: 100,
    value: 18945.0,
    color: "#9945FF",
  },
  {
    id: "ada",
    name: "Cardano",
    symbol: "ADA",
    price: 0.98,
    change: -0.45,
    holdings: 5000,
    value: 4900.0,
    color: "#0033AD",
  },
  {
    id: "xrp",
    name: "Ripple",
    symbol: "XRP",
    price: 2.34,
    change: 1.89,
    holdings: 2500,
    value: 5850.0,
    color: "#23292F",
  },
]



export function CryptoList({ onSend }) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Your Assets</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cryptoAssets.map((crypto) => (
            <div
              key={crypto.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full text-white font-bold text-sm"
                  style={{ backgroundColor: crypto.color }}
                >
                  {crypto.symbol.slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-foreground">{crypto.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {crypto.holdings} {crypto.symbol}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">
                  ${crypto.value.toLocaleString()}
                </p>
                <div
                  className={`flex items-center justify-end text-sm ${
                    crypto.change >= 0 ? "text-success" : "text-destructive"
                  }`}
                >
                  {crypto.change >= 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  <span>{Math.abs(crypto.change)}%</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-4 bg-transparent"
                onClick={() => onSend?.(crypto.symbol)}
              >
                Trade
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
