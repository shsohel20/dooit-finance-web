"use client";

import { cn } from "@/lib/utils";
import FormSection from "../shared/FormSection";
import { ecddSections, gfsSections } from "../data/investigationHubData";

export default function NarrativeStep({ wizard }) {
  const { narrativeTpl, setNarrativeTpl } = wizard;
  const sections = narrativeTpl === "ecdd" ? ecddSections() : gfsSections();

  return (
    <div>
      <div className="mb-5 inline-flex gap-1 rounded-lg bg-muted/60 p-1">
        {[
          { key: "ecdd", label: "ECDD narrative" },
          { key: "gfs", label: "GFS narrative" },
        ].map((tpl) => (
          <button
            key={tpl.key}
            type="button"
            onClick={() => setNarrativeTpl(tpl.key)}
            className={cn(
              "rounded-md px-4 py-1.5 text-[12.5px] font-semibold transition-colors",
              narrativeTpl === tpl.key
                ? "bg-white text-primary shadow-sm"
                : "text-muted-foreground hover:text-heading",
            )}
          >
            {tpl.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {sections.map((sec) => (
          <FormSection key={sec.heading} heading={sec.heading} fields={sec.fields} />
        ))}
      </div>
    </div>
  );
}
