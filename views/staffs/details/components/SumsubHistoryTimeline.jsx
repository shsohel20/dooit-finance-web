import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconHistory,
  IconUserPlus,
  IconUserCheck,
  IconFileCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { cn, dateShowFormatWithTime, fmt } from "@/lib/utils";

const EVENT_CONFIG = {
  applicant_created: {
    icon: IconUserPlus,
    label: "Applicant Created",
    variant: "success",
  },
  applicant_found: {
    icon: IconUserCheck,
    label: "Applicant Found",
    variant: "info",
  },
  document_uploaded: {
    icon: IconFileCheck,
    label: "Document Uploaded",
    variant: "warning",
  },
};

const VARIANT_CLASSES = {
  success: {
    wrapper: "bg-success/10 border-success/30",
    icon: "text-success",
    dot: "bg-success",
  },
  info: {
    wrapper: "bg-blue-50 border-blue-200",
    icon: "text-blue-600",
    dot: "bg-blue-500",
  },
  warning: {
    wrapper: "bg-warning/10 border-warning/30",
    icon: "text-yellow-700",
    dot: "bg-warning",
  },
  muted: {
    wrapper: "bg-muted/20 border-border",
    icon: "text-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

export default function SumsubHistoryTimeline({ staff }) {
  const history = staff?.sumsubHistory || [];

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
              <IconHistory className="h-4 w-4 text-primary" />
            </div>
            Verification History
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            {history.length} event{history.length !== 1 ? "s" : ""}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/40 mb-3">
              <IconHistory className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground">No verification history</p>
          </div>
        ) : (
          <div className="relative">
            {history.map((event, index) => {
              const config = EVENT_CONFIG[event.event] || {
                icon: IconAlertCircle,
                label: fmt(event.event),
                variant: "muted",
              };
              const Icon = config.icon;
              const colors = VARIANT_CLASSES[config.variant] || VARIANT_CLASSES.muted;
              const isLast = index === history.length - 1;

              return (
                <div key={event._id || index} className="flex gap-4 relative">
                  {!isLast && (
                    <div className="absolute left-[17px] top-9 bottom-0 w-px bg-border z-0" />
                  )}
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 z-10 mt-0.5",
                      colors.wrapper
                    )}
                  >
                    <Icon className={cn("h-4 w-4", colors.icon)} />
                  </div>
                  <div className={cn("flex-1", !isLast ? "pb-6" : "pb-0")}>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {config.label}
                    </p>
                    {event.note && (
                      <p className="text-xs text-muted-foreground mt-0.5">{event.note}</p>
                    )}
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                      {event.at ? dateShowFormatWithTime(event.at) : "—"}
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
