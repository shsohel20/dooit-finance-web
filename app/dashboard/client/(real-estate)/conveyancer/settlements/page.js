"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Calendar,
  Clock,
  DollarSign,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  MapPin,
  CreditCard,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

const settlementStatusConfig = {
  scheduled: { color: "bg-info/20 text-info border-info/30", icon: Calendar },
  ready: { color: "bg-success/20 text-success border-success/30", icon: CheckCircle2 },
  "action-required": { color: "bg-warning/20 text-warning border-warning/30", icon: AlertCircle },
  completed: { color: "bg-muted text-muted-foreground border-muted", icon: CheckCircle2 },
}

const settlements = [
  {
    id: "SETT-001",
    matter: "MAT-2024-001",
    property: "42 Collins Street, Melbourne VIC 3000",
    client: "Robert Thompson",
    settlementDate: "2025-01-28",
    settlementTime: "11:00 AM",
    amount: 1250000,
    status: "scheduled",
    platform: "PEXA",
    tasks: { completed: 4, total: 6 },
  },
  {
    id: "SETT-002",
    matter: "MAT-2024-002",
    property: "18 Beach Road, Brighton VIC 3186",
    client: "Amanda Foster",
    settlementDate: "2025-02-15",
    settlementTime: "2:00 PM",
    amount: 3450000,
    status: "action-required",
    platform: "PEXA",
    tasks: { completed: 2, total: 5 },
  },
  {
    id: "SETT-003",
    matter: "MAT-2024-003",
    property: "7/125 Pitt Street, Sydney NSW 2000",
    client: "Chen Wei",
    settlementDate: "2024-12-20",
    settlementTime: "10:00 AM",
    amount: 890000,
    status: "completed",
    platform: "Sympli",
    tasks: { completed: 5, total: 5 },
  },
]

export default function SettlementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedSettlement, setSelectedSettlement] = useState(null)
  const [settlementTasks, setSettlementTasks] = useState({
    "SETT-001": [true, true, true, true, false, false],
    "SETT-002": [true, true, false, false, false],
    "SETT-003": [true, true, true, true, true],
  })

  const taskLabels = {
    "SETT-001": [
      "Verify title documents",
      "Confirm settlement figures",
      "Upload signed transfer",
      "Verify client identity",
      "Confirm bank details",
      "Final settlement review",
    ],
    "SETT-002": [
      "Verify title documents",
      "Confirm settlement figures",
      "Upload signed transfer",
      "Verify client identity",
      "Final settlement review",
    ],
    "SETT-003": [
      "Verify title documents",
      "Confirm settlement figures",
      "Upload signed transfer",
      "Verify client identity",
      "Final settlement review",
    ],
  }

  const filteredSettlements = settlements.filter((settlement) => {
    const matchesSearch =
      settlement.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
      settlement.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || settlement.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getDaysUntil = (date) => {
    const today = new Date()
    const settlement = new Date(date)
    return Math.ceil((settlement.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleViewSettlement = (settlement) => {
    setSelectedSettlement(settlement)
    setViewDialogOpen(true)
  }

  const handleTaskToggle = (settlementId, taskIndex) => {
    setSettlementTasks((prev) => {
      const tasks = [...(prev[settlementId] || [])]
      tasks[taskIndex] = !tasks[taskIndex]
      return { ...prev, [settlementId]: tasks }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Settlements</h1>
          <p className="text-muted-foreground">Manage e-conveyancing and settlements</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">PEXA</Button>
          <Button variant="outline">Sympli</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{settlements.length}</p>
                <p className="text-sm text-muted-foreground">Total Settlements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {settlements.filter((s) => s.status === "scheduled").length}
                </p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  {settlements.filter((s) => s.status === "action-required").length}
                </p>
                <p className="text-sm text-muted-foreground">Action Required</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">
                  ${settlements.reduce((acc, s) => acc + s.amount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Settlements</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search settlements..."
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="action-required">Action Required</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredSettlements.map((settlement) => {
              const config = settlementStatusConfig[settlement.status]
              const Icon = config.icon
              const daysUntil = getDaysUntil(settlement.settlementDate)

              return (
                <div key={settlement.id} className="rounded-lg border border-border bg-secondary/30 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-sm text-muted-foreground">{settlement.id}</span>
                        <Badge variant="outline" className={cn("gap-1 capitalize", config.color)}>
                          <Icon className="h-3 w-3" />
                          {settlement.status.replace("-", " ")}
                        </Badge>
                        <Badge variant="outline" className="bg-secondary">
                          {settlement.platform}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">{settlement.property}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          {settlement.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(settlement.settlementDate).toLocaleDateString("en-AU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          at {settlement.settlementTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">${settlement.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Tasks: {settlement.tasks.completed}/{settlement.tasks.total}
                        </p>
                      </div>
                      {settlement.status !== "completed" && (
                        <Badge
                          variant="outline"
                          className={cn(
                            daysUntil <= 7
                              ? "bg-destructive/20 text-destructive border-destructive/30"
                              : daysUntil <= 14
                                ? "bg-warning/20 text-warning border-warning/30"
                                : "bg-success/20 text-success border-success/30",
                          )}
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {daysUntil > 0 ? `${daysUntil} days` : "Today"}
                        </Badge>
                      )}
                      <Button variant="outline" size="icon" onClick={() => handleViewSettlement(settlement)}>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Settlement Details</span>
              {selectedSettlement && (
                <Badge variant="outline" className="ml-2 font-mono">
                  {selectedSettlement.id}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedSettlement && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        Property Details
                      </h4>
                      <p className="text-foreground">{selectedSettlement.property}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        Matter: {selectedSettlement.matter}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Client Information
                      </h4>
                      <p className="text-foreground">{selectedSettlement.client}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Settlement Schedule
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="text-foreground">
                            {new Date(selectedSettlement.settlementDate).toLocaleDateString("en-AU", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Time:</span>
                          <span className="text-foreground">{selectedSettlement.settlementTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Platform:</span>
                          <Badge variant="outline">{selectedSettlement.platform}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        Status
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "capitalize",
                          settlementStatusConfig[selectedSettlement.status]
                            .color,
                        )}
                      >
                        {selectedSettlement.status.replace("-", " ")}
                      </Badge>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground">
                            {selectedSettlement.tasks.completed}/{selectedSettlement.tasks.total} tasks
                          </span>
                        </div>
                        <Progress
                          value={(selectedSettlement.tasks.completed / selectedSettlement.tasks.total) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4 mt-4">
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                  <h4 className="font-medium mb-4">Settlement Checklist</h4>
                  <div className="space-y-3">
                    {(taskLabels[selectedSettlement.id] || []).map((task, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      >
                        <Checkbox
                          id={`task-${index}`}
                          checked={settlementTasks[selectedSettlement.id]?.[index] || false}
                          onCheckedChange={() => handleTaskToggle(selectedSettlement.id, index)}
                        />
                        <Label
                          htmlFor={`task-${index}`}
                          className={cn(
                            "flex-1 cursor-pointer",
                            settlementTasks[selectedSettlement.id]?.[index] && "line-through text-muted-foreground",
                          )}
                        >
                          {task}
                        </Label>
                        {settlementTasks[selectedSettlement.id]?.[index] && (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="space-y-4 mt-4">
                <div className="rounded-lg border border-border bg-secondary/30 p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-4">
                    <CreditCard className="h-4 w-4 text-primary" />
                    Financial Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Purchase Price</span>
                      <span className="font-semibold text-foreground">
                        ${selectedSettlement.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Deposit (10%)</span>
                      <span className="text-foreground">${(selectedSettlement.amount * 0.1).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Stamp Duty (Est.)</span>
                      <span className="text-foreground">
                        ${Math.round(selectedSettlement.amount * 0.055).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border">
                      <span className="text-muted-foreground">Legal Fees</span>
                      <span className="text-foreground">$1,850</span>
                    </div>
                    <div className="flex justify-between py-2 font-semibold">
                      <span className="text-foreground">Balance Due at Settlement</span>
                      <span className="text-primary text-lg">
                        $
                        {(
                          selectedSettlement.amount * 0.9 +
                          Math.round(selectedSettlement.amount * 0.055) +
                          1850
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedSettlement?.status !== "completed" && (
              <>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ExternalLink className="h-4 w-4" />
                  Open in {selectedSettlement?.platform}
                </Button>
                <Button>Proceed to Settlement</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
