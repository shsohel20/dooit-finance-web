"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RiskBadge } from "@/components/risk-badge";
import {
  Search,
  Filter,
  Clock,
  User,
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mockCases = [
  {
    id: "CASE-2024-001",
    subject: "PETROVA, Maria Ivanovna",
    riskTier: "critical",
    status: "pending_review",
    assignee: "John Doe",
    createdAt: "2024-01-15T10:30:00Z",
    slaDeadline: "2024-01-15T14:30:00Z",
    matchCount: 2,
    listTypes: ["OFAC SDN", "EU Consolidated"],
  },
  {
    id: "CASE-2024-002",
    subject: "CHEN, Wei Holdings Ltd",
    riskTier: "high",
    status: "in_progress",
    assignee: "Jane Smith",
    createdAt: "2024-01-15T09:15:00Z",
    slaDeadline: "2024-01-15T17:15:00Z",
    matchCount: 1,
    listTypes: ["UN Security Council"],
  },
  {
    id: "CASE-2024-003",
    subject: "AL-RASHID, Mohammed",
    riskTier: "high",
    status: "pending_approval",
    assignee: "John Doe",
    createdAt: "2024-01-15T08:00:00Z",
    slaDeadline: "2024-01-15T16:00:00Z",
    matchCount: 3,
    listTypes: ["OFAC SDN", "UK HMT", "PEP"],
  },
  {
    id: "CASE-2024-004",
    subject: "GLOBAL TRADING GMBH",
    riskTier: "medium",
    status: "pending_review",
    assignee: null,
    createdAt: "2024-01-14T16:45:00Z",
    slaDeadline: "2024-01-15T16:45:00Z",
    matchCount: 1,
    listTypes: ["Adverse Media"],
  },
  {
    id: "CASE-2024-005",
    subject: "KUMAR, Rajesh",
    riskTier: "medium",
    status: "pending_review",
    assignee: "Jane Smith",
    createdAt: "2024-01-14T14:20:00Z",
    slaDeadline: "2024-01-15T14:20:00Z",
    matchCount: 1,
    listTypes: ["PEP Database"],
  },
  {
    id: "CASE-2024-006",
    subject: "NOVAK, Peter",
    riskTier: "low",
    status: "pending_review",
    assignee: null,
    createdAt: "2024-01-14T11:00:00Z",
    slaDeadline: "2024-01-17T11:00:00Z",
    matchCount: 1,
    listTypes: ["PEP Database"],
  },
];

const statusConfig = {
  pending_review: { label: "Pending Review", className: "bg-slate-100 text-slate-700" },
  in_progress: { label: "In Progress", className: "bg-blue-100 text-blue-700" },
  pending_approval: { label: "Pending Approval", className: "bg-purple-100 text-purple-700" },
  resolved: { label: "Resolved", className: "bg-emerald-100 text-emerald-700" },
};

export function CaseQueue() {
  const [selectedCases, setSelectedCases] = useState([]);

  const toggleCase = (caseId) => {
    setSelectedCases((prev) =>
      prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId],
    );
  };

  const toggleAll = () => {
    setSelectedCases((prev) =>
      prev.length === mockCases.length ? [] : mockCases.map((c) => c.id),
    );
  };

  const getSlaStatus = (deadline) => {
    const now = new Date();
    const sla = new Date(deadline);
    const diff = sla.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 0) return { status: "breached", label: "SLA Breached", className: "text-red-600" };
    if (hours < 2)
      return { status: "critical", label: `${hours}h remaining`, className: "text-red-600" };
    if (hours < 8)
      return { status: "warning", label: `${hours}h remaining`, className: "text-amber-600" };
    return { status: "ok", label: `${hours}h remaining`, className: "text-muted-foreground" };
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Total Open</p>
          </CardContent>
        </Card>
        <Card className="border-red-200">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">2</div>
            <p className="text-sm text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-600">3</div>
            <p className="text-sm text-muted-foreground">Approaching SLA</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">Unassigned</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">2</div>
            <p className="text-sm text-muted-foreground">Pending Approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Case Queue</CardTitle>
            <div className="flex items-center gap-2">
              {selectedCases.length > 0 && (
                <>
                  <span className="text-sm text-muted-foreground">
                    {selectedCases.length} selected
                  </span>
                  <Button variant="outline" size="sm">
                    Bulk Assign
                  </Button>
                  <Button variant="outline" size="sm">
                    Bulk Action
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search cases..." className="pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Risk Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="me">Assigned to Me</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="w-10 p-3">
                    <Checkbox
                      checked={selectedCases.length === mockCases.length}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      Case ID
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    Subject
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">Risk</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">Lists</th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    Assignee
                  </th>
                  <th className="p-3 text-left text-sm font-medium text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                      SLA
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="w-10 p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockCases.map((caseItem) => {
                  const sla = getSlaStatus(caseItem.slaDeadline);
                  const status = statusConfig[caseItem.status];
                  return (
                    <tr key={caseItem.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedCases.includes(caseItem.id)}
                          onCheckedChange={() => toggleCase(caseItem.id)}
                        />
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-sm">{caseItem.id}</span>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{caseItem.subject}</div>
                        <div className="text-xs text-muted-foreground">
                          {caseItem.matchCount} match{caseItem.matchCount > 1 ? "es" : ""}
                        </div>
                      </td>
                      <td className="p-3">
                        <RiskBadge tier={caseItem.riskTier} />
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary" className={status.className}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {caseItem.listTypes.map((list, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {list}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        {caseItem.assignee ? (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs">
                              {caseItem.assignee
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <span className="text-sm">{caseItem.assignee}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className={`flex items-center gap-1 text-sm ${sla.className}`}>
                          <Clock className="h-3 w-3" />
                          {sla.label}
                        </div>
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              Assign to Me
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-emerald-600">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as False Positive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Escalate
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">Showing 1-6 of 12 cases</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
