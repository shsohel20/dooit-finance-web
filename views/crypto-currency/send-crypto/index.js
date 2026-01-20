"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";

const wallets = [
  { id: "btc", name: "Bitcoin", symbol: "BTC", balance: 1.234, value: 120234.56 },
  { id: "eth", name: "Ethereum", symbol: "ETH", balance: 15.5, value: 53580.09 },
  { id: "sol", name: "Solana", symbol: "SOL", balance: 100, value: 18945.0 },
  { id: "ada", name: "Cardano", symbol: "ADA", balance: 5000, value: 4900.0 },
  { id: "xrp", name: "Ripple", symbol: "XRP", balance: 2500, value: 5850.0 },
];

export function SendCrypto({ initialCrypto }) {
  const [selectedCrypto, setSelectedCrypto] = useState(initialCrypto || "btc");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");

  const selectedWallet = wallets.find((w) => w.id === selectedCrypto);

  const handleSend = () => {
    setError("");

    if (!recipient) {
      setError("Please enter a recipient address");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (selectedWallet && parseFloat(amount) > selectedWallet.balance) {
      setError("Insufficient balance");
      return;
    }

    setShowConfirm(true);
  };

  const confirmSend = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
    }, 2000);
  };

  const resetForm = () => {
    setRecipient("");
    setAmount("");
    setShowConfirm(false);
    setIsProcessing(false);
    setIsComplete(false);
    setError("");
  };

  const setMaxAmount = () => {
    if (selectedWallet) {
      setAmount(selectedWallet.balance.toString());
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader>
        <PageTitle>Send Crypto</PageTitle>
        <PageDescription>Send crypto to another wallet address</PageDescription>
      </PageHeader>
      <Card className="bg-card border-border max-w-xl ">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" />
            Send Cryptocurrency
          </CardTitle>
          <CardDescription>Transfer crypto to another wallet address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Select Asset</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    <div className="flex items-center justify-between w-full gap-4">
                      <span>
                        {wallet.name} ({wallet.symbol})
                      </span>
                      <span className="text-muted-foreground">
                        {wallet.balance} {wallet.symbol}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedWallet && (
              <p className="text-sm text-muted-foreground">
                Available: {selectedWallet.balance} {selectedWallet.symbol} ($
                {selectedWallet.value.toLocaleString()})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Recipient Address</Label>
            <Input
              placeholder="Enter wallet address (0x...)"
              className="bg-secondary border-border font-mono"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Amount</Label>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary h-6 px-2"
                onClick={setMaxAmount}
              >
                MAX
              </Button>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                className="bg-secondary border-border pr-16"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {selectedWallet?.symbol}
              </span>
            </div>
            {amount && selectedWallet && (
              <p className="text-sm text-muted-foreground">
                ≈ $
                {(
                  (selectedWallet.value / selectedWallet.balance) *
                  parseFloat(amount || "0")
                ).toLocaleString()}
              </p>
            )}
          </div>

          <div className="p-4 rounded-lg bg-secondary/50">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Network Fee</span>
              <span className="text-foreground">~0.0001 {selectedWallet?.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Time</span>
              <span className="text-foreground">~10 minutes</span>
            </div>
          </div>

          <Button className="w-full" size="lg" onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Send {selectedWallet?.symbol}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          {isComplete ? (
            <>
              <DialogHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                </div>
                <DialogTitle className="text-center">Transaction Sent!</DialogTitle>
                <DialogDescription className="text-center">
                  Your transaction has been submitted to the network and is being processed.
                </DialogDescription>
              </DialogHeader>
              <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {amount} {selectedWallet?.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-mono text-sm">
                    {recipient.slice(0, 10)}...{recipient.slice(-8)}
                  </span>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full" onClick={resetForm}>
                  Done
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Confirm Transaction</DialogTitle>
                <DialogDescription>Please review the details before confirming</DialogDescription>
              </DialogHeader>
              <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sending</span>
                  <span className="font-medium text-lg">
                    {amount} {selectedWallet?.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-mono text-sm">
                    {recipient.slice(0, 10)}...{recipient.slice(-8)}
                  </span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium">
                    {(parseFloat(amount) + 0.0001).toFixed(4)} {selectedWallet?.symbol}
                  </span>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowConfirm(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmSend} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Confirm Send"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
