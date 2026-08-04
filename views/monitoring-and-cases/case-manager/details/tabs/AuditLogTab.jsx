"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconClipboardList,
  IconAlertCircle,
  IconCircleCheck,
  IconUserCheck,
  IconNotes,
  IconEdit,
  IconPaperclip,
} from "@tabler/icons-react";
import { cn, dateShowFormatWithTime } from "@/lib/utils";
import { getAuditLog } from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";
import { useCaseManagerStore } from "@/app/store/useCaseManagerStore";

const ACTION_CONFIG = {
  case_created: {
    icon: IconAlertCircle,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    label: "Case Created",
  },
  status_change: {
    icon: IconCircleCheck,
    color: "bg-green-100",
    iconColor: "text-green-600",
    label: "Status Changed",
  },
  assignment: {
    icon: IconUserCheck,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    label: "Assignment",
  },
  note_added: {
    icon: IconNotes,
    color: "bg-gray-100",
    iconColor: "text-gray-600",
    label: "Note Added",
  },
  field_update: {
    icon: IconEdit,
    color: "bg-orange-100",
    iconColor: "text-orange-600",
    label: "Field Updated",
  },
  evidence_added: {
    icon: IconPaperclip,
    color: "bg-yellow-100",
    iconColor: "text-yellow-600",
    label: "Evidence Added",
  },
};

export default function AuditLogTab({ caseData }) {
  const { auditLogs, setAuditLogs } = useCaseManagerStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!caseData?._id) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAuditLog(caseData._id);
        if (res?.succeed) setAuditLogs(res.data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [caseData?._id, setAuditLogs]);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <IconClipboardList className="size-4" />
          Audit Log ({auditLogs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : auditLogs.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No audit entries.</p>
        ) : (
          <div className="relative ml-4 border-l border-border pl-6">
            {auditLogs.map((log, idx) => {
              const config = ACTION_CONFIG[log.action] || ACTION_CONFIG.field_update;
              const Icon = config.icon;
              return (
                <div key={log._id || idx} className="relative pb-6 last:pb-0">
                  <div
                    className={cn(
                      "absolute -left-[34px] flex size-7 items-center justify-center rounded-full ring-2 ring-background",
                      config.color,
                    )}
                  >
                    <Icon className={cn("size-3.5", config.iconColor)} />
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {config.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {dateShowFormatWithTime(log.createdAt)}
                      </span>
                    </div>
                    {log.details && (
                      <p className="mt-1 text-sm text-heading">{log.details}</p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      by {log.user?.name || "System"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
