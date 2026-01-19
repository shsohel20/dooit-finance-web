"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Plus,
  FileText,
  Download,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Building,
} from "lucide-react"
import { cn } from "@/lib/utils"



const initialTitleSearches = [
  {
    id: "TS-001",
    property: "42 Collins Street, Melbourne VIC 3000",
    titleRef: "Vol 12345 Fol 678",
    status: "completed",
    type: "Full Title Search",
    requestedDate: "2024-12-16",
    completedDate: "2024-12-16",
    cost: 35.0,
    matter: "MAT-2024-001",
    notes: "Standard search completed without issues",
    searchResults: "No encumbrances found. Clear title.",
  },
  {
    id: "TS-002",
    property: "18 Beach Road, Brighton VIC 3186",
    titleRef: "Vol 54321 Fol 987",
    status: "pending",
    type: "Full Title Search",
    requestedDate: "2024-12-20",
    completedDate: null,
    cost: 35.0,
    matter: "MAT-2024-002",
    notes: "Awaiting results from Land Registry",
  },
  {
    id: "TS-003",
    property: "7/125 Pitt Street, Sydney NSW 2000",
    titleRef: "SP 45678",
    status: "completed",
    type: "Strata Search",
    requestedDate: "2024-10-15",
    completedDate: "2024-10-15",
    cost: 45.0,
    matter: "MAT-2024-003",
    notes: "Strata plan search completed",
    searchResults: "Body corporate fees up to date. No special levies pending.",
  },
  {
    id: "TS-004",
    property: "156 Main Street, Southbank VIC 3006",
    titleRef: "Vol 78901 Fol 234",
    status: "warning",
    type: "Full Title Search",
    requestedDate: "2024-12-22",
    completedDate: "2024-12-22",
    cost: 35.0,
    matter: "MAT-2024-004",
    notes: "Encumbrance detected - mortgage registered",
    searchResults: "Active mortgage registered to ANZ Bank. Caveat lodged by previous owner.",
  },
]

const statusConfig = {
  completed: { color: "bg-success/20 text-success border-success/30", icon: CheckCircle2, label: "Completed" },
  pending: { color: "bg-warning/20 text-warning border-warning/30", icon: Clock, label: "Pending" },
  warning: {
    color: "bg-destructive/20 text-destructive border-destructive/30",
    icon: AlertTriangle,
    label: "Requires Review",
  },
}

const searchTypes = [
  "Full Title Search",
  "Strata Search",
  "Company Title Search",
  "Historical Search",
  "Dealing Search",
  "Plan Search",
]

export default function TitleSearch() {
  const [searches, setSearches] = useState(initialTitleSearches)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedSearch, setSelectedSearch] = useState(null)

  const [formData, setFormData] = useState({
    property: "",
    titleRef: "",
    type: "Full Title Search",
    matter: "",
    notes: "",
    status: "pending",
    searchResults: "",
  })

  const resetForm = () => {
    setFormData({
      property: "",
      titleRef: "",
      type: "Full Title Search",
      matter: "",
      notes: "",
      status: "pending",
      searchResults: "",
    })
  }

  const handleCreate = () => {
    const newSearch = {
      id: `TS-${String(searches.length + 1).padStart(3, "0")}`,
      property: formData.property,
      titleRef: formData.titleRef,
      status: "pending",
      type: formData.type,
      requestedDate: new Date().toISOString().split("T")[0],
      completedDate: null,
      cost: formData.type === "Strata Search" ? 45.0 : formData.type === "Historical Search" ? 55.0 : 35.0,
      matter: formData.matter,
      notes: formData.notes,
    }
    setSearches([newSearch, ...searches])
    setIsCreateOpen(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!selectedSearch) return
    const updatedSearches = searches.map((s) =>
      s.id === selectedSearch.id
        ? {
          ...s,
          property: formData.property,
          titleRef: formData.titleRef,
          type: formData.type,
          matter: formData.matter,
          notes: formData.notes,
          status: formData.status,
          searchResults: formData.searchResults,
          completedDate:
            formData.status === "completed" && !s.completedDate
              ? new Date().toISOString().split("T")[0]
              : s.completedDate,
        }
        : s,
    )
    setSearches(updatedSearches)
    setIsEditOpen(false)
    setSelectedSearch(null)
    resetForm()
  }

  const handleDelete = () => {
    if (!selectedSearch) return
    setSearches(searches.filter((s) => s.id !== selectedSearch.id))
    setIsDeleteOpen(false)
    setSelectedSearch(null)
  }

  const openView = (search) => {
    setSelectedSearch(search)
    setIsViewOpen(true)
  }

  const openEdit = (search) => {
    setSelectedSearch(search)
    setFormData({
      property: search.property,
      titleRef: search.titleRef,
      type: search.type,
      matter: search.matter,
      notes: search.notes || "",
      status: search.status,
      searchResults: search.searchResults || "",
    })
    setIsEditOpen(true)
  }

  const openDelete = (search) => {
    setSelectedSearch(search)
    setIsDeleteOpen(true)
  }

  // Filter searches
  const filteredSearches = searches.filter((search) => {
    const matchesQuery =
      search.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      search.titleRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      search.matter.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || search.status === statusFilter
    return matchesQuery && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Title Searches</h1>
          <p className="text-muted-foreground">Request and manage title searches</p>
        </div>
        <Button className="gap-2" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          New Search
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
                <p className="text-2xl font-semibold text-foreground">{searches.length}</p>
                <p className="text-sm text-muted-foreground">Total Searches</p>
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
                <p className="text-2xl font-semibold text-foreground">
                  {searches.filter((s) => s.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
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
                <p className="text-2xl font-semibold text-foreground">
                  {searches.filter((s) => s.status === "pending").length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-destructive/10 p-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {searches.filter((s) => s.status === "warning").length}
                </p>
                <p className="text-sm text-muted-foreground">Requires Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Search History</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by property or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-secondary border-0"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-secondary border-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="warning">Requires Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Property</TableHead>
                <TableHead>Title Reference</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSearches.map((search) => {
                const config = statusConfig[search.status]
                const Icon = config.icon
                return (
                  <TableRow key={search.id} className="border-border">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{search.property}</p>
                        <p className="text-xs text-muted-foreground">{search.matter}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">{search.titleRef}</TableCell>
                    <TableCell className="text-muted-foreground">{search.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1 capitalize", config.color)}>
                        <Icon className="h-3 w-3" />
                        {search.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(search.requestedDate).toLocaleDateString("en-AU")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">${search.cost.toFixed(2)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openView(search)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(search)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Search
                          </DropdownMenuItem>
                          {search.status === "completed" && (
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download Report
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View in Registry
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => openDelete(search)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Search
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              New Title Search
            </DialogTitle>
            <DialogDescription>Request a new title search from the land registry.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="property">Property Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="property"
                  placeholder="Enter full property address"
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="titleRef">Title Reference</Label>
                <Input
                  id="titleRef"
                  placeholder="Vol/Fol or SP number"
                  value={formData.titleRef}
                  onChange={(e) => setFormData({ ...formData, titleRef: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Search Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {searchTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="matter">Related Matter</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="matter"
                  placeholder="MAT-2024-XXX"
                  value={formData.matter}
                  onChange={(e) => setFormData({ ...formData, matter: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any special instructions or notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Estimated Cost: </span>$
                {formData.type === "Strata Search"
                  ? "45.00"
                  : formData.type === "Historical Search"
                    ? "55.00"
                    : "35.00"}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.property || !formData.titleRef}>
              Submit Search Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Title Search Details
            </DialogTitle>
            <DialogDescription>
              {selectedSearch?.id} - {selectedSearch?.type}
            </DialogDescription>
          </DialogHeader>
          {selectedSearch && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline" className={cn("gap-1", statusConfig[selectedSearch.status].color)}>
                  {React.createElement(statusConfig[selectedSearch.status].icon, { className: "h-3 w-3" })}
                  {statusConfig[selectedSearch.status].label}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Property Address</p>
                  <p className="font-medium text-foreground">{selectedSearch.property}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Title Reference</p>
                    <p className="font-mono text-sm text-foreground">{selectedSearch.titleRef}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Related Matter</p>
                    <p className="font-medium text-foreground">{selectedSearch.matter}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Requested Date</p>
                    <p className="text-foreground">
                      {new Date(selectedSearch.requestedDate).toLocaleDateString("en-AU")}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Completed Date</p>
                    <p className="text-foreground">
                      {selectedSearch.completedDate
                        ? new Date(selectedSearch.completedDate).toLocaleDateString("en-AU")
                        : "Pending"}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Cost</p>
                  <p className="text-lg font-semibold text-foreground">${selectedSearch.cost.toFixed(2)}</p>
                </div>
                {selectedSearch.notes && (
                  <div className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-foreground">{selectedSearch.notes}</p>
                  </div>
                )}
                {selectedSearch.searchResults && (
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground mb-1">Search Results</p>
                    <p className="text-foreground">{selectedSearch.searchResults}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            {selectedSearch?.status === "completed" && (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              Edit Title Search
            </DialogTitle>
            <DialogDescription>Update the title search details for {selectedSearch?.id}.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-property">Property Address</Label>
              <Input
                id="edit-property"
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-titleRef">Title Reference</Label>
                <Input
                  id="edit-titleRef"
                  value={formData.titleRef}
                  onChange={(e) => setFormData({ ...formData, titleRef: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Search Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {searchTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-matter">Related Matter</Label>
                <Input
                  id="edit-matter"
                  value={formData.matter}
                  onChange={(e) => setFormData({ ...formData, matter: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="warning">Requires Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-results">Search Results</Label>
              <Textarea
                id="edit-results"
                placeholder="Enter search findings..."
                value={formData.searchResults}
                onChange={(e) => setFormData({ ...formData, searchResults: e.target.value })}
                rows={3}
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

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Title Search</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the title search for{" "}
              <span className="font-medium text-foreground">{selectedSearch?.property}</span>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
