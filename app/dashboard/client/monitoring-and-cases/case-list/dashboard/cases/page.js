"use client";
import React from "react";
import CustomDatatable from "@/components/CustomDatatable";
import { StatusPill } from "@/components/ui/StatusPill";
import { Badge } from "@/components/ui/badge";

const demoData = [
  {
    id: 1,
    caseName: "Suspicious Transaction Case 001",
    type: "AML",
    status: "Open",
    filingStatus: "Filed",
    stage: "Investigation",
    comment: "High risk transaction detected",
    alertType: "Suspicious Activity",
    alertCount: 3,
    assigned: "John Smith",
    activityStatus: "Active",
    regulatoryInfo: "FATF Guidelines",
  },
  {
    id: 2,
    caseName: "PEP Screening Case 002",
    type: "PEP",
    status: "Closed",
    filingStatus: "Not Filed",
    stage: "Resolution",
    comment: "PEP match confirmed",
    alertType: "PEP Alert",
    alertCount: 1,
    assigned: "Sarah Johnson",
    activityStatus: "Inactive",
    regulatoryInfo: "EU AML Directive",
  },
  {
    id: 3,
    caseName: "Sanctions Case 003",
    type: "Sanctions",
    status: "Pending",
    filingStatus: "Under Review",
    stage: "Review",
    comment: "Potential sanctions violation",
    alertType: "Sanctions Alert",
    alertCount: 2,
    assigned: "Mike Davis",
    activityStatus: "Active",
    regulatoryInfo: "OFAC List",
  },
  {
    id: 4,
    caseName: "Money Laundering Case 004",
    type: "ML",
    status: "Open",
    filingStatus: "Filed",
    stage: "Investigation",
    comment: "Complex money laundering scheme",
    alertType: "ML Alert",
    alertCount: 5,
    assigned: "Emily Chen",
    activityStatus: "Active",
    regulatoryInfo: "FATF Standards",
  },
  {
    id: 5,
    caseName: "Fraud Case 005",
    type: "Fraud",
    status: "Escalated",
    filingStatus: "Filed",
    stage: "Escalation",
    comment: "Insurance fraud detected",
    alertType: "Fraud Alert",
    alertCount: 4,
    assigned: "David Wilson",
    activityStatus: "Active",
    regulatoryInfo: "FCA Regulations",
  },
];

const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case "open":
      return "danger";
    case "closed":
      return "success";
    case "pending":
      return "warning";
    case "escalated":
      return "info";
    default:
      return "default";
  }
};

const getActivityStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case "active":
      return "success";
    case "inactive":
      return "muted";
    default:
      return "default";
  }
};

const columns = [
  {
    accessorKey: "caseName",
    header: "Case Name",
    cell: (row) => <div className="font-medium text-sm">{row.caseName}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: (row) => (
      <Badge variant="outline" className="text-xs">
        {row.type}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => <StatusPill variant={getStatusVariant(row.status)}>{row.status}</StatusPill>,
  },
  {
    accessorKey: "filingStatus",
    header: "Filing Status",
    cell: (row) => (
      <Badge variant="secondary" className="text-xs">
        {row.filingStatus}
      </Badge>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: (row) => <div className="text-sm">{row.stage}</div>,
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: (row) => (
      <div className="text-sm max-w-xs truncate" title={row.comment}>
        {row.comment}
      </div>
    ),
  },
  {
    accessorKey: "alertType",
    header: "Alert Type",
    cell: (row) => (
      <Badge variant="outline" className="text-xs">
        {row.alertType}
      </Badge>
    ),
  },
  {
    accessorKey: "alertCount",
    header: "Alert Count",
    cell: (row) => (
      <div className="text-center">
        <Badge variant="destructive" className="text-xs">
          {row.alertCount}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "assigned",
    header: "Assigned To",
    cell: (row) => <div className="text-sm">{row.assigned}</div>,
  },
  {
    accessorKey: "activityStatus",
    header: "Activity Status",
    cell: (row) => (
      <StatusPill variant={getActivityStatusVariant(row.activityStatus)}>
        {row.activityStatus}
      </StatusPill>
    ),
  },
  {
    accessorKey: "regulatoryInfo",
    header: "Regulatory Info",
    cell: (row) => <div className="text-sm">{row.regulatoryInfo}</div>,
  },
];

export default function Cases() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Case List</h1>
        <p className="text-muted-foreground">Monitor and manage compliance cases</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm border">
        <CustomDatatable data={demoData} columns={columns} />
      </div>
    </div>
  );
}
