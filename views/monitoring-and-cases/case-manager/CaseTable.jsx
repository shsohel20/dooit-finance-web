"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import {
  IconEye,
  IconFolder,
  IconPennant,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { dateShowFormat } from "@/lib/utils";

const CustomResizableTable = dynamic(() => import("@/components/ui/CustomResizable"), {
  ssr: false,
});

const riskVariants = {
  High: "danger",
  Medium: "warning",
  Low: "info",
};

const statusVariants = {
  Active: "success",
  "Under Review": "warning",
  Closed: "outline",
};

const PAGE_SIZE = 10;

export default function CaseTable({ cases, loading }) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil((cases?.length || 0) / PAGE_SIZE);

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return (cases || []).slice(start, start + PAGE_SIZE);
  }, [cases, page]);

  const handleRowClick = useCallback(
    (caseItem) => {
      router.push(`/dashboard/client/monitoring-and-cases/case-manager/${caseItem._id}`);
    },
    [router],
  );
  const columns = [
    {
      id: "uid",
      header: "Case ID",
      accessorKey: "uid",
      size: 120,
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.uid}</span>,
    },
    {
      id: "customerName",
      header: "Customer Name",
      accessorKey: "customerName",
      size: 220,
      cell: ({ row }) => (
        <button
          type="button"
          className="text-left hover:underline"
          onClick={() => handleRowClick(row.original)}
        >
          <p className="font-semibold text-heading text-sm">{row.original.customerName}</p>
          <p className="text-xs text-muted-foreground">{row.original.caseType}</p>
        </button>
      ),
    },
    {
      id: "customerType",
      header: "Type",
      accessorKey: "customerType",
      size: 120,
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs capitalize">
          {row.original.customerType}
        </Badge>
      ),
    },
    {
      id: "caseType",
      header: "Case Type",
      accessorKey: "caseType",
      size: 130,
      cell: ({ row }) => <span className="text-sm">{row.original.caseType}</span>,
    },
    {
      id: "riskTag",
      header: "Risk",
      accessorKey: "riskTag",
      size: 120,
      cell: ({ row }) => (
        <StatusPill icon={<IconPennant />} variant={riskVariants[row.original.riskTag]}>
          {row.original.riskTag}
        </StatusPill>
      ),
    },
    {
      id: "folderCount",
      header: "Folders",
      accessorKey: "folderCount",
      size: 100,
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <IconFolder className="size-3.5" />
          {row.original.folderCount}
        </span>
      ),
    },
    {
      id: "lastScreeningTime",
      header: "Last Screening",
      accessorKey: "lastScreeningTime",
      size: 170,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{dateShowFormat(row.original.lastScreeningTime)}</span>
      ),
    },
    {
      id: "assignedAnalyst",
      header: "Analyst",
      accessorKey: "assignedAnalyst",
      size: 140,
      cell: ({ row }) => <span className="text-sm">{row.original.assignedAnalyst}</span>,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      size: 130,
      cell: ({ row }) => <StatusPill variant={statusVariants[row.original.status]}>{row.original.status}</StatusPill>,
    },
    {
      id: "actions",
      header: "Action",
      accessorKey: "actions",
      size: 80,
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => handleRowClick(row.original)}>
          <IconEye className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <CustomResizableTable
        columns={columns}
        data={paginated}
        loading={loading}
        tableId="case-manager-table"
        mainClass="case-manager-table"
        onDoubleClick={handleRowClick}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, cases.length)} of{" "}
            {cases.length} cases
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <IconChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                className="h-7 w-7 p-0 text-xs"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
