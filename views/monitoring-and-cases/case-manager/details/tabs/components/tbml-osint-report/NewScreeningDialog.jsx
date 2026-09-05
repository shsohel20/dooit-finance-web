"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DOC_TYPES = [
  { value: "PI", label: "PI", hint: "Proforma Invoice" },
  { value: "LC", label: "LC", hint: "Letter of Credit" },
];

// Modal for kicking off a new screening run: drop documents, confirm the
// detected type and OSINT depth, then hand off to the (mock) screening
// pipeline. Purely client-side — there is no real upload endpoint wired up
// yet, so "Start screening" just confirms and closes.
export default function NewScreeningDialog({ open, onOpenChange, caseId = "CA-0000145" }) {
  const [queued, setQueued] = useState([{ name: "PI-123456-B.pdf", meta: "318 KB · PI detected · ready" }]);
  const [docType, setDocType] = useState("PI");

  const handleBrowse = () => {
    setQueued((prev) =>
      prev.length
        ? prev
        : [{ name: "PI-123456-B.pdf", meta: "318 KB · PI detected · ready" }],
    );
    toast.info("File picker isn't wired up in this preview — using the sample document instead.");
  };

  const handleRemove = (name) => setQueued((prev) => prev.filter((f) => f.name !== name));

  const handleStart = () => {
    if (!queued.length) {
      toast.error("Add at least one document before starting a screening run.");
      return;
    }
    toast.success("Screening run queued — this typically takes 3–5 minutes.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 p-0">
        <DialogHeader className="gap-1 border-b border-border px-6 py-4">
          <DialogTitle className="text-base">Run new TBML screening</DialogTitle>
          <DialogDescription className="text-xs">
            Case {caseId} · documents are extracted, price-tested against OSINT, then scored
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary/5 px-6 py-7 text-center">
            <UploadCloud className="size-5 text-primary" />
            <p className="text-sm font-semibold text-primary">Drop trade documents here</p>
            <p className="max-w-[320px] text-xs leading-relaxed text-muted-foreground">
              Proforma Invoice (PI) and Letter of Credit (LC). PDF, JPG or PNG up to 25 MB each.
            </p>
            <Button type="button" variant="outline" size="sm" className="mt-1" onClick={handleBrowse}>
              Browse files
            </Button>
          </div>

          {queued.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Queued</p>
              {queued.map((file) => (
                <div key={file.name} className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-heading">{file.name}</p>
                    <p className="font-mono text-[11px] text-muted-foreground">{file.meta}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(file.name)}
                    className="shrink-0 text-muted-foreground hover:text-danger"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-5">
            <div className="flex min-w-[150px] flex-col gap-1.5">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">Document type</p>
              <div className="flex gap-1.5">
                {DOC_TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setDocType(t.value)}
                    className={cn(
                      "rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors",
                      docType === t.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted/50",
                    )}
                    title={t.hint}
                  >
                    {t.value}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex min-w-[150px] flex-col gap-1.5">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">OSINT depth</p>
              <span className="w-fit rounded-md border border-border px-2.5 py-1.5 text-xs text-heading">
                Standard — 24 queries
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row items-center justify-between border-t border-border bg-muted/20 px-6 py-3.5 sm:justify-between">
          <p className="text-[11px] text-muted-foreground">Typical run time 3–5 minutes</p>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" size="sm" onClick={handleStart}>
              Start screening
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
