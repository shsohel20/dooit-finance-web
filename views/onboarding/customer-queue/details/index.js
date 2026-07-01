"use client";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  AlertTriangle,
  CheckCircle2,
  GitPullRequest,
  Building2,
  ImageIcon,
  Rocket,
  X,
  Timer,
  Wallet,
} from "lucide-react";
import { cn, dateShowFormat, fmt, KYC_HISTORY_STATUS } from "@/lib/utils";
import { RelatedPartyDrawer } from "./RelatedPartyDrawer";
import { AmlMatchesTable } from "./AmlMatchesTable";
import RiskScoreCard from "@/components/RiskScoreCard";
import { SmoothZoomImageWrapper } from "@/components/CustomZoomImage";

// ─── Formatting helpers ──────────────────────────────────────────────────────

const formatLabel = (str) => {
  if (!str) return "—";
  return str?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const getRiskLabelColor = (label) => {
  switch (label?.toLowerCase()) {
    case "low":
      return "text-success";
    case "medium":
      return "text-warning-foreground";
    case "high":
    case "very high":
      return "text-danger";
    default:
      return "text-muted-foreground";
  }
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
    {children}
  </p>
);

const StatRow = ({ label, value, positive, negative }) => {
  const dotColor = negative ? "bg-danger" : positive ? "bg-success" : "bg-muted-foreground";
  const textColor = negative ? "text-danger" : positive ? "text-success" : "text-foreground";
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={cn("text-[11px] font-medium flex items-center gap-1.5", textColor)}>
        <span className={cn("size-1.5 rounded-full flex-shrink-0", dotColor)} />
        {value}
      </span>
    </div>
  );
};

const KycField = ({ label, value, encrypted }) => (
  <div className="bg-muted/40 rounded-lg px-3 py-2.5">
    <p className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wide">{label}</p>
    <p className={cn("text-xs font-medium", encrypted && "text-muted-foreground italic")}>
      {encrypted ? "Encrypted" : value || "—"}
    </p>
  </div>
);

// ─── Journey step helpers ────────────────────────────────────────────────────

const STEP_STATUS_CONFIG = {
  approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  in_progress: {
    label: "In Progress",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  rejected: {
    label: "Rejected",
    cls: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  pending: {
    label: "Pending",
    cls: "bg-slate-50 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
  not_started: {
    label: "Not Started",
    cls: "bg-slate-50 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
};

const JOURNEY_STATUS_CONFIG = {
  not_started: STEP_STATUS_CONFIG.not_started,
  in_progress: STEP_STATUS_CONFIG.in_progress,
  completed: STEP_STATUS_CONFIG.approved,
  approved: STEP_STATUS_CONFIG.approved,
  rejected: STEP_STATUS_CONFIG.rejected,
  pending: STEP_STATUS_CONFIG.pending,
};

const STEP_TYPE_LABELS = {
  journey_start: "Journey Start",
  personal_form: "Personal Form",
  id_document: "ID Document",
  // selfie: "Selfie",
  liveness: "Liveness Check",
  proof_of_address: "Proof of Address",
  questionnaire: "Questionnaire",
  funds_wealth: "Funds & Wealth",
  declaration: "Declaration",
  authorization: "Authorization",
  consent: "Consent",
  review: "Review",
};

const getStepLabel = (step) => step.label || STEP_TYPE_LABELS[step.type] || formatLabel(step.type);

const getJourneyDisplayStatus = (journey) => {
  if (journey?.status && JOURNEY_STATUS_CONFIG[journey.status]) return journey.status;
  const steps = journey?.steps || [];
  if (steps.some((s) => s.status === "rejected")) return "rejected";
  if (steps.length > 0 && steps.every((s) => s.status === "approved")) return "completed";
  if (steps.some((s) => s.status === "in_progress")) return "in_progress";
  return "not_started";
};

const formatFieldLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

const formatFieldValue = (value) => {
  if (value == null || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
};

const RESERVED_DATA_KEYS = new Set([
  "warnings",
  "faceSimilarity",
  "ocrResult",
  "result",
  "poses",
  "fields",
  "cascaded",
  "cascadeSource",
  "sumsubStatuses",
  "lastChecked",
  "submittedAt",
  "invite_method",
  "applicant_created",
  "startedAt",
  "completedAt",
]);

const StepBadge = ({ status }) => {
  const cfg = STEP_STATUS_CONFIG[status] ?? STEP_STATUS_CONFIG.pending;
  return (
    <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 font-medium gap-1", cfg.cls)}>
      <span className={cn("size-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </Badge>
  );
};

const StepIcon = ({ status, type }) => {
  const cfg = STEP_STATUS_CONFIG[status] ?? STEP_STATUS_CONFIG.pending;
  const ring = "ring-4 ring-white";

  if (type === "journey_start") {
    return (
      <div
        className={cn(
          "size-8 rounded-full flex-shrink-0 flex items-center justify-center",
          cfg.dot,
          ring,
        )}
      >
        <Rocket className="size-3.5 text-white" />
      </div>
    );
  }
  if (type === "funds_wealth") {
    return (
      <div
        className={cn(
          "size-8 rounded-full flex-shrink-0 flex items-center justify-center",
          cfg.dot,
          ring,
        )}
      >
        <Wallet className="size-3.5 text-white" />
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div
        className={cn(
          "size-8 rounded-full flex-shrink-0 flex items-center justify-center",
          cfg.dot,
          ring,
        )}
      >
        <X className="size-3.5 text-white stroke-[2.5]" />
      </div>
    );
  }
  if (status === "approved") {
    return (
      <div
        className={cn(
          "size-8 rounded-full flex-shrink-0 flex items-center justify-center",
          cfg.dot,
          ring,
        )}
      >
        <CheckCircle2 className="size-4 text-white" />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "size-8 rounded-full flex-shrink-0 flex items-center justify-center",
        cfg.dot,
        ring,
      )}
    >
      <Timer className="size-3.5 text-white" />
    </div>
  );
};

const DocField = ({ label, value, fullWidth }) => (
  <div
    className={cn(
      "rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2.5",
      fullWidth && "col-span-2",
    )}
  >
    <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-xs font-semibold text-slate-800 break-words">{value || "—"}</p>
  </div>
);

const DocImage = ({ label, url, doc }) => {
  const imageUrl = url ?? doc?.url;
  const imageLabel = label ?? doc?.docType ?? doc?.name ?? "Document";
  const isVerificationDocument = doc?.docType?.includes("id");

  return (
    <div className="flex flex-col items-start gap-1.5">
      {imageUrl ? (
        <div
          className={cn(
            "rounded-lg border overflow-hidden border-slate-200 object-cover bg-white shadow-sm",
            {
              "w-[400px] aspect-video": isVerificationDocument,
              "h-52 aspect-auto": !isVerificationDocument,
            },
          )}
        >
          <SmoothZoomImageWrapper
            zoomScale={1.2}
            duration={600}
            easing="cubic-bezier(0.22, 1, 0.36, 1)"
            enableParallax={true}
            hoverOnly={true}
            // style={{ maxWidth: 400, aspectRatio: "16/9" }}
          >
            <img src={imageUrl} alt={imageLabel} className="w-full h-full object-cover" />
          </SmoothZoomImageWrapper>
        </div>
      ) : (
        <div className="h-20 w-28 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-1">
          <ImageIcon className="size-4 text-slate-300" />
          <span className="text-[9px] text-slate-400">No image</span>
        </div>
      )}
      <span className="text-[10px] font-medium text-slate-500">{formatLabel(imageLabel)}</span>
    </div>
  );
};

const DocumentsGallery = ({ documents, className = "" }) =>
  documents?.length > 0 ? (
    <div className={cn("flex gap-4 flex-wrap pt-1", className)}>
      {documents.map((doc, i) => (
        <DocImage key={`${doc.docType ?? doc.name}-${i}`} doc={doc} />
      ))}
    </div>
  ) : null;

const DataFieldsGrid = ({ data, excludeKeys = [] }) => {
  const entries = Object.entries(data || {}).filter(
    ([key, val]) =>
      !RESERVED_DATA_KEYS.has(key) && !excludeKeys.includes(key) && val != null && val !== "",
  );
  if (entries.length === 0) return null;

  const addressKey = entries.find(([key]) => key.toLowerCase() === "address")?.[0];
  const gridEntries = entries.filter(([key]) => key !== addressKey);

  return (
    <div className="grid grid-cols-2 gap-2.5">
      {gridEntries.map(([key, val]) => (
        <DocField key={key} label={formatFieldLabel(key)} value={formatFieldValue(val)} />
      ))}
      {addressKey && (
        <DocField label="Address" value={formatFieldValue(data[addressKey])} fullWidth />
      )}
    </div>
  );
};

const EmptyStepState = ({ step }) => (
  <p className="text-xs text-slate-400 italic">
    {step.required ? "Awaiting submission" : "No data submitted yet"}
  </p>
);

const WarnBox = ({ warnings }) =>
  warnings?.length > 0 ? (
    <div className="space-y-2">
      {warnings.map((w, i) => (
        <div
          key={i}
          className="flex gap-2.5 items-start rounded-lg bg-red-50 border border-red-100 px-3 py-2.5"
        >
          <AlertTriangle className="size-3.5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 leading-relaxed">{w}</p>
        </div>
      ))}
    </div>
  ) : null;

// ── Per-step content ──

const JourneyStartContent = ({ step, journey }) => {
  const data = step.data || {};
  const meta = journey?.metadata || {};

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
      {(data.invite_method ?? meta.invite_method) && (
        <span>
          invite_method:{" "}
          <span className="font-medium text-slate-700">
            {data.invite_method ?? meta.invite_method}
          </span>
        </span>
      )}
      {(data.applicant_created ?? meta.applicant_created) !== undefined && (
        <span>
          applicant_created:{" "}
          <span className="font-medium text-slate-700">
            {String(data.applicant_created ?? meta.applicant_created)}
          </span>
        </span>
      )}
      {(data.startedAt ?? meta.startedAt ?? journey?.createdAt) && (
        <span className="font-mono text-slate-600">
          {data.startedAt
            ? data.startedAt
            : journey?.createdAt
              ? dateShowFormat(journey.createdAt)
              : meta.startedAt}
          {(data.completedAt ?? meta.completedAt)
            ? ` → ${data.completedAt ?? meta.completedAt}`
            : ""}
        </span>
      )}
      {journey?.provider && (
        <span>
          provider:{" "}
          <span className="font-medium text-slate-700">{formatLabel(journey.provider)}</span>
        </span>
      )}
    </div>
  );
};

const LivenessContent = ({ step }) => {
  const data = step.data || {};

  return (
    <div className="space-y-4">
      {(data.result || data.poses?.length > 0) && (
        <div className="grid grid-cols-3 gap-2.5">
          {/* {data.result && (
            <DocField
              label="Verdict"
              value={data.result.detected ? "Liveness Detected" : "Not Detected"}
            />
          )} */}
          {/* {data.poses?.map((pose) => (
            <DocField
              key={pose.index ?? pose.name}
              label={`Pose ${pose.index ?? ""}`.trim()}
              value={pose.name}
            />
          ))} */}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.5rem" }}>
        <div className="full-span-subgrid">
          Result:{" "}
          <span className="font-bold text-slate-700">{data?.providerResponse?.verdict}</span>
        </div>
        <div className="full-span-subgrid">
          timestamp: <span className="font-bold text-slate-700">{data?.checkedAt}</span>
        </div>
      </div>
      <DocumentsGallery documents={step.documents} />
      {!data.result && !data.poses?.length && !step.documents?.length && (
        <EmptyStepState step={step} />
      )}
    </div>
  );
};

const IdDocumentContent = ({ step }) => {
  const data = step.data || {};
  const fields = data.ocrResult?.fields || data.fields || {};
  const addressKey = Object.keys(fields).find((k) => k.toLowerCase() === "address");
  const addressValue = addressKey ? fields[addressKey] : null;
  const gridFields = Object.entries(fields).filter(([key]) => key !== addressKey);
  const warnings = data.warnings;
  console.log("data", JSON.stringify(data, null, 2));

  return (
    <div className="space-y-4">
      {(data.sumsubStatuses?.length > 0 || data.lastChecked) && (
        <div className="flex items-center gap-3 flex-wrap text-xs">
          {data.sumsubStatuses?.length > 0 && (
            <span className="font-mono text-slate-500">
              Sumsub: {data.sumsubStatuses.join(" → ")}
            </span>
          )}
          {data.lastChecked && (
            <span className="ml-auto text-slate-500">
              Last checked: <span className="font-mono text-slate-700">{data.lastChecked}</span>
            </span>
          )}
        </div>
      )}

      <WarnBox warnings={warnings} />

      {!data.ocr && Object.keys(fields).length > 0 && <DataFieldsGrid data={fields} />}

      {/* <DataFieldsGrid data={data} excludeKeys={["ocr", "fields"]} /> */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">OCR Data</h3>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "0.5rem" }}>
            {/* OCR Data Display */}
            {data.ocr && data.ocr.fields && (
              <div className="space-y-2">
                {Object.entries(data.ocr.fields)
                  .filter(([key, value]) => value && typeof value !== "object")
                  .map(([key, value]) => (
                    <div key={key} className="text-xs full-span-subgrid">
                      <span className=" text-slate-500 capitalize">
                        {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </span>
                      {/* {": "} */}
                      <span className=" font-semibold">
                        {typeof value === "string" ? `${value}` : value}
                      </span>
                    </div>
                  ))}
                {/* Optional: Show address_breakdown if present */}
                {data.ocr.fields.address_breakdown && (
                  <div className="mt-2">
                    <div className="font-light text-xs">Address Breakdown:</div>
                    {Object.entries(data.ocr.fields.address_breakdown)
                      .filter(([k, v]) => v)
                      .map(([k, v]) => (
                        <div key={k} className="text-xs pl-3">
                          <span className="font-light">
                            {k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
                          </span>{" "}
                          <span className="font-semibold">{v}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="col-span-8">
          <DocumentsGallery documents={step.documents} className={"flex-col"} />
        </div>
      </div>

      {!warnings?.length &&
        !data.faceSimilarity &&
        !data.ocr &&
        !Object.keys(fields).length &&
        !step.documents?.length && <EmptyStepState step={step} />}
    </div>
  );
};

const FundsWealthContent = ({ step }) => {
  const data = step.data || {};
  const fields = data.fields || data;

  return (
    <div className="space-y-3">
      {data.submittedAt && (
        <p className="text-xs text-slate-500">
          Submitted: <span className="font-mono text-slate-700">{data.submittedAt}</span>
        </p>
      )}
      {/* <DataFieldsGrid data={fields} /> */}
      <div className="flex items-center gap-2">
        <span className="text-xs uppercase text-slate-500">Estimated Trading Volume:</span>
        <span className="font-semibold text-slate-700">
          {data?.estimated_trading_volume?.label ?? "N/A"}
        </span>
      </div>
      {!data.submittedAt && !Object.keys(fields).length && !step.documents?.length && (
        <EmptyStepState step={step} />
      )}
    </div>
  );
};

const GenericStepContent = ({ step }) => {
  const data = step.data || {};

  return (
    <div className="space-y-3">
      <WarnBox warnings={data.warnings} />
      <DataFieldsGrid data={data} />
      <DocumentsGallery documents={step.documents} />
      {!data.warnings?.length && !Object.keys(data).length && !step.documents?.length && (
        <EmptyStepState step={step} />
      )}
    </div>
  );
};

const STEP_CONTENT_MAP = {
  journey_start: JourneyStartContent,
  personal_form: GenericStepContent,
  liveness: LivenessContent,
  id_document: IdDocumentContent,
  // selfie: SelfieContent,
  proof_of_address: GenericStepContent,
  questionnaire: GenericStepContent,
  funds_wealth: FundsWealthContent,
  declaration: GenericStepContent,
  authorization: GenericStepContent,
  consent: GenericStepContent,
  review: GenericStepContent,
};

const stepHasContent = (step) => {
  const data = step.data || {};
  return (
    step.type === "journey_start" || step.documents?.length > 0 || Object.keys(data).length > 0
  );
};

const TimelineStep = ({ step, journey, isLast }) => {
  const StepContent = STEP_CONTENT_MAP[step.type] ?? GenericStepContent;
  const isCompact = step.type === "journey_start";
  const label = getStepLabel(step);
  const data = step.data || {};
  const isSelfie = step.type === "selfie";

  if (isSelfie) return null;

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <StepIcon status={step.status} type={step.type} />
        {!isLast && <div className="w-px flex-1 bg-slate-200 min-h-6 mt-2" />}
      </div>

      <div className={cn("flex-1 min-w-0", isLast ? "pb-0" : "pb-8")}>
        <div className="flex flex-wrap items-center gap-2 mb-2.5">
          <h4 className="text-sm font-semibold text-slate-900">{label}</h4>
          <StepBadge status={step.status} />
          {step.attempts > 0 && (
            <span className="text-xs text-slate-500">
              {step.attempts} attempt{step.attempts !== 1 ? "s" : ""}
            </span>
          )}
          {data.time && step.type !== "journey_start" && (
            <span className="text-xs font-mono text-slate-500">{data.time}</span>
          )}
          {data.model && step.type === "liveness" && (
            <span className="text-xs text-slate-500">
              model: <span className="font-mono">{data.model}</span>
            </span>
          )}
          {!step.required && (
            <span className="text-[10px] text-slate-400 uppercase tracking-wide">Optional</span>
          )}
        </div>

        {isCompact ? (
          <StepContent step={step} journey={journey} />
        ) : stepHasContent(step) ? (
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <StepContent step={step} journey={journey} />
          </div>
        ) : (
          <EmptyStepState step={step} />
        )}
      </div>
    </div>
  );
};

const VerificationJourneyPanel = ({ journey, journeyIndex, clientLabel }) => {
  const steps = [...(journey?.steps || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const displayStatus = getJourneyDisplayStatus(journey);
  const statusCfg = JOURNEY_STATUS_CONFIG[displayStatus] ?? STEP_STATUS_CONFIG.pending;
  const meta = journey?.metadata || {};
  const [openEventLog, setOpenEventLog] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden">
      <div className="bg-white px-5 py-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">
              {clientLabel || `Journey ${journeyIndex + 1}`}
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              {journey.createdAt && (
                <>
                  Started:{" "}
                  <span className="text-slate-700">{dateShowFormat(journey.createdAt)}</span>
                </>
              )}
              {journey.onboardingChannel && (
                <>
                  <span className="mx-1.5 text-slate-300">•</span>
                  Channel:{" "}
                  <span className="text-slate-700 capitalize">
                    {formatLabel(journey.onboardingChannel)}
                  </span>
                </>
              )}
              {(meta.source ?? journey.provider) && (
                <>
                  <span className="mx-1.5 text-slate-300">•</span>
                  Source:{" "}
                  <span className="text-slate-700 capitalize">
                    {formatLabel(meta.source ?? journey.provider)}
                  </span>
                </>
              )}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn("text-xs px-2.5 py-1 shrink-0 gap-1.5", statusCfg.cls)}
          >
            <span className={cn("size-1.5 rounded-full", statusCfg.dot)} />
            {statusCfg.label}
          </Badge>
        </div>
      </div>

      <div className="px-5 py-5">
        {steps.length > 0 ? (
          steps.map((step, stepIdx) => (
            <TimelineStep
              key={`${step.type}-${step.order ?? stepIdx}`}
              step={step}
              journey={journey}
              isLast={stepIdx === steps.length - 1}
            />
          ))
        ) : (
          <div className="text-center py-8 text-sm text-slate-400">
            No steps defined for this journey.
          </div>
        )}
      </div>

      {journey.events?.length > 0 && (
        <div className="border-t border-slate-100 bg-white px-5 py-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-3">
            Event Log
          </p>
          <div className="divide-y divide-slate-100">
            {journey.events.slice(0, openEventLog ? journey.events.length : 3).map((event, i) => (
              <div
                key={event._id ?? i}
                className="grid items-start gap-3 py-2.5 text-xs"
                style={{ gridTemplateColumns: "5rem 1fr auto" }}
              >
                <span className="font-mono text-slate-400 tabular-nums">
                  {event.timestamp
                    ? typeof event.timestamp === "string" && event.timestamp.length <= 8
                      ? event.timestamp
                      : dateShowFormat(event.timestamp)
                    : "—"}
                </span>
                <div className="min-w-0">
                  <span className="font-medium text-slate-800">
                    {event.category ?? event.type ?? "Event"}
                  </span>
                  {event.action && <span className="text-slate-500"> / {event.action}</span>}
                  {event.description && (
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      {event.description}
                    </p>
                  )}
                </div>
                {event.status && <StepBadge status={event.status} />}
              </div>
            ))}
            <div className="flex justify-end">
              {journey.events.length > 3 && (
                <Button variant="link" className="" onClick={() => setOpenEventLog(!openEventLog)}>
                  <span className="font-mono  tabular-nums">
                    Show {openEventLog ? "less" : "more"} events
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const resolveJourneyClientLabel = (journey, relations) => {
  const relation = relations.find(
    (r) =>
      r.client === journey.client ||
      r.relationIndex === journey.relationIndex ||
      r._id === journey.relation,
  );
  return (
    relation?.clientName ||
    relation?.clientLabel ||
    journey.metadata?.clientName ||
    (relation?.client ? formatLabel(relation.client?.name) : null) ||
    (journey.client ? formatLabel(journey.client?.name) : null)
  );
};

// ─── Main component ──────────────────────────────────────────────────────────

export const DetailViewModal = ({ details, fetching }) => {
  const [openRelatedParties, setOpenRelatedParties] = useState(false);
  const [selectedJourneyIndex, setSelectedJourneyIndex] = useState(0);

  const riskAssessment = details?.riskAssessment || {};
  const kyc = details?.personalKyc || {};
  const customerDetails = kyc?.personal_form?.customer_details || {};
  const employment = kyc?.personal_form?.employment_details || {};
  const residentialAddress = kyc?.personal_form?.residential_address || {};
  const fundsWealth = kyc?.funds_wealth || {};
  const soleTrader = kyc?.sole_trader || {};

  const riskScore = details?.riskScore ?? 0;
  const riskLabel = details?.riskLabel ?? "";

  const rejectionReason = details?.kycRejectReason;
  const kycHistory = details?.kycHistory || [];
  const relations = details?.relations || [];
  const journeys = details?.journeys || [];
  console.log("details", details);

  // Parse kycRejectReason into segments for display
  const parsedRejection = rejectionReason
    ? rejectionReason.split("\n").reduce((acc, line) => {
        if (!line.trim()) return acc;
        if (line.startsWith("- ")) {
          acc.push({ type: "bullet", text: line.slice(2) });
        } else {
          acc.push({ type: "line", text: line });
        }
        return acc;
      }, [])
    : [];

  return (
    <div>
      {parsedRejection.length > 0 && (
        <Card className="border-0 border-l-4 border-l-warning overflow-hidden bg-warning/5 py-3.5">
          <div className="px-4 ">
            <SectionLabel>KYC Rejection Reason</SectionLabel>
            <div className="space-y-1 flex gap-2">
              {parsedRejection.map((seg, i) => {
                if (seg.type === "bullet") {
                  return (
                    <div key={i} className="flex gap-2 items-start pl-2">
                      <span className="text-warning-foreground mt-0.5 text-xs">–</span>
                      <p className="text-xs text-warning-foreground/90">{seg.text}</p>
                    </div>
                  );
                }
                return (
                  <p
                    key={i}
                    className={cn(
                      "text-xs",
                      i === 0 ? "font-semibold text-warning-foreground" : "text-muted-foreground",
                    )}
                  >
                    {seg.text}
                  </p>
                );
              })}
            </div>
          </div>
        </Card>
      )}
      <div className="grid grid-cols-12 gap-8">
        {/* Related parties trigger */}
        <div className="fixed top-1/2 right-0 transform -translate-y-1/2 z-10">
          <Button variant="outline" size="icon" onClick={() => setOpenRelatedParties(true)}>
            <GitPullRequest className="size-4" />
          </Button>
        </div>

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────────── */}
        <div className="col-span-3 ">
          {/* Customer Profile */}
          <Card className="border-0 ">
            <div className="flex gap-4 items-center ">
              <Avatar className="size-14 rounded-lg mb-2 border">
                <AvatarImage src={details?.user?.photoUrl} />
                <AvatarFallback className="bg-primary/10 text-primary rounded-lg">
                  <User className="size-7" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-semibold text-sm leading-tight">{details?.user?.name}</h4>
                <p className="text-[11px] text-muted-foreground ">{details?.user?.email}</p>
              </div>
            </div>

            <div>
              <StatRow
                label="User Type"
                value={`${details?.user?.userType ?? "—"} / ${details?.user?.role ?? "—"}`}
                positive
              />
              <StatRow label="Country" value={details?.country ?? "—"} positive />
              <StatRow label="Phone" value={details?.metadata?.phone ?? "—"} positive />
              <StatRow
                label="Active"
                value={details?.isActive ? "Active" : "Inactive"}
                positive={details?.isActive}
                negative={!details?.isActive}
              />
              <StatRow
                label="PEP"
                value={details?.isPep ? "Yes" : "No"}
                positive={!details?.isPep}
                negative={details?.isPep}
              />
              <StatRow
                label="Sanction"
                value={details?.sanction ? "Yes" : "No"}
                positive={!details?.sanction}
                negative={details?.sanction}
              />
              <StatRow
                label="AML Status"
                value={formatLabel(details?.amlStatus) || "—"}
                positive={details?.amlStatus === "clear"}
                negative={details?.amlStatus === "flagged"}
              />
              <StatRow
                label="Consent Screen"
                value={details?.consentToScreen ? "Yes" : "No"}
                positive={details?.consentToScreen}
                negative={!details?.consentToScreen}
              />
              <StatRow label="Sequence" value={`#${details?.sequence ?? "—"}`} positive />
              <StatRow
                label="Created"
                value={details?.createdAt ? dateShowFormat(details.createdAt) : "—"}
                positive
              />
            </div>
          </Card>

          {/* Risk Score */}
          <Card className="border-0 ">
            {/* <SectionLabel>Risk Score</SectionLabel>
            <div className="text-center mb-4">
              <div
                className={cn("text-5xl font-bold tracking-tight", getRiskLabelColor(riskLabel))}
              >
                {riskScore}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Risk Label:{" "}
                <span className={cn("font-semibold", getRiskLabelColor(riskLabel))}>
                  {riskLabel || "—"}
                </span>
              </p>
            </div> */}
            {/* <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  getRiskProgressColor(riskLabel),
                )}
                style={{ width: `${riskPercent}%` }}
              />
            </div> */}
            <Card className="border-0 ">
              <div className="flex items-start justify-between mb-4">
                <SectionLabel>Risk Assessment Breakdown</SectionLabel>
                <div className="text-right -mt-1">
                  <p className="text-[10px] text-muted-foreground">Total Score</p>
                  <p className={cn("text-xl font-bold", getRiskLabelColor(riskLabel))}>
                    {riskScore}
                    <span className="text-xs font-normal text-muted-foreground ml-1">
                      • {riskLabel}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <RiskScoreCard name="Customer Type" item={riskAssessment?.customerType} />
                <RiskScoreCard name="Jurisdiction" item={riskAssessment?.jurisdiction} />
                <RiskScoreCard name="Customer Retention" item={riskAssessment?.customerRetention} />
                <RiskScoreCard name="Channel" item={riskAssessment?.channel} />
                <RiskScoreCard name="Occupation" item={riskAssessment?.occupation} />
                <RiskScoreCard name="Product / Industry" item={riskAssessment?.product} />
              </div>
            </Card>
          </Card>
        </div>

        {/* ── RIGHT MAIN CONTENT ────────────────────────────────────────────────── */}
        <div className="col-span-9 space-y-5">
          {/* KYC Rejection Reason */}
          {/* Personal KYC Data */}{" "}
          <Card className="border-0 ">
            <SectionLabel>Personal KYC Data</SectionLabel>

            <div className="grid lg:grid-cols-5 grid-cols-2 md:grid-cols-3 gap-2.5 mb-4">
              <KycField
                label="Given Name"
                value={customerDetails.given_name}
                encrypted={customerDetails.given_name === "***"}
              />
              <KycField label="Middle Name" value={customerDetails.middle_name} />
              <KycField
                label="Surname"
                value={customerDetails.surname}
                encrypted={customerDetails.surname === "***"}
              />
              <KycField
                label="Date of Birth"
                value={
                  customerDetails.date_of_birth
                    ? dateShowFormat(customerDetails.date_of_birth)
                    : null
                }
              />
              <KycField label="Occupation" value={employment.occupation} />
              <KycField label="Industry" value={employment.industry || "—"} />
              <KycField label="Employer" value={employment.employer_name || "—"} />
              <KycField label="Country" value={formatLabel(residentialAddress.country)} />
              <KycField label="Address" value={residentialAddress.address || "—"} />
              <KycField
                label="State / Postcode"
                value={
                  [residentialAddress.state, residentialAddress.postcode]
                    .filter(Boolean)
                    .join(", ") || "—"
                }
              />
              <KycField label="Source of Funds" value={formatLabel(fundsWealth.source_of_funds)} />
              <KycField
                label="Source of Wealth"
                value={formatLabel(fundsWealth.source_of_wealth)}
              />
              <KycField label="Account Purpose" value={formatLabel(fundsWealth.account_purpose)} />
              <KycField
                label="Estimated Trading Volume"
                value={formatLabel(fundsWealth.estimated_trading_volume)}
              />
              <KycField label="Sole Trader" value={soleTrader.is_sole_trader ? "Yes" : "No"} />
            </div>

            {/* <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border">
              {[
                {
                  label: "Declarations Accepted",
                  value: details?.declaration?.declarations_accepted,
                },
                {
                  label: "Documents Attested",
                  value: details?.authorized?.documents_attested,
                },
                {
                  label: "Data Encrypted",
                  value: details?.isDataEncrypted,
                },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-[11px] text-muted-foreground">{label}:</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      value
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-danger/10 text-danger border-danger/20",
                    )}
                  >
                    {value ? "Yes" : "No"}
                  </Badge>
                </div>
              ))}
            </div> */}
          </Card>
          {/* AML Screening — per-match compliance review */}
          {details?._id && (details?.amlHits?.length > 0 || details?.amlStatus || details?.amlCheckedAt) && (
            <AmlMatchesTable customerId={details._id} />
          )}
          {/* Verification Journey */}
          <div className="rounded-xl  bg-white ">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-4">
              Verification Journeys
            </p>

            {fetching ? (
              <div className="space-y-6 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="size-8 rounded-full bg-slate-200 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                      <div className="h-20 bg-slate-200 rounded-xl animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : journeys.length === 0 ? (
              <div className="text-center py-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
                <Building2 className="size-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm text-slate-500">No verification journeys found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {journeys.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {journeys.map((journey, idx) => {
                      const tabLabel = resolveJourneyClientLabel(journey, relations);
                      return (
                        <button
                          key={journey._id ?? `${journey.client}-${idx}`}
                          type="button"
                          onClick={() => setSelectedJourneyIndex(idx)}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                            selectedJourneyIndex === idx
                              ? "border-slate-300 bg-white text-slate-900 shadow-sm"
                              : "border-transparent bg-slate-100 text-slate-600 hover:bg-slate-200/70",
                          )}
                        >
                          <Building2 className="size-3.5" />
                          Journey {idx + 1}
                          {tabLabel && (
                            <span className="text-slate-400 font-normal truncate max-w-[140px]">
                              — {tabLabel}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {journeys.map((journey, idx) =>
                  idx === selectedJourneyIndex ? (
                    <VerificationJourneyPanel
                      key={journey._id ?? `${journey.client}-${idx}`}
                      journey={journey}
                      journeyIndex={idx}
                      clientLabel={resolveJourneyClientLabel(journey, relations)}
                    />
                  ) : null,
                )}
              </div>
            )}
          </div>
          <div className="space-y-0 -mt-1">
            <h3>KYC history</h3>
            {kycHistory.map((entry, i) => {
              const s = KYC_HISTORY_STATUS[entry.status] ?? {
                badge: "bg-slate-50 text-slate-600 border-slate-200",
                dot: "bg-slate-400",
              };
              return (
                <div
                  key={entry._id ?? i}
                  className="flex items-start gap-3 py-2.5 border-b border-dashed border-gray-200 last:border-none"
                >
                  <span
                    className={cn(
                      "mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold border flex-shrink-0 flex items-center gap-1",
                      s.badge,
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", s.dot)} />
                    {fmt(entry.status)}
                  </span>
                  <p className="flex-1 text-xs text-gray-600 leading-relaxed">
                    {entry.note || "—"}
                  </p>
                  <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">
                    {entry.changedAt ? dateShowFormat(entry.changedAt) : "—"}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Risk Assessment Breakdown */}
        </div>

        {openRelatedParties && (
          <RelatedPartyDrawer open={openRelatedParties} setOpen={setOpenRelatedParties} />
        )}
      </div>
    </div>
  );
};
