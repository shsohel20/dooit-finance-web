import useAlertStore from "@/app/store/alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const caseDetails = [
  // { label: "Case Type", value: "Alert" },
  // { label: "System", value: "Transaction Monitoring System" },
  { label: "Owner", value: "Sarah Johnson" },
  { label: "Related Alerts", value: "TM-2023-045, TM-2023-067" },
];

const LabelValue = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
};

export function CaseOverview() {
  const { details } = useAlertStore();

  const customer_details =
    details?.customer?.personalKyc?.personal_form?.customer_details;
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Case Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <LabelValue label="Case Type" value={details?.caseType} />
          <LabelValue
            label="Risk Score"
            value={details?.transaction?.riskScore}
          />
          <LabelValue
            label="Owner"
            value={
              customer_details?.given_name +
              " " +
              customer_details?.middle_name +
              " " +
              customer_details?.surname
            }
          />
          <LabelValue
            label="Related Alerts"
            value={details?.relatedPartyTxnId}
          />

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
