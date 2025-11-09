"use client";
import React from "react";
import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Clock,
  AlertTriangle,
} from "lucide-react";
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
import { ExternalRequestDialog } from "./external-request-dialog";

// Mock data for different entity types
const mockExternalRequests = [
  {
    id: "FIER-2024089",
    referenceNumber: "AUSTRAC-S49-2024-1234",
    category: "Section 49 AUSTRAC Request",
    entityType: "banking",
    requestingAgency: "AUSTRAC",
    requestingOfficer: "Senior Analyst James Wilson - 02 9950 0055",
    dateReceived: "2024-11-01",
    legalDeadline: "2024-11-15",
    scopeOfRequest:
      "All transaction records and account statements for customer CUST88945 from Jan 2023 to present",
    officerAssigned: "Chief Compliance Officer",
    tippingOffRisk: "high",
    actionsTakenToPreventTippingOff:
      "Information gathered without customer contact; restricted access to case file; no account alerts triggered",
    informationDelivered:
      "Complete transaction history, account statements, and CDD documentation",
    dateDelivered: "2024-11-12",
    deliveryMethod: "Secure AUSTRAC portal upload",
    internalApprover: "Chief Risk Officer",
    status: "completed",
  },
  {
    id: "ACCER-2024112",
    referenceNumber: "ATO-PROD-2024-5678",
    category: "ATO Production Order",
    entityType: "accounting",
    requestingAgency: "Australian Taxation Office",
    requestingOfficer: "Tax Investigator Sarah Chen - 1300 139 051",
    dateReceived: "2024-11-05",
    legalDeadline: "2024-11-19",
    scopeOfRequest:
      "All tax preparation files and supporting documents for client ABC Pty Ltd (ABN 12 345 678 901)",
    officerAssigned: "Managing Partner",
    tippingOffRisk: "medium",
    actionsTakenToPreventTippingOff:
      "Files compiled by senior partner only; client not contacted; production order not disclosed",
    status: "in-progress",
  },
  {
    id: "LAWER-2024145",
    referenceNumber: "AFP-SW-2024-9012",
    category: "Search Warrant",
    entityType: "legal",
    requestingAgency: "Australian Federal Police",
    requestingOfficer: "Detective Inspector Mark Thompson - 02 6275 6666",
    dateReceived: "2024-11-08",
    legalDeadline: "2024-11-09",
    scopeOfRequest:
      "Immediate access to all client files and communications for John Smith re: property fraud investigation",
    officerAssigned: "Practice Manager",
    tippingOffRisk: "high",
    actionsTakenToPreventTippingOff:
      "Warrant executed immediately; no advance notice to client; files secured under police supervision",
    informationDelivered:
      "Complete client file including correspondence, trust account records, and property documents",
    dateDelivered: "2024-11-08",
    deliveryMethod: "Physical handover to AFP officers",
    internalApprover: "Managing Partner",
    status: "completed",
  },
  {
    id: "REER-2024078",
    referenceNumber: "AUSTRAC-S49-2024-3456",
    category: "Section 49 AUSTRAC Request",
    entityType: "real-estate",
    requestingAgency: "AUSTRAC",
    requestingOfficer: "Intelligence Officer Lisa Wang - 02 9950 0088",
    dateReceived: "2024-10-28",
    legalDeadline: "2024-11-11",
    scopeOfRequest:
      "All records related to property purchase at 123 Main St by buyer L9988 including source of funds documentation",
    officerAssigned: "Compliance Manager",
    tippingOffRisk: "high",
    actionsTakenToPreventTippingOff:
      "Information compiled without buyer contact; sales team not informed of investigation; normal business operations maintained",
    informationDelivered:
      "Purchase contract, deposit records, source of funds declarations, and ID verification documents",
    dateDelivered: "2024-11-10",
    deliveryMethod: "Secure AUSTRAC portal upload",
    internalApprover: "Sales Director",
    status: "completed",
  },
  {
    id: "PMER-2024134",
    referenceNumber: "AFP-PROD-2024-7890",
    category: "Production Order",
    entityType: "precious-metals",
    requestingAgency: "Australian Federal Police",
    requestingOfficer: "Detective Senior Constable David Lee - 02 6275 6777",
    dateReceived: "2024-11-10",
    legalDeadline: "2024-11-24",
    scopeOfRequest:
      "All transaction records for customer PM-CUST-5566 including bullion purchases, sales, and storage records for past 2 years",
    officerAssigned: "National Operations Manager",
    tippingOffRisk: "high",
    actionsTakenToPreventTippingOff:
      "Records compiled by senior management only; customer not contacted; no changes to account status or service",
    status: "in-progress",
  },
  {
    id: "FIER-2024156",
    referenceNumber: "ASIC-INFO-2024-2345",
    category: "ASIC Information Request",
    entityType: "banking",
    requestingAgency: "Australian Securities & Investments Commission",
    requestingOfficer: "Senior Investigator Rachel Green - 1300 300 630",
    dateReceived: "2024-11-12",
    legalDeadline: "2024-11-26",
    scopeOfRequest:
      "Corporate account records and beneficial ownership information for XYZ Holdings Ltd",
    officerAssigned: "Head of Corporate Banking",
    tippingOffRisk: "medium",
    actionsTakenToPreventTippingOff:
      "Information request handled by senior management; no customer-facing staff involved; business as usual maintained",
    status: "new",
  },
  {
    id: "ACCER-2024089",
    referenceNumber: "AUSTRAC-S49-2024-4567",
    category: "Section 49 AUSTRAC Request",
    entityType: "accounting",
    requestingAgency: "AUSTRAC",
    requestingOfficer: "Intelligence Analyst Tom Brown - 02 9950 0099",
    dateReceived: "2024-10-15",
    legalDeadline: "2024-10-29",
    scopeOfRequest:
      "All financial records and tax returns prepared for client DEF Enterprises for FY 2022-2024",
    officerAssigned: "Senior Tax Partner",
    tippingOffRisk: "high",
    actionsTakenToPreventTippingOff:
      "Files accessed by partner only; client not contacted; annual review conducted as normal to avoid suspicion",
    informationDelivered:
      "Complete tax files, financial statements, and supporting documentation",
    dateDelivered: "2024-10-28",
    deliveryMethod: "Secure AUSTRAC portal upload",
    internalApprover: "Managing Partner",
    status: "completed",
  },
];

export function ExternalRequestsRegister() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredRequests = mockExternalRequests.filter((request) => {
    const matchesSearch =
      request.referenceNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestingAgency
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      request.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || request.category === categoryFilter;
    const matchesRisk =
      riskFilter === "all" || request.tippingOffRisk === riskFilter;
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesCategory && matchesRisk && matchesStatus;
  });

  const getDaysUntilDeadline = (deadline) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const stats = {
    total: mockExternalRequests.length,
    highRisk: mockExternalRequests.filter((r) => r.tippingOffRisk === "high")
      .length,
    inProgress: mockExternalRequests.filter(
      (r) => r.status === "in-progress" || r.status === "new"
    ).length,
    urgent: mockExternalRequests.filter((r) => {
      if (r.status === "completed") return false;
      const days = getDaysUntilDeadline(r.legalDeadline);
      return days <= 2 && days >= 0;
    }).length,
  };

  const getRiskBadge = (risk) => {
    const colors = {
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return <Badge className={colors[risk]}>{risk.toUpperCase()} RISK</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      new: "default",
      "in-progress": "secondary",
      completed: "outline",
      "on-hold": "outline",
    };

    return (
      <Badge variant={variants[status]}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  const getDeadlineBadge = (deadline, status) => {
    if (status === "completed") return null;

    const days = getDaysUntilDeadline(deadline);

    if (days < 0) {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          OVERDUE
        </Badge>
      );
    }

    if (days <= 2) {
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
          <Clock className="h-3 w-3 mr-1" />
          {days} days
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-muted-foreground">
        {days} days
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Requests</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>High Tipping-Off Risk</CardDescription>
            <CardTitle className="text-3xl text-destructive">
              {stats.highRisk}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-3xl">{stats.inProgress}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Urgent (≤2 days)</CardDescription>
            <CardTitle className="text-3xl text-orange-600">
              {stats.urgent}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>External Requests & Legal Orders Register</CardTitle>
              <CardDescription>
                Secure tracking of legally mandated information requests
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
                  setSelectedRequest(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Log New Request
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
                placeholder="Search by reference number, agency, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Section 49 AUSTRAC Request">
                  Section 49 AUSTRAC
                </SelectItem>
                <SelectItem value="Production Order">
                  Production Order
                </SelectItem>
                <SelectItem value="Search Warrant">Search Warrant</SelectItem>
                <SelectItem value="ATO Production Order">
                  ATO Production Order
                </SelectItem>
                <SelectItem value="ASIC Information Request">
                  ASIC Request
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Tipping-Off Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk</SelectItem>
                <SelectItem value="medium">Medium Risk</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Requesting Agency</TableHead>
                  <TableHead>Received</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Tipping-Off Risk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      No requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow
                      key={request.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedRequest(request);
                        setDialogOpen(true);
                      }}
                    >
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-muted-foreground">
                            {request.id}
                          </span>
                          <span>{request.referenceNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.category}</Badge>
                      </TableCell>
                      <TableCell>{request.requestingAgency}</TableCell>
                      <TableCell>
                        {new Date(request.dateReceived).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>
                            {new Date(
                              request.legalDeadline
                            ).toLocaleDateString()}
                          </span>
                          {getDeadlineBadge(
                            request.legalDeadline,
                            request.status
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRiskBadge(request.tippingOffRisk)}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-sm">
                        {request.officerAssigned}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Request Detail Dialog */}
      <ExternalRequestDialog
        request={selectedRequest}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
