"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import {
  IconEye,
  IconEdit,
  IconPennant,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { dateShowFormat } from "@/lib/utils";

const CustomResizableTable = dynamic(() => import("@/components/ui/CustomResizable"), {
  ssr: false,
});

const priorityVariants = {
  low: "info",
  medium: "warning",
  high: "danger",
  critical: "dark",
};

const statusVariants = {
  open: "info",
  under_investigation: "warning",
  pending_review: "outline",
  closed: "success",
  escalated: "danger",
};

const STATUS_LABELS = {
  open: "Open",
  under_investigation: "Under Investigation",
  pending_review: "Pending Review",
  closed: "Closed",
  escalated: "Escalated",
};

export default function CaseTable({ cases, loading, currentPage, totalItems, limit, onPageChange }) {
  const router = useRouter();

  const totalPages = Math.ceil((totalItems || 0) / (limit || 10));
  const start = ((currentPage || 1) - 1) * (limit || 10) + 1;
  const end = Math.min((currentPage || 1) * (limit || 10), totalItems || 0);

  const handleRowClick = useCallback(
    (caseItem) => {
      router.push(`/dashboard/client/monitoring-and-cases/case-manager/${caseItem._id}`);
    },
    [router]
  );

  const columns = [
    {
      id: "title",
      header: "Case Title",
      accessorKey: "title",
      size: 240,
      cell: ({ row }) => (
        <button
          type="button"
          className="text-left hover:underline"
          onClick={() => handleRowClick(row.original)}
        >
          <p className="font-semibold text-heading text-sm line-clamp-1">{row.original.title}</p>
          <p className="text-xs text-muted-foreground font-mono">
            {row.original.type?.replace("_", " ")}
          </p>
        </button>
      ),
    },
    {
      id: "priority",
      header: "Priority",
      accessorKey: "priority",
      size: 110,
      cell: ({ row }) => (
        <StatusPill icon={<IconPennant />} variant={priorityVariants[row.original.priority]}>
          <span className="capitalize">{row.original.priority}</span>
        </StatusPill>
      ),
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      size: 160,
      cell: ({ row }) => (
        <StatusPill variant={statusVariants[row.original.status]}>
          {STATUS_LABELS[row.original.status] || row.original.status}
        </StatusPill>
      ),
    },
    {
      id: "assignedTo",
      header: "Assigned To",
      size: 160,
      cell: ({ row }) => {
        const investigators = row.original.assignedTo || [];
        if (investigators.length === 0) {
          return <span className="text-xs text-muted-foreground">Unassigned</span>;
        }
        return (
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1.5">
              {investigators.slice(0, 3).map((u) => (
                <Avatar key={u._id} className="h-6 w-6 border-2 border-white">
                  <AvatarImage src={u.avatar} />
                  <AvatarFallback className="text-[8px]">
                    {u.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            {investigators.length === 1 && (
              <span className="text-xs text-muted-foreground truncate max-w-[80px]">
                {investigators[0].name}
              </span>
            )}
            {investigators.length > 3 && (
              <span className="text-xs text-muted-foreground">+{investigators.length - 3}</span>
            )}
          </div>
        );
      },
    },
    {
      id: "createdBy",
      header: "Created By",
      accessorKey: "createdBy.name",
      size: 140,
      cell: ({ row }) => (
        <span className="text-sm">{row.original.createdBy?.name || "—"}</span>
      ),
    },
    {
      id: "updatedAt",
      header: "Last Updated",
      accessorKey: "updatedAt",
      size: 140,
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {dateShowFormat(row.original.updatedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      size: 90,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => { e.stopPropagation(); handleRowClick(row.original); }}
          >
            <IconEye className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/dashboard/client/monitoring-and-cases/case-manager/${row.original._id}/edit`
              );
            }}
          >
            <IconEdit className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <CustomResizableTable
        columns={columns}
        data={cases || []}
        loading={loading}
        tableId="case-manager-table"
        mainClass="case-manager-table"
        onDoubleClick={handleRowClick}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            Showing {start}–{end} of {totalItems} cases
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage === 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <IconChevronLeft className="size-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
              const pg = i + 1;
              return (
                <Button
                  key={pg}
                  variant={currentPage === pg ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 text-xs"
                  onClick={() => onPageChange?.(pg)}
                >
                  {pg}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <IconChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
