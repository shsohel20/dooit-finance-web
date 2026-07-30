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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RFI_DOCUMENT_TYPES } from "@/lib/case-manager-data";

export default function CreateRFIModal({ open, onOpenChange, onSubmit }) {
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const toggleDoc = (doc) => {
    setSelectedDocs((prev) => (prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]));
  };

  const reset = () => {
    setSelectedDocs([]);
    setDueDate("");
    setMessage("");
  };

  const handleSubmit = () => {
    if (selectedDocs.length === 0 || !dueDate) return;
    onSubmit({
      documents: selectedDocs,
      dueDate: new Date(dueDate).toISOString(),
      message: message.trim(),
    });
    toast.success("RFI sent to customer");
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
          <DialogTitle>Create New RFI</DialogTitle>
          <DialogDescription>
            Request supporting documents from the customer. They will be notified and given a due date to respond.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-xs text-muted-foreground">Requested Documents</Label>
            <div className="grid grid-cols-2 gap-2">
              {RFI_DOCUMENT_TYPES.map((doc) => (
                <label
                  key={doc}
                  className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-2.5 py-2 text-sm hover:bg-muted/40"
                >
                  <Checkbox checked={selectedDocs.includes(doc)} onCheckedChange={() => toggleDoc(doc)} />
                  {doc}
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">Due Date</Label>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="h-9 text-sm" />
          </div>

          <div>
            <Label className="mb-1.5 block text-xs text-muted-foreground">Message to Customer</Label>
            <Textarea
              rows={3}
              placeholder="Explain what's needed and why..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedDocs.length === 0 || !dueDate}>
            Send RFI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
