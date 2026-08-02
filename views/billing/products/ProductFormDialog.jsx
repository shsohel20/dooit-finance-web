"use client";

import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  createProduct,
  getProductMeta,
  updateProduct,
} from "@/app/dashboard/client/billing/actions";

const EMPTY = {
  name: "",
  code: "",
  description: "",
  category: "Verification",
  unit: "check",
  defaultUnitPrice: "",
  billable: true,
  status: "active",
};

/** Suggest a machine code from the display name — only while creating. */
const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);

export default function ProductFormDialog({ open, onOpenChange, product, onSaved }) {
  const isEdit = !!product?._id;

  const [form, setForm] = useState(EMPTY);
  const [meta, setMeta] = useState({ categories: [], units: [] });
  const [codeTouched, setCodeTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    getProductMeta().then((res) => {
      if (res.ok) setMeta(res.data || { categories: [], units: [] });
    });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setCodeTouched(isEdit);
    setForm(
      isEdit
        ? {
            name: product.name ?? "",
            code: product.code ?? "",
            description: product.description ?? "",
            category: product.category ?? "Verification",
            unit: product.unit ?? "check",
            defaultUnitPrice: String(product.defaultUnitPrice ?? ""),
            billable: product.billable !== false,
            status: product.status ?? "active",
          }
        : EMPTY
    );
  }, [open, isEdit, product]);

  const set = (key) => (e) => {
    const value = e?.target ? e.target.value : e;
    setForm((f) => {
      const next = { ...f, [key]: value };
      // Auto-derive the code from the name until the user edits it themselves
      if (key === "name" && !codeTouched && !isEdit) next.code = slugify(value);
      return next;
    });
    setErrors((e2) => ({ ...e2, [key]: undefined }));
  };

  const codeHint = useMemo(() => {
    if (isEdit) return "Code is immutable — create a new product to change it.";
    return "Lowercase letters, digits and underscores. Used by meter producers.";
  }, [isEdit]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!isEdit) {
      if (!form.code.trim()) e.code = "Code is required";
      else if (!/^[a-z0-9_]{2,60}$/.test(form.code))
        e.code = "2–60 chars: lowercase letters, digits, underscore";
    }
    if (form.defaultUnitPrice === "" || form.defaultUnitPrice == null)
      e.defaultUnitPrice = "Unit price is required";
    else if (Number.isNaN(Number(form.defaultUnitPrice)))
      e.defaultUnitPrice = "Must be a number";
    else if (Number(form.defaultUnitPrice) < 0)
      e.defaultUnitPrice = "Cannot be negative";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    // `code` is never sent on update — the API rejects a change with 400, and
    // sending the unchanged value would be pointless noise.
    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      category: form.category,
      unit: form.unit,
      defaultUnitPrice: Number(form.defaultUnitPrice),
      billable: form.billable,
      status: form.status,
      ...(isEdit ? {} : { code: form.code.trim() }),
    };

    const res = isEdit
      ? await updateProduct(product._id, payload)
      : await createProduct(payload);
    setSaving(false);

    if (!res.ok) {
      // 409 duplicate code is the common one — surface it on the field.
      if (res.status === 409) setErrors({ code: res.error });
      toast.error(res.error || "Could not save product");
      return;
    }

    toast.success(isEdit ? `${payload.name} updated` : `${payload.name} created`);
    onOpenChange(false);
    onSaved?.();
  };

  const field = (key, label, node, hint) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-bold text-[#4a515b]">{label}</Label>
      {node}
      {errors[key] ? (
        <p className="text-[11.5px] text-destructive">{errors[key]}</p>
      ) : hint ? (
        <p className="text-[11.5px] text-[#9aa0a8]">{hint}</p>
      ) : null}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="tracking-[-0.3px]">
            {isEdit ? "Edit product" : "Add product"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Pricing changes apply to new plans only — published plans are frozen and keep their own snapshot."
              : "Define a metered product that plans can include."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="grid gap-4 sm:grid-cols-2">
            {field(
              "name",
              "Product name",
              <Input
                value={form.name}
                onChange={set("name")}
                placeholder="e.g. Identity Document Verification"
              />
            )}
            {field(
              "code",
              "Code",
              <Input
                value={form.code}
                disabled={isEdit}
                onChange={(e) => {
                  setCodeTouched(true);
                  set("code")(e);
                }}
                placeholder="e.g. id_doc_verification"
                className="font-mono text-[13px]"
              />,
              codeHint
            )}
          </div>

          {field(
            "description",
            "Description",
            <Textarea
              rows={2}
              value={form.description}
              onChange={set("description")}
              placeholder="One line describing what this product does."
              className="resize-y"
            />
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            {field(
              "category",
              "Category",
              <select
                value={form.category}
                onChange={set("category")}
                className="h-9 rounded-md border border-input bg-background px-3 text-[13px]"
              >
                {meta.categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
            {field(
              "unit",
              "Unit",
              <select
                value={form.unit}
                onChange={set("unit")}
                className="h-9 rounded-md border border-input bg-background px-3 text-[13px]"
              >
                {meta.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            )}
            {field(
              "defaultUnitPrice",
              "Unit price (AUD)",
              <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                <span className="text-[13px] font-semibold text-[#98a0ab]">A$</span>
                <input
                  value={form.defaultUnitPrice}
                  onChange={(e) =>
                    set("defaultUnitPrice")({
                      target: { value: e.target.value.replace(/[^0-9.]/g, "") },
                    })
                  }
                  placeholder="0.0000"
                  inputMode="decimal"
                  className="h-9 w-full bg-transparent text-[13px] tabular-nums outline-none"
                />
              </div>,
              "Up to 4 decimal places"
            )}
          </div>

          {/* Not a <label> wrapper: Radix Switch renders a <button>, which is a
              labelable element, so nesting makes the click fire twice and cancel
              itself out. Use id + htmlFor. */}
          <div className="flex items-center gap-3 rounded-xl border border-[#eef0f3] bg-[#fafbfc] p-3 dark:border-border dark:bg-muted/40">
            <Switch
              id="product-billable"
              checked={form.billable}
              onCheckedChange={(v) => setForm((f) => ({ ...f, billable: v }))}
            />
            <Label htmlFor="product-billable" className="cursor-pointer">
              <span className="block text-[13px] font-bold text-[#25292f] dark:text-foreground">
                Billable
              </span>
              <span className="block text-[11.5px] font-normal text-[#8a919b]">
                Off means the product is metered and shown, but charged at zero
              </span>
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={onSubmit} disabled={saving} className="gap-2 font-bold">
            {saving && <Loader2 className="size-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
