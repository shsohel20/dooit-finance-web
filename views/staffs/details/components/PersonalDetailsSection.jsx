import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LabelDetails from "@/components/LabelDetails";
import { IconUser } from "@tabler/icons-react";
import { dateShowFormat } from "@/lib/utils";

const NATIONALITY_LABELS = {
  AFG: "Afghanistan",
  ALB: "Albania",
  AUS: "Australia",
  BGD: "Bangladesh",
  BRA: "Brazil",
  CAN: "Canada",
  CHN: "China",
  DEU: "Germany",
  EGY: "Egypt",
  FRA: "France",
  GBR: "United Kingdom",
  IND: "India",
  IDN: "Indonesia",
  IRN: "Iran",
  IRQ: "Iraq",
  ITA: "Italy",
  JPN: "Japan",
  KEN: "Kenya",
  MYS: "Malaysia",
  MEX: "Mexico",
  NGA: "Nigeria",
  PAK: "Pakistan",
  PHL: "Philippines",
  RUS: "Russia",
  SAU: "Saudi Arabia",
  ZAF: "South Africa",
  KOR: "South Korea",
  ESP: "Spain",
  TUR: "Turkey",
  UAE: "United Arab Emirates",
  USA: "United States",
  VNM: "Vietnam",
};

function SectionTitle({ icon: Icon, children }) {
  return (
    <CardTitle className="flex items-center gap-2.5 text-base font-semibold">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      {children}
    </CardTitle>
  );
}

export { SectionTitle };

export default function PersonalDetailsSection({ staff }) {
  const p = staff?.personal || {};
  const nationalityLabel = p.nationality
    ? NATIONALITY_LABELS[p.nationality]
      ? `${NATIONALITY_LABELS[p.nationality]} (${p.nationality})`
      : p.nationality
    : "—";

  return (
    <Card>
      <CardHeader className="border-b border-border pb-4">
        <SectionTitle icon={IconUser}>Personal Details</SectionTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="grid grid-cols-2 gap-6">
          <LabelDetails label="First Name" value={p.firstName} />
          <LabelDetails label="Last Name" value={p.lastName} />
          <LabelDetails
            label="Date of Birth"
            value={p.dateOfBirth ? dateShowFormat(p.dateOfBirth) : "—"}
          />
          <LabelDetails label="Nationality" value={nationalityLabel} />
        </div>
      </CardContent>
    </Card>
  );
}
