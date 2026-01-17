"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Plus,
  Users,
  UserCheck,
  UserCheck as UserClock,
  DollarSign,
  Mail,
  Phone,
  MoreHorizontal,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"

const clients = [
  {
    id: "client-001",
    name: "Robert Thompson",
    email: "r.thompson@email.com",
    phone: "0412 345 678",
    status: "active",
    type: "buyer",
    budget: 1500000,
    interestedIn: ["apartment", "house"],
    lastContact: "2024-12-22",
    enquiries: 5,
  },
  {
    id: "client-002",
    name: "Amanda Foster",
    email: "a.foster@email.com",
    phone: "0423 456 789",
    status: "active",
    type: "seller",
    budget: 3500000,
    interestedIn: ["house"],
    lastContact: "2024-12-20",
    enquiries: 3,
  },
  {
    id: "client-003",
    name: "Chen Wei",
    email: "c.wei@email.com",
    phone: "0434 567 890",
    status: "completed",
    type: "buyer",
    budget: 900000,
    interestedIn: ["apartment"],
    lastContact: "2024-12-18",
    enquiries: 8,
  },
  {
    id: "client-004",
    name: "Sarah Johnson",
    email: "s.johnson@email.com",
    phone: "0445 678 901",
    status: "lead",
    type: "buyer",
    budget: 750000,
    interestedIn: ["apartment", "land"],
    lastContact: "2024-12-15",
    enquiries: 2,
  },
  {
    id: "client-005",
    name: "Michael Park",
    email: "m.park@email.com",
    phone: "0456 789 012",
    status: "inactive",
    type: "investor",
    budget: 5000000,
    interestedIn: ["commercial", "apartment"],
    lastContact: "2024-11-28",
    enquiries: 12,
  },
]

const statusConfig = {
  active: { color: "bg-success/20 text-success border-success/30", icon: UserCheck },
  lead: { color: "bg-info/20 text-info border-info/30", icon: UserClock },
  completed: { color: "bg-muted text-muted-foreground border-muted", icon: UserCheck },
  inactive: { color: "bg-warning/20 text-warning border-warning/30", icon: UserClock },
}

const typeColors = {
  buyer: "bg-primary/20 text-primary border-primary/30",
  seller: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  investor: "bg-chart-3/20 text-chart-3 border-chart-3/30",
}

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    leads: clients.filter((c) => c.status === "lead").length,
    totalBudget: clients.reduce((acc, c) => acc + c.budget, 0),
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Client Management</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Client
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <UserClock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stats.leads}</p>
                <p className="text-sm text-muted-foreground">New Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">${(stats.totalBudget / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-muted-foreground">Combined Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Clients</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 bg-secondary border-0"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead>Client</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Last Contact</TableHead>
                <TableHead>Enquiries</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => {
                const config = statusConfig[client.status]
                return (
                  <TableRow key={client.id} className="border-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{client.name}</p>
                          <p className="text-xs text-muted-foreground">{client.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("capitalize", typeColors[client.type])}>
                        {client.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("capitalize", config.color)}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">${client.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(client.lastContact).toLocaleDateString("en-AU")}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{client.enquiries}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit Client</DropdownMenuItem>
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
    </div>
  )
}
