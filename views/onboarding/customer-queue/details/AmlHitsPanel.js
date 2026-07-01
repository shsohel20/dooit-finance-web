"use client";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  Newspaper,
  ListChecks,
  ExternalLink,
  ChevronDown,
  User,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { cn, dateShowFormat } from "@/lib/utils";

// ─── Config ──────────────────────────────────────────────────────────────────

// Risk-label → chip style. Keys are matched case-insensitively.
const RISK_LABEL_STYLES = {
  sanction: "bg-red-100 text-red-800 border-red-300",
  sanctions: "bg-red-100 text-red-800 border-red-300",
  crime: "bg-rose-50 text-rose-700 border-rose-200",
  criminal: "bg-rose-50 text-rose-700 border-rose-200",
  pep: "bg-violet-50 text-violet-700 border-violet-200",
  adversemedia: "bg-amber-50 text-amber-700 border-amber-200",
  warning: "bg-orange-50 text-orange-700 border-orange-200",
  fitnessprobity: "bg-orange-50 text-orange-700 border-orange-200",
};

const AML_STATUS_STYLES = {
  clear: "bg-emerald-50 text-emerald-700 border-emerald-200",
  yellow: "bg-amber-50 text-amber-700 border-amber-200",
  flagged: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-slate-50 text-slate-600 border-slate-200",
};

// "adverseMedia" → "Adverse Media"
const formatRiskLabel = (label) =>
  (label || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const riskChipCls = (label) =>
  RISK_LABEL_STYLES[(label || "").toLowerCase()] ??
  "bg-slate-100 text-slate-600 border-slate-200";

// publishedDate arrives as "2014-02-03 00:00:00" — show only the date part
const formatSourceDate = (raw) => {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? String(raw).split(" ")[0] : dateShowFormat(d);
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const RiskChips = ({ labels }) =>
  labels?.length > 0 ? (
    <div className="flex flex-wrap gap-1">
      {labels.map((label) => (
        <Badge
          key={label}
          variant="outline"
          className={cn("text-[10px] px-1.5 py-0 font-medium", riskChipCls(label))}
        >
          {formatRiskLabel(label)}
        </Badge>
      ))}
    </div>
  ) : null;

const WatchlistSource = ({ source }) => (
  <div className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50/70 px-3 py-2">
    <ListChecks className="size-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-slate-700 break-words">{source.name || "Watchlist"}</p>
      {source.startDate && (
        <p className="text-[10px] text-slate-400 mt-0.5">
          Since {formatSourceDate(source.startDate)}
        </p>
      )}
    </div>
    {source.url && (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 text-slate-400 hover:text-primary transition-colors"
        aria-label={`Open watchlist source: ${source.name}`}
      >
        <ExternalLink className="size-3.5" />
      </a>
    )}
  </div>
);

const MediaSource = ({ source }) => {
  const date = formatSourceDate(source.publishedDate);
  const title = source.title && source.title !== "(no title)" ? source.title : "Untitled article";

  const Heading = source.url ? (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-start gap-1.5 text-xs font-semibold text-slate-800 hover:text-primary transition-colors"
    >
      <span className="break-words">{title}</span>
      <ExternalLink className="size-3 shrink-0 mt-0.5 opacity-60 group-hover:opacity-100" />
    </a>
  ) : (
    <span className="text-xs font-semibold text-slate-800 break-words">{title}</span>
  );

  return (
    <div className="rounded-lg border border-slate-100 bg-white px-3 py-2.5">
      <div className="flex items-start gap-2">
        <Newspaper className="size-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {Heading}
            {date && <span className="text-[10px] font-mono text-slate-400">{date}</span>}
          </div>
          {source.annotation && (
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-4">
              {source.annotation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const HitCard = ({ hit, defaultOpen }) => {
  const [open, setOpen] = useState(!!defaultOpen);

  const sources = hit.sources || [];
  const watchlists = sources.filter((s) => s.type === "watchlist");
  const media = sources.filter((s) => s.type === "media");
  const EntityIcon = hit.entityType === "company" ? Building2 : User;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50/70 transition-colors"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-red-50 text-red-500 flex-shrink-0">
          <EntityIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-slate-900 truncate">{hit.name || "Unknown"}</p>
            {hit.entityType && (
              <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                {hit.entityType}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <RiskChips labels={hit.riskLabels} />
            <span className="text-[10px] text-slate-400">
              {watchlists.length > 0 && `${watchlists.length} watchlist${watchlists.length > 1 ? "s" : ""}`}
              {watchlists.length > 0 && media.length > 0 && " • "}
              {media.length > 0 && `${media.length} article${media.length > 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-slate-400 flex-shrink-0 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (watchlists.length > 0 || media.length > 0) && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-3 bg-slate-50/40">
          {watchlists.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Watchlists
              </p>
              {watchlists.map((s, i) => (
                <WatchlistSource key={s.url ?? `${s.name}-${i}`} source={s} />
              ))}
            </div>
          )}
          {media.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                Adverse Media
              </p>
              {media.map((s, i) => (
                <MediaSource key={s.url ?? `${s.title}-${i}`} source={s} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main panel ──────────────────────────────────────────────────────────────

export const AmlHitsPanel = ({
  hits = [],
  riskLabels = [],
  status,
  vendor,
  checkedAt,
}) => {
  const hasHits = hits?.length > 0;
  const statusCls = AML_STATUS_STYLES[(status || "").toLowerCase()] ?? AML_STATUS_STYLES.pending;

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-lg flex-shrink-0",
            hasHits ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500",
          )}
        >
          {hasHits ? <ShieldAlert className="size-5" /> : <CheckCircle2 className="size-5" />}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900">AML Screening</h3>
          <p className="text-xs text-slate-500">
            {hasHits ? `${hits.length} potential match${hits.length > 1 ? "es" : ""}` : "No matches found"}
            {vendor && <span className="text-slate-400"> • {vendor}</span>}
            {checkedAt && (
              <span className="text-slate-400"> • Checked {dateShowFormat(checkedAt)}</span>
            )}
          </p>
        </div>
        {status && (
          <Badge variant="outline" className={cn("ml-auto text-xs px-2.5 py-1", statusCls)}>
            {formatRiskLabel(status)}
          </Badge>
        )}
      </div>

      {/* Overall risk labels */}
      {riskLabels?.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            Risk Labels
          </span>
          <RiskChips labels={riskLabels} />
        </div>
      )}

      {/* Hits */}
      <div className="px-5 py-4">
        {hasHits ? (
          <div className="space-y-3">
            {hits.map((hit, i) => (
              <HitCard key={hit.id ?? `${hit.name}-${i}`} hit={hit} defaultOpen={i === 0} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <ShieldAlert className="size-8 mb-2 opacity-40" />
            <p className="text-sm">No AML hits recorded for this customer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmlHitsPanel;
