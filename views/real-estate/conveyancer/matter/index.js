"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { matters as initialMatters } from "../../dashboard/dummyData"
import {
  Search,
  Plus,
  Filter,
  Calendar,
  DollarSign,
  User,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Circle,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  Building,
  Mail,
  Phone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"



const statusColors = {
  active: "bg-info/20 text-info border-info/30",
  pending: "bg-warning/20 text-warning border-warning/30",
  settled: "bg-success/20 text-success border-success/30",
  "on-hold": "bg-muted text-muted-foreground border-muted",
}

const typeColors = {
  purchase: "bg-primary/20 text-primary border-primary/30",
  sale: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  transfer: "bg-chart-3/20 text-chart-3 border-chart-3/30",
}

const defaultMatter = {
  propertyAddress: "",
  client: "",
  clientEmail: "",
  clientPhone: "",
  type: "purchase",
  status: "pending",
  purchasePrice: 0,
  settlementDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  conveyancer: "Sarah Mitchell",
  progress: 0,
  notes: "",
}

export default function Matters() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const [mattersList, setMattersList] = useState(initialMatters)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isViewOpen, setIsViewOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedMatter, setSelectedMatter] = useState(null)
  const [formData, setFormData] = useState(defaultMatter)

  const filteredMatters = mattersList.filter((matter) => {
    const matchesSearch =
      matter.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matter.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matter.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || matter.status === statusFilter
    const matchesType = typeFilter === "all" || matter.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const stats = {
    total: mattersList.length,
    active: mattersList.filter((m) => m.status === "active").length,
    pending: mattersList.filter((m) => m.status === "pending").length,
    settled: mattersList.filter((m) => m.status === "settled").length,
  }

  const handleCreate = () => {
    const newMatter = {
      ...formData,
      id: `MAT-${String(mattersList.length + 1).padStart(3, "0")}`,
      created: new Date().toISOString(),
      tasks: [
        {
          id: "1",
          name: "Initial Review",
          status: "pending",
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "2",
          name: "Title Search",
          status: "pending",
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: "3",
          name: "Contract Review",
          status: "pending",
          dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ],
    }
    setMattersList([newMatter, ...mattersList])
    setIsCreateOpen(false)
    setFormData(defaultMatter)
  }

  const handleEdit = () => {
    if (!selectedMatter) return
    setMattersList(mattersList.map((m) => (m.id === selectedMatter.id ? { ...m, ...formData } : m)))
    setIsEditOpen(false)
    setSelectedMatter(null)
    setFormData(defaultMatter)
  }

  const handleDelete = () => {
    if (!selectedMatter) return
    setMattersList(mattersList.filter((m) => m.id !== selectedMatter.id))
    setIsDeleteOpen(false)
    setSelectedMatter(null)
  }

  const openView = (matter) => {
    setSelectedMatter(matter)
    setIsViewOpen(true)
  }

  const openEdit = (matter) => {
    setSelectedMatter(matter)
    setFormData({
      propertyAddress: matter.propertyAddress,
      client: matter.client,
      clientEmail: matter.clientEmail,
      clientPhone: matter.clientPhone || "",
      type: matter.type,
      status: matter.status,
      purchasePrice: matter.purchasePrice,
      settlementDate: matter.settlementDate.split("T")[0],
      conveyancer: matter.conveyancer,
      progress: matter.progress,
      notes: matter.notes || "",
    })
    setIsEditOpen(true)
  }

  const openDelete = (matter) => {
    setSelectedMatter(matter)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Matter Management</h1>
          <p className="text-muted-foreground">Manage your conveyancing matters</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setFormData(defaultMatter)
            setIsCreateOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          New Matter
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Matters</p>
                <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
              </div>
              <div className="rounded-lg bg-primary/10 p-2">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold text-foreground">{stats.active}</p>
              </div>
              <div className="rounded-lg bg-info/10 p-2">
                <Clock className="h-5 w-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold text-foreground">{stats.pending}</p>
              </div>
              <div className="rounded-lg bg-warning/10 p-2">
                <Circle className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Settled</p>
                <p className="text-2xl font-semibold text-foreground">{stats.settled}</p>
              </div>
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Matters</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search matters..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="settled">Settled</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 bg-secondary border-0">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMatters.length === 0 ? (
              <div className="text-center py-12">
                <Building className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No matters found</h3>
                <p className="text-muted-foreground">Get started by creating a new matter.</p>
                <Button
                  className="mt-4"
                  onClick={() => {
                    setFormData(defaultMatter)
                    setIsCreateOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Matter
                </Button>
              </div>
            ) : (
              filteredMatters.map((matter) => (
                <div key={matter.id} className="rounded-lg border border-border bg-secondary/30 p-4 space-y-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm text-muted-foreground">{matter.id}</span>
                        <Badge variant="outline" className={cn("capitalize", statusColors[matter.status])}>
                          {matter.status}
                        </Badge>
                        <Badge variant="outline" className={cn("capitalize", typeColors[matter.type])}>
                          {matter.type}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">{matter.propertyAddress}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {matter.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Settlement:{" "}
                          {new Date(matter.settlementDate).toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">${matter.purchasePrice.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Assigned: {matter.conveyancer}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openView(matter)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/client/conveyancer/matters/${matter.id}`}>
                              <ArrowUpRight className="mr-2 h-4 w-4" />
                              Open Full View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => openEdit(matter)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Matter
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => openDelete(matter)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Matter
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{matter.progress}%</span>
                    </div>
                    <Progress value={matter.progress} className="h-2" />
                    <div className="flex items-center gap-2 flex-wrap pt-2">
                      {matter.tasks.slice(0, 4).map((task) => (
                        <Badge
                          key={task.id}
                          variant="outline"
                          className={cn(
                            "text-xs",
                            task.status === "completed" && "bg-success/10 text-success border-success/30",
                            task.status === "in-progress" && "bg-warning/10 text-warning border-warning/30",
                            task.status === "pending" && "bg-muted text-muted-foreground border-muted",
                          )}
                        >
                          {task.name}
                        </Badge>
                      ))}
                      {matter.tasks.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{matter.tasks.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Matter</DialogTitle>
            <DialogDescription>Enter the details for the new conveyancing matter.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Input
                id="propertyAddress"
                placeholder="123 Main Street, Sydney NSW 2000"
                value={formData.propertyAddress}
                onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Matter Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="settled">Settled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  placeholder="850000"
                  value={formData.purchasePrice || ""}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                />
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
            </div>
            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-medium mb-3">Client Details</h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="client">Client Name</Label>
                  <Input
                    id="client"
                    placeholder="John Smith"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="clientPhone">Phone</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      placeholder="0412 345 678"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="conveyancer">Assigned Conveyancer</Label>
              <Select
                value={formData.conveyancer}
                onValueChange={(value) => setFormData({ ...formData, conveyancer: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Mitchell">Sarah Mitchell</SelectItem>
                  <SelectItem value="James Wilson">James Wilson</SelectItem>
                  <SelectItem value="Emma Thompson">Emma Thompson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this matter..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!formData.propertyAddress || !formData.client}>
              Create Matter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">{selectedMatter?.id}</span>
              {selectedMatter && (
                <>
                  <Badge variant="outline" className={cn("capitalize", statusColors[selectedMatter.status])}>
                    {selectedMatter.status}
                  </Badge>
                  <Badge variant="outline" className={cn("capitalize", typeColors[selectedMatter.type])}>
                    {selectedMatter.type}
                  </Badge>
                </>
              )}
            </DialogTitle>
            <DialogDescription>{selectedMatter?.propertyAddress}</DialogDescription>
          </DialogHeader>
          {selectedMatter && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Purchase Price</span>
                  </div>
                  <p className="text-xl font-bold">${selectedMatter.purchasePrice.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">Settlement Date</span>
                  </div>
                  <p className="text-xl font-bold">
                    {new Date(selectedMatter.settlementDate).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{selectedMatter.progress}%</span>
                </div>
                <Progress value={selectedMatter.progress} className="h-3" />
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Client Information</h4>
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMatter.client}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedMatter.clientEmail}</span>
                  </div>
                  {selectedMatter.clientPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedMatter.clientPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Assigned Conveyancer</h4>
                <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span>{selectedMatter.conveyancer}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium mb-3">Tasks ({selectedMatter.tasks.length})</h4>
                <div className="space-y-2">
                  {selectedMatter.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between rounded-lg border border-border p-3"
                    >
                      <div className="flex items-center gap-3">
                        {task.status === "completed" && <CheckCircle2 className="h-4 w-4 text-success" />}
                        {task.status === "in-progress" && <Clock className="h-4 w-4 text-warning" />}
                        {task.status === "pending" && <Circle className="h-4 w-4 text-muted-foreground" />}
                        <span>{task.name}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize text-xs",
                          task.status === "completed" && "bg-success/10 text-success border-success/30",
                          task.status === "in-progress" && "bg-warning/10 text-warning border-warning/30",
                          task.status === "pending" && "bg-muted text-muted-foreground border-muted",
                        )}
                      >
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {selectedMatter.notes && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Notes</h4>
                  <p className="text-muted-foreground text-sm">{selectedMatter.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <Link href={`/conveyancer/matters/${selectedMatter?.id}`}>
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Open Full View
              </Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Matter</DialogTitle>
            <DialogDescription>Update the details for {selectedMatter?.id}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-propertyAddress">Property Address</Label>
              <Input
                id="edit-propertyAddress"
                value={formData.propertyAddress}
                onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-type">Matter Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="purchase">Purchase</SelectItem>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="settled">Settled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-purchasePrice">Purchase Price ($)</Label>
                <Input
                  id="edit-purchasePrice"
                  type="number"
                  value={formData.purchasePrice || ""}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: Number(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-settlementDate">Settlement Date</Label>
                <Input
                  id="edit-settlementDate"
                  type="date"
                  value={formData.settlementDate}
                  onChange={(e) => setFormData({ ...formData, settlementDate: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-progress">Progress (%)</Label>
                <Input
                  id="edit-progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) =>
                    setFormData({ ...formData, progress: Math.min(100, Math.max(0, Number(e.target.value))) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-conveyancer">Assigned Conveyancer</Label>
                <Select
                  value={formData.conveyancer}
                  onValueChange={(value) => setFormData({ ...formData, conveyancer: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Mitchell">Sarah Mitchell</SelectItem>
                    <SelectItem value="James Wilson">James Wilson</SelectItem>
                    <SelectItem value="Emma Thompson">Emma Thompson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-medium mb-3">Client Details</h4>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-client">Client Name</Label>
                  <Input
                    id="edit-client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-clientEmail">Email</Label>
                    <Input
                      id="edit-clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-clientPhone">Phone</Label>
                    <Input
                      id="edit-clientPhone"
                      type="tel"
                      value={formData.clientPhone}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
            <AlertDialogTitle>Delete Matter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete matter <span className="font-mono font-medium">{selectedMatter?.id}</span>
              ? This will permanently remove the matter for &quot;{selectedMatter?.propertyAddress}&quot; and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Matter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
