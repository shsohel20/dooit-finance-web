import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const caseDetails = [
  { label: "Case Type", value: "Alert" },
  { label: "System", value: "Transaction Monitoring System" },
  { label: "Owner", value: "Sarah Johnson" },
  { label: "Related Alerts", value: "TM-2023-045, TM-2023-067" },
];

export function CaseOverview() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Case Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {caseDetails.map((detail, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-3 border-b border-border last:border-0"
            >
              <span className="text-sm font-medium text-muted-foreground">
                {detail.label}
              </span>
              <span className="text-sm text-foreground text-right max-w-[60%]">
                {detail.value}
              </span>
            </div>
          ))}
          <div className="pt-4">
            <div className="rounded-lg bg-muted/50 border border-border p-4">
              <h4 className="text-sm font-medium text-foreground mb-2">
                Status
              </h4>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Awaiting customer response
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
