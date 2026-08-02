"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconX } from "@tabler/icons-react";
import { useCaseManagerStore } from "@/app/store/useCaseManagerStore";

const CASE_TYPES = [
  { value: "SAR", label: "SAR" },
  { value: "PEP", label: "PEP" },
  { value: "transaction_monitoring", label: "Transaction Monitoring" },
  { value: "other", label: "Other" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "under_investigation", label: "Under Investigation" },
  { value: "pending_review", label: "Pending Review" },
  { value: "closed", label: "Closed" },
  { value: "escalated", label: "Escalated" },
];

const SORT_OPTIONS = [
  { value: "createdAt", label: "Created Date" },
  { value: "updatedAt", label: "Last Updated" },
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
];

export default function CaseFilters({ onClose }) {
  const { filters, setFilter, resetFilters } = useCaseManagerStore();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b pb-3">
        <h3 className="font-semibold text-heading">Filters</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0">
            <IconX className="size-4" />
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-5 flex-1 overflow-y-auto pr-1">
        {/* Case Type */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Case Type</Label>
          <Select
            value={filters.caseType || "all"}
            onValueChange={(v) => setFilter("caseType", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {CASE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Priority</Label>
          <Select
            value={filters.riskLevel || "all"}
            onValueChange={(v) => setFilter("riskLevel", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              {PRIORITY_OPTIONS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(v) => setFilter("status", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Date Range */}
        <div className="space-y-3">
          <Label className="text-xs font-medium">Date Range</Label>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">From</Label>
            <Input
              type="date"
              className="h-9 text-sm"
              value={filters.dateFrom}
              onChange={(e) => setFilter("dateFrom", e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">To</Label>
            <Input
              type="date"
              className="h-9 text-sm"
              value={filters.dateTo}
              onChange={(e) => setFilter("dateTo", e.target.value)}
            />
          </div>
        </div>

        <Separator />

        {/* Sort */}
        <div className="space-y-3">
          <Label className="text-xs font-medium">Sort</Label>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Sort by</Label>
            <Select
              value={filters.sortBy || "createdAt"}
              onValueChange={(v) => setFilter("sortBy", v)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] text-muted-foreground">Order</Label>
            <Select
              value={filters.sortOrder || "desc"}
              onValueChange={(v) => setFilter("sortOrder", v)}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest first</SelectItem>
                <SelectItem value="asc">Oldest first</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-3">
        <Button variant="outline" size="sm" className="w-full" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
