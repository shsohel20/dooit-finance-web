"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  MapPin,
  Bed,
  Bath,
  Car,
  Maximize2,
  Edit,
  Eye,
  MoreHorizontal,
  Building2,
  DollarSign,
  TrendingUp,
  Clock,
  Trash2,
  Upload,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { properties } from "@/views/real-estate/dashboard/dummyData"

const statusColors = {
  listed: "bg-success/20 text-success border-success/30",
  "under-contract": "bg-warning/20 text-warning border-warning/30",
  sold: "bg-muted text-muted-foreground border-muted",
  settlement: "bg-info/20 text-info border-info/30",
}


export default function ListingsPage() {
  const [listings, setListings] = useState(properties)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedListing, setSelectedListing] = useState(null)

  const [formData, setFormData] = useState({
    address: "",
    suburb: "",
    state: "VIC",
    postcode: "",
    price: "",
    bedrooms: "3",
    bathrooms: "2",
    parking: "1",
    landSize: "",
    type: "house",
    status: "listed",
    description: "",
  })

  const resetForm = () => {
    setFormData({
      address: "",
      suburb: "",
      state: "VIC",
      postcode: "",
      price: "",
      bedrooms: "3",
      bathrooms: "2",
      parking: "1",
      landSize: "",
      type: "house",
      status: "listed",
      description: "",
    })
  }

  const handleCreate = () => {
    const newListing = {
      id: `PROP-${String(listings.length + 1).padStart(3, "0")}`,
      address: formData.address,
      suburb: formData.suburb,
      state: formData.state,
      postcode: formData.postcode,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      parking: Number(formData.parking),
      landSize: Number(formData.landSize) || 0,
      type: formData.type,
      status: formData.status,
      image: "/modern-house-exterior.png",
      listingDate: new Date().toISOString().split("T")[0],
      description: formData.description,
    }
    setListings([newListing, ...listings])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!selectedListing) return
    setListings(
      listings.map((l) =>
        l.id === selectedListing.id
          ? {
            ...l,
            address: formData.address,
            suburb: formData.suburb,
            state: formData.state,
            postcode: formData.postcode,
            price: Number(formData.price),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            parking: Number(formData.parking),
            landSize: Number(formData.landSize) || 0,
            type: formData.type,
            status: formData.status,
            description: formData.description,
          }
          : l,
      ),
    )
    setIsEditOpen(false)
    setSelectedListing(null)
    resetForm()
  }

  const handleDelete = () => {
    if (!selectedListing) return
    setListings(listings.filter((l) => l.id !== selectedListing.id))
    setIsDeleteOpen(false)
    setSelectedListing(null)
  }

  const openView = (listing) => {
    setSelectedListing(listing)
    setIsViewOpen(true)
  }

  const openEdit = (listing) => {
    setSelectedListing(listing)
    setFormData({
      address: listing.address,
      suburb: listing.suburb,
      state: listing.state,
      postcode: listing.postcode,
      price: String(listing.price),
      bedrooms: String(listing.bedrooms),
      bathrooms: String(listing.bathrooms),
      parking: String(listing.parking),
      landSize: String(listing.landSize || ""),
      type: listing.type,
      status: listing.status,
      description: listing.description || "",
    })
    setIsEditOpen(true)
  }

  const openDelete = (listing) => {
    setSelectedListing(listing)
    setIsDeleteOpen(true)
  }

  const filteredListings = listings.filter((property) => {
    const matchesSearch =
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.suburb.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: listings.length,
    listed: listings.filter((p) => p.status === "listed").length,
    underContract: listings.filter((p) => p.status === "under-contract").length,
    sold: listings.filter((p) => p.status === "sold").length,
    totalValue: listings.reduce((acc, p) => acc + p.price, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Property Listings</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            resetForm()
            setIsCreateOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          New Listing
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Listings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.listed}</p>
                <p className="text-sm text-muted-foreground">Active</p>
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
                <p className="text-2xl font-semibold text-foreground">{stats.underContract}</p>
                <p className="text-sm text-muted-foreground">Under Contract</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <DollarSign className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">${(stats.totalValue / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Portfolio Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Listings</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search listings..."
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
                  <SelectItem value="listed">Listed</SelectItem>
                  <SelectItem value="under-contract">Under Contract</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="settlement">Settlement</SelectItem>
                </SelectContent>
              </Select>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v)}>
                <TabsList className="bg-secondary">
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredListings.map((property) => (
                <Card key={property.id} className="overflow-hidden bg-secondary/30 border-border group">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.address}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <Badge
                      className={cn("absolute top-3 left-3 capitalize", statusColors[property.status])}
                      variant="outline"
                    >
                      {property.status.replace("-", " ")}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 bg-background/50 hover:bg-background/80"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openView(property)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(property)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Listing
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => openDelete(property)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Listing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-xl font-bold text-foreground">${property.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{property.address}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.suburb}, {property.state} {property.postcode}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" /> {property.bedrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" /> {property.bathrooms}
                      </span>
                      <span className="flex items-center gap-1">
                        <Car className="h-4 w-4" /> {property.parking}
                      </span>
                      {property.landSize > 0 && (
                        <span className="flex items-center gap-1">
                          <Maximize2 className="h-4 w-4" /> {property.landSize}m²
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-xs text-muted-foreground">
                        Listed: {new Date(property.listingDate).toLocaleDateString("en-AU")}
                      </span>
                      <span className="text-xs font-medium text-primary capitalize">{property.type}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredListings.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-secondary/30 p-4"
                >
                  <div className="relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.address}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{property.address}</h3>
                      <Badge className={cn("capitalize", statusColors[property.status])} variant="outline">
                        {property.status.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {property.suburb}, {property.state} {property.postcode}
                    </p>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>{property.bedrooms} bed</span>
                      <span>{property.bathrooms} bath</span>
                      <span>{property.parking} car</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">${property.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      Listed {new Date(property.listingDate).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openView(property)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(property)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Listing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => openDelete(property)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Listing
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Listing</DialogTitle>
            <DialogDescription>Add a new property listing to your portfolio</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  placeholder="42 Collins Street"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suburb">Suburb</Label>
                <Input
                  id="suburb"
                  placeholder="Melbourne"
                  value={formData.suburb}
                  onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={formData.state} onValueChange={(v) => setFormData({ ...formData, state: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIC">VIC</SelectItem>
                    <SelectItem value="NSW">NSW</SelectItem>
                    <SelectItem value="QLD">QLD</SelectItem>
                    <SelectItem value="WA">WA</SelectItem>
                    <SelectItem value="SA">SA</SelectItem>
                    <SelectItem value="TAS">TAS</SelectItem>
                    <SelectItem value="NT">NT</SelectItem>
                    <SelectItem value="ACT">ACT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode</Label>
                <Input
                  id="postcode"
                  placeholder="3000"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="850000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Select value={formData.bedrooms} onValueChange={(v) => setFormData({ ...formData, bedrooms: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select value={formData.bathrooms} onValueChange={(v) => setFormData({ ...formData, bathrooms: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parking">Parking</Label>
                <Select value={formData.parking} onValueChange={(v) => setFormData({ ...formData, parking: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="landSize">Land Size (m²)</Label>
                <Input
                  id="landSize"
                  type="number"
                  placeholder="450"
                  value={formData.landSize}
                  onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
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
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listed">Listed</SelectItem>
                    <SelectItem value="under-contract">Under Contract</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="settlement">Settlement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter property description..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Property Images</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Drag and drop images here, or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.address || !formData.price}>
              Create Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listing Details</DialogTitle>
            <DialogDescription>View complete property information</DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="space-y-6">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={selectedListing.image || "/placeholder.svg"}
                  alt={selectedListing.address}
                  fill
                  className="object-cover"
                />
                <Badge
                  className={cn("absolute top-3 left-3 capitalize", statusColors[selectedListing.status])}
                  variant="outline"
                >
                  {selectedListing.status.replace("-", " ")}
                </Badge>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">{selectedListing.address}</h3>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {selectedListing.suburb}, {selectedListing.state} {selectedListing.postcode}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold text-foreground">${selectedListing.price.toLocaleString()}</p>
                <Badge variant="outline" className="capitalize">
                  {selectedListing.type}
                </Badge>
              </div>
              <div className="grid grid-cols-4 gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="text-center">
                  <Bed className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-semibold">{selectedListing.bedrooms}</p>
                  <p className="text-xs text-muted-foreground">Bedrooms</p>
                </div>
                <div className="text-center">
                  <Bath className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-semibold">{selectedListing.bathrooms}</p>
                  <p className="text-xs text-muted-foreground">Bathrooms</p>
                </div>
                <div className="text-center">
                  <Car className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-semibold">{selectedListing.parking}</p>
                  <p className="text-xs text-muted-foreground">Parking</p>
                </div>
                <div className="text-center">
                  <Maximize2 className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                  <p className="text-lg font-semibold">{selectedListing.landSize || "-"}</p>
                  <p className="text-xs text-muted-foreground">m²</p>
                </div>
              </div>
              {selectedListing.description && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedListing.description}</p>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                <span>ID: {selectedListing.id}</span>
                <span>Listed: {new Date(selectedListing.listingDate).toLocaleDateString("en-AU")}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setIsViewOpen(false)
                if (selectedListing) openEdit(selectedListing)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Listing</DialogTitle>
            <DialogDescription>Update property listing details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-address">Street Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-suburb">Suburb</Label>
                <Input
                  id="edit-suburb"
                  value={formData.suburb}
                  onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="edit-state">State</Label>
                <Select value={formData.state} onValueChange={(v) => setFormData({ ...formData, state: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VIC">VIC</SelectItem>
                    <SelectItem value="NSW">NSW</SelectItem>
                    <SelectItem value="QLD">QLD</SelectItem>
                    <SelectItem value="WA">WA</SelectItem>
                    <SelectItem value="SA">SA</SelectItem>
                    <SelectItem value="TAS">TAS</SelectItem>
                    <SelectItem value="NT">NT</SelectItem>
                    <SelectItem value="ACT">ACT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-postcode">Postcode</Label>
                <Input
                  id="edit-postcode"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price ($)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bedrooms">Bedrooms</Label>
                <Select value={formData.bedrooms} onValueChange={(v) => setFormData({ ...formData, bedrooms: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-bathrooms">Bathrooms</Label>
                <Select value={formData.bathrooms} onValueChange={(v) => setFormData({ ...formData, bathrooms: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-parking">Parking</Label>
                <Select value={formData.parking} onValueChange={(v) => setFormData({ ...formData, parking: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-landSize">Land Size (m²)</Label>
                <Input
                  id="edit-landSize"
                  type="number"
                  value={formData.landSize}
                  onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Property Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger>
                    <SelectValue />
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
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listed">Listed</SelectItem>
                    <SelectItem value="under-contract">Under Contract</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="settlement">Settlement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            <DialogTitle>Delete Listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedListing && (
            <div className="py-4">
              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                <div className="relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={selectedListing.image || "/placeholder.svg"}
                    alt={selectedListing.address}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selectedListing.address}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedListing.suburb}, {selectedListing.state}
                  </p>
                  <p className="text-sm font-medium text-foreground">${selectedListing.price.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Listing
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
