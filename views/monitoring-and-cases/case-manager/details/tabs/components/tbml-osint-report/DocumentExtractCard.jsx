"use client";

import { formatNumber } from "./reportHelpers";

function PartyBlock({ label, party, flagged }) {
  if (!party) return null;
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold text-heading">{party.name || "—"}</p>
      {party.address && <p className="text-xs text-muted-foreground">{party.address}</p>}
      {flagged && <p className="mt-1 text-[11px] font-medium text-danger">flagged: {flagged}</p>}
    </div>
  );
}

// Builds the row of "missing field" tags (banks not stated, incoterms
// missing, ...) purely from which document fields came back empty.
function buildMissingTags(document) {
  const tags = [];
  if (!document.issuing_bank?.name && !document.beneficiary_bank?.name) tags.push("banks not stated");
  if (!document.incoterms) tags.push("incoterms missing");
  if (!document.port_of_loading && !document.port_of_discharge) tags.push("ports missing");
  if (!document.container_number && !document.vessel_flight) tags.push("container / vessel missing");
  const anyCurrency = document.currency || document.products?.some((p) => p.currency);
  if (!anyCurrency) tags.push("currency missing throughout");
  const subtotal = parseFloat(document.subtotal);
  const total = parseFloat(document.total_amount);
  if (!Number.isNaN(subtotal) && !Number.isNaN(total) && subtotal !== total) {
    tags.push("total ≠ subtotal + stated charges");
  }
  return tags;
}

export default function DocumentExtractCard({ document, methodology, limitations = [] }) {
  if (!document) return null;

  // Surface the "placeholder" caveat from the model's limitations against
  // the exporter block, since that's the field it actually refers to.
  const exporterFlag = limitations.find((l) => /placeholder/i.test(l))
    ? "name and address appear to be placeholders"
    : null;

  const missingTags = buildMissingTags(document);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
        <span>Document extract — parties & terms</span>
        <span className="font-normal normal-case text-muted-foreground/80">
          {document.document_type}, page {document.page_number} of {methodology?.pages_in_document ?? 1} ·{" "}
          {document.lc_number ? `LC ${document.lc_number}` : "no LC referenced"}
        </span>
      </div>

      <div className="mt-3 grid gap-4 sm:grid-cols-4">
        <PartyBlock label="Exporter" party={document.exporter} flagged={exporterFlag} />
        <PartyBlock label="Importer" party={document.importer} />
        <PartyBlock label="Notify party" party={document.notify_party} />
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Terms</p>
          <p className="mt-1 text-sm font-semibold text-heading">{document.payment_terms || "—"}</p>
          <p className="text-xs text-muted-foreground">{document.shipping_method || "—"}</p>

          <p className="mt-2 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">Totals</p>
          <p className="text-xs text-muted-foreground">
            subtotal {formatNumber(document.subtotal)} · total {formatNumber(document.total_amount)}
          </p>
        </div>
      </div>

      {missingTags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border/60 pt-3">
          {missingTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
