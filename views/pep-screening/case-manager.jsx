"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CaseDetails } from "./case-details";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
const CustomResizableTable = dynamic(() => import("@/components/ui/CustomResizable"), {
  ssr: false,
});

const mockCases = [
  {
    id: 1,
    caseName: "SHEIKH HASINA WAZED",
    caseId: "AML2026001",
    linkedCases: 3,
    caseRating: "High",
    mandatoryActions: 12,
    unresolved: 10,
    reviewRequired: 8,
    ongoingScreening: true,
    archived: false,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
  {
    id: 2,
    caseName: "HASINA BEGUM SHEIKH",
    caseId: "AML2026002",
    linkedCases: 1,
    caseRating: "Medium",
    mandatoryActions: 6,
    unresolved: 6,
    reviewRequired: 4,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
  {
    id: 3,
    caseName: "SHEIKH REHANA",
    caseId: "AML2026003",
    linkedCases: 2,
    caseRating: "High",
    mandatoryActions: 8,
    unresolved: 8,
    reviewRequired: 5,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
  {
    id: 4,
    caseName: "SAJEEB WAZED JOY",
    caseId: "AML2026004",
    linkedCases: 1,
    caseRating: "High",
    mandatoryActions: 5,
    unresolved: 5,
    reviewRequired: 3,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
  {
    id: 5,
    caseName: "SHAIKH HASINA",
    caseId: "AML2026005",
    linkedCases: 0,
    caseRating: "Medium",
    mandatoryActions: 4,
    unresolved: 4,
    reviewRequired: 3,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
  {
    id: 6,
    caseName: "HASINA KHATUN",
    caseId: "AML2026006",
    linkedCases: 0,
    caseRating: "Low",
    mandatoryActions: 2,
    unresolved: 2,
    reviewRequired: 2,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
  {
    id: 7,
    caseName: "WAJED MIAH",
    caseId: "AML2026007",
    linkedCases: 1,
    caseRating: "High",
    mandatoryActions: 3,
    unresolved: 3,
    reviewRequired: 2,
    ongoingScreening: false,
    archived: true,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
  {
    id: 8,
    caseName: "SHIRIN SHARMIN CHAUDHURY",
    caseId: "AML2026008",
    linkedCases: 1,
    caseRating: "Medium",
    mandatoryActions: 4,
    unresolved: 4,
    reviewRequired: 2,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
  {
    id: 9,
    caseName: "HASINA BEGUM",
    caseId: "AML2026009",
    linkedCases: 0,
    caseRating: "Low",
    mandatoryActions: 1,
    unresolved: 1,
    reviewRequired: 1,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
  {
    id: 10,
    caseName: "HASENA SHIEK",
    caseId: "AML2026010",
    linkedCases: 0,
    caseRating: "Low",
    mandatoryActions: 1,
    unresolved: 1,
    reviewRequired: 1,
    ongoingScreening: false,
    archived: false,
    assignee: "",
    lastModifiedBy: "System",
    lastModifiedDateUser: "06-May-2026 09:15",
    lastModifiedDateOGS: "06-May-2026 09:00",
    createdBy: "AML Analyst",
  },
];

const ratingColors = {
  High: "bg-red-600 text-white",
  Medium: "bg-amber-500 text-white",
  Low: "bg-emerald-500 text-white",
};

export function CaseManager({ formData = null }) {
  const [selectedCase, setSelectedCase] = useState(null);

  const handleCaseClick = (caseItem) => {
    setSelectedCase(caseItem);
  };

  if (selectedCase) {
    return <CaseDetails caseData={selectedCase} onBack={() => setSelectedCase(null)} />;
  }

  const columns = [
    {
      id: "case",
      header: "Case",
      accessorKey: "caseName",
      cell: ({ row }) => (
        <div onClick={() => handleCaseClick(row.original)} className="cursor-pointer">
          <p className="font-bold hover:underline">{row.original.caseName}</p>
          <p className="text-xs text-muted-foreground">{row.original.caseId}</p>
        </div>
      ),
      size: 220,
    },
    {
      id: "caseRating",
      header: "Risk",
      accessorKey: "caseRating",
      cell: ({ row }) => (
        <span
          className={cn(
            "px-2 py-0.5 rounded text-xs font-medium",
            ratingColors[row.original.caseRating],
          )}
        >
          {row.original.caseRating}
        </span>
      ),
      size: 80,
    },
    {
      id: "linkedCases",
      header: "Linked Cases",
      accessorKey: "linkedCases",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">{row.original.linkedCases}</p>
      ),
      size: 100,
    },
    {
      id: "mandatoryActions",
      header: "Actions Required",
      accessorKey: "mandatoryActions",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">{row.original.mandatoryActions}</p>
      ),
    },
    {
      id: "unresolved",
      header: "Unresolved",
      accessorKey: "unresolved",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">{row.original.unresolved}</p>
      ),
      size: 100,
    },
    {
      id: "reviewRequired",
      header: "Review",
      accessorKey: "reviewRequired",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">{row.original.reviewRequired}</p>
      ),
      size: 80,
    },
    {
      id: "ongoingScreening",
      header: "Ongoing",
      accessorKey: "ongoingScreening",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">
          {row.original.ongoingScreening ? "Yes" : "No"}
        </p>
      ),
    },
    {
      id: "archived",
      header: "Archived",
      accessorKey: "archived",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">{row.original.archived ? "Yes" : "No"}</p>
      ),
    },
    {
      id: "assignee",
      header: "Assignee",
      accessorKey: "assignee",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">{row.original.assignee || "N/A"}</p>
      ),
    },
    {
      id: "lastModifiedBy",
      header: "Last Updated By",
      accessorKey: "lastModifiedBy",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">{row.original.lastModifiedBy}</p>
      ),
    },
    {
      id: "lastModifiedDateUser",
      header: "Last Modified (User)",
      accessorKey: "lastModifiedDateUser",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">{row.original.lastModifiedDateUser}</p>
      ),
    },
    {
      id: "lastModifiedDateOGS",
      header: "Last Modified (OGS)",
      accessorKey: "lastModifiedDateOGS",
      cell: ({ row }) => (
        <p className="text-end text-muted-foreground">{row.original.lastModifiedDateOGS}</p>
      ),
    },
    {
      id: "createdBy",
      header: "Created By",
      accessorKey: "createdBy",
      cell: ({ row }) => <p className="text-end text-muted-foreground">{row.original.createdBy}</p>,
    },
  ];

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <Input type="text" placeholder="Search" />
        <Input type="text" placeholder="Case ID" />
      </div>
      <div className="flex-1 overflow-auto">
        <CustomResizableTable
          columns={columns}
          data={mockCases}
          tableId="pep-screening-case-manager"
          mainClass="pep-screening-case-manager"
        />
      </div>
    </div>
  );
}
