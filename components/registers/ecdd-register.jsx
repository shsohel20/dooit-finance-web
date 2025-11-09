"use client";
import React from "react";
import { useState } from "react";
import { Search, Plus, Filter, Download, AlertCircle } from "lucide-react";
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
import { ECDDCaseDialog } from "./ecdd-case-dialog";

// Mock data
const mockECDDCases = [
  {
    caseId: "FIECDD7720",
    customerName: "Apex Holdings Trust",
    customerId: "CUST88741",
    entityType: "Trust",
    trigger: "TM Alert: Complex Corp Structure",
    initialRiskRating: "High",
    ecddInitiationDate: "2024-10-25",
    informationRequested:
      "Full Beneficial Ownership map, Source of Funds for recent large deposits, nature of business with HRJ entities",
    dueDate: "2024-11-08",
    informationReceivedDate: "2024-10-28",
    analystAssessment:
      "Customer provided comprehensive documentation. Beneficial ownership structure is complex but legitimate. Source of funds verified through audited financial statements.",
    finalRiskRating: "Medium",
    recommendation: "Accept",
    caseOutcome: "ECDD Satisfied",
    caseStatus: "Closed",
    industry: "Banking",
  },
  {
    caseId: "ACCECDD4491",
    customerName: "Bell River Pty Ltd",
    customerId: "CL3340",
    entityType: "Company",
    trigger: "Client for large international tax structuring",
    initialRiskRating: "Medium",
    ecddInitiationDate: "2024-10-24",
    informationRequested:
      "Clarification on ultimate beneficial owners, proof of commercial rationale for overseas entities",
    dueDate: "2024-11-07",
    caseStatus: "Under Review",
    industry: "Accounting",
  },
  {
    caseId: "LAWECDD8835",
    customerName: "Matter: Estate of J. Smith",
    customerId: "M5670",
    entityType: "Individual",
    trigger: "Third-Party Payer from HRJ",
    initialRiskRating: "High",
    ecddInitiationDate: "2024-10-26",
    informationRequested:
      "Source of Funds for the third-party payer, relationship to the client",
    dueDate: "2024-11-09",
    informationReceivedDate: "2024-10-28",
    analystAssessment:
      "Third-party payer relationship established. However, source of funds remains unclear despite multiple requests.",
    finalRiskRating: "High",
    recommendation: "Monitor",
    caseOutcome: "Matter Proceeded (Court Order), SMR Filed",
    l2ComplianceReviewDate: "2024-10-30",
    caseStatus: "Closed",
    industry: "Legal",
  },
  {
    caseId: "REECDD1163",
    customerName: "P. Davidson",
    customerId: "L1125",
    entityType: "Individual",
    trigger: "Cash Purchase > $500k",
    initialRiskRating: "High",
    ecddInitiationDate: "2024-10-23",
    informationRequested:
      "Verified Source of Funds (e.g., bank statements, sale of asset docs)",
    dueDate: "2024-10-30",
    informationReceivedDate: "2024-10-25",
    analystAssessment:
      "Customer provided clear documentation showing sale of investment property as source of funds. All documentation verified.",
    finalRiskRating: "Low",
    recommendation: "Accept",
    caseOutcome: "ECDD Satisfied",
    caseStatus: "Closed",
    industry: "Real Estate",
  },
  {
    caseId: "PMECDD3397",
    customerName: "Bullion Direct Ltd",
    customerId: "C9980",
    entityType: "Company",
    trigger: "New Corporate Customer - MSB",
    initialRiskRating: "High",
    ecddInitiationDate: "2024-10-25",
    informationRequested:
      "Copy of AUSTRAC registration, AML/CTF Program, beneficial owners",
    dueDate: "2024-11-08",
    informationReceivedDate: "2024-10-26",
    analystAssessment:
      "Valid AUSTRAC registration confirmed. AML/CTF Program reviewed and found to be comprehensive. Beneficial owners identified and verified.",
    finalRiskRating: "Medium",
    recommendation: "Accept",
    caseOutcome: "ECDD Satisfied",
    caseStatus: "Closed",
    industry: "Precious Metals",
  },
  {
    caseId: "FIECDD8821",
    customerName: "Global Trade Partners LLC",
    customerId: "CUST55789",
    entityType: "Company",
    trigger: "Multiple HRJ transactions",
    initialRiskRating: "High",
    ecddInitiationDate: "2024-11-01",
    informationRequested:
      "Trade documentation, beneficial ownership structure, source of funds for large deposits",
    dueDate: "2024-11-15",
    caseStatus: "Open",
    industry: "Banking",
  },
];

export function ECDDRegister() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredCases = mockECDDCases.filter((case_) => {
    const matchesSearch =
      case_.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.customerId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || case_.caseStatus === statusFilter;
    const matchesRisk =
      riskFilter === "all" || case_.initialRiskRating === riskFilter;

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const stats = {
    total: mockECDDCases.length,
    open: mockECDDCases.filter((c) => c.caseStatus === "Open").length,
    underReview: mockECDDCases.filter((c) => c.caseStatus === "Under Review")
      .length,
    overdue: mockECDDCases.filter((c) => {
      if (c.caseStatus === "Closed") return false;
      return new Date(c.dueDate) < new Date();
    }).length,
  };

  const getStatusBadge = (status) => {
    const variants = {
      Open: "default",
      "Under Review": "secondary",
      Closed: "outline",
      Escalated: "destructive",
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getRiskBadge = (risk) => {
    const colors = {
      Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Unacceptable: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return <Badge className={colors[risk]}>{risk}</Badge>;
  };

  const isOverdue = (dueDate, status) => {
    if (status === "Closed") return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Cases</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Open Cases</CardDescription>
            <CardTitle className="text-3xl">{stats.open}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Under Review</CardDescription>
            <CardTitle className="text-3xl">{stats.underReview}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-3xl text-destructive">
              {stats.overdue}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>ECDD & RFI Case Register</CardTitle>
              <CardDescription>
                Enhanced Customer Due Diligence and Request for Information case
                management
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
                  setSelectedCase(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Case
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
                placeholder="Search by case ID, customer name, or customer ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Unacceptable">Unacceptable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Industry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      No cases found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCases.map((case_) => (
                    <TableRow
                      key={case_.caseId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedCase(case_);
                        setDialogOpen(true);
                      }}
                    >
                      <TableCell className="font-medium">
                        {case_.caseId}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {case_.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {case_.customerId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{case_.entityType}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {case_.trigger}
                      </TableCell>
                      <TableCell>
                        {getRiskBadge(case_.initialRiskRating)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {isOverdue(case_.dueDate, case_.caseStatus) && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                          <span
                            className={
                              isOverdue(case_.dueDate, case_.caseStatus)
                                ? "text-destructive font-medium"
                                : ""
                            }
                          >
                            {new Date(case_.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(case_.caseStatus)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{case_.industry}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Case Detail Dialog */}
      <ECDDCaseDialog
        case_={selectedCase}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
