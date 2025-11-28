import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export function EmploymentDetails({ customer }) {
  const employment_details =
    customer?.customer?.personalKyc.personal_form?.employment_details;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Employment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Occupation
            </dt>
            <dd className="text-sm font-medium">
              {employment_details?.occupation}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Industry
            </dt>
            <dd className="text-sm">{employment_details?.industry}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Employer
            </dt>
            <dd className="text-sm">{employment_details?.employer_name}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
