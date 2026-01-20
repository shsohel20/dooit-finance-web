"use client"

import { useState, useMemo } from "react"
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  Info,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { metals, portfolioHoldings } from "../data"

const metalColors= {
  gold: "#D4AF37",
  silver: "#C0C0C0",
  platinum: "#E5E4E2",
  palladium: "#CED0DD",
}

export default function TradeDashboard() {
  const [selectedMetal, setSelectedMetal] = useState("gold")
  const [orderType, setOrderType] = useState("market")
  const [tradeType, setTradeType] = useState("buy")
  const [quantity, setQuantity] = useState("")
  const [limitPrice, setLimitPrice] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const metal = metals.find((m) => m.id === selectedMetal)
  const holding = portfolioHoldings.find((h) => h.metal === selectedMetal)
  const availableBalance = 24850.0 // Mock balance

  const quantityNum = parseFloat(quantity) || 0
  const price = orderType === "limit" && limitPrice ? parseFloat(limitPrice) : metal.price
  const subtotal = quantityNum * price
  const fee = subtotal * 0.0025 // 0.25% fee
  const total = tradeType === "buy" ? subtotal + fee : subtotal - fee

  const maxBuyQuantity = useMemo(() => {
    return Math.floor((availableBalance / metal.price) * 100) / 100
  }, [availableBalance, metal.price])

  const maxSellQuantity = holding?.quantity || 0

  const isValidOrder = useMemo(() => {
    if (quantityNum <= 0) return false
    if (tradeType === "buy" && total > availableBalance) return false
    if (tradeType === "sell" && quantityNum > maxSellQuantity) return false
    if (orderType === "limit" && (!limitPrice || parseFloat(limitPrice) <= 0)) return false
    return true
  }, [quantityNum, tradeType, total, availableBalance, maxSellQuantity, orderType, limitPrice])

  const handleSubmitOrder = () => {
    setShowConfirmation(false)
    setShowSuccess(true)
    setQuantity("")
    setLimitPrice("")
  }

  const quickAmounts = tradeType === "buy" 
    ? [0.1, 0.5, 1, 5] 
    : [maxSellQuantity * 0.25, maxSellQuantity * 0.5, maxSellQuantity * 0.75, maxSellQuantity]

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Metal Selection */}
        <div className="grid gap-4 md:grid-cols-4">
          {metals.map((m) => {
            const isPositive = m.change >= 0
            return (
              <Card
                key={m.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary/50",
                  selectedMetal === m.id && "border-primary ring-1 ring-primary"
                )}
                onClick={() => setSelectedMetal(m.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-8 w-8 rounded-full"
                        style={{ backgroundColor: `${metalColors[m.id]}30` }}
                      >
                        <div
                          className="flex h-full w-full items-center justify-center text-sm font-bold"
                          style={{ color: metalColors[m.id] }}
                        >
                          {m.symbol.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        ${m.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </p>
                      <p
                        className={cn(
                          "flex items-center justify-end text-xs",
                          isPositive ? "text-success" : "text-destructive"
                        )}
                      >
                        {isPositive ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        )}
                        {isPositive ? "+" : ""}
                        {m.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Trade Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Place Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Buy/Sell Tabs */}
                <Tabs
                  value={tradeType}
                  onValueChange={(v) => setTradeType(v)}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="buy"
                      className="data-[state=active]:bg-success data-[state=active]:text-success-foreground"
                    >
                      Buy
                    </TabsTrigger>
                    <TabsTrigger
                      value="sell"
                      className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground"
                    >
                      Sell
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="buy" className="space-y-4 pt-4">
                    <OrderForm
                      metal={metal}
                      orderType={orderType}
                      setOrderType={setOrderType}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      limitPrice={limitPrice}
                      setLimitPrice={setLimitPrice}
                      quickAmounts={quickAmounts}
                      maxQuantity={maxBuyQuantity}
                      tradeType="buy"
                    />
                  </TabsContent>

                  <TabsContent value="sell" className="space-y-4 pt-4">
                    <OrderForm
                      metal={metal}
                      orderType={orderType}
                      setOrderType={setOrderType}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      limitPrice={limitPrice}
                      setLimitPrice={setLimitPrice}
                      quickAmounts={quickAmounts}
                      maxQuantity={maxSellQuantity}
                      tradeType="sell"
                    />
                  </TabsContent>
                </Tabs>

                {/* Order Summary */}
                {quantityNum > 0 && (
                  <div className="rounded-lg border border-border bg-secondary/30 p-4">
                    <h4 className="mb-3 font-medium text-foreground">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {quantityNum} oz x ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-foreground">
                          ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          Trading Fee (0.25%)
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Standard trading fee applied to all orders</p>
                            </TooltipContent>
                          </Tooltip>
                        </span>
                        <span className="text-foreground">
                          ${fee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between border-t border-border pt-2">
                        <span className="font-medium text-foreground">Total</span>
                        <span className="text-lg font-bold text-foreground">
                          ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Validation Errors */}
                {tradeType === "buy" && total > availableBalance && quantityNum > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Insufficient Balance</AlertTitle>
                    <AlertDescription>
                      You need ${(total - availableBalance).toLocaleString("en-US", { minimumFractionDigits: 2 })} more to complete this order.
                    </AlertDescription>
                  </Alert>
                )}

                {tradeType === "sell" && quantityNum > maxSellQuantity && quantityNum > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Insufficient Holdings</AlertTitle>
                    <AlertDescription>
                      You only have {maxSellQuantity} oz of {metal.name} available to sell.
                    </AlertDescription>
                  </Alert>
                )}

                <Button
                  className={cn(
                    "w-full",
                    tradeType === "buy"
                      ? "bg-success text-success-foreground hover:bg-success/90"
                      : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  )}
                  size="lg"
                  disabled={!isValidOrder}
                  onClick={() => setShowConfirmation(true)}
                >
                  {tradeType === "buy" ? "Buy" : "Sell"} {metal.name}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Market Info */}
          <div className="space-y-6">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Market Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spot Price</span>
                  <span className="font-medium text-foreground">
                    ${metal.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Change</span>
                  <span
                    className={cn(
                      "font-medium",
                      metal.change >= 0 ? "text-success" : "text-destructive"
                    )}
                  >
                    {metal.change >= 0 ? "+" : ""}${metal.change.toFixed(2)} (
                    {metal.change >= 0 ? "+" : ""}
                    {metal.changePercent.toFixed(2)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h High</span>
                  <span className="font-medium text-foreground">
                    ${metal.high24h.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">24h Low</span>
                  <span className="font-medium text-foreground">
                    ${metal.low24h.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Volume</span>
                  <span className="font-medium text-foreground">{metal.volume}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Your Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available USD</span>
                  <span className="font-medium text-foreground">
                    ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{metal.name} Holdings</span>
                  <span className="font-medium text-foreground">
                    {holding?.quantity || 0} oz
                  </span>
                </div>
                {holding && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Holdings Value</span>
                    <span className="font-medium text-foreground">
                      ${holding.currentValue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Order</DialogTitle>
              <DialogDescription>
                Please review your order details before confirming.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-secondary p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    You are about to {tradeType}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-foreground">
                    {quantityNum} oz {metal.name}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    @ ${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}/oz
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Type</span>
                  <span className="capitalize text-foreground">{orderType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">
                    ${subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="text-foreground">
                    ${fee.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-foreground">
                    ${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
              <Button
                className={cn(
                  tradeType === "buy"
                    ? "bg-success text-success-foreground hover:bg-success/90"
                    : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                )}
                onClick={handleSubmitOrder}
              >
                Confirm {tradeType === "buy" ? "Purchase" : "Sale"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                Order Submitted
              </DialogTitle>
              <DialogDescription>
                Your {tradeType} order has been successfully submitted and is being processed.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>What happens next?</AlertTitle>
                <AlertDescription>
                  {orderType === "market"
                    ? "Your market order will be executed immediately at the current market price."
                    : "Your limit order will be executed when the market reaches your specified price."}
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button onClick={() => setShowSuccess(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}



function OrderForm({
  metal,
  orderType,
  setOrderType,
  quantity,
  setQuantity,
  limitPrice,
  setLimitPrice,
  quickAmounts,
  maxQuantity,
  tradeType,
}) {
  return (
    <>
      {/* Order Type */}
      <div className="space-y-2">
        <Label>Order Type</Label>
        <Select value={orderType} onValueChange={(v) => setOrderType(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market">Market Order</SelectItem>
            <SelectItem value="limit">Limit Order</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {orderType === "market"
            ? "Execute immediately at current market price"
            : "Execute when price reaches your limit"}
        </p>
      </div>

      {/* Limit Price */}
      {orderType === "limit" && (
        <div className="space-y-2">
          <Label>Limit Price (USD/oz)</Label>
          <Input
            type="number"
            placeholder={metal.price.toFixed(2)}
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
          />
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Quantity (oz)</Label>
          <span className="text-xs text-muted-foreground">
            Max: {maxQuantity.toLocaleString()} oz
          </span>
        </div>
        <Input
          type="number"
          placeholder="0.00"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <div className="flex gap-2">
          {quickAmounts.map((amount, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="flex-1 text-xs bg-transparent"
              onClick={() => setQuantity(amount.toFixed(2))}
            >
              {tradeType === "sell" ? `${((i + 1) * 25)}%` : `${amount} oz`}
            </Button>
          ))}
        </div>
      </div>
    </>
  )
}
