import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LabelDetails from "@/components/LabelDetails";
import { IconAddressBook } from "@tabler/icons-react";

export default function ContactSection({ staff }) {
  const c = staff?.contact || {};

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <IconAddressBook className="h-4 w-4 text-primary" />
          </div>
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="grid grid-cols-2 gap-6">
          <LabelDetails label="Work Email" value={c.workEmail} />
          <LabelDetails label="Phone" value={c.phone} />
          <div className="col-span-2">
            <LabelDetails label="Residential Address" value={c.residentialAddress} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
