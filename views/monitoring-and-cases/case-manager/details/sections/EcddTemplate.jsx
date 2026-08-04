"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CollapsibleSection from "../components/CollapsibleSection";
import RiskScoreGauge from "../components/RiskScoreGauge";
import {
  IconAlertTriangle,
  IconClipboardCheck,
  IconShieldSearch,
  IconListCheck,
  IconUserSearch,
  IconBuildingSkyscraper,
  IconWorld,
  IconCoin,
  IconRoute,
  IconGavel,
  IconCalendarStats,
  IconFlag,
  IconCircleCheck,
  IconClock,
  IconNotes,
  IconFileCheck,
  IconFileAlert,
  IconFingerprint,
  IconUsers,
  IconCalendar,
  IconUserCheck,
  IconAlertOctagon,
  IconFileText,
  IconPaperclip,
} from "@tabler/icons-react";
import { cn, dateShowFormat, dateShowFormatWithTime, getInitials } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Dummy data                                                          */
/* ------------------------------------------------------------------ */

const ECDD_DATA = {
  ecddId: "ECDD-2026-0142",
  caseId: "CASE-2026-00876",
  customerName: "Meridian Trade & Logistics Pte Ltd",
  customerType: "Corporate",
  riskRating: "High",
  jurisdiction: "Cyprus",
  assignedCaseManager: "Sarah Bennett",
  status: "In Progress",
  createdDate: "2026-07-10T09:15:00Z",
  completedDate: null,

  reason: {
    summary:
      "This customer was escalated for Enhanced Customer Due Diligence following the detection of multiple concurrent high-risk indicators during periodic KYC refresh and transaction monitoring review.",
    triggers: [
      {
        title: "High-Risk Jurisdiction Exposure",
        description:
          "Beneficial ownership structure includes entities registered in Cyprus and the British Virgin Islands, both flagged on the internal high-risk jurisdiction list.",
      },
      {
        title: "PEP Match (Indirect)",
        description:
          "A connected shareholder was identified as a close associate of a domestic Politically Exposed Person during World-Check screening.",
      },
      {
        title: "Complex Ownership Structure",
        description:
          "Layered corporate structure across three jurisdictions with nominee directors, obscuring the ultimate beneficial owner.",
      },
      {
        title: "Unusual Transaction Activity",
        description:
          "Sudden increase in outbound wire transfers (312% above the customer's declared expected activity) to counterparties in non-cooperative jurisdictions.",
      },
      {
        title: "Adverse Media",
        description:
          "Negative news coverage linking a related entity to a customs duty evasion investigation in 2024.",
      },
    ],
  },

  customerProfile: {
    legalName: "Meridian Trade & Logistics Pte Ltd",
    tradingName: "Meridian Logistics",
    incorporationCountry: "Cyprus",
    incorporationDate: "2018-03-22T00:00:00Z",
    registrationNo: "HE 412987",
    businessActivity: "Freight forwarding, customs brokerage & bulk commodity trading",
    industry: "Logistics & Freight",
    directorNationality: "Cypriot / Lebanese (mixed board)",
    expectedActivity:
      "Monthly inbound/outbound wires of USD 150,000–250,000 relating to freight invoicing and customs settlements across the EU and MENA region.",
    actualActivity:
      "Monthly outbound wires averaging USD 780,000 over the last quarter, concentrated to three counterparties in the UAE and Hong Kong.",
    sourceOfFunds:
      "Trade receivables from freight and logistics contracts with EU-based manufacturers.",
    sourceOfWealth:
      "Accumulated business profits since incorporation (2018) plus a shareholder capital injection of USD 1.2M in 2023, supported by audited financial statements.",
  },

  riskAssessment: {
    overallScore: 78,
    overallRating: "High",
    categories: [
      {
        name: "Geographic Risk",
        icon: IconWorld,
        rating: "High",
        score: 85,
        factors: [
          "Incorporated in Cyprus (EU high-risk monitored jurisdiction)",
          "Counterparties based in UAE and Hong Kong",
          "No physical operating presence confirmed in country of incorporation",
        ],
      },
      {
        name: "Customer Risk",
        icon: IconUserSearch,
        rating: "Medium",
        score: 62,
        factors: [
          "Corporate customer with layered ownership structure",
          "Indirect association with a domestic PEP",
          "5 years operating history with no prior adverse findings",
        ],
      },
      {
        name: "Product/Service Risk",
        icon: IconBuildingSkyscraper,
        rating: "Medium",
        score: 55,
        factors: [
          "Trade finance and multi-currency wire settlement products",
          "No cash-intensive services used",
        ],
      },
      {
        name: "Transaction Risk",
        icon: IconCoin,
        rating: "High",
        score: 88,
        factors: [
          "312% deviation from declared expected transaction volume",
          "Rapid movement of funds through multiple intermediary accounts",
          "Round-number wire amounts inconsistent with invoiced freight charges",
        ],
      },
      {
        name: "Channel Risk",
        icon: IconRoute,
        rating: "Low",
        score: 30,
        factors: [
          "Onboarded via relationship manager with full documentary verification",
          "No non-face-to-face onboarding red flags",
        ],
      },
    ],
  },

  screening: {
    kycStatus: "Verified",
    kycVerifiedDate: "2026-07-12T14:20:00Z",
    identity: {
      status: "Passed",
      detail:
        "Certificate of Incorporation and director passports validated against issuing registries.",
    },
    sanctions: {
      status: "Clear",
      lists: ["OFAC SDN", "UN Consolidated", "EU Restrictive Measures", "UK HMT"],
      checkedDate: "2026-07-13T08:00:00Z",
    },
    pep: {
      status: "Potential Match — Under Review",
      detail:
        "Shareholder (18% holding) flagged as a close associate of a serving Member of Parliament.",
      checkedDate: "2026-07-13T08:00:00Z",
    },
    adverseMedia: {
      status: "Findings Identified",
      count: 2,
      detail:
        "Two articles (Reuters, 2024; local Cyprus press, 2024) reference a related freight entity under customs duty evasion investigation.",
      checkedDate: "2026-07-14T10:30:00Z",
    },
    watchlist: {
      status: "Clear",
      detail: "No matches against internal or regulatory watchlists.",
      checkedDate: "2026-07-13T08:00:00Z",
    },
    externalChecks: [
      { name: "World-Check One", result: "1 potential match (PEP association)" },
      { name: "Dow Jones Risk & Compliance", result: "Clear" },
      { name: "Refinitiv Adverse Media", result: "2 findings" },
      { name: "LexisNexis Bridger Insight", result: "Clear" },
    ],
  },

  documents: [
    {
      name: "Certificate of Incorporation",
      category: "Corporate",
      uploadedBy: "James Whitfield",
      date: "2026-07-11T09:00:00Z",
      status: "Verified",
    },
    {
      name: "Register of Directors & Shareholders",
      category: "Corporate",
      uploadedBy: "James Whitfield",
      date: "2026-07-11T09:05:00Z",
      status: "Verified",
    },
    {
      name: "Director Passport — A. Papadopoulos",
      category: "Identity",
      uploadedBy: "James Whitfield",
      date: "2026-07-11T09:10:00Z",
      status: "Verified",
    },
    {
      name: "Utility Bill (Registered Office)",
      category: "Address Proof",
      uploadedBy: "James Whitfield",
      date: "2026-07-11T09:12:00Z",
      status: "Verified",
    },
    {
      name: "Bank Statement — Last 6 Months",
      category: "Financial",
      uploadedBy: "Sarah Bennett",
      date: "2026-07-15T11:40:00Z",
      status: "Pending Review",
    },
    {
      name: "Audited Financial Statements FY2025",
      category: "Source of Wealth",
      uploadedBy: "Sarah Bennett",
      date: "2026-07-15T11:45:00Z",
      status: "Verified",
    },
    {
      name: "Corporate Tax Return FY2025",
      category: "Financial",
      uploadedBy: "Sarah Bennett",
      date: "2026-07-15T11:47:00Z",
      status: "Verified",
    },
    {
      name: "Shareholder Capital Injection Agreement",
      category: "Source of Wealth",
      uploadedBy: "Sarah Bennett",
      date: "2026-07-16T13:20:00Z",
      status: "Rejected",
      note: "Document illegible on page 2 — re-submission requested from customer.",
    },
  ],

  notes: [
    {
      investigator: "James Whitfield",
      role: "AML Analyst",
      date: "2026-07-11T10:30:00Z",
      note: "Initial KYC refresh flagged geographic and PEP risk factors. Escalated case for ECDD per policy AML-POL-014.",
    },
    {
      investigator: "James Whitfield",
      role: "AML Analyst",
      date: "2026-07-14T15:05:00Z",
      note: "Completed sanctions, PEP, and adverse media screening. Two adverse media hits found relating to a connected freight entity under customs investigation in Cyprus — none of the hits directly name the customer or its directors.",
    },
    {
      investigator: "Sarah Bennett",
      role: "Senior Case Manager",
      date: "2026-07-16T09:45:00Z",
      note: "Reviewed transaction history for the last 90 days. Outbound volume is significantly above declared expected activity. Requested supporting invoices for the three largest wires via RFI-2026-0231.",
    },
    {
      investigator: "Sarah Bennett",
      role: "Senior Case Manager",
      date: "2026-07-18T16:10:00Z",
      note: "Customer provided freight invoices for 2 of 3 flagged transactions; amounts reconcile with wire values. Third transaction still pending customer response. Source of wealth documentation for the 2023 capital injection reviewed and accepted.",
    },
    {
      investigator: "Michael Osei",
      role: "Compliance Officer",
      date: "2026-07-21T11:00:00Z",
      note: "Reviewed PEP association — shareholder's relationship to the MP is confirmed but limited to a minority (18%) passive holding with no operational control. Recommend proceeding with enhanced ongoing monitoring rather than exit.",
    },
  ],

  relatedParties: [
    {
      name: "Andreas Papadopoulos",
      relationship: "Director & Authorised Signatory",
      nationality: "Cyprus",
      ownership: "—",
      riskRating: "Medium",
      pepStatus: "Not a PEP",
    },
    {
      name: "Fadi Haddad",
      relationship: "Director",
      nationality: "Lebanon",
      ownership: "—",
      riskRating: "Medium",
      pepStatus: "Not a PEP",
    },
    {
      name: "Elena Marchetti Holdings Ltd",
      relationship: "Ultimate Beneficial Owner (52%)",
      nationality: "British Virgin Islands",
      ownership: "52%",
      riskRating: "High",
      pepStatus: "N/A",
    },
    {
      name: "Yiannis Christodoulou",
      relationship: "Shareholder (18%)",
      nationality: "Cyprus",
      ownership: "18%",
      riskRating: "High",
      pepStatus: "Close Associate of PEP",
    },
    {
      name: "Meridian Freight FZE",
      relationship: "Connected Business (Counterparty)",
      nationality: "United Arab Emirates",
      ownership: "—",
      riskRating: "High",
      pepStatus: "N/A",
    },
    {
      name: "Sofia Papadopoulos",
      relationship: "Spouse of Director",
      nationality: "Cyprus",
      ownership: "—",
      riskRating: "Low",
      pepStatus: "Not a PEP",
    },
  ],

  riskIndicators: [
    {
      label: "Customer incorporated or resident in a high-risk / monitored jurisdiction",
      triggered: true,
    },
    { label: "Beneficial ownership structure is complex or opaque", triggered: true },
    { label: "Confirmed or potential PEP association", triggered: true },
    { label: "Adverse media identified for customer or related parties", triggered: true },
    { label: "Transaction volume materially exceeds expected account activity", triggered: true },
    { label: "Use of shell companies or nominee arrangements", triggered: false },
    { label: "Frequent, rapid movement of funds between accounts ('layering')", triggered: true },
    { label: "Sanctions list or watchlist match (confirmed)", triggered: false },
    { label: "Cash-intensive business with limited transaction transparency", triggered: false },
    { label: "Customer reluctant to provide source of funds / wealth evidence", triggered: false },
    {
      label: "Transactions involving non-cooperative or sanctioned counterparties",
      triggered: true,
    },
    { label: "Multiple accounts opened in short succession", triggered: false },
  ],

  decision: {
    outcome: "Approved with Monitoring",
    rationale:
      "While the customer presents elevated geographic and transaction risk, enhanced verification confirmed a legitimate freight and logistics business model with reconcilable trade activity. The PEP association is limited to a passive minority shareholding without operational control. Given the residual risk profile, the relationship is approved subject to enhanced ongoing monitoring and a reduced periodic review cycle.",
    reviewedBy: "Sarah Bennett",
    reviewerRole: "Senior Case Manager",
    approvedBy: "Michael Osei",
    approverRole: "Compliance Officer",
    approvalDate: "2026-07-22T10:00:00Z",
    monitoring: {
      frequency: "Quarterly transaction review + Annual full KYC refresh",
      nextReviewDate: "2026-10-22T00:00:00Z",
      conditions: [
        "Enhanced transaction monitoring threshold reduced to USD 50,000 per wire",
        "Quarterly re-screening for sanctions, PEP and adverse media",
        "Outstanding RFI-2026-0231 (third flagged transaction) to be closed within 30 days",
        "Any new related party or ownership change to trigger immediate EDD refresh",
      ],
    },
  },

  auditTimeline: [
    {
      event: "ECDD Requested",
      actor: "AML Monitoring Engine",
      date: "2026-07-10T09:15:00Z",
      description:
        "Automated escalation triggered from periodic KYC refresh and transaction monitoring alert.",
    },
    {
      event: "Assigned to Investigator",
      actor: "Compliance Ops",
      date: "2026-07-10T13:00:00Z",
      description: "ECDD case assigned to James Whitfield for initial review.",
    },
    {
      event: "Documents Received",
      actor: "James Whitfield",
      date: "2026-07-11T09:12:00Z",
      description:
        "Corporate documents, director identification, and address proof received and logged.",
    },
    {
      event: "Screenings Completed",
      actor: "James Whitfield",
      date: "2026-07-14T15:05:00Z",
      description:
        "Sanctions, PEP, watchlist and adverse media screening completed across all related parties.",
    },
    {
      event: "Escalated to Senior Case Manager",
      actor: "James Whitfield",
      date: "2026-07-15T08:30:00Z",
      description:
        "Case reassigned to Sarah Bennett for transaction and source of wealth deep-dive.",
    },
    {
      event: "RFI Issued",
      actor: "Sarah Bennett",
      date: "2026-07-16T09:45:00Z",
      description:
        "RFI-2026-0231 sent to customer requesting supporting invoices for flagged wires.",
    },
    {
      event: "Investigation Finalized",
      actor: "Sarah Bennett",
      date: "2026-07-18T16:10:00Z",
      description: "All available evidence reviewed and consolidated into ECDD recommendation.",
    },
    {
      event: "Manager Review",
      actor: "Michael Osei",
      date: "2026-07-21T11:00:00Z",
      description: "Compliance Officer reviewed PEP association and transaction rationale.",
    },
    {
      event: "Final Approval",
      actor: "Michael Osei",
      date: "2026-07-22T10:00:00Z",
      description: "ECDD approved with enhanced ongoing monitoring conditions.",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Shared style maps                                                   */
/* ------------------------------------------------------------------ */

const RATING_VARIANT = { Critical: "danger", High: "danger", Medium: "warning", Low: "success" };

const DOC_STATUS_VARIANT = { Verified: "success", "Pending Review": "warning", Rejected: "danger" };

const SCREENING_STATUS_VARIANT = {
  Clear: "success",
  Verified: "success",
  Passed: "success",
  "Findings Identified": "warning",
  "Potential Match — Under Review": "warning",
  "Confirmed Match": "danger",
};

const OUTCOME_VARIANT = {
  Approved: "success",
  "Approved with Monitoring": "info",
  Escalated: "warning",
  Rejected: "danger",
};

const ECDD_STATUS_VARIANT = {
  Completed: "success",
  "In Progress": "warning",
  Escalated: "danger",
  Draft: "outline",
};

function scoreColor(score) {
  if (score >= 80) return "var(--danger)";
  if (score >= 50) return "var(--warning)";
  return "var(--success)";
}

/* ------------------------------------------------------------------ */
/* Small reusable building blocks                                      */
/* ------------------------------------------------------------------ */

function FieldRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-heading">{value ?? "—"}</span>
    </div>
  );
}

function RiskCategoryCard({ category }) {
  const Icon = category.icon;
  const color = scoreColor(category.score);
  return (
    <div className="rounded-lg border p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-muted p-1.5">
            <Icon className="size-3.5 text-muted-foreground" />
          </div>
          <span className="text-sm font-semibold text-heading">{category.name}</span>
        </div>
        <StatusPill variant={RATING_VARIANT[category.rating] || "outline"}>
          {category.rating}
        </StatusPill>
      </div>
      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${category.score}%`, backgroundColor: color }}
        />
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {category.factors.map((f) => (
          <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground/50" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScreeningRow({ icon: Icon, label, status, detail, checkedDate }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b last:border-0">
      <div className="mt-0.5 shrink-0 rounded-md bg-muted p-1.5">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium text-heading">{label}</span>
          <StatusPill variant={SCREENING_STATUS_VARIANT[status] || "outline"}>{status}</StatusPill>
        </div>
        {detail && <p className="mt-1 text-xs text-muted-foreground">{detail}</p>}
        {checkedDate && (
          <p className="mt-1 text-[0.7rem] text-muted-foreground">
            Checked {dateShowFormatWithTime(checkedDate)}
          </p>
        )}
      </div>
    </div>
  );
}

function DocumentRow({ doc }) {
  return (
    <div className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-start sm:justify-between border-b last:border-0">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="mt-0.5 shrink-0 rounded-md bg-muted p-1.5">
          <IconFileCheck className="size-3.5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-heading">{doc.name}</p>
          <p className="text-xs text-muted-foreground">
            {doc.category} · Uploaded by {doc.uploadedBy} · {dateShowFormat(doc.date)}
          </p>
          {doc.note && (
            <p className="mt-1 flex items-center gap-1 text-xs text-danger">
              <IconFileAlert className="size-3.5 shrink-0" />
              {doc.note}
            </p>
          )}
        </div>
      </div>
      <StatusPill variant={DOC_STATUS_VARIANT[doc.status] || "outline"} className="shrink-0">
        {doc.status}
      </StatusPill>
    </div>
  );
}

function NoteEntry({ note, isLast }) {
  return (
    <div className={cn("flex items-start gap-3 py-3", !isLast && "border-b last:border-0")}>
      <Avatar className="size-7 shrink-0">
        <AvatarFallback className="bg-primary/10 text-[0.6rem] font-semibold text-primary">
          {getInitials(note.investigator)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold text-heading">
            {note.investigator}{" "}
            <span className="font-normal text-muted-foreground">· {note.role}</span>
          </span>
          <span className="text-xs text-muted-foreground">{dateShowFormatWithTime(note.date)}</span>
        </div>
        <p className="mt-1 text-sm text-heading">{note.note}</p>
      </div>
    </div>
  );
}

function RiskIndicatorItem({ indicator }) {
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-md border p-2.5",
        indicator.triggered ? "border-danger/20 bg-danger/5" : "border-border/70 bg-muted/20",
      )}
    >
      {indicator.triggered ? (
        <IconAlertTriangle className="mt-0.5 size-4 shrink-0 text-danger" />
      ) : (
        <IconCircleCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground/40" />
      )}
      <span
        className={cn(
          "text-sm",
          indicator.triggered ? "font-medium text-heading" : "text-muted-foreground",
        )}
      >
        {indicator.label}
      </span>
    </div>
  );
}

const AUDIT_EVENT_CONFIG = {
  "ECDD Requested": { icon: IconAlertOctagon, color: "bg-blue-100", iconColor: "text-blue-600" },
  "Assigned to Investigator": {
    icon: IconUserCheck,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  "Documents Received": {
    icon: IconPaperclip,
    color: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  "Screenings Completed": {
    icon: IconShieldSearch,
    color: "bg-teal-100",
    iconColor: "text-teal-600",
  },
  "Escalated to Senior Case Manager": {
    icon: IconFlag,
    color: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  "RFI Issued": { icon: IconNotes, color: "bg-gray-100", iconColor: "text-gray-600" },
  "Investigation Finalized": {
    icon: IconClipboardCheck,
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  "Manager Review": { icon: IconUserSearch, color: "bg-purple-100", iconColor: "text-purple-600" },
  "Final Approval": { icon: IconCircleCheck, color: "bg-green-100", iconColor: "text-green-600" },
};

function AuditTimelineItem({ item, isLast }) {
  const config = AUDIT_EVENT_CONFIG[item.event] || {
    icon: IconClock,
    color: "bg-gray-100",
    iconColor: "text-gray-600",
  };
  const Icon = config.icon;

  return (
    <div className="relative pb-6 last:pb-0">
      {!isLast && (
        <span className="absolute left-3.5 top-7 h-[calc(100%-1.75rem)] w-px bg-border" />
      )}
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full ring-2 ring-background",
            config.color,
          )}
        >
          <Icon className={cn("size-3.5", config.iconColor)} />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-heading">{item.event}</span>
            <span className="text-xs text-muted-foreground">
              {dateShowFormatWithTime(item.date)}
            </span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{item.description}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            by <span className="font-medium text-heading">{item.actor}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export default function EcddTemplate({ sectionRef }) {
  const [showAllNotes, setShowAllNotes] = useState(false);
  const data = ECDD_DATA;

  const triggeredCount = data.riskIndicators.filter((i) => i.triggered).length;
  const visibleNotes = showAllNotes ? data.notes : data.notes.slice(-2);

  return (
    <div ref={sectionRef} id="ecdd-template" className="scroll-mt-4 flex flex-col gap-4">
      {/* ECDD Overview */}
      <Card className="border-border shadow-sm">
        <CardContent>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-heading">
                  {data.ecddId}
                </span>
                <StatusPill variant={ECDD_STATUS_VARIANT[data.status] || "outline"}>
                  {data.status}
                </StatusPill>
                <StatusPill variant={RATING_VARIANT[data.riskRating] || "outline"}>
                  {data.riskRating} Risk
                </StatusPill>
                <Badge variant="outline" className="text-xs capitalize">
                  {data.customerType}
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-heading">Enhanced Customer Due Diligence</h1>
              <p className="text-xs text-muted-foreground">
                {data.customerName} · Jurisdiction: {data.jurisdiction} · Linked Case{" "}
                <span className="font-medium text-heading">{data.caseId}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <IconCalendar className="size-3.5" />
                  <span>Created: {dateShowFormatWithTime(data.createdDate)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <IconCalendar className="size-3.5" />
                  <span>
                    Completed:{" "}
                    {data.completedDate ? dateShowFormatWithTime(data.completedDate) : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 shrink-0 xl:items-end">
              <RiskScoreGauge
                score={data.riskAssessment.overallScore}
                label="Overall ECDD Risk Score"
              />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Avatar className="size-5">
                  <AvatarFallback className="bg-primary/10 text-[0.6rem] font-semibold text-primary">
                    {getInitials(data.assignedCaseManager)}
                  </AvatarFallback>
                </Avatar>
                <span>
                  Case Manager:{" "}
                  <span className="font-semibold text-heading">{data.assignedCaseManager}</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reason for ECDD */}
      <CollapsibleSection id="ecdd-reason" title="Reason for ECDD" icon={IconAlertTriangle}>
        <p className="text-sm text-muted-foreground">{data.reason.summary}</p>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
          {data.reason.triggers.map((t) => (
            <div key={t.title} className="rounded-lg border border-warning/20 bg-warning/5 p-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold text-heading">
                <IconFlag className="size-3.5 shrink-0 text-warning" />
                {t.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Risk Assessment */}
    </div>
  );
}
