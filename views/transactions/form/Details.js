"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { getTransactionById, downloadTransactionPdf } from "@/app/dashboard/client/transactions/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Shield,
  User,
  Calendar,
  Globe,
  Briefcase,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ArrowRight,
  Link2,
  Cpu,
  Scale,
  Activity,
  MapPin,
  Phone,
  Mail,
  Hash,
  Clock,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dateShowFormatWithTime, formatAUD } from "@/lib/utils";

// ── shared helpers ────────────────────────────────────────────────────────────

const getRiskBarColor = (score) => {
  if (score >= 70) return "bg-destructive";
  if (score >= 40) return "bg-warning";
  return "bg-success";
};

const getRiskLabel = (score) => {
  if (score >= 70) return { label: "High Risk", cls: "text-destructive" };
  if (score >= 40) return { label: "Medium Risk", cls: "text-warning-foreground" };
  return { label: "Low Risk", cls: "text-success" };
};

const statusMeta = {
  pending: { variant: "outline", cls: "border-warning/30 bg-warning/10 text-warning-foreground" },
  completed: { variant: "outline", cls: "border-success/30 bg-success/10 text-success" },
  failed: { variant: "outline", cls: "border-destructive/30 bg-destructive/10 text-destructive" },
  cancelled: { variant: "outline", cls: "border-border bg-muted/50 text-muted-foreground" },
};

// label-value row — matches CaseOverview.jsx pattern exactly
function LabelValue({ label, value, mono = false }) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      <span className={`text-sm text-foreground text-right max-w-[60%] ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}

// icon + label + value row — matches CustomerProfile.jsx pattern exactly
function IconRow({ icon: Icon, label, value, children }) {
  if (!value && !children) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 space-y-0.5 min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {children ?? <p className="text-sm font-medium text-foreground break-words">{value}</p>}
      </div>
    </div>
  );
}

// ── party block (sender / receiver / beneficiary / intermediary) ──────────────

function PartyBlock({ title, party }) {
  const hasData = party?.name || party?.account || party?.institution;
  if (!hasData) return null;
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="space-y-2">
        <IconRow icon={User} label="Name" value={party?.name} />
        <IconRow icon={Hash} label="Account" value={party?.account} />
        <IconRow icon={Building2} label="Institution" value={party?.institution} />
        <IconRow icon={Globe} label="Country" value={party?.institutionCountry} />
        <IconRow icon={MapPin} label="Address" value={party?.address} />
      </div>
    </div>
  );
}

// ── customer KYC tabs ─────────────────────────────────────────────────────────

function KycProfile({ tx }) {
  const primaryCustomer =
    tx?.type === "deposit" ? tx?.receiver?.customer : tx?.sender?.customer;
  if (!primaryCustomer) return null;

  const partyLabel = tx?.type === "deposit" ? "Receiver" : "Sender";
  const personal = primaryCustomer?.personalKyc?.personal_form;
  const details = personal?.customer_details;
  const contact = personal?.contact_details;
  const addr = personal?.residential_address;
  const employment = personal?.employment_details;
  const funds = primaryCustomer?.personalKyc?.funds_wealth;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{partyLabel} — KYC Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="pt-4 space-y-4">
            <div className="space-y-3">
              <IconRow
                icon={User}
                label="Full Name"
                value={[details?.given_name, contact?.middle_name, details?.surname]
                  .filter(Boolean).join(" ")}
              />
              <IconRow icon={Calendar} label="Date of Birth" value={details?.date_of_birth} />
              <IconRow icon={Globe} label="Nationality" value={details?.nationality} />
              <IconRow
                icon={CheckCircle2}
                label="Account Status"
              >
                <Badge
                  variant="outline"
                  className={primaryCustomer?.isActive
                    ? "h-6 border-success/30 bg-success/10 text-success"
                    : "h-6 border-border bg-muted/50 text-muted-foreground"}
                >
                  {primaryCustomer?.isActive ? "Active" : "Inactive"}
                </Badge>
              </IconRow>
            </div>

            {(contact?.email || contact?.phone) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="size-3" /> Contact
                  </p>
                  <IconRow icon={Mail} label="Email" value={contact?.email} />
                  <IconRow icon={Phone} label="Phone" value={contact?.phone} />
                </div>
              </>
            )}

            {addr && (
              <>
                <Separator />
                <IconRow icon={MapPin} label="Residential Address">
                  <div className="rounded-md bg-muted/50 px-3 py-2 text-sm text-foreground">
                    <p>{addr?.address}</p>
                    <p>{[addr?.suburb, addr?.state, addr?.postcode].filter(Boolean).join(", ")}</p>
                    <p className="font-medium">{addr?.country}</p>
                  </div>
                </IconRow>
              </>
            )}
          </TabsContent>

          <TabsContent value="employment" className="pt-4 space-y-3">
            <IconRow icon={Briefcase} label="Occupation" value={employment?.occupation} />
            <IconRow icon={Building2} label="Industry" value={employment?.industry} />
            <IconRow icon={Building2} label="Employer" value={employment?.employer_name} />
          </TabsContent>

          <TabsContent value="financial" className="pt-4 space-y-3">
            <IconRow icon={FileText} label="Source of Funds" value={funds?.source_of_funds} />
            <IconRow icon={FileText} label="Source of Wealth" value={funds?.source_of_wealth} />
            <IconRow icon={FileText} label="Account Purpose" value={funds?.account_purpose} />
            <IconRow icon={FileText} label="Est. Trading Volume" value={funds?.estimated_trading_volume} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ── main component ────────────────────────────────────────────────────────────

const TransactionDetailView = ({ open, setOpen, currentItem }) => {
  const [tx, setTx] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (currentItem) fetchDetails();
  }, [currentItem]);

  const fetchDetails = async () => {
    const res = await getTransactionById(currentItem?._id);
    setTx(res?.data ?? null);
  };

  const handleDownloadPdf = async () => {
    if (!tx?._id) return;
    setPdfLoading(true);
    try {
      const result = await downloadTransactionPdf(tx._id);
      if (!result.success) { toast.error(result.message || "PDF generation failed"); return; }
      const bytes = Uint8Array.from(atob(result.data), (c) => c.charCodeAt(0));
      const blob = new Blob([bytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transaction-${tx.uid || tx._id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error("PDF download failed: " + err.message);
    } finally {
      setPdfLoading(false);
    }
  };

  const riskScore = tx?.riskScore ?? 0;
  const { label: riskLabel, cls: riskCls } = getRiskLabel(riskScore);
  const smeta = statusMeta[tx?.status] ?? statusMeta.pending;

  const hasCrypto = tx?.crypto?.walletAddress || tx?.crypto?.txHash;
  const hasBullion = tx?.bullion?.type;
  const hasTravelRule = tx?.travelRule?.originatorVaspId || tx?.travelRule?.beneficiaryVaspId;
  const hasRelated = tx?.relatedPartyFlag || tx?.relatedPartyTxnId;
  const hasInvestigation = tx?.investigation?.caseId || tx?.investigation?.flagged;
  const hasWorkflow = tx?.metadata?.workflowHistory?.length > 0;
  const hasBeneficiary = tx?.beneficiary?.name || tx?.beneficiary?.account;
  const hasIntermediary = tx?.intermediary?.name || tx?.intermediary?.account;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-5xl w-full overflow-y-auto">

        {/* ── header ───────────────────────────────────────────────────────── */}
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-semibold text-foreground">
            Transaction Detail
          </SheetTitle>
          <div className="flex items-center justify-between mt-1">
            <SheetDescription className="font-mono text-xs">
              {tx?.uid ?? "Loading…"}
            </SheetDescription>
            {tx && (
              <Button
                variant="outline"
                size="sm"
                disabled={pdfLoading}
                onClick={handleDownloadPdf}
                className="h-7 gap-1.5 text-xs border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
              >
                {pdfLoading ? (
                  <span className="size-3 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
                ) : (
                  <FileText className="size-3.5" />
                )}
                {pdfLoading ? "Generating…" : "Download PDF"}
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* ── padded body ──────────────────────────────────────────────────── */}
        <div className="px-4 pb-6 space-y-6">

          {/* ── flow banner ──────────────────────────────────────────────────── */}
          <div className="flex items-stretch gap-3">
            <div className="flex-1 rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Sender
              </p>
              <p className="font-semibold text-foreground">{tx?.sender?.name ?? "—"}</p>
              <p className="text-sm font-mono text-muted-foreground mt-0.5">
                {tx?.sender?.account}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{tx?.sender?.institution}</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-1 shrink-0 px-2">
              <ArrowRight className="size-5 text-success" />
              <p className="text-sm font-bold text-foreground text-center">
                {tx ? formatAUD(tx.amount, tx.currency) : "—"}
              </p>
              {tx?.convertedAmountAUD && (
                <p className="text-[10px] text-muted-foreground text-center">
                  ≈ {formatAUD(tx.convertedAmountAUD)} AUD
                </p>
              )}
            </div>

            <div className="flex-1 rounded-lg border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Receiver
              </p>
              <p className="font-semibold text-foreground">{tx?.receiver?.name ?? "—"}</p>
              <p className="text-sm font-mono text-muted-foreground mt-0.5">
                {tx?.receiver?.account}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{tx?.receiver?.institution}</p>
            </div>
          </div>

          {/* ── two-column body ──────────────────────────────────────────────── */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* ── left (2 / 3) ─────────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Transaction Details */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Transaction Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between py-3 border-b border-border">
                    <span className="text-sm font-medium text-muted-foreground">Status</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={smeta.variant} className={smeta.cls + " capitalize"}>
                        {tx?.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {tx?.type}
                      </Badge>
                      {tx?.subtype && (
                        <Badge variant="outline" className="text-muted-foreground capitalize">
                          {tx.subtype}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <LabelValue label="Reference" value={tx?.reference} mono />
                  <LabelValue label="Narrative" value={tx?.narrative} />
                  <LabelValue label="Channel" value={tx?.channel} />
                  <LabelValue label="Purpose" value={tx?.purpose} />
                  <LabelValue label="Remittance Purpose Code" value={tx?.remittancePurposeCode} mono />
                  <LabelValue
                    label="Amount"
                    value={tx ? formatAUD(tx.amount, tx.currency) : null}
                  />
                  <LabelValue
                    label="Converted Amount (AUD)"
                    value={tx?.convertedAmountAUD ? formatAUD(tx.convertedAmountAUD) : null}
                  />
                  <LabelValue
                    label="Transaction Date"
                    value={tx?.timestamp ? dateShowFormatWithTime(tx.timestamp) : null}
                  />
                </CardContent>
              </Card>

              {/* Other Parties */}
              {(hasBeneficiary || hasIntermediary) && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg font-medium">Other Parties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <PartyBlock title="Beneficiary" party={tx?.beneficiary} />
                    <PartyBlock title="Intermediary" party={tx?.intermediary} />
                  </CardContent>
                </Card>
              )}

              {/* Risk Analysis — matches CustomerProfile.jsx */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Risk Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                  {/* gauge */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-muted-foreground">Overall Risk Level</p>
                      <span className={`text-sm font-semibold ${riskCls}`}>{riskLabel}</span>
                    </div>
                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div className="absolute inset-0 flex">
                        <div className="h-full w-1/3 bg-success/20" />
                        <div className="h-full w-1/3 bg-warning/20" />
                        <div className="h-full w-1/3 bg-destructive/20" />
                      </div>
                      <div
                        className="absolute top-0 h-full w-1 bg-foreground shadow-lg transition-all"
                        style={{ left: `${Math.min(riskScore, 99)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>

                  {/* risk score bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Risk Score</span>
                      <span className="text-sm font-semibold text-foreground">{riskScore}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full transition-all ${getRiskBarColor(riskScore)}`}
                        style={{ width: `${Math.min(riskScore, 100)}%` }}
                      />
                    </div>
                  </div>

                  {tx?.riskFlags?.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Risk Flags</p>
                        <div className="flex flex-wrap gap-2">
                          {tx.riskFlags.map((f) => (
                            <span
                              key={f}
                              className="rounded-md bg-destructive/10 border border-destructive/20 px-2 py-0.5 text-xs font-medium text-destructive"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {(tx?.forensic?.walletCluster || tx?.forensic?.chainalysisScore || tx?.forensic?.notes || tx?.metadata?.deviceId || tx?.metadata?.ip) && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-muted-foreground">Forensic Details</p>
                        <LabelValue label="Wallet Cluster" value={tx?.forensic?.walletCluster} mono />
                        <LabelValue label="Chainalysis Score" value={tx?.forensic?.chainalysisScore} />
                        <LabelValue label="Forensic Notes" value={tx?.forensic?.notes} />
                        <LabelValue label="Device ID" value={tx?.metadata?.deviceId} mono />
                        <LabelValue label="IP Address" value={tx?.metadata?.ip} mono />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Investigation */}
              {hasInvestigation && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning-foreground" />
                      <CardTitle className="text-lg font-medium">Investigation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LabelValue label="Case ID" value={tx?.investigation?.caseId} mono />
                    <div className="flex items-start justify-between py-3 border-b border-border last:border-0">
                      <span className="text-sm font-medium text-muted-foreground">Flagged</span>
                      <Badge
                        variant="outline"
                        className={tx?.investigation?.flagged
                          ? "border-destructive/30 bg-destructive/10 text-destructive"
                          : "border-border bg-muted/50 text-muted-foreground"}
                      >
                        {tx?.investigation?.flagged ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <LabelValue label="Investigator Notes" value={tx?.investigation?.investigatorNotes} />
                  </CardContent>
                </Card>
              )}

              {/* Travel Rule */}
              {hasTravelRule && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg font-medium">Travel Rule</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LabelValue label="Originator VASP ID" value={tx?.travelRule?.originatorVaspId} mono />
                    <LabelValue label="Originator VASP Name" value={tx?.travelRule?.originatorVaspName} />
                    <LabelValue label="Originator VASP Licence" value={tx?.travelRule?.originatorVaspLicense} />
                    <LabelValue label="Beneficiary VASP ID" value={tx?.travelRule?.beneficiaryVaspId} mono />
                    <LabelValue label="Beneficiary VASP Name" value={tx?.travelRule?.beneficiaryVaspName} />
                    <LabelValue label="Travel Message ID" value={tx?.travelRule?.travelMessageId} mono />
                    <LabelValue label="Protocol" value={tx?.travelRule?.protocol} />
                  </CardContent>
                </Card>
              )}

              {/* Crypto */}
              {hasCrypto && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg font-medium">Crypto</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LabelValue label="Wallet Address" value={tx?.crypto?.walletAddress} mono />
                    <LabelValue label="Tx Hash" value={tx?.crypto?.txHash} mono />
                    <LabelValue label="Network" value={tx?.crypto?.network} />
                    <LabelValue label="Hops" value={tx?.crypto?.hops} />
                    <LabelValue label="Cluster" value={tx?.crypto?.cluster} mono />
                  </CardContent>
                </Card>
              )}

              {/* Bullion */}
              {hasBullion && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg font-medium">Bullion</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <LabelValue label="Type" value={tx?.bullion?.type} />
                    <LabelValue label="Purity" value={tx?.bullion?.purity} />
                    <LabelValue label="Weight" value={tx?.bullion?.weight ? `${tx.bullion.weight} g` : null} />
                  </CardContent>
                </Card>
              )}

              {/* KYC Profile */}
              <KycProfile tx={tx} />
            </div>

            {/* ── right sidebar (1 / 3) ─────────────────────────────────────── */}
            <div className="space-y-6">

              {/* Record */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Record</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-lg bg-muted/50 border border-border p-4 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Transaction UID</p>
                    <p className="font-mono text-xs text-foreground break-all">{tx?.uid ?? "—"}</p>
                  </div>



                  <Separator />

                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground">Transaction Date</p>
                      <p className="text-sm text-foreground">
                        {tx?.timestamp ? dateShowFormatWithTime(tx.timestamp) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground">Created At</p>
                      <p className="text-sm text-foreground">
                        {tx?.createdAt ? dateShowFormatWithTime(tx.createdAt) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-medium text-muted-foreground">Updated At</p>
                      <p className="text-sm text-foreground">
                        {tx?.updatedAt ? dateShowFormatWithTime(tx.updatedAt) : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Organisation */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg font-medium">Organisation</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <IconRow
                    icon={Building2}
                    label="Client"
                    value={tx?.client?.name ?? (typeof tx?.client === "string" ? tx.client : null)}
                  />
                  <IconRow
                    icon={Building2}
                    label="Branch"
                    value={tx?.branch?.name ?? (typeof tx?.branch === "string" ? tx.branch : null)}
                  />
                  <IconRow
                    icon={User}
                    label="Created By"
                    value={tx?.createdBy?.name ?? tx?.createdBy?.email ?? null}
                  />
                </CardContent>
              </Card>

              {/* Related Party */}
              {hasRelated && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg font-medium">Related Party</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 space-y-0.5">
                        <p className="text-xs font-medium text-muted-foreground">Flagged</p>
                        <Badge
                          variant="outline"
                          className={tx?.relatedPartyFlag
                            ? "h-6 border-destructive/30 bg-destructive/10 text-destructive"
                            : "h-6 border-border bg-muted/50 text-muted-foreground"}
                        >
                          {tx?.relatedPartyFlag ? "Yes" : "No"}
                        </Badge>
                      </div>
                    </div>
                    <IconRow icon={Link2} label="Related Txn ID" value={tx?.relatedPartyTxnId || null} />
                  </CardContent>
                </Card>
              )}

              {/* Workflow History */}
              {hasWorkflow && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <CardTitle className="text-lg font-medium">Workflow History</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {tx.metadata.workflowHistory.map((h, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-border bg-card p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {h.action?.replace(/_/g, " ")}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground shrink-0">
                            {h.timestamp ? dateShowFormatWithTime(h.timestamp) : ""}
                          </span>
                        </div>
                        {h.fromStatus && (
                          <p className="text-xs text-muted-foreground">
                            {h.fromStatus}
                            <ArrowRight className="inline size-3 mx-1" />
                            {h.toStatus}
                          </p>
                        )}
                        {h.notes && (
                          <p className="text-xs text-foreground">{h.notes}</p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

            </div>
          </div>

        </div>{/* end padded body */}
      </SheetContent>
    </Sheet>
  );
};

export default TransactionDetailView;
