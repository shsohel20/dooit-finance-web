"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { SMRCaseDialog } from "./smr-case-dialog";

// Mock data for different entity types
const mockSMRCases = [
  {
    caseId: "FISMR8842",
    suspicionDate: "2024-10-25",
    analystName: "Sarah Chen",
    customerId: "CUST55789",
    customerName: "A1 Imports Pty Ltd",
    entityType: "banking",
    isVerified: true,
    reasonForSuspicion:
      "Rapid circular payments to a high-risk jurisdiction with no clear commercial purpose.",
    redFlags: [
      "Structuring",
      "HRJ Transactions",
      "Unusual Transaction Pattern",
    ],
    sourceOfAlert: "Transaction Monitoring",
    smrDecision: "Reportable",
    smrReferenceNumber: "FI-20241015-045",
    smrSubmissionDate: "2024-10-27",
    approverName: "Chief Risk Officer",
    status: "Submitted",
  },
  {
    caseId: "ACCSMR1150",
    suspicionDate: "2024-10-26",
    analystName: "David Jones",
    customerId: "CL9922",
    customerName: "John Smith",
    entityType: "accounting",
    isVerified: true,
    reasonForSuspicion:
      "Client provided inconsistent info on source of wealth for a large property purchase and was evasive about tax obligations.",
    redFlags: ["Inconsistent SOF/Wealth", "Tax Evasion Indicators"],
    sourceOfAlert: "Staff Detection",
    smrDecision: "Not Reportable",
    approverName: "Managing Partner",
    reasonForNotReportable:
      "After further investigation, client provided satisfactory documentation. Inconsistencies were due to language barrier.",
    caseClosureDate: "2024-10-28",
    status: "Not Submitted",
  },
  {
    caseId: "LAWSMR4401",
    suspicionDate: "2024-10-24",
    analystName: "Amelia Rodriguez",
    customerId: "CLM887",
    customerName: "Matter: 55 Bridge Rd Purchase",
    entityType: "legal",
    isVerified: true,
    reasonForSuspicion:
      "Third-party payment from an unverified individual not connected to the transaction. Beneficial owner of the purchasing trust is opaque.",
    redFlags: [
      "Third-Party Payment",
      "Complex Structure",
      "Opaque Beneficial Ownership",
    ],
    sourceOfAlert: "Staff Detection",
    smrDecision: "Reportable",
    smrReferenceNumber: "LAW-20241024-002",
    smrSubmissionDate: "2024-10-25",
    approverName: "MLRO",
    status: "Submitted",
  },
  {
    caseId: "RESMR7723",
    suspicionDate: "2024-10-27",
    analystName: "Ben Carter",
    customerId: "TB4450",
    customerName: "XYZ Holdings Trust",
    entityType: "real-estate",
    isVerified: false,
    reasonForSuspicion:
      "Proposed purchaser for a $3.5M property insisted on using cashier's checks and was reluctant to provide identification for all trustees.",
    redFlags: [
      "Use of Cash/Cash Equiv.",
      "Reluctance to Provide ID",
      "High Value Transaction",
    ],
    sourceOfAlert: "Staff Detection",
    smrDecision: "Not Reportable",
    reasonForNotReportable:
      "Transaction did not proceed. Customer withdrew from purchase.",
    caseClosureDate: "2024-10-29",
    status: "Not Submitted",
  },
  {
    caseId: "PMSMR5566",
    suspicionDate: "2024-10-25",
    analystName: "Chloe Li",
    customerId: "C12340",
    customerName: "Cash Buyer",
    entityType: "precious-metals",
    isVerified: false,
    reasonForSuspicion:
      "Individual attempted to purchase $98,000 in gold bullion in cash, just below the $10,000 Threshold Transaction Report limit, and became agitated when asked for ID.",
    redFlags: [
      "Structuring",
      "Cash Transaction",
      "Reluctance to Provide ID",
      "Aggressive Behavior",
    ],
    sourceOfAlert: "Staff Detection",
    smrDecision: "Reportable",
    smrReferenceNumber: "PM-20241025-001",
    smrSubmissionDate: "2024-10-25",
    approverName: "National Operations Manager",
    status: "Submitted",
  },
  {
    caseId: "FISMR9012",
    suspicionDate: "2024-10-28",
    analystName: "Sarah Chen",
    customerId: "CUST78901",
    customerName: "Global Trade Partners LLC",
    entityType: "banking",
    isVerified: true,
    reasonForSuspicion:
      "Multiple large transactions with sanctioned entities. Potential trade-based money laundering.",
    redFlags: [
      "Sanctioned Entity Links",
      "TBML Indicators",
      "Complex Trade Structure",
    ],
    sourceOfAlert: "Transaction Monitoring",
    smrDecision: "Reportable",
    status: "Under Review",
  },
];

export function SMRRegister() {
  const [selectedCase, setSelectedCase] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [decisionFilter, setDecisionFilter] = useState("all");

  const filteredCases = mockSMRCases.filter((smrCase) => {
    const matchesSearch =
      smrCase.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      smrCase.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      smrCase.customerId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      smrCase.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesDecision =
      decisionFilter === "all" ||
      smrCase.smrDecision.toLowerCase() === decisionFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDecision;
  });

  const stats = {
    total: mockSMRCases.length,
    submitted: mockSMRCases.filter((c) => c.status === "Submitted").length,
    underReview: mockSMRCases.filter((c) => c.status === "Under Review").length,
    notSubmitted: mockSMRCases.filter((c) => c.status === "Not Submitted")
      .length,
  };

  const handleRowClick = (smrCase) => {
    setSelectedCase(smrCase);
    setDialogOpen(true);
  };

  const handleNewCase = () => {
    setSelectedCase(null);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total SMR Cases
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Review</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.underReview}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Not Submitted</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.notSubmitted}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>SMR Case Register</CardTitle>
            <Button onClick={handleNewCase}>
              <Plus className="mr-2 h-4 w-4" />
              New SMR Case
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Case ID, Customer Name, or Customer ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="under review">Under Review</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="not submitted">Not Submitted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={decisionFilter} onValueChange={setDecisionFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Decision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="reportable">Reportable</SelectItem>
                <SelectItem value="not reportable">Not Reportable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* SMR Cases Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Customer ID</TableHead>
                <TableHead>Suspicion Date</TableHead>
                <TableHead>Analyst</TableHead>
                <TableHead>Decision</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No SMR cases found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((smrCase) => (
                  <TableRow
                    key={smrCase.caseId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(smrCase)}
                  >
                    <TableCell className="font-medium">
                      {smrCase.caseId}
                    </TableCell>
                    <TableCell>{smrCase.customerName}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {smrCase.customerId}
                    </TableCell>
                    <TableCell>
                      {new Date(smrCase.suspicionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{smrCase.analystName}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          smrCase.smrDecision === "Reportable"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {smrCase.smrDecision}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          smrCase.status === "Submitted"
                            ? "default"
                            : smrCase.status === "Under Review"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {smrCase.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {smrCase.isVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <SMRCaseDialog
        smrCase={selectedCase}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
