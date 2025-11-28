import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, UserCheck, FileCheck, Send, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import useAlertStore from "@/app/store/alerts";

const timelineEvents = [
  {
    icon: Clock,
    title: "Case Opened",
    description: "Case was created by system alert",
    timestamp: "2023-05-10 | 09:15 AM",
    status: "completed",
  },
  {
    icon: UserCheck,
    title: "Assigned to Analyst",
    description: "Case assigned to Sarah Johnson",
    timestamp: "2023-05-10 | 09:16 AM",
    status: "completed",
  },
  {
    icon: FileCheck,
    title: "Initial Review Completed",
    description: "Analyst completed initial assessment",
    timestamp: "2023-05-12 | 02:45 PM",
    status: "completed",
  },
  {
    icon: Send,
    title: "RFI Sent",
    description: "Request for information sent to the customer",
    timestamp: "2023-05-13 | 11:20 AM",
    status: "active",
  },
];

export function ActivityTimeline() {
  const { details } = useAlertStore();
  console.log("details", details?.activity);
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {details?.activity?.map((event, index) => {
            const Icon = AlertCircle;
            return (
              <div key={index} className="flex gap-4 relative">
                {index !== details?.activity?.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-px bg-border" />
                )}
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2",
                    event.status === "active"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4",
                      event.status === "active"
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1 space-y-1 pt-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{event.title}</p>
                    {event.status === "active" && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 text-xs"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {event.details}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">
                    {event.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
