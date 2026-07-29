import React from "react";
globalThis.React = React; // harness: some files rely on the automatic JSX runtime
import { createRoot } from "react-dom/client";
import { companiesColumns } from "./views/companies/list/column";
const rows = [
  { _id: '1', label: 'full structure', shareholders: [{holder_model:'TrustKyc'},{holder_model:'TrustKyc'},{holder_name:'Jo'}],
    related_entities: [{relation:'parent'},{relation:'subsidiary'},{relation:'branch'}],
    appointments: [{role:'director'},{role:'director'},{role:'secretary'}],
    directors_beneficial_owner: { beneficial_owners: [{ownership_percent:60,control_type:'ownership'}] } },
  { _id: '2', label: 'parent, owner only 10% -> gap', shareholders: [{holder_name:'A'}], related_entities: [{relation:'parent'}],
    appointments: [{role:'director'}], directors_beneficial_owner: { beneficial_owners: [{ownership_percent:10}] } },
  { _id: '3', label: 'singulars (1 of each)', shareholders: [{holder_model:'TrustKyc'}],
    related_entities: [{relation:'subsidiary'}], appointments: [{role:'secretary'}],
    directors_beneficial_owner: { beneficial_owners: [{ownership_percent:1,control_type:'other_means'}] } },
  { _id: '4', label: 'nothing recorded', shareholders: [], related_entities: [], appointments: [], directors_beneficial_owner: { beneficial_owners: [] } },
];
const col = companiesColumns(() => {}).find((c) => c.id === "ownership");
createRoot(document.getElementById("root")).render(
  <div style={{ fontFamily: "system-ui", padding: 16 }}>
    {rows.map((r) => (
      <div key={r._id} data-case style={{ display: "flex", gap: 16, alignItems: "center", padding: "8px 0", borderBottom: "1px solid #eee" }}>
        <span style={{ width: 240, fontSize: 12, color: "#666" }}>{r.label}</span>
        <span data-cell>{col.cell({ row: { original: r } })}</span>
      </div>
    ))}
  </div>
);
