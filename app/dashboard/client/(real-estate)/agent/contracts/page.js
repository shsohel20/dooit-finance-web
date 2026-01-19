"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  Plus,
  FileText,
  Download,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  PenLine,
  Edit,
  Trash2,
  Send,
  Copy,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const initialContracts = [
  {
    id: "CON-001",
    property: "42 Collins Street, Melbourne VIC 3000",
    buyer: "Robert Thompson",
    buyerEmail: "robert.t@email.com",
    seller: "Property Holdings Pty Ltd",
    sellerEmail: "legal@propertyholdings.com.au",
    price: 1250000,
    deposit: 125000,
    status: "executed",
    type: "Contract of Sale",
    created: "2024-12-15",
    expiryDate: "2025-01-28",
    settlementDate: "2025-02-15",
    specialConditions: "Subject to building and pest inspection",
  },
  {
    id: "CON-002",
    property: "18 Beach Road, Brighton VIC 3186",
    buyer: "TBC",
    buyerEmail: "",
    seller: "Amanda Foster",
    sellerEmail: "amanda.foster@email.com",
    price: 3450000,
    deposit: 345000,
    status: "draft",
    type: "Contract of Sale",
    created: "2024-12-18",
    expiryDate: null,
    settlementDate: null,
    specialConditions: "",
  },
  {
    id: "CON-003",
    property: "7/125 Pitt Street, Sydney NSW 2000",
    buyer: "Chen Wei",
    buyerEmail: "chen.wei@email.com",
    seller: "Macquarie Investments",
    sellerEmail: "contracts@macquarieinv.com.au",
    price: 890000,
    deposit: 89000,
    status: "completed",
    type: "Contract of Sale",
    created: "2024-10-05",
    expiryDate: "2024-12-20",
    settlementDate: "2024-12-18",
    specialConditions: "Finance approval required",
  },
  {
    id: "CON-004",
    property: "156 Main Street, Southbank VIC 3006",
    buyer: "Sarah Johnson",
    buyerEmail: "sarah.j@email.com",
    seller: "Urban Living Pty Ltd",
    sellerEmail: "sales@urbanliving.com.au",
    price: 725000,
    deposit: 72500,
    status: "pending-signature",
    type: "Contract of Sale",
    created: "2024-12-20",
    expiryDate: "2025-02-20",
    settlementDate: "2025-03-15",
    specialConditions: "Subject to finance approval within 14 days",
  },
]


const statusConfig = {
  draft: { color: "bg-muted text-muted-foreground border-muted", icon: FileText, label: "Draft" },
  "pending-signature": {
    color: "bg-warning/20 text-warning border-warning/30",
    icon: PenLine,
    label: "Pending Signature",
  },
  executed: { color: "bg-success/20 text-success border-success/30", icon: CheckCircle2, label: "Executed" },
  completed: { color: "bg-info/20 text-info border-info/30", icon: CheckCircle2, label: "Completed" },
  expired: { color: "bg-destructive/20 text-destructive border-destructive/30", icon: AlertCircle, label: "Expired" },
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState(initialContracts)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState(null)

  const [formData, setFormData] = useState({
    property: "",
    buyer: "",
    buyerEmail: "",
    seller: "",
    sellerEmail: "",
    price: "",
    deposit: "",
    status: "draft",
    type: "Contract of Sale",
    expiryDate: "",
    settlementDate: "",
    specialConditions: "",
  })

  const resetForm = () => {
    setFormData({
      property: "",
      buyer: "",
      buyerEmail: "",
      seller: "",
      sellerEmail: "",
      price: "",
      deposit: "",
      status: "draft",
      type: "Contract of Sale",
      expiryDate: "",
      settlementDate: "",
      specialConditions: "",
    })
  }

  const handleCreate = () => {
    const newContract = {
      id: `CON-${String(contracts.length + 1).padStart(3, "0")}`,
      property: formData.property,
      buyer: formData.buyer || "TBC",
      buyerEmail: formData.buyerEmail,
      seller: formData.seller,
      sellerEmail: formData.sellerEmail,
      price: Number(formData.price),
      deposit: Number(formData.deposit) || Number(formData.price) * 0.1,
      status: formData.status,
      type: formData.type,
      created: new Date().toISOString().split("T")[0],
      expiryDate: formData.expiryDate || null,
      settlementDate: formData.settlementDate || null,
      specialConditions: formData.specialConditions,
    }
    setContracts([newContract, ...contracts])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!selectedContract) return
    setContracts(
      contracts.map((c) =>
        c.id === selectedContract.id
          ? {
            ...c,
            property: formData.property,
            buyer: formData.buyer || "TBC",
            buyerEmail: formData.buyerEmail,
            seller: formData.seller,
            sellerEmail: formData.sellerEmail,
            price: Number(formData.price),
            deposit: Number(formData.deposit),
            status: formData.status,
            type: formData.type,
            expiryDate: formData.expiryDate || null,
            settlementDate: formData.settlementDate || null,
            specialConditions: formData.specialConditions,
          }
          : c,
      ),
    )
    setIsEditOpen(false)
    setSelectedContract(null)
    resetForm()
  }

  const handleDelete = () => {
    if (!selectedContract) return
    setContracts(contracts.filter((c) => c.id !== selectedContract.id))
    setIsDeleteOpen(false)
    setSelectedContract(null)
  }

  const openView = (contract) => {
    setSelectedContract(contract)
    setIsViewOpen(true)
  }

  const openEdit = (contract) => {
    setSelectedContract(contract)
    setFormData({
      property: contract.property,
      buyer: contract.buyer === "TBC" ? "" : contract.buyer,
      buyerEmail: contract.buyerEmail,
      seller: contract.seller,
      sellerEmail: contract.sellerEmail,
      price: String(contract.price),
      deposit: String(contract.deposit),
      status: contract.status,
      type: contract.type,
      expiryDate: contract.expiryDate || "",
      settlementDate: contract.settlementDate || "",
      specialConditions: contract.specialConditions,
    })
    setIsEditOpen(true)
  }

  const openDelete = (contract) => {
    setSelectedContract(contract)
    setIsDeleteOpen(true)
  }

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearch =
      contract.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.seller.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: contracts.length,
    draft: contracts.filter((c) => c.status === "draft").length,
    pending: contracts.filter((c) => c.status === "pending-signature").length,
    executed: contracts.filter((c) => c.status === "executed").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Contract Management</h1>
          <p className="text-muted-foreground">Create and manage property contracts</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            resetForm()
            setIsCreateOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Generate Contract
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.draft}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending Signature</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.executed}</p>
                <p className="text-sm text-muted-foreground">Executed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Contracts</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search contracts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-secondary border-0"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-secondary border-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending-signature">Pending Signature</SelectItem>
                  <SelectItem value="executed">Executed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredContracts.map((contract) => {
              const config = statusConfig[contract.status]
              const Icon = config.icon
              return (
                <div key={contract.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm text-muted-foreground">{contract.id}</span>
                        <Badge variant="outline" className={cn("gap-1", config.color)}>
                          <Icon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">{contract.property}</h3>
                      <div className="grid gap-2 md:grid-cols-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Buyer: </span>
                          <span className="text-foreground">{contract.buyer}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Seller: </span>
                          <span className="text-foreground">{contract.seller}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">${contract.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(contract.created).toLocaleDateString("en-AU")}
                        </p>
                        {contract.expiryDate && (
                          <p className="text-xs text-muted-foreground">
                            Expires: {new Date(contract.expiryDate).toLocaleDateString("en-AU")}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openView(contract)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Contract
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(contract)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Contract
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Send for Signature
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => openDelete(contract)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Contract
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate New Contract</DialogTitle>
            <DialogDescription>Create a new property contract</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="property">Property Address</Label>
              <Input
                id="property"
                placeholder="42 Collins Street, Melbourne VIC 3000"
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seller">Seller Name</Label>
                <Input
                  id="seller"
                  placeholder="Seller name or company"
                  value={formData.seller}
                  onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellerEmail">Seller Email</Label>
                <Input
                  id="sellerEmail"
                  type="email"
                  placeholder="seller@email.com"
                  value={formData.sellerEmail}
                  onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="buyer">Buyer Name</Label>
                <Input
                  id="buyer"
                  placeholder="Buyer name (optional)"
                  value={formData.buyer}
                  onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerEmail">Buyer Email</Label>
                <Input
                  id="buyerEmail"
                  type="email"
                  placeholder="buyer@email.com"
                  value={formData.buyerEmail}
                  onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Purchase Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="850000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Deposit Amount ($)</Label>
                <Input
                  id="deposit"
                  type="number"
                  placeholder="85000 (10% default)"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Contract Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contract of Sale">Contract of Sale</SelectItem>
                    <SelectItem value="Lease Agreement">Lease Agreement</SelectItem>
                    <SelectItem value="Option Agreement">Option Agreement</SelectItem>
                    <SelectItem value="Agency Agreement">Agency Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending-signature">Pending Signature</SelectItem>
                    <SelectItem value="executed">Executed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Contract Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settlementDate">Settlement Date</Label>
                <Input
                  id="settlementDate"
                  type="date"
                  value={formData.settlementDate}
                  onChange={(e) => setFormData({ ...formData, settlementDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialConditions">Special Conditions</Label>
              <Textarea
                id="specialConditions"
                placeholder="Enter any special conditions..."
                rows={3}
                value={formData.specialConditions}
                onChange={(e) => setFormData({ ...formData, specialConditions: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.property || !formData.seller || !formData.price}>
              Generate Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Contract Details</DialogTitle>
            <DialogDescription>View complete contract information</DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{selectedContract.id}</span>
                  <Badge variant="outline" className={cn("gap-1", statusConfig[selectedContract.status].color)}>
                    {statusConfig[selectedContract.status].label}
                  </Badge>
                </div>
                <Badge variant="outline">{selectedContract.type}</Badge>
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg">
                <h3 className="text-lg font-semibold text-foreground mb-1">{selectedContract.property}</h3>
                <p className="text-2xl font-bold text-foreground">${selectedContract.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  Deposit: ${selectedContract.deposit.toLocaleString()} (
                  {((selectedContract.deposit / selectedContract.price) * 100).toFixed(0)}%)
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Seller</h4>
                  <p className="font-medium text-foreground">{selectedContract.seller}</p>
                  {selectedContract.sellerEmail && (
                    <p className="text-sm text-muted-foreground">{selectedContract.sellerEmail}</p>
                  )}
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Buyer</h4>
                  <p className="font-medium text-foreground">{selectedContract.buyer}</p>
                  {selectedContract.buyerEmail && (
                    <p className="text-sm text-muted-foreground">{selectedContract.buyerEmail}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedContract.created).toLocaleDateString("en-AU")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expiry Date</p>
                  <p className="font-medium text-foreground">
                    {selectedContract.expiryDate
                      ? new Date(selectedContract.expiryDate).toLocaleDateString("en-AU")
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Settlement Date</p>
                  <p className="font-medium text-foreground">
                    {selectedContract.settlementDate
                      ? new Date(selectedContract.settlementDate).toLocaleDateString("en-AU")
                      : "-"}
                  </p>
                </div>
              </div>

              {selectedContract.specialConditions && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Special Conditions</h4>
                  <p className="text-sm text-foreground p-3 bg-secondary/30 rounded-lg">
                    {selectedContract.specialConditions}
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button
              onClick={() => {
                setIsViewOpen(false)
                if (selectedContract) openEdit(selectedContract)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>Update contract details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-property">Property Address</Label>
              <Input
                id="edit-property"
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-seller">Seller Name</Label>
                <Input
                  id="edit-seller"
                  value={formData.seller}
                  onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sellerEmail">Seller Email</Label>
                <Input
                  id="edit-sellerEmail"
                  type="email"
                  value={formData.sellerEmail}
                  onChange={(e) => setFormData({ ...formData, sellerEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-buyer">Buyer Name</Label>
                <Input
                  id="edit-buyer"
                  value={formData.buyer}
                  onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-buyerEmail">Buyer Email</Label>
                <Input
                  id="edit-buyerEmail"
                  type="email"
                  value={formData.buyerEmail}
                  onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Purchase Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deposit">Deposit Amount ($)</Label>
                <Input
                  id="edit-deposit"
                  type="number"
                  value={formData.deposit}
                  onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Contract Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contract of Sale">Contract of Sale</SelectItem>
                    <SelectItem value="Lease Agreement">Lease Agreement</SelectItem>
                    <SelectItem value="Option Agreement">Option Agreement</SelectItem>
                    <SelectItem value="Agency Agreement">Agency Agreement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending-signature">Pending Signature</SelectItem>
                    <SelectItem value="executed">Executed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-expiryDate">Contract Expiry Date</Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-settlementDate">Settlement Date</Label>
                <Input
                  id="edit-settlementDate"
                  type="date"
                  value={formData.settlementDate}
                  onChange={(e) => setFormData({ ...formData, settlementDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-specialConditions">Special Conditions</Label>
              <Textarea
                id="edit-specialConditions"
                rows={3}
                value={formData.specialConditions}
                onChange={(e) => setFormData({ ...formData, specialConditions: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Contract</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contract? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedContract && (
            <div className="py-4">
              <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">{selectedContract.id}</span>
                  <Badge variant="outline" className={cn(statusConfig[selectedContract.status].color)}>
                    {statusConfig[selectedContract.status].label}
                  </Badge>
                </div>
                <p className="font-semibold text-foreground">{selectedContract.property}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedContract.seller} → {selectedContract.buyer}
                </p>
                <p className="font-medium text-foreground">${selectedContract.price.toLocaleString()}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
