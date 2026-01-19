"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Wallet,
  Plus,
  MoreVertical,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const initialWallets = [
  {
    id: "1",
    name: "Main Wallet",
    address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44E",
    balance: 203509.65,
    change: 2.34,
    assets: 5,
    isPrimary: true,
  },
  {
    id: "2",
    name: "Trading Wallet",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    balance: 45230.12,
    change: -1.23,
    assets: 3,
    isPrimary: false,
  },
  {
    id: "3",
    name: "Savings",
    address: "DRpbCBMxVnDK7maPMaKyHd3VzNwHbSnVNmeyVhc1zWVV",
    balance: 12500.0,
    change: 0.89,
    assets: 2,
    isPrimary: false,
  },
]



export function WalletsView({ onSelectWallet }) {
  const [wallets, setWallets] = useState(initialWallets)
  const [showBalances, setShowBalances] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [newWalletName, setNewWalletName] = useState("")
  const [newWalletAddress, setNewWalletAddress] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)

  const copyAddress = (address, id) => {
    navigator.clipboard.writeText(address)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const addWallet = () => {
    if (newWalletName && newWalletAddress) {
      const newWallet = {
        id: Date.now().toString(),
        name: newWalletName,
        address: newWalletAddress,
        balance: 0,
        change: 0,
        assets: 0,
        isPrimary: false,
      }
      setWallets([...wallets, newWallet])
      setNewWalletName("")
      setNewWalletAddress("")
      setIsAddDialogOpen(false)
    }
  }

  const deleteWallet = (id) => {
    setWallets(wallets.filter((w) => w.id !== id))
  }

  const setPrimary = (id) => {
    setWallets(
      wallets.map((w) => ({
        ...w,
        isPrimary: w.id === id,
      }))
    )
  }

  return (
    <div className="space-y-6">
      {/* Total Balance Card */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Portfolio Value</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-foreground">
                  {showBalances ? `$${totalBalance.toLocaleString()}` : "••••••••"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowBalances(!showBalances)}
                >
                  {showBalances ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Wallet
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Wallet</DialogTitle>
                  <DialogDescription>
                    Connect an existing wallet to your portfolio
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Wallet Name</Label>
                    <Input
                      placeholder="e.g., Hardware Wallet"
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <Input
                      placeholder="Enter wallet address"
                      className="font-mono"
                      value={newWalletAddress}
                      onChange={(e) => setNewWalletAddress(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addWallet}>Add Wallet</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Wallets List */}
      <div className="grid gap-4">
        {wallets.map((wallet) => (
          <Card
            key={wallet.id}
            className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => onSelectWallet?.(wallet.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground">{wallet.name}</h3>
                      {wallet.isPrimary && (
                        <Badge variant="secondary" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm text-muted-foreground">
                        {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation()
                          copyAddress(wallet.address, wallet.id)
                        }}
                      >
                        {copiedId === wallet.id ? (
                          <CheckCircle2 className="h-3 w-3 text-success" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      {showBalances ? `$${wallet.balance.toLocaleString()}` : "••••••"}
                    </p>
                    <div className="flex items-center justify-end gap-2 text-sm">
                      <span className="text-muted-foreground">{wallet.assets} assets</span>
                      <span
                        className={wallet.change >= 0 ? "text-success" : "text-destructive"}
                      >
                        {wallet.change >= 0 ? "+" : ""}
                        {wallet.change}%
                      </span>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setPrimary(wallet.id)}>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Set as Primary
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Explorer
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => deleteWallet(wallet.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Wallet
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
