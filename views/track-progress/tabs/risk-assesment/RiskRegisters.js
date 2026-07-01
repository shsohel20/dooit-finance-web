"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Send,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
  Loader2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  submitRiskRegister,
  recalculateRiskRegister,
  overrideRiskRegisterScenario,
  exportRiskRegisterExcel,
} from "../../actions";

// Control-effectiveness buckets (mirrors EWRA-UI override panel)
const CTRL_EFF_LABELS = {
  cdd: "Customer Due Diligence",
  tm: "Transaction Monitoring",
  scr: "Sanctions Screening",
  geo: "Geographic Controls",
  gov: "Governance & Training",
};

// Per-row status enum (RiskRegister row schema: Draft | Reviewed | Approved)
const ROW_STATUS_OPTIONS = ["Draft", "Reviewed", "Approved"];

// ─── Status chip config ────────────────────────────────────────────────────────

const STATUS_STYLE = {
  Draft: "bg-gray-100 text-gray-600 border-gray-200",
  "In Review": "bg-amber-100 text-amber-700 border-amber-200",
  Approved: "bg-green-100 text-green-700 border-green-200",
};

// ─── Risk level config ───────────────────────────────────────────────────────

const RISK_LEVEL = {
  VL: {
    label: "Very Low",
    bg: "bg-sky-100",
    text: "text-sky-700",
    border: "border-sky-300",
    dot: "bg-sky-500",
  },
  L: {
    label: "Low",
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-300",
    dot: "bg-green-500",
  },
  M: {
    label: "Medium",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-300",
    dot: "bg-amber-500",
  },
  H: {
    label: "High",
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-300",
    dot: "bg-orange-500",
  },
  E: {
    label: "Extreme",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-300",
    dot: "bg-red-600",
  },
};

const RISK_TYPE_COLOR = {
  Customer: "bg-blue-100 text-blue-700 border-blue-200",
  Product: "bg-orange-100 text-orange-700 border-orange-200",
  Jurisdiction: "bg-green-100 text-green-700 border-green-200",
  Channel: "bg-teal-100 text-teal-700 border-teal-200",
  Behaviour: "bg-violet-100 text-violet-700 border-violet-200",
  Operational: "bg-gray-100 text-gray-600 border-gray-200",
};

const PROFILE_ITEMS = [
  { key: "VL", label: "Very Low" },
  { key: "L", label: "Low" },
  { key: "M", label: "Medium" },
  { key: "H", label: "High" },
  { key: "E", label: "Extreme" },
];

const TABLE_HEADERS = [
  { label: "#", className: "w-8 text-center" },
  { label: "Ref", className: "w-16" },
  { label: "Type", className: "w-28" },
  { label: "Risk Name", className: "min-w-[180px]" },
  { label: "Risk Flags / Sanctions", className: "min-w-[180px]" },
  { label: "L", className: "w-8 text-center" },
  { label: "C", className: "w-8 text-center" },
  { label: "Inherent Risk", className: "w-28" },
  { label: "Existing Controls", className: "min-w-[200px]" },
  { label: "Residual Risk", className: "w-28" },
  { label: "Action Req.", className: "w-20 text-center" },
  { label: "Owner", className: "w-28" },
  { label: "Status", className: "w-20" },
  { label: "", className: "w-12 text-center" },
];

const TABLE_COL_SPAN = TABLE_HEADERS.length;

// ─── Atomic components ───────────────────────────────────────────────────────

function RiskBadge({ level, label, size = "sm" }) {
  const cfg = RISK_LEVEL[level] || RISK_LEVEL.M;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold border whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        cfg.bg,
        cfg.text,
        cfg.border,
      )}
    >
      <span className={cn("size-1.5 rounded-full flex-shrink-0", cfg.dot)} />
      {label || cfg.label}
    </span>
  );
}

function TypeBadge({ type }) {
  const cls = RISK_TYPE_COLOR[type] || "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border", cls)}>
      {type}
    </span>
  );
}

function InfoCell({ label, value, sub }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground leading-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Entity header ───────────────────────────────────────────────────────────

function EntityHeader({ data, actions }) {
  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-AU", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="border rounded-xl bg-white p-4 space-y-3">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-foreground">{data.entityName}</h2>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-muted-foreground font-medium">{data.entityType}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">ABN: {data.abn}</span>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              Assessed: {formatDate(data.assessDate)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <RiskBadge
              level={data.overallResidual}
              label={`Overall: ${data.overallResidualLabel}`}
              size="lg"
            />
            <span
              className={cn(
                "px-2 py-1 rounded text-xs font-medium border",
                STATUS_STYLE[data.status] || STATUS_STYLE.Draft,
              )}
            >
              {data.status}
            </span>
          </div>
          {actions}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-2 border-t pt-3">
        <InfoCell label="Compliance Officer" value={data.coName} sub={data.coEmail} />
        <InfoCell label="CO Phone" value={data.coPhone} />
        <InfoCell label="Senior Manager" value={data.smName} sub={data.smEmail} />
        <InfoCell label="Version" value={`v${data.version ?? 1}`} />
      </div>
    </div>
  );
}

// ─── Overall residual risk profile ───────────────────────────────────────────

function OverallRiskProfile({
  residualCounts = {},
  overallResidual,
  overallResidualLabel,
  actionCount,
}) {
  return (
    <div className="border rounded-xl bg-white p-4 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-foreground">Overall Residual Risk Profile</h3>
        <RiskBadge level={overallResidual} label={overallResidualLabel} size="lg" />
      </div>
      <div className="flex items-stretch gap-3 flex-wrap">
        {PROFILE_ITEMS.map(({ key, label }) => {
          const cfg = RISK_LEVEL[key];
          const count = residualCounts[key] ?? 0;
          return (
            <div
              key={key}
              className={cn(
                "flex flex-col items-center justify-center rounded-lg border px-4 py-3 min-w-[72px] gap-0.5",
                cfg.bg,
                cfg.border,
              )}
            >
              <span className={cn("text-2xl font-bold leading-none", cfg.text)}>{count}</span>
              <span className={cn("text-[10px] font-medium mt-0.5", cfg.text)}>{label}</span>
            </div>
          );
        })}
        <div className="flex flex-col items-center justify-center rounded-lg border border-red-300 bg-red-50 px-4 py-3 min-w-[72px] gap-0.5">
          <span className="text-2xl font-bold leading-none text-red-700">{actionCount}</span>
          <span className="text-[10px] font-medium mt-0.5 text-red-700">Actions Req.</span>
        </div>
      </div>
    </div>
  );
}

// ─── Risk table ───────────────────────────────────────────────────────────────

function RiskTableRow({ row, onEdit }) {
  return (
    <TableRow className={cn(row.actionRequired && "bg-red-50/40")}>
      <TableCell className="text-center text-muted-foreground text-xs">{row.rowNum}</TableCell>
      <TableCell className="font-mono text-xs font-semibold">{row.ref}</TableCell>
      <TableCell>
        <TypeBadge type={row.riskType} />
      </TableCell>
      <TableCell className="whitespace-normal max-w-[200px]">
        <p className="text-xs font-semibold text-foreground leading-snug">{row.riskName}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed line-clamp-3">
          {row.description}
        </p>
      </TableCell>
      <TableCell className="whitespace-normal max-w-[200px]">
        <p className="text-[11px] text-muted-foreground italic leading-relaxed line-clamp-4">
          {row.pfSanctionsNote}
        </p>
      </TableCell>
      <TableCell className="text-center text-xs font-semibold">{row.L}</TableCell>
      <TableCell className="text-center text-xs font-semibold">{row.C}</TableCell>
      <TableCell>
        <RiskBadge level={row.inherentRisk} label={row.inherentRiskLabel} />
      </TableCell>
      <TableCell className="whitespace-normal max-w-[220px]">
        <p className="text-[11px] text-foreground leading-relaxed line-clamp-4">
          {row.existingControls}
        </p>
      </TableCell>
      <TableCell>
        <RiskBadge level={row.residualRisk} label={row.residualRiskLabel} />
      </TableCell>
      <TableCell className="text-center">
        {row.actionRequired ? (
          <span className="text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
            Yes
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell>
        <div>
          <p className="text-xs font-medium text-foreground truncate max-w-[100px]">
            {row.controlsOwner}
          </p>
          <p className="text-[10px] text-muted-foreground truncate max-w-[100px]">
            {row.preparedBy}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded border",
            row.status === "Draft"
              ? "bg-gray-100 text-gray-600 border-gray-200"
              : "bg-green-100 text-green-700 border-green-200",
          )}
        >
          {row.status}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <button
          type="button"
          onClick={() => onEdit?.(row)}
          title="Override row"
          className="inline-flex items-center justify-center size-7 rounded-md text-muted-foreground hover:bg-gray-100 hover:text-foreground transition-colors"
        >
          <SlidersHorizontal className="size-3.5" />
        </button>
      </TableCell>
    </TableRow>
  );
}

function RiskSection({ secKey, secName, rows, onEdit }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <tr
        className="bg-gray-50 hover:bg-gray-100 cursor-pointer select-none transition-colors border-b"
        onClick={() => setOpen((o) => !o)}
      >
        <td colSpan={TABLE_COL_SPAN} className="px-3 py-2">
          <div className="flex items-center gap-2">
            {open ? (
              <ChevronDown className="size-4 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronRight className="size-4 text-gray-500 flex-shrink-0" />
            )}
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {secKey}
            </span>
            <span className="text-sm font-semibold text-gray-700">— {secName}</span>
            <span className="ml-auto text-xs text-muted-foreground">{rows.length} items</span>
          </div>
        </td>
      </tr>
      {open &&
        rows.map((row) => (
          <RiskTableRow key={row.ref} row={row} onEdit={onEdit} />
        ))}
    </>
  );
}

function RiskTable({ sections, onEdit }) {
  const totalItems = Object.values(sections).reduce((n, s) => n + s.rows.length, 0);
  return (
    <div className="border rounded-xl bg-white overflow-hidden">
      <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
        <h3 className="text-sm font-semibold">Risk Register</h3>
        <span className="text-xs text-muted-foreground">{totalItems} items</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            {TABLE_HEADERS.map((h) => (
              <TableHead key={h.label} className={cn("text-xs font-semibold", h.className)}>
                {h.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(sections).map(([key, sec]) => (
            <RiskSection
              key={key}
              secKey={key}
              secName={sec.name}
              rows={sec.rows}
              onEdit={onEdit}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// ─── Action items ─────────────────────────────────────────────────────────────

function ActionItemCard({ row }) {
  const cfg = RISK_LEVEL[row.residualRisk] || RISK_LEVEL.H;
  return (
    <div className={cn("rounded-lg border p-4 space-y-2", cfg.bg, cfg.border)}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={cn("size-4 mt-0.5 flex-shrink-0", cfg.text)} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-foreground">{row.ref}</span>
            <TypeBadge type={row.riskType} />
            <RiskBadge level={row.inherentRisk} label={`Inherent: ${row.inherentRiskLabel}`} />
            <RiskBadge level={row.residualRisk} label={`Residual: ${row.residualRiskLabel}`} />
            <span className="text-xs text-muted-foreground">
              L{row.L} × C{row.C}
            </span>
          </div>
          <p className={cn("text-sm font-semibold mt-1.5 leading-snug", cfg.text)}>
            {row.riskName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{row.description}</p>
          {row.pfSanctionsNote && (
            <p className={cn("text-xs font-medium mt-1 italic", cfg.text)}>
              ⚑ {row.pfSanctionsNote}
            </p>
          )}
          <div className="mt-2 pt-2 border-t border-current/10">
            <p className="text-[11px] text-muted-foreground font-medium">
              Controls: <span className="text-foreground">{row.existingControls}</span>
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 space-y-0.5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Owner</p>
          <p className="text-xs font-semibold text-foreground">{row.controlsOwner}</p>
          {row.reviewedBy && (
            <p className="text-[10px] text-muted-foreground">Rev: {row.reviewedBy}</p>
          )}
          <span
            className={cn(
              "inline-block text-[11px] font-medium px-2 py-0.5 rounded border mt-1",
              row.status === "Draft"
                ? "bg-white/60 text-gray-600 border-gray-200"
                : "bg-green-100 text-green-700 border-green-200",
            )}
          >
            {row.status}
          </span>
        </div>
      </div>
    </div>
  );
}

function ActionItems({ rows }) {
  return (
    <div className="border rounded-xl bg-white overflow-hidden">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <AlertTriangle className="size-4 text-red-500" />
        <h3 className="text-sm font-semibold">Risk Action Items</h3>
        <span className="ml-1 text-xs bg-red-100 text-red-700 border border-red-200 rounded-full px-2 py-0.5 font-medium">
          {rows.length} items
        </span>
      </div>
      <div className="p-4 space-y-3">
        {rows.map((row) => (
          <ActionItemCard key={row.ref} row={row} />
        ))}
      </div>
    </div>
  );
}

// ─── Register action toolbar ────────────────────────────────────────────────────

function RegisterActions({ status, busy, onSubmit, onRecalculate, onExport }) {
  const isDraft = status === "Draft";
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        size="sm"
        variant="outline"
        disabled={!isDraft || !!busy}
        onClick={onSubmit}
        className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
        title={isDraft ? "Submit register for review" : `Register is already ${status}`}
      >
        {busy === "submit" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Send className="size-4" />
        )}
        Submit for Review
      </Button>
      <Button size="sm" variant="outline" disabled={!!busy} onClick={onRecalculate}>
        {busy === "recalc" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <RefreshCw className="size-4" />
        )}
        Recalculate
      </Button>
      <Button size="sm" variant="outline" disabled={!!busy} onClick={onExport}>
        {busy === "export" ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="size-4" />
        )}
        Export Excel
      </Button>
    </div>
  );
}

// ─── Override row slide-over ──────────────────────────────────────────────────

function OverrideRowSheet({ row, ctrlEff = {}, onClose, onSave }) {
  const open = !!row;

  // Initialise from the doc-level control effectiveness, overlaying the row's
  // own category bucket with its current per-row value when present.
  const baseCtrl = { cdd: 3, tm: 3, scr: 3, geo: 3, gov: 3, ...ctrlEff };
  const rowCat = row?.category;
  if (row && rowCat && CTRL_EFF_LABELS[rowCat] && row.controlEffectiveness != null) {
    baseCtrl[rowCat] = row.controlEffectiveness;
  }

  const [form, setForm] = useState({
    L: 3,
    C: 3,
    ctrlEff: baseCtrl,
    reviewerNotes: "",
    status: "Draft",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  // Reset the form whenever a different row is opened.
  useEffect(() => {
    if (!row) return;
    const ce = { cdd: 3, tm: 3, scr: 3, geo: 3, gov: 3, ...ctrlEff };
    if (rowCat && CTRL_EFF_LABELS[rowCat] && row.controlEffectiveness != null) {
      ce[rowCat] = row.controlEffectiveness;
    }
    setForm({
      L: row.L ?? 3,
      C: row.C ?? 3,
      ctrlEff: ce,
      reviewerNotes: row.reviewerNotes ?? "",
      status: ROW_STATUS_OPTIONS.includes(row.status) ? row.status : "Draft",
    });
    setErr(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row?.ref]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setCtrl = (key, val) =>
    setForm((f) => ({ ...f, ctrlEff: { ...f.ctrlEff, [key]: Number(val) } }));

  const handleSave = async () => {
    setSaving(true);
    setErr(null);
    try {
      await onSave(row.ref, form);
      onClose();
    } catch (e) {
      setErr(e?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="sm:max-w-md w-full overflow-y-auto">
        <SheetHeader className="border-b">
          <SheetTitle>Override Row</SheetTitle>
          <SheetDescription>
            {row ? `${row.ref} · ${row.riskName}` : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 space-y-5">
          {/* Likelihood & Consequence */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Risk Score
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["L", "Likelihood"],
                ["C", "Consequence"],
              ].map(([k, lbl]) => (
                <div key={k}>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">
                    {lbl}
                  </label>
                  <select
                    value={form[k]}
                    onChange={(e) => set(k, Number(e.target.value))}
                    className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {[1, 2, 3, 4, 5].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Control Effectiveness */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Control Effectiveness (1–5)
            </p>
            <div className="space-y-4">
              {Object.entries(CTRL_EFF_LABELS).map(([k, label]) => {
                const isRowCat = k === rowCat;
                return (
                  <div key={k}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        className={cn(
                          "text-xs",
                          isRowCat
                            ? "font-semibold text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {label}
                        {isRowCat && (
                          <span className="ml-1 text-[10px] text-primary">
                            (this row)
                          </span>
                        )}
                      </label>
                      <span className="text-xs font-bold text-primary tabular-nums">
                        {form.ctrlEff[k]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={form.ctrlEff[k]}
                      onChange={(e) => setCtrl(k, e.target.value)}
                      className="w-full h-1.5 accent-primary cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Status
            </p>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full text-sm border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {ROW_STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Reviewer Notes */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Reviewer Notes
            </p>
            <Textarea
              value={form.reviewerNotes}
              onChange={(e) => set("reviewerNotes", e.target.value)}
              rows={4}
              placeholder="Optional notes…"
              className="resize-none"
            />
          </div>

          {err && (
            <div className="flex items-start gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              <AlertTriangle className="size-3.5 mt-0.5 flex-shrink-0" />
              {err}
            </div>
          )}
        </div>

        <SheetFooter className="border-t">
          <div className="flex gap-3 w-full">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Override"
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function RiskRegisters({ riskRegisters = [], setCurrentStep }) {
  const initial = Array.isArray(riskRegisters) ? riskRegisters[0] : riskRegisters;
  const [register, setRegister] = useState(initial);
  const [busy, setBusy] = useState(null); // "submit" | "recalc" | "export" | null
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const [editRow, setEditRow] = useState(null); // row currently being overridden

  if (!register) return null;

  const {
    _id,
    rows = [],
    residualCounts = {},
    overallResidual,
    overallResidualLabel,
    actionCount = 0,
    version = 1,
    status = "Draft",
    entityName = "ENTITY",
  } = register;

  const sections = rows.reduce((acc, row) => {
    if (!acc[row.sec]) acc[row.sec] = { name: row.secName, rows: [] };
    acc[row.sec].rows.push(row);
    return acc;
  }, {});

  const actionRows = rows.filter((r) => r.actionRequired);

  const runAction = async (key, fn, successText) => {
    if (!_id) {
      setMessage({ type: "error", text: "Register has not been saved yet." });
      return;
    }
    setBusy(key);
    setMessage(null);
    try {
      const res = await fn(_id);
      if (res?.success && res.data) {
        setRegister(res.data);
        setMessage({ type: "success", text: successText });
      } else {
        setMessage({ type: "error", text: res?.error || "Action failed." });
      }
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "Action failed." });
    } finally {
      setBusy(null);
    }
  };

  // Persist a single-row override, then merge the returned row + summary back
  // into local state (patchScenario returns { row, summary }, not the full doc).
  const handleOverrideSave = async (ref, form) => {
    if (!_id) throw new Error("Register has not been saved yet.");
    const res = await overrideRiskRegisterScenario(_id, ref, form);
    if (!res?.success || !res.data?.row) {
      throw new Error(res?.error || "Override failed.");
    }
    const { row: updatedRow, summary = {} } = res.data;
    setRegister((prev) => ({
      ...prev,
      rows: prev.rows.map((r) => (r.ref === ref ? updatedRow : r)),
      ...summary,
    }));
    setMessage({ type: "success", text: `Row ${ref} overridden.` });
  };

  const handleSubmit = () =>
    runAction("submit", submitRiskRegister, "Submitted for review.");

  const handleRecalculate = () =>
    runAction("recalc", recalculateRiskRegister, "Risk register recalculated.");

  const handleExport = async () => {
    if (!_id) {
      setMessage({ type: "error", text: "Register has not been saved yet." });
      return;
    }
    setBusy("export");
    setMessage(null);
    try {
      const res = await exportRiskRegisterExcel(_id);
      if (res?.success && res.data) {
        const blob = new Blob([res.data], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${entityName.replace(/[^a-z0-9]/gi, "_")}_EWRA_Risk_Register.xls`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setMessage({ type: "success", text: "Excel export downloaded." });
      } else {
        setMessage({ type: "error", text: res?.error || "Export failed." });
      }
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "Export failed." });
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm",
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700",
          )}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="size-4 flex-shrink-0" />
          ) : (
            <AlertTriangle className="size-4 flex-shrink-0" />
          )}
          <span className="flex-1">{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-current/60 hover:text-current"
            aria-label="Dismiss"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <EntityHeader
        data={{ ...register, version, overallResidual, overallResidualLabel, status }}
        actions={
          <RegisterActions
            status={status}
            busy={busy}
            onSubmit={handleSubmit}
            onRecalculate={handleRecalculate}
            onExport={handleExport}
          />
        }
      />
      <OverallRiskProfile
        residualCounts={residualCounts}
        overallResidual={overallResidual}
        overallResidualLabel={overallResidualLabel}
        actionCount={actionCount}
      />
      <RiskTable sections={sections} onEdit={setEditRow} />
      {actionRows.length > 0 && <ActionItems rows={actionRows} />}

      <OverrideRowSheet
        row={editRow}
        ctrlEff={register.ctrlEff}
        onClose={() => setEditRow(null)}
        onSave={handleOverrideSave}
      />

      {/* Wizard navigation — only rendered when embedded in the onboarding
          stepper. Standalone consumers (e.g. the Risk Assessment menu page)
          omit setCurrentStep and get no Previous/Next controls. */}
      {typeof setCurrentStep === "function" && (
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)}>
            Previous
          </Button>
          <Button onClick={() => setCurrentStep((prev) => prev + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
