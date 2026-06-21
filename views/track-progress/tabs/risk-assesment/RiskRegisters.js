"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

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
];

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
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
      <p className="text-sm font-medium text-foreground leading-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ─── Entity header ───────────────────────────────────────────────────────────

function EntityHeader({ data }) {
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
        <div className="flex items-center gap-2 flex-wrap">
          <RiskBadge
            level={data.overallResidual}
            label={`Overall: ${data.overallResidualLabel}`}
            size="lg"
          />
          <span
            className={cn(
              "px-2 py-1 rounded text-xs font-medium border",
              data.status === "Draft"
                ? "bg-gray-100 text-gray-600 border-gray-200"
                : "bg-green-100 text-green-700 border-green-200",
            )}
          >
            {data.status}
          </span>
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

function OverallRiskProfile({ residualCounts = {}, overallResidual, overallResidualLabel, actionCount }) {
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

function RiskTableRow({ row }) {
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
    </TableRow>
  );
}

function RiskSection({ secKey, secName, rows }) {
  const [open, setOpen] = useState(true);
  return (
    <>
      <tr
        className="bg-gray-50 hover:bg-gray-100 cursor-pointer select-none transition-colors border-b"
        onClick={() => setOpen((o) => !o)}
      >
        <td colSpan={13} className="px-3 py-2">
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
      {open && rows.map((row) => <RiskTableRow key={row.ref} row={row} />)}
    </>
  );
}

function RiskTable({ sections }) {
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
            <RiskSection key={key} secKey={key} secName={sec.name} rows={sec.rows} />
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
          <p className={cn("text-sm font-semibold mt-1.5 leading-snug", cfg.text)}>{row.riskName}</p>
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

// ─── Root component ───────────────────────────────────────────────────────────

export default function RiskRegisters({ riskRegisters = [] }) {
  const register = Array.isArray(riskRegisters) ? riskRegisters[0] : riskRegisters;
  if (!register) return null;

  const {
    rows = [],
    residualCounts = {},
    overallResidual,
    overallResidualLabel,
    actionCount = 0,
    version = 1,
  } = register;

  const sections = rows.reduce((acc, row) => {
    if (!acc[row.sec]) acc[row.sec] = { name: row.secName, rows: [] };
    acc[row.sec].rows.push(row);
    return acc;
  }, {});

  const actionRows = rows.filter((r) => r.actionRequired);

  return (
    <div className="space-y-4">
      <EntityHeader data={{ ...register, version, overallResidual, overallResidualLabel }} />
      <OverallRiskProfile
        residualCounts={residualCounts}
        overallResidual={overallResidual}
        overallResidualLabel={overallResidualLabel}
        actionCount={actionCount}
      />
      <RiskTable sections={sections} />
      {actionRows.length > 0 && <ActionItems rows={actionRows} />}
    </div>
  );
}
