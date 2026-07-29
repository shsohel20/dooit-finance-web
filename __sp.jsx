import React from "react";
import { createRoot } from "react-dom/client";
import { StatusPill } from "./components/ui/StatusPill";
const cases = [["draft","muted","Draft"],["in_review","info","In review"],["approved","success","Approved"],["escalated","warning","Escalated"],["declined","danger","Declined"],["dark","dark","Dark"]];
createRoot(document.getElementById("root")).render(
  <div style={{ padding: 20, background: "#fff", display: "flex", gap: 10, flexWrap: "wrap" }}>
    {cases.map(([k, v, label]) => (
      <span key={k} data-pill={k}><StatusPill variant={v}>{label}</StatusPill></span>
    ))}
  </div>
);
