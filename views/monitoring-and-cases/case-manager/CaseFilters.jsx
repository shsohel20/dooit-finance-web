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
import { analysts, CASE_TYPES, RISK_LEVELS, CASE_STATUSES } from "@/lib/case-manager-data";

export default function CaseFilters({ onClose }) {
  const { filters, setFilter, resetFilters } = useCaseManagerStore();

  const handleReset = () => {
    resetFilters();
  };

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
            value={filters.caseType}
            onValueChange={(v) => setFilter("caseType", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {CASE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Risk Level */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Risk Level</Label>
          <Select
            value={filters.riskLevel}
            onValueChange={(v) => setFilter("riskLevel", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              {RISK_LEVELS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(v) => setFilter("status", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {CASE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Assigned Analyst */}
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">Assigned Analyst</Label>
          <Select
            value={filters.assignedAnalyst}
            onValueChange={(v) => setFilter("assignedAnalyst", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All analysts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All analysts</SelectItem>
              {analysts.map((a) => (
                <SelectItem key={a.id} value={a.name}>
                  {a.name}
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
      </div>

      <div className="mt-4 border-t pt-3">
        <Button variant="outline" size="sm" className="w-full" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
