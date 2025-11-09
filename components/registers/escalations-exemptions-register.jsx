"use client";
import React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  AlertTriangle,
  Shield,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { EscalationDialog } from "./escalation-dialog";
import { ExemptionDialog } from "./exemption-dialog";

// Mock data
const mockEscalations = [
  {
    id: "FIESC5512",
    customerName: "Global Trade Partners LLC",
    customerId: "CUST78901",
    entityType: "banking",
    issueDescription:
      "TM system generated alert on a complex trade finance transaction. Initial analyst unsure if activity is legitimate trade or potential TBML.",
    escalationDate: "2024-10-26",
    escalatedBy: "Sarah Chen (Analyst)",
    reasonForEscalation:
      "Unclear Decision - Requires senior expertise in Trade-Based Money Laundering.",
    escalatedTo: "Chief Risk Officer",
    decision:
      "Outcome: Proceed with transaction but file SMR due to inability to fully verify supporting documentation. Enhanced monitoring applied.",
    decisionDate: "2024-10-27",
    status: "resolved",
  },
  {
    id: "ACCESC7740",
    customerName: "Bell River Pty Ltd",
    customerId: "CL3340",
    entityType: "accounting",
    issueDescription:
      "Client refused to provide BO information for an international entity setup.",
    escalationDate: "2024-10-24",
    escalatedBy: "David Jones (Partner)",
    reasonForEscalation:
      "High-Risk Client - Potential for facilitating tax evasion or money laundering.",
    escalatedTo: "Managing Partner",
    decision: "Outcome: Cease all engagement activities. File SMR.",
    decisionDate: "2024-10-25",
    status: "resolved",
  },
  {
    id: "LAWESC8815",
    customerName: "Matter: Estate of J. Smith",
    customerId: "M5670",
    entityType: "legal",
    issueDescription:
      "Conveyancing matter with third-party payer from HRJ. Lawyer suspects but cannot prove illicit funds.",
    escalationDate: "2024-10-26",
    escalatedBy: "Amelia Rodriguez (Lawyer)",
    reasonForEscalation:
      "Suspected Tipping Off - How to proceed without alerting the client?",
    escalatedTo: "MLRO",
    status: "under-review",
  },
];

const mockExemptions = [
  {
    id: "FIEXM9981",
    requesterName: "Head of Private Banking",
    requesterDepartment: "Private Banking",
    customerName: "UHNW Client - CEO",
    customerId: "CUST99887",
    entityType: "banking",
    exemptionDetails:
      "Exemption from standard 5-day ECDD timeline for a UHNW client.",
    justification:
      "Client is a well-known, publicly listed company CEO. Requires urgent complex structuring.",
    riskAssessment: "low",
    proposedMitigations:
      "Complete ECDD within 10 days. Pre-approve all transactions.",
    exemptionDuration: "One-time transaction",
    approver: "Chief Compliance Officer",
    approvalDate: "2024-10-25",
    status: "approved",
  },
  {
    id: "ACCEXM3320",
    requesterName: "Tax Department",
    requesterDepartment: "Tax Services",
    customerName: "Long-standing Corporate Client",
    customerId: "CL8877",
    entityType: "accounting",
    exemptionDetails:
      "Exemption from full ECDD for a long-standing corporate client introducing a new subsidiary.",
    justification:
      "20-year relationship, low-risk industry, subsidiary is audited.",
    riskAssessment: "medium",
    proposedMitigations: "30 days to complete full ECDD file.",
    exemptionDuration: "30 days",
    approver: "Managing Partner",
    approvalDate: "2024-10-20",
    status: "approved",
  },
  {
    id: "PMEXM2250",
    requesterName: "Store Manager",
    requesterDepartment: "Retail Operations",
    customerName: "Long-term Customer",
    customerId: "C9988",
    entityType: "precious-metals",
    exemptionDetails:
      "Exemption from $10,000 threshold trigger for a known, long-term customer making a $10,500 cash purchase.",
    justification:
      "Customer for 15 years, all previous ECDD clear, transaction is legitimate.",
    riskAssessment: "low",
    proposedMitigations: "One-time transaction",
    exemptionDuration: "One-time",
    rejectionReason:
      "No exemptions to TTR thresholds are permitted under the AML/CTF Act. A TTR must be submitted.",
    status: "rejected",
  },
];

export function EscalationsExemptionsRegister() {
  const [activeTab, setActiveTab] = useState("escalations");
  const [selectedEscalation, setSelectedEscalation] = useState(null);
  const [selectedExemption, setSelectedExemption] = useState(null);
  const [escalationDialogOpen, setEscalationDialogOpen] = useState(false);
  const [exemptionDialogOpen, setExemptionDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEscalations = mockEscalations.filter((escalation) => {
    const matchesSearch =
      escalation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (escalation.customerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false) ||
      escalation.escalatedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || escalation.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const filteredExemptions = mockExemptions.filter((exemption) => {
    const matchesSearch =
      exemption.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exemption.requesterName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (exemption.customerName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
        false);

    const matchesStatus =
      statusFilter === "all" || exemption.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const escalationStats = {
    total: mockEscalations.length,
    open: mockEscalations.filter((e) => e.status === "open").length,
    underReview: mockEscalations.filter((e) => e.status === "under-review")
      .length,
    resolved: mockEscalations.filter((e) => e.status === "resolved").length,
  };

  const exemptionStats = {
    total: mockExemptions.length,
    requested: mockExemptions.filter((e) => e.status === "requested").length,
    approved: mockExemptions.filter((e) => e.status === "approved").length,
    rejected: mockExemptions.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="escalations">Escalations</TabsTrigger>
          <TabsTrigger value="exemptions">Exemptions</TabsTrigger>
        </TabsList>

        <TabsContent value="escalations" className="space-y-6">
          {/* Escalation Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Escalations
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {escalationStats.total}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{escalationStats.open}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Under Review
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {escalationStats.underReview}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {escalationStats.resolved}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Escalations Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle>Escalations Register</CardTitle>
                <Button
                  onClick={() => {
                    setSelectedEscalation(null);
                    setEscalationDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Escalation
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search escalations..."
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
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Escalation ID</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Escalated By</TableHead>
                    <TableHead>Escalated To</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEscalations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        No escalations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEscalations.map((escalation) => (
                      <TableRow
                        key={escalation.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedEscalation(escalation);
                          setEscalationDialogOpen(true);
                        }}
                      >
                        <TableCell className="font-medium">
                          {escalation.id}
                        </TableCell>
                        <TableCell>
                          {escalation.customerName || "N/A"}
                        </TableCell>
                        <TableCell>{escalation.escalatedBy}</TableCell>
                        <TableCell>{escalation.escalatedTo}</TableCell>
                        <TableCell>
                          {new Date(
                            escalation.escalationDate
                          ).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              escalation.status === "resolved"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {escalation.status.replace("-", " ").toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exemptions" className="space-y-6">
          {/* Exemption Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Exemptions
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{exemptionStats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Requested</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {exemptionStats.requested}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {exemptionStats.approved}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {exemptionStats.rejected}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Exemptions Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <CardTitle>Exemptions Register</CardTitle>
                <Button
                  onClick={() => {
                    setSelectedExemption(null);
                    setExemptionDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Request Exemption
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exemptions..."
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
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exemption ID</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Risk Assessment</TableHead>
                    <TableHead>Approver</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExemptions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground"
                      >
                        No exemptions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExemptions.map((exemption) => (
                      <TableRow
                        key={exemption.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          setSelectedExemption(exemption);
                          setExemptionDialogOpen(true);
                        }}
                      >
                        <TableCell className="font-medium">
                          {exemption.id}
                        </TableCell>
                        <TableCell>{exemption.requesterName}</TableCell>
                        <TableCell>{exemption.customerName || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {exemption.riskAssessment.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{exemption.approver || "Pending"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              exemption.status === "approved"
                                ? "default"
                                : exemption.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {exemption.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EscalationDialog
        escalation={selectedEscalation}
        open={escalationDialogOpen}
        onOpenChange={setEscalationDialogOpen}
      />
      <ExemptionDialog
        exemption={selectedExemption}
        open={exemptionDialogOpen}
        onOpenChange={setExemptionDialogOpen}
      />
    </div>
  );
}
