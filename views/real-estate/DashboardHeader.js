"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Plus, FileText, Home, Users, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"


export default function RealEstateDashboardHeader() {
  const router = useRouter()
  const [createType, setCreateType] = useState(null)
  const [formData, setFormData] = useState({
    // Matter fields
    propertyAddress: "",
    matterType: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    purchasePrice: "",
    settlementDate: "",
    notes: "",
    // Listing fields
    listingType: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    // Client fields
    company: "",
    status: "",
    // Document fields
    documentName: "",
    documentType: "",
  })

  const handleCreate = (type) => {
    setCreateType(type)
    setFormData({
      propertyAddress: "",
      matterType: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      purchasePrice: "",
      settlementDate: "",
      notes: "",
      listingType: "",
      price: "",
      bedrooms: "",
      bathrooms: "",
      parking: "",
      company: "",
      status: "",
      documentName: "",
      documentType: "",
    })
  }

  const handleSubmit = () => {
    // In a real app, this would save to database
    // For now, navigate to the relevant page
    switch (createType) {
      case "matter":
        router.push("/conveyancer/matters")
        break
      case "listing":
        router.push("/agent/listings")
        break
      case "client":
        router.push("/agent/clients")
        break
      case "document":
        router.push("/client/documents")
        break
    }
    setCreateType(null)
  }

  const getDialogTitle = () => {
    switch (createType) {
      case "matter":
        return "Create New Matter"
      case "listing":
        return "Create New Property Listing"
      case "client":
        return "Create New Client"
      case "document":
        return "Create New Document"
      default:
        return ""
    }
  }

  const getDialogDescription = () => {
    switch (createType) {
      case "matter":
        return "Add a new conveyancing matter to the system."
      case "listing":
        return "Add a new property listing to the market."
      case "client":
        return "Add a new client to your CRM."
      case "document":
        return "Upload a new document to the system."
      default:
        return ""
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 bg-sidebar-bg   px-6">
        <SidebarTrigger className="-ml-2" />

        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search matters, properties, clients..." className="pl-9  border-0" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Plus className="h-4 w-4" />
                New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleCreate("matter")} className="cursor-pointer">
                <FileText className="mr-2 h-4 w-4" />
                New Matter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreate("listing")} className="cursor-pointer">
                <Home className="mr-2 h-4 w-4" />
                New Property Listing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreate("client")} className="cursor-pointer">
                <Users className="mr-2 h-4 w-4" />
                New Client
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreate("document")} className="cursor-pointer">
                <FolderOpen className="mr-2 h-4 w-4" />
                New Document
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-primary text-primary-foreground">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                onClick={() => router.push("/conveyancer/settlements")}
              >
                <span className="font-medium">Settlement Reminder</span>
                <span className="text-xs text-muted-foreground">MAT-2024-001 settles in 5 days</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                onClick={() => router.push("/client/documents")}
              >
                <span className="font-medium">Document Uploaded</span>
                <span className="text-xs text-muted-foreground">New inspection report for 42 Collins St</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                onClick={() => router.push("/compliance/aml")}
              >
                <span className="font-medium">Compliance Alert</span>
                <span className="text-xs text-muted-foreground">KYC verification required for Chen Wei</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-center justify-center text-primary cursor-pointer"
                onClick={() => router.push("/notifications")}
              >
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={createType !== null} onOpenChange={(open) => !open && setCreateType(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogDescription>{getDialogDescription()}</DialogDescription>
          </DialogHeader>

          {/* Matter Form */}
          {createType === "matter" && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="propertyAddress">Property Address *</Label>
                <Input
                  id="propertyAddress"
                  placeholder="Enter property address"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="matterType">Matter Type *</Label>
                  <Select
                    value={formData.matterType}
                    onValueChange={(value) => setFormData({ ...formData, matterType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">Purchase</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="refinance">Refinance</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="purchasePrice">Purchase Price</Label>
                  <Input
                    id="purchasePrice"
                    placeholder="$0.00"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="settlementDate">Settlement Date</Label>
                <Input
                  id="settlementDate"
                  type="date"
                  value={formData.settlementDate}
                  onChange={(e) => setFormData({ ...formData, settlementDate: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="clientName">Client Name *</Label>
                <Input
                  id="clientName"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="clientEmail">Client Email</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="clientPhone">Client Phone</Label>
                  <Input
                    id="clientPhone"
                    placeholder="+61 400 000 000"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Listing Form */}
          {createType === "listing" && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="propertyAddress">Property Address *</Label>
                <Input
                  id="propertyAddress"
                  placeholder="Enter property address"
                  value={formData.propertyAddress}
                  onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="listingType">Property Type *</Label>
                  <Select
                    value={formData.listingType}
                    onValueChange={(value) => setFormData({ ...formData, listingType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Listing Price *</Label>
                  <Input
                    id="price"
                    placeholder="$0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Select
                    value={formData.bedrooms}
                    onValueChange={(value) => setFormData({ ...formData, bedrooms: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select
                    value={formData.bathrooms}
                    onValueChange={(value) => setFormData({ ...formData, bathrooms: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parking">Parking</Label>
                  <Select
                    value={formData.parking}
                    onValueChange={(value) => setFormData({ ...formData, parking: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Description</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter property description..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Client Form */}
          {createType === "client" && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="clientName">Full Name *</Label>
                <Input
                  id="clientName"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Enter company name (optional)"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="clientPhone">Phone *</Label>
                  <Input
                    id="clientPhone"
                    placeholder="+61 400 000 000"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Client Type *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buyer">Buyer</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                    <SelectItem value="tenant">Tenant</SelectItem>
                    <SelectItem value="landlord">Landlord</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this client..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Document Form */}
          {createType === "document" && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="documentName">Document Name *</Label>
                <Input
                  id="documentName"
                  placeholder="Enter document name"
                  value={formData.documentName}
                  onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="documentType">Document Type *</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contract">Contract of Sale</SelectItem>
                    <SelectItem value="title">Title Search</SelectItem>
                    <SelectItem value="section32">Section 32</SelectItem>
                    <SelectItem value="inspection">Inspection Report</SelectItem>
                    <SelectItem value="finance">Finance Document</SelectItem>
                    <SelectItem value="legal">Legal Document</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Upload File</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Drag and drop your file here, or click to browse</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this document..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateType(null)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {createType === "matter" && "Create Matter"}
              {createType === "listing" && "Create Listing"}
              {createType === "client" && "Add Client"}
              {createType === "document" && "Upload Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
