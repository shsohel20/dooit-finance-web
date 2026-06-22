import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LabelDetails from "@/components/LabelDetails";
import { IconBriefcase } from "@tabler/icons-react";
import { dateShowFormat, fmt } from "@/lib/utils";

export default function EmploymentSection({ staff }) {
  const e = staff?.employment || {};

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <IconBriefcase className="h-4 w-4 text-primary" />
          </div>
          Employment
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="grid grid-cols-2 gap-6">
          <LabelDetails
            label="Start Date"
            value={e.startDate ? dateShowFormat(e.startDate) : "—"}
          />
          <LabelDetails label="Employment Type" value={fmt(e.employmentType)} />
          <LabelDetails label="Department" value={fmt(e.department)} />
          <LabelDetails label="Job Title" value={fmt(e.jobTitle)} />
          <div className="col-span-2">
            <LabelDetails label="Reports To" value={e.reportsTo || "—"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
