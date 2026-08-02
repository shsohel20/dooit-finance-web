"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CircleDollarSign,
  FileText,
  Gauge,
  LayoutGrid,
  Loader2,
  Plus,
  Rocket,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  createPlan,
  getPlan,
  getPlanMeta,
  getProducts,
  publishPlan,
  updatePlan,
} from "@/app/dashboard/client/billing/actions";

import PlanCard from "../PlanCard";
import { SUPPORT_LABELS, money, int } from "../planFormat";

const ACCENTS = ["#0e766a", "#2c74d6", "#7c3aed", "#c026a3", "#d97706", "#12151a"];

const MODEL_LABELS = {
  flat: "Flat monthly fee",
  usage: "Per unit (usage)",
  tiered: "Tiered volume",
  hybrid: "Base fee + overage",
};

const EMPTY = {
  name: "",
  code: "",
  tagline: "",
  description: "",
  visibility: "public",
  accentColor: "#0e766a",
  popular: false,
  pricingModel: "hybrid",
  billingCycle: "monthly",
  currency: "AUD",
  basePrice: "1900",
  isCustomPriced: false,
  annualDiscountPercent: 15,
  includedUsage: "5000",
  includedUnit: "applicant",
  overagePrice: "0.68",
  tiers: [
    { from: "0", to: "1000", unitPrice: "0.79", discountPercent: 0 },
    { from: "1001", to: "10000", unitPrice: "0.71", discountPercent: 10 },
    { from: "10001", to: "", unitPrice: "0.64", discountPercent: 19 },
  ],
  seatsLabel: "Up to 25 seats",
  slaTarget: "99.5%",
  supportLevel: "priority",
  products: {}, // productId -> { enabled, includedQuantity, unitPrice }
};

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 60);

// Categories that are on by default in a fresh draft — mirrors the prototype,
// which starts with 12 of 22 enabled rather than everything.
const DEFAULT_ON = ["Platform", "Verification", "Screening", "Monitoring"];

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="mb-4 rounded-2xl border border-[#e9ebef] bg-white p-5 dark:border-border dark:bg-card">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-[10px] bg-primary/10">
          <Icon className="size-4 text-primary" />
        </div>
        <div>
          <div className="text-[14.5px] font-extrabold text-[#12151a] dark:text-foreground">
            {title}
          </div>
          {subtitle && <div className="text-xs text-[#8a919b]">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-bold text-[#4a515b] dark:text-muted-foreground">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="text-[11.5px] text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-[11.5px] text-[#9aa0a8]">{hint}</p>
      ) : null}
    </div>
  );
}

function Segmented({ value, options, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[#e9ebef] bg-[#f1f3f5] p-1 dark:border-border dark:bg-muted">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-lg px-3.5 py-2 text-[12.5px] font-bold transition ${
            value === o.value
              ? "bg-white text-[#12151a] shadow-sm dark:bg-card dark:text-foreground"
              : "text-[#6b7280]"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function PlanBuilder({ planId }) {
  const router = useRouter();
  const isEdit = !!planId;

  const [form, setForm] = useState(EMPTY);
  const [meta, setMeta] = useState(null);
  const [catalogue, setCatalogue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [codeTouched, setCodeTouched] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [savedId, setSavedId] = useState(planId || null);

  const set = (key) => (v) => {
    const value = v?.target ? v.target.value : v;
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "name" && !codeTouched && !isEdit) next.code = slugify(value);
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // ── Load catalogue, enums, and (when editing) the plan ────────────────────
  useEffect(() => {
    (async () => {
      const [prod, m, plan] = await Promise.all([
        // status "all", NOT "active".
        //
        // buildPayload() iterates this catalogue, so anything missing from it is
        // silently dropped on save. Loading only active products meant a plan
        // entitling a since-deactivated product lost that entitlement the moment
        // anyone saved the draft — no warning, no way to see it had happened.
        // Inactive products are shown badged instead, so the entitlement
        // survives and dooit can decide deliberately.
        getProducts({ limit: 200, status: "all", sort: "category" }),
        getPlanMeta(),
        isEdit ? getPlan(planId) : Promise.resolve(null),
      ]);

      const products = prod.ok ? prod.data || [] : [];
      setCatalogue(products);
      if (m.ok) setMeta(m.data);

      if (isEdit) {
        if (!plan?.ok) {
          toast.error(plan?.error || "Could not load plan");
          setLoading(false);
          return;
        }
        const p = plan.data;
        if (p.status !== "draft") {
          toast.error("Only a draft can be edited — create a new version instead.");
          router.replace("/dashboard/client/billing/plans");
          return;
        }
        setForm({
          ...EMPTY,
          ...p,
          basePrice: String(p.basePrice ?? ""),
          overagePrice: String(p.overagePrice ?? ""),
          includedUsage: p.includedUsage == null ? "" : String(p.includedUsage),
          seatsLabel: p.seatsLabel ?? "",
          tiers: (p.tiers || []).map((t) => ({
            from: String(t.from ?? ""),
            to: t.to == null ? "" : String(t.to),
            unitPrice: String(t.unitPrice ?? ""),
            discountPercent: t.discountPercent ?? 0,
          })),
          products: Object.fromEntries(
            (p.products || []).map((pp) => [
              String(pp.productId),
              {
                enabled: pp.enabled,
                includedQuantity: String(pp.includedQuantity ?? ""),
                unitPrice: pp.unitPrice == null ? "" : String(pp.unitPrice),
              },
            ])
          ),
        });
        setCodeTouched(true);
      } else {
        // Seed entitlements by category, like the prototype's fresh draft.
        // An inactive product is never seeded ON — the catalogue now includes
        // them so existing entitlements survive, not so new plans pick them up.
        setForm((f) => ({
          ...f,
          products: Object.fromEntries(
            products.map((p) => [
              p._id,
              {
                enabled: p.status === "active" && DEFAULT_ON.includes(p.category),
                includedQuantity: "",
                unitPrice: "",
              },
            ])
          ),
        }));
      }
      setLoading(false);
    })();
  }, [isEdit, planId, router]);

  const enabledCount = useMemo(
    () => Object.values(form.products).filter((p) => p?.enabled).length,
    [form.products]
  );

  const toggleProduct = (id) =>
    setForm((f) => ({
      ...f,
      products: {
        ...f.products,
        [id]: { ...(f.products[id] || {}), enabled: !f.products[id]?.enabled },
      },
    }));

  const setAllProducts = (enabled) =>
    setForm((f) => ({
      ...f,
      products: Object.fromEntries(
        catalogue.map((p) => [
          p._id,
          {
            ...(f.products[p._id] || {}),
            // "Enable all" must not switch on products dooit has deactivated —
            // they are in the list only so existing entitlements survive.
            // Clearing all, however, applies to everything.
            enabled: enabled ? p.status === "active" : false,
          },
        ])
      ),
    }));

  const setTier = (i, key, value) =>
    setForm((f) => ({
      ...f,
      tiers: f.tiers.map((t, j) => (j === i ? { ...t, [key]: value } : t)),
    }));

  const addTier = () =>
    setForm((f) => ({
      ...f,
      tiers: [...f.tiers, { from: "", to: "", unitPrice: "", discountPercent: 0 }],
    }));

  const removeTier = (i) =>
    setForm((f) => ({ ...f, tiers: f.tiers.filter((_, j) => j !== i) }));

  // ── Preview: the exact shape PlanCard renders on the catalogue page ───────
  const preview = useMemo(
    () => ({
      _id: "preview",
      name: form.name || "Untitled plan",
      code: form.code || "plan_code",
      version: 1,
      status: "draft",
      tagline: form.tagline,
      visibility: form.visibility,
      accentColor: form.accentColor,
      popular: form.popular,
      pricingModel: form.pricingModel,
      billingCycle: form.billingCycle,
      basePrice: Number(form.basePrice) || 0,
      isCustomPriced: form.isCustomPriced,
      includedUsage: Number(form.includedUsage) || null,
      includedUnit: form.includedUnit,
      overagePrice: Number(form.overagePrice) || 0,
      annualDiscountPercent: Number(form.annualDiscountPercent) || 0,
      slaTarget: form.slaTarget,
      supportLevel: form.supportLevel,
      selfServe: !form.isCustomPriced,
      products: catalogue
        .filter((p) => form.products[p._id]?.enabled)
        .map((p) => ({ code: p.code, name: p.name, enabled: true })),
    }),
    [form, catalogue]
  );

  const buildPayload = () => ({
    name: form.name.trim(),
    ...(isEdit ? {} : { code: form.code.trim() }),
    tagline: form.tagline?.trim() || null,
    description: form.description?.trim() || null,
    visibility: form.visibility,
    accentColor: form.accentColor,
    popular: form.popular,
    pricingModel: form.pricingModel,
    billingCycle: form.billingCycle,
    currency: form.currency,
    basePrice: Number(form.basePrice) || 0,
    isCustomPriced: form.isCustomPriced,
    annualDiscountPercent: Number(form.annualDiscountPercent) || 0,
    includedUsage: form.includedUsage === "" ? null : Number(form.includedUsage),
    includedUnit: form.includedUnit,
    overagePrice: Number(form.overagePrice) || 0,
    seatsLabel: form.seatsLabel?.trim() || null,
    slaTarget: form.slaTarget,
    supportLevel: form.supportLevel,
    // Empty rows are dropped rather than sent as zeros — the API validates the
    // ladder for contiguity and a stray blank band would fail it.
    tiers: form.tiers
      .filter((t) => t.from !== "" || t.unitPrice !== "")
      .map((t) => ({
        from: t.from,
        to: t.to,
        unitPrice: t.unitPrice,
        discountPercent: t.discountPercent,
      })),
    products: catalogue
      .filter((p) => form.products[p._id]?.enabled)
      .map((p) => ({
        productId: p._id,
        enabled: true,
        includedQuantity: form.products[p._id]?.includedQuantity || 0,
        unitPrice: form.products[p._id]?.unitPrice || null,
      })),
  });

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Plan name is required";
    if (!isEdit && !/^[a-z0-9_]{2,60}$/.test(form.code))
      e.code = "2–60 chars: lowercase letters, digits, underscore";
    if (!form.isCustomPriced && ["flat", "hybrid"].includes(form.pricingModel)) {
      if (!(Number(form.basePrice) > 0))
        e.basePrice = "A flat or hybrid plan needs a base price above zero";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = useCallback(
    async ({ thenPublish = false } = {}) => {
      if (!validate()) {
        toast.error("Fix the highlighted fields first");
        return null;
      }
      setSaving(true);
      const payload = buildPayload();
      const res = savedId ? await updatePlan(savedId, payload) : await createPlan(payload);

      if (!res.ok) {
        setSaving(false);
        if (res.status === 409) setErrors({ code: res.error });
        toast.error(res.error || "Could not save the plan");
        return null;
      }

      const id = res.data._id;
      setSavedId(id);

      if (!thenPublish) {
        setSaving(false);
        toast.success(savedId ? "Draft updated" : "Draft saved");
        return id;
      }

      const pub = await publishPlan(id);
      setSaving(false);
      if (!pub.ok) {
        // The draft is saved either way — publishing is the step that failed.
        toast.error(pub.error || "Could not publish", {
          description: "Your draft has been saved.",
        });
        return id;
      }
      toast.success(`${payload.name} published`, {
        description: pub.meta?.archivedPreviousVersions
          ? `${pub.meta.archivedPreviousVersions} previous version(s) archived.`
          : undefined,
      });
      router.push("/dashboard/client/billing/plans");
      return id;
    },
    [form, savedId, catalogue] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (loading) {
    return (
      <div className="grid gap-5 px-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-6">
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-56 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-[420px] rounded-2xl" />
      </div>
    );
  }

  const byCategory = catalogue.reduce((acc, p) => {
    (acc[p.category] ||= []).push(p);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[19px] font-extrabold tracking-[-0.4px] text-[#12151a] dark:text-foreground">
            {isEdit ? "Edit plan draft" : "Create a plan"}
          </h1>
          <p className="mt-[3px] text-[13px] text-[#8a919b]">
            Pricing model, included volume, entitlements and limits.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2 rounded-[10px] font-bold"
            disabled={saving}
            onClick={() => setConfirm("reset")}
          >
            <RotateCcw className="size-4" />
            Reset
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-[10px] font-bold"
            disabled={saving}
            onClick={() => save()}
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save draft
          </Button>
          <Button
            className="gap-2 rounded-[10px] font-bold"
            disabled={saving}
            onClick={() => setConfirm("publish")}
          >
            <Rocket className="size-4" />
            Publish plan
          </Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <div>
          <Section
            icon={FileText}
            title="Plan identity"
            subtitle="Naming and how it appears in the catalogue"
          >
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr]">
                <Field label="Plan name" error={errors.name}>
                  <Input value={form.name} onChange={set("name")} placeholder="e.g. Growth" />
                </Field>
                <Field
                  label="Internal code"
                  error={errors.code}
                  hint={isEdit ? "Immutable once created" : "Auto-filled from the name"}
                >
                  <Input
                    value={form.code}
                    disabled={isEdit}
                    onChange={(e) => {
                      setCodeTouched(true);
                      set("code")(e);
                    }}
                    placeholder="e.g. plan_growth"
                    className="font-mono text-[13px]"
                  />
                </Field>
              </div>

              <Field label="Tagline">
                <Input
                  value={form.tagline || ""}
                  onChange={set("tagline")}
                  placeholder="One line describing who this plan is for."
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Visibility" hint="Private plans need an access list before publishing">
                  <Segmented
                    value={form.visibility}
                    onChange={set("visibility")}
                    options={(meta?.visibilities || ["public", "private"]).map((v) => ({
                      value: v,
                      label: v[0].toUpperCase() + v.slice(1),
                    }))}
                  />
                </Field>
                <Field label="Accent colour">
                  <div className="flex gap-2 pt-1">
                    {ACCENTS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => set("accentColor")(c)}
                        aria-label={`Accent ${c}`}
                        className="size-7 rounded-[9px] transition"
                        style={{
                          background: c,
                          boxShadow:
                            form.accentColor === c
                              ? `0 0 0 2px #fff, 0 0 0 4px ${c}`
                              : "inset 0 0 0 1px rgba(0,0,0,.08)",
                        }}
                      />
                    ))}
                  </div>
                </Field>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#eef0f3] bg-[#fafbfc] p-3 dark:border-border dark:bg-muted/40">
                <Switch
                  id="plan-popular"
                  checked={form.popular}
                  onCheckedChange={set("popular")}
                />
                <Label htmlFor="plan-popular" className="cursor-pointer">
                  <span className="block text-[13px] font-bold text-[#25292f] dark:text-foreground">
                    Highlight as “Most popular”
                  </span>
                  <span className="block text-[11.5px] font-normal text-[#8a919b]">
                    Adds a badge and emphasis on the pricing page
                  </span>
                </Label>
              </div>
            </div>
          </Section>

          <Section
            icon={CircleDollarSign}
            title="Pricing model"
            subtitle="How the plan is charged"
          >
            <div className="flex flex-col gap-4">
              <Segmented
                value={form.pricingModel}
                onChange={set("pricingModel")}
                options={(meta?.pricingModels || Object.keys(MODEL_LABELS)).map((m) => ({
                  value: m,
                  label: MODEL_LABELS[m] || m,
                }))}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <Field
                  label="Base fee"
                  error={errors.basePrice}
                  hint={form.isCustomPriced ? "Not used — plan is custom priced" : undefined}
                >
                  <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                    <span className="text-[13px] font-semibold text-[#98a0ab]">A$</span>
                    <input
                      value={form.basePrice}
                      disabled={form.isCustomPriced}
                      onChange={(e) =>
                        set("basePrice")(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      className="h-9 w-full bg-transparent text-[13px] tabular-nums outline-none disabled:opacity-50"
                      placeholder="0.00"
                      inputMode="decimal"
                    />
                  </div>
                </Field>
                <Field label="Billing cycle">
                  <select
                    value={form.billingCycle}
                    onChange={set("billingCycle")}
                    className="h-9 rounded-md border border-input bg-background px-3 text-[13px]"
                  >
                    {(meta?.billingCycles || ["monthly", "yearly"]).map((c) => (
                      <option key={c} value={c}>
                        {c[0].toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Annual discount %">
                  <Input
                    value={form.annualDiscountPercent}
                    onChange={(e) =>
                      set("annualDiscountPercent")(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="tabular-nums"
                  />
                </Field>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#eef0f3] bg-[#fafbfc] p-3 dark:border-border dark:bg-muted/40">
                <Switch
                  id="plan-custom"
                  checked={form.isCustomPriced}
                  onCheckedChange={set("isCustomPriced")}
                />
                <Label htmlFor="plan-custom" className="cursor-pointer">
                  <span className="block text-[13px] font-bold text-[#25292f] dark:text-foreground">
                    Custom priced (quote only)
                  </span>
                  <span className="block text-[11.5px] font-normal text-[#8a919b]">
                    Shows “Custom” instead of a price. Cannot be self-purchased.
                  </span>
                </Label>
              </div>
            </div>
          </Section>

          <Section
            icon={Gauge}
            title="Included volume &amp; overage"
            subtitle="Monthly allowance and price beyond it"
          >
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Included / mo" hint="Blank for unlimited">
                  <Input
                    value={form.includedUsage}
                    onChange={(e) => set("includedUsage")(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="e.g. 5000"
                    className="tabular-nums"
                  />
                </Field>
                <Field label="Unit">
                  <Input
                    value={form.includedUnit}
                    onChange={set("includedUnit")}
                    placeholder="applicant"
                  />
                </Field>
                <Field label="Overage price" hint="Charged per unit above the allowance">
                  <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3">
                    <span className="text-[13px] font-semibold text-[#98a0ab]">A$</span>
                    <input
                      value={form.overagePrice}
                      onChange={(e) =>
                        set("overagePrice")(e.target.value.replace(/[^0-9.]/g, ""))
                      }
                      className="h-9 w-full bg-transparent text-[13px] tabular-nums outline-none"
                      placeholder="0.0000"
                      inputMode="decimal"
                    />
                  </div>
                </Field>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4a515b] dark:text-muted-foreground">
                    Volume discount tiers
                  </span>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={addTier}>
                    <Plus className="size-3.5" />
                    Add tier
                  </Button>
                </div>
                <div className="overflow-hidden rounded-xl border border-[#eef0f3] dark:border-border">
                  <div className="grid grid-cols-[1fr_1fr_1fr_90px_40px] gap-2 bg-[#fafbfc] px-3 py-2 text-[10.5px] font-bold uppercase tracking-[0.3px] text-[#98a0ab] dark:bg-muted/40">
                    <span>From</span>
                    <span>To</span>
                    <span>Unit price</span>
                    <span>Disc %</span>
                    <span />
                  </div>
                  {form.tiers.length === 0 ? (
                    <p className="p-4 text-center text-[12.5px] text-[#9aa0a8]">
                      No tiers — the flat overage price applies.
                    </p>
                  ) : (
                    form.tiers.map((t, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[1fr_1fr_1fr_90px_40px] items-center gap-2 border-t border-[#f4f5f7] px-3 py-2 dark:border-border"
                      >
                        <Input
                          value={t.from}
                          onChange={(e) => setTier(i, "from", e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="0"
                          className="h-8 text-[12.5px] tabular-nums"
                        />
                        <Input
                          value={t.to}
                          onChange={(e) => setTier(i, "to", e.target.value.replace(/[^0-9]/g, ""))}
                          placeholder="∞"
                          className="h-8 text-[12.5px] tabular-nums"
                        />
                        <Input
                          value={t.unitPrice}
                          onChange={(e) =>
                            setTier(i, "unitPrice", e.target.value.replace(/[^0-9.]/g, ""))
                          }
                          placeholder="0.00"
                          className="h-8 text-[12.5px] tabular-nums"
                        />
                        <Input
                          value={t.discountPercent}
                          onChange={(e) =>
                            setTier(i, "discountPercent", e.target.value.replace(/[^0-9]/g, ""))
                          }
                          className="h-8 text-[12.5px] tabular-nums"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          onClick={() => removeTier(i)}
                        >
                          <Trash2 className="size-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                <p className="mt-1.5 text-[11.5px] text-[#9aa0a8]">
                  Bands must be contiguous — leave the last “To” blank for “and above”.
                </p>
              </div>
            </div>
          </Section>

          <Section
            icon={LayoutGrid}
            title="Product entitlements"
            subtitle={`Which metered products this plan includes — ${enabledCount} of ${catalogue.length} enabled`}
          >
            <div className="mb-3 flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setAllProducts(true)}>
                Enable all
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAllProducts(false)}>
                Clear all
              </Button>
            </div>
            <div className="max-h-[340px] overflow-y-auto rounded-xl border border-[#eef0f3] dark:border-border">
              {catalogue.length === 0 ? (
                <p className="p-6 text-center text-[12.5px] text-[#9aa0a8]">
                  No active products. Add products to the catalogue first.
                </p>
              ) : (
                Object.entries(byCategory).map(([cat, items]) => (
                  <div key={cat}>
                    <div className="bg-[#fafbfc] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.3px] text-[#8a919b] dark:bg-muted/40">
                      {cat}
                    </div>
                    {items.map((p) => {
                      const on = !!form.products[p._id]?.enabled;
                      return (
                        <div
                          key={p._id}
                          className="grid grid-cols-[minmax(0,1fr)_100px_52px] items-center gap-3 border-t border-[#f4f5f7] px-3 py-2 dark:border-border"
                        >
                          <div className="min-w-0">
                            <div
                              className={`flex items-center gap-1.5 truncate text-[13px] font-semibold ${
                                on ? "text-[#25292f] dark:text-foreground" : "text-[#9aa0a8]"
                              }`}
                            >
                              <span className="truncate">{p.name}</span>
                              {p.status !== "active" && (
                                <span className="shrink-0 rounded bg-amber-500/15 px-1.5 py-[1px] text-[9.5px] font-bold uppercase text-amber-700 dark:text-amber-400">
                                  inactive
                                </span>
                              )}
                            </div>
                            <div className="truncate font-mono text-[10.5px] text-[#9aa0a8]">
                              {p.code}
                            </div>
                          </div>
                          <span className="text-[12.5px] tabular-nums text-[#6b7280]">
                            {money(p.defaultUnitPrice)}
                          </span>
                          <div className="flex justify-end">
                            <Switch checked={on} onCheckedChange={() => toggleProduct(p._id)} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </Section>

          <Section
            icon={ShieldCheck}
            title="Limits &amp; support"
            subtitle="Service guarantees for subscribers"
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Seats">
                <Input
                  value={form.seatsLabel || ""}
                  onChange={set("seatsLabel")}
                  placeholder="e.g. Up to 25 seats"
                />
              </Field>
              <Field label="SLA">
                <select
                  value={form.slaTarget}
                  onChange={set("slaTarget")}
                  className="h-9 rounded-md border border-input bg-background px-3 text-[13px]"
                >
                  {(meta?.slaTargets || ["none", "99.5%", "99.9%"]).map((s) => (
                    <option key={s} value={s}>
                      {s === "none" ? "—" : s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Support level">
                <select
                  value={form.supportLevel}
                  onChange={set("supportLevel")}
                  className="h-9 rounded-md border border-input bg-background px-3 text-[13px]"
                >
                  {(meta?.supportLevels || Object.keys(SUPPORT_LABELS)).map((s) => (
                    <option key={s} value={s}>
                      {SUPPORT_LABELS[s] || s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Section>
        </div>

        {/* ── Live preview ─────────────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-4">
          <div className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.4px] text-[#98a0ab]">
            Live preview
          </div>
          <PlanCard plan={preview} isDooit={false} onAction={() => {}} />

          <div className="mt-4 rounded-2xl border border-[#e9ebef] bg-white p-4 dark:border-border dark:bg-card">
            <div className="mb-3 text-[13px] font-extrabold text-[#12151a] dark:text-foreground">
              Summary
            </div>
            {[
              ["Pricing model", MODEL_LABELS[form.pricingModel]],
              ["Billing cycle", form.billingCycle],
              [
                "Included / mo",
                form.includedUsage ? int(form.includedUsage) : "Unlimited",
              ],
              ["Overage", `${money(form.overagePrice)} / ${form.includedUnit}`],
              ["Products enabled", `${enabledCount} of ${catalogue.length}`],
              ["Discount tiers", String(form.tiers.length)],
              ["SLA", form.slaTarget === "none" ? "—" : form.slaTarget],
              ["Support", SUPPORT_LABELS[form.supportLevel]],
            ].map(([k, v], i) => (
              <div
                key={k}
                className={`flex justify-between py-2 text-[12.5px] ${
                  i ? "border-t border-[#f4f5f7] dark:border-border" : ""
                }`}
              >
                <span className="text-[#8a919b]">{k}</span>
                <span className="font-bold capitalize text-[#25292f] dark:text-foreground">
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirm === "publish"
                ? `Publish “${form.name || "Untitled plan"}”?`
                : "Discard changes?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "publish"
                ? "The draft is saved, validated, then published. A published plan is frozen — later changes need a new version, and any previous published version of this code is archived."
                : "The form returns to its defaults. Anything unsaved is lost."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const a = confirm;
                setConfirm(null);
                if (a === "publish") save({ thenPublish: true });
                else {
                  setForm(EMPTY);
                  setErrors({});
                  toast.success("Draft reset");
                }
              }}
            >
              {confirm === "publish" ? "Publish" : "Reset"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
