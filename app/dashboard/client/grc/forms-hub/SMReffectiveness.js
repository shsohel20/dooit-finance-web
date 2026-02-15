"use client";

import React from "react";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Filter,
  Target,
  ClipboardList,
  Search,
  CheckCircle2,
  Shuffle,
  X,
  ArrowLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  FlaskConical,
  Loader2,
  CircleAlert,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";

const SMR_REGISTER = [
  {
    id: "smr-001",
    referenceNo: "SMR-2025-0012",
    filingDate: "2025-01-15",
    customerName: "Al Farooq Trading LLC",
    customerId: "CUST-4421",
    riskLevel: "High",
    suspicionType: "Structuring",
    suspicionNarrative:
      "Multiple cash deposits just below the reporting threshold over a 10-day period, totalling AED 245,000. Transactions appear structured to avoid detection.",
    transactionValue: 245000,
    transactionCurrency: "AED",
    originatingAccount: "AE07 0331 0000 1234 5678 901",
    beneficiaryAccount: "AE45 0261 0000 9876 5432 100",
    filedBy: "Omar Hassan",
    department: "Compliance - Branch Operations",
    status: "Open",
  },
  {
    id: "smr-002",
    referenceNo: "SMR-2025-0034",
    filingDate: "2025-02-03",
    customerName: "Noor Holdings Ltd",
    customerId: "CUST-7788",
    riskLevel: "Medium",
    suspicionType: "Unusual cash activity",
    suspicionNarrative:
      "Significant cash withdrawals inconsistent with the stated business profile of a consulting firm. No clear business rationale provided.",
    transactionValue: 87500,
    transactionCurrency: "AED",
    originatingAccount: "AE12 0440 0000 5566 7788 001",
    beneficiaryAccount: "N/A - Cash withdrawal",
    filedBy: "Aisha Khalid",
    department: "AML Monitoring",
    status: "Closed",
  },
  {
    id: "smr-003",
    referenceNo: "SMR-2025-0051",
    filingDate: "2025-02-18",
    customerName: "Rashid & Sons Exports",
    customerId: "CUST-2210",
    riskLevel: "High",
    suspicionType: "Trade-based laundering",
    suspicionNarrative:
      "Over-invoicing identified on multiple trade finance transactions. Goods declared at 3x market value with discrepancies in shipping documents.",
    transactionValue: 520000,
    transactionCurrency: "AED",
    originatingAccount: "AE88 0150 0000 3344 5566 001",
    beneficiaryAccount: "GB29 NWBK 6016 1331 9268 19",
    filedBy: "Tariq Saleem",
    department: "Trade Finance Compliance",
    status: "Under Review",
  },
  {
    id: "smr-004",
    referenceNo: "SMR-2025-0067",
    filingDate: "2025-03-05",
    customerName: "Yasmin Al Qasim",
    customerId: "CUST-9102",
    riskLevel: "Low",
    suspicionType: "Unusual wire transfer",
    suspicionNarrative:
      "First-time international wire transfer to a high-risk jurisdiction with no prior transaction history. Customer could not adequately explain the purpose.",
    transactionValue: 32000,
    transactionCurrency: "AED",
    originatingAccount: "AE55 0230 0000 1122 3344 001",
    beneficiaryAccount: "MM0201 0001 0000 0060 1231 78",
    filedBy: "Nadia Youssef",
    department: "Retail Banking Compliance",
    status: "Open",
  },
  {
    id: "smr-005",
    referenceNo: "SMR-2025-0089",
    filingDate: "2025-03-22",
    customerName: "Golden Crescent Finance",
    customerId: "CUST-3056",
    riskLevel: "High",
    suspicionType: "Shell company activity",
    suspicionNarrative:
      "Company has no physical office, minimal employees, yet processes high-value transactions. Beneficial ownership is layered through multiple offshore entities.",
    transactionValue: 1200000,
    transactionCurrency: "AED",
    originatingAccount: "AE67 0350 0000 7788 9900 001",
    beneficiaryAccount: "VG96 VPVG 0000 0123 4567 8901",
    filedBy: "Khalid Mansour",
    department: "Corporate Banking Compliance",
    status: "Open",
  },
  {
    id: "smr-006",
    referenceNo: "SMR-2025-0102",
    filingDate: "2025-04-01",
    customerName: "Zayed Construction Co",
    customerId: "CUST-5540",
    riskLevel: "Medium",
    suspicionType: "Layering",
    suspicionNarrative:
      "Funds received from an overseas entity are rapidly moved through multiple domestic accounts before being transferred out. Pattern consistent with layering.",
    transactionValue: 175000,
    transactionCurrency: "AED",
    originatingAccount: "AE23 0260 0000 4455 6677 001",
    beneficiaryAccount: "AE90 0440 0000 8899 0011 001",
    filedBy: "Sara Ahmed",
    department: "Transaction Monitoring",
    status: "Closed",
  },
  {
    id: "smr-007",
    referenceNo: "SMR-2025-0118",
    filingDate: "2025-04-14",
    customerName: "Khalil Mahmoud Ibrahim",
    customerId: "CUST-8814",
    riskLevel: "Low",
    suspicionType: "Rapid fund movement",
    suspicionNarrative:
      "Funds deposited and immediately transferred out within the same business day on multiple occasions. Customer profile does not support such activity.",
    transactionValue: 48000,
    transactionCurrency: "AED",
    originatingAccount: "AE34 0110 0000 2233 4455 001",
    beneficiaryAccount: "AE78 0330 0000 6677 8899 001",
    filedBy: "Omar Hassan",
    department: "Compliance - Branch Operations",
    status: "Under Review",
  },
  {
    id: "smr-008",
    referenceNo: "SMR-2025-0134",
    filingDate: "2025-05-02",
    customerName: "Emirates Star General Trading",
    customerId: "CUST-1177",
    riskLevel: "High",
    suspicionType: "Structuring",
    suspicionNarrative:
      "Series of cash deposits across 4 branches, each just under the reporting threshold. Total aggregated amount of AED 310,000 within a 7-day window.",
    transactionValue: 310000,
    transactionCurrency: "AED",
    originatingAccount: "AE56 0150 0000 9988 7766 001",
    beneficiaryAccount: "AE12 0260 0000 5544 3322 001",
    filedBy: "Tariq Saleem",
    department: "AML Monitoring",
    status: "Open",
  },
  {
    id: "smr-009",
    referenceNo: "SMR-2025-0156",
    filingDate: "2025-05-19",
    customerName: "Fatima Bint Saleh",
    customerId: "CUST-6633",
    riskLevel: "Medium",
    suspicionType: "Smurfing",
    suspicionNarrative:
      "Multiple third parties depositing small cash amounts into the same account. Depositors appear unrelated and unable to explain their connection to the account holder.",
    transactionValue: 95000,
    transactionCurrency: "AED",
    originatingAccount: "Various third-party deposits",
    beneficiaryAccount: "AE45 0230 0000 7766 5544 001",
    filedBy: "Aisha Khalid",
    department: "Retail Banking Compliance",
    status: "Closed",
  },
  {
    id: "smr-010",
    referenceNo: "SMR-2025-0171",
    filingDate: "2025-06-08",
    customerName: "Al Jazeera Metals Corp",
    customerId: "CUST-4290",
    riskLevel: "High",
    suspicionType: "Trade-based laundering",
    suspicionNarrative:
      "Significant discrepancies between declared goods (precious metals) and actual shipment documents. Invoices appear fraudulent with inflated quantities.",
    transactionValue: 780000,
    transactionCurrency: "AED",
    originatingAccount: "AE89 0350 0000 1234 0000 001",
    beneficiaryAccount: "CH93 0076 2011 6238 5295 7",
    filedBy: "Khalid Mansour",
    department: "Trade Finance Compliance",
    status: "Open",
  },
  {
    id: "smr-011",
    referenceNo: "SMR-2025-0189",
    filingDate: "2025-06-25",
    customerName: "Hamdan Real Estate Group",
    customerId: "CUST-3378",
    riskLevel: "Medium",
    suspicionType: "Unusual cash activity",
    suspicionNarrative:
      "Large cash deposits cited as 'rental income' but amounts are inconsistent with the declared property portfolio. Source of funds documentation is insufficient.",
    transactionValue: 62000,
    transactionCurrency: "AED",
    originatingAccount: "AE67 0440 0000 3322 1100 001",
    beneficiaryAccount: "N/A - Deposited to own account",
    filedBy: "Sara Ahmed",
    department: "Transaction Monitoring",
    status: "Under Review",
  },
  {
    id: "smr-012",
    referenceNo: "SMR-2025-0203",
    filingDate: "2025-07-11",
    customerName: "Sharjah Pearl Imports",
    customerId: "CUST-7745",
    riskLevel: "Low",
    suspicionType: "Unusual wire transfer",
    suspicionNarrative:
      "Wire transfer to a newly opened account in a high-risk jurisdiction. The beneficiary entity was incorporated only 2 weeks prior to the transfer.",
    transactionValue: 28000,
    transactionCurrency: "AED",
    originatingAccount: "AE90 0110 0000 8877 6655 001",
    beneficiaryAccount: "KY01 0012 0000 0000 0012 3456",
    filedBy: "Nadia Youssef",
    department: "Retail Banking Compliance",
    status: "Closed",
  },
];

// --- Helpers ---

const RISK_COLORS = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  Low: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const STATUS_COLORS = {
  Open: "bg-blue-100 text-blue-800 border-blue-200",
  Closed: "bg-zinc-100 text-zinc-700 border-zinc-200",
  "Under Review": "bg-violet-100 text-violet-800 border-violet-200",
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 0,
  }).format(value);
}

function shuffleAndPick(arr, count) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// --- Review Focus types ---

const REVIEW_AREAS = [
  { id: "rationale", label: "Rationale for suspicion" },
  { id: "timeliness", label: "Timeliness of filing" },
  { id: "accuracy", label: "Accuracy of information" },
  { id: "regulatory", label: "Regulatory alignment" },
];

function generateTestResult(record) {
  const seed = record.transactionValue % 100;
  const completeness = {
    score: seed > 60 ? 95 : seed > 30 ? 78 : 55,
    details:
      seed > 60
        ? "All mandatory fields populated. Customer identification documents verified."
        : seed > 30
          ? "Most fields populated. Customer ID verification partially complete."
          : "Missing beneficiary details and supporting documentation.",
  };
  const timeliness = {
    score: record.riskLevel === "High" ? (seed > 50 ? 90 : 65) : seed > 40 ? 92 : 80,
    details:
      record.riskLevel === "High" && seed <= 50
        ? "Filing delayed by 3 business days beyond the internal threshold for high-risk cases."
        : "Filed within acceptable timeframe per internal policy.",
  };
  const narrative = {
    score: record.suspicionNarrative.length > 150 ? 88 : 62,
    details:
      record.suspicionNarrative.length > 150
        ? "Narrative is detailed and clearly articulates the basis for suspicion."
        : "Narrative lacks sufficient detail. Recommend expanding on behavioral indicators.",
  };
  const regulatory = {
    score: record.status === "Closed" ? 92 : seed > 40 ? 85 : 70,
    details:
      record.status === "Closed"
        ? "All regulatory requirements met. Proper closure documentation in place."
        : seed > 40
          ? "Aligned with regulatory requirements. Minor documentation gaps noted."
          : "Regulatory alignment concerns identified. Missing mandatory disclosures.",
  };
  const overallScore = Math.round(
    (completeness.score + timeliness.score + narrative.score + regulatory.score) / 4,
  );
  const flags = [];
  if (completeness.score < 70) flags.push("Incomplete documentation");
  if (timeliness.score < 75) flags.push("Filing timeliness concern");
  if (narrative.score < 70) flags.push("Insufficient narrative detail");
  if (regulatory.score < 75) flags.push("Regulatory alignment gap");
  if (record.riskLevel === "High" && overallScore < 80)
    flags.push("High-risk case below threshold");
  return { completeness, timeliness, narrative, regulatory, overallScore, flags };
}

const INITIAL_FORM = {
  periodFrom: "",
  periodTo: "",
  totalSmrs: String(SMR_REGISTER.length),
  registerSource: "",
  selectionMethod: "",
  methodReason: "",
  suspicionReason: "",
  timePeriodFrom: "",
  timePeriodTo: "",
  customerRiskLevel: "",
  transactionThreshold: "",
  numberOfSmrs: "",
  dateOfSelection: "",
  selectedBy: "",
  overallOutcome: "",
  overallRemarks: "",
};

// --- Component ---

export default function SmrSelectionForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedSmrIds, setSelectedSmrIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  // Per-SMR reviews: { [smrId]: SmrReview }
  const [smrReviews, setSmrReviews] = useState({});
  // Which SMR detail is currently open (null = none)
  const [activeSmrId, setActiveSmrId] = useState(null);
  // Test results per SMR
  const [testResults, setTestResults] = useState({});
  // Currently running test animation
  const [testingSmrId, setTestingSmrId] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // --- Per-SMR review helpers ---
  const getReview = (id) =>
    smrReviews[id] || { reviewAreas: [], reviewOutcome: "", reviewNotes: "" };

  const updateReview = (id, patch) => {
    setSmrReviews((prev) => ({
      ...prev,
      [id]: { ...getReview(id), ...patch },
    }));
  };

  const toggleReviewArea = (smrId, area) => {
    const current = getReview(smrId);
    const areas = current.reviewAreas.includes(area)
      ? current.reviewAreas.filter((a) => a !== area)
      : [...current.reviewAreas, area];
    updateReview(smrId, { reviewAreas: areas });
  };

  const isSmrReviewed = (id) => {
    const review = smrReviews[id];
    return !!(review && review.reviewOutcome && review.reviewAreas.length > 0 && testResults[id]);
  };

  const allSmrsReviewed =
    selectedSmrIds.length > 0 && selectedSmrIds.every((id) => isSmrReviewed(id));
  const reviewedCount = selectedSmrIds.filter((id) => isSmrReviewed(id)).length;

  // --- Selection helpers ---

  const runTest = (smrId) => {
    const record = SMR_REGISTER.find((r) => r.id === smrId);
    setTestingSmrId(smrId);
    setTimeout(() => {
      const result = generateTestResult(record);
      setTestResults((prev) => ({ ...prev, [smrId]: result }));
      setTestingSmrId(null);
    }, 1500);
  };

  const handleMethodChange = (value) => {
    updateField("selectionMethod", value);
    setSelectedSmrIds([]);
    setSmrReviews({});
    setTestResults({});
    setActiveSmrId(null);
  };

  const handleRandomSelect = useCallback(() => {
    const count = Number(formData.numberOfSmrs) || 5;
    const picked = shuffleAndPick(SMR_REGISTER, count);
    setSelectedSmrIds(picked.map((r) => r.id));
    setSmrReviews({});
    setActiveSmrId(null);
  }, [formData.numberOfSmrs]);

  const toggleSmr = (id) => {
    setSelectedSmrIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const removeSmr = (id) => {
    setSelectedSmrIds((prev) => prev.filter((x) => x !== id));
    setSmrReviews((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeSmrId === id) setActiveSmrId(null);
  };

  const selectedRecords = SMR_REGISTER.filter((r) => selectedSmrIds.includes(r.id));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setSelectedSmrIds([]);
    setSmrReviews({});
    setTestResults({});
    setActiveSmrId(null);
    setSubmitted(false);
  };

  const showTargetedCriteria =
    formData.selectionMethod === "targeted" || formData.selectionMethod === "mixed";

  const isRandom = formData.selectionMethod === "random";
  const isTargeted = formData.selectionMethod === "targeted";
  const isMixed = formData.selectionMethod === "mixed";

  const methodLabel =
    formData.selectionMethod === "random"
      ? "Random"
      : formData.selectionMethod === "targeted"
        ? "Targeted"
        : formData.selectionMethod === "mixed"
          ? "Mixed"
          : "N/A";

  const totalSelectedValue = selectedRecords.reduce((sum, r) => sum + r.transactionValue, 0);

  // =============================================
  // SMR Detail / Review View
  // =============================================
  if (activeSmrId) {
    const record = SMR_REGISTER.find((r) => r.id === activeSmrId);
    const review = getReview(activeSmrId);

    return (
      <div className="space-y-6">
        {/* Back button */}
        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveSmrId(null)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Form
        </Button>

        {/* SMR Detail Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {record.referenceNo}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">{record.customerName}</p>
              </div>
              <div className="flex gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${RISK_COLORS[record.riskLevel]}`}
                >
                  {record.riskLevel} Risk
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[record.status]}`}
                >
                  {record.status}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Details grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label="Customer ID" value={record.customerId} />
              <DetailField label="Filing Date" value={record.filingDate} />
              <DetailField label="Suspicion Type" value={record.suspicionType} />
              <DetailField
                label="Transaction Value"
                value={`${formatCurrency(record.transactionValue)} ${record.transactionCurrency}`}
              />
              <DetailField label="Originating Account" value={record.originatingAccount} />
              <DetailField label="Beneficiary Account" value={record.beneficiaryAccount} />
              <DetailField label="Filed By" value={record.filedBy} />
              <DetailField label="Department" value={record.department} />
            </div>
            <Separator />
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Suspicion Narrative</p>
              <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed text-foreground">
                {record.suspicionNarrative}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Review Areas Selection */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Search className="h-5 w-5 text-primary" />
              Review Focus for {record.referenceNo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Label>Areas to Review</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {REVIEW_AREAS.map((area) => (
                  <div key={area.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`${activeSmrId}-${area.id}`}
                      checked={review.reviewAreas.includes(area.id)}
                      onCheckedChange={() => toggleReviewArea(activeSmrId, area.id)}
                      disabled={!!testResults[activeSmrId]}
                    />
                    <Label
                      htmlFor={`${activeSmrId}-${area.id}`}
                      className="cursor-pointer font-normal"
                    >
                      {area.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Test Button */}
            {!testResults[activeSmrId] && (
              <>
                <Separator />
                <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6">
                  <FlaskConical className="h-8 w-8 text-primary/60" />
                  <p className="text-center text-sm text-muted-foreground">
                    Select the review areas above, then run the compliance test to generate results.
                  </p>
                  <Button
                    type="button"
                    onClick={() => runTest(activeSmrId)}
                    disabled={review.reviewAreas.length === 0 || testingSmrId === activeSmrId}
                    className="gap-2"
                  >
                    {testingSmrId === activeSmrId ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Running Test...
                      </>
                    ) : (
                      <>
                        <FlaskConical className="h-4 w-4" />
                        Run Compliance Test
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Test Results */}
            {testResults[activeSmrId] && (
              <>
                <Separator />
                {(() => {
                  const result = testResults[activeSmrId];
                  const scoreColor =
                    result.overallScore >= 85
                      ? "text-emerald-700 bg-emerald-100"
                      : result.overallScore >= 70
                        ? "text-amber-700 bg-amber-100"
                        : "text-red-700 bg-red-100";
                  const scoreBarColor =
                    result.overallScore >= 85
                      ? "bg-emerald-500"
                      : result.overallScore >= 70
                        ? "bg-amber-500"
                        : "bg-red-500";
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-foreground">Test Results</h3>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${scoreColor}`}
                        >
                          {result.overallScore >= 85 ? (
                            <CircleCheck className="h-4 w-4" />
                          ) : result.overallScore >= 70 ? (
                            <TriangleAlert className="h-4 w-4" />
                          ) : (
                            <CircleAlert className="h-4 w-4" />
                          )}
                          {result.overallScore}%
                        </span>
                      </div>

                      {/* Overall score bar */}
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${scoreBarColor}`}
                          style={{ width: `${result.overallScore}%` }}
                        />
                      </div>

                      {/* Flags */}
                      {result.flags.length > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                          <p className="mb-1.5 text-xs font-semibold text-red-800">
                            Flags Identified
                          </p>
                          <ul className="space-y-1">
                            {result.flags.map((flag) => (
                              <li
                                key={flag}
                                className="flex items-center gap-2 text-sm text-red-700"
                              >
                                <CircleAlert className="h-3.5 w-3.5 shrink-0" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Category breakdown */}
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                          {
                            key: "completeness",
                            label: "Documentation Completeness",
                            data: result.completeness,
                          },
                          {
                            key: "timeliness",
                            label: "Filing Timeliness",
                            data: result.timeliness,
                          },
                          { key: "narrative", label: "Narrative Quality", data: result.narrative },
                          {
                            key: "regulatory",
                            label: "Regulatory Alignment",
                            data: result.regulatory,
                          },
                        ].map((cat) => {
                          const catColor =
                            cat.data.score >= 85
                              ? "bg-emerald-500"
                              : cat.data.score >= 70
                                ? "bg-amber-500"
                                : "bg-red-500";
                          const catText =
                            cat.data.score >= 85
                              ? "text-emerald-700"
                              : cat.data.score >= 70
                                ? "text-amber-700"
                                : "text-red-700";
                          return (
                            <div key={cat.key} className="rounded-lg border bg-card p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-semibold text-foreground">{cat.label}</p>
                                <span className={`text-xs font-bold ${catText}`}>
                                  {cat.data.score}%
                                </span>
                              </div>
                              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                                <div
                                  className={`h-full rounded-full ${catColor}`}
                                  style={{ width: `${cat.data.score}%` }}
                                />
                              </div>
                              <p className="text-xs leading-relaxed text-muted-foreground">
                                {cat.data.details}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Review Outcome - only visible after test */}
                <Separator />
                <div className="space-y-3">
                  <Label>Review Outcome</Label>
                  <p className="text-xs text-muted-foreground">
                    Based on the test results above, select the appropriate outcome for this SMR.
                  </p>
                  <RadioGroup
                    value={review.reviewOutcome}
                    onValueChange={(value) => updateReview(activeSmrId, { reviewOutcome: value })}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="satisfactory"
                        id={`${activeSmrId}-outcome-satisfactory`}
                      />
                      <Label
                        htmlFor={`${activeSmrId}-outcome-satisfactory`}
                        className="cursor-pointer font-normal"
                      >
                        Satisfactory
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="issues" id={`${activeSmrId}-outcome-issues`} />
                      <Label
                        htmlFor={`${activeSmrId}-outcome-issues`}
                        className="cursor-pointer font-normal"
                      >
                        Issues Identified
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="escalation" id={`${activeSmrId}-outcome-escalation`} />
                      <Label
                        htmlFor={`${activeSmrId}-outcome-escalation`}
                        className="cursor-pointer font-normal"
                      >
                        Requires Escalation
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor={`${activeSmrId}-notes`}>Review Notes</Label>
                  <Textarea
                    id={`${activeSmrId}-notes`}
                    placeholder="Add any observations, findings, or notes for this SMR..."
                    rows={3}
                    value={review.reviewNotes}
                    onChange={(e) => updateReview(activeSmrId, { reviewNotes: e.target.value })}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation between SMRs */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveSmrId(null)}
            className="gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
          {(() => {
            const currentIndex = selectedSmrIds.indexOf(activeSmrId);
            const nextId = selectedSmrIds[currentIndex + 1];
            if (nextId) {
              return (
                <Button
                  type="button"
                  onClick={() => {
                    setActiveSmrId(nextId);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="gap-2"
                >
                  Next SMR
                  <ChevronRight className="h-4 w-4" />
                </Button>
              );
            }
            return (
              <Button
                type="button"
                onClick={() => {
                  setActiveSmrId(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="gap-2"
              >
                Done Reviewing
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            );
          })()}
        </div>
      </div>
    );
  }

  // =============================================
  // Submitted Confirmation View
  // =============================================
  if (submitted) {
    return (
      <div className="space-y-6">
        {/* Success banner */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-900">Form Submitted Successfully</h2>
            <p className="max-w-md text-sm text-emerald-700">
              Your SMR selection compliance form has been recorded. Below is a summary of the
              submitted information for your records.
            </p>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <FileText className="h-5 w-5 text-primary" />
              Submission Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                SMR Register Population
              </h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <SummaryField
                  label="Reporting Period"
                  value={`${formData.periodFrom || "N/A"} to ${formData.periodTo || "N/A"}`}
                />
                <SummaryField label="Total SMRs in Register" value={formData.totalSmrs} />
                <SummaryField label="Register Source" value={formData.registerSource || "N/A"} />
              </dl>
            </div>
            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Selection Method</h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <SummaryField label="Method" value={methodLabel} />
                <SummaryField label="Reason" value={formData.methodReason || "N/A"} span2 />
              </dl>
            </div>
            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Sample Details</h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                <SummaryField label="SMRs Selected" value={String(selectedSmrIds.length)} />
                <SummaryField label="Date of Selection" value={formData.dateOfSelection || "N/A"} />
                <SummaryField label="Selected By" value={formData.selectedBy || "N/A"} />
              </dl>
            </div>
            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">Overall Review Outcome</h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <SummaryField
                  label="Outcome"
                  value={
                    formData.overallOutcome === "satisfactory"
                      ? "Satisfactory"
                      : formData.overallOutcome === "issues"
                        ? "Issues Identified"
                        : formData.overallOutcome === "escalation"
                          ? "Requires Escalation"
                          : "N/A"
                  }
                />
                <SummaryField label="Remarks" value={formData.overallRemarks || "N/A"} span2 />
              </dl>
            </div>
          </CardContent>
        </Card>

        {/* Per-SMR Review Results */}
        {selectedRecords.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ClipboardList className="h-5 w-5 text-primary" />
                Individual SMR Review Results ({selectedRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedRecords.map((record) => {
                const review = getReview(record.id);
                const areaLabels = REVIEW_AREAS.filter((a) =>
                  review.reviewAreas.includes(a.id),
                ).map((a) => a.label);

                return (
                  <div key={record.id} className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{record.referenceNo}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.customerName} &middot; {formatCurrency(record.transactionValue)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_COLORS[record.riskLevel]}`}
                        >
                          {record.riskLevel}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                            review.reviewOutcome === "satisfactory"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : review.reviewOutcome === "issues"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : review.reviewOutcome === "escalation"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-zinc-100 text-zinc-700 border-zinc-200"
                          }`}
                        >
                          {review.reviewOutcome === "satisfactory"
                            ? "Satisfactory"
                            : review.reviewOutcome === "issues"
                              ? "Issues Identified"
                              : review.reviewOutcome === "escalation"
                                ? "Requires Escalation"
                                : "Not Reviewed"}
                        </span>
                      </div>
                    </div>
                    <dl className="grid grid-cols-1 gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                      <div className="flex justify-between sm:flex-col">
                        <dt className="text-muted-foreground">Areas Reviewed</dt>
                        <dd className="font-medium text-foreground">
                          {areaLabels.length > 0 ? areaLabels.join(", ") : "None"}
                        </dd>
                      </div>
                      {testResults[record.id] && (
                        <div className="flex justify-between sm:flex-col">
                          <dt className="text-muted-foreground">Test Score</dt>
                          <dd
                            className={`font-semibold ${
                              testResults[record.id].overallScore >= 85
                                ? "text-emerald-700"
                                : testResults[record.id].overallScore >= 70
                                  ? "text-amber-700"
                                  : "text-red-700"
                            }`}
                          >
                            {testResults[record.id].overallScore}%
                            {testResults[record.id].flags.length > 0 && (
                              <span className="ml-1 font-normal text-muted-foreground">
                                ({testResults[record.id].flags.length} flag
                                {testResults[record.id].flags.length !== 1 ? "s" : ""})
                              </span>
                            )}
                          </dd>
                        </div>
                      )}
                      {review.reviewNotes && (
                        <div className="flex justify-between sm:flex-col sm:col-span-2">
                          <dt className="text-muted-foreground">Notes</dt>
                          <dd className="font-medium text-foreground">{review.reviewNotes}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                );
              })}
              <div className="mt-3 flex justify-end text-sm text-muted-foreground">
                Total selected value:{" "}
                <span className="ml-1 font-medium text-foreground">
                  {formatCurrency(totalSelectedValue)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full bg-transparent sm:w-auto"
          >
            Submit Another Form
          </Button>
          <Button onClick={() => window.print()} className="w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            Print / Save as PDF
          </Button>
        </div>
      </div>
    );
  }

  // =============================================
  // Main Form View
  // =============================================
  return (
    <form onSubmit={handleSubmit} className="space-y-6  ">
      {/* Section 1: SMR Register Population */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            <span>1. SMR Register Population</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="periodFrom">Reporting Period From</Label>
              <Input
                id="periodFrom"
                type="date"
                value={formData.periodFrom}
                onChange={(e) => updateField("periodFrom", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="periodTo">Reporting Period To</Label>
              <Input
                id="periodTo"
                type="date"
                value={formData.periodTo}
                onChange={(e) => updateField("periodTo", e.target.value)}
                required
              />
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="totalSmrs">Total Number of SMRs in Register</Label>
              <Input
                id="totalSmrs"
                type="number"
                min="0"
                value={formData.totalSmrs}
                readOnly
                required
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="registerSource">Source of Register (System / Report Name)</Label>
              <Input
                id="registerSource"
                type="text"
                placeholder="e.g. AML Monitoring System"
                value={formData.registerSource}
                onChange={(e) => updateField("registerSource", e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Selection Method */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Filter className="h-5 w-5 text-primary" />
            <span>2. Selection Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Selection Method</Label>
            <RadioGroup
              value={formData.selectionMethod}
              onValueChange={handleMethodChange}
              className="flex flex-wrap gap-4"
            >
              {[
                { value: "random", label: "Random" },
                { value: "targeted", label: "Targeted" },
                { value: "mixed", label: "Mixed" },
              ].map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroupItem value={option.value} id={`method-${option.value}`} />
                  <Label htmlFor={`method-${option.value}`} className="cursor-pointer font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="methodReason">Reason for Choosing This Method</Label>
            <Textarea
              id="methodReason"
              placeholder="Describe the rationale for the chosen selection method..."
              rows={3}
              value={formData.methodReason}
              onChange={(e) => updateField("methodReason", e.target.value)}
              required
            />
          </div>

          {/* Random: count input + generate button */}
          {isRandom && (
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Specify how many SMRs to randomly select from the register, then click the button
                below.
              </p>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
                <div className="w-full space-y-2 sm:w-40">
                  <Label htmlFor="randomCount">Number to Select</Label>
                  <Input
                    id="randomCount"
                    type="number"
                    min="1"
                    max={SMR_REGISTER.length}
                    placeholder="e.g. 5"
                    value={formData.numberOfSmrs}
                    onChange={(e) => updateField("numberOfSmrs", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRandomSelect}
                  disabled={!formData.numberOfSmrs}
                  className="bg-transparent"
                >
                  <Shuffle className="mr-2 h-4 w-4" />
                  Pick Randomly
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Selection Criteria (conditional) */}
      {showTargetedCriteria && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Target className="h-5 w-5 text-primary" />
              <span>3. Selection Criteria (Targeted)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="suspicionReason">Suspicion Reason / Typology</Label>
              <Textarea
                id="suspicionReason"
                placeholder="e.g. Structuring, Unusual cash activity, Trade-based laundering..."
                rows={2}
                value={formData.suspicionReason}
                onChange={(e) => updateField("suspicionReason", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timePeriodFrom">Time Period From (Filing Dates)</Label>
                <Input
                  id="timePeriodFrom"
                  type="date"
                  value={formData.timePeriodFrom}
                  onChange={(e) => updateField("timePeriodFrom", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timePeriodTo">Time Period To (Filing Dates)</Label>
                <Input
                  id="timePeriodTo"
                  type="date"
                  value={formData.timePeriodTo}
                  onChange={(e) => updateField("timePeriodTo", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="customerRiskLevel">Customer Risk Level</Label>
                <Select
                  value={formData.customerRiskLevel}
                  onValueChange={(value) => updateField("customerRiskLevel", value)}
                >
                  <SelectTrigger id="customerRiskLevel">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transactionThreshold">Transaction Value Threshold</Label>
                <Input
                  id="transactionThreshold"
                  type="text"
                  placeholder="e.g. > 50,000"
                  value={formData.transactionThreshold}
                  onChange={(e) => updateField("transactionThreshold", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section: SMR Register */}
      {formData.selectionMethod && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span>
                {showTargetedCriteria ? "4" : "3"}. SMR Register
                {isRandom && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (auto-selected)
                  </span>
                )}
                {(isTargeted || isMixed) && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    (select from list below)
                  </span>
                )}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected summary badges */}
            {selectedSmrIds.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Selected ({selectedSmrIds.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedRecords.map((r) => (
                    <Badge key={r.id} variant="secondary" className="gap-1.5 pr-1.5">
                      {r.referenceNo}
                      <button
                        type="button"
                        onClick={() => removeSmr(r.id)}
                        className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10"
                        aria-label={`Remove ${r.referenceNo}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Table of all SMRs */}
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {(isTargeted || isMixed) && (
                      <TableHead className="w-10">
                        <span className="sr-only">Select</span>
                      </TableHead>
                    )}
                    <TableHead>Ref No.</TableHead>
                    <TableHead>Filing Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Suspicion Type</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SMR_REGISTER.map((record) => {
                    const isSelected = selectedSmrIds.includes(record.id);
                    return (
                      <TableRow
                        key={record.id}
                        data-state={isSelected ? "selected" : undefined}
                        className={isSelected ? "bg-primary/5" : ""}
                      >
                        {(isTargeted || isMixed) && (
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleSmr(record.id)}
                              aria-label={`Select ${record.referenceNo}`}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{record.referenceNo}</TableCell>
                        <TableCell className="tabular-nums">{record.filingDate}</TableCell>
                        <TableCell>{record.customerName}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_COLORS[record.riskLevel]}`}
                          >
                            {record.riskLevel}
                          </span>
                        </TableCell>
                        <TableCell>{record.suspicionType}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(record.transactionValue)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[record.status]}`}
                          >
                            {record.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {isRandom && selectedSmrIds.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Use the &quot;Pick Randomly&quot; button above to auto-select SMRs.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Section: Sample Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <ClipboardList className="h-5 w-5 text-primary" />
            <span>
              {showTargetedCriteria ? "5" : formData.selectionMethod ? "4" : "3"}. Sample Details
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="numberOfSmrs">Number of SMRs Selected</Label>
              <Input
                id="numberOfSmrs"
                type="number"
                min="1"
                value={
                  isTargeted || isMixed ? String(selectedSmrIds.length) : formData.numberOfSmrs
                }
                readOnly={isTargeted || isMixed}
                placeholder="e.g. 5"
                onChange={(e) => updateField("numberOfSmrs", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfSelection">Date of Selection</Label>
              <Input
                id="dateOfSelection"
                type="date"
                value={formData.dateOfSelection}
                onChange={(e) => updateField("dateOfSelection", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selectedBy">Selected By</Label>
              <Input
                id="selectedBy"
                type="text"
                placeholder="Name / Department"
                value={formData.selectedBy}
                onChange={(e) => updateField("selectedBy", e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section: Review Selected SMRs (click to open detail) */}
      {selectedSmrIds.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Search className="h-5 w-5 text-primary" />
              <span>
                {showTargetedCriteria ? "6" : formData.selectionMethod ? "5" : "4"}. Review Selected
                SMRs
              </span>
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Click on each SMR to open its detail view and complete the review focus section.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Progress indicator */}
            <div className="mb-4 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${selectedSmrIds.length > 0 ? (reviewedCount / selectedSmrIds.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {reviewedCount}/{selectedSmrIds.length} reviewed
              </span>
            </div>

            {/* SMR list items */}
            {selectedRecords.map((record) => {
              const reviewed = isSmrReviewed(record.id);
              const review = getReview(record.id);
              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => {
                    setActiveSmrId(record.id);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex w-full items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted/50 ${
                    reviewed ? "border-emerald-200 bg-emerald-50/50" : "border-border"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      reviewed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {reviewed ? <CheckCircle2 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{record.referenceNo}</span>
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_COLORS[record.riskLevel]}`}
                      >
                        {record.riskLevel}
                      </span>
                      {testResults[record.id] && !reviewed && (
                        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          Tested
                        </span>
                      )}
                      {reviewed && (
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                            review.reviewOutcome === "satisfactory"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : review.reviewOutcome === "issues"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-amber-100 text-amber-800 border-amber-200"
                          }`}
                        >
                          {review.reviewOutcome === "satisfactory"
                            ? "Satisfactory"
                            : review.reviewOutcome === "issues"
                              ? "Issues Identified"
                              : "Requires Escalation"}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {record.customerName} &middot; {record.suspicionType} &middot;{" "}
                      {formatCurrency(record.transactionValue)}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Section: Overall Review Outcome (shown only when all SMRs are reviewed) */}
      {selectedSmrIds.length > 0 && (
        <Card className={!allSmrsReviewed ? "opacity-60 pointer-events-none" : ""}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>
                {showTargetedCriteria ? "7" : formData.selectionMethod ? "6" : "5"}. Overall Review
                Outcome
              </span>
            </CardTitle>
            {!allSmrsReviewed && (
              <div className="mt-2 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Please review all selected SMRs before completing this section.</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Label>Overall Outcome</Label>
              <RadioGroup
                value={formData.overallOutcome}
                onValueChange={(value) => updateField("overallOutcome", value)}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="satisfactory" id="overall-satisfactory" />
                  <Label htmlFor="overall-satisfactory" className="cursor-pointer font-normal">
                    Satisfactory
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="issues" id="overall-issues" />
                  <Label htmlFor="overall-issues" className="cursor-pointer font-normal">
                    Issues Identified
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="escalation" id="overall-escalation" />
                  <Label htmlFor="overall-escalation" className="cursor-pointer font-normal">
                    Requires Escalation
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="overallRemarks">Remarks / Summary</Label>
              <Textarea
                id="overallRemarks"
                placeholder="Provide an overall summary of the review findings..."
                rows={4}
                value={formData.overallRemarks}
                onChange={(e) => updateField("overallRemarks", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="w-full bg-transparent sm:w-auto"
        >
          Reset Form
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={selectedSmrIds.length > 0 && !allSmrsReviewed}
        >
          Submit Form
        </Button>
      </div>
    </form>
  );
}

// --- Helper components ---

function DetailField({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm text-foreground">{value}</p>
    </div>
  );
}

function SummaryField({ label, value, span2 = false }) {
  return (
    <div className={`flex justify-between sm:flex-col ${span2 ? "sm:col-span-2" : ""}`}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
