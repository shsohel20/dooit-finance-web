"use client";

import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight, IconCheck, IconDeviceFloppy } from "@tabler/icons-react";
import FormSection from "../../shared/FormSection";
import SmrPartStepper from "./SmrPartStepper";
import SmrPartA from "./SmrPartA";
import SmrPartB from "./SmrPartB";
import { SMR_PART_TITLES, smrFormSections } from "../../data/investigationHubData";

export default function SmrStep({ caseData, wizard }) {
  const { smrPart, setSmrPart, smrGo } = wizard;
  const isFirst = smrPart === "A";
  const isLast = smrPart === "H";
  const genericSections = !["A", "B"].includes(smrPart) ? smrFormSections(smrPart) : [];

  return (
    <div>
      <SmrPartStepper smrPart={smrPart} setSmrPart={setSmrPart} />

      <div className="mb-5 flex items-center gap-2.5">
        <span className="flex size-[34px] items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {smrPart}
        </span>
        <span className="text-base font-bold uppercase tracking-wide text-heading">
          {SMR_PART_TITLES[smrPart]}
        </span>
      </div>

      {smrPart === "A" && <SmrPartA caseData={caseData} wizard={wizard} />}
      {smrPart === "B" && <SmrPartB />}
      {genericSections.length > 0 && (
        <div className="flex flex-col gap-4">
          {genericSections.map((sec, i) => (
            <FormSection key={i} heading={sec.heading} note={sec.note} fields={sec.fields} />
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => smrGo(-1)} disabled={isFirst}>
          <IconChevronLeft className="size-3.5" />
          Previous
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5">
          <IconDeviceFloppy className="size-3.5" />
          Save progress
        </Button>
        <Button size="sm" className="gap-1.5" onClick={() => smrGo(1)}>
          {isLast ? "Submit SMR" : "Next"}
          {isLast ? <IconCheck className="size-3.5" /> : <IconChevronRight className="size-3.5" />}
        </Button>
      </div>
    </div>
  );
}
