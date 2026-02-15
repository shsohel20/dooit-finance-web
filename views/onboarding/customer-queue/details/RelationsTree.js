import { PartyTreeGraph } from "./party-tree.graph";
import { GraphLegend } from "./graph-legend";
import { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { PartyTreeView } from "./party-tree.view";
import { PartyNodeDiagram } from "./party-node-diagram";

export const dummyData = {
  partyId: "P-5000",
  partyName: "Sheikh Hasina",
  partyType: "INDIVIDUAL",
  role: "PRIMARY_PARTY",
  pepFlag: true,
  riskRating: "HIGH",
  status: "ACTIVE",
  children: [
    {
      partyId: "P-5001",
      partyName: "Sajeeb Wazed Joy",
      partyType: "INDIVIDUAL",
      role: "IMMEDIATE_FAMILY",
      relationshipToParent: "SON",
      relationType: "FAMILY",
      riskRating: "MEDIUM",
      status: "ACTIVE",
      children: [
        {
          partyId: "P-5002",
          partyName: "Rakib Hasan",
          partyType: "INDIVIDUAL",
          role: "CLOSE_ASSOCIATE",
          relationshipToParent: "FRIEND",
          relationType: "SOCIAL",
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [
            {
              partyId: "P-5003",
              partyName: "Rakib Tech Solutions Ltd",
              partyType: "BUSINESS",
              role: "OWNED_ENTITY",
              relationshipToParent: "DIRECTOR",
              relationType: "CONTROL",
              ownershipPercentage: 55,
              riskRating: "HIGH",
              status: "ACTIVE",
              children: [],
            },
          ],
          transactions: [
            {
              transactionId: "T-9001",
              from: "Sajeeb Wazed Joy",
              to: "Rakib Hasan",
              relationType: "TRANSACTIONAL",
              amount: 250000,
              currency: "USD",
              frequency: "MONTHLY",
              purpose: "Personal and consulting expenses",
              riskFlag: "PEP_TO_ASSOCIATE",
              dateRange: "2025-01 to 2025-06",
            },
          ],
        },
        {
          partyId: "P-5004",
          partyName: "Joy Digital Services",
          partyType: "BUSINESS",
          role: "BENEFICIAL_OWNER",
          relationshipToParent: "FOUNDER",
          relationType: "OWNERSHIP",
          ownershipPercentage: 100,
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [
            {
              partyId: "P-5005",
              partyName: "Joy Innovations LLP",
              partyType: "BUSINESS",
              role: "SUBSIDIARY",
              relationshipToParent: "MANAGING_PARTNER",
              relationType: "CONTROL",
              ownershipPercentage: 70,
              riskRating: "MEDIUM",
              status: "ACTIVE",
              children: [],
              transactions: [
                {
                  transactionId: "T-9002",
                  from: "Joy Digital Services",
                  to: "Joy Innovations LLP",
                  relationType: "TRANSACTIONAL",
                  amount: 1200000,
                  currency: "USD",
                  frequency: "QUARTERLY",
                  purpose: "Operational funding",
                  riskFlag: "RELATED_PARTY_TRANSFER",
                  dateRange: "2025-Q1 to 2025-Q3",
                },
              ],
            },
          ],
        },
      ],
      transactions: [
        {
          transactionId: "T-9003",
          from: "Sheikh Hasina",
          to: "Sajeeb Wazed Joy",
          relationType: "TRANSACTIONAL",
          amount: 500000,
          currency: "USD",
          frequency: "ANNUAL",
          purpose: "Family support and investments",
          riskFlag: "PEP_FAMILY_TRANSFER",
          dateRange: "2025",
        },
      ],
    },
    {
      partyId: "P-5006",
      partyName: "Saima Wazed Putul",
      partyType: "INDIVIDUAL",
      role: "IMMEDIATE_FAMILY",
      relationshipToParent: "DAUGHTER",
      relationType: "FAMILY",
      riskRating: "LOW",
      status: "ACTIVE",
      children: [
        {
          partyId: "P-5007",
          partyName: "Putul Wellness Foundation",
          partyType: "LEGAL_ENTITY",
          role: "NON_PROFIT",
          relationshipToParent: "CHAIRPERSON",
          relationType: "CONTROL",
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [],
          transactions: [
            {
              transactionId: "T-9004",
              from: "Sheikh Hasina",
              to: "Putul Wellness Foundation",
              relationType: "TRANSACTIONAL",
              amount: 2000000,
              currency: "USD",
              frequency: "ANNUAL",
              purpose: "Donations",
              riskFlag: "PEP_NONPROFIT_TRANSFER",
              dateRange: "2025",
            },
          ],
        },
      ],
    },
    {
      partyId: "P-5008",
      partyName: "Hasina Family Trust",
      partyType: "LEGAL_ENTITY",
      role: "TRUST",
      relationshipToParent: "SETTLOR",
      relationType: "LEGAL_STRUCTURE",
      riskRating: "HIGH",
      status: "ACTIVE",
      children: [
        {
          partyId: "P-5001",
          partyName: "Sajeeb Wazed Joy",
          partyType: "INDIVIDUAL",
          role: "BENEFICIARY",
          relationshipToParent: "BENEFICIARY",
          relationType: "BENEFICIAL_INTEREST",
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [],
          transactions: [
            {
              transactionId: "T-9005",
              from: "Hasina Family Trust",
              to: "Sajeeb Wazed Joy",
              relationType: "TRANSACTIONAL",
              amount: 750000,
              currency: "USD",
              frequency: "ANNUAL",
              purpose: "Trust distribution",
              riskFlag: "TRUST_TO_BENEFICIARY",
              dateRange: "2025",
            },
          ],
        },
      ],
    },
  ],
};

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
            Click a node to expand its children. Drag nodes to rearrange.
            Scroll to zoom, drag the canvas to pan.
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
                data={dummyData}
                viewMode={viewMode}
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
              <PartyNodeDiagram data={dummyData} viewMode={viewMode} />
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
