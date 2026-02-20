import { PartyTreeGraph } from "./party-tree.graph";
import { GraphLegend } from "./graph-legend";
import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { PartyTreeView } from "./party-tree.view";
import { PartyNodeDiagram } from "./party-node-diagram";
export const partyEntities = [
  {
    name: "Sheikh Hasina",
    active: true,
    client: "Personal Account",
    invitedBy: null,
    relation: "self",
    relationType: "family",
    notes: "Root individual",
    onboardingChannel: "Manual",
    registeredAt: "2025-10-01T08:10:00.000Z",
    source: "internal",
    type: "individual",
    incomingTransactions: [
      { from: "Hasina Family Trust", amount: 500000, currency: "BDT", purpose: "Family support" },
      { from: "Joy Tech Holdings", amount: 250000, currency: "BDT", purpose: "Dividend payout" },
    ],
    outgoingTransactions: [
      { to: "Sajeeb Wazed Joy", amount: 200000, currency: "BDT", purpose: "Personal support" },
      { to: "Saima Wazed Putul", amount: 150000, currency: "BDT", purpose: "Medical expenses" },
    ],
  },
  {
    name: "Sajeeb Wazed Joy",
    active: true,
    client: "Personal Account",
    invitedBy: "Sheikh Hasina",
    relation: "son",
    relationType: "family",
    notes: "Son & business operator",
    onboardingChannel: "Referral",
    registeredAt: "2025-10-05T11:20:00.000Z",
    source: "referral",
    type: "individual",
    incomingTransactions: [
      { from: "Sheikh Hasina", amount: 200000, currency: "BDT", purpose: "Family support" },
      { from: "Joy Tech Holdings", amount: 400000, currency: "BDT", purpose: "Salary & dividends" },
    ],
    outgoingTransactions: [
      { to: "Rakib Hasan", amount: 75000, currency: "BDT", purpose: "Startup funding" },
      { to: "Hasina Family Trust", amount: 100000, currency: "BDT", purpose: "Trust contribution" },
    ],
  },
  {
    name: "Saima Wazed Putul",
    active: true,
    client: "Personal Account",
    invitedBy: "Sheikh Hasina",
    relation: "daughter",
    relationType: "family",
    notes: "Daughter, social initiatives",
    onboardingChannel: "Referral",
    registeredAt: "2025-10-06T09:40:00.000Z",
    source: "referral",
    type: "individual",
    incomingTransactions: [
      { from: "Sheikh Hasina", amount: 150000, currency: "BDT", purpose: "Medical support" },
    ],
    outgoingTransactions: [
      { to: "Putul Welfare Foundation", amount: 90000, currency: "BDT", purpose: "Charity funding" },
    ],
  },
  {
    name: "Rakib Hasan",
    active: true,
    client: "Business Account",
    invitedBy: "Sajeeb Wazed Joy",
    relation: "friend",
    relationType: "family",
    notes: "Friend & startup founder",
    onboardingChannel: "Referral",
    registeredAt: "2025-10-10T15:00:00.000Z",
    source: "referral",
    type: "individual",
    incomingTransactions: [
      { from: "Sajeeb Wazed Joy", amount: 75000, currency: "BDT", purpose: "Startup investment" },
    ],
    outgoingTransactions: [
      { to: "Joy Tech Holdings", amount: 50000, currency: "BDT", purpose: "Equity buyback" },
      { to: "Hasina Family Trust", amount: 30000, currency: "BDT", purpose: "Profit share" },
    ],
  },
  {
    name: "Hasina Family Trust",
    active: true,
    client: "Trust Account",
    invitedBy: "Sheikh Hasina",
    relation: "family trust",
    relationType: "transaction",
    notes: "Central family financial hub",
    onboardingChannel: "Legal Setup",
    registeredAt: "2025-09-20T10:00:00.000Z",
    source: "legal",
    type: "business",
    incomingTransactions: [
      { from: "Sajeeb Wazed Joy", amount: 100000, currency: "BDT", purpose: "Contribution" },
      { from: "Rakib Hasan", amount: 30000, currency: "BDT", purpose: "Profit share" },
    ],
    outgoingTransactions: [
      { to: "Sheikh Hasina", amount: 500000, currency: "BDT", purpose: "Family support" },
      { to: "Joy Tech Holdings", amount: 200000, currency: "BDT", purpose: "Capital investment" },
    ],
  },
  {
    name: "Joy Tech Holdings",
    active: true,
    client: "Corporate Account",
    invitedBy: "Sajeeb Wazed Joy",
    relation: "owned business",
    relationType: "transaction",
    notes: "Technology holding company",
    onboardingChannel: "Corporate",
    registeredAt: "2025-09-15T09:00:00.000Z",
    source: "corporate",
    type: "business",
    incomingTransactions: [
      { from: "Hasina Family Trust", amount: 200000, currency: "BDT", purpose: "Capital injection" },
      { from: "Rakib Hasan", amount: 50000, currency: "BDT", purpose: "Equity purchase" },
    ],
    outgoingTransactions: [
      { to: "Sajeeb Wazed Joy", amount: 400000, currency: "BDT", purpose: "Salary & dividends" },
      { to: "Sheikh Hasina", amount: 250000, currency: "BDT", purpose: "Dividend payout" },
    ],
  },
  {
    name: "Putul Welfare Foundation",
    active: true,
    client: "NGO Account",
    invitedBy: "Saima Wazed Putul",
    relation: "charity",
    relationType: "transaction",
    notes: "Social welfare foundation",
    onboardingChannel: "NGO",
    registeredAt: "2025-09-18T12:00:00.000Z",
    source: "ngo",
    type: "business",
    incomingTransactions: [
      { from: "Saima Wazed Putul", amount: 90000, currency: "BDT", purpose: "Donation" },
    ],
    outgoingTransactions: [],
  },
];

export function RelationsTree() {
  const [viewMode, setViewMode] = useState("family");
  const expandAllRef = useRef(null);
  const collapseAllRef = useRef(null);
  return (
    <main className="min-h-screen ">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight text-balance">
              Party Relationship Graph
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Click a node to expand its children. Drag nodes to rearrange. Scroll to zoom, drag the
              canvas to pan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Expand / Collapse buttons */}
            <button
              type="button"
              onClick={() => expandAllRef.current?.()}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={() => collapseAllRef.current?.()}
              className="rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary transition-colors"
            >
              Collapse All
            </button>

            {/* View mode toggle */}
            <div className="flex items-center rounded-lg border border-border bg-card p-1 gap-1">
              <button
                type="button"
                onClick={() => setViewMode("family")}
                className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-colors ${
                  viewMode === "family"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                Family / Relationship
              </button>
              <button
                type="button"
                onClick={() => setViewMode("transaction")}
                className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-colors ${
                  viewMode === "transaction"
                    ? "text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                style={viewMode === "transaction" ? { backgroundColor: "#ea580c" } : undefined}
              >
                Transactions
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="graph" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="graph">Graph View</TabsTrigger>
            {/* <TabsTrigger value="tree">Tree View</TabsTrigger> */}
            <TabsTrigger value="diagram">Tree View</TabsTrigger>
          </TabsList>

          {/* Graph View Tab */}
          <TabsContent value="graph" className="mt-0">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              {/* Legend Bar */}
              <div className="border-b border-border px-6 py-3">
                <GraphLegend viewMode={viewMode} />
              </div>

              {/* Graph */}
              <div className="h-[680px]">
                <PartyTreeGraph
                  entities={partyEntities}
                  expandAllRef={expandAllRef}
                  collapseAllRef={collapseAllRef}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tree View Tab */}
          <TabsContent value="tree" className="mt-0">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              {/* Legend Bar */}
              <div className="border-b border-border px-6 py-3">
                <GraphLegend viewMode={viewMode} />
              </div>

              {/* Tree */}
              <div className="h-[680px]">
                {/* <PartyTreeView data={dummyData} viewMode={viewMode} /> */}
              </div>
            </div>
          </TabsContent>

          {/* Node Diagram Tab */}
          <TabsContent value="diagram" className="mt-0">
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
              {/* Legend Bar */}
              <div className="border-b border-border px-6 py-3">
                <GraphLegend viewMode={viewMode} />
              </div>

              {/* Diagram */}
              <div className="h-[680px]">
                <PartyNodeDiagram entities={partyEntities}  />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

function StatCard({ label, value, accent }) {
  const accentColor =
    accent === "green"
      ? "#22c55e"
      : accent === "red"
        ? "#ef4444"
        : accent === "amber"
          ? "#f59e0b"
          : "#0ea5e9";

  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-xl font-bold text-foreground">{value}</span>
      </div>
    </div>
  );
}
