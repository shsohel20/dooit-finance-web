"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconArrowLeft, IconLoader2, IconDeviceFloppy } from "@tabler/icons-react";
import {
  getCaseById,
  updateCase,
} from "@/app/dashboard/client/monitoring-and-cases/case-manager/actions";

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

export default function EditCasePage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "", type: "" });
  const [errors, setErrors] = useState({});
  const [caseId, setCaseId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      setCaseId(id);
      setLoading(true);
      try {
        const res = await getCaseById(id);
        if (res?.succeed) {
          const c = res.data;
          setForm({
            title: c.title || "",
            description: c.description || "",
            priority: c.priority || "medium",
            type: c.type || "other",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
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
      const res = await updateCase(caseId, {
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        type: form.type,
      });
      if (res?.succeed) {
        router.push(
          `/dashboard/client/monitoring-and-cases/case-manager/${caseId}`,
        );
      } else {
        setErrors({ submit: res?.message || "Failed to update case" });
      }
    } catch {
      setErrors({ submit: "An unexpected error occurred" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-xs px-2"
          onClick={() =>
            router.push(
              caseId
                ? `/dashboard/client/monitoring-and-cases/case-manager/${caseId}`
                : "/dashboard/client/monitoring-and-cases/case-manager",
            )
          }
        >
          <IconArrowLeft className="size-3.5" />
          Back
        </Button>
      </div>

      <div className="mb-5">
        <h1 className="text-xl font-bold text-heading">Edit Case</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Update case details</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Case Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-medium">
                  Case Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-xs text-destructive">{errors.title}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={4}
                  className="resize-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Case Type</Label>
                  <Select value={form.type} onValueChange={(v) => set("type", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-destructive rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                  {errors.submit}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Button type="submit" className="gap-1.5" disabled={submitting}>
                  {submitting ? (
                    <IconLoader2 className="size-4 animate-spin" />
                  ) : (
                    <IconDeviceFloppy className="size-4" />
                  )}
                  {submitting ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      caseId
                        ? `/dashboard/client/monitoring-and-cases/case-manager/${caseId}`
                        : "/dashboard/client/monitoring-and-cases/case-manager",
                    )
                  }
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
