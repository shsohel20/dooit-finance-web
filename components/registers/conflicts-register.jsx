"use client";
import React from "react";
import { useState } from "react";
import { Search, Plus, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConflictDeclarationDialog } from "./conflict-declaration-dialog";

const mockDeclarations = [
  {
    id: "FIDEC-2024089",
    fullName: "Michael Thompson",
    positionDepartment: "Senior Relationship Manager - Corporate Banking",
    entityType: "banking",
    declarationType: "gift",
    dateOffered: "2024-10-15",
    dateDeclared: "2024-10-16",
    providerSubject: "ABC Corporation Ltd",
    descriptionOfInterest:
      "Luxury hamper valued at $450 received during client appreciation event",
    estimatedValue: 450,
    businessContext:
      "Long-standing corporate client; gift received at annual appreciation dinner",
    managerDecision: "approve",
    approverManager: "Chief Risk Officer",
    actionTaken: "Approved - within policy threshold; recorded in register",
    finalOutcome: "Gift retained; no conflict identified",
    status: "approved",
  },
  {
    id: "ACCDEC-2024112",
    fullName: "Sarah Chen",
    positionDepartment: "Tax Partner",
    entityType: "accounting",
    declarationType: "conflict-of-interest",
    dateOffered: "2024-10-20",
    dateDeclared: "2024-10-20",
    providerSubject: "TechStart Pty Ltd",
    descriptionOfInterest: "Spouse is CFO of prospective audit client",
    businessContext:
      "New business opportunity; potential audit engagement worth $180k annually",
    typeOfConflict: "actual",
    conflictRisk: "high",
    managerDecision: "manage",
    approverManager: "Managing Partner",
    dateReviewedByBoard: "2024-10-25",
    actionTaken:
      "Managed - Partner recused from engagement; alternative partner assigned",
    finalOutcome:
      "Conflict managed through assignment to different partner; client accepted arrangement",
    status: "managed",
  },
  {
    id: "LAWDEC-2024098",
    fullName: "James Rodriguez",
    positionDepartment: "Senior Associate - Property Law",
    entityType: "legal",
    declarationType: "hospitality",
    dateOffered: "2024-10-18",
    dateDeclared: "2024-10-19",
    providerSubject: "Premier Property Developers",
    descriptionOfInterest:
      "Invitation to corporate box at AFL Grand Final (value $800)",
    estimatedValue: 800,
    businessContext:
      "Major client; invitation extended to multiple law firms they work with",
    managerDecision: "reject",
    approverManager: "Managing Partner",
    actionTaken:
      "Declined - exceeds hospitality threshold; potential perception of influence",
    finalOutcome:
      "Invitation politely declined; client relationship maintained",
    status: "rejected",
  },
  {
    id: "REDEC-2024145",
    fullName: "Emma Wilson",
    positionDepartment: "Sales Agent",
    entityType: "real-estate",
    declarationType: "conflict-of-interest",
    dateOffered: "2024-10-22",
    dateDeclared: "2024-10-22",
    providerSubject: "Personal Property Investment",
    descriptionOfInterest:
      "Considering purchasing investment property in area where I list properties",
    businessContext:
      "Personal investment decision; potential conflict with client interests",
    typeOfConflict: "potential",
    conflictRisk: "medium",
    managerDecision: "manage",
    approverManager: "Sales Director",
    actionTaken:
      "Managed - Must disclose to all clients in area; cannot represent own property transactions",
    finalOutcome: "Ongoing management; quarterly review required",
    status: "managed",
  },
  {
    id: "PMDEC-2024067",
    fullName: "David Kim",
    positionDepartment: "Store Manager - Sydney",
    entityType: "precious-metals",
    declarationType: "gift",
    dateOffered: "2024-10-10",
    dateDeclared: "2024-10-11",
    providerSubject: "High-value customer",
    descriptionOfInterest:
      "Gold coin valued at $2,500 offered as 'thank you' for service",
    estimatedValue: 2500,
    businessContext:
      "Customer attempted to gift gold coin after large bullion purchase",
    managerDecision: "reject",
    approverManager: "National Operations Manager",
    actionTaken:
      "Declined immediately - significantly exceeds policy; potential bribery concern",
    finalOutcome:
      "Gift refused; customer educated on policy; transaction reviewed for suspicious activity",
    status: "rejected",
  },
  {
    id: "FIDEC-2024156",
    fullName: "Lisa Anderson",
    positionDepartment: "Compliance Officer",
    entityType: "banking",
    declarationType: "donation",
    dateOffered: "2024-10-25",
    dateDeclared: "2024-10-25",
    providerSubject: "Industry Association",
    descriptionOfInterest:
      "Offered sponsorship of $5,000 for charity run participation",
    estimatedValue: 5000,
    businessContext:
      "Banking industry association offering to sponsor employee charity participation",
    managerDecision: "donate",
    approverManager: "Chief Compliance Officer",
    actionTaken:
      "Accepted - donation made directly to charity; no personal benefit",
    finalOutcome: "Sponsorship accepted; funds donated to registered charity",
    status: "approved",
  },
  {
    id: "ACCDEC-2024178",
    fullName: "Robert Taylor",
    positionDepartment: "Audit Manager",
    entityType: "accounting",
    declarationType: "conflict-of-interest",
    dateOffered: "2024-10-28",
    dateDeclared: "2024-10-28",
    providerSubject: "Family Business",
    descriptionOfInterest: "Brother owns business that is client of the firm",
    businessContext: "Family member's business seeking audit services",
    typeOfConflict: "actual",
    conflictRisk: "high",
    managerDecision: "manage",
    approverManager: "Managing Partner",
    dateReviewedByBoard: "2024-11-02",
    actionTaken:
      "Managed - Complete recusal from engagement; independent partner assigned",
    finalOutcome: "Conflict managed; ongoing monitoring required",
    status: "managed",
  },
  {
    id: "LAWDEC-2024189",
    fullName: "Olivia Martinez",
    positionDepartment: "Partner - Commercial Law",
    entityType: "legal",
    declarationType: "hospitality",
    dateOffered: "2024-10-30",
    dateDeclared: "2024-10-30",
    providerSubject: "Global Tech Corp",
    descriptionOfInterest:
      "Invitation to international conference in Singapore (flights, accommodation, $12,000 value)",
    estimatedValue: 12000,
    businessContext:
      "Major client hosting annual legal conference; educational content",
    managerDecision: "approve",
    approverManager: "Managing Partner",
    dateReviewedByBoard: "2024-11-05",
    actionTaken:
      "Approved - Legitimate business development; educational value; disclosed to board",
    finalOutcome:
      "Attendance approved with conditions; detailed report required post-conference",
    status: "approved",
  },
];

export function ConflictsRegister() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedDeclaration, setSelectedDeclaration] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredDeclarations = mockDeclarations.filter((declaration) => {
    const matchesSearch =
      declaration.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      declaration.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      declaration.providerSubject
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || declaration.declarationType === typeFilter;
    const matchesStatus =
      statusFilter === "all" || declaration.status === statusFilter;
    const matchesRisk =
      riskFilter === "all" || declaration.conflictRisk === riskFilter;

    return matchesSearch && matchesType && matchesStatus && matchesRisk;
  });

  const stats = {
    total: mockDeclarations.length,
    highRisk: mockDeclarations.filter((d) => d.conflictRisk === "high").length,
    pending: mockDeclarations.filter((d) => d.status === "pending").length,
    managed: mockDeclarations.filter((d) => d.status === "managed").length,
  };

  const getTypeBadge = (type) => {
    const colors = {
      gift: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      hospitality:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      donation:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "conflict-of-interest":
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };

    return (
      <Badge className={colors[type]}>
        {type === "conflict-of-interest"
          ? "Conflict"
          : type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      managed: "outline",
      archived: "outline",
    };

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRiskBadge = (risk) => {
    if (!risk) return null;

    const colors = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return <Badge className={colors[risk]}>{risk.toUpperCase()} RISK</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Declarations</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>High Risk Conflicts</CardDescription>
            <CardTitle className="text-3xl text-destructive">
              {stats.highRisk}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Review</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Managed Conflicts</CardDescription>
            <CardTitle className="text-3xl">{stats.managed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Conflicts of Interest & Benefits Register</CardTitle>
              <CardDescription>
                Centralized tracking of gifts, hospitality, donations, and
                conflicts of interest
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSelectedDeclaration(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Declaration
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, ID, or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="gift">Gift</SelectItem>
                <SelectItem value="hospitality">Hospitality</SelectItem>
                <SelectItem value="donation">Donation</SelectItem>
                <SelectItem value="conflict-of-interest">
                  Conflict of Interest
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="managed">Managed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Declaration ID</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Provider/Subject</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Date Declared</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeclarations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      No declarations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeclarations.map((declaration) => (
                    <TableRow
                      key={declaration.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedDeclaration(declaration);
                        setDialogOpen(true);
                      }}
                    >
                      <TableCell className="font-medium">
                        {declaration.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {declaration.fullName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {declaration.positionDepartment}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(declaration.declarationType)}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {declaration.providerSubject}
                      </TableCell>
                      <TableCell>
                        {declaration.estimatedValue ? (
                          <span className="font-medium">
                            ${declaration.estimatedValue.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {getRiskBadge(declaration.conflictRisk)}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          declaration.dateDeclared
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(declaration.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Declaration Detail Dialog */}
      <ConflictDeclarationDialog
        declaration={selectedDeclaration}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
