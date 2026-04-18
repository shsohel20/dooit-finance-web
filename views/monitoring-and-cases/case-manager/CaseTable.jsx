"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconEye,
  IconFolder,
  IconPennant,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useCaseManagerStore } from "@/app/store/useCaseManagerStore";
import { dateShowFormat } from "@/lib/utils";

const riskVariants = {
  High: "danger",
  Medium: "warning",
  Low: "info",
};

const riskRowBg = {
  High: "bg-red-50/40 hover:bg-red-50",
  Medium: "bg-yellow-50/40 hover:bg-yellow-50",
  Low: "hover:bg-muted/40",
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

  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded" />
        ))}
      </div>
    );
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <IconFolder className="mb-3 size-10 opacity-40" />
        <p className="text-sm">No cases found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white">
            <TableRow className="text-xs uppercase tracking-wide">
              <TableHead className="w-32">Case ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Case Type</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead className="text-center">Folders</TableHead>
              <TableHead>Last Screening</TableHead>
              <TableHead>Analyst</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((item) => (
              <TableRow
                key={item._id}
                onClick={() => handleRowClick(item)}
                className={cn(
                  "cursor-pointer transition-colors",
                  riskRowBg[item.riskTag] || "hover:bg-muted/40",
                )}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.uid}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-semibold text-heading text-sm">{item.customerName}</p>
                    <p className="text-xs text-muted-foreground">{item.caseType}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs capitalize">
                    {item.customerType}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{item.caseType}</TableCell>
                <TableCell>
                  <StatusPill icon={<IconPennant />} variant={riskVariants[item.riskTag]}>
                    {item.riskTag}
                  </StatusPill>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <IconFolder className="size-3.5" />
                    {item.folderCount}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {dateShowFormat(item.lastScreeningTime)}
                </TableCell>
                <TableCell className="text-sm">{item.assignedAnalyst}</TableCell>
                <TableCell>
                  <StatusPill variant={statusVariants[item.status]}>{item.status}</StatusPill>
                </TableCell>
                <TableCell
                  className="text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => handleRowClick(item)}
                  >
                    <IconEye className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
