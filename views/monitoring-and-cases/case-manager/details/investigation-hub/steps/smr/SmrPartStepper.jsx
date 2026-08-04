"use client";

import { cn } from "@/lib/utils";
import { SMR_PART_ORDER } from "../../data/investigationHubData";

export default function SmrPartStepper({ smrPart, setSmrPart }) {
  const idx = SMR_PART_ORDER.indexOf(smrPart);

  return (
    <div className="mb-5 flex items-center">
      {SMR_PART_ORDER.map((p, i) => (
        <div key={p} className="flex flex-1 items-center last:flex-none">
          <button
            type="button"
            onClick={() => setSmrPart(p)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                "flex size-[30px] items-center justify-center rounded-full text-xs font-bold",
                i <= idx ? "bg-primary text-white" : "bg-muted text-muted-foreground",
              )}
            >
              {i < idx ? "✓" : p}
            </span>
            <span
              className={cn(
                "text-[10.5px] font-semibold",
                i === idx ? "text-primary" : "text-muted-foreground",
              )}
            >
              Part {p}
            </span>
          </button>
          {i < SMR_PART_ORDER.length - 1 && (
            <span className={cn("mx-1 mb-[18px] h-0.5 flex-1", i < idx ? "bg-primary" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  );
}
