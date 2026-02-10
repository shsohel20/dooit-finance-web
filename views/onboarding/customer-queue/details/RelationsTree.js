import { PartyTreeGraph } from "./party-tree.graph";
import { GraphLegend } from "./graph-legend";
const dummyData = {
  partyId: "P-3000",
  partyName: "Sheikh Hasina",
  partyType: "INDIVIDUAL",
  role: "PRIMARY_PARTY",
  pepFlag: true,
  riskRating: "HIGH",
  status: "ACTIVE",
  children: [
    {
      partyId: "P-3001",
      partyName: "Sajeeb Wazed Joy",
      partyType: "INDIVIDUAL",
      role: "IMMEDIATE_FAMILY",
      relationshipToParent: "SON",
      pepFlag: true,
      riskRating: "MEDIUM",
      status: "ACTIVE",
      children: [
        {
          partyId: "P-3002",
          partyName: "Rakib Hasan",
          partyType: "INDIVIDUAL",
          role: "CLOSE_ASSOCIATE",
          relationshipToParent: "FRIEND",
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [
            {
              partyId: "P-3003",
              partyName: "Rakib Tech Solutions Ltd",
              partyType: "BUSINESS",
              role: "OWNED_ENTITY",
              relationshipToParent: "DIRECTOR",
              ownershipPercentage: 55,
              riskRating: "HIGH",
              status: "ACTIVE",
              children: [
                {
                  partyId: "P-3004",
                  partyName: "Rakib Holdings Pte Ltd",
                  partyType: "BUSINESS",
                  role: "PARENT_COMPANY",
                  relationshipToParent: "SHAREHOLDER",
                  ownershipPercentage: 80,
                  riskRating: "HIGH",
                  status: "ACTIVE",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          partyId: "P-3005",
          partyName: "Joy Digital Services",
          partyType: "BUSINESS",
          role: "BENEFICIAL_OWNER",
          relationshipToParent: "FOUNDER",
          ownershipPercentage: 100,
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [
            {
              partyId: "P-3006",
              partyName: "Joy Innovations LLP",
              partyType: "BUSINESS",
              role: "SUBSIDIARY",
              relationshipToParent: "MANAGING_PARTNER",
              ownershipPercentage: 70,
              riskRating: "MEDIUM",
              status: "ACTIVE",
              children: [],
            },
          ],
        },
      ],
    },
    {
      partyId: "P-3007",
      partyName: "Saima Wazed Putul",
      partyType: "INDIVIDUAL",
      role: "IMMEDIATE_FAMILY",
      relationshipToParent: "DAUGHTER",
      pepFlag: true,
      riskRating: "LOW",
      status: "ACTIVE",
      children: [
        {
          partyId: "P-3008",
          partyName: "Putul Wellness Foundation",
          partyType: "LEGAL_ENTITY",
          role: "NON_PROFIT",
          relationshipToParent: "CHAIRPERSON",
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [
            {
              partyId: "P-3009",
              partyName: "Putul Healthcare Services",
              partyType: "BUSINESS",
              role: "AFFILIATED_ENTITY",
              relationshipToParent: "BOARD_MEMBER",
              riskRating: "MEDIUM",
              status: "ACTIVE",
              children: [],
            },
          ],
        },
      ],
    },
    {
      partyId: "P-3010",
      partyName: "Hasina Family Trust",
      partyType: "LEGAL_ENTITY",
      role: "TRUST",
      relationshipToParent: "SETTLOR",
      riskRating: "HIGH",
      status: "ACTIVE",
      children: [
        {
          partyId: "P-3001",
          partyName: "Sajeeb Wazed Joy",
          partyType: "INDIVIDUAL",
          role: "BENEFICIARY",
          relationshipToParent: "BENEFICIARY",
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [],
        },
        {
          partyId: "P-3007",
          partyName: "Saima Wazed Putul",
          partyType: "INDIVIDUAL",
          role: "BENEFICIARY",
          relationshipToParent: "BENEFICIARY",
          riskRating: "LOW",
          status: "ACTIVE",
          children: [],
        },
      ],
    },
    {
      partyId: "P-3011",
      partyName: "Hasina Advisory Circle",
      partyType: "LEGAL_ENTITY",
      role: "ASSOCIATED_GROUP",
      relationshipToParent: "ADVISORY_BODY",
      riskRating: "HIGH",
      status: "ACTIVE",
      children: [
        {
          partyId: "P-3012",
          partyName: "Rakib Hasan",
          partyType: "INDIVIDUAL",
          role: "ADVISOR",
          relationshipToParent: "ADVISOR",
          riskRating: "MEDIUM",
          status: "ACTIVE",
          children: [],
        },
      ],
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
