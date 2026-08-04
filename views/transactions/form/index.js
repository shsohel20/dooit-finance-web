"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2, Save, FlaskConical, ChevronDown, ChevronRight,
  ArrowRight, Building2, User, Globe, Shield, Cpu,
  Scale, FileSearch, Link2, Wifi, Hash, Info,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/ui/FormField";
import SelectCustomerList from "@/components/ui/SelectCustomerList";
import {
  createTransaction,
  getTransactionById,
  updateTransaction,
} from "@/app/dashboard/client/transactions/actions";

// ── dummy payload for instant developer testing ───────────────────────────────

const DUMMY_PAYLOAD = {
  type:                 "transfer",
  subtype:              "wire",
  amount:               125000,
  currency:             "USD",
  reference:            "REF-2025-88431",
  narrative:            "International wire transfer for supplier payment Q2",
  status:               "pending",
  channel:              "online",
  purpose:              "supplier_payment",
  remittancePurposeCode: "GDS",
  sender: {
    customer:           { label: "", value: "" },
    name:               "Apex Capital Holdings Pty Ltd",
    account:            "AU-7842-0012-3345",
    institution:        "Commonwealth Bank of Australia",
    institutionCountry: "AU",
    bic:                "CTBAAU2S",
    address:            "Level 12, 201 Sussex St, Sydney NSW 2000",
    extra:              { customerRef: "APEX-C-2024" },
  },
  receiver: {
    customer:           { label: "", value: "" },
    name:               "Meridian Trade Solutions GmbH",
    account:            "DE89370400440532013000",
    institution:        "Deutsche Bank AG",
    institutionCountry: "DE",
    bic:                "DEUTDEDB",
    address:            "Taunusanlage 12, 60325 Frankfurt am Main",
  },
  beneficiary: {
    name:               "Sigma Logistics BV",
    account:            "NL91ABNA0417164300",
    institution:        "ABN AMRO Bank",
    institutionCountry: "NL",
    bic:                "ABNANL2A",
    address:            "Gustav Mahlerlaan 10, 1082 PP Amsterdam",
  },
  intermediary: {
    name:               "JP Morgan Chase Bank NA",
    account:            "CHASUS33",
    institution:        "JP Morgan Chase",
    institutionCountry: "US",
    bic:                "CHASUS33",
    address:            "383 Madison Ave, New York, NY 10179",
  },
  riskScore:            72,
  riskFlags:            "large_cash_transaction,cross_border,high_risk_country",
  relatedPartyFlag:     false,
  relatedPartyTxnId:    "",
  crypto: {
    walletAddress:      "",
    txHash:             "",
    network:            "",
    hops:               0,
    cluster:            "",
  },
  bullion: {
    type:               "",
    purity:             "",
    weight:             "",
  },
  travelRule: {
    originatorVaspId:       "VASP-AU-0042",
    originatorVaspName:     "Dooit Financial Services",
    originatorVaspLicense:  "AFSL-495312",
    beneficiaryVaspId:      "VASP-DE-0018",
    beneficiaryVaspName:    "Meridian VASP GmbH",
    travelMessageId:        "TRV-2025-XB-99812",
    protocol:               "TRISA",
  },
  forensic: {
    walletCluster:      "",
    chainalysisScore:   "",
    notes:              "",
  },
  investigation: {
    caseId:             "",
    flagged:            false,
    investigatorNotes:  "",
  },
  metadata: {
    ip:       "203.0.113.45",
    deviceId: "dev-chrome-macOS-8f3c",
  },
};

const BLANK = {
  type: "", subtype: "", amount: 0, currency: "", reference: "", narrative: "",
  status: "", channel: "", purpose: "", remittancePurposeCode: "",
  sender:       { customer: { label: "", value: "" }, name: "", account: "", institution: "", institutionCountry: "", bic: "", address: "", extra: { customerRef: "" } },
  receiver:     { customer: { label: "", value: "" }, name: "", account: "", institution: "", institutionCountry: "", bic: "", address: "" },
  beneficiary:  { name: "", account: "", institution: "", institutionCountry: "", bic: "", address: "" },
  intermediary: { name: "", account: "", institution: "", institutionCountry: "", bic: "", address: "" },
  riskScore: 0, riskFlags: "",
  relatedPartyFlag: false, relatedPartyTxnId: "",
  crypto:      { walletAddress: "", txHash: "", network: "", hops: 0, cluster: "" },
  bullion:     { type: "", purity: "", weight: "" },
  travelRule:  { originatorVaspId: "", originatorVaspName: "", originatorVaspLicense: "", beneficiaryVaspId: "", beneficiaryVaspName: "", travelMessageId: "", protocol: "" },
  forensic:    { walletCluster: "", chainalysisScore: "", notes: "" },
  investigation: { caseId: "", flagged: false, investigatorNotes: "" },
  metadata:    { ip: "203.0.113.5", deviceId: "device-abc-123" },
};

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ icon: Icon, title, badge, children, collapsible = false, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader
        className={`pb-3 ${collapsible ? "cursor-pointer select-none" : ""}`}
        onClick={collapsible ? () => setOpen((o) => !o) : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <Icon className="size-3.5 text-primary" />
            </div>
            <CardTitle className="text-sm font-bold tracking-wide uppercase text-foreground">
              {title}
            </CardTitle>
            {badge && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 text-muted-foreground">
                {badge}
              </Badge>
            )}
          </div>
          {collapsible && (
            open
              ? <ChevronDown className="size-4 text-muted-foreground" />
              : <ChevronRight className="size-4 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      {(!collapsible || open) && (
        <CardContent className="pt-0">{children}</CardContent>
      )}
    </Card>
  );
}

// ── Extract party fields from a customer object ───────────────────────────────

function derivePartyFromCustomer(customer) {
  const pf      = customer?.personalKyc?.personal_form ?? {};
  const details = pf.customer_details ?? {};
  const contact = pf.contact_details ?? {};
  const addr    = pf.residential_address ?? {};
  const sole    = customer?.personalKyc?.sole_trader;

  // Full name — prefer business name for sole traders
  const isSoleTrader = sole?.is_sole_trader;
  const name = isSoleTrader && sole?.business_details?.business_name
    ? sole.business_details.business_name
    : [details.given_name, details.middle_name, details.surname]
        .filter(Boolean).join(" ").trim();

  // Address — residential or sole trader business address
  const addrObj = isSoleTrader && sole?.business_details?.business_address?.address
    ? sole.business_details.business_address
    : addr;

  const addressLine = [
    addrObj.address,
    addrObj.suburb,
    addrObj.state,
    addrObj.postcode,
    addrObj.country,
  ].filter(Boolean).join(", ");

  // Country code — prefer address country, fall back to customer.country
  const country = addrObj.country || customer?.country || "";

  return { name, address: addressLine, country, contact };
}

// ── Party sub-section ─────────────────────────────────────────────────────────

function PartyFields({ form, prefix, label, showCustomerSelect = true, loading }) {
  const [populated, setPopulated] = useState(false);

  const accent = {
    "sender":       "border-l-primary",
    "receiver":     "border-l-emerald-500",
    "beneficiary":  "border-l-amber-500",
    "intermediary": "border-l-purple-500",
  }[prefix] ?? "border-l-border";

  const handleCustomerChange = (customer) => {
    // Always store customer ref
    form.setValue(`${prefix}.customer`, customer);

    if (!customer?._id) { setPopulated(false); return; }

    const { name, address, country } = derivePartyFromCustomer(customer);

    // Populate only if the field is blank (don't overwrite user edits)
    if (name)    form.setValue(`${prefix}.name`,               name,    { shouldDirty: true });
    if (address) form.setValue(`${prefix}.address`,            address, { shouldDirty: true });
    if (country) form.setValue(`${prefix}.institutionCountry`, country, { shouldDirty: true });

    // Sender-specific: store customer UID as customerRef
    if (prefix === "sender" && customer.uid) {
      form.setValue("sender.extra.customerRef", customer.uid, { shouldDirty: true });
    }

    setPopulated(true);
    setTimeout(() => setPopulated(false), 2500);
  };

  return (
    <div className={`border-l-2 ${accent} pl-4 space-y-3`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
        {populated && (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
            ✓ Auto-filled from customer
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {showCustomerSelect && (
          <SelectCustomerList
            form={form}
            name={`${prefix}.customer`}
            label="Linked Customer"
            loading={loading}
            value={form.watch(`${prefix}.customer`)}
            onChange={handleCustomerChange}
          />
        )}
        <FormField form={form} name={`${prefix}.name`}               label="Name"               type="text" loading={loading} />
        <FormField form={form} name={`${prefix}.account`}            label="Account / IBAN"     type="text" loading={loading} />
        <FormField form={form} name={`${prefix}.institution`}        label="Institution"        type="text" loading={loading} />
        <FormField form={form} name={`${prefix}.institutionCountry`} label="Country Code"       type="text" loading={loading} />
        <FormField form={form} name={`${prefix}.bic`}                label="BIC / SWIFT"        type="text" loading={loading} />
        <FormField form={form} name={`${prefix}.address`}            label="Address"            type="text" loading={loading} />
        {prefix === "sender" && (
          <FormField form={form} name="sender.extra.customerRef" label="Customer Reference" type="text" loading={loading} />
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const TransactionForm = ({ id }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching,   setIsFetching]   = useState(false);
  const router = useRouter();

  const form = useForm({ defaultValues: BLANK });

  // ── fill dummy data ───────────────────────────────────────────────────────
  const fillDummy = () => {
    form.reset(DUMMY_PAYLOAD);
    toast.success("Test data loaded — review and save when ready", {
      description: "All fields populated with realistic dummy payload",
      duration: 4000,
    });
  };

  // ── load existing record ──────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    setIsFetching(true);
    getTransactionById(id)
      .then((res) => {
        if (!res.success) { toast.error("Failed to load transaction"); return; }
        const d = res.data;
        form.reset({
          ...BLANK,
          type:                  d.type,
          subtype:               d.subtype,
          amount:                d.amount,
          currency:              d.currency,
          reference:             d.reference,
          narrative:             d.narrative,
          status:                d.status,
          channel:               d.channel,
          purpose:               d.purpose,
          remittancePurposeCode: d.remittancePurposeCode,
          sender: {
            ...d.sender,
            customer: { label: d.sender?.name ?? "", value: d.sender?.customer?._id ?? d.sender?.customer ?? "" },
          },
          receiver: {
            ...d.receiver,
            customer: { label: d.receiver?.name ?? "", value: d.receiver?.customer?._id ?? d.receiver?.customer ?? "" },
          },
          beneficiary:  d.beneficiary  ?? BLANK.beneficiary,
          intermediary: d.intermediary ?? BLANK.intermediary,
          riskScore:    d.riskScore    ?? 0,
          riskFlags:    (d.riskFlags ?? []).join(","),
          relatedPartyFlag:    d.relatedPartyFlag    ?? false,
          relatedPartyTxnId:   d.relatedPartyTxnId   ?? "",
          crypto:      d.crypto      ?? BLANK.crypto,
          bullion:     d.bullion     ?? BLANK.bullion,
          travelRule:  d.travelRule  ?? BLANK.travelRule,
          forensic:    d.forensic    ?? BLANK.forensic,
          investigation: d.investigation ?? BLANK.investigation,
          metadata:    d.metadata    ?? BLANK.metadata,
        });
      })
      .catch(() => toast.error("Error loading transaction"))
      .finally(() => setIsFetching(false));
  }, [id]);

  // ── submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const v = form.getValues();
      const payload = {
        type:                 v.type,
        subtype:              v.subtype || undefined,
        amount:               Number(v.amount),
        currency:             v.currency,
        reference:            v.reference || undefined,
        narrative:            v.narrative || undefined,
        status:               v.status,
        channel:              v.channel  || undefined,
        purpose:              v.purpose  || undefined,
        remittancePurposeCode: v.remittancePurposeCode || undefined,

        sender: {
          customer:           v.sender.customer?.value   || undefined,
          name:               v.sender.customer?.label   || v.sender.name || undefined,
          account:            v.sender.account           || undefined,
          institution:        v.sender.institution       || undefined,
          institutionCountry: v.sender.institutionCountry || undefined,
          bic:                v.sender.bic               || undefined,
          address:            v.sender.address           || undefined,
          extra:              v.sender.extra             || undefined,
        },

        receiver: {
          customer:           v.receiver.customer?.value   || undefined,
          name:               v.receiver.customer?.label   || v.receiver.name || undefined,
          account:            v.receiver.account           || undefined,
          institution:        v.receiver.institution       || undefined,
          institutionCountry: v.receiver.institutionCountry || undefined,
          bic:                v.receiver.bic               || undefined,
          address:            v.receiver.address           || undefined,
        },

        beneficiary: {
          name:               v.beneficiary.name               || undefined,
          account:            v.beneficiary.account            || undefined,
          institution:        v.beneficiary.institution        || undefined,
          institutionCountry: v.beneficiary.institutionCountry || undefined,
          bic:                v.beneficiary.bic                || undefined,
          address:            v.beneficiary.address            || undefined,
        },

        intermediary: {
          name:               v.intermediary.name               || undefined,
          account:            v.intermediary.account            || undefined,
          institution:        v.intermediary.institution        || undefined,
          institutionCountry: v.intermediary.institutionCountry || undefined,
          bic:                v.intermediary.bic                || undefined,
          address:            v.intermediary.address            || undefined,
        },

        riskScore:         Number(v.riskScore) || undefined,
        riskFlags:         v.riskFlags ? v.riskFlags.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
        relatedPartyFlag:  v.relatedPartyFlag,
        relatedPartyTxnId: v.relatedPartyTxnId || undefined,

        crypto: {
          walletAddress: v.crypto.walletAddress || undefined,
          txHash:        v.crypto.txHash        || undefined,
          network:       v.crypto.network       || undefined,
          hops:          Number(v.crypto.hops)  || undefined,
          cluster:       v.crypto.cluster       || undefined,
        },

        bullion: {
          type:   v.bullion.type   || undefined,
          purity: v.bullion.purity || undefined,
          weight: Number(v.bullion.weight) || undefined,
        },

        travelRule: {
          originatorVaspId:      v.travelRule.originatorVaspId      || undefined,
          originatorVaspName:    v.travelRule.originatorVaspName    || undefined,
          originatorVaspLicense: v.travelRule.originatorVaspLicense || undefined,
          beneficiaryVaspId:     v.travelRule.beneficiaryVaspId     || undefined,
          beneficiaryVaspName:   v.travelRule.beneficiaryVaspName   || undefined,
          travelMessageId:       v.travelRule.travelMessageId       || undefined,
          protocol:              v.travelRule.protocol              || undefined,
        },

        forensic: {
          walletCluster:     v.forensic.walletCluster              || undefined,
          chainalysisScore:  Number(v.forensic.chainalysisScore)   || undefined,
          notes:             v.forensic.notes                      || undefined,
        },

        investigation: {
          caseId:            v.investigation.caseId            || undefined,
          flagged:           v.investigation.flagged           ?? false,
          investigatorNotes: v.investigation.investigatorNotes || undefined,
        },

        metadata: {
          ip:       v.metadata.ip       || undefined,
          deviceId: v.metadata.deviceId || undefined,
        },
      };

      const res = await (id ? updateTransaction(id, payload) : createTransaction(payload));
      if (res.success) {
        toast.success(id ? "Transaction updated!" : "Transaction created!");
        if (!id) localStorage.setItem("newId", res.data?._id);
        router.push("/dashboard/client/transactions");
      } else {
        toast.error(res.message || "Failed to save transaction");
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 mb-10 max-w-6xl">

      {/* ── Dev toolbar ──────────────────────────────────────────────────────── */}
      {!id && (
        <div className="flex items-center justify-between rounded-xl border border-dashed border-amber-400/60 bg-amber-50/50 dark:bg-amber-950/20 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <FlaskConical className="size-4 text-amber-600" />
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Developer Mode</p>
              <p className="text-[11px] text-amber-700/70 dark:text-amber-400/70">
                Fill all fields with a realistic wire-transfer payload for instant testing
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={fillDummy}
            className="gap-1.5 border-amber-400/60 text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/40 shrink-0"
          >
            <FlaskConical className="size-3.5" />
            Fill Test Data
          </Button>
        </div>
      )}

      {/* ── 1. Core Transaction Details ───────────────────────────────────── */}
      <Section icon={Info} title="Transaction Details">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <FormField form={form} name="type" label="Transaction Type" type="select" loading={isFetching}
            options={[
              { label: "Transfer",   value: "transfer"   },
              { label: "Deposit",    value: "deposit"    },
              { label: "Withdrawal", value: "withdrawal" },
              { label: "Exchange",   value: "exchange"   },
              { label: "Other",      value: "other"      },
            ]}
          />
          <FormField form={form} name="subtype" label="Subtype" type="select" loading={isFetching}
            options={[
              { label: "Wire Transfer", value: "wire"   },
              { label: "Spot FX",       value: "spotfx" },
              { label: "OTC",           value: "otc"    },
            ]}
          />
          <FormField form={form} name="status" label="Status" type="select" loading={isFetching}
            options={[
              { label: "Pending",   value: "pending"   },
              { label: "Completed", value: "completed" },
              { label: "Failed",    value: "failed"    },
              { label: "Cancelled", value: "cancelled" },
            ]}
          />
          <FormField form={form} name="channel" label="Channel" type="select" loading={isFetching}
            options={[
              { label: "Online",     value: "online"     },
              { label: "Mobile App", value: "mobile_app" },
              { label: "Branch",     value: "branch"     },
              { label: "API",        value: "api"        },
              { label: "SWIFT",      value: "swift"      },
            ]}
          />
          <FormField form={form} name="amount"   label="Amount"   type="number" loading={isFetching} />
          <FormField form={form} name="currency" label="Currency" type="select" loading={isFetching}
            options={[
              { label: "AUD", value: "AUD" },
              { label: "USD", value: "USD" },
              { label: "EUR", value: "EUR" },
              { label: "GBP", value: "GBP" },
              { label: "SGD", value: "SGD" },
              { label: "JPY", value: "JPY" },
              { label: "CNY", value: "CNY" },
            ]}
          />
          <FormField form={form} name="reference"  label="Reference"  type="text" loading={isFetching} />
          <FormField form={form} name="narrative"  label="Narrative"  type="text" loading={isFetching} />
          <FormField form={form} name="purpose" label="Purpose" type="select" loading={isFetching}
            options={[
              { label: "Supplier Payment",  value: "supplier_payment"  },
              { label: "Customer Payment",  value: "customer_payment"  },
              { label: "Salary",            value: "salary"            },
              { label: "Investment",        value: "investment"        },
              { label: "Trade Finance",     value: "trade_finance"     },
              { label: "Other",             value: "other"             },
            ]}
          />
          <FormField form={form} name="remittancePurposeCode" label="Remittance Purpose Code" type="text" loading={isFetching} />
        </div>
      </Section>

      {/* ── 2. Participants — Sender → Receiver ──────────────────────────── */}
      <Section icon={ArrowRight} title="Participants" badge="Sender & Receiver">
        <div className="space-y-6">
          {/* Flow indicator */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-bold text-primary">Sender</span>
            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-emerald-500/30" />
            <ArrowRight className="size-3.5 text-muted-foreground" />
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/30 to-emerald-500/10" />
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-bold text-emerald-600">Receiver</span>
          </div>

          <PartyFields form={form} prefix="sender"   label="Sender"   showCustomerSelect loading={isFetching} />
          <div className="border-t border-dashed border-border my-2" />
          <PartyFields form={form} prefix="receiver" label="Receiver" showCustomerSelect loading={isFetching} />
        </div>
      </Section>

      {/* ── 3. Other Parties ─────────────────────────────────────────────── */}
      <Section icon={Building2} title="Other Parties" badge="Optional" collapsible defaultOpen={false}>
        <div className="space-y-6">
          <PartyFields form={form} prefix="beneficiary"  label="Beneficiary"  showCustomerSelect={false} loading={isFetching} />
          <div className="border-t border-dashed border-border" />
          <PartyFields form={form} prefix="intermediary" label="Intermediary" showCustomerSelect={false} loading={isFetching} />
        </div>
      </Section>

      {/* ── 4. Risk & Compliance ─────────────────────────────────────────── */}
      <Section icon={Shield} title="Risk & Compliance">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <FormField form={form} name="riskScore" label="Risk Score (0–100)" type="number" loading={isFetching} />
          <div className="md:col-span-2">
            <FormField
              form={form}
              name="riskFlags"
              label="Risk Flags (comma-separated)"
              type="text"
              loading={isFetching}
              placeholder="e.g. large_cash_transaction, cross_border, pep"
            />
          </div>
          <FormField form={form} name="relatedPartyFlag"    label="Related Party Flag"  type="select" loading={isFetching}
            options={[{ label: "No", value: false }, { label: "Yes", value: true }]}
          />
          <FormField form={form} name="relatedPartyTxnId"  label="Related Party Txn ID" type="text" loading={isFetching} />
        </div>
      </Section>

      {/* ── 5. Travel Rule ───────────────────────────────────────────────── */}
      <Section icon={Globe} title="Travel Rule" badge="VASP / TRISA" collapsible defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <FormField form={form} name="travelRule.originatorVaspId"      label="Originator VASP ID"      type="text" loading={isFetching} />
          <FormField form={form} name="travelRule.originatorVaspName"    label="Originator VASP Name"    type="text" loading={isFetching} />
          <FormField form={form} name="travelRule.originatorVaspLicense" label="Originator VASP Licence" type="text" loading={isFetching} />
          <FormField form={form} name="travelRule.beneficiaryVaspId"     label="Beneficiary VASP ID"     type="text" loading={isFetching} />
          <FormField form={form} name="travelRule.beneficiaryVaspName"   label="Beneficiary VASP Name"   type="text" loading={isFetching} />
          <FormField form={form} name="travelRule.travelMessageId"       label="Travel Message ID"       type="text" loading={isFetching} />
          <FormField form={form} name="travelRule.protocol"              label="Protocol"                type="text" loading={isFetching} placeholder="e.g. TRISA, OpenVASP" />
        </div>
      </Section>

      {/* ── 6. Crypto ────────────────────────────────────────────────────── */}
      <Section icon={Cpu} title="Crypto / DeFi" badge="Optional" collapsible defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="md:col-span-2">
            <FormField form={form} name="crypto.walletAddress" label="Wallet Address"  type="text" loading={isFetching} />
          </div>
          <div className="md:col-span-2">
            <FormField form={form} name="crypto.txHash"        label="Tx Hash"         type="text" loading={isFetching} />
          </div>
          <FormField form={form} name="crypto.network"         label="Network"         type="text" loading={isFetching} placeholder="e.g. Ethereum, Bitcoin" />
          <FormField form={form} name="crypto.hops"            label="Hops"            type="number" loading={isFetching} />
          <FormField form={form} name="crypto.cluster"         label="Cluster"         type="text" loading={isFetching} />
        </div>
      </Section>

      {/* ── 7. Bullion ───────────────────────────────────────────────────── */}
      <Section icon={Scale} title="Bullion" badge="Optional" collapsible defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormField form={form} name="bullion.type"   label="Metal Type"    type="text" loading={isFetching} placeholder="e.g. Gold, Silver, Platinum" />
          <FormField form={form} name="bullion.purity" label="Purity"        type="text" loading={isFetching} placeholder="e.g. 999.9, 22k" />
          <FormField form={form} name="bullion.weight" label="Weight (grams)" type="number" loading={isFetching} />
        </div>
      </Section>

      {/* ── 8. Forensic ──────────────────────────────────────────────────── */}
      <Section icon={FileSearch} title="Forensic Details" badge="Optional" collapsible defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <FormField form={form} name="forensic.walletCluster"    label="Wallet Cluster"    type="text" loading={isFetching} />
          <FormField form={form} name="forensic.chainalysisScore" label="Chainalysis Score" type="number" loading={isFetching} />
          <FormField form={form} name="forensic.notes"            label="Forensic Notes"    type="text" loading={isFetching} />
        </div>
      </Section>

      {/* ── 9. Investigation ─────────────────────────────────────────────── */}
      <Section icon={Link2} title="Investigation" badge="Optional" collapsible defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <FormField form={form} name="investigation.caseId"           label="Case ID"             type="text" loading={isFetching} />
          <FormField form={form} name="investigation.flagged"          label="Flagged"             type="select" loading={isFetching}
            options={[{ label: "No", value: false }, { label: "Yes", value: true }]}
          />
          <FormField form={form} name="investigation.investigatorNotes" label="Investigator Notes" type="text" loading={isFetching} />
        </div>
      </Section>

      {/* ── 10. Metadata ─────────────────────────────────────────────────── */}
      <Section icon={Wifi} title="Metadata" collapsible defaultOpen={false}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField form={form} name="metadata.ip"       label="IP Address" type="text" loading={isFetching} />
          <FormField form={form} name="metadata.deviceId" label="Device ID"  type="text" loading={isFetching} />
        </div>
      </Section>

      {/* ── Submit ─────────────────────────────────────────────────────────── */}
      <div className="sticky bottom-4 z-10">
        <div className="rounded-xl border border-border/60 bg-background/95 backdrop-blur-sm shadow-xl px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-foreground">
              {id ? "Update Transaction" : "Create Transaction"}
            </p>
            <p className="text-xs text-muted-foreground">
              {id ? "Changes will be saved immediately." : "All required fields must be completed before saving."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/client/transactions")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting || isFetching}
              className="min-w-[110px]"
            >
              {isSubmitting
                ? <><Loader2 className="size-3.5 animate-spin mr-1.5" /> Saving…</>
                : <><Save className="size-3.5 mr-1.5" /> {id ? "Update" : "Save"}</>}
            </Button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TransactionForm;
