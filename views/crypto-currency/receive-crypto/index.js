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
import { Download, Copy, CheckCircle2, QrCode, Share2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageDescription, PageHeader, PageTitle } from "@/components/common";

const walletAddresses = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Bitcoin Network",
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44E",
    network: "Ethereum Mainnet",
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    address: "DRpbCBMxVnDK7maPMaKyHd3VzNwHbSnVNmeyVhc1zWVV",
    network: "Solana Mainnet",
  },
  {
    id: "ada",
    name: "Cardano",
    symbol: "ADA",
    address: "addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    network: "Cardano Mainnet",
  },
  {
    id: "xrp",
    name: "Ripple",
    symbol: "XRP",
    address: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
    network: "XRP Ledger",
  },
];

export function ReceiveCrypto() {
  const [selectedCrypto, setSelectedCrypto] = useState("btc");
  const [copied, setCopied] = useState(false);
  const [showShareAlert, setShowShareAlert] = useState(false);

  const selectedWallet = walletAddresses.find((w) => w.id === selectedCrypto);

  const copyAddress = () => {
    if (selectedWallet) {
      navigator.clipboard.writeText(selectedWallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareAddress = () => {
    if (navigator.share && selectedWallet) {
      navigator.share({
        title: `My ${selectedWallet.name} Address`,
        text: selectedWallet.address,
      });
    } else {
      copyAddress();
      setShowShareAlert(true);
      setTimeout(() => setShowShareAlert(false), 3000);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader>
        <PageTitle>Receive Crypto</PageTitle>
        <PageDescription>Share your wallet address to receive crypto</PageDescription>
      </PageHeader>
      <Card className="bg-card border-border max-w-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Receive Cryptocurrency
          </CardTitle>
          <CardDescription>Share your wallet address to receive crypto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showShareAlert && (
            <Alert className="bg-success/20 border-success/50">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <AlertDescription className="text-success">
                Address copied to clipboard!
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Select Asset to Receive</Label>
            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {walletAddresses.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.name} ({wallet.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedWallet && (
            <>
              <div className="flex justify-center p-6 bg-white rounded-lg">
                <div className="w-48 h-48 bg-secondary rounded-lg flex items-center justify-center">
                  <QrCode className="h-32 w-32 text-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your {selectedWallet.symbol} Address</Label>
                <div className="relative">
                  <Input
                    readOnly
                    value={selectedWallet.address}
                    className="bg-secondary border-border font-mono text-sm pr-24"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                    onClick={copyAddress}
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-1 text-success" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Network: {selectedWallet.network}</p>
              </div>

              <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                <p className="text-sm text-warning font-medium">Important</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Only send {selectedWallet.symbol} to this address. Sending other assets may result
                  in permanent loss.
                </p>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1" onClick={copyAddress}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={shareAddress}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
