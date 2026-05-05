"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconTimeline,
  IconAlertCircle,
  IconCircleCheck,
  IconUserCheck,
  IconNotes,
  IconEdit,
  IconPaperclip,
  IconMessage,
} from "@tabler/icons-react";
import { cn, dateShowFormatWithTime } from "@/lib/utils";
import { useCaseManagerStore } from "@/app/store/useCaseManagerStore";

const ACTION_CONFIG = {
  case_created: { icon: IconAlertCircle, color: "bg-blue-100", iconColor: "text-blue-600", label: "Case Created" },
  status_change: { icon: IconCircleCheck, color: "bg-green-100", iconColor: "text-green-600", label: "Status Changed" },
  assignment: { icon: IconUserCheck, color: "bg-purple-100", iconColor: "text-purple-600", label: "Assignment" },
  note_added: { icon: IconNotes, color: "bg-gray-100", iconColor: "text-gray-600", label: "Note Added" },
  field_update: { icon: IconEdit, color: "bg-orange-100", iconColor: "text-orange-600", label: "Field Updated" },
  evidence_added: { icon: IconPaperclip, color: "bg-yellow-100", iconColor: "text-yellow-600", label: "Evidence Added" },
  note: { icon: IconMessage, color: "bg-indigo-100", iconColor: "text-indigo-600", label: "Note" },
};

export default function ActivityTimelineTab() {
  const { auditLogs, notes } = useCaseManagerStore();

  const timeline = useMemo(() => {
    const auditItems = auditLogs.map((log) => ({
      _id: log._id,
      type: log.action,
      date: log.createdAt,
      user: log.user,
      description: log.details,
    }));
    const noteItems = notes.map((note) => ({
      _id: note._id,
      type: "note",
      date: note.createdAt,
      user: note.author,
      description: note.content,
    }));
    return [...auditItems, ...noteItems].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [auditLogs, notes]);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <IconTimeline className="size-4" />
          Activity Timeline ({timeline.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {timeline.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">No activity recorded.</p>
        ) : (
          <div className="relative ml-4 border-l border-border pl-6">
            {timeline.map((item, idx) => {
              const config = ACTION_CONFIG[item.type] || ACTION_CONFIG.field_update;
              const Icon = config.icon;
              return (
                <div key={item._id || idx} className={cn("relative pb-6 last:pb-0")}>
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
                        {dateShowFormatWithTime(item.date)}
                      </span>
                    </div>
                    {item.description && (
                      <p className="mt-1 text-sm text-heading">{item.description}</p>
                    )}
                    <div className="mt-1 flex items-center gap-1.5">
                      {item.user && (
                        <>
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={item.user.avatar} />
                            <AvatarFallback className="text-[7px]">
                              {item.user.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {item.user.name || "System"}
                          </span>
                        </>
                      )}
                    </div>
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
