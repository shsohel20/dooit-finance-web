import { PartyTreeGraph } from "./party-tree.graph";
import { GraphLegend } from "./graph-legend";
const dummyData = {
  partyId: "P-1000",
  partyName: "Ahmed Rahman",
  partyType: "INDIVIDUAL",
  role: "PRIMARY_ACCOUNT_HOLDER",
  riskRating: "LOW",
  status: "ACTIVE",
  children: [
    {
      partyId: "P-1001",
      partyName: "Saif Rahman",
      partyType: "INDIVIDUAL",
      role: "DEPENDENT",
      relationshipToParent: "SON",
      riskRating: "MEDIUM",
      status: "ACTIVE",
      children: [
        {
          partyId: "P-1002",
          partyName: "Rafiq Hasan",
          partyType: "BUSINESS",
          role: "ASSOCIATED_PARTY",
          relationshipToParent: "FRIEND",
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [],
        },
      ],
    },
    {
      partyId: "P-1003",
      partyName: "Amina Rahman",
      partyType: "INDIVIDUAL",
      role: "DEPENDENT",
      relationshipToParent: "DAUGHTER",
      riskRating: "LOW",
      status: "INACTIVE",
      children: [],
    },
  ],
};
export function RelationsTree() {
  return (
    <main className="min-h-screen ">
      <div className="mx-auto max-w-6xl  py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Party Relationship Graph
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Click on any node to highlight its children and links. Click again to deselect.
          </p>
        </div>

        {/* Graph Card */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {/* Legend Bar */}
          <div className="border-b border-border px-6 py-3">
            <GraphLegend />
          </div>

          {/* Graph */}
          <div className="h-[560px]">
            <PartyTreeGraph data={dummyData} />
          </div>
        </div>
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
