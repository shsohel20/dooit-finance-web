"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { analysts } from "@/lib/case-manager-data";

export default function ReassignCaseModal({ open, onOpenChange, currentAnalyst, onSubmit }) {
  const [selected, setSelected] = useState("");
  const [reason, setReason] = useState("");

  const reset = () => {
    setSelected("");
    setReason("");
  };

  const handleSubmit = () => {
    if (!selected || !reason.trim() || selected === currentAnalyst) return;
    onSubmit({ analyst: selected, reason: reason.trim() });
    toast.success(`Case reassigned to ${selected}`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign / Reassign Case</DialogTitle>
          <DialogDescription>
            Currently assigned to <span className="font-semibold text-heading">{currentAnalyst}</span>. Select a new
            investigator and provide a reason.
          </DialogDescription>
        </DialogHeader>

        <RadioGroup value={selected} onValueChange={setSelected} className="max-h-64 overflow-y-auto pr-1">
          {analysts.map((a) => (
            <label
              key={a.id}
              className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 hover:bg-muted/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5"
            >
              <RadioGroupItem value={a.name} disabled={a.name === currentAnalyst} className="mt-0.5" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-heading">
                    {a.name}
                    {a.name === currentAnalyst && (
                      <span className="ml-1.5 text-xs font-normal text-muted-foreground">(current)</span>
                    )}
                  </span>
                  <Badge
                    variant="outline"
                    className={a.availability === "Available" ? "text-success border-success/30 text-xs" : "text-xs"}
                  >
                    {a.availability}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{a.team}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                  <span>{a.activeCases} active cases</span>
                  <span>·</span>
                  <span>{a.languages.join(", ")}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {a.specialization.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </label>
          ))}
        </RadioGroup>

        <div>
          <Label className="mb-1.5 block text-xs text-muted-foreground">Reason for Reassignment (required)</Label>
          <Textarea
            rows={3}
            placeholder="e.g. specialization match, workload balancing, escalation..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="resize-none text-sm"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selected || !reason.trim() || selected === currentAnalyst}>
            Confirm Assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
