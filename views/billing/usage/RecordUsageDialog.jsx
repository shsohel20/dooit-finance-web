"use client";

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  getProducts,
  getSubscriptions,
  getUsageReferences,
  recordUsage,
} from "@/app/dashboard/client/billing/actions";

const EMPTY = {
  subscription: "",
  productCode: "",
  quantity: "1",
  applicantKey: "",
  externalId: "",
  usageDate: "",
  refType: "Customer",
};

const REF_TYPES = [
  { value: "Customer", label: "Customer" },
  { value: "Case", label: "Case" },
  { value: "", label: "Not linked" },
];

/** manual:CUS-0000123:202608011530 — deterministic, readable, and unique enough. */
const suggestExternalId = (ref) => {
  const stamp = new Date()
    .toISOString()
    .slice(0, 16)
    .replace(/[-:T]/g, "");
  return `manual:${ref?.uid || "entry"}:${stamp}`;
};

/**
 * Record a billable event by hand — the backfill path when a provider webhook
 * was lost.
 *
 * Deliberately dooit-only, and deliberately explicit about `externalId`: that
 * value is half of the idempotency key, so re-entering the same one is a safe
 * no-op rather than a double charge. That property is why the field is required
 * rather than hidden — but it is now PREFILLED from the record being billed, so
 * the operator is not inventing opaque strings under time pressure.
 *
 * The record picker replaces two free-text ObjectId boxes. `applicantKey` is
 * derived from the customer chosen rather than typed, because it is the
 * denominator of the plan allowance (§15.1) — one applicant counts once however
 * many products they consume, so a mistyped key silently mis-counts the
 * customer's limit and nothing downstream can detect it.
 */
export default function RecordUsageDialog({ open, onOpenChange, onRecorded }) {
  const [form, setForm] = useState(EMPTY);
  const [products, setProducts] = useState([]);
  const [subs, setSubs] = useState([]);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // ── Reference picker ───────────────────────────────────────────────────────
  const [refSearch, setRefSearch] = useState("");
  const [refRows, setRefRows] = useState([]);
  const [refLoading, setRefLoading] = useState(false);
  const [refPicked, setRefPicked] = useState(null);
  const [refNote, setRefNote] = useState(null);
  // Escape hatch for the case the picker cannot serve — a customer that predates
  // the account, or usage attributed to something not modelled here.
  const [manualApplicant, setManualApplicant] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(EMPTY);
    setErrors({});
    setRefSearch("");
    setRefRows([]);
    setRefPicked(null);
    setRefNote(null);
    setManualApplicant(false);
    (async () => {
      const [p, s] = await Promise.all([
        getProducts({ limit: 200, status: "active", sort: "category" }),
        getSubscriptions({ limit: 100, status: "active" }),
      ]);
      if (p.ok) setProducts(p.data || []);
      if (s.ok) setSubs(s.data || []);
    })();
  }, [open]);

  const loadRefs = useCallback(async () => {
    if (!form.subscription || !form.refType) {
      setRefRows([]);
      return;
    }
    setRefLoading(true);
    const res = await getUsageReferences({
      subscription: form.subscription,
      refType: form.refType,
      search: refSearch.trim(),
    });
    setRefLoading(false);

    if (!res.ok) {
      setRefRows([]);
      return toast.error(res.error || "Could not load records");
    }
    setRefRows(res.data || []);
    // The API explains an empty list when the subscription has no company.
    setRefNote(res.meta?.reason || null);
  }, [form.subscription, form.refType, refSearch]);

  // Debounced: the picker reloads as the operator types a uid.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(loadRefs, 250);
    return () => clearTimeout(t);
  }, [open, loadRefs]);

  // Changing the account or the record type invalidates whatever was picked.
  useEffect(() => {
    setRefPicked(null);
    setForm((f) => ({ ...f, applicantKey: "" }));
  }, [form.subscription, form.refType]);

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));
    setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const pickRef = (row) => {
    setRefPicked(row);
    setForm((f) => ({
      ...f,
      // A Customer IS the applicant. A Case is not — it groups work that may
      // span several people, so it never sets an applicant key.
      applicantKey: form.refType === "Customer" ? String(row._id) : f.applicantKey,
      externalId: f.externalId.trim() || suggestExternalId(row),
    }));
    setErrors((x) => ({ ...x, applicantKey: undefined, externalId: undefined }));
  };

  const clearRef = () => {
    setRefPicked(null);
    setForm((f) => ({ ...f, applicantKey: "" }));
  };

  const submit = async () => {
    const e = {};
    if (!form.subscription) e.subscription = "Pick a subscription";
    if (!form.productCode) e.productCode = "Pick a product";
    if (!form.externalId.trim()) e.externalId = "Required — it makes the entry idempotent";
    if (!(Number(form.quantity) > 0)) e.quantity = "Must be greater than zero";
    setErrors(e);
    if (Object.keys(e).length) return;

    setSaving(true);
    const res = await recordUsage({
      subscription: form.subscription,
      productCode: form.productCode,
      quantity: Number(form.quantity),
      applicantKey: form.applicantKey.trim() || null,
      externalId: form.externalId.trim(),
      usageDate: form.usageDate || undefined,
      source: {
        system: "manual",
        // Provenance: previously a manual record carried no link at all, so
        // there was no way back from a disputed charge to what it was for.
        refType: refPicked && form.refType ? form.refType : null,
        refId: refPicked?._id || null,
      },
    });
    setSaving(false);

    if (!res.ok) return toast.error(res.error || "Could not record usage");

    if (res.meta?.duplicate) {
      // The idempotency key already existed — not an error, and not a second charge.
      toast.info("Already recorded", {
        description: "An event with that reference exists; nothing was double-charged.",
      });
    } else {
      toast.success("Usage recorded", {
        description:
          res.data?.status === "excluded"
            ? "Recorded but excluded — the plan does not entitle this product."
            : res.data?.isLate
              ? `Dated ${res.data.periodKey}, a closed period — it will appear on the next invoice as an adjustment.`
              : undefined,
      });
    }
    onOpenChange(false);
    onRecorded?.();
  };

  const field = (key, label, node, hint) => (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-bold text-[#4a515b] dark:text-muted-foreground">
        {label}
      </Label>
      {node}
      {errors[key] ? (
        <p className="text-[11.5px] text-destructive">{errors[key]}</p>
      ) : hint ? (
        <p className="text-[11.5px] text-[#9aa0a8]">{hint}</p>
      ) : null}
    </div>
  );

  const selectCls =
    "h-9 rounded-md border border-input bg-background px-3 text-[13px] text-foreground";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Record usage manually</DialogTitle>
          <DialogDescription>
            For backfilling a missed meter event. It is priced from the subscription&apos;s
            frozen snapshot, exactly like an automatic one.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          {field(
            "subscription",
            "Subscription",
            <select value={form.subscription} onChange={set("subscription")} className={selectCls}>
              <option value="">Select…</option>
              {subs.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.uid} — {s.user?.name || s.user?.email || s.planCode}
                </option>
              ))}
            </select>
          )}

          {field(
            "productCode",
            "Product",
            <select value={form.productCode} onChange={set("productCode")} className={selectCls}>
              <option value="">Select…</option>
              {products.map((p) => (
                <option key={p._id} value={p.code}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {field(
              "quantity",
              "Quantity",
              <Input
                value={form.quantity}
                onChange={(e) =>
                  set("quantity")({ target: { value: e.target.value.replace(/[^0-9]/g, "") } })
                }
                className="tabular-nums"
              />
            )}
            {field(
              "usageDate",
              "When it happened",
              <Input type="datetime-local" value={form.usageDate} onChange={set("usageDate")} />,
              "Blank = now. A past date lands on the next invoice."
            )}
          </div>

          {/* ── What the usage was for ──────────────────────────────────── */}
          {field(
            "refType",
            "Linked to",
            <select value={form.refType} onChange={set("refType")} className={selectCls}>
              {REF_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>,
            "What this charge was for. A customer also becomes the applicant it counts against."
          )}

          {form.refType && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold text-[#4a515b] dark:text-muted-foreground">
                {form.refType === "Customer" ? "Customer" : "Case"}
              </Label>

              {refPicked ? (
                <div className="flex items-center justify-between gap-3 rounded-md border border-input px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Check className="size-4 shrink-0 text-emerald-600" />
                    <span className="truncate font-mono text-[13px] text-[#25292f] dark:text-foreground">
                      {refPicked.uid || refPicked._id}
                    </span>
                    {refPicked.title && (
                      <span className="truncate text-[12px] text-[#9aa0a8]">
                        {refPicked.title}
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 gap-1" onClick={clearRef}>
                    <X className="size-3.5" />
                    Change
                  </Button>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98a0ab]" />
                    <Input
                      value={refSearch}
                      onChange={(e) => setRefSearch(e.target.value)}
                      placeholder={
                        form.subscription
                          ? `Search by ${form.refType === "Customer" ? "customer" : "case"} ID`
                          : "Pick a subscription first"
                      }
                      disabled={!form.subscription}
                      className="h-9 pl-9 text-[13px]"
                    />
                  </div>

                  <div className="max-h-[150px] overflow-y-auto rounded-md border border-input">
                    {!form.subscription ? (
                      <p className="px-3 py-3 text-[12px] text-[#9aa0a8]">
                        Records are listed for the subscribing account.
                      </p>
                    ) : refLoading ? (
                      <p className="flex items-center gap-2 px-3 py-3 text-[12px] text-[#9aa0a8]">
                        <Loader2 className="size-3.5 animate-spin" />
                        Loading…
                      </p>
                    ) : refRows.length === 0 ? (
                      <p className="px-3 py-3 text-[12px] text-[#9aa0a8]">
                        {refNote ||
                          (refSearch
                            ? "No match."
                            : `No ${form.refType.toLowerCase()} records for this account.`)}
                      </p>
                    ) : (
                      refRows.map((r) => (
                        <button
                          key={String(r._id)}
                          type="button"
                          onClick={() => pickRef(r)}
                          className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-muted"
                        >
                          <span className="truncate font-mono text-[12.5px] text-[#25292f] dark:text-foreground">
                            {r.uid || String(r._id)}
                          </span>
                          <span className="shrink-0 text-[11.5px] capitalize text-[#9aa0a8]">
                            {r.title || r.type || ""}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Applicant ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-[#4a515b] dark:text-muted-foreground">
                Applicant
              </Label>
              <button
                type="button"
                className="text-[11.5px] font-semibold text-[#6b7280] underline-offset-2 hover:underline"
                onClick={() => setManualApplicant((v) => !v)}
              >
                {manualApplicant ? "Use the picked customer" : "Enter a key manually"}
              </button>
            </div>

            {manualApplicant ? (
              <Input
                value={form.applicantKey}
                onChange={set("applicantKey")}
                placeholder="Applicant key"
                className="font-mono text-[13px]"
              />
            ) : (
              <Input
                value={
                  form.refType === "Customer" && refPicked
                    ? refPicked.uid || String(refPicked._id)
                    : ""
                }
                readOnly
                placeholder={
                  form.refType === "Customer"
                    ? "Set by the customer above"
                    : "Only a customer sets an applicant"
                }
                className="bg-muted font-mono text-[13px]"
              />
            )}
            <p className="text-[11.5px] text-[#9aa0a8]">
              Counts once toward the plan allowance, however many products they use.
            </p>
          </div>

          {field(
            "externalId",
            "Reference",
            <Input
              value={form.externalId}
              onChange={set("externalId")}
              placeholder="e.g. the provider's event id"
              className="font-mono text-[13px]"
            />,
            "Half of the idempotency key — re-entering the same reference is a safe no-op. Prefilled when you pick a record; replace it with the provider's event id if you have one."
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving} className="gap-2 font-bold">
            {saving && <Loader2 className="size-4 animate-spin" />}
            Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
