"use client";
import { useEffect, useState, useCallback } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShieldAlert,
  CheckCircle2,
  Newspaper,
  ListChecks,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  User,
  Building2,
  Loader2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, dateShowFormat, dateShowFormatWithTime } from "@/lib/utils";
import {
  getAmlMatches,
  updateAmlMatch,
  bulkUpdateAmlMatches,
} from "@/app/dashboard/client/onboarding/customer-queue/actions";

// ─── Option config ───────────────────────────────────────────────────────────

const MATCH_STATUS_OPTIONS = [
  { value: "unknown", label: "Unknown" },
  { value: "false_positive", label: "False positive" },
  { value: "potential_match", label: "Potential match" },
  { value: "true_positive", label: "True positive" },
];

const MATCH_STATUS_STYLES = {
  unknown: "text-slate-600",
  false_positive: "text-amber-600",
  potential_match: "text-orange-600",
  true_positive: "text-red-600",
};

const RISK_LEVEL_OPTIONS = [
  { value: "none", label: "—" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const WHITELIST_OPTIONS = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
];

// Bulk-apply sentinel: "keep" = leave this field unchanged for the selection.
const KEEP = "__keep__";
const BULK_MATCH_STATUS_OPTIONS = [{ value: KEEP, label: "Match status —" }, ...MATCH_STATUS_OPTIONS];
const BULK_RISK_LEVEL_OPTIONS = [{ value: KEEP, label: "Risk level —" }, ...RISK_LEVEL_OPTIONS];
const BULK_WHITELIST_OPTIONS = [{ value: KEEP, label: "Whitelist —" }, ...WHITELIST_OPTIONS];

const AML_STATUS_STYLES = {
  clear: "bg-emerald-50 text-emerald-700 border-emerald-200",
  yellow: "bg-amber-50 text-amber-700 border-amber-200",
  flagged: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-slate-50 text-slate-600 border-slate-200",
};

const RISK_LABEL_STYLES = {
  sanction: "bg-red-100 text-red-800 border-red-300",
  sanctions: "bg-red-100 text-red-800 border-red-300",
  crime: "bg-rose-50 text-rose-700 border-rose-200",
  pep: "bg-violet-50 text-violet-700 border-violet-200",
  adversemedia: "bg-amber-50 text-amber-700 border-amber-200",
};

const formatLabel = (str) =>
  (str || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const riskChipCls = (label) =>
  RISK_LABEL_STYLES[(label || "").toLowerCase()] ?? "bg-slate-100 text-slate-600 border-slate-200";

const formatSourceDate = (raw) => {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? String(raw).split(" ")[0] : dateShowFormat(d);
};

const GRID = "grid grid-cols-[28px_28px_minmax(170px,1.5fr)_minmax(150px,1.3fr)_96px_150px_110px_140px] gap-3";

// ─── Expanded detail ─────────────────────────────────────────────────────────

const DetailField = ({ label, children }) => (
  <div>
    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="text-xs text-slate-700">{children ?? "—"}</div>
  </div>
);

const MatchDetail = ({ match }) => {
  const sources = match.sources || [];
  const watchlists = sources.filter((s) => s.type === "watchlist");
  const media = sources.filter((s) => s.type === "media");

  return (
    <div className="bg-slate-50/60 border-t border-slate-100 px-5 py-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <DetailField label="Relevance">{match.relevance || "—"}</DetailField>
        <DetailField label="Countries">
          {match.countries?.length ? match.countries.join(", ") : "—"}
        </DetailField>
        <DetailField label="Name Variations">
          {match.nameVariations?.length ? match.nameVariations.join(", ") : "—"}
        </DetailField>
      </div>

      {watchlists.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Watchlists</p>
          {watchlists.map((s, i) => (
            <div
              key={s.url ?? `${s.name}-${i}`}
              className="flex items-start gap-2 rounded-lg border border-slate-100 bg-white px-3 py-2"
            >
              <ListChecks className="size-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-slate-700 flex-1 break-words">{s.name || "Watchlist"}</p>
              {s.url && (
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-primary">
                  <ExternalLink className="size-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {media.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Adverse Media</p>
          {media.map((s, i) => {
            const title = s.title && s.title !== "(no title)" ? s.title : "Untitled article";
            const date = formatSourceDate(s.publishedDate);
            return (
              <div key={s.url ?? `${s.title}-${i}`} className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
                <div className="flex items-start gap-2">
                  <Newspaper className="size-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-start gap-1.5 text-xs font-semibold text-slate-800 hover:text-primary"
                        >
                          <span className="break-words">{title}</span>
                          <ExternalLink className="size-3 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
                        </a>
                      ) : (
                        <span className="text-xs font-semibold text-slate-800 break-words">{title}</span>
                      )}
                      {date && <span className="text-[10px] font-mono text-slate-400">{date}</span>}
                    </div>
                    {s.annotation && (
                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-4">{s.annotation}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Row ─────────────────────────────────────────────────────────────────────

const MatchRow = ({ match, onChange, saving, selected, onToggleSelect }) => {
  const [open, setOpen] = useState(false);
  const EntityIcon = match.entityType === "company" ? Building2 : User;

  return (
    <div className={cn("border-b border-slate-100 last:border-0", selected && "bg-primary/5")}>
      <div className={cn(GRID, "items-center px-5 py-3")}>
        {/* Select */}
        <span className="flex items-center justify-center">
          <Checkbox
            checked={selected}
            onCheckedChange={() => onToggleSelect(match._id)}
            aria-label={`Select ${match.name || "match"}`}
          />
        </span>

        {/* Expand */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex size-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100"
          aria-label={open ? "Collapse" : "Expand"}
        >
          <ChevronRight className={cn("size-4 transition-transform", open && "rotate-90")} />
        </button>

        {/* Name */}
        <button type="button" onClick={() => setOpen((v) => !v)} className="min-w-0 text-left group">
          <div className="flex items-center gap-1.5">
            <EntityIcon className="size-3.5 text-slate-400 shrink-0" />
            <p className="text-sm font-semibold text-slate-800 truncate group-hover:underline">{match.name || "Unknown"}</p>
          </div>
          <p className="text-[10px] font-mono text-slate-400 truncate">Match ID: {match.matchId}</p>
          <div className="mt-1 flex flex-wrap gap-1">
            {(match.riskLabels || []).map((l) => (
              <Badge key={l} variant="outline" className={cn("text-[9px] px-1 py-0 font-medium", riskChipCls(l))}>
                {formatLabel(l)}
              </Badge>
            ))}
          </div>
        </button>

        {/* Categories */}
        <div className="flex flex-wrap gap-1 content-start">
          {match.categories?.length ? (
            match.categories.map((c, i) => (
              <span
                key={`${c}-${i}`}
                className="rounded bg-slate-100 text-slate-600 px-1.5 py-0.5 text-[10px] max-w-[180px] truncate"
                title={c}
              >
                {c}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-300">—</span>
          )}
        </div>

        {/* Whitelisted */}
        <Select
          value={match.whitelisted ? "yes" : "no"}
          onValueChange={(v) => onChange(match._id, { whitelisted: v === "yes" })}
          disabled={saving}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WHITELIST_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Match status */}
        <Select
          value={match.matchStatus || "unknown"}
          onValueChange={(v) => onChange(match._id, { matchStatus: v })}
          disabled={saving}
        >
          <SelectTrigger className={cn("h-8 text-xs font-medium", MATCH_STATUS_STYLES[match.matchStatus])}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MATCH_STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className={cn("text-xs", MATCH_STATUS_STYLES[o.value])}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Risk level */}
        <Select
          value={match.riskLevel || "none"}
          onValueChange={(v) => onChange(match._id, { riskLevel: v === "none" ? "" : v })}
          disabled={saving}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RISK_LEVEL_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <div className="min-w-0">
          {match.reviewStatus === "reviewed" ? (
            <>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Reviewed
              </span>
              {match.reviewedAt && (
                <p className="text-[10px] text-slate-400 mt-0.5">{dateShowFormatWithTime(match.reviewedAt)}</p>
              )}
              {match.reviewedBy?.name && (
                <p className="text-[10px] text-slate-400 truncate">by {match.reviewedBy.name}</p>
              )}
            </>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <span className="size-1.5 rounded-full bg-slate-300" />
              Pending
            </span>
          )}
        </div>
      </div>

      {open && <MatchDetail match={match} />}
    </div>
  );
};

// ─── Main ────────────────────────────────────────────────────────────────────

export const AmlMatchesTable = ({ customerId }) => {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [summary, setSummary] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const [open, setOpen] = useState(true);

  // ── Bulk selection / disposition ──────────────────────────────────────────
  const [selected, setSelected] = useState(() => new Set());
  const [bulkMatchStatus, setBulkMatchStatus] = useState(KEEP);
  const [bulkRiskLevel, setBulkRiskLevel] = useState(KEEP);
  const [bulkWhitelist, setBulkWhitelist] = useState(KEEP);
  const [bulkSaving, setBulkSaving] = useState(false);

  const load = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const res = await getAmlMatches(customerId);
      if (res?.success) {
        setMatches(res.data || []);
        setSummary(res.summary || null);
      }
    } catch (_) {
      // surfaced via empty state
    } finally {
      setLoading(false);
      setSelected(new Set()); // drop any stale selection after a (re)load
    }
  }, [customerId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleChange = async (id, patch) => {
    // optimistic update
    setMatches((prev) => prev.map((m) => (m._id === id ? { ...m, ...patch } : m)));
    setSavingId(id);
    try {
      const res = await updateAmlMatch(id, patch);
      if (res?.success) {
        setMatches((prev) => prev.map((m) => (m._id === id ? res.data : m)));
        if (res.amlStatus) setSummary((s) => (s ? { ...s, amlStatus: res.amlStatus } : s));
      } else {
        load(); // reconcile on failure
      }
    } catch (_) {
      load();
    } finally {
      setSavingId(null);
    }
  };

  // ── Selection helpers ──────────────────────────────────────────────────────
  const allIds = matches.map((m) => m._id);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const partiallySelected = !allSelected && allIds.some((id) => selected.has(id));

  const toggleOne = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(allIds));

  const bulkDirty =
    bulkMatchStatus !== KEEP || bulkRiskLevel !== KEEP || bulkWhitelist !== KEEP;

  const buildBulkPatch = () => {
    const patch = {};
    if (bulkMatchStatus !== KEEP) patch.matchStatus = bulkMatchStatus;
    if (bulkRiskLevel !== KEEP) patch.riskLevel = bulkRiskLevel === "none" ? "" : bulkRiskLevel;
    if (bulkWhitelist !== KEEP) patch.whitelisted = bulkWhitelist === "yes";
    return patch;
  };

  const resetBulkFields = () => {
    setBulkMatchStatus(KEEP);
    setBulkRiskLevel(KEEP);
    setBulkWhitelist(KEEP);
  };

  const handleBulkApply = async () => {
    const ids = [...selected];
    const patch = buildBulkPatch();
    if (ids.length === 0 || Object.keys(patch).length === 0) return;

    const idSet = new Set(ids);
    setBulkSaving(true);
    // optimistic — apply the patch + mark reviewed for the selected rows
    setMatches((prev) =>
      prev.map((m) => (idSet.has(m._id) ? { ...m, ...patch, reviewStatus: "reviewed" } : m)),
    );
    try {
      const res = await bulkUpdateAmlMatches(ids, patch);
      if (res?.success) {
        const byId = new Map((res.data || []).map((m) => [m._id, m]));
        setMatches((prev) => prev.map((m) => byId.get(m._id) || m));
        if (res.amlStatus) setSummary((s) => (s ? { ...s, amlStatus: res.amlStatus } : s));
        setSelected(new Set());
        resetBulkFields();
      } else {
        load(); // reconcile on failure
      }
    } catch (_) {
      load();
    } finally {
      setBulkSaving(false);
    }
  };

  const hasMatches = matches.length > 0;
  const reviewedCount = matches.filter((m) => m.reviewStatus === "reviewed").length;
  const statusCls = AML_STATUS_STYLES[(summary?.amlStatus || "").toLowerCase()] ?? AML_STATUS_STYLES.pending;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Header — click to collapse/expand */}
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4 cursor-pointer transition-colors hover:bg-slate-50/70"
      >
        <ChevronDown
          className={cn("size-4 text-slate-400 transition-transform", !open && "-rotate-90")}
        />
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg flex-shrink-0",
            hasMatches ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500",
          )}
        >
          {hasMatches ? <ShieldAlert className="size-5" /> : <CheckCircle2 className="size-5" />}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900">AML Screening</h3>
          <p className="text-xs text-slate-500">
            {loading
              ? "Loading matches…"
              : hasMatches
                ? `${summary?.total ?? matches.length} match${matches.length > 1 ? "es" : ""} · ${reviewedCount} reviewed`
                : "No matches found"}
            {summary?.vendor && <span className="text-slate-400"> · {summary.vendor}</span>}
            {summary?.checkedAt && <span className="text-slate-400"> · Checked {dateShowFormat(summary.checkedAt)}</span>}
          </p>
        </div>
        {summary?.amlStatus && (
          <Badge variant="outline" className={cn("ml-auto text-xs px-2.5 py-1", statusCls)}>
            {formatLabel(summary.amlStatus)}
          </Badge>
        )}
      </div>

      {open && (
        <>
      {/* Bulk disposition bar — shown once one or more matches are selected */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-primary/5 px-5 py-2.5">
          <span className="text-xs font-semibold text-slate-700">
            {selected.size} selected
          </span>
          <span className="mx-1 h-5 w-px bg-slate-200" />

          <Select value={bulkMatchStatus} onValueChange={setBulkMatchStatus} disabled={bulkSaving}>
            <SelectTrigger className={cn("h-8 w-[150px] text-xs font-medium", MATCH_STATUS_STYLES[bulkMatchStatus])}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BULK_MATCH_STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className={cn("text-xs", MATCH_STATUS_STYLES[o.value])}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bulkRiskLevel} onValueChange={setBulkRiskLevel} disabled={bulkSaving}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BULK_RISK_LEVEL_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={bulkWhitelist} onValueChange={setBulkWhitelist} disabled={bulkSaving}>
            <SelectTrigger className="h-8 w-[120px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BULK_WHITELIST_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            type="button"
            onClick={handleBulkApply}
            disabled={bulkSaving || !bulkDirty}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {bulkSaving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="size-3.5" />
            )}
            Apply to selected
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            disabled={bulkSaving}
            className="inline-flex h-8 items-center rounded-md px-2 text-xs text-slate-500 hover:bg-slate-100 disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-400 gap-2">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm">Loading AML matches…</span>
        </div>
      ) : !hasMatches ? (
        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
          <ShieldAlert className="size-8 mb-2 opacity-40" />
          <p className="text-sm">No AML hits recorded for this customer.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[940px]">
            {/* Column header */}
            <div className={cn(GRID, "items-center px-5 py-2.5 border-b border-slate-100 bg-slate-50/70")}>
              <span className="flex items-center justify-center">
                <Checkbox
                  checked={allSelected ? true : partiallySelected ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Select all matches"
                />
              </span>
              <span />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Name</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Categories</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Whitelisted</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Match status</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Risk level</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Status</span>
            </div>
            {matches.map((m) => (
              <MatchRow
                key={m._id}
                match={m}
                onChange={handleChange}
                saving={savingId === m._id}
                selected={selected.has(m._id)}
                onToggleSelect={toggleOne}
              />
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default AmlMatchesTable;
