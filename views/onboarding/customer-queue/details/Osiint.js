"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Crosshair,
  Database,
  FileSearch,
  Fingerprint,
  Flag,
  Lightbulb,
  ListChecks,
  Loader2,
  MapPin,
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
      panel: "border-red-200 bg-red-50/60",
    };
  }
  if (l === "medium") {
    return {
      badge: "bg-amber-50 text-amber-700 border-amber-200",
      bar: "bg-amber-500",
      icon: "text-amber-600",
      panel: "border-amber-200 bg-amber-50/60",
    };
  }
  if (l === "low") {
    return {
      badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
      bar: "bg-emerald-500",
      icon: "text-emerald-600",
      panel: "border-emerald-200 bg-emerald-50/60",
    };
  }
  return {
    badge: "bg-slate-50 text-slate-600 border-slate-200",
    bar: "bg-slate-400",
    icon: "text-slate-500",
    panel: "border-slate-200 bg-slate-50/60",
  };
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

function SectionCard({ icon: Icon, title, children, iconClassName, accent }) {
  return (
    <Card className="border border-border shadow-sm gap-0 py-0 overflow-hidden">
      <CardHeader className={cn("px-4 py-3 border-b border-border/70", accent || "bg-slate-50/80")}>
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
          <span className="inline-flex size-7 items-center justify-center rounded-md bg-white border border-border shadow-sm">
            <Icon className={cn("size-3.5", iconClassName || "text-primary")} />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4">{children}</CardContent>
    </Card>
  );
}

function BodyText({ children }) {
  return <p className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">{children}</p>;
}

export function Osiint({ data, details }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [screenshots, setScreenshots] = useState(null);
  console.log(" screenshots", screenshots);
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
        const screenshots = await getOSINTScreenshots(entityType, id);
        if (!cancelled) {
          setReportData(response);
          setScreenshots(screenshots);
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
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-500">
        <Loader2 className="size-8 animate-spin text-primary" />
        <div className="flex items-center gap-2 text-sm">
          <Radar className="size-4" />
          Gathering open-source intelligence…
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-red-50 border border-red-100">
          <AlertTriangle className="size-5 text-red-600" />
        </div>
        <p className="text-sm font-medium text-slate-800">Unable to load OSINT report</p>
        <p className="text-xs text-slate-500 max-w-sm">{error}</p>
      </div>
    );
  }

  if (!payload || !report) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-slate-50 border border-slate-200">
          <SearchX className="size-5 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-800">No OSINT report available</p>
        <p className="text-xs text-slate-500">
          Run an OSINT scan to generate intelligence for this entity.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border border-border shadow-sm gap-0 py-0 overflow-hidden">
        <div className={cn("h-1.5 w-full", styles.bar)} />
        <CardContent className="px-5 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3 min-w-0">
              <div className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/15">
                <Fingerprint className="size-5 text-primary" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900 truncate">
                    {payload.entity_name || details?.fullName || "Unknown Entity"}
                  </h2>
                  {riskLevel && (
                    <Badge className={cn("border font-semibold", styles.badge)}>
                      <ShieldAlert className="size-3" />
                      {riskLevel} RISK
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <UserRound className="size-3.5 text-slate-400" />
                    {formatEntityType(payload.entity_type)}
                  </span>
                  {payload.entity_id && (
                    <span className="inline-flex items-center gap-1.5 font-mono text-[11px]">
                      <FileSearch className="size-3.5 text-slate-400" />
                      {payload.entity_id}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Badge className={cn("border", status.badge)}>
                <StatusIcon
                  className={cn(
                    "size-3",
                    (payload.status || "").toLowerCase().includes("process") && "animate-spin",
                  )}
                />
                {formatEntityType(payload.status || "Unknown")}
              </Badge>
              <Badge className="border bg-slate-50 text-slate-600 border-slate-200">
                <Radar className="size-3" />
                OSINT Assessment
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment — prominent */}
      {report.risk_assessment && (
        <Card className={cn("border shadow-sm gap-0 py-0 overflow-hidden", styles.panel)}>
          <CardContent className="px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-white border border-border shadow-sm">
                <Scale className={cn("size-4", styles.icon)} />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Risk Assessment
                  </p>
                  {riskLevel && (
                    <Badge className={cn("border font-semibold", styles.badge)}>
                      <Flag className="size-3" />
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

      {/* Narrative sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {report.introduction && (
          <SectionCard
            icon={BookOpen}
            title="Introduction"
            iconClassName="text-sky-600"
            accent="bg-sky-50/50"
          >
            <BodyText>{report.introduction}</BodyText>
          </SectionCard>
        )}

        {report.area_of_interest && (
          <SectionCard
            icon={Crosshair}
            title="Area of Interest"
            iconClassName="text-violet-600"
            accent="bg-violet-50/50"
          >
            <BodyText>{report.area_of_interest}</BodyText>
          </SectionCard>
        )}

        {report.data_collection && (
          <SectionCard
            icon={Database}
            title="Data Collection"
            iconClassName="text-cyan-600"
            accent="bg-cyan-50/50"
          >
            <BodyText>{report.data_collection}</BodyText>
          </SectionCard>
        )}

        {report.analysis_and_interpretation && (
          <SectionCard
            icon={Lightbulb}
            title="Analysis & Interpretation"
            iconClassName="text-amber-600"
            accent="bg-amber-50/50"
          >
            <BodyText>{report.analysis_and_interpretation}</BodyText>
          </SectionCard>
        )}
      </div>

      {/* Key Findings */}
      {findings.length > 0 && (
        <SectionCard
          icon={ListChecks}
          title="Key Findings"
          iconClassName="text-orange-600"
          accent="bg-orange-50/50"
        >
          <ul className="space-y-2.5">
            {findings.map((finding, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-border/70 bg-slate-50/60 px-3 py-2.5"
              >
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-white border border-border text-[11px] font-semibold text-slate-500">
                  {idx + 1}
                </span>
                <div className="flex items-start gap-2 min-w-0">
                  <Target className="size-3.5 mt-0.5 shrink-0 text-orange-500" />
                  <p className="text-sm leading-relaxed text-slate-700">{finding}</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* Conclusion */}
      {report.conclusion && (
        <SectionCard
          icon={ShieldCheck}
          title="Conclusion & Recommendation"
          iconClassName="text-emerald-600"
          accent="bg-emerald-50/50"
        >
          <div className="flex items-start gap-3">
            <ClipboardList className="size-4 mt-0.5 shrink-0 text-emerald-600" />
            <BodyText>{report.conclusion}</BodyText>
          </div>
        </SectionCard>
      )}

      {/* Meta footer */}
      <div className="flex flex-wrap items-center gap-3 px-1 pb-2 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3" />
          Open-source intelligence assessment
        </span>
        <span className="inline-flex items-center gap-1.5">
          <ShieldAlert className="size-3" />
          For compliance & AML screening support
        </span>
      </div>
      {screenshots && screenshots.length > 0 && (
        <div className="flex gap-4 flex-wrap">
          {screenshots.map((screenshot, idx) => (
            <div
              key={idx}
              className="border border-border shadow-sm gap-0 py-0 overflow-hidden w-40 flex-shrink-0 rounded"
            >
              <img
                src={`data:image/png;base64,${screenshot.base64}`}
                alt={screenshot.query_text}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
