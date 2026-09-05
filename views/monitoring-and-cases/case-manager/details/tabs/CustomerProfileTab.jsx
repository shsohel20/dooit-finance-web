"use client";

// Customer Profile tab — the case's persons of interest.
//
// A case is about people, and since the POI hub landed (docs/74 C1) it can hold
// several: the subject plus any counterparty an analyst promoted. The profile
// section itself still renders one customer, so this wrapper picks which one
// and hands it the case fields that describe THAT person (`poi.overrides`,
// built in caseAdapter). Same switcher shape as the Source of Funds tab.

import { useState } from "react";
import { IconUser } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import CustomerProfileSection from "../sections/CustomerProfileSection";

export default function CustomerProfileTab({ caseData, sectionRef }) {
  const pois = caseData?.pois || [];
  const [activeId, setActiveId] = useState(null);

  // Default to the primary POI; fall back to the case as adapted when the
  // adapter produced no POI list (a case with no linked customers).
  const active = pois.find((p) => String(p.id) === String(activeId)) || pois[0] || null;
  const view = active ? { ...caseData, ...active.overrides } : caseData;

  return (
    <div className="flex flex-col gap-3">
      {pois.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {pois.length} persons of interest
          </span>
          {pois.map((poi) => {
            const selected = active && String(poi.id) === String(active.id);
            return (
              <Button
                key={poi.id}
                size="sm"
                variant={selected ? "default" : "outline"}
                className="h-8 gap-1.5 text-xs"
                onClick={() => setActiveId(poi.id)}
              >
                <IconUser className="size-3.5" />
                {poi.name || poi.uid}
                {poi.isPrimary && (
                  <span className={selected ? "opacity-80" : "text-muted-foreground"}>
                    · subject
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      )}

      {/* Remount on switch so the section cannot keep the previous POI's state. */}
      <CustomerProfileSection key={active?.id || "single"} caseData={view} sectionRef={sectionRef} />
    </div>
  );
}
