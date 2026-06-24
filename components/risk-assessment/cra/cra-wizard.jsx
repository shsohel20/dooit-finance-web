"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Check,
  Search,
  AlertTriangle,
  User,
  ShieldCheck,
  FileText,
  ChartBar,
  X,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  getRiskFactors,
  getCustomers,
  calculateRiskScore,
  saveResult,
} from "@/app/dashboard/client/risk-assessment/actions";
import {
  CUSTOMER_TYPES,
  RISK_BADGE_VARIANT,
  RISK_BAR,
  JURISDICTION_BAND_TEXT,
  SCORE_AXIS_MAX,
  SCORE_TICKS,
  humanFactor,
} from "./constants";

const PHASES = [
  { id: 1, label: "Customer Identity", icon: User },
  { id: 2, label: "Risk Factors", icon: ShieldCheck },
  { id: 3, label: "Enhanced Due Diligence", icon: FileText },
  { id: 4, label: "Review & Score", icon: ChartBar },
];

/* Selectable tile (single or multi) */
function OptionTile({ label, desc, selected, onClick, multi }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border text-left w-full transition-colors",
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40 bg-card"
      )}
    >
      <span
        className={cn(
          "w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center border",
          multi ? "rounded" : "rounded-full",
          selected ? "bg-primary border-primary" : "border-muted-foreground/40"
        )}
      >
        {selected && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold text-foreground capitalize">
          {label}
        </span>
        {desc && (
          <span className="block text-[10px] text-muted-foreground mt-0.5">
            {desc}
          </span>
        )}
      </span>
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2 mt-4 first:mt-0">
      {children}
    </p>
  );
}

/* Score bar — CRA V2 bands 0–17 / 18–20 / 21–99 / 100+ */
function ScoreBar({ score, label }) {
  const pct = Math.min((score / SCORE_AXIS_MAX) * 100, 100);
  return (
    <div>
      <div className="relative h-3.5 text-[10px] text-muted-foreground mb-1 select-none">
        {[[0, "0"], [17, "17"], [20, "20"], [99, "99"]].map(([tick, lbl]) => (
          <span
            key={tick}
            className="absolute -translate-x-1/2"
            style={{ left: `${(tick / SCORE_AXIS_MAX) * 100}%` }}
          >
            {lbl}
          </span>
        ))}
        <span className="absolute right-0">100+</span>
      </div>
      <div className="relative h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", RISK_BAR[label])}
          style={{ width: `${pct}%` }}
        />
        {SCORE_TICKS.map((t) => (
          <div
            key={t}
            className="absolute top-0 bottom-0 w-px bg-border"
            style={{ left: `${(t / SCORE_AXIS_MAX) * 100}%` }}
          />
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1 text-right">
        Low ≤17 · Medium 18–20 · High 21–99 · Unacceptable 100+
      </p>
    </div>
  );
}

export function CraWizard({ onSaved, onCancel }) {
  const [phase, setPhase] = useState(1);
  const [factors, setFactors] = useState(null);
  const [loadingFactors, setLoadingFactors] = useState(true);
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [customerSearch, setCustomerSearch] = useState("");
  const [customerResults, setCustomerResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [linkedCustomer, setLinkedCustomer] = useState(null);
  const searchSeq = useRef(0);

  const [form, setForm] = useState({
    customerId: "",
    name: "",
    type: "individual",
    country: "",
    entityType: "",
    products: [],
    channel: "",
    occupation: "",
    industry: "",
    retention: "",
    pepStatus: "Not a PEP",
    sourceOfFunds: "",
    sourceOfWealth: "",
    adverseMedia: "",
    sourceOfFundsNotes: "",
    beneficialOwnershipNotes: "",
    notes: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const isIndividual = form.type === "individual";

  /* Load risk factors; preselect derived entity type */
  useEffect(() => {
    getRiskFactors()
      .then((r) => {
        if (!r?.success) throw new Error();
        setFactors(r.data);
        if (r.data?.derivedEntityTypes?.length) {
          setForm((p) =>
            p.entityType ? p : { ...p, entityType: r.data.derivedEntityTypes[0] }
          );
        }
      })
      .catch(() => toast.error("Could not load risk factor options"))
      .finally(() => setLoadingFactors(false));
  }, []);

  /* Customer search (debounced, latest-wins race guard) */
  const runSearch = useCallback(async (q) => {
    if (!q.trim()) {
      setCustomerResults([]);
      setSearched(false);
      return;
    }
    const seq = ++searchSeq.current;
    setSearching(true);
    try {
      const r = await getCustomers(q);
      if (seq !== searchSeq.current) return; // a newer query superseded this one
      setCustomerResults(r?.data || []);
      setSearched(true);
    } catch {
      if (seq === searchSeq.current) setCustomerResults([]);
    } finally {
      if (seq === searchSeq.current) setSearching(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => runSearch(customerSearch), 350);
    return () => clearTimeout(t);
  }, [customerSearch, runSearch]);

  const linkCustomer = (c) => {
    setLinkedCustomer(c);
    setCustomerResults([]);
    setSearched(false);
    searchSeq.current++; // ignore any in-flight search response
    setCustomerSearch("");
    setForm((p) => ({
      ...p,
      customerId: c.id,
      name: c.name,
      type: c.type || "individual",
      country: c.country || p.country,
    }));
  };

  const unlinkCustomer = () => {
    setLinkedCustomer(null);
    setForm((p) => ({ ...p, customerId: "", name: "", type: "individual", country: "" }));
  };

  const toggleProduct = (v) =>
    setForm((p) => ({
      ...p,
      products: p.products.includes(v)
        ? p.products.filter((x) => x !== v)
        : [...p.products, v],
    }));

  const jurisdictions = factors?.countries || [];
  const selectedJurisdiction = jurisdictions.find((j) => j.country === form.country);
  const entityOptions = factors?.derivedEntityTypes?.length
    ? factors.derivedEntityTypes
    : factors?.entityTypes || [];

  const buildPayload = () => ({
    customerId: form.customerId || undefined,
    name: form.name,
    type: form.type,
    country: form.country,
    retention: form.retention,
    entityType: form.entityType,
    pepStatus: form.pepStatus,
    sourceOfFunds: form.sourceOfFunds,
    sourceOfWealth: form.sourceOfWealth,
    adverseMedia: form.adverseMedia,
    metadata: {
      product: form.products[0] || "",
      products: form.products,
      channel: form.channel,
      occupation: form.occupation,
      industry: form.industry,
      entityType: form.entityType,
    },
  });

  const fetchPreview = async () => {
    setPreviewLoading(true);
    setPreview(null);
    try {
      const r = await calculateRiskScore(buildPayload());
      if (r?.success) setPreview(r.data);
      else toast.error("Score preview failed");
    } catch {
      toast.error("Score preview failed");
    } finally {
      setPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (phase === 4) fetchPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const r = await saveResult({
        ...buildPayload(),
        sourceOfFundsNotes: form.sourceOfFundsNotes || undefined,
        beneficialOwnershipNotes: form.beneficialOwnershipNotes || undefined,
        notes: form.notes || undefined,
      });
      if (r?.success) {
        toast.success("CRA assessment saved");
        onSaved?.(r.data);
      } else {
        toast.error(r?.message || "Failed to save assessment");
      }
    } catch {
      toast.error("Failed to save assessment");
    } finally {
      setSaving(false);
    }
  };

  const canAdvance = () => {
    if (phase === 1) return !!form.name.trim() && !!form.type && !!form.country;
    if (phase === 2) return !!form.channel && !!form.retention && !!form.entityType;
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Phase stepper */}
      <div className="flex items-center gap-0">
        {PHASES.map((p, i) => {
          const Icon = p.icon;
          const done = phase > p.id;
          const active = phase === p.id;
          return (
            <div key={p.id} className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => done && setPhase(p.id)}
                className={cn(
                  "flex items-center gap-2 flex-1 p-3 rounded-xl border transition-all text-left",
                  active && "border-primary bg-primary/5 shadow-sm",
                  done && "border-success/40 bg-green-50 hover:border-success",
                  !active && !done && "border-border bg-card opacity-50 cursor-default"
                )}
              >
                <span
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0",
                    done ? "bg-success" : active ? "bg-primary" : "bg-muted"
                  )}
                >
                  {done ? (
                    <Check className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Icon className="w-3.5 h-3.5 text-white" />
                  )}
                </span>
                <span className="hidden sm:block">
                  <span
                    className={cn(
                      "block text-[9px] font-medium",
                      active ? "text-primary" : done ? "text-success" : "text-muted-foreground"
                    )}
                  >
                    Phase {p.id}
                  </span>
                  <span className="block text-[10px] font-semibold text-foreground leading-tight">
                    {p.label}
                  </span>
                </span>
              </button>
              {i < PHASES.length - 1 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mx-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* ── PHASE 1 — Customer Identity ── */}
      {phase === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Identity</CardTitle>
            <CardDescription>
              Link an existing customer or enter details for a standalone assessment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <SectionTitle>Link Customer (optional)</SectionTitle>
              {linkedCustomer ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-foreground">{linkedCustomer.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {linkedCustomer.uid} · {linkedCustomer.type} · {linkedCustomer.country}
                    </p>
                  </div>
                  <button
                    onClick={unlinkCustomer}
                    className="flex items-center gap-1 text-[10px] text-danger hover:underline"
                  >
                    <X className="w-3 h-3" /> Unlink
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search by name, UID, email…"
                    className="pl-8 h-9 text-xs"
                  />
                  {searching && (
                    <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-primary" />
                  )}
                  {(customerResults.length > 0 ||
                    (searched && !searching && customerSearch.trim())) && (
                    <div className="absolute z-20 top-full mt-1 w-full bg-popover border rounded-lg shadow-lg overflow-hidden max-h-72 overflow-y-auto">
                      {customerResults.length > 0 ? (
                        customerResults.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => linkCustomer(c)}
                            className="w-full text-left px-3 py-2.5 hover:bg-accent border-b last:border-0"
                          >
                            <p className="text-xs font-medium text-foreground">{c.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {[c.uid, c.type, c.country, c.email].filter(Boolean).join(" · ")}
                            </p>
                          </button>
                        ))
                      ) : (
                        <p className="px-3 py-3 text-[11px] text-muted-foreground text-center">
                          No customers match “{customerSearch.trim()}”. Search by name, UID or email —
                          or skip to enter details manually.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <SectionTitle>Customer / Entity Name *</SectionTitle>
              <Input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Full name or registered entity name"
                className="h-9 text-sm"
              />
            </div>

            <div>
              <SectionTitle>Customer Type *</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {CUSTOMER_TYPES.map((t) => (
                  <OptionTile
                    key={t.value}
                    label={t.label}
                    selected={form.type === t.value}
                    onClick={() => set("type", t.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Jurisdiction / Country *</SectionTitle>
              <p className="text-[10px] text-muted-foreground mb-2">
                UHRC jurisdictions auto-trigger Unacceptable risk.
              </p>
              {loadingFactors ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Loading jurisdictions…
                </div>
              ) : (
                <>
                  <Select value={form.country} onValueChange={(v) => set("country", v)}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select country…" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {jurisdictions.map((j) => (
                        <SelectItem key={j.country} value={j.country}>
                          {j.country} ({j.band})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedJurisdiction && (
                    <div
                      className={cn(
                        "mt-2 p-3 rounded-lg border text-xs",
                        selectedJurisdiction.band === "UHRC" && "bg-red-50 border-red-200",
                        selectedJurisdiction.band === "HRC" && "bg-orange-50 border-orange-200",
                        selectedJurisdiction.band === "MRC" && "bg-yellow-50 border-yellow-200",
                        selectedJurisdiction.band === "LRC" && "bg-green-50 border-green-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">Band:</span>
                        <span className={cn("font-bold", JURISDICTION_BAND_TEXT[selectedJurisdiction.band])}>
                          {selectedJurisdiction.band}
                        </span>
                        <span className="text-muted-foreground">
                          · Jurisdiction score: <strong>{selectedJurisdiction.score}</strong>
                        </span>
                      </div>
                      {selectedJurisdiction.band === "UHRC" && (
                        <p className="flex items-center gap-1 text-red-700 mt-1.5 font-medium text-[11px]">
                          <AlertTriangle className="w-3 h-3" /> UHRC jurisdiction automatically triggers
                          Unacceptable risk rating
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── PHASE 2 — Risk Factors ── */}
      {phase === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Risk Factors</CardTitle>
            <CardDescription>
              Products are scoped to your registered entity type. Channel and retention are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {loadingFactors ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-primary" /> Loading risk factor options…
              </div>
            ) : (
              <>
                <div>
                  <SectionTitle>Reporting Entity Type *</SectionTitle>
                  <Select
                    value={form.entityType}
                    onValueChange={(v) => setForm((p) => ({ ...p, entityType: v, products: [] }))}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue placeholder="Select entity type…" />
                    </SelectTrigger>
                    <SelectContent>
                      {entityOptions.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <SectionTitle>Products &amp; Services</SectionTitle>
                  <p className="text-[10px] text-muted-foreground mb-2">
                    Select all designated services provided. The highest-scoring product drives the calculation.
                  </p>
                  {!form.entityType ? (
                    <p className="text-xs text-muted-foreground italic">
                      Select the reporting entity type above to see its product catalogue.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {(factors?.product || [])
                        .filter((p) => p.entityType === form.entityType)
                        .map((p) => (
                          <OptionTile
                            key={p.value}
                            label={p.value}
                            desc={`Score: ${p.score}${p.risk ? ` · ${p.risk}` : ""}${
                              p.ecddOverride ? " · Mandatory ECDD" : ""
                            }`}
                            selected={form.products.includes(p.value)}
                            onClick={() => toggleProduct(p.value)}
                            multi
                          />
                        ))}
                      {!factors?.product?.some((p) => p.entityType === form.entityType) && (
                        <p className="text-xs text-muted-foreground italic">
                          No product options for this entity type.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <SectionTitle>Onboarding / Transaction Channel *</SectionTitle>
                  <div className="grid grid-cols-2 gap-2">
                    {(factors?.channel || []).map((c) => (
                      <OptionTile
                        key={c.value}
                        label={c.value}
                        desc={`Score: ${c.score}${c.risk ? ` · ${c.risk}` : ""}`}
                        selected={form.channel === c.value}
                        onClick={() => set("channel", c.value)}
                      />
                    ))}
                  </div>
                </div>

                {isIndividual ? (
                  <div>
                    <SectionTitle>Occupation</SectionTitle>
                    <div className="grid grid-cols-2 gap-2">
                      {(factors?.occupation || []).map((o) => (
                        <OptionTile
                          key={o.value}
                          label={o.value}
                          desc={`Score: ${o.score}`}
                          selected={form.occupation === o.value}
                          onClick={() => set("occupation", o.value)}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <SectionTitle>Industry Sector</SectionTitle>
                    <div className="grid grid-cols-2 gap-2">
                      {(factors?.industry || []).map((ind) => (
                        <OptionTile
                          key={ind.value}
                          label={ind.value}
                          desc={`Score: ${ind.score}`}
                          selected={form.industry === ind.value}
                          onClick={() => set("industry", ind.value)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <SectionTitle>Customer Retention *</SectionTitle>
                  <div className="grid grid-cols-3 gap-2">
                    {(factors?.customerRetention || factors?.retention || []).map((r) => (
                      <OptionTile
                        key={r.value}
                        label={r.value}
                        desc={`Score: ${r.score}`}
                        selected={form.retention === r.value}
                        onClick={() => set("retention", r.value)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── PHASE 3 — Enhanced Due Diligence ── */}
      {phase === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enhanced Due Diligence</CardTitle>
            <CardDescription>
              PEP status, source of funds/wealth and adverse media contribute to the score and can
              trigger mandatory ECDD.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <SectionTitle>PEP Status</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {(factors?.pepStatus || []).map((o) => (
                  <OptionTile
                    key={o.value}
                    label={o.value}
                    desc={o.risk && o.risk !== "LOW" ? o.risk : undefined}
                    selected={form.pepStatus === o.value}
                    onClick={() => set("pepStatus", o.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Source of Funds</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                {(factors?.sourceOfFunds || []).map((o) => (
                  <OptionTile
                    key={o.value}
                    label={o.value}
                    desc={`+${o.score}${o.ecddOverride ? " · ECDD" : ""}`}
                    selected={form.sourceOfFunds === o.value}
                    onClick={() => set("sourceOfFunds", o.value)}
                  />
                ))}
              </div>
              <Textarea
                value={form.sourceOfFundsNotes}
                onChange={(e) => set("sourceOfFundsNotes", e.target.value)}
                rows={2}
                placeholder="Document the declared source of funds…"
                className="text-xs mt-2"
              />
            </div>

            <div>
              <SectionTitle>Source of Wealth</SectionTitle>
              <div className="grid grid-cols-3 gap-2">
                {(factors?.sourceOfWealth || []).map((o) => (
                  <OptionTile
                    key={o.value}
                    label={o.value}
                    desc={`+${o.score}${o.ecddOverride ? " · ECDD" : ""}`}
                    selected={form.sourceOfWealth === o.value}
                    onClick={() => set("sourceOfWealth", o.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Adverse Media</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {(factors?.adverseMedia || []).map((o) => (
                  <OptionTile
                    key={o.value}
                    label={o.value}
                    desc={`+${o.score}${o.ecddOverride ? " · ECDD" : ""}`}
                    selected={form.adverseMedia === o.value}
                    onClick={() => set("adverseMedia", o.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <SectionTitle>Beneficial Ownership</SectionTitle>
              <Textarea
                value={form.beneficialOwnershipNotes}
                onChange={(e) => set("beneficialOwnershipNotes", e.target.value)}
                rows={2}
                placeholder="UBOs, controlling parties, complex ownership chains…"
                className="text-xs"
              />
            </div>

            <div>
              <SectionTitle>Additional Notes</SectionTitle>
              <Textarea
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                rows={2}
                placeholder="Other observations, red flags, contextual notes…"
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── PHASE 4 — Review & Score ── */}
      {phase === 4 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  ["Customer", form.name || "(standalone)"],
                  ["Type", CUSTOMER_TYPES.find((t) => t.value === form.type)?.label || form.type],
                  ["Jurisdiction", form.country || "—"],
                  ["Entity Type", form.entityType || "—"],
                  ["Products", form.products.length ? form.products.join(", ") : "None selected"],
                  ["Channel", form.channel || "—"],
                  isIndividual
                    ? ["Occupation", form.occupation || "—"]
                    : ["Industry", form.industry || "—"],
                  ["Retention", form.retention || "—"],
                  ["PEP Status", form.pepStatus || "Not a PEP"],
                  ["Source of Funds", form.sourceOfFunds || "—"],
                  ["Source of Wealth", form.sourceOfWealth || "—"],
                  ["Adverse Media", form.adverseMedia || "—"],
                ].map(([label, val]) => (
                  <div key={label} className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-xs text-foreground font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Score</CardTitle>
            </CardHeader>
            <CardContent>
              {previewLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" /> Calculating risk score…
                </div>
              ) : preview ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-4xl font-black text-foreground">
                        {preview.riskScore}
                        <span className="text-lg text-muted-foreground">/100</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground">Total Score</p>
                    </div>
                    <div>
                      <Badge variant={RISK_BADGE_VARIANT[preview.riskLabel]} className="text-sm">
                        {preview.riskLabel}
                      </Badge>
                      {preview.serviceBlocked && (
                        <p className="flex items-center gap-1 text-red-700 text-[10px] mt-1.5">
                          <AlertTriangle className="w-3 h-3" /> Service blocked — contact ASO + AFP; SMR
                          assessment
                        </p>
                      )}
                    </div>
                  </div>

                  <ScoreBar score={preview.riskScore} label={preview.riskLabel} />

                  {preview.ecddRequired && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-800">
                        <AlertTriangle className="w-3 h-3" /> Mandatory ECDD — saving activates the service
                        delivery gate until a Compliance Officer approves.
                      </p>
                      {(preview.overrides || []).length > 0 && (
                        <ul className="mt-1.5 space-y-0.5">
                          {preview.overrides.map((o, i) => (
                            <li key={i} className="text-[10px] text-orange-700">
                              • {o}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Factor Breakdown
                    </p>
                    <div className="space-y-2">
                      {Object.entries(preview.riskAssessment || {}).map(([factor, detail]) => {
                        const s = detail?.score ?? 0;
                        // Normalize each factor against its own scale:
                        // jurisdiction UHRC = 100 (fills to 100%); all others max at 5
                        const pct = s === 0 ? 0 : (s / Math.max(s, 5)) * 100;
                        return (
                          <div key={factor}>
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-[10px] text-muted-foreground">
                                {humanFactor(factor)}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-foreground font-medium capitalize">
                                  {detail?.value || "—"}
                                </span>
                                <span className="text-[10px] font-bold w-8 text-right">
                                  +{s}
                                </span>
                              </div>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary/60 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <Button variant="link" size="sm" className="text-[10px] px-0 h-auto" onClick={fetchPreview}>
                    Recalculate score
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs text-muted-foreground mb-2">Score could not be calculated.</p>
                  <Button variant="outline" size="sm" onClick={fetchPreview}>
                    Try again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between">
        {phase > 1 ? (
          <Button variant="outline" size="sm" onClick={() => setPhase((p) => p - 1)}>
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Back
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}

        {phase < 4 ? (
          <Button size="sm" disabled={!canAdvance()} onClick={() => setPhase((p) => p + 1)}>
            Next Phase <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        ) : (
          <Button size="sm" disabled={saving || previewLoading} onClick={handleSubmit}>
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5 mr-1" />
            )}
            {saving ? "Saving…" : "Save Assessment"}
          </Button>
        )}
      </div>
    </div>
  );
}
