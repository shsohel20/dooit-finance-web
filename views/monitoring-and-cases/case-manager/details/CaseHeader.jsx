"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/ui/StatusPill";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  IconArrowLeft,
  IconPennant,
  IconCalendar,
  IconChevronRight,
  IconLoader2,
  IconFileReport,
  IconCheck,
} from "@tabler/icons-react";
import { cn, dateShowFormat } from "@/lib/utils";
import {
  updateCaseStatus,
  fileSAR,
} from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";

const STATUS_TRANSITIONS = {
  open: ["under_investigation"],
  under_investigation: ["pending_review"],
  pending_review: ["closed", "escalated"],
  closed: [],
  escalated: [],
};

const STATUS_LABELS = {
  open: "Open",
  under_investigation: "Under Investigation",
  pending_review: "Pending Review",
  closed: "Closed",
  escalated: "Escalated",
};

const priorityVariants = {
  low: "info",
  medium: "warning",
  high: "danger",
  critical: "dark",
};

const statusVariants = {
  open: "info",
  under_investigation: "warning",
  pending_review: "outline",
  closed: "success",
  escalated: "danger",
};

const priorityHeaderBg = {
  low: "from-blue-50 to-cyan-50 border-blue-100",
  medium: "from-yellow-50 to-amber-50 border-yellow-100",
  high: "from-red-50 to-orange-50 border-red-100",
  critical: "from-gray-900/5 to-gray-800/5 border-gray-300",
};

export default function CaseHeader({ caseData, onCaseUpdate }) {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);
  const [sarSubmitting, setSarSubmitting] = useState(false);
  // confirm = { toStatus } | null
  const [confirm, setConfirm] = useState(null);
  const [closureReason, setClosureReason] = useState("");

  if (!caseData) return null;

  const nextStatuses = STATUS_TRANSITIONS[caseData.status] || [];

  const doTransition = async (toStatus) => {
    setTransitioning(true);
    try {
      const res = await updateCaseStatus(
        caseData._id,
        toStatus,
        closureReason.trim() || undefined
      );
      if (res?.succeed) {
        onCaseUpdate?.({ ...caseData, status: toStatus, closureReason: closureReason.trim() || caseData.closureReason });
      }
    } finally {
      setTransitioning(false);
      setConfirm(null);
      setClosureReason("");
    }
  };

  const handleTransitionClick = (toStatus) => {
    if (toStatus === "closed" || toStatus === "escalated") {
      setConfirm({ toStatus });
    } else {
      doTransition(toStatus);
    }
  };

  const handleFileSAR = async () => {
    setSarSubmitting(true);
    try {
      const res = await fileSAR(caseData._id);
      if (res?.succeed) {
        onCaseUpdate?.({ ...caseData, sarFiled: true, sarFiledAt: new Date().toISOString() });
      }
    } finally {
      setSarSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "rounded-xl border bg-gradient-to-r p-5 shadow-sm",
          priorityHeaderBg[caseData.priority] || "from-gray-50 to-slate-50 border-border",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs px-2"
            onClick={() => router.push("/dashboard/client/monitoring-and-cases/case-manager")}
          >
            <IconArrowLeft className="size-3.5" />
            Back to Cases
          </Button>

          {/* SAR badge / button */}
          {caseData.sarFiled ? (
            <Badge variant="secondary" className="gap-1 text-xs">
              <IconCheck className="size-3" />
              SAR Filed
            </Badge>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              disabled={sarSubmitting}
              onClick={handleFileSAR}
            >
              {sarSubmitting ? (
                <IconLoader2 className="size-3 animate-spin" />
              ) : (
                <IconFileReport className="size-3" />
              )}
              File SAR
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-heading">{caseData.title}</h1>
              <StatusPill icon={<IconPennant />} variant={priorityVariants[caseData.priority]}>
                <span className="capitalize">{caseData.priority}</span>
              </StatusPill>
              <StatusPill variant={statusVariants[caseData.status]}>
                {STATUS_LABELS[caseData.status] || caseData.status}
              </StatusPill>
              {/* Alert source count */}
              {caseData.linkedAlerts?.length > 0 && (
                <Badge variant="outline" className="text-xs gap-1">
                  {caseData.linkedAlerts.length} linked alert{caseData.linkedAlerts.length !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {caseData.type && (
                <span className="font-mono text-xs font-medium text-heading bg-white/60 px-2 py-0.5 rounded border capitalize">
                  {caseData.type.replace("_", " ")}
                </span>
              )}
              {caseData.riskScore != null && (
                <span className="text-xs text-muted-foreground">
                  Risk score: <span className="font-semibold text-heading">{caseData.riskScore}</span>
                </span>
              )}
              {caseData.description && (
                <p className="text-xs text-muted-foreground max-w-lg line-clamp-2">
                  {caseData.description}
                </p>
              )}
            </div>

            {caseData.closureReason && (
              <p className="text-xs text-muted-foreground italic">
                Closure reason: {caseData.closureReason}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm shrink-0">
            {caseData.assignedTo?.length > 0 && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="flex -space-x-1.5">
                  {caseData.assignedTo.slice(0, 4).map((u) => (
                    <Avatar key={u._id} className="h-6 w-6 border-2 border-white">
                      <AvatarImage src={u.avatar} />
                      <AvatarFallback className="text-[8px]">
                        {u.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs">
                  {caseData.assignedTo.length === 1
                    ? caseData.assignedTo[0].name
                    : `${caseData.assignedTo.length} investigators`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconCalendar className="size-4 shrink-0" />
              <span className="text-xs">
                Created:{" "}
                <span className="font-semibold text-heading">
                  {dateShowFormat(caseData.createdAt)}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              By: <span className="font-semibold text-heading">{caseData.createdBy?.name || "—"}</span>
            </div>
          </div>
        </div>

        {/* Status transition buttons */}
        {nextStatuses.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-3">
            <span className="text-xs text-muted-foreground">Move to:</span>
            {nextStatuses.map((s) => (
              <Button
                key={s}
                size="sm"
                variant="outline"
                className="h-7 gap-1 text-xs"
                disabled={transitioning}
                onClick={() => handleTransitionClick(s)}
              >
                {transitioning ? (
                  <IconLoader2 className="size-3 animate-spin" />
                ) : (
                  <IconChevronRight className="size-3" />
                )}
                {STATUS_LABELS[s]}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Confirm close / escalate with optional reason */}
      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm?.toStatus === "closed" ? "Close Case" : "Escalate Case"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm?.toStatus === "closed"
                ? "This will mark the case as Closed."
                : "This will escalate the case to senior review / regulator."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-1.5 px-1">
            <Label className="text-xs font-medium">Reason (optional)</Label>
            <Textarea
              rows={3}
              className="resize-none text-sm"
              placeholder="Describe the reason for this decision..."
              value={closureReason}
              onChange={(e) => setClosureReason(e.target.value)}
            />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setClosureReason("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => doTransition(confirm.toStatus)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
