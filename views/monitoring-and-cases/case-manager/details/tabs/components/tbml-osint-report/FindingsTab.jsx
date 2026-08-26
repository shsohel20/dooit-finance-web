"use client";

import LineItemCard from "./LineItemCard";
import DocumentExtractCard from "./DocumentExtractCard";
import { buildLineItems } from "./reportHelpers";

// Default tab: one card per declared line item (price comparison + TBML
// findings), followed by the raw document extract for reference.
export default function FindingsTab({ report }) {
  const document = report.document_extracts?.[0];
  const lineItems = buildLineItems(document, report.product_analyses, report.osint_results);

  return (
    <div className="flex flex-col gap-4">
      {lineItems.map((lineItem) => (
        <LineItemCard key={lineItem.product.line_number} lineItem={lineItem} />
      ))}

      <DocumentExtractCard
        document={document}
        methodology={report.methodology}
        limitations={report.methodology?.limitations}
      />
    </div>
  );
}
