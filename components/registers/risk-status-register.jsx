"use client";
import React from "react";
import { useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Download,
  Shield,
  Ban,
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
import { RiskStatusDialog } from "./risk-status-dialog";

// Mock data for all entity types
const mockRiskStatusRecords = [
  // Banking
  {
    id: "FIWL-2024089",
    customerId: "CUST78945",
    customerName: "Apex Trading International Ltd",
    entityType: "banking",
    dateAdded: "2024-10-15",
    listType: "watchlist",
    reasonForListing:
      "Multiple high-value international transfers to high-risk jurisdictions without clear business purpose",
    supportingEvidence:
      "Transaction pattern analysis; customer interview notes; OSINT research",
    restrictionsApplied:
      "Enhanced monitoring of all transactions; mandatory approval for international transfers over $50k",
    reviewDate: "2025-01-15",
    approverName: "Chief Risk Officer",
    status: "active",
  },
  {
    id: "FISL-2024112",
    customerId: "CUST56234",
    customerName: "Marcus Chen",
    entityType: "banking",
    dateAdded: "2024-09-20",
    listType: "suspension-list",
    reasonForListing:
      "Suspected structuring activity - multiple cash deposits just below reporting threshold",
    supportingEvidence:
      "Transaction monitoring alerts; branch reports; customer behavior analysis",
    restrictionsApplied:
      "Account suspended; no withdrawals permitted; ECDD in progress",
    expiryDate: "2024-12-20",
    reviewDate: "2024-11-20",
    approverName: "Head of Compliance",
    status: "active",
  },
  {
    id: "FITL-2024098",
    customerId: "CUST89012",
    customerName: "Global Remittance Services Pty Ltd",
    entityType: "banking",
    dateAdded: "2024-08-10",
    listType: "termination-list",
    reasonForListing:
      "Confirmed money laundering activity; SMR submitted; law enforcement investigation ongoing",
    supportingEvidence:
      "SMR-2024-445; LEA confirmation; forensic transaction analysis",
    restrictionsApplied:
      "All accounts closed; funds frozen pending LEA clearance; no future business permitted",
    approverName: "CEO",
    status: "active",
  },
  // Accounting
  {
    id: "ACCWL-2024067",
    customerId: "CLI45678",
    customerName: "Prestige Property Developments",
    entityType: "accounting",
    dateAdded: "2024-10-05",
    listType: "watchlist",
    reasonForListing:
      "Complex corporate structure with offshore entities; inconsistent financial reporting",
    supportingEvidence:
      "Financial statement analysis; ASIC searches; beneficial ownership concerns",
    restrictionsApplied:
      "Partner-level approval required for all services; enhanced CDD procedures",
    reviewDate: "2025-04-05",
    approverName: "Managing Partner",
    status: "active",
  },
  {
    id: "ACCBL-2024089",
    customerId: "CLI78901",
    customerName: "Phoenix Consulting Group",
    entityType: "accounting",
    dateAdded: "2024-07-15",
    listType: "internal-blacklist",
    reasonForListing:
      "Previous client - provided false information; attempted to involve firm in tax evasion scheme",
    supportingEvidence:
      "Internal investigation report; legal advice; ATO correspondence",
    restrictionsApplied:
      "Permanently banned from all firm services; all inquiries to be rejected",
    approverName: "Managing Partner",
    status: "active",
  },
  // Legal
  {
    id: "LAWWL-2024134",
    customerId: "MAT89456",
    customerName: "Dmitri Volkov",
    entityType: "legal",
    dateAdded: "2024-11-01",
    listType: "watchlist",
    reasonForListing:
      "PEP status - foreign government official; property purchases in Australia",
    supportingEvidence:
      "PEP screening results; media reports; source of wealth documentation gaps",
    restrictionsApplied:
      "Enhanced due diligence required; partner approval for all matters; ongoing monitoring",
    reviewDate: "2025-05-01",
    approverName: "Managing Partner",
    status: "active",
  },
  {
    id: "LAWSL-2024098",
    customerId: "MAT67890",
    customerName: "Coastal Developments Pty Ltd",
    entityType: "legal",
    dateAdded: "2024-09-12",
    listType: "suspension-list",
    reasonForListing:
      "Conflict of interest identified - related party to existing client in dispute",
    supportingEvidence: "Conflict check results; client relationship mapping",
    restrictionsApplied:
      "All matters suspended pending conflict resolution; no new instructions accepted",
    expiryDate: "2024-12-12",
    reviewDate: "2024-11-12",
    approverName: "Ethics Partner",
    status: "active",
  },
  // Real Estate
  {
    id: "REWL-2024156",
    customerId: "BUY12345",
    customerName: "Li Wei",
    entityType: "real-estate",
    dateAdded: "2024-10-20",
    listType: "watchlist",
    reasonForListing:
      "Cash buyer for multiple high-value properties; vague source of funds explanation",
    supportingEvidence:
      "Purchase history; SOF documentation review; AUSTRAC guidance",
    restrictionsApplied:
      "Enhanced CDD required; source of funds verification mandatory; senior approval needed",
    reviewDate: "2025-01-20",
    approverName: "Compliance Manager",
    status: "active",
  },
  {
    id: "REBL-2024078",
    customerId: "BUY67890",
    customerName: "Luxury Living Investments",
    entityType: "real-estate",
    dateAdded: "2024-06-30",
    listType: "internal-blacklist",
    reasonForListing:
      "Previous transaction - attempted to use agency for money laundering; SMR submitted",
    supportingEvidence: "SMR-2024-223; internal investigation; legal advice",
    restrictionsApplied:
      "Permanently banned; all inquiries rejected; staff alerted",
    approverName: "Principal Agent",
    status: "active",
  },
  // Precious Metals
  {
    id: "PMWL-2024201",
    customerId: "CUST34567",
    customerName: "Golden Dragon Trading",
    entityType: "precious-metals",
    dateAdded: "2024-11-05",
    listType: "watchlist",
    reasonForListing:
      "Frequent large cash purchases of gold bullion; business model unclear",
    supportingEvidence:
      "Transaction history; business verification attempts; customer interviews",
    restrictionsApplied:
      "Cash transaction limit $10k; enhanced monitoring; ID verification each visit",
    reviewDate: "2025-02-05",
    approverName: "National Operations Manager",
    status: "active",
  },
  {
    id: "PMSL-2024189",
    customerId: "CUST45678",
    customerName: "Ahmed Al-Rashid",
    entityType: "precious-metals",
    dateAdded: "2024-10-10",
    listType: "suspension-list",
    reasonForListing:
      "Suspected structuring - multiple purchases just below TTR threshold across different stores",
    supportingEvidence:
      "Multi-store transaction analysis; TTR review; staff reports",
    restrictionsApplied:
      "All transactions suspended; ECDD in progress; no purchases permitted",
    expiryDate: "2025-01-10",
    reviewDate: "2024-12-10",
    approverName: "Compliance Officer",
    status: "active",
  },
  {
    id: "PMTL-2024167",
    customerId: "CUST23456",
    customerName: "Metro Gold Exchange",
    entityType: "precious-metals",
    dateAdded: "2024-08-25",
    listType: "termination-list",
    reasonForListing:
      "Confirmed involvement in gold smuggling operation; AFP investigation",
    supportingEvidence: "AFP notification; SMR-2024-334; forensic analysis",
    restrictionsApplied:
      "All business ceased; banned from all locations; security alert issued",
    approverName: "CEO",
    status: "active",
  },
];

export function RiskStatusRegister() {
  const [searchQuery, setSearchQuery] = useState("");
  const [listTypeFilter, setListTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredRecords = mockRiskStatusRecords.filter((record) => {
    const matchesSearch =
      record.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.customerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesListType =
      listTypeFilter === "all" || record.listType === listTypeFilter;
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesListType && matchesStatus;
  });

  const stats = {
    total: mockRiskStatusRecords.length,
    active: mockRiskStatusRecords.filter((r) => r.status === "active").length,
    blacklisted: mockRiskStatusRecords.filter(
      (r) =>
        r.listType === "internal-blacklist" || r.listType === "termination-list"
    ).length,
    upcomingReviews: mockRiskStatusRecords.filter((r) => {
      if (!r.reviewDate) return false;
      const reviewDate = new Date(r.reviewDate);
      const today = new Date();
      const daysUntilReview = Math.ceil(
        (reviewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilReview <= 30 && daysUntilReview >= 0;
    }).length,
  };

  const getListTypeBadge = (listType) => {
    const config = {
      watchlist: {
        icon: Shield,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      "suspension-list": {
        icon: AlertTriangle,
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      },
      "termination-list": {
        icon: Ban,
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      "internal-blacklist": {
        icon: Ban,
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
    };

    const { icon: Icon, color } = config[listType];
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {listType.replace("-", " ")}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: "destructive",
      "reviewed-removed": "outline",
      escalated: "secondary",
    };

    return (
      <Badge variant={variants[status]}>
        {status.replace("-", " ").toUpperCase()}
      </Badge>
    );
  };

  const getEntityBadge = (entityType) => {
    const labels = {
      banking: "Banking",
      accounting: "Accounting",
      legal: "Legal",
      "real-estate": "Real Estate",
      "precious-metals": "Precious Metals",
    };
    return <Badge variant="outline">{labels[entityType]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Records</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Restrictions</CardDescription>
            <CardTitle className="text-3xl text-destructive">
              {stats.active}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Blacklisted</CardDescription>
            <CardTitle className="text-3xl text-destructive">
              {stats.blacklisted}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Upcoming Reviews</CardDescription>
            <CardTitle className="text-3xl">{stats.upcomingReviews}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Risk Status (WSTI) Register</CardTitle>
              <CardDescription>
                Watchlist, Suspension, Termination & Internal Blacklist
                Management
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
                  setSelectedRecord(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add to Risk List
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
                placeholder="Search by customer name, ID, or record ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={listTypeFilter} onValueChange={setListTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="List Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All List Types</SelectItem>
                <SelectItem value="watchlist">Watchlist</SelectItem>
                <SelectItem value="suspension-list">Suspension List</SelectItem>
                <SelectItem value="termination-list">
                  Termination List
                </SelectItem>
                <SelectItem value="internal-blacklist">
                  Internal Blacklist
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="reviewed-removed">
                  Reviewed/Removed
                </SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Record ID</TableHead>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>List Type</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Review Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedRecord(record);
                        setDialogOpen(true);
                      }}
                    >
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell className="font-medium">
                        {record.customerName}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {record.customerId}
                      </TableCell>
                      <TableCell>{getEntityBadge(record.entityType)}</TableCell>
                      <TableCell>{getListTypeBadge(record.listType)}</TableCell>
                      <TableCell>
                        {new Date(record.dateAdded).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {record.reviewDate ? (
                          <span className="text-sm">
                            {new Date(record.reviewDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            N/A
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Risk Status Detail Dialog */}
      <RiskStatusDialog
        record={selectedRecord}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
