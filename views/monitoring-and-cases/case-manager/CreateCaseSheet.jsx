"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconLoader2,
  IconPlus,
  IconBell,
  IconX,
} from "@tabler/icons-react";
import {
  createCase,
  getAlerts,
} from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";
import LinkAlertsDialog from "./LinkAlertsDialog";

const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const TYPE_OPTIONS = [
  { value: "SAR", label: "SAR" },
  { value: "PEP", label: "PEP" },
  { value: "transaction_monitoring", label: "Transaction Monitoring" },
  { value: "other", label: "Other" },
];

const defaultForm = {
  title: "",
  description: "",
  priority: "medium",
  type: "other",
};

export default function CreateCaseSheet({ open, onOpenChange, onCreated }) {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Linked alerts (optional)
  const [linkedAlerts, setLinkedAlerts] = useState([]);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const reset = () => {
    setForm(defaultForm);
    setErrors({});
    setLinkedAlerts([]);
  };

  const handleLinkConfirm = async (alertIds) => {
    const res = await getAlerts({ limit: 100 });
    const list = Array.isArray(res?.data) ? res.data : res?.data?.docs || [];
    const picked = list.filter((a) => alertIds.includes(a._id));
    setLinkedAlerts((prev) => {
      const existing = new Set(prev.map((a) => a._id));
      return [...prev, ...picked.filter((a) => !existing.has(a._id))];
    });
  };

  const removeLinkedAlert = (id) => {
    setLinkedAlerts((prev) => prev.filter((a) => a._id !== id));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (!form.priority) errs.priority = "Priority is required";
    if (!form.type) errs.type = "Type is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      const res = await createCase({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        type: form.type,
        ...(linkedAlerts.length > 0 && { alertIds: linkedAlerts.map((a) => a._id) }),
      });
      if (res?.succeed) {
        const newCase = res.data;
        reset();
        onOpenChange(false);
        if (onCreated) {
          onCreated(newCase);
        } else {
          router.push(
            `/dashboard/client/monitoring-and-cases/case-manager/${newCase._id}`
          );
        }
      } else {
        setErrors({ submit: res?.message || "Failed to create case" });
      }
    } catch {
      setErrors({ submit: "An unexpected error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(o) => {
          if (!o) reset();
          onOpenChange(o);
        }}
      >
        <SheetContent
          side="left"
          className="sm:max-w-md flex flex-col gap-0 p-0"
        >
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle className="text-base">New Case</SheetTitle>
            <SheetDescription className="text-xs">
              Open a new compliance case for investigation.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-medium">
                  Case Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Suspicious transaction pattern — Account #12345"
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe the case, observations, and initial findings..."
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>

              {/* Priority + Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Priority <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                    <SelectTrigger className={errors.priority ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="text-xs text-destructive">{errors.priority}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">
                    Case Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={form.type} onValueChange={(v) => set("type", v)}>
                    <SelectTrigger className={errors.type ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-xs text-destructive">{errors.type}</p>
                  )}
                </div>
              </div>

              {/* Linked alerts (optional) */}
              <div className="space-y-2 rounded-md border border-dashed p-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium flex items-center gap-1.5">
                    <IconBell className="size-3.5" />
                    Linked Alerts{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => setLinkDialogOpen(true)}
                  >
                    <IconPlus className="size-3" />
                    Pick
                  </Button>
                </div>

                {linkedAlerts.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Optionally link the alerts that triggered this case. Type and priority
                    will be auto-derived from the first alert if you skip them.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {linkedAlerts.map((a) => (
                      <Badge
                        key={a._id}
                        variant="secondary"
                        className="gap-1.5 pl-2 pr-1 py-1 text-xs"
                      >
                        <span className="font-mono">{a.uid}</span>
                        {a.riskLabel && (
                          <span className="text-muted-foreground">· {a.riskLabel}</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeLinkedAlert(a._id)}
                          className="ml-1 rounded hover:text-destructive"
                        >
                          <IconX className="size-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {errors.submit && (
                <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                  {errors.submit}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-5 py-3 flex items-center gap-2">
              <Button
                type="submit"
                size="sm"
                className="gap-1.5 flex-1"
                disabled={submitting}
              >
                {submitting ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconPlus className="size-4" />
                )}
                {submitting ? "Creating..." : "Create Case"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <LinkAlertsDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onConfirm={handleLinkConfirm}
        excludeIds={linkedAlerts.map((a) => a._id)}
        title="Link alerts to this new case"
        confirmLabel="Add"
      />
    </>
  );
}
