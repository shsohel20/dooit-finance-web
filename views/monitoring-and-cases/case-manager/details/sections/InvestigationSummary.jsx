"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  IconAlertTriangle,
  IconUserPlus,
  IconFilter,
  IconShieldSearch,
  IconFileSearch,
  IconMailForward,
  IconNotes,
  IconArrowUpRight,
  IconUserCheck,
  IconGavel,
  IconCircleCheck,
  IconLock,
  IconRobot,
  IconClock,
  IconCircleDashed,
  IconMinus,
} from "@tabler/icons-react";
import { cn, dateShowFormatWithTime, getInitials } from "@/lib/utils";

const STATUS_STYLES = {
  Completed: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: IconCircleCheck,
  },
  "In Progress": {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: IconClock,
  },
  Pending: {
    className: "border-sky-200 bg-sky-50 text-sky-700",
    icon: IconCircleDashed,
  },
  "Not Required": {
    className: "border-slate-200 bg-slate-50 text-slate-500",
    icon: IconMinus,
  },
};

const EVENT_CONFIG = {
  alert_created: {
    icon: IconAlertTriangle,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    label: "Alert Created",
  },
  assignment: {
    icon: IconUserPlus,
    color: "bg-violet-100",
    iconColor: "text-violet-600",
    label: "Alert Assigned",
  },
  triage: {
    icon: IconFilter,
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
    label: "Alert Triaged",
  },
  risk_assessment: {
    icon: IconShieldSearch,
    color: "bg-orange-100",
    iconColor: "text-orange-600",
    label: "Risk Assessment",
  },
  ecdd: {
    icon: IconFileSearch,
    color: "bg-teal-100",
    iconColor: "text-teal-600",
    label: "ECDD",
  },
  rfi: {
    icon: IconMailForward,
    color: "bg-cyan-100",
    iconColor: "text-cyan-600",
    label: "RFI",
  },
  notes: {
    icon: IconNotes,
    color: "bg-slate-100",
    iconColor: "text-slate-600",
    label: "Investigation Notes",
  },
  escalation: {
    icon: IconArrowUpRight,
    color: "bg-rose-100",
    iconColor: "text-rose-600",
    label: "Escalation",
  },
  approval: {
    icon: IconUserCheck,
    color: "bg-emerald-100",
    iconColor: "text-emerald-600",
    label: "Supervisor Review",
  },
  decision: {
    icon: IconGavel,
    color: "bg-amber-100",
    iconColor: "text-amber-700",
    label: "Final Decision",
  },
  closed: {
    icon: IconLock,
    color: "bg-zinc-200",
    iconColor: "text-zinc-700",
    label: "Alert Closed",
  },
};

const SYSTEM_ACTORS = ["System", "AML Engine", "Transaction Monitoring System"];

/** Realistic dummy lifecycle for a structuring / unusual activity alert */
const WORKFLOW_EVENTS = [
  {
    id: "evt-01",
    type: "alert_created",
    status: "Completed",
    timestamp: "2026-07-14T08:22:00+10:00",
    actor: "Transaction Monitoring System",
    title: "Alert ALR-2026-08471 generated",
    summary:
      "Rule TM-STR-014 (Rapid Cash Structuring) triggered on three linked cash deposits totaling AUD 28,450 across a 48-hour window.",
    details: [
      { label: "Alert ID", value: "ALR-2026-08471" },
      { label: "Rule", value: "TM-STR-014 — Rapid Cash Structuring" },
      { label: "Severity", value: "High" },
      { label: "Customer", value: "Horizon Logistics Pty Ltd (CIF-449182)" },
      { label: "Exposure", value: "AUD 28,450" },
    ],
  },
  {
    id: "evt-02",
    type: "assignment",
    status: "Completed",
    timestamp: "2026-07-14T09:05:00+10:00",
    actor: "Priya Nair",
    title: "Alert assigned to investigating analyst",
    summary:
      "Queue manager assigned the alert to the Level 1 monitoring desk for first-line review within the SLA window.",
    details: [
      { label: "Assigned by", value: "Priya Nair (Queue Manager)" },
      { label: "Assigned to", value: "James Whitfield (AML Analyst L1)" },
      { label: "Queue", value: "TM — Structuring & Unusual Activity" },
      { label: "SLA due", value: "16 Jul 2026 17:00 AEST" },
    ],
  },
  {
    id: "evt-03",
    type: "triage",
    status: "Completed",
    timestamp: "2026-07-14T11:40:00+10:00",
    actor: "James Whitfield",
    title: "Initial triage completed",
    summary:
      "Triage confirmed the alert warrants full investigation. Pattern consistent with potential structuring below the AUD 10,000 CTR threshold.",
    details: [
      { label: "Analyst", value: "James Whitfield" },
      { label: "Triage outcome", value: "Proceed to Investigation" },
      { label: "Priority set", value: "High" },
      { label: "False positive indicators", value: "None identified" },
    ],
  },
  {
    id: "evt-04",
    type: "risk_assessment",
    status: "Completed",
    timestamp: "2026-07-15T10:18:00+10:00",
    actor: "James Whitfield",
    title: "Customer risk assessment performed",
    summary:
      "Inherent risk elevated due to cash-intensive industry, recent beneficial ownership change, and geographic exposure to higher-risk corridors.",
    details: [
      { label: "Previous risk rating", value: "Medium" },
      { label: "Assessed risk rating", value: "High" },
      { label: "Key drivers", value: "Cash intensity · UBO change · Corridor exposure" },
      { label: "Pep / Sanctions hit", value: "No matches" },
    ],
  },
  {
    id: "evt-05",
    type: "ecdd",
    status: "Completed",
    timestamp: "2026-07-17T15:45:00+10:00",
    actor: "Sofia Rahman",
    title: "Enhanced Customer Due Diligence (ECDD) completed",
    summary:
      "ECDD initiated following risk elevation. Source-of-funds narrative partially corroborated; residual concerns remain on deposit frequency.",
    details: [
      { label: "ECDD performed", value: "Yes" },
      { label: "Performed by", value: "Sofia Rahman (ECDD Specialist)" },
      { label: "Completed", value: "17 Jul 2026 15:45 AEST" },
      {
        label: "Findings summary",
        value:
          "Business invoices support a portion of cash inflows; three deposits lack clear linkage to declared customers. No adverse media on directors.",
      },
      { label: "ECDD outcome", value: "High risk identified — escalate for further review" },
    ],
  },
  {
    id: "evt-06",
    type: "rfi",
    status: "Completed",
    timestamp: "2026-07-18T09:30:00+10:00",
    actor: "James Whitfield",
    title: "Request for Information (RFI) issued and response received",
    summary:
      "RFI sent to the relationship manager for source-of-funds evidence and explanation of cash deposit pattern. Customer response received within the requested window.",
    details: [
      { label: "RFI sent", value: "Yes" },
      { label: "RFI ID", value: "RFI-2026-3312" },
      { label: "Recipient", value: "Marcus Chen (Relationship Manager)" },
      { label: "Request date", value: "18 Jul 2026 09:30 AEST" },
      { label: "Response received", value: "22 Jul 2026 14:12 AEST" },
      { label: "Response status", value: "Received — Partially Satisfactory" },
      {
        label: "Response summary",
        value:
          "RM provided contracts for two major cash customers. Could not substantiate the 15 Jul deposit of AUD 9,800. Customer cited ‘weekend market stall sales’ without supporting records.",
      },
    ],
  },
  {
    id: "evt-07",
    type: "notes",
    status: "Completed",
    timestamp: "2026-07-22T16:05:00+10:00",
    actor: "James Whitfield",
    title: "Investigation comments added",
    summary:
      "Analyst notes recorded after reviewing RFI response and ECDD pack. Pattern of near-threshold deposits remains unexplained.",
    details: [
      {
        label: "Comment",
        value:
          "Deposit of AUD 9,800 on 15 Jul sits just under CTR. Combined with three similar deposits in June, behaviour is inconsistent with stated BAU cash cycle. Recommend escalation to L2 / Compliance.",
      },
      { label: "Attachments referenced", value: "ECDD memo · RFI-2026-3312 response pack" },
    ],
  },
  {
    id: "evt-08",
    type: "escalation",
    status: "Completed",
    timestamp: "2026-07-23T08:50:00+10:00",
    actor: "James Whitfield",
    title: "Escalated to senior analyst / compliance",
    summary:
      "Case escalated due to incomplete SOF evidence, elevated risk rating, and recurring near-threshold cash activity.",
    details: [
      { label: "Escalated by", value: "James Whitfield (AML Analyst L1)" },
      { label: "Escalated to", value: "Elena Vargas (Senior AML Analyst / Compliance)" },
      {
        label: "Escalation reason",
        value: "Unresolved SOF · Structuring indicators · High risk ECDD",
      },
      { label: "Priority after escalation", value: "Critical" },
    ],
  },
  {
    id: "evt-09",
    type: "approval",
    status: "Completed",
    timestamp: "2026-07-24T11:20:00+10:00",
    actor: "David Okonkwo",
    title: "Supervisor review and approval",
    summary:
      "Team lead reviewed investigation pack, ECDD findings, and RFI trail. Concurred with recommendation to escalate alert to a formal case and consider SAR filing.",
    details: [
      { label: "Reviewed by", value: "David Okonkwo (AML Team Lead)" },
      { label: "Review outcome", value: "Approved — proceed with case escalation" },
      { label: "Quality checklist", value: "Passed (narrative, evidence, chronology)" },
      {
        label: "Supervisor notes",
        value:
          "Agree structuring indicators meet internal threshold. Authorise conversion to Case and draft SAR recommendation for MLRO review.",
      },
    ],
  },
  {
    id: "evt-10",
    type: "decision",
    status: "Completed",
    timestamp: "2026-07-24T14:35:00+10:00",
    actor: "Elena Vargas",
    title: "Final disposition recorded",
    summary:
      "Alert disposition set following senior review. Activity warrants formal case management and SAR recommendation to the MLRO.",
    details: [
      { label: "Final decision", value: "Escalated to Case · SAR Recommended" },
      { label: "Linked case", value: "CASE-2026-01934" },
      { label: "Decision maker", value: "Elena Vargas" },
      { label: "Disposition code", value: "ESC-CASE / SAR-REC" },
    ],
  },
  {
    id: "evt-11",
    type: "closed",
    status: "Completed",
    timestamp: "2026-07-24T15:02:00+10:00",
    actor: "Elena Vargas",
    title: "Alert closed",
    summary:
      "Alert closed after disposition. Ongoing work continues under the linked case file; alert record retained for audit.",
    details: [
      { label: "Closing date", value: "24 Jul 2026 15:02 AEST" },
      { label: "Closed by", value: "Elena Vargas (Senior AML Analyst)" },
      { label: "Closure reason", value: "Escalated to Case CASE-2026-01934" },
      { label: "Alert status", value: "Closed" },
    ],
  },
];

function StatusBadge({ status }) {
  const config = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn("gap-1 text-[0.65rem] font-medium", config.className)}>
      <Icon className="size-3" />
      {status}
    </Badge>
  );
}

function ActorLine({ actor }) {
  const isSystem = SYSTEM_ACTORS.includes(actor);
  if (isSystem) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <IconRobot className="size-3.5" />
        {actor}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Avatar className="size-4">
        <AvatarFallback className="bg-primary/10 text-[0.5rem] font-semibold text-primary">
          {getInitials(actor)}
        </AvatarFallback>
      </Avatar>
      {actor}
    </span>
  );
}

function WorkflowEvent({ event, isLast }) {
  const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.notes;
  const Icon = config.icon;

  return (
    <div className={cn("relative pl-1", !isLast && "pb-6")}>
      <div
        className={cn(
          "absolute -left-[34px] flex size-7 items-center justify-center rounded-full ring-2 ring-background",
          config.color,
        )}
      >
        <Icon className={cn("size-3.5", config.iconColor)} />
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-3.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[0.65rem] font-semibold uppercase tracking-wide text-muted-foreground">
                {config.label}
              </span>
              <StatusBadge status={event.status} />
            </div>
            <p className="text-sm font-semibold text-heading">{event.title}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {dateShowFormatWithTime(event.timestamp)}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{event.summary}</p>

        {event.details?.length > 0 && (
          <dl className="mt-3 grid gap-2 rounded-md border border-border/70 bg-background/60 p-3 sm:grid-cols-2">
            {event.details.map((row) => (
              <div
                key={row.label}
                className={cn(
                  "min-w-0",
                  row.value.length > 80 ||
                    row.label.toLowerCase().includes("summary") ||
                    row.label === "Comment"
                    ? "sm:col-span-2"
                    : "",
                )}
              >
                <dt className="text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
                  {row.label}
                </dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-heading">{row.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/60 pt-2.5">
          <ActorLine actor={event.actor} />
          <span className="text-[0.65rem] text-muted-foreground">Step ownership</span>
        </div>
      </div>
    </div>
  );
}

function WorkflowLegend() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {Object.keys(STATUS_STYLES).map((status) => (
        <StatusBadge key={status} status={status} />
      ))}
    </div>
  );
}

export default function InvestigationSummary({ caseData, sectionRef }) {
  if (!caseData) return null;

  const completedCount = WORKFLOW_EVENTS.filter((e) => e.status === "Completed").length;

  return (
    <Card
      ref={sectionRef}
      id="investigation-summary"
      className="scroll-mt-4 border-border shadow-sm"
    >
      <CardContent>
        <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-heading">Alert Investigation Workflow</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Chronological lifecycle from alert creation through final disposition
            </p>
          </div>
          <Badge variant="outline" className="w-fit text-xs">
            {completedCount}/{WORKFLOW_EVENTS.length} steps completed
          </Badge>
        </div>

        <WorkflowLegend />

        <div className="relative ml-4 border-l border-border pl-6">
          {WORKFLOW_EVENTS.map((event, idx) => (
            <WorkflowEvent
              key={event.id}
              event={event}
              isLast={idx === WORKFLOW_EVENTS.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
