import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const caseData = {
  caseId: "AML-2026-001842",
  alertGroupId: "ALRT-GRP-90411",
  status: "In Review",
  priority: "High",
  riskLevel: "High",
  currentStage: "Enhanced Due Diligence",
  openedAt: "2026-04-09 09:42 UTC",
  assignedAt: "2026-04-09 10:10 UTC",
  assignedTo: "Nila Rahman (L2 Analyst)",
  approvedBy: "Pending Compliance Manager",
  dueDate: "2026-04-17 17:00 UTC",
  businessLine: "Retail Digital Banking",
  jurisdiction: "Bangladesh",
  branch: "Dhaka North",
  source: "Transaction Monitoring Engine v3.2",
  slaBreached: false,
};

const subjectProfile = {
  customerId: "CIF-00912773",
  customerName: "Mizan Trading House Ltd.",
  customerType: "Corporate",
  onboardingDate: "2022-08-14",
  expectedMonthlyTurnover: "BDT 8,500,000",
  actualMonthlyTurnover: "BDT 23,900,000",
  occupationBusiness: "Import/Export Electronics",
  residenceIncorporationCountry: "Bangladesh",
  pepStatus: "No Direct Match",
  sanctionsStatus: "No True Match",
  adverseMediaStatus: "2 Medium-Risk Hits",
  kycLastRefresh: "2025-11-03",
  kycCompleteness: "84%",
  productsUsed: ["Current Account", "Trade Services", "Internet Banking"],
};

const alertBreakdown = [
  {
    id: "AL-11081",
    type: "Structuring",
    score: 92,
    status: "Open",
    generatedAt: "2026-04-08 18:33",
  },
  {
    id: "AL-11093",
    type: "Rapid Movement",
    score: 88,
    status: "Open",
    generatedAt: "2026-04-09 01:11",
  },
  {
    id: "AL-11110",
    type: "High-Risk Geography",
    score: 79,
    status: "Suppressed",
    generatedAt: "2026-04-09 04:52",
  },
];

const relatedParties = [
  {
    name: "Mizan Trading House Ltd.",
    role: "Primary Subject",
    risk: "High",
    relation: "Account Holder",
  },
  { name: "Sadia Parvin", role: "Director", risk: "Medium", relation: "Beneficial Owner (35%)" },
  { name: "Arif Imran", role: "Director", risk: "Medium", relation: "Beneficial Owner (28%)" },
  {
    name: "Nova Imports LLC (UAE)",
    role: "Counterparty",
    risk: "High",
    relation: "Frequent Outbound Beneficiary",
  },
];

const transactions = [
  {
    reference: "TXN-7739011",
    date: "2026-04-07 09:12",
    direction: "Outbound",
    amount: "BDT 3,120,000",
    counterparty: "Nova Imports LLC",
    country: "UAE",
    channel: "SWIFT",
    scenario: "Structuring",
  },
  {
    reference: "TXN-7739455",
    date: "2026-04-07 12:46",
    direction: "Outbound",
    amount: "BDT 2,980,000",
    counterparty: "Nova Imports LLC",
    country: "UAE",
    channel: "SWIFT",
    scenario: "Structuring",
  },
  {
    reference: "TXN-7741029",
    date: "2026-04-08 16:54",
    direction: "Inbound",
    amount: "BDT 4,450,000",
    counterparty: "Orchid Components Co.",
    country: "Singapore",
    channel: "RTGS",
    scenario: "Rapid Movement",
  },
  {
    reference: "TXN-7741092",
    date: "2026-04-08 17:21",
    direction: "Outbound",
    amount: "BDT 4,210,000",
    counterparty: "Nova Imports LLC",
    country: "UAE",
    channel: "SWIFT",
    scenario: "Rapid Movement",
  },
];

const timeline = [
  { time: "2026-04-09 09:42", event: "Case auto-created from 3 linked alerts", owner: "System" },
  { time: "2026-04-09 10:10", event: "Case assigned to L2 analyst", owner: "Ops Queue Manager" },
  {
    time: "2026-04-10 11:34",
    event: "Initial review completed, escalation justified",
    owner: "Naila Rahman",
  },
  {
    time: "2026-04-11 15:20",
    event: "RFI sent to relationship manager for invoices and shipping docs",
    owner: "Naila Rahman",
  },
  {
    time: "2026-04-13 08:05",
    event: "Partial documents received; variance in declared goods value observed",
    owner: "RM Desk",
  },
];

function riskBadgeVariant(level) {
  if (level === "High") return "danger";
  if (level === "Medium") return "warning";
  return "info";
}

function statusBadgeVariant(status) {
  if (status === "Open" || status === "In Review") return "warning";
  if (status === "Closed") return "success";
  if (status === "Suppressed") return "secondary";
  return "outline";
}

function KpiCard({ label, value, helper, valueClassName = "text-xl font-semibold" }) {
  return (
    <Card className="gap-2 py-4">
      <CardContent className="px-4">
        <p className="text-xs text-neutral-500">{label}</p>
        <p className={valueClassName}>{value}</p>
        <p className="text-xs text-neutral-500 mt-1">{helper}</p>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <Card className="gap-3">
        <CardHeader className="px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div>
              <CardTitle className="text-lg">AML Case Management Dashboard</CardTitle>
              <CardDescription className="mt-1">
                Investigation workspace for risk evaluation, alert triage, and regulatory
                decisioning.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusBadgeVariant(caseData.status)}>{caseData.status}</Badge>
              <Badge variant={riskBadgeVariant(caseData.riskLevel)}>
                {caseData.riskLevel} Risk
              </Badge>
              <Badge variant="outline">Priority: {caseData.priority}</Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiCard
          label="Case Identifier"
          value={caseData.caseId}
          helper={`Alert Group: ${caseData.alertGroupId}`}
          valueClassName="text-base font-semibold font-mono"
        />
        <KpiCard
          label="Assigned Analyst"
          value={caseData.assignedTo}
          helper={`Stage: ${caseData.currentStage}`}
        />
        <KpiCard
          label="SLA Deadline"
          value={caseData.dueDate}
          helper={
            caseData.slaBreached ? "SLA breached - immediate action required" : "Within SLA window"
          }
          valueClassName="text-base font-semibold"
        />
        <KpiCard
          label="Monitoring Source"
          value={caseData.source}
          helper={`${caseData.businessLine} | ${caseData.jurisdiction}`}
          valueClassName="text-base font-semibold"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 gap-3">
          <CardHeader className="px-4 md:px-6">
            <CardTitle>Subject Risk Profile</CardTitle>
            <CardDescription>
              Core KYC and behavioral indicators used during AML investigation.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-neutral-500">Customer</p>
                <p className="font-semibold">{subjectProfile.customerName}</p>
                <p className="text-xs text-neutral-500">{subjectProfile.customerId}</p>
              </div>
              <div>
                <p className="text-neutral-500">Customer Type</p>
                <p className="font-semibold">{subjectProfile.customerType}</p>
              </div>
              <div>
                <p className="text-neutral-500">Business / Occupation</p>
                <p className="font-semibold">{subjectProfile.occupationBusiness}</p>
              </div>
              <div>
                <p className="text-neutral-500">Onboarding Date</p>
                <p className="font-semibold">{subjectProfile.onboardingDate}</p>
              </div>
              <div>
                <p className="text-neutral-500">Expected Monthly Turnover</p>
                <p className="font-semibold">{subjectProfile.expectedMonthlyTurnover}</p>
              </div>
              <div>
                <p className="text-neutral-500">Actual Monthly Turnover</p>
                <p className="font-semibold text-red-600">{subjectProfile.actualMonthlyTurnover}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="info">KYC Completeness: {subjectProfile.kycCompleteness}</Badge>
              <Badge variant="outline">PEP: {subjectProfile.pepStatus}</Badge>
              <Badge variant="outline">Sanctions: {subjectProfile.sanctionsStatus}</Badge>
              <Badge variant="warning">Adverse Media: {subjectProfile.adverseMediaStatus}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader className="px-4 md:px-6">
            <CardTitle>Regulatory Decision Snapshot</CardTitle>
            <CardDescription>
              Current position based on available evidence and alerts.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6 text-sm space-y-2">
            <p>
              <span className="text-neutral-500">Preliminary Conclusion:</span>{" "}
              <span className="font-semibold">Reasonable suspicion remains</span>
            </p>
            <p>
              <span className="text-neutral-500">SMR/SAR Recommendation:</span>{" "}
              <span className="font-semibold">Prepare draft filing</span>
            </p>
            <p>
              <span className="text-neutral-500">Account Restriction:</span>{" "}
              <span className="font-semibold">Enhanced monitoring only</span>
            </p>
            <p>
              <span className="text-neutral-500">Next Review Board:</span>{" "}
              <span className="font-semibold">2026-04-16 14:30 UTC</span>
            </p>
            <p>
              <span className="text-neutral-500">Approved By:</span>{" "}
              <span className="font-semibold">{caseData.approvedBy}</span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-3">
        <CardHeader className="px-4 md:px-6">
          <CardTitle>Linked Alerts</CardTitle>
          <CardDescription>
            Consolidated alerts contributing to this case and risk score.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 md:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Scenario</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Generated At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertBreakdown.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-mono">{alert.id}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>{alert.score}</TableCell>
                  <TableCell>
                    <Badge variant={statusBadgeVariant(alert.status)}>{alert.status}</Badge>
                  </TableCell>
                  <TableCell>{alert.generatedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="gap-3">
          <CardHeader className="px-4 md:px-6">
            <CardTitle>Related Parties</CardTitle>
            <CardDescription>
              Persons and entities with material relationship to the case subject.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0 md:px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {relatedParties.map((party) => (
                  <TableRow key={party.name}>
                    <TableCell className="font-medium">{party.name}</TableCell>
                    <TableCell>{party.role}</TableCell>
                    <TableCell>{party.relation}</TableCell>
                    <TableCell>
                      <Badge variant={riskBadgeVariant(party.risk)}>{party.risk}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="gap-3">
          <CardHeader className="px-4 md:px-6">
            <CardTitle>Investigation Timeline</CardTitle>
            <CardDescription>
              Immutable sequence of significant case actions and evidence collection.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <div className="space-y-3">
              {timeline.map((entry) => (
                <div key={`${entry.time}-${entry.event}`} className="border rounded-md p-3">
                  <p className="text-xs text-neutral-500">{entry.time}</p>
                  <p className="text-sm font-semibold">{entry.event}</p>
                  <p className="text-xs text-neutral-500 mt-1">Owner: {entry.owner}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-3">
        <CardHeader className="px-4 md:px-6">
          <CardTitle>Material Transactions Under Review</CardTitle>
          <CardDescription>
            High-value and behaviorally unusual transactions considered during dispositioning.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 md:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Counterparty</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Trigger Scenario</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.reference}>
                  <TableCell className="font-mono">{txn.reference}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{txn.direction}</TableCell>
                  <TableCell>{txn.amount}</TableCell>
                  <TableCell>{txn.counterparty}</TableCell>
                  <TableCell>{txn.country}</TableCell>
                  <TableCell>{txn.channel}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{txn.scenario}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
