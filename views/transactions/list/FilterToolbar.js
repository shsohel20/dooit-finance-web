"use client";

/**
 * FilterToolbar
 *
 * Renders all transaction filter controls and dispatches changes to
 * useTransactionStore. The parent (TransactionListView) is responsible
 * for calling store.fetch() whenever the relevant state changes.
 *
 * Design decisions:
 * - Search is debounced 400 ms to avoid per-keystroke requests.
 * - Status uses a toggle-button group (allows multi-select).
 * - Advanced filters (amount, risk, flags) are in a collapsible section.
 * - All state lives in the Zustand store — this component owns no local state
 *   beyond the debounce buffer for the search field.
 */

import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import {
  IconSearch,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconFilter,
} from "@tabler/icons-react";

import useTransactionStore, {
  DEFAULT_FILTERS,
  countActiveFilters,
} from "@/app/store/useTransactionStore";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "pending",   label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "failed",    label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

// Radix <SelectItem> forbids value="" (reserved as the clear sentinel).
// Use "__all__" as the "no filter" sentinel and convert at the call site.
const ALL = "__all__";
const toStore  = (v) => (v === ALL ? "" : v);
const fromStore = (v) => (v === "" || v == null ? ALL : v);

const TYPE_OPTIONS = [
  { value: ALL,          label: "All Types" },
  { value: "deposit",    label: "Deposit" },
  { value: "withdrawal", label: "Withdrawal" },
  { value: "transfer",   label: "Transfer" },
  { value: "exchange",   label: "Exchange" },
  { value: "other",      label: "Other" },
];

const CURRENCY_OPTIONS = [
  { value: ALL,   label: "Any Currency" },
  { value: "AUD", label: "AUD" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "SGD", label: "SGD" },
  { value: "CAD", label: "CAD" },
];

const CHANNEL_OPTIONS = [
  { value: ALL,       label: "Any Channel" },
  { value: "online",  label: "Online" },
  { value: "branch",  label: "Branch" },
  { value: "mobile",  label: "Mobile" },
  { value: "atm",     label: "ATM" },
  { value: "swift",   label: "SWIFT" },
];

const FLAGGED_OPTIONS = [
  { value: ALL,     label: "All" },
  { value: "true",  label: "Flagged" },
  { value: "false", label: "Not Flagged" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/** Small labelled input wrapper */
const FilterField = ({ label, children }) => (
  <div className="flex flex-col gap-1 min-w-0">
    <Label className="text-xs font-medium text-muted-foreground whitespace-nowrap">
      {label}
    </Label>
    {children}
  </div>
);

/**
 * Status toggle group — each status can be individually toggled on/off.
 * The store holds the active set as a comma-separated string.
 */
const StatusToggleGroup = ({ value, onChange }) => {
  const activeSet = new Set(value ? value.split(",").filter(Boolean) : []);

  const toggle = (status) => {
    const next = new Set(activeSet);
    if (next.has(status)) next.delete(status);
    else next.add(status);
    onChange([...next].join(","));
  };

  const variantMap = {
    pending:   "bg-blue-50   text-blue-700   border-blue-200   hover:bg-blue-100",
    completed: "bg-green-50  text-green-700  border-green-200  hover:bg-green-100",
    failed:    "bg-red-50    text-red-700    border-red-200    hover:bg-red-100",
    cancelled: "bg-gray-50   text-gray-600   border-gray-200   hover:bg-gray-100",
  };

  const activeVariant = {
    pending:   "bg-blue-100   text-blue-800   border-blue-400",
    completed: "bg-green-100  text-green-800  border-green-400",
    failed:    "bg-red-100    text-red-800    border-red-400",
    cancelled: "bg-gray-200   text-gray-800   border-gray-400",
  };

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STATUS_OPTIONS.map(({ value: v, label }) => {
        const isActive = activeSet.has(v);
        return (
          <button
            key={v}
            type="button"
            onClick={() => toggle(v)}
            className={[
              "px-2.5 py-1 text-xs font-medium rounded-full border transition-colors",
              isActive ? activeVariant[v] : variantMap[v],
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function FilterToolbar() {
  const { filters, setFilter, setFilters, resetFilters } = useTransactionStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ── Debounced search ──────────────────────────────────────────────────────
  const [searchDraft, setSearchDraft] = useState(filters.search);
  const debounceRef = useRef(null);

  // Keep draft in sync if filters.search changes externally (e.g. URL restore)
  useEffect(() => {
    setSearchDraft(filters.search);
  }, [filters.search]);

  const handleSearchChange = useCallback(
    (e) => {
      const val = e.target.value;
      setSearchDraft(val);
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setFilter("search", val);
      }, 400);
    },
    [setFilter]
  );

  const clearSearch = () => {
    setSearchDraft("");
    clearTimeout(debounceRef.current);
    setFilter("search", "");
  };

  // ── Cleanup debounce on unmount ───────────────────────────────────────────
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // ── Active filter count (excludes empty strings) ──────────────────────────
  const activeCount = countActiveFilters(filters);

  // ── Advanced-filter fields that have a value (for showing the badge) ──────
  const advancedFields = ["amountMin", "amountMax", "riskMin", "riskMax", "flagged", "relatedPartyFlag"];
  const hasAdvancedActive = advancedFields.some((k) => filters[k] !== "");

  return (
    <div className="bg-sidebar-bg border border-border/50 rounded-md p-3 space-y-3">

      {/* ── Primary row ─────────────────────────────────────────────────── */}
      <div className="flex items-end gap-2 flex-wrap">

        {/* Search */}
        <FilterField label="Search">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={searchDraft}
              onChange={handleSearchChange}
              placeholder="ID, reference, name…"
              className="pl-7 pr-7 h-8 text-sm bg-white w-52"
            />
            {searchDraft && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <IconX className="size-3" />
              </button>
            )}
          </div>
        </FilterField>

        <Separator orientation="vertical" className="h-8 self-center" />

        {/* Status toggles */}
        <FilterField label="Status">
          <StatusToggleGroup
            value={filters.status}
            onChange={(v) => setFilter("status", v)}
          />
        </FilterField>

        <Separator orientation="vertical" className="h-8 self-center" />

        {/* Type */}
        <FilterField label="Type">
          <Select
            value={fromStore(filters.type)}
            onValueChange={(v) => setFilter("type", toStore(v))}
          >
            <SelectTrigger className="h-8 text-sm bg-white w-36">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {TYPE_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        {/* Currency */}
        <FilterField label="Currency">
          <Select
            value={fromStore(filters.currency)}
            onValueChange={(v) => setFilter("currency", toStore(v))}
          >
            <SelectTrigger className="h-8 text-sm bg-white w-32">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        {/* Channel */}
        <FilterField label="Channel">
          <Select
            value={fromStore(filters.channel)}
            onValueChange={(v) => setFilter("channel", toStore(v))}
          >
            <SelectTrigger className="h-8 text-sm bg-white w-32">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              {CHANNEL_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FilterField>

        {/* Date range */}
        <FilterField label="From">
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilter("dateFrom", e.target.value)}
            className="h-8 text-sm bg-white w-36"
          />
        </FilterField>
        <FilterField label="To">
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilter("dateTo", e.target.value)}
            className="h-8 text-sm bg-white w-36"
          />
        </FilterField>

        {/* Spacer + action buttons */}
        <div className="flex items-end gap-2 ml-auto">
          {/* Advanced toggle */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1 text-xs relative"
            onClick={() => setShowAdvanced((p) => !p)}
          >
            <IconFilter className="size-3.5" />
            Advanced
            {hasAdvancedActive && (
              <span className="absolute -top-1.5 -right-1.5 size-3.5 rounded-full bg-primary text-[9px] text-primary-foreground flex items-center justify-center font-bold">
                {advancedFields.filter((k) => filters[k] !== "").length}
              </span>
            )}
            {showAdvanced ? (
              <IconChevronUp className="size-3" />
            ) : (
              <IconChevronDown className="size-3" />
            )}
          </Button>

          {/* Clear all */}
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-destructive hover:text-destructive"
              onClick={resetFilters}
            >
              <IconX className="size-3" />
              Clear
              <Badge
                variant="destructive"
                className="h-4 min-w-4 px-1 text-[10px] font-bold"
              >
                {activeCount}
              </Badge>
            </Button>
          )}
        </div>
      </div>

      {/* ── Advanced filters row (collapsible) ──────────────────────────── */}
      {showAdvanced && (
        <>
          <Separator />
          <div className="flex items-end gap-3 flex-wrap">

            {/* Amount range */}
            <FilterField label="Min Amount">
              <Input
                type="number"
                min={0}
                step="0.01"
                value={filters.amountMin}
                onChange={(e) => setFilter("amountMin", e.target.value)}
                placeholder="0"
                className="h-8 text-sm bg-white w-28"
              />
            </FilterField>
            <FilterField label="Max Amount">
              <Input
                type="number"
                min={0}
                step="0.01"
                value={filters.amountMax}
                onChange={(e) => setFilter("amountMax", e.target.value)}
                placeholder="∞"
                className="h-8 text-sm bg-white w-28"
              />
            </FilterField>

            <Separator orientation="vertical" className="h-8 self-center" />

            {/* Risk score range */}
            <FilterField label="Min Risk (0–100)">
              <Input
                type="number"
                min={0}
                max={100}
                value={filters.riskMin}
                onChange={(e) => setFilter("riskMin", e.target.value)}
                placeholder="0"
                className="h-8 text-sm bg-white w-24"
              />
            </FilterField>
            <FilterField label="Max Risk (0–100)">
              <Input
                type="number"
                min={0}
                max={100}
                value={filters.riskMax}
                onChange={(e) => setFilter("riskMax", e.target.value)}
                placeholder="100"
                className="h-8 text-sm bg-white w-24"
              />
            </FilterField>

            <Separator orientation="vertical" className="h-8 self-center" />

            {/* Investigation flagged */}
            <FilterField label="Flagged">
              <Select
                value={fromStore(filters.flagged)}
                onValueChange={(v) => setFilter("flagged", toStore(v))}
              >
                <SelectTrigger className="h-8 text-sm bg-white w-36">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {FLAGGED_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>

            {/* Related party flag */}
            <FilterField label="Related Party">
              <Select
                value={fromStore(filters.relatedPartyFlag)}
                onValueChange={(v) => setFilter("relatedPartyFlag", toStore(v))}
              >
                <SelectTrigger className="h-8 text-sm bg-white w-36">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {FLAGGED_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterField>
          </div>
        </>
      )}
    </div>
  );
}
