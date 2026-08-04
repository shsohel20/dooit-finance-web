"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  IconArrowLeft,
  IconUserCheck,
  IconMessageCircle,
  IconAlertOctagon,
  IconGavel,
  IconBan,
  IconDots,
  IconPrinter,
  IconFileExport,
  IconCopy,
  IconRotateClockwise,
  IconCalendar,
  IconRefresh,
} from "@tabler/icons-react";
import { dateShowFormatWithTime, getInitials } from "@/lib/utils";
import RiskScoreGauge from "./components/RiskScoreGauge";
import SlaCountdown from "./components/SlaCountdown";
import ReasonAlertDialog from "./components/ReasonAlertDialog";

// Keyed lowercase to match the Case model enums
// (low | medium | high | critical). Values are normalised before lookup so
// Title-case values from the mock fixtures still resolve.
const priorityVariants = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "outline",
};

const statusVariants = {
  open: "info",
  under_investigation: "warning",
  pending_review: "outline",
  closed: "success",
  escalated: "danger",
};

const STATUS_LABELS = {
  open: "Open",
  under_investigation: "Under Investigation",
  pending_review: "Pending Review",
  closed: "Closed",
  escalated: "Escalated",
};

export default function CaseHeader({
  caseData,
  status,
  priority,
  assignedAnalyst,
  onOpenAssign,
  onOpenRFI,
  onEscalate,
  onGenerateSTR,
  onCloseCase,
  onReopenCase,
}) {
  const router = useRouter();

  if (!caseData) return null;

  const statusKey = String(status ?? "").toLowerCase();
  const priorityKey = String(priority ?? "").toLowerCase();
  const isClosed = statusKey === "closed";

  return (
    <div className="rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2"></div>
      <div className="flex items-center gap-2 mb-4 text-neutral-500">
        <div className="flex items-center gap-1.5">
          <IconCalendar className="size-3.5" />
          <span>
            Created: <span className=" ">{dateShowFormatWithTime(caseData.createdDate)}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <IconRefresh className="size-3.5" />
          <span>
            Updated: <span className=" ">{dateShowFormatWithTime(caseData.lastUpdated)}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between ">
        {/* Left: identity */}
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-heading">
              {caseData.displayId || caseData.uid}
            </span>
            <StatusPill variant={statusVariants[status] || "outline"}>{status}</StatusPill>
            <StatusPill
              icon={<IconAlertOctagon />}
              variant={priorityVariants[priority] || "outline"}
            >
              {priority} Priority
            </StatusPill>
            <Badge variant="outline" className="text-xs capitalize">
              {caseData.customerType}
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-heading">{caseData.title || caseData.caseName}</h1>
          <p className="text-xs text-muted-foreground">
            {caseData.customerName || caseData.customer?.name} ·{" "}
            <span className="capitalize">
              {(caseData.caseType || caseData.type || "").replace("_", " ")}
            </span>
          </p>
        </div>

        {/* Right: risk, sla, investigator, dates */}
        <div className="flex flex-col gap-3 shrink-0 xl:items-end">
          <div className="flex items-center gap-4">
            <RiskScoreGauge score={caseData.riskScore} label="Risk Score" />
            <div className="h-10 w-px bg-border" />
            <SlaCountdown deadline={caseData.slaDeadline} className="text-sm" />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground xl:justify-end">
            <div className="flex items-center gap-1.5">
              <Avatar className="size-5">
                <AvatarFallback className="bg-primary/10 text-[0.6rem] font-semibold text-primary">
                  {getInitials(assignedAnalyst)}
                </AvatarFallback>
              </Avatar>
              <span>
                Investigator:{" "}
                <span className="font-semibold text-heading">
                  {assignedAnalyst || "Unassigned"}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={onOpenAssign}>
          <IconUserCheck className="size-3.5" />
          Assign Case
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={onOpenRFI}>
          <IconMessageCircle className="size-3.5" />
          Request Information
        </Button>

        <ReasonAlertDialog
          trigger={
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <IconAlertOctagon className="size-3.5" />
                Escalate
              </Button>
            </AlertDialogTrigger>
          }
          title="Escalate this case"
          description="This raises the case priority and notifies the compliance lead. Provide a reason for the audit trail."
          actionLabel="Escalate Case"
          onConfirm={(reason) => {
            onEscalate?.(reason);
            toast.success("Case escalated to Critical priority");
          }}
        />

        <ReasonAlertDialog
          trigger={
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <IconGavel className="size-3.5" />
                Generate STR/SAR
              </Button>
            </AlertDialogTrigger>
          }
          title="Generate STR/SAR draft"
          description="A draft Suspicious Transaction/Activity Report will be created from this case's evidence for compliance review."
          actionLabel="Generate Draft"
          onConfirm={(reason) => {
            onGenerateSTR?.(reason);
            toast.success("STR/SAR draft created");
          }}
        />

        {isClosed ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={() => {
              onReopenCase?.();
              toast.success("Case reopened");
            }}
          >
            <IconRotateClockwise className="size-3.5" />
            Reopen Case
          </Button>
        ) : (
          <ReasonAlertDialog
            destructive
            trigger={
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs text-danger hover:text-danger"
                >
                  <IconBan className="size-3.5" />
                  Close Case
                </Button>
              </AlertDialogTrigger>
            }
            title="Close this case"
            description="This marks the investigation as closed. You can reopen it later if new evidence emerges."
            actionLabel="Close Case"
            onConfirm={(reason) => {
              onCloseCase?.(reason);
              toast.success("Case closed");
            }}
          />
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="ml-auto">
              <IconDots className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.info("Sending to printer...")}>
              <IconPrinter className="size-4" />
              Print Case Summary
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Case PDF export queued")}>
              <IconFileExport className="size-4" />
              Export Case PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("Case duplicated as a new investigation")}>
              <IconCopy className="size-4" />
              Duplicate Case
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
