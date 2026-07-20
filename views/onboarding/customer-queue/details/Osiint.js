"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Database,
  Download,
  Expand,
  FileSearch,
  Fingerprint,
  Flag,
  ImageIcon,
  Lightbulb,
  ListChecks,
  Loader2,
  Radar,
  Scale,
  SearchX,
  ShieldAlert,
  ShieldCheck,
  Target,
  UserRound,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  getOSINTdata,
  getOSINTScreenshots,
} from "@/app/dashboard/client/onboarding/customer-queue/actions";

function parseRiskLevel(riskAssessment) {
  if (!riskAssessment) return null;
  const match = String(riskAssessment).match(/^\s*(critical|high|medium|low|info)\b/i);
  return match ? match[1].toUpperCase() : null;
}

function riskStyles(level) {
  const l = (level || "").toLowerCase();
  if (l === "critical" || l === "high") {
    return {
      badge: "bg-red-50 text-red-700 border-red-200",
      bar: "bg-red-500",
      icon: "text-red-600",
      border: "border-l-red-500",
      tint: "bg-red-50/40",
      gradient: "from-red-500/10 via-red-50/30 to-white",
      ring: "ring-red-100",
      meter: "bg-red-500",
      label: "High Risk",
    };
  }
  if (l === "medium") {
    return {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      bar: "bg-amber-500",
      icon: "text-amber-600",
      border: "border-l-amber-500",
      tint: "bg-amber-50/40",
      gradient: "from-amber-500/10 via-amber-50/30 to-white",
      ring: "ring-amber-100",
      meter: "bg-amber-500",
      label: "Medium Risk",
    };
  }
  if (l === "low") {
    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-500",
      icon: "text-emerald-600",
      border: "border-l-emerald-500",
      tint: "bg-emerald-50/40",
      gradient: "from-emerald-500/10 via-emerald-50/30 to-white",
      ring: "ring-emerald-100",
      meter: "bg-emerald-500",
      label: "Low Risk",
    };
  }
  return {
    badge: "bg-slate-50 text-slate-600 border-slate-200",
    bar: "bg-slate-400",
    icon: "text-slate-500",
    border: "border-l-slate-400",
    tint: "bg-slate-50/40",
    gradient: "from-slate-500/5 via-slate-50/40 to-white",
    ring: "ring-slate-100",
    meter: "bg-slate-400",
    label: "Unclassified",
  };
}

function riskMeterWidth(level) {
  const l = (level || "").toLowerCase();
  if (l === "critical") return "100%";
  if (l === "high") return "85%";
  if (l === "medium") return "55%";
  if (l === "low") return "25%";
  return "15%";
}

function statusStyles(status) {
  const s = (status || "").toLowerCase();
  if (s === "completed" || s === "complete") {
    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Icon: CheckCircle2,
    };
  }
  if (s === "failed" || s === "error") {
    return {
      badge: "bg-red-50 text-red-700 border-red-200",
      Icon: AlertTriangle,
    };
  }
  if (s === "pending" || s === "processing" || s === "running") {
    return {
      badge: "bg-sky-50 text-sky-700 border-sky-200",
      Icon: Loader2,
    };
  }
  return {
    badge: "bg-slate-50 text-slate-600 border-slate-200",
    Icon: Radar,
  };
}

function formatEntityType(type) {
  if (!type) return "—";
  return String(type)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function SectionCard({ icon: Icon, title, children, iconClassName, iconWrapClassName, className }) {
  return (
    <Card
      className={cn(
        "gap-0 overflow-hidden border-border/70 py-0 shadow-sm ring-1 ring-black/[0.03] transition-shadow hover:shadow-md",
        className,
      )}
    >
      <CardHeader className="border-b border-border/60 bg-gradient-to-r from-muted/40 to-transparent px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-border/50 shadow-sm",
              iconWrapClassName || "bg-muted",
            )}
          >
            <Icon aria-hidden="true" className={cn("size-4", iconClassName || "text-primary")} />
          </span>
          <h3 className="text-sm font-semibold tracking-tight text-slate-800">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-4">{children}</CardContent>
    </Card>
  );
}

function BodyText({ children }) {
  return (
    <p className="text-pretty text-sm leading-7 whitespace-pre-wrap text-slate-600">{children}</p>
  );
}

function SummaryItem({ label, value, mono }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <span className="text-[11px] text-slate-500">{label}</span>
      <span
        className={cn(
          "max-w-[58%] text-right text-[11px] font-medium text-slate-800",
          mono && "font-mono text-[10px]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function ScreenshotLightbox({ screenshots, activeIndex, onClose, onNavigate }) {
  const screenshot = screenshots[activeIndex];
  const src = `data:image/png;base64,${screenshot?.base64}`;
  const total = screenshots.length;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") onNavigate(-1);
      if (event.key === "ArrowRight") onNavigate(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNavigate]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = src;
    link.download = `osint-screenshot-${activeIndex + 1}.png`;
    link.click();
  };

  return (
    <Dialog open={activeIndex >= 0} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="flex max-h-[92vh] w-[min(96vw,1100px)] max-w-none flex-col gap-0 overflow-hidden border-0 bg-slate-950 p-0 sm:max-w-none"
        showCloseButton
      >
        <DialogHeader className="border-b border-white/10 px-5 py-4 text-left">
          <DialogTitle className="text-base font-semibold text-white">
            Screenshot {activeIndex + 1} of {total}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {screenshot?.query_text || "Open-source intelligence capture"}
          </DialogDescription>
        </DialogHeader>

        <div className="relative flex min-h-0 flex-1 items-center justify-center bg-slate-950/95 p-4 sm:p-6">
          {total > 1 && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 left-3 z-10 size-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 text-white hover:bg-black/60"
                onClick={() => onNavigate(-1)}
                aria-label="Previous screenshot"
              >
                <ChevronLeft aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-3 z-10 size-10 -translate-y-1/2 rounded-full border border-white/10 bg-black/40 text-white hover:bg-black/60"
                onClick={() => onNavigate(1)}
                aria-label="Next screenshot"
              >
                <ChevronRight aria-hidden="true" />
              </Button>
            </>
          )}

          <img
            src={src}
            alt={screenshot?.query_text || `OSINT screenshot ${activeIndex + 1}`}
            className="max-h-[calc(92vh-140px)] w-auto max-w-full rounded-lg object-contain shadow-2xl ring-1 ring-white/10"
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-slate-900/80 px-5 py-3">
          <p className="truncate text-xs text-slate-400">
            {screenshot?.query_text || "No query label available"}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
            onClick={handleDownload}
          >
            <Download aria-hidden="true" className="size-3.5" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScreenshotGallery({ screenshots }) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const navigate = useCallback(
    (direction) => {
      setActiveIndex((current) => {
        if (current < 0) return current;
        return (current + direction + screenshots.length) % screenshots.length;
      });
    },
    [screenshots.length],
  );

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {screenshots.map((screenshot, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="group relative overflow-hidden rounded-xl border border-border/70 bg-white text-left shadow-sm ring-1 ring-black/[0.03] transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label={
              screenshot.query_text
                ? `View screenshot: ${screenshot.query_text}`
                : `View screenshot ${idx + 1}`
            }
          >
            <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
              <img
                src={`data:image/png;base64,${screenshot.base64}`}
                alt={screenshot.query_text || `OSINT screenshot ${idx + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  <Expand aria-hidden="true" className="size-3.5" />
                  View full size
                </span>
              </div>
              <span className="absolute top-2.5 left-2.5 rounded-md bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                #{idx + 1}
              </span>
            </div>
            {screenshot.query_text && (
              <div className="border-t border-border/60 px-3 py-2.5">
                <p className="line-clamp-2 text-xs leading-relaxed text-slate-600" title={screenshot.query_text}>
                  {screenshot.query_text}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>

      <ScreenshotLightbox
        screenshots={screenshots}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(-1)}
        onNavigate={navigate}
      />
    </>
  );
}

export function Osiint({ data, details }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screenshots, setScreenshots] = useState(null);
  const id = useSearchParams().get("id");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const getOsiintReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const entityType = "customers";
        const response = await getOSINTdata(entityType, id);
        const screenshotData = await getOSINTScreenshots(entityType, id);
        if (!cancelled) {
          setReportData(response);
          setScreenshots(screenshotData);
        }
      } catch (err) {
        if (!cancelled) setError(err?.message || "Failed to load OSINT report");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    getOsiintReport();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const payload = reportData || (data && typeof data === "object" ? data : null);
  const report = payload?.report || null;
  const riskLevel = parseRiskLevel(report?.risk_assessment);
  const styles = riskStyles(riskLevel);
  const status = statusStyles(payload?.status);
  const StatusIcon = status.Icon;
  const findings = Array.isArray(report?.key_findings) ? report.key_findings : [];

  if (loading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white py-24 text-slate-500"
      >
        <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 shadow-sm">
          <Loader2 aria-hidden="true" className="size-7 animate-spin text-primary" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium text-slate-700">Gathering open-source intelligence</p>
          <p className="text-xs text-slate-400">This may take a few moments…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-red-200 bg-gradient-to-b from-red-50/60 to-white py-20 text-center"
      >
        <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50 shadow-sm">
          <AlertTriangle aria-hidden="true" className="size-6 text-red-600" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">Unable to load OSINT report</p>
          <p className="max-w-sm text-xs text-slate-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!payload || !report) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white py-20 text-center">
        <div className="inline-flex size-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <SearchX aria-hidden="true" className="size-6 text-slate-400" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">No OSINT report available</p>
          <p className="text-xs text-slate-500">
            Run an OSINT scan to generate intelligence for this entity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="@container/osiint space-y-6">
      {/* Hero header */}
      <section
        className={cn(
          "relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br shadow-md ring-1 ring-black/[0.03]",
          styles.gradient,
        )}
      >
        <div className={cn("absolute inset-x-0 top-0 h-1", styles.bar)} aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-white/40 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative px-5 py-6 sm:px-6 sm:py-7">
          <div className="flex flex-col gap-5 @[640px]/osiint:flex-row @[640px]/osiint:items-start @[640px]/osiint:justify-between">
            <div className="flex min-w-0 items-start gap-4">
              <div
                className={cn(
                  "inline-flex size-14 shrink-0 items-center justify-center rounded-2xl border bg-white/80 shadow-sm ring-4",
                  styles.ring,
                )}
              >
                <Fingerprint aria-hidden="true" className="size-6 text-primary" />
              </div>
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-2xl font-bold tracking-tight text-slate-900">
                    {payload.entity_name || details?.fullName || "Unknown Entity"}
                  </h2>
                  {riskLevel && (
                    <Badge className={cn("border font-semibold", styles.badge)}>
                      <ShieldAlert aria-hidden="true" className="size-3" />
                      {riskLevel} RISK
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/70 px-2.5 py-1">
                    <UserRound aria-hidden="true" className="size-3.5 text-slate-400" />
                    {formatEntityType(payload.entity_type)}
                  </span>
                  {payload.entity_id && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-white/70 px-2.5 py-1 font-mono text-[11px] text-slate-600">
                      <FileSearch aria-hidden="true" className="size-3 text-slate-400" />
                      {payload.entity_id}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Badge className={cn("w-fit shrink-0 border px-3 py-1.5 text-xs", status.badge)}>
              <StatusIcon
                aria-hidden="true"
                className={cn(
                  "size-3.5",
                  (payload.status || "").toLowerCase().includes("process") && "animate-spin",
                )}
              />
              {formatEntityType(payload.status || "Unknown")}
            </Badge>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 @[900px]/osiint:grid-cols-[280px_minmax(0,1fr)]">
        {/* Sidebar summary */}
        <aside className="space-y-4 @[900px]/osiint:sticky @[900px]/osiint:top-4 @[900px]/osiint:self-start">
          <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm ring-1 ring-black/[0.03]">
            <CardHeader className="border-b border-border/60 bg-muted/30 px-4 py-3">
              <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
                Report Summary
              </p>
            </CardHeader>
            <CardContent className="divide-y divide-border/50 px-4 py-1">
              <SummaryItem label="Status" value={formatEntityType(payload.status || "Unknown")} />
              <SummaryItem label="Entity Type" value={formatEntityType(payload.entity_type)} />
              <SummaryItem
                label="Risk Level"
                value={riskLevel ? `${riskLevel}` : "Not classified"}
              />
              <SummaryItem label="Key Findings" value={findings.length} />
              <SummaryItem label="Screenshots" value={screenshots?.length || 0} />
              {payload.entity_id && (
                <SummaryItem label="Entity ID" value={payload.entity_id} mono />
              )}
            </CardContent>
          </Card>

          {riskLevel && (
            <Card className="gap-0 overflow-hidden border-border/70 py-0 shadow-sm ring-1 ring-black/[0.03]">
              <CardContent className="space-y-3 px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-700">Risk Indicator</p>
                  <span className={cn("text-[11px] font-medium", styles.icon)}>{styles.label}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", styles.meter)}
                    style={{ width: riskMeterWidth(riskLevel) }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </aside>

        {/* Main report content */}
        <main className="min-w-0 space-y-5">
          {report.risk_assessment && (
            <Card
              className={cn(
                "gap-0 overflow-hidden border-0 border-l-4 py-0 shadow-md ring-1 ring-black/[0.03]",
                styles.border,
                styles.tint,
              )}
            >
              <CardContent className="px-5 py-5 sm:px-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-white shadow-sm">
                    <Scale aria-hidden="true" className={cn("size-4.5", styles.icon)} />
                  </div>
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Risk Assessment
                      </p>
                      {riskLevel && (
                        <Badge className={cn("border font-semibold", styles.badge)}>
                          <Flag aria-hidden="true" className="size-3" />
                          {riskLevel}
                        </Badge>
                      )}
                    </div>
                    <BodyText>{report.risk_assessment}</BodyText>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-4 @[640px]/osiint:grid-cols-2">
            {report.introduction && (
              <SectionCard
                icon={BookOpen}
                title="Introduction"
                iconWrapClassName="bg-sky-50"
                iconClassName="text-sky-600"
              >
                <BodyText>{report.introduction}</BodyText>
              </SectionCard>
            )}

            {report.area_of_interest && (
              <SectionCard
                icon={Crosshair}
                title="Area of Interest"
                iconWrapClassName="bg-violet-50"
                iconClassName="text-violet-600"
              >
                <BodyText>{report.area_of_interest}</BodyText>
              </SectionCard>
            )}

            {report.data_collection && (
              <SectionCard
                icon={Database}
                title="Data Collection"
                iconWrapClassName="bg-cyan-50"
                iconClassName="text-cyan-600"
              >
                <BodyText>{report.data_collection}</BodyText>
              </SectionCard>
            )}

            {report.analysis_and_interpretation && (
              <SectionCard
                icon={Lightbulb}
                title="Analysis & Interpretation"
                iconWrapClassName="bg-amber-50"
                iconClassName="text-amber-600"
              >
                <BodyText>{report.analysis_and_interpretation}</BodyText>
              </SectionCard>
            )}
          </div>

          {findings.length > 0 && (
            <SectionCard
              icon={ListChecks}
              title={`Key Findings (${findings.length})`}
              iconWrapClassName="bg-orange-50"
              iconClassName="text-orange-600"
            >
              <ol className="relative space-y-0">
                {findings.map((finding, idx) => (
                  <li key={idx} className="relative flex gap-4 pb-5 last:pb-0">
                    {idx < findings.length - 1 && (
                      <span
                        className="absolute top-8 left-3 h-[calc(100%-12px)] w-px bg-border"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-[1] inline-flex size-6 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-orange-50 text-[11px] font-bold text-orange-700">
                      {idx + 1}
                    </span>
                    <div className="min-w-0 flex-1 rounded-xl border border-border/70 bg-gradient-to-br from-orange-50/40 to-white px-4 py-3 shadow-sm">
                      <div className="flex items-start gap-2">
                        <Target
                          aria-hidden="true"
                          className="mt-0.5 size-3.5 shrink-0 text-orange-500"
                        />
                        <p className="text-sm leading-relaxed text-slate-700">{finding}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </SectionCard>
          )}

          {report.conclusion && (
            <SectionCard
              icon={ShieldCheck}
              title="Conclusion & Recommendation"
              iconWrapClassName="bg-emerald-50"
              iconClassName="text-emerald-600"
              className="border-emerald-100/80"
            >
              <BodyText>{report.conclusion}</BodyText>
            </SectionCard>
          )}

          {screenshots && screenshots.length > 0 && (
            <SectionCard
              icon={ImageIcon}
              title={`Evidence Screenshots (${screenshots.length})`}
              iconWrapClassName="bg-slate-100"
              iconClassName="text-slate-600"
            >
              <p className="mb-4 text-xs text-slate-500">
                Click any capture to open a full-size preview. Use arrow keys to navigate inside the
                viewer.
              </p>
              <ScreenshotGallery screenshots={screenshots} />
            </SectionCard>
          )}
        </main>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 text-[11px] text-slate-500">
        <ShieldAlert aria-hidden="true" className="size-3.5 shrink-0 text-slate-400" />
        Generated for compliance &amp; AML screening support — not a substitute for manual due
        diligence.
      </div>
    </div>
  );
}
