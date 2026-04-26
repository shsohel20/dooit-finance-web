"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconDownload,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";
import AnalyticsCards from "./AnalyticsCards";
import ChartsSection from "./ChartsSection";
import CaseTable from "./CaseTable";
import CaseFilters from "./CaseFilters";
import { useCaseManagerStore } from "@/app/store/useCaseManagerStore";
import { mockCases, CASE_TYPES, RISK_LEVELS, CASE_STATUSES } from "@/lib/case-manager-data";

export default function CaseManagerDashboard() {
  const { searchQuery, setSearchQuery, filters, setFilter } = useCaseManagerStore();
  const [rawSearch, setRawSearch] = useState(searchQuery);
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Debounce: sync raw search to store after 300ms
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(rawSearch), 300);
    return () => clearTimeout(timer);
  }, [rawSearch, setSearchQuery]);

  // Simulate initial load
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filteredCases = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return mockCases.filter((c) => {
      // Search: name, uid, email
      if (q) {
        const matchesSearch =
          c.customerName.toLowerCase().includes(q) ||
          c.uid.toLowerCase().includes(q) ||
          (c.customer?.email || "").toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      // Filters
      if (filters.caseType && c.caseType !== filters.caseType) return false;
      if (filters.riskLevel && c.riskTag !== filters.riskLevel) return false;
      if (filters.status && c.status !== filters.status) return false;
      if (filters.assignedAnalyst && c.assignedAnalyst !== filters.assignedAnalyst) return false;
      if (filters.dateFrom) {
        const created = new Date(c.createdDate);
        const from = new Date(filters.dateFrom);
        if (created < from) return false;
      }
      if (filters.dateTo) {
        const created = new Date(c.createdDate);
        const to = new Date(filters.dateTo);
        if (created > to) return false;
      }
      return true;
    });
  }, [searchQuery, filters]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v !== "").length,
    [filters],
  );

  const handleExport = useCallback(() => {
    const csvContent = [
      ["Case ID", "Customer Name", "Type", "Risk", "Status", "Analyst", "Created Date"].join(","),
      ...filteredCases.map((c) =>
        [c.uid, `"${c.customerName}"`, c.customerType, c.riskTag, c.status, c.assignedAnalyst, c.createdDate].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cases-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredCases]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-heading">Case Manager</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Monitor and manage compliance cases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={handleExport}
          >
            <IconDownload className="size-3.5" />
            Export
          </Button>
          <Button size="sm" className="gap-1.5 text-xs">
            <IconPlus className="size-3.5" />
            New Case
          </Button>
        </div>
      </div>

      {/* Analytics Toggle */}
      <div>
        <button
          onClick={() => setShowAnalytics((v) => !v)}
          className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-heading transition-colors"
        >
          {showAnalytics ? <IconChevronUp className="size-4" /> : <IconChevronDown className="size-4" />}
          {showAnalytics ? "Hide" : "Show"} Analytics
        </button>

        {showAnalytics && (
          <div className="flex flex-col gap-4">
            <AnalyticsCards />
            <ChartsSection />
          </div>
        )}
      </div>

      {/* Table Section */}
      <Card className="border border-border shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b p-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="pl-8 h-9 text-sm"
              placeholder="Search by name, UID or email..."
              value={rawSearch}
              onChange={(e) => setRawSearch(e.target.value)}
            />
          </div>

          {/* Quick Filters */}
          <Select
            value={filters.riskLevel || "all"}
            onValueChange={(v) => setFilter("riskLevel", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 w-[130px] text-xs">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              {RISK_LEVELS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status || "all"}
            onValueChange={(v) => setFilter("status", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 w-[140px] text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {CASE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.caseType || "all"}
            onValueChange={(v) => setFilter("caseType", v === "all" ? "" : v)}
          >
            <SelectTrigger className="h-9 w-[160px] text-xs">
              <SelectValue placeholder="Case Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {CASE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Full Filters Panel */}
          <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="relative h-9 gap-1.5 text-xs">
                <IconFilter className="size-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80">
              <SheetHeader>
                <SheetTitle className="sr-only">Filter Cases</SheetTitle>
              </SheetHeader>
              <div className="mt-2 h-full pb-6">
                <CaseFilters onClose={() => setFilterSheetOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <div className="ml-auto text-xs text-muted-foreground">
            {filteredCases.length} case{filteredCases.length !== 1 ? "s" : ""}
          </div>
        </div>

        <CardContent className="p-0">
          <CaseTable cases={filteredCases} loading={loading} />
        </CardContent>
      </Card>
    </div>
  );
}
