"use client";

import { useState } from "react";
import { formatNumber } from "./reportHelpers";

const RAIL_ROLES = ["Exporter", "Importer", "Notify party"];

const FULL_FIELDS = [
  ["Incoterms", (d) => d.incoterms],
  ["Port of loading", (d) => d.portOfLoading],
  ["Port of discharge", (d) => d.portOfDischarge],
  ["Shipping method", (d) => d.shippingMethod],
  ["Container number", (d) => d.containerNumber],
  ["Vessel / flight", (d) => d.vesselFlight],
  ["LC number", (d) => d.lcNumber],
  ["Sales terms", (d) => d.salesTerms],
  ["Currency", (d) => d.currency],
  ["Amount in words", (d) => d.amountInWords],
  ["FOB value", (d) => (d.fobValue != null ? formatNumber(d.fobValue) : null)],
  ["CIF value", (d) => (d.cifValue != null ? formatNumber(d.cifValue) : null)],
];

// Compact side-rail summary of the document that fed this screening run —
// parties, terms & totals up front, with an "all fields" toggle that
// reveals every remaining extracted field (most of which are usually
// empty, which is itself the point: the model doesn't fabricate values).
export default function DocumentExtractRail({ run }) {
  const [open, setOpen] = useState(false);
  const doc = run.documentExtract;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-baseline justify-between gap-2.5">
        <span className="text-xs font-semibold tracking-wide text-heading uppercase">Document extract</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md border border-primary/20 bg-primary/5 px-2.5 py-1 text-[11px] font-semibold text-primary hover:bg-primary/10"
        >
          {open ? "Hide all fields" : "All fields"}
        </button>
      </div>

      <span className="font-mono text-[11px] text-muted-foreground">
        {doc.documentType} {doc.documentNumber} · {doc.documentDate}
      </span>

      {RAIL_ROLES.map((role) => {
        const party = run.parties[role] || {};
        const bits = [party.address, party.phone].filter(Boolean);
        const flagged = !party.country && !!party.name;
        return (
          <div key={role} className="flex flex-col gap-0.5 border-b border-border/60 pb-3 last:border-b-0">
            <span className="text-[10.5px] font-semibold tracking-wide text-muted-foreground uppercase">{role}</span>
            <span className="text-[13px] font-semibold text-heading">{party.name || "not stated"}</span>
            <span className="text-xs text-muted-foreground">{bits.length ? bits.join(" · ") : "no address on document"}</span>
            {flagged && <span className="text-[11px] text-danger">country not stated on document</span>}
          </div>
        );
      })}

      <div className="flex flex-col gap-0.5">
        <span className="text-[10.5px] font-semibold tracking-wide text-muted-foreground uppercase">Terms &amp; totals</span>
        <span className="text-xs text-muted-foreground">
          {doc.paymentTerms || "—"} {doc.shippingMethod ? `· ${doc.shippingMethod}` : ""}
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          subtotal {formatNumber(doc.subtotal)} · total {formatNumber(doc.totalAmount)}
        </span>
      </div>

      {open && (
        <div className="flex flex-col gap-3 border-t border-border pt-3">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {FULL_FIELDS.map(([label, get]) => {
              const value = get(doc);
              return (
                <div key={label}>
                  <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
                  <p className={value ? "text-xs text-heading" : "text-xs text-muted-foreground/60"}>{value || "not stated"}</p>
                </div>
              );
            })}
          </div>

          {["Issuing bank", "Beneficiary bank"].map((role) => {
            const bank = run.parties[role] || {};
            return (
              <div key={role}>
                <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{role}</p>
                <p className={bank.name ? "text-xs text-heading" : "text-xs text-muted-foreground/60"}>{bank.name || "not stated"}</p>
              </div>
            );
          })}

          {run.gap && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2.5">
              <p className="text-[11px] font-semibold text-yellow-700">{run.gap.label}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{run.gap.note}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
