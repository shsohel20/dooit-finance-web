"use client";

import { useState, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  User,
  Building2,
  Landmark,
  Globe,
  Calendar,
  Shield,
  Flag,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { flatEntities } from "./dummyData";
const entities = flatEntities;
function fmtAmt(amount, currency) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M ${currency}`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K ${currency}`;
  return `${amount} ${currency}`;
}

function riskColor(r) {
  if (r === "HIGH") return "#ef4444";
  if (r === "MEDIUM") return "#f59e0b";
  return "#22c55e";
}

function riskBg(r) {
  if (r === "HIGH") return "#fef2f2";
  if (r === "MEDIUM") return "#fffbeb";
  return "#f0fdf4";
}

function TypeIcon({ type, className, style }) {
  if (type === "INDIVIDUAL") return <User className={className} style={style} />;
  if (type === "LEGAL_ENTITY") return <Landmark className={className} style={style} />;
  return <Building2 className={className} style={style} />;
}

function typeColor(type) {
  if (type === "INDIVIDUAL") return "#2563eb";
  if (type === "LEGAL_ENTITY") return "#0d9488";
  return "#7c3aed";
}

function typeBg(type) {
  if (type === "INDIVIDUAL") return "#eff6ff";
  if (type === "LEGAL_ENTITY") return "#f0fdfa";
  return "#f5f3ff";
}

function screeningStatusColor(status) {
  if (status === "CONFIRMED_PEP") return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
  if (status === "POTENTIAL_MATCH") return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
  if (status === "CLEARED") return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
  return { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
}

function TreeItem({ entity, childrenOf, level }) {
  const [open, setOpen] = useState(level === 0);
  const children = childrenOf.get(entity.name) || [];
  const hasKids = children.length > 0;
  const tOut = entity.transactions
    .filter((t) => t.type === "OUTGOING")
    .reduce((s, t) => s + t.amount, 0);
  const tIn = entity.transactions
    .filter((t) => t.type === "INCOMING")
    .reduce((s, t) => s + t.amount, 0);
  const txCount = entity.transactions.length;
  const screeningColors = screeningStatusColor(entity.screeningStatus);

  return (
    <div>
      <div
        className="group flex items-start gap-3 py-3 px-4 rounded-xl hover:bg-muted transition-all cursor-pointer border border-transparent hover:border-border/50"
        style={{ paddingLeft: `${level * 24 + 16}px` }}
        onClick={() => setOpen(!open)}
      >
        {/* Expand/Collapse */}
        <div className="flex-shrink-0 mt-1.5">
          {hasKids ? (
            open ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </div>

        {/* Type Icon */}
        <div className="flex-shrink-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sm"
            style={{
              backgroundColor: typeBg(entity.partyType),
              border: `1px solid ${typeColor(entity.partyType)}20`,
            }}
          >
            <TypeIcon
              type={entity.partyType}
              className="h-5 w-5"
              style={{ color: typeColor(entity.partyType) }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">{entity.name}</span>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground/50 font-medium bg-muted/50 px-1.5 py-0.5 rounded">
              {entity.partyType.replace("_", " ")}
            </span>
            {entity.pepFlag && (
              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-red-600 bg-red-50 border border-red-200 rounded-md px-1.5 py-0.5">
                <Shield className="h-2.5 w-2.5" /> PEP
              </span>
            )}
            {/* Risk Rating */}
            <span
              className="inline-flex items-center gap-1 text-[9px] font-semibold rounded-md px-1.5 py-0.5"
              style={{
                backgroundColor: riskBg(entity.riskRating),
                color: riskColor(entity.riskRating),
              }}
            >
              <AlertTriangle className="h-2.5 w-2.5" />
              {entity.riskRating}
            </span>
          </div>

          {/* Details Row */}
          <div className="mt-1.5 flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
            {/* Relation */}
            <span
              className="font-medium"
              style={{
                color:
                  entity.relationType === "FAMILY"
                    ? "#3b82f6"
                    : entity.relationType === "CONTROL"
                      ? "#7c3aed"
                      : "#94a3b8",
              }}
            >
              {entity.relation}
            </span>

            {/* Role */}
            <span className="flex items-center gap-1 text-muted-foreground/70">
              <Briefcase className="h-3 w-3" />
              {entity.role.replace(/_/g, " ")}
            </span>

            {/* Ownership */}
            {entity.ownershipPercentage && (
              <span className="text-purple-600 font-medium">
                {entity.ownershipPercentage}% owned
              </span>
            )}
          </div>

          {/* Additional Info Row */}
          <div className="mt-1.5 flex items-center gap-3 flex-wrap text-[11px] text-muted-foreground/60">
            {/* Nationality / Country */}
            {(entity.nationality || entity.registeredCountry) && (
              <span className="flex items-center gap-1">
                <Flag className="h-3 w-3" />
                {entity.nationality || entity.registeredCountry}
              </span>
            )}

            {/* DOB */}
            {entity.dateOfBirth && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {entity.dateOfBirth}
              </span>
            )}

            {/* Political Position */}
            {entity.politicalPosition && (
              <span className="text-red-500 font-medium">{entity.politicalPosition}</span>
            )}

            {/* Screening Status */}
            {entity.screeningStatus && (
              <span
                className="inline-flex items-center gap-1 text-[9px] font-medium rounded px-1.5 py-0.5"
                style={{
                  backgroundColor: screeningColors.bg,
                  color: screeningColors.color,
                  border: `1px solid ${screeningColors.border}`,
                }}
              >
                {entity.screeningStatus.replace(/_/g, " ")}
              </span>
            )}

            {/* IP Address */}
            <span className="flex items-center gap-1 font-mono text-[10px]">
              <Globe className="h-3 w-3" />
              {entity.ipAddress}
            </span>
          </div>

          {/* Transaction Summary */}
          {(tOut > 0 || tIn > 0) && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {tOut > 0 && (
                <span
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold shadow-sm"
                  style={{
                    backgroundColor: "#fef2f2",
                    color: "#dc2626",
                    border: "1px solid #fecaca",
                  }}
                >
                  <span className="text-base leading-none">{"\u2190"}</span>
                  Out {fmtAmt(tOut, "USD")}
                </span>
              )}
              {tIn > 0 && (
                <span
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold shadow-sm"
                  style={{
                    backgroundColor: "#f0fdf4",
                    color: "#16a34a",
                    border: "1px solid #bbf7d0",
                  }}
                >
                  <span className="text-base leading-none">{"\u2192"}</span>
                  In {fmtAmt(tIn, "USD")}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground/50">
                {txCount} transaction{txCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Children Count */}
        {hasKids && (
          <div className="flex-shrink-0 mt-1">
            <span className="text-[10px] font-medium text-muted-foreground/60 bg-muted/50 px-1.5 py-0.5 rounded-full">
              {children.length}
            </span>
          </div>
        )}
      </div>

      {open &&
        children.map((child) => (
          <TreeItem key={child.partyId} entity={child} childrenOf={childrenOf} level={level + 1} />
        ))}
    </div>
  );
}

export function PartyTreeView() {
  const childrenOf = useMemo(() => {
    const m = new Map();
    for (const e of entities) {
      if (e.parentName) {
        const l = m.get(e.parentName) || [];
        l.push(e);
        m.set(e.parentName, l);
      }
    }
    return m;
  }, [entities]);

  const root = entities.find((e) => e.parentName === null);
  if (!root) return null;

  return (
    <div className="h-full overflow-auto p-4">
      <TreeItem entity={root} childrenOf={childrenOf} level={0} />
    </div>
  );
}
