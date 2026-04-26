"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  IconTimeline,
  IconFolder,
  IconUser,
  IconCircleCheck,
  IconMessage,
  IconAlertCircle,
  IconSend,
} from "@tabler/icons-react";
import { cn, dateShowFormatWithTime } from "@/lib/utils";

const activityConfig = {
  case_created: {
    icon: IconAlertCircle,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
    label: "Case Created",
  },
  assignment: {
    icon: IconUser,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    label: "Assignment",
  },
  file_upload: {
    icon: IconFolder,
    color: "bg-orange-100",
    iconColor: "text-orange-600",
    label: "File Upload",
  },
  status_update: {
    icon: IconCircleCheck,
    color: "bg-green-100",
    iconColor: "text-green-600",
    label: "Status Update",
  },
  comment: {
    icon: IconMessage,
    color: "bg-gray-100",
    iconColor: "text-gray-600",
    label: "Comment",
  },
};

export default function ActivityTimelineTab({ caseData }) {
  const [activities, setActivities] = useState(
    [...(caseData?.activities || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  );
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      type: "comment",
      date: new Date().toISOString(),
      user: "You",
      description: newComment.trim(),
    };
    setActivities((prev) => [comment, ...prev]);
    setNewComment("");
  };

  if (!caseData?.activities) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Add Comment */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconMessage className="size-4" />
            Add Comment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            rows={3}
            placeholder="Write a comment or note about this case..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none text-sm"
          />
          <Button
            size="sm"
            className="gap-1.5"
            onClick={handleAddComment}
            disabled={!newComment.trim()}
          >
            <IconSend className="size-3.5" />
            Post Comment
          </Button>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconTimeline className="size-4" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No activity recorded.
            </p>
          ) : (
            <div className="relative ml-4 border-l border-border pl-6">
              {activities.map((activity, idx) => {
                const config = activityConfig[activity.type] || activityConfig.comment;
                const Icon = config.icon;

                return (
                  <div
                    key={activity.id || idx}
                    className={cn("relative pb-6 last:pb-0")}
                  >
                    {/* Icon dot */}
                    <div
                      className={cn(
                        "absolute -left-[34px] flex size-7 items-center justify-center rounded-full ring-2 ring-background",
                        config.color,
                      )}
                    >
                      <Icon className={cn("size-3.5", config.iconColor)} />
                    </div>

                    {/* Content */}
                    <div className="rounded-lg border bg-muted/20 p-3">
                      <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {config.label}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {dateShowFormatWithTime(activity.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-heading">{activity.description}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">by {activity.user}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
