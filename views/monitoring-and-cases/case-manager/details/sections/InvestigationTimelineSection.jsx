"use client";

import { useMemo } from "react";
import CollapsibleSection from "../components/CollapsibleSection";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  IconTimeline,
  IconFolder,
  IconUser,
  IconCircleCheck,
  IconMessage,
  IconAlertCircle,
  IconMessageCircle,
  IconPaperclip,
  IconRobot,
} from "@tabler/icons-react";
import { cn, dateShowFormatWithTime, getInitials } from "@/lib/utils";

const activityConfig = {
  case_created: { icon: IconAlertCircle, color: "bg-blue-100", iconColor: "text-blue-600", label: "Case Created" },
  assignment: { icon: IconUser, color: "bg-purple-100", iconColor: "text-purple-600", label: "Assignment" },
  file_upload: { icon: IconFolder, color: "bg-orange-100", iconColor: "text-orange-600", label: "File Upload" },
  status_update: { icon: IconCircleCheck, color: "bg-green-100", iconColor: "text-green-600", label: "Status Update" },
  comment: { icon: IconMessage, color: "bg-gray-100", iconColor: "text-gray-600", label: "Comment" },
  rfi: { icon: IconMessageCircle, color: "bg-teal-100", iconColor: "text-teal-600", label: "RFI" },
};

const SYSTEM_ACTORS = ["System", "AML Engine", "Admin"];

export default function InvestigationTimelineSection({ caseData, activities, sectionRef }) {
  const sorted = useMemo(
    () => [...(activities || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [activities],
  );

  if (!caseData) return null;

  return (
    <CollapsibleSection
      id="timeline"
      title="Investigation Timeline"
      icon={IconTimeline}
      badge={sorted.length}
      sectionRef={sectionRef}
    >
      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">No activity recorded.</p>
      ) : (
        <div className="relative ml-4 border-l border-border pl-6">
          {sorted.map((activity, idx) => {
            const config = activityConfig[activity.type] || activityConfig.comment;
            const Icon = config.icon;
            const isSystem = SYSTEM_ACTORS.includes(activity.user);

            return (
              <div key={activity.id || idx} className="relative pb-6 last:pb-0">
                <div
                  className={cn(
                    "absolute -left-[34px] flex size-7 items-center justify-center rounded-full ring-2 ring-background",
                    config.color,
                  )}
                >
                  <Icon className={cn("size-3.5", config.iconColor)} />
                </div>

                <div className="rounded-lg border bg-muted/20 p-3">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {config.label}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{dateShowFormatWithTime(activity.date)}</span>
                  </div>
                  <p className="mt-1 text-sm text-heading">{activity.description}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    {isSystem ? (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <IconRobot className="size-3.5" />
                        {activity.user}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Avatar className="size-4">
                          <AvatarFallback className="bg-primary/10 text-[0.5rem] font-semibold text-primary">
                            {getInitials(activity.user)}
                          </AvatarFallback>
                        </Avatar>
                        {activity.user}
                      </span>
                    )}
                    {activity.attachment && (
                      <span className="flex items-center gap-1 rounded border bg-white px-1.5 py-0.5 text-xs text-muted-foreground">
                        <IconPaperclip className="size-3" />
                        {activity.attachment}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CollapsibleSection>
  );
}
