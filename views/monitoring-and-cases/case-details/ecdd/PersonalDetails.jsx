import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCircle, Calendar, Tag } from "lucide-react";

export function PersonalDetails({ customer }) {
  const customer_details =
    customer?.customer?.personalKyc.personal_form?.customer_details;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="h-5 w-5" />
          Personal Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Given Name
            </dt>
            <dd className="text-sm">{customer_details?.given_name}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Surname
            </dt>
            <dd className="text-sm">{customer_details?.surname}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Middle Name
            </dt>
            <dd className="text-sm">{customer_details?.middle_name}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground">
              Other Names
            </dt>
            <dd className="text-sm">{customer_details?.other_names}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Date of Birth
            </dt>
            <dd className="text-sm">
              {formatDate(customer_details?.date_of_birth)}
            </dd>
          </div>
          <div className="space-y-1">
            <dt className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" />
              Referral
            </dt>
            <dd className="text-sm">{customer_details?.referral}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
