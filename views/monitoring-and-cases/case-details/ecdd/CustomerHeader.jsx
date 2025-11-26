import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  Globe,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export function CustomerHeader({ customer }) {
  // const { personalKyc, kycStatus, isPep, sanction, country, isActive } =
  //   customer;
  const personalKyc = customer?.customer?.personalKyc;
  const kycStatus = customer?.kycStatus;
  const isPep = customer?.isPep;
  const sanction = customer?.sanction;
  const country = customer?.country;
  const isActive = customer?.isActive;
  // const { given_name, middle_name, surname } =
  //   personalKyc.personal_form.customer_details;
  const given_name = personalKyc?.personal_form?.customer_details?.given_name;
  const middle_name = personalKyc?.personal_form?.customer_details?.middle_name;
  const surname = personalKyc?.personal_form?.customer_details?.surname;
  // const { email, phone } = personalKyc.personal_form.contact_details;
  const email = personalKyc?.personal_form?.contact_details?.email;
  const phone = personalKyc?.personal_form?.contact_details?.phone;

  const fullName = `${given_name} ${middle_name} ${surname}`;

  const getStatusBadge = (status) => {
    const statusConfig = {
      in_review: { variant: "default", label: "In Review" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    return statusConfig[status] || { variant: "secondary", label: status };
  };

  const statusInfo = getStatusBadge(kycStatus);

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <div>
              <h1 className="text-2xl font-semibold text-balance">
                {customer?.fullName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Customer ID: {customer?._id}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{country}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={statusInfo.variant} className="h-fit">
            {statusInfo.label}
          </Badge>
          {isActive && (
            <Badge
              variant="outline"
              className="h-fit bg-accent/10 text-accent-foreground"
            >
              <ShieldCheck className="mr-1 h-3 w-3" />
              Active
            </Badge>
          )}
          {isPep && (
            <Badge variant="destructive" className="h-fit">
              <AlertCircle className="mr-1 h-3 w-3" />
              PEP
            </Badge>
          )}
          {sanction && (
            <Badge variant="destructive" className="h-fit">
              <AlertCircle className="mr-1 h-3 w-3" />
              Sanctioned
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
