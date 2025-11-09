"use client";

import { useState } from "react";
import { Search, Plus, Filter, Download, AlertTriangle } from "lucide-react";
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
import { BreachIncidentDialog } from "./breach-incident-dialog";

// Mock data
const mockBreachIncidents = [
  {
    incidentId: "FIBI-2024045",
    incidentTitle: "Late SMR Submission",
    reportedDate: "2024-10-28",
    reportedBy: "Sarah Chen",
    incidentCategory: "AML Compliance",
    severityLevel: "High",
    incidentDescription:
      "Suspicious Matter Report for customer CUST55789 was submitted 5 business days after the 3-day regulatory deadline",
    rootCause: "Workload overflow in compliance team during peak period",
    affectedCustomers: "CUST55789",
    regulatoryImpact: "AUSTRAC",
    containmentActions:
      "Immediate submission of overdue SMR with explanation to AUSTRAC",
    remediationPlan:
      "Implement additional compliance staff; establish backup review process",
    responsiblePerson: "Chief Risk Officer",
    dueDate: "2024-11-15",
    actualResolutionDate: "2024-11-12",
    status: "Resolved",
    regulatoryReportingRequired: true,
    regulatoryReportDate: "2024-10-28",
    lessonsLearned:
      "Need for better workload distribution and early warning system for deadlines",
  },
  {
    incidentId: "ACCBI-2024078",
    incidentTitle: "Client Data Breach",
    reportedDate: "2024-10-25",
    reportedBy: "David Jones",
    incidentCategory: "Privacy Breach",
    severityLevel: "Critical",
    incidentDescription:
      "Unencrypted laptop containing client tax files stolen from partner's vehicle",
    rootCause: "Failure to follow data encryption and transport policies",
    affectedCustomers: "15 corporate clients",
    regulatoryImpact: "OAIC",
    containmentActions:
      "Remote wipe initiated; clients notified; credit monitoring offered",
    remediationPlan:
      "Mandatory encryption on all devices; staff retraining; policy enforcement",
    responsiblePerson: "Managing Partner",
    dueDate: "2024-11-30",
    actualResolutionDate: "2024-11-25",
    status: "Remediation",
    regulatoryReportingRequired: true,
    regulatoryReportDate: "2024-10-26",
    lessonsLearned:
      "Need for stricter device management and regular policy compliance checks",
  },
  {
    incidentId: "LAWBI-2024112",
    incidentTitle: "Conflict of Interest Breach",
    reportedDate: "2024-10-24",
    reportedBy: "Amelia Rodriguez",
    incidentCategory: "Regulatory Breach",
    severityLevel: "High",
    incidentDescription:
      "Firm acted for both parties in property transaction without adequate conflict checks",
    rootCause: "Failure in conflict checking system; manual process oversight",
    affectedCustomers: "Both buyer and seller clients",
    regulatoryImpact: "Law Society",
    containmentActions:
      "Matter suspended; independent legal advice offered to both clients",
    remediationPlan:
      "Implement automated conflict checking system; staff training",
    responsiblePerson: "Managing Partner",
    dueDate: "2024-11-15",
    actualResolutionDate: "2024-11-10",
    status: "Resolved",
    regulatoryReportingRequired: true,
    regulatoryReportDate: "2024-10-25",
    lessonsLearned:
      "Need for automated conflict checking integrated with client onboarding",
  },
  {
    incidentId: "REBI-2024089",
    incidentTitle: "AML/CDD Procedure Breach",
    reportedDate: "2024-10-23",
    reportedBy: "Ben Carter",
    incidentCategory: "AML Compliance",
    severityLevel: "Medium",
    incidentDescription:
      "Property sale completed without verifying source of funds for cash purchase over $500k",
    rootCause: "Sales pressure overriding compliance procedures",
    affectedCustomers: "Purchaser L8874",
    regulatoryImpact: "AUSTRAC",
    containmentActions: "Transaction paused; ECDD initiated immediately",
    remediationPlan:
      "Implement mandatory compliance checkpoints in sales process; staff training",
    responsiblePerson: "Sales Director",
    dueDate: "2024-11-30",
    actualResolutionDate: "2024-11-28",
    status: "Remediation",
    regulatoryReportingRequired: false,
    lessonsLearned:
      "Compliance must be integrated into sales workflow with mandatory checkpoints",
  },
  {
    incidentId: "PMBI-2024056",
    incidentTitle: "TTR Reporting Failure",
    reportedDate: "2024-10-27",
    reportedBy: "Chloe Li",
    incidentCategory: "AML Compliance",
    severityLevel: "Critical",
    incidentDescription:
      "Multiple cash transactions over $10,000 threshold not reported to AUSTRAC over 3-month period",
    rootCause:
      "Staff training gap; system configuration error in transaction monitoring",
    affectedCustomers: "12 cash customers",
    regulatoryImpact: "AUSTRAC",
    containmentActions:
      "Immediate submission of all overdue TTRs; external legal advice sought",
    remediationPlan:
      "System audit; staff retraining; implement dual verification for cash transactions",
    responsiblePerson: "National Operations Manager",
    dueDate: "2024-12-15",
    actualResolutionDate: "2024-12-10",
    status: "Under Investigation",
    regulatoryReportingRequired: true,
    regulatoryReportDate: "2024-10-27",
    lessonsLearned:
      "Need for regular system audits and mandatory compliance testing for high-risk transactions",
  },
  {
    incidentId: "FIBI-2024091",
    incidentTitle: "System Outage - Transaction Monitoring",
    reportedDate: "2024-11-05",
    reportedBy: "IT Operations",
    incidentCategory: "Operational Failure",
    severityLevel: "High",
    incidentDescription:
      "Transaction monitoring system offline for 6 hours due to server failure",
    rootCause: "Hardware failure without adequate redundancy",
    regulatoryImpact: "AUSTRAC",
    containmentActions:
      "Manual monitoring initiated; system restored; backlog processed",
    remediationPlan:
      "Implement redundant systems; improve disaster recovery procedures",
    responsiblePerson: "Chief Technology Officer",
    dueDate: "2024-12-05",
    status: "Containment",
    regulatoryReportingRequired: true,
  },
];

export function BreachIncidentRegister() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredIncidents = mockBreachIncidents.filter((incident) => {
    const matchesSearch =
      incident.incidentTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      incident.incidentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || incident.incidentCategory === categoryFilter;
    const matchesSeverity =
      severityFilter === "all" || incident.severityLevel === severityFilter;
    const matchesStatus =
      statusFilter === "all" || incident.status === statusFilter;

    return matchesSearch && matchesCategory && matchesSeverity && matchesStatus;
  });

  const stats = {
    total: mockBreachIncidents.length,
    critical: mockBreachIncidents.filter((i) => i.severityLevel === "Critical")
      .length,
    open: mockBreachIncidents.filter(
      (i) => i.status === "Reported" || i.status === "Under Investigation"
    ).length,
    overdue: mockBreachIncidents.filter((i) => {
      if (i.status === "Resolved" || i.status === "Closed") return false;
      return new Date(i.dueDate) < new Date();
    }).length,
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      Low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      High: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      Critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    return <Badge className={colors[severity]}>{severity}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      Reported: "default",
      "Under Investigation": "secondary",
      Containment: "secondary",
      Remediation: "secondary",
      Resolved: "outline",
      Closed: "outline",
    };

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const colors = {
      "Privacy Breach":
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "AML Compliance":
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Security Incident":
        "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "Operational Failure":
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Regulatory Breach":
        "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
    };

    return <Badge className={colors[category]}>{category}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Incidents</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Critical Severity</CardDescription>
            <CardTitle className="text-3xl text-destructive">
              {stats.critical}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Open/Investigating</CardDescription>
            <CardTitle className="text-3xl">{stats.open}</CardTitle>
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

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Breach and Incident Register</CardTitle>
              <CardDescription>
                Centralized log for all compliance breaches and security
                incidents
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
                  setSelectedIncident(null);
                  setDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Report Incident
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
                placeholder="Search by incident ID, title, or reporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Privacy Breach">Privacy Breach</SelectItem>
                <SelectItem value="AML Compliance">AML Compliance</SelectItem>
                <SelectItem value="Security Incident">
                  Security Incident
                </SelectItem>
                <SelectItem value="Operational Failure">
                  Operational Failure
                </SelectItem>
                <SelectItem value="Regulatory Breach">
                  Regulatory Breach
                </SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Reported">Reported</SelectItem>
                <SelectItem value="Under Investigation">
                  Under Investigation
                </SelectItem>
                <SelectItem value="Containment">Containment</SelectItem>
                <SelectItem value="Remediation">Remediation</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Reported By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Regulatory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIncidents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground py-8"
                    >
                      No incidents found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncidents.map((incident) => (
                    <TableRow
                      key={incident.incidentId}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        setSelectedIncident(incident);
                        setDialogOpen(true);
                      }}
                    >
                      <TableCell className="font-medium">
                        {incident.incidentId}
                      </TableCell>
                      <TableCell className="max-w-[250px]">
                        <div className="flex items-start gap-2">
                          {incident.severityLevel === "Critical" && (
                            <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                          )}
                          <span className="truncate">
                            {incident.incidentTitle}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getCategoryBadge(incident.incidentCategory)}
                      </TableCell>
                      <TableCell>
                        {getSeverityBadge(incident.severityLevel)}
                      </TableCell>
                      <TableCell>{incident.reportedBy}</TableCell>
                      <TableCell>
                        {new Date(incident.reportedDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(incident.status)}</TableCell>
                      <TableCell>
                        {incident.regulatoryReportingRequired ? (
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 dark:bg-blue-950"
                          >
                            {incident.regulatoryImpact}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            N/A
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Incident Detail Dialog */}
      <BreachIncidentDialog
        incident={selectedIncident}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
