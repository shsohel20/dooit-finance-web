"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconId,
  IconUsers,
} from "@tabler/icons-react";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b last:border-0">
      <div className="mt-0.5 shrink-0 rounded-md bg-muted p-1.5">
        <Icon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="flex flex-1 items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-medium text-heading text-right">{value || "—"}</span>
      </div>
    </div>
  );
}

function buildAddress(addr) {
  if (!addr) return null;
  return [addr.address, addr.suburb, addr.state, addr.postcode, addr.country]
    .filter(Boolean)
    .join(", ") || null;
}

function CustomerCard({ customer }) {
  const pf = customer?.personalKyc?.personal_form;
  const details = pf?.customer_details;
  const contact = pf?.contact_details;
  const employment = pf?.employment_details;
  const address = buildAddress(pf?.residential_address);

  const fullName =
    [details?.given_name, details?.middle_name, details?.surname].filter(Boolean).join(" ") ||
    customer?.user?.name ||
    "—";
  const email = contact?.email || customer?.user?.email;
  const phone = contact?.phone;
  const dob = details?.date_of_birth
    ? new Date(details.date_of_birth).toLocaleDateString("en-AU")
    : null;
  const customerType = customer?.relations?.[0]?.type;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconUser className="size-4" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow icon={IconUser} label="Full Name" value={fullName} />
          {dob && <InfoRow icon={IconUser} label="Date of Birth" value={dob} />}
          {details?.other_names && (
            <InfoRow icon={IconUser} label="Other Names" value={details.other_names} />
          )}
          {employment?.occupation && (
            <InfoRow icon={IconUser} label="Occupation" value={employment.occupation} />
          )}
          {employment?.industry && (
            <InfoRow icon={IconUser} label="Industry" value={employment.industry} />
          )}
          {customerType && (
            <InfoRow
              icon={IconUser}
              label="Customer Type"
              value={
                <Badge variant="outline" className="text-xs capitalize">
                  {customerType.replace(/_/g, " ")}
                </Badge>
              }
            />
          )}
        </CardContent>
      </Card>

      <Card className="border-0 border-l rounded-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconMail className="size-4" />
            Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow icon={IconMail} label="Email" value={email} />
          <InfoRow icon={IconPhone} label="Phone" value={phone} />
          <InfoRow icon={IconMapPin} label="Address" value={address} />
          {pf?.identificationNo && (
            <InfoRow icon={IconId} label="ID Number" value={pf.identificationNo} />
          )}
          {customer?.uid && (
            <InfoRow icon={IconId} label="Customer ID" value={customer.uid} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function CustomerInfoTab({ caseData }) {
  const customers = caseData?.linkedCustomers || [];

  if (customers.length === 0) {
    return (
      <Card className="border border-border shadow-sm">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No customers linked to this case.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {customers.map((c, idx) => (
        <div key={c._id || idx}>
          {customers.length > 1 && (
            <div className="flex items-center gap-2 mb-3">
              <IconUsers className="size-4 text-muted-foreground" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Customer {idx + 1}
              </span>
            </div>
          )}
          <CustomerCard customer={c} />
        </div>
      ))}
    </div>
  );
}
