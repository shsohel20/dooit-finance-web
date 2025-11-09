"use client";
import React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MoreVertical,
  Send,
  Paperclip,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { TrainingDetailDialog } from "./training-detail-dialog";

// Mock data
const MOCK_TRAINING_RECORDS = [
  {
    id: "TR001",
    employeeId: "FI4588",
    participantName: "Sarah Chen",
    department: "Payments Operations",
    role: "Senior Analyst",
    trainingTopic: "Advanced TM & SMR Reporting",
    trainingType: "Annual Refresh",
    deliveryMethod: "Live Online",
    trainerName: "Michael Roberts",
    dateCompleted: "2024-09-15",
    score: "98% (Pass)",
    assessmentAttempts: 1,
    trainingMaterialVersion: "v2.3",
    refreshFrequency: 12,
    nextRefreshDate: "2025-09-15",
    complianceStatus: "Compliant",
    managerAcknowledgment: {
      acknowledged: true,
      managerName: "David Wilson",
      timestamp: "2024-09-16T10:30:00Z",
    },
    evidence: [
      {
        fileName: "certificate_sarah_chen.pdf",
        fileUrl: "#",
        uploadDate: "2024-09-15",
      },
    ],
    industryType: "Banking",
    createdAt: "2024-09-01",
    updatedAt: "2024-09-16",
  },
  {
    id: "TR002",
    employeeId: "ACC7721",
    participantName: "David Jones",
    department: "Tax Services",
    role: "Partner",
    trainingTopic: "Tranche 2 Intro: Client SOF & Tax Evasion Risks",
    trainingType: "Induction",
    deliveryMethod: "E-learning",
    trainerName: "Emma Thompson",
    dateCompleted: "2024-10-22",
    score: "85% (Pass)",
    assessmentAttempts: 2,
    trainingMaterialVersion: "v1.0",
    refreshFrequency: 24,
    nextRefreshDate: "2026-10-22",
    complianceStatus: "Compliant",
    managerAcknowledgment: {
      acknowledged: false,
    },
    evidence: [],
    industryType: "Accounting",
    createdAt: "2024-10-01",
    updatedAt: "2024-10-22",
  },
  {
    id: "TR003",
    employeeId: "LAW1150",
    participantName: "Amelia Rodriguez",
    department: "Conveyancing",
    role: "Associate",
    trainingTopic: "ECDD for Real Estate & Trust Beneficiaries",
    trainingType: "Specific Topic",
    deliveryMethod: "In-person",
    trainerName: "James Mitchell",
    dateCompleted: "2024-11-05",
    score: "92% (Pass)",
    assessmentAttempts: 1,
    trainingMaterialVersion: "v2.1",
    refreshFrequency: 12,
    nextRefreshDate: "2025-11-05",
    complianceStatus: "Compliant",
    managerAcknowledgment: {
      acknowledged: true,
      managerName: "Patricia Lee",
      timestamp: "2024-11-06T14:20:00Z",
    },
    evidence: [
      {
        fileName: "completion_certificate.pdf",
        fileUrl: "#",
        uploadDate: "2024-11-05",
      },
    ],
    industryType: "Legal",
    createdAt: "2024-10-15",
    updatedAt: "2024-11-06",
  },
  {
    id: "TR004",
    employeeId: "RE3305",
    participantName: "Ben Carter",
    department: "Sales",
    role: "Sales Agent",
    trainingTopic: "AML Basics: Identifying Suspicious Buyer Behaviour",
    trainingType: "Induction",
    deliveryMethod: "E-learning",
    trainerName: "Lisa Anderson",
    dateCompleted: "2024-10-18",
    score: "78% (Pass)",
    assessmentAttempts: 3,
    trainingMaterialVersion: "v1.5",
    refreshFrequency: 12,
    nextRefreshDate: "2025-10-18",
    complianceStatus: "Compliant",
    managerAcknowledgment: {
      acknowledged: false,
    },
    evidence: [],
    industryType: "Real Estate",
    createdAt: "2024-10-01",
    updatedAt: "2024-10-18",
  },
  {
    id: "TR005",
    employeeId: "PM8894",
    participantName: "Chloe Li",
    department: "Retail Operations",
    role: "Store Manager",
    trainingTopic: "Cash & Bullion Transactions: Thresholds & SMRs",
    trainingType: "Specific Topic",
    deliveryMethod: "Workshop",
    trainerName: "Robert Chang",
    dateCompleted: "2024-11-01",
    score: "100% (Pass)",
    assessmentAttempts: 1,
    trainingMaterialVersion: "v3.0",
    refreshFrequency: 12,
    nextRefreshDate: "2025-11-01",
    complianceStatus: "Compliant",
    managerAcknowledgment: {
      acknowledged: true,
      managerName: "Kevin Zhang",
      timestamp: "2024-11-02T09:15:00Z",
    },
    evidence: [
      {
        fileName: "workshop_certificate.pdf",
        fileUrl: "#",
        uploadDate: "2024-11-01",
      },
    ],
    industryType: "Precious Metals",
    createdAt: "2024-10-20",
    updatedAt: "2024-11-02",
  },
  {
    id: "TR006",
    employeeId: "FI2341",
    participantName: "Marcus Thompson",
    department: "Compliance",
    role: "Compliance Officer",
    trainingTopic: "Risk Assessment & Customer Due Diligence",
    trainingType: "Annual Refresh",
    deliveryMethod: "Live Online",
    trainerName: "Sarah Williams",
    dateCompleted: "2024-03-15",
    score: "96% (Pass)",
    assessmentAttempts: 1,
    trainingMaterialVersion: "v2.2",
    refreshFrequency: 12,
    nextRefreshDate: "2025-03-15",
    complianceStatus: "Due Soon",
    managerAcknowledgment: {
      acknowledged: true,
      managerName: "Jennifer Brown",
      timestamp: "2024-03-16T11:00:00Z",
    },
    evidence: [
      {
        fileName: "certificate_marcus.pdf",
        fileUrl: "#",
        uploadDate: "2024-03-15",
      },
    ],
    industryType: "Banking",
    createdAt: "2024-02-01",
    updatedAt: "2024-03-16",
  },
  {
    id: "TR007",
    employeeId: "ACC5512",
    participantName: "Rachel Green",
    department: "Audit",
    role: "Senior Auditor",
    trainingTopic: "AML Fundamentals for Accountants",
    trainingType: "Annual Refresh",
    deliveryMethod: "E-learning",
    trainerName: "Thomas Baker",
    dateCompleted: "2023-12-10",
    score: "88% (Pass)",
    assessmentAttempts: 1,
    trainingMaterialVersion: "v1.8",
    refreshFrequency: 12,
    nextRefreshDate: "2024-12-10",
    complianceStatus: "Overdue",
    managerAcknowledgment: {
      acknowledged: true,
      managerName: "Andrew Miller",
      timestamp: "2023-12-11T15:30:00Z",
    },
    evidence: [],
    industryType: "Accounting",
    createdAt: "2023-11-15",
    updatedAt: "2023-12-11",
  },
];

function getComplianceStatusIcon(status) {
  switch (status) {
    case "Compliant":
      return <CheckCircle2 className="h-4 w-4" />;
    case "Due Soon":
      return <Clock className="h-4 w-4" />;
    case "Overdue":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return null;
  }
}

function getComplianceStatusVariant(status) {
  switch (status) {
    case "Compliant":
      return "default";
    case "Due Soon":
      return "secondary";
    case "Overdue":
      return "destructive";
    default:
      return "outline";
  }
}

export function TrainingRegister({ searchQuery }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

  const filteredRecords = MOCK_TRAINING_RECORDS.filter((record) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      record.employeeId.toLowerCase().includes(query) ||
      record.participantName.toLowerCase().includes(query) ||
      record.trainingTopic.toLowerCase().includes(query) ||
      record.department.toLowerCase().includes(query)
    );
  });

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowDetailDialog(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Training Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Department / Role</TableHead>
                  <TableHead>Training Topic</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date Completed</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Next Refresh</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Manager Ack</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={12}
                      className="text-center text-muted-foreground py-8"
                    >
                      No training records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-mono text-sm">
                        {record.employeeId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.participantName}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{record.department}</div>
                          <div className="text-muted-foreground">
                            {record.role}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={record.trainingTopic}>
                          {record.trainingTopic}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {record.trainingType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.dateCompleted || "—"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            record.assessmentAttempts > 1
                              ? "text-amber-600 font-medium"
                              : "text-sm"
                          }
                        >
                          {record.score || "—"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {record.assessmentAttempts > 1 ? (
                          <Badge variant="secondary" className="text-xs">
                            {record.assessmentAttempts}
                          </Badge>
                        ) : (
                          record.assessmentAttempts
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {record.nextRefreshDate || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getComplianceStatusVariant(
                            record.complianceStatus
                          )}
                          className="gap-1"
                        >
                          {getComplianceStatusIcon(record.complianceStatus)}
                          {record.complianceStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {record.managerAcknowledgment.acknowledged ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <Clock className="h-4 w-4 text-amber-600 mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewRecord(record)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Paperclip className="h-4 w-4 mr-2" />
                              Attach Evidence
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedRecord && (
        <TrainingDetailDialog
          record={selectedRecord}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
        />
      )}
    </>
  );
}
