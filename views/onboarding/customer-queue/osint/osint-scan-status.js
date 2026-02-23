"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Database,
  Info,
} from "lucide-react";

const statusConfig = {
  not_run: {
    label: "Not Run",
    icon: <XCircle className="size-4" />,
    cls: "bg-muted text-muted-foreground",
  },
  in_progress: {
    label: "Scanning...",
    icon: <Loader2 className="size-4 animate-spin" />,
    cls: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Completed",
    icon: <CheckCircle2 className="size-4" />,
    cls: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  needs_review: {
    label: "Needs Review",
    icon: <AlertTriangle className="size-4" />,
    cls: "bg-amber-100 text-amber-700 border-amber-200",
  },
};

function SourcePill({ source }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
            source.hits > 0
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : source.status === "error"
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-border bg-muted/50 text-muted-foreground"
          }`}
        >
          {source.status === "checked" && source.hits > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-800">
              {source.hits}
            </span>
          )}
          {source.status === "error" && <XCircle className="size-3" />}
          {source.name}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{source.name}</p>
        <p className="text-muted-foreground">
          {source.category} &middot; {source.hits} hit
          {source.hits !== 1 ? "s" : ""} &middot; {source.lastChecked}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}

export function OsintScanStatus({ scan, onRefresh, isRefreshing }) {
  const cfg = statusConfig[scan.status] ?? statusConfig.not_run;
  const totalHits = scan.sourcesChecked.reduce((s, c) => s + c.hits, 0);

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Status bar */}
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Database className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">OSINT Scan</h3>
              <Badge variant="outline" className={cfg.cls}>
                {cfg.icon}
                {cfg.label}
              </Badge>
            </div>
            {scan.lastScanDate && (
              <p className="mt-0.5 text-xs text-muted-foreground inline-flex items-center gap-1">
                <Clock className="size-3" />
                Last run:{" "}
                {new Date(scan.lastScanDate).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {scan.scanDuration && <> &middot; Duration: {scan.scanDuration}</>}
                {scan.triggeredBy && <> &middot; Trigger: {scan.triggeredBy}</>}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              <span className="font-semibold text-foreground">{scan.sourcesChecked.length}</span>{" "}
              sources
            </span>
            <span>
              <span className="font-semibold text-foreground">{totalHits}</span> total hits
            </span>
          </div>
          <Button size="sm" onClick={onRefresh} disabled={isRefreshing} className="gap-1.5">
            {isRefreshing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            {isRefreshing ? "Scanning..." : "Run / Refresh Scan"}
          </Button>
        </div>
      </div>

      {/* Sources row */}
      <div className="border-t border-border px-5 py-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Sources Checked
          </span>
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-3 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              Databases and registries screened during the OSINT scan. Amber badges indicate hits
              requiring review.
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {scan.sourcesChecked.map((s) => (
            <SourcePill key={s.name} source={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
