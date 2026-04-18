"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconUser, IconMail, IconPhone, IconMapPin, IconId } from "@tabler/icons-react";

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

export default function CustomerInfoTab({ caseData }) {
  const c = caseData?.customer;
  if (!c) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconUser className="size-4" />
            Personal Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow icon={IconUser} label="Full Name" value={c.name} />
          {c.age && <InfoRow icon={IconUser} label="Age" value={`${c.age} years`} />}
          {c.dateOfBirth && <InfoRow icon={IconUser} label="Date of Birth" value={c.dateOfBirth} />}
          {c.nationality && (
            <InfoRow icon={IconUser} label="Nationality" value={c.nationality} />
          )}
          {c.occupation && <InfoRow icon={IconUser} label="Occupation" value={c.occupation} />}
          <InfoRow
            icon={IconUser}
            label="Customer Type"
            value={
              <Badge variant="outline" className="text-xs capitalize">
                {c.customerType}
              </Badge>
            }
          />
        </CardContent>
      </Card>

      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <IconMail className="size-4" />
            Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <InfoRow icon={IconMail} label="Email" value={c.email} />
          <InfoRow icon={IconPhone} label="Phone" value={c.phone} />
          <InfoRow icon={IconMapPin} label="Address" value={c.address} />
          {c.idType && (
            <InfoRow icon={IconId} label="ID Type" value={c.idType} />
          )}
          {c.idNumber && (
            <InfoRow icon={IconId} label="ID Number" value={c.idNumber} />
          )}
          {c.registrationNo && (
            <InfoRow icon={IconId} label="Registration No." value={c.registrationNo} />
          )}
          {c.industry && (
            <InfoRow icon={IconUser} label="Industry" value={c.industry} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
