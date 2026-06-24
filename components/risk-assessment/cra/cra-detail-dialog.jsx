"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Loader2,
  ShieldCheck,
  ShieldOff,
  Lock,
  History,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  AlertCircle,
  Download,
  Save,
  ChartBar,
  User,
  Calendar,
  Globe,
  Building2,
  Clock,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getAssessmentById,
  getAuditTrail,
  ecddApprove,
  ecddDecline,
  updateAssessmentNotes,
  getAuditTrailExportUrl,
} from "@/app/dashboard/client/risk-assessment/actions";
import {
  RISK_BADGE_VARIANT,
  BAND_BANNER,
  SCORE_AXIS_MAX,
  humanFactor,
} from "./constants";

// ── Constants ──────────────────────────────────────────────────────────────────

const AUDIT_CHIP = {
  ESCALATION_RAISED: "bg-red-50 text-red-700 border-red-200",
  ECDD_DECLINED: "bg-red-50 text-red-700 border-red-200",
  CLIENT_OFFBOARDED: "bg-red-50 text-red-700 border-red-200",
  ECDD_APPROVED: "bg-green-50 text-green-700 border-green-200",
  CRA_CREATED: "bg-blue-50 text-blue-700 border-blue-200",
  CRA_NOTES_UPDATED: "bg-purple-50 text-purple-700 border-purple-200",
};

const AUDIT_DOT = {
  ESCALATION_RAISED: "bg-red-400",
  ECDD_DECLINED: "bg-red-400",
  CLIENT_OFFBOARDED: "bg-red-500",
  ECDD_APPROVED: "bg-green-500",
  CRA_CREATED: "bg-blue-400",
  CRA_NOTES_UPDATED: "bg-purple-400",
};

// Segmented score bar: Low 0–17, Med 18–20, High 21–99, Unacceptable 100+
const BAND_SEGMENTS = [
  { label: "Low", width: (17 / SCORE_AXIS_MAX) * 100, color: "bg-green-400" },
  { label: "Med", width: (3 / SCORE_AXIS_MAX) * 100, color: "bg-yellow-400" },
  { label: "High", width: (79 / SCORE_AXIS_MAX) * 100, color: "bg-orange-400" },
  { label: "Unacceptable", width: (11 / SCORE_AXIS_MAX) * 100, color: "bg-red-500" },
];

const FACTOR_COLORS = [
  "#0ea5e9", "#8b5cf6", "#ec4899", "#f59e0b",
  "#10b981", "#6366f1", "#14b8a6", "#f97316",
  "#ef4444", "#a3e635", "#06b6d4",
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Color style for a factor card based on its raw score (1–5, or 100 for UHRC)
function factorScoreStyle(score) {
  if (!score || score === 0)
    return { pill: "bg-gray-50 text-gray-400 border-gray-200", bar: "bg-gray-200" };
  if (score >= 100)
    return { pill: "bg-red-100 text-red-800 border-red-300", bar: "bg-red-600" };
  if (score >= 5)
    return { pill: "bg-red-50 text-red-700 border-red-200", bar: "bg-red-500" };
  if (score >= 4)
    return { pill: "bg-orange-50 text-orange-700 border-orange-200", bar: "bg-orange-400" };
  if (score >= 3)
    return { pill: "bg-amber-50 text-amber-700 border-amber-200", bar: "bg-amber-400" };
  if (score >= 2)
    return { pill: "bg-yellow-50 text-yellow-700 border-yellow-200", bar: "bg-yellow-400" };
  return { pill: "bg-green-50 text-green-700 border-green-200", bar: "bg-green-500" };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function MetaChip({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </div>
  );
}

function FactorCard({ factorKey, detail }) {
  const { score = 0, value = "", ecddOverride = false, band } = detail ?? {};
  const style = factorScoreStyle(score);
  // Jurisdiction UHRC scores 100; all other factors max at 5
  const barMax = score >= 100 ? 100 : 5;
  const barPct = Math.min((score / barMax) * 100, 100);
  const empty = !value;

  return (
    <div
      className={cn(
        "relative rounded-xl border p-3 bg-card flex flex-col gap-2 transition-shadow hover:shadow-sm",
        ecddOverride ? "border-amber-300 bg-amber-50/40" : "border-border"
      )}
    >
      {ecddOverride && (
        <span className="absolute -top-2 right-2 flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-300">
          <AlertTriangle className="w-2.5 h-2.5" /> ECDD
        </span>
      )}
      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
        {humanFactor(factorKey)}
        {band && (
          <span className="font-medium normal-case tracking-normal opacity-60">({band})</span>
        )}
      </p>
      <p
        className={cn(
          "text-xs font-semibold leading-snug line-clamp-2 flex-1",
          empty ? "text-muted-foreground/50 italic" : "text-foreground"
        )}
      >
        {empty ? "Not assessed" : value}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full", style.bar)}
            style={{ width: `${barPct}%` }}
          />
        </div>
        <span
          className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 min-w-[30px] text-center",
            style.pill
          )}
        >
          {score > 0 ? `+${score}` : "—"}
        </span>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function CraDetailDialog({ assessmentId, open, onOpenChange, onChanged }) {
  const [loading, setLoading] = useState(true);
  const [assessment, setAssessment] = useState(null);
  const [audit, setAudit] = useState([]);
  const [decision, setDecision] = useState("");
  const [ecddReportId, setEcddReportId] = useState("");
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [processing, setProcessing] = useState(false);

  const load = useCallback(async () => {
    if (!assessmentId) return;
    setLoading(true);
    try {
      const [res, trail] = await Promise.all([
        getAssessmentById(assessmentId),
        getAuditTrail(assessmentId),
      ]);
      if (res?.success) setAssessment(res.data);
      setAudit(trail?.data || []);
    } catch {
      toast.error("Failed to load assessment");
    } finally {
      setLoading(false);
    }
  }, [assessmentId]);

  useEffect(() => {
    if (open) {
      setDecision("");
      setEcddReportId("");
      setNotes("");
      load();
    }
  }, [open, load]);

  useEffect(() => {
    if (assessment?.notes) setNotes(assessment.notes);
  }, [assessment]);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      const r = await ecddApprove(assessmentId, {
        decision: decision || "Approved by Compliance Officer",
        ecddReportId: ecddReportId.trim() || undefined,
      });
      if (r?.success) {
        toast.success("ECDD approved — service delivery gate lifted");
        await load();
        onChanged?.();
      } else toast.error(r?.message || "Failed to approve ECDD");
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!decision.trim()) {
      toast.error("Please enter a reason before declining");
      return;
    }
    setProcessing(true);
    try {
      const r = await ecddDecline(assessmentId, {
        decision,
        ecddReportId: ecddReportId.trim() || undefined,
      });
      if (r?.success) {
        toast.success(
          r.customerOffboarded
            ? "ECDD declined — customer offboarded and service suspended"
            : "ECDD declined — customer service suspended"
        );
        await load();
        onChanged?.();
      } else toast.error(r?.message || "Failed to decline ECDD");
    } finally {
      setProcessing(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!notes.trim()) {
      toast.error("Notes cannot be empty");
      return;
    }
    setSavingNotes(true);
    try {
      const r = await updateAssessmentNotes(assessmentId, notes.trim());
      if (r?.success) {
        toast.success("Assessment notes saved");
        await load();
        onChanged?.();
      } else toast.error(r?.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const triggerBlobDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Derived values — defined before handleDownloadPdf so the closure sees them
  const a = assessment;
  const breakdown = a?.assessment || {};
  const prev = a?.previousAssessment;
  const delta = prev ? (a?.riskScore ?? 0) - (prev.riskScore ?? 0) : null;
  const scorePct = a ? Math.min((a.riskScore / SCORE_AXIS_MAX) * 100, 99.5) : 0;
  const ecddDeclined = a?.cddGate && a?.ecddStatus === "Declined";

  // Pre-compute factor entries with stable colors for composition bar + legend
  const scoredFactors = Object.entries(breakdown)
    .map(([key, detail], idx) => ({
      key,
      detail,
      score: detail?.score ?? 0,
      color: FACTOR_COLORS[idx % FACTOR_COLORS.length],
    }))
    .filter((f) => f.score > 0);

  const handleDownloadPdf = async () => {
    try {
      const exportUrl = await getAuditTrailExportUrl(assessmentId);
      const res = await fetch(exportUrl, { credentials: "include" });
      if (res.ok) {
        triggerBlobDownload(
          await res.blob(),
          `CRA_Audit_${a?.uid || assessmentId}.pdf`
        );
      } else {
        toast.error("Failed to download audit trail PDF");
      }
    } catch {
      toast.error("Failed to download audit trail PDF");
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full sm:!max-w-2xl lg:!max-w-3xl flex flex-col h-full">

        {/* ── Header ── */}
        <DrawerHeader className="px-5 py-4 border-b bg-card shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <DrawerTitle className="text-base font-bold text-foreground capitalize leading-tight">
                {a?.customerName || "Risk Assessment"}
              </DrawerTitle>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2">
                {a?.uid && (
                  <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {a.uid}
                  </span>
                )}
                {a?.customerUid && (
                  <MetaChip icon={User}>Customer {a.customerUid}</MetaChip>
                )}
                {a?.inputSnapshot?.type && (
                  <MetaChip icon={User}>{a.inputSnapshot.type}</MetaChip>
                )}
                {a?.inputSnapshot?.country && (
                  <MetaChip icon={Globe}>{a.inputSnapshot.country}</MetaChip>
                )}
                {a?.entityType && (
                  <MetaChip icon={Building2}>{a.entityType}</MetaChip>
                )}
              </div>
            </div>
            {a?.riskLabel && (
              <Badge
                variant={RISK_BADGE_VARIANT[a.riskLabel]}
                className="shrink-0 text-sm px-3 py-1"
              >
                {a.riskLabel}
              </Badge>
            )}
          </div>
          <DrawerDescription className="sr-only">
            Customer risk assessment detail — score, ECDD gate and audit trail
          </DrawerDescription>
        </DrawerHeader>

        {/* ── Body ── */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader2 className="w-7 h-7 animate-spin text-primary mx-auto" />
              <p className="text-xs text-muted-foreground">Loading assessment…</p>
            </div>
          </div>
        ) : !a ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Assessment not found.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">

            {/* ── ECDD Gate ── */}
            {a.cddGate && a.ecddStatus !== "Approved" && (
              <div
                className={cn(
                  "rounded-xl border p-4",
                  ecddDeclined
                    ? "bg-red-50 border-red-300"
                    : "bg-amber-50 border-amber-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      ecddDeclined ? "bg-red-100" : "bg-amber-100"
                    )}
                  >
                    <Lock
                      className={cn(
                        "w-4 h-4",
                        ecddDeclined ? "text-red-600" : "text-amber-600"
                      )}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-bold mb-1",
                        ecddDeclined ? "text-red-800" : "text-amber-800"
                      )}
                    >
                      {ecddDeclined
                        ? "ECDD Declined — Service Suspended"
                        : "ECDD Gate Active — Service Delivery Blocked"}
                    </p>
                    <p
                      className={cn(
                        "text-xs leading-relaxed mb-3",
                        ecddDeclined ? "text-red-700" : "text-amber-700"
                      )}
                    >
                      {ecddDeclined
                        ? "This customer's ECDD was declined. Service delivery is suspended and the customer record has been offboarded."
                        : `Scored ${a.riskLabel} risk (${a.riskScore}/100). ECDD must be completed and approved before any designated services can be provided.`}
                    </p>

                    {ecddDeclined ? (
                      <div className="flex items-start gap-2 p-2.5 bg-red-100 rounded-lg">
                        <ShieldOff className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold text-red-800">Decline Reason</p>
                          {a.ecddDecision && (
                            <p className="text-[10px] text-red-700 mt-0.5">{a.ecddDecision}</p>
                          )}
                          {a.customer && (
                            <p className="text-[10px] font-semibold text-red-800 mt-1">
                              Customer record offboarded — removed from active flows.
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-amber-800">
                              Decision Notes{" "}
                              <span className="font-normal text-amber-600">
                                (required for Decline)
                              </span>
                            </Label>
                            <Textarea
                              value={decision}
                              onChange={(e) => setDecision(e.target.value)}
                              rows={3}
                              placeholder="Document your ECDD review rationale…"
                              className="text-xs bg-white border-amber-300 resize-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-semibold text-amber-800">
                              ECDD Report UID{" "}
                              <span className="font-normal text-amber-600">(optional)</span>
                            </Label>
                            <Input
                              value={ecddReportId}
                              onChange={(e) => setEcddReportId(e.target.value)}
                              placeholder="ECDD_1749722000000"
                              className="text-xs h-9 bg-white border-amber-300"
                            />
                            <p className="text-[10px] text-amber-700/70">
                              Links the completed ECDD form to this assessment
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 gap-1.5 h-9"
                            disabled={processing}
                            onClick={handleApprove}
                          >
                            {processing ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5" />
                            )}
                            Approve ECDD
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1.5 h-9"
                            disabled={processing}
                            onClick={handleDecline}
                          >
                            {processing ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <ShieldOff className="w-3.5 h-3.5" />
                            )}
                            Decline ECDD
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ECDD Approved banner */}
            {a.ecddStatus === "Approved" && (
              <div className="flex items-center gap-3 p-4 rounded-xl border border-green-300 bg-green-50">
                <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    ECDD Approved — Service delivery permitted
                  </p>
                  {a.ecddDecision && (
                    <p className="text-[11px] text-green-700 mt-0.5">{a.ecddDecision}</p>
                  )}
                  {a.ecddReport && (
                    <p className="text-[10px] text-green-700 mt-0.5 font-mono">
                      Report: {a.ecddReport.uid}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ── Risk Score Hero ── */}
            <Card className={cn("border-2 overflow-hidden", BAND_BANNER[a.riskLabel])}>
              <CardContent className="p-5">

                {/* Score + risk badge */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-6xl font-black leading-none tracking-tight text-foreground">
                        {a.riskScore}
                      </span>
                      <span className="text-xl text-muted-foreground">/100</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Total Risk Score</p>
                    {prev && (
                      <div className="flex items-center gap-2 mt-2.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded",
                            delta > 0
                              ? "bg-red-100 text-red-700"
                              : delta < 0
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {delta > 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : delta < 0 ? (
                            <TrendingDown className="w-3 h-3" />
                          ) : (
                            <Minus className="w-3 h-3" />
                          )}
                          {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : "±0"}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          vs {prev.riskLabel} ({prev.riskScore}) · {fmtDate(prev.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <Badge
                      variant={RISK_BADGE_VARIANT[a.riskLabel]}
                      className="text-sm px-3 py-1 block"
                    >
                      {a.riskLabel}
                    </Badge>
                    {a.ecddRequired && !a.serviceBlocked && (
                      <div className="flex items-center gap-1 justify-end">
                        <AlertCircle className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] text-amber-600 font-semibold">
                          ECDD Required
                        </span>
                      </div>
                    )}
                    {a.serviceBlocked && (
                      <div className="flex items-center gap-1 justify-end">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span className="text-[10px] text-red-600 font-semibold">
                          Service Blocked
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Segmented score bar */}
                <div className="relative mb-3">
                  <div className="flex h-3 rounded-full overflow-hidden gap-px">
                    {BAND_SEGMENTS.map((seg) => (
                      <div
                        key={seg.label}
                        className={cn("h-full opacity-60", seg.color)}
                        style={{ width: `${seg.width}%` }}
                      />
                    ))}
                  </div>
                  {/* Current score marker */}
                  <div
                    className="absolute -top-0.5 -bottom-0.5 w-1 rounded-full bg-foreground/80 shadow"
                    style={{ left: `calc(${scorePct}% - 2px)` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] font-medium mb-4">
                  <span className="text-green-700">Low 0–17</span>
                  <span className="text-yellow-600">Med 18–20</span>
                  <span className="text-orange-600">High 21–99</span>
                  <span className="text-red-600">Unacceptable 100+</span>
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-3 border-t border-black/10">
                  <MetaChip icon={Calendar}>
                    Assessed {fmtDate(a.assessedAt || a.createdAt)}
                  </MetaChip>
                  {a.assessedBy?.name && (
                    <MetaChip icon={User}>{a.assessedBy.name}</MetaChip>
                  )}
                  {a.nextReviewDate && (
                    <MetaChip icon={Clock}>Review by {fmtDate(a.nextReviewDate)}</MetaChip>
                  )}
                  {a.version && <MetaChip>V{a.version}</MetaChip>}
                </div>

                {/* Rule overrides */}
                {(a.overrides || []).length > 0 && (
                  <div className="mt-4 pt-3 border-t border-black/10">
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                        {a.overrides.length} rule override
                        {a.overrides.length !== 1 ? "s" : ""} triggered
                      </p>
                    </div>
                    <ul className="space-y-1.5">
                      {a.overrides.map((o, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[11px] text-foreground/80 leading-snug"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── Factor Breakdown ── */}
            <Card className="border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ChartBar className="w-4 h-4 text-muted-foreground" />
                  Risk Factor Breakdown
                  <span className="ml-auto text-[10px] font-normal text-muted-foreground">
                    {scoredFactors.length} of {Object.keys(breakdown).length} factors scored
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {Object.entries(breakdown).map(([key, detail]) => (
                    <FactorCard key={key} factorKey={key} detail={detail} />
                  ))}
                </div>

                {/* Score composition bar */}
                {a.riskScore > 0 && scoredFactors.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
                      Score Composition
                    </p>
                    <div className="flex h-2 rounded-full overflow-hidden">
                      {scoredFactors.map((f) => (
                        <div
                          key={f.key}
                          className="h-full"
                          style={{
                            width: `${(f.score / a.riskScore) * 100}%`,
                            backgroundColor: f.color,
                          }}
                          title={`${humanFactor(f.key)}: +${f.score}`}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                      {scoredFactors.map((f) => (
                        <span
                          key={f.key}
                          className="flex items-center gap-1 text-[9px] text-muted-foreground"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: f.color }}
                          />
                          {humanFactor(f.key)} +{f.score}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* ── Assessment Notes ── */}
            <Card className="border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Assessment Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add compliance observations, risk rationale, or contextual notes…"
                  className="min-h-[90px] text-xs resize-none"
                />
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">
                    {notes !== (a?.notes || "") && notes.trim() ? "Unsaved changes" : ""}
                  </p>
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    disabled={savingNotes || !notes.trim() || notes === (a?.notes || "")}
                    className="gap-1.5 h-8"
                  >
                    {savingNotes ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Save className="w-3 h-3" />
                    )}
                    Save Notes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ── Audit Trail ── */}
            <Card className="border-muted">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <History className="w-4 h-4 text-muted-foreground" />
                    Audit Trail
                    {audit.length > 0 && (
                      <span className="text-[10px] font-normal text-muted-foreground">
                        {audit.length} event{audit.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadPdf}
                    className="h-7 gap-1.5 text-xs"
                  >
                    <Download className="w-3 h-3" />
                    PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {audit.length === 0 ? (
                  <div className="flex items-center gap-2 py-4 text-xs text-muted-foreground">
                    <History className="w-4 h-4 opacity-40" />
                    No audit entries recorded yet.
                  </div>
                ) : (
                  <div className="relative pl-7">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[11px] top-3 bottom-3 w-px bg-border" />
                    <div className="space-y-0">
                      {audit.map((e) => (
                        <div key={e._id} className="relative py-3">
                          {/* Timeline dot */}
                          <div
                            className={cn(
                              "absolute left-[-18px] top-4 w-3.5 h-3.5 rounded-full border-2 border-background z-10",
                              AUDIT_DOT[e.action] || "bg-blue-400"
                            )}
                          />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={cn(
                                  "text-[10px] px-2 py-0.5 rounded font-bold border",
                                  AUDIT_CHIP[e.action] ||
                                    "bg-blue-50 text-blue-700 border-blue-200"
                                )}
                              >
                                {e.action?.replace(/_/g, " ")}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {fmtDate(e.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-foreground">
                              <span className="font-semibold">
                                {e.actorName || "system"}
                              </span>
                              {e.actorRole && (
                                <span className="text-muted-foreground">
                                  {" "}· {e.actorRole}
                                </span>
                              )}
                            </p>
                            {(e.beforeValue || e.afterValue) && (
                              <div className="p-2 bg-muted/50 rounded-md border text-[10px] font-mono text-muted-foreground break-all">
                                {e.beforeValue && (
                                  <>
                                    <span className="text-red-500">before:</span>{" "}
                                    {JSON.stringify(e.beforeValue)}{" "}
                                  </>
                                )}
                                {e.afterValue && (
                                  <>
                                    <span className="text-green-600">after:</span>{" "}
                                    {JSON.stringify(e.afterValue)}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
