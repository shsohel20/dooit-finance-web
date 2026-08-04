"use client";

import { Textarea } from "@/components/ui/textarea";

export default function SmrPartB() {
  return (
    <div>
      <div className="mb-1.5 text-[13px] font-bold text-heading">
        3. Provide details of the nature and circumstances surrounding the matter
      </div>
      <div className="mb-3 text-xs italic text-muted-foreground">
        Note: Do not provide account or transaction details here — these are captured in Parts C–F.
      </div>
      <Textarea
        placeholder="Describe the nature and circumstances of the suspicious matter…"
        className="min-h-[280px] resize-y text-[13.5px] leading-relaxed"
      />
    </div>
  );
}
