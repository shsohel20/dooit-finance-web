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

const ECDD_REGISTER = [
  {
    id: "ecdd-001",
    referenceNo: "ECDD-2025-0015",
    reviewDate: "2025-01-20",
    customerName: "Al Rashid Holdings Group",
    customerId: "CUST-4421",
    riskLevel: "Very High",
    customerType: "Corporate",
    nationality: "UAE",
    occupation: "Conglomerate - Diversified",
    sourceOfFunds: "Trade finance, real estate, and commodity trading revenues",
    sourceOfWealth:
      "Inherited family business empire established in 1978 with subsequent expansion into real estate and commodities trading across GCC region.",
    accountRelationship: "Since 2012 - Multiple accounts",
    annualTurnover: 45000000,
    currency: "AED",
    lastCddDate: "2022-06-15",
    ecddTrigger: "High-risk jurisdiction transactions",
    relationshipManager: "Ahmad Al Mazrouei",
    branch: "Abu Dhabi Main Branch",
    status: "Pending Review",
  },
  {
    id: "ecdd-002",
    referenceNo: "ECDD-2025-0028",
    reviewDate: "2025-02-05",
    customerName: "Sheikh Hamad Bin Faisal",
    customerId: "CUST-7120",
    riskLevel: "PEP",
    customerType: "Individual",
    nationality: "Qatar",
    occupation: "Government Official - Ministry of Finance",
    sourceOfFunds: "Government salary, investment income, and family trust distributions",
    sourceOfWealth:
      "Royal family member with inherited assets and government compensation. Multiple property holdings across GCC.",
    accountRelationship: "Since 2018 - Premium Banking",
    annualTurnover: 12000000,
    currency: "AED",
    lastCddDate: "2023-01-10",
    ecddTrigger: "PEP - Politically Exposed Person",
    relationshipManager: "Fatima Al Suwaidi",
    branch: "Dubai DIFC Branch",
    status: "Reviewed",
  },
  {
    id: "ecdd-003",
    referenceNo: "ECDD-2025-0041",
    reviewDate: "2025-02-22",
    customerName: "Oceanic Freight & Logistics LLC",
    customerId: "CUST-2390",
    riskLevel: "High",
    customerType: "Corporate",
    nationality: "Panama",
    occupation: "Freight Forwarding & Logistics",
    sourceOfFunds: "Shipping and logistics service revenues from international trade routes",
    sourceOfWealth:
      "Established logistics company with operations in 12 countries. Parent company registered in Panama Free Trade Zone.",
    accountRelationship: "Since 2020 - Trade Finance",
    annualTurnover: 28000000,
    currency: "AED",
    lastCddDate: "2023-07-20",
    ecddTrigger: "Complex corporate structure",
    relationshipManager: "Khalid Bin Rashid",
    branch: "Jebel Ali Free Zone Branch",
    status: "Pending Review",
  },
  {
    id: "ecdd-004",
    referenceNo: "ECDD-2025-0056",
    reviewDate: "2025-03-10",
    customerName: "Victoria Petrova",
    customerId: "CUST-8845",
    riskLevel: "High",
    customerType: "Individual",
    nationality: "Russia",
    occupation: "Business Owner - Luxury Retail",
    sourceOfFunds: "Luxury retail chain profits and dividend income from holding companies",
    sourceOfWealth:
      "Built luxury retail chain across CIS countries. Proceeds from sale of Moscow-based properties in 2019.",
    accountRelationship: "Since 2019 - Private Banking",
    annualTurnover: 8500000,
    currency: "AED",
    lastCddDate: "2022-11-30",
    ecddTrigger: "High-risk nationality + Sanctions proximity",
    relationshipManager: "Sara Al Hashemi",
    branch: "Dubai Marina Branch",
    status: "Escalated",
  },
  {
    id: "ecdd-005",
    referenceNo: "ECDD-2025-0072",
    reviewDate: "2025-03-28",
    customerName: "Golden Gate Exchange House",
    customerId: "CUST-3150",
    riskLevel: "Very High",
    customerType: "DNFBP",
    nationality: "UAE",
    occupation: "Money Exchange & Remittance",
    sourceOfFunds: "Foreign exchange and remittance service commissions and spreads",
    sourceOfWealth: "Licensed exchange house operating 15 branches across UAE since 2005.",
    accountRelationship: "Since 2015 - Business Banking",
    annualTurnover: 120000000,
    currency: "AED",
    lastCddDate: "2023-03-01",
    ecddTrigger: "DNFBP - High volume remittance corridor",
    relationshipManager: "Omar Al Mansoori",
    branch: "Sharjah Central Branch",
    status: "Pending Review",
  },
  {
    id: "ecdd-006",
    referenceNo: "ECDD-2025-0088",
    reviewDate: "2025-04-15",
    customerName: "Noor Capital Investments",
    customerId: "CUST-5530",
    riskLevel: "High",
    customerType: "Corporate",
    nationality: "Cayman Islands",
    occupation: "Investment Fund Management",
    sourceOfFunds: "Fund management fees, carried interest, and portfolio investment returns",
    sourceOfWealth:
      "Investment fund established in 2016 with seed capital from GCC-based HNW investors.",
    accountRelationship: "Since 2017 - Corporate Banking",
    annualTurnover: 35000000,
    currency: "AED",
    lastCddDate: "2023-05-15",
    ecddTrigger: "Offshore entity + complex ownership",
    relationshipManager: "Ahmad Al Mazrouei",
    branch: "Abu Dhabi Main Branch",
    status: "Reviewed",
  },
  {
    id: "ecdd-007",
    referenceNo: "ECDD-2025-0103",
    reviewDate: "2025-05-02",
    customerName: "Hon. James Okafor",
    customerId: "CUST-9210",
    riskLevel: "PEP",
    customerType: "Individual",
    nationality: "Nigeria",
    occupation: "Senator - National Assembly",
    sourceOfFunds: "Legislative salary, agricultural business income, and consultancy fees",
    sourceOfWealth:
      "Large-scale agricultural operations in Nigeria, inherited from family. Consultancy income from African development projects.",
    accountRelationship: "Since 2021 - Premium Banking",
    annualTurnover: 6000000,
    currency: "AED",
    lastCddDate: "2023-09-20",
    ecddTrigger: "PEP + High-risk jurisdiction",
    relationshipManager: "Fatima Al Suwaidi",
    branch: "Dubai DIFC Branch",
    status: "Pending Review",
  },
  {
    id: "ecdd-008",
    referenceNo: "ECDD-2025-0119",
    reviewDate: "2025-05-18",
    customerName: "Desert Diamond Mining Corp",
    customerId: "CUST-1290",
    riskLevel: "Very High",
    customerType: "Corporate",
    nationality: "South Africa",
    occupation: "Precious Stones Mining & Export",
    sourceOfFunds: "Diamond and precious stone mining revenues and wholesale distribution",
    sourceOfWealth:
      "Mining concessions acquired in 2008. Operations in South Africa, Botswana, and Namibia.",
    accountRelationship: "Since 2019 - Trade Finance",
    annualTurnover: 55000000,
    currency: "AED",
    lastCddDate: "2022-12-10",
    ecddTrigger: "High-risk sector (precious stones) + complex structure",
    relationshipManager: "Khalid Bin Rashid",
    branch: "Jebel Ali Free Zone Branch",
    status: "Escalated",
  },
  {
    id: "ecdd-009",
    referenceNo: "ECDD-2025-0135",
    reviewDate: "2025-06-05",
    customerName: "Bin Laden Charity Foundation",
    customerId: "CUST-6640",
    riskLevel: "Very High",
    customerType: "NPO",
    nationality: "Saudi Arabia",
    occupation: "Non-Profit Organization - Humanitarian Aid",
    sourceOfFunds: "Charitable donations, government grants, and endowment income",
    sourceOfWealth:
      "Established charitable trust with endowment from founding family. Government-backed humanitarian programs.",
    accountRelationship: "Since 2016 - Non-Profit Banking",
    annualTurnover: 18000000,
    currency: "AED",
    lastCddDate: "2023-02-28",
    ecddTrigger: "NPO + High-risk sector + Name screening alert",
    relationshipManager: "Omar Al Mansoori",
    branch: "Sharjah Central Branch",
    status: "Pending Review",
  },
  {
    id: "ecdd-010",
    referenceNo: "ECDD-2025-0148",
    reviewDate: "2025-06-22",
    customerName: "Zheng Wei International Trading",
    customerId: "CUST-4480",
    riskLevel: "High",
    customerType: "Corporate",
    nationality: "China",
    occupation: "Electronics Export & Import",
    sourceOfFunds: "Cross-border electronics trade revenue between China and GCC markets",
    sourceOfWealth:
      "Established trading company with warehousing in Shenzhen and Dubai. Annual volume exceeds $50M.",
    accountRelationship: "Since 2020 - Trade Finance",
    annualTurnover: 52000000,
    currency: "AED",
    lastCddDate: "2023-04-15",
    ecddTrigger: "High volume cross-border + trade-based ML risk",
    relationshipManager: "Sara Al Hashemi",
    branch: "Dubai Marina Branch",
    status: "Reviewed",
  },
  {
    id: "ecdd-011",
    referenceNo: "ECDD-2025-0162",
    reviewDate: "2025-07-08",
    customerName: "Maria Santos De Souza",
    customerId: "CUST-3370",
    riskLevel: "PEP",
    customerType: "Individual",
    nationality: "Brazil",
    occupation: "Former Minister of Trade",
    sourceOfFunds: "Investment portfolio income, real estate rentals, and pension",
    sourceOfWealth:
      "Former government official. Wealth from family-owned agricultural estates and post-government consultancy.",
    accountRelationship: "Since 2022 - Premium Banking",
    annualTurnover: 4500000,
    currency: "AED",
    lastCddDate: "2023-08-01",
    ecddTrigger: "Former PEP with ongoing political connections",
    relationshipManager: "Fatima Al Suwaidi",
    branch: "Dubai DIFC Branch",
    status: "Pending Review",
  },
  {
    id: "ecdd-012",
    referenceNo: "ECDD-2025-0178",
    reviewDate: "2025-07-25",
    customerName: "Al Amal Real Estate Development",
    customerId: "CUST-7760",
    riskLevel: "High",
    customerType: "Corporate",
    nationality: "UAE",
    occupation: "Real Estate Development",
    sourceOfFunds: "Property sales, rental income, and project financing from local banks",
    sourceOfWealth:
      "Real estate development company founded in 2010. Portfolio includes 8 residential towers and 3 commercial complexes.",
    accountRelationship: "Since 2014 - Corporate Banking",
    annualTurnover: 78000000,
    currency: "AED",
    lastCddDate: "2022-09-15",
    ecddTrigger: "High-risk sector (real estate) + overdue CDD refresh",
    relationshipManager: "Ahmad Al Mazrouei",
    branch: "Abu Dhabi Main Branch",
    status: "Pending Review",
  },
];

// --- Helpers ---

const RISK_COLORS = {
  High: "bg-red-100 text-red-800 border-red-200",
  "Very High": "bg-red-200 text-red-900 border-red-300",
  PEP: "bg-amber-100 text-amber-800 border-amber-200",
};

const STATUS_COLORS = {
  "Pending Review": "bg-blue-100 text-blue-800 border-blue-200",
  Reviewed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Escalated: "bg-red-100 text-red-800 border-red-200",
};

const CUSTOMER_TYPE_COLORS = {
  Corporate: "bg-zinc-100 text-zinc-700 border-zinc-200",
  Individual: "bg-sky-100 text-sky-700 border-sky-200",
  DNFBP: "bg-orange-100 text-orange-700 border-orange-200",
  NPO: "bg-teal-100 text-teal-700 border-teal-200",
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

// --- ECDD Review Focus areas ---

const REVIEW_AREAS = [
  { id: "kyc_docs", label: "KYC documentation completeness" },
  { id: "sof_sow", label: "Source of Funds / Source of Wealth verification" },
  { id: "beneficial_ownership", label: "Beneficial ownership identification" },
  { id: "pep_screening", label: "PEP & sanctions screening" },
  { id: "transaction_profile", label: "Transaction profile vs. expected activity" },
  { id: "risk_assessment", label: "Customer risk assessment accuracy" },
  { id: "ongoing_monitoring", label: "Ongoing monitoring adequacy" },
  { id: "adverse_media", label: "Adverse media checks" },
];

function generateTestResult(record) {
  const seed = record.annualTurnover % 100;
  const kycCompleteness = {
    score: seed > 50 ? 92 : seed > 20 ? 75 : 58,
    details:
      seed > 50
        ? "All KYC documents on file and within validity. ID, proof of address, and corporate documents verified."
        : seed > 20
          ? "Core KYC documents present but some supporting documents are expired or missing. Proof of address over 6 months old."
          : "Significant KYC gaps identified. Missing updated passport copy, expired trade license, and incomplete corporate resolution.",
  };
  const sofVerification = {
    score:
      record.riskLevel === "Very High"
        ? seed > 40
          ? 78
          : 55
        : record.riskLevel === "PEP"
          ? seed > 30
            ? 82
            : 65
          : seed > 50
            ? 90
            : 72,
    details:
      record.riskLevel === "Very High" && seed <= 40
        ? "Source of funds documentation insufficient for declared turnover level. Third-party fund flows not adequately explained."
        : record.riskLevel === "PEP" && seed <= 30
          ? "SOF partially verified. Government salary confirmed but investment income sources require further documentation."
          : "Source of funds adequately documented with bank statements and audited financial records supporting declared income.",
  };
  const beneficialOwnership = {
    score:
      record.customerType === "Corporate"
        ? seed > 45
          ? 85
          : 60
        : record.customerType === "Individual"
          ? 95
          : seed > 35
            ? 78
            : 52,
    details:
      record.customerType === "Corporate" && seed <= 45
        ? "UBO identification incomplete. Ownership chain traced to offshore entity with opaque structure. Final beneficial owner not confirmed."
        : record.customerType === "Individual"
          ? "Individual customer - beneficial ownership directly established."
          : "Beneficial ownership structure documented but complex layering noted. Recommend periodic re-verification.",
  };
  const pepScreening = {
    score: record.riskLevel === "PEP" ? (seed > 50 ? 88 : 70) : seed > 40 ? 93 : 80,
    details:
      record.riskLevel === "PEP" && seed <= 50
        ? "PEP screening conducted but close associates list requires updating. Last full screening was over 12 months ago."
        : "PEP and sanctions screening current. No adverse matches. Last screening within acceptable timeframe.",
  };
  const riskAssessment = {
    score: record.status === "Reviewed" ? 90 : seed > 45 ? 82 : 65,
    details:
      record.status === "Reviewed"
        ? "Risk assessment is current and accurately reflects the customer profile and transaction behavior."
        : seed > 45
          ? "Risk assessment generally aligned but some risk factors not fully captured. Recommend updating risk matrix."
          : "Risk assessment outdated. Customer profile has changed significantly since last review. Immediate re-assessment required.",
  };
  const overallScore = Math.round(
    (kycCompleteness.score +
      sofVerification.score +
      beneficialOwnership.score +
      pepScreening.score +
      riskAssessment.score) /
      5,
  );
  const flags = [];
  if (kycCompleteness.score < 70) flags.push("KYC documentation gaps");
  if (sofVerification.score < 70) flags.push("Insufficient SOF/SOW verification");
  if (beneficialOwnership.score < 65) flags.push("UBO identification incomplete");
  if (pepScreening.score < 75) flags.push("PEP screening overdue");
  if (riskAssessment.score < 70) flags.push("Risk assessment outdated");
  if (record.riskLevel === "Very High" && overallScore < 80)
    flags.push("Very high-risk customer below threshold");
  if (record.riskLevel === "PEP" && overallScore < 80)
    flags.push("PEP customer below compliance threshold");
  return {
    kycCompleteness,
    sofVerification,
    beneficialOwnership,
    pepScreening,
    riskAssessment,
    overallScore,
    flags,
  };
}

const INITIAL_FORM = {
  periodFrom: "",
  periodTo: "",
  totalRecords: String(ECDD_REGISTER.length),
  registerSource: "",
  selectionMethod: "",
  methodReason: "",
  customerType: "",
  riskLevel: "",
  ecddTrigger: "",
  turnoverThreshold: "",
  numberOfRecords: "",
  dateOfSelection: "",
  selectedBy: "",
  overallOutcome: "",
  overallRemarks: "",
};

// --- Component ---

export default function EcddSelectionForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const [ecddReviews, setEcddReviews] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [testResults, setTestResults] = useState({});
  const [testingId, setTestingId] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getReview = (id) =>
    ecddReviews[id] || { reviewAreas: [], reviewOutcome: "", reviewNotes: "" };

  const updateReview = (id, patch) => {
    setEcddReviews((prev) => ({
      ...prev,
      [id]: { ...getReview(id), ...patch },
    }));
  };

  const toggleReviewArea = (ecddId, area) => {
    const current = getReview(ecddId);
    const areas = current.reviewAreas.includes(area)
      ? current.reviewAreas.filter((a) => a !== area)
      : [...current.reviewAreas, area];
    updateReview(ecddId, { reviewAreas: areas });
  };

  const isRecordReviewed = (id) => {
    const review = ecddReviews[id];
    return !!(review && review.reviewOutcome && review.reviewAreas.length > 0 && testResults[id]);
  };

  const allReviewed = selectedIds.length > 0 && selectedIds.every((id) => isRecordReviewed(id));
  const reviewedCount = selectedIds.filter((id) => isRecordReviewed(id)).length;

  const runTest = (ecddId) => {
    const record = ECDD_REGISTER.find((r) => r.id === ecddId);
    setTestingId(ecddId);
    setTimeout(() => {
      const result = generateTestResult(record);
      setTestResults((prev) => ({ ...prev, [ecddId]: result }));
      setTestingId(null);
    }, 1500);
  };

  const handleMethodChange = (value) => {
    updateField("selectionMethod", value);
    setSelectedIds([]);
    setEcddReviews({});
    setTestResults({});
    setActiveId(null);
  };

  const handleRandomSelect = useCallback(() => {
    const count = Number(formData.numberOfRecords) || 5;
    const picked = shuffleAndPick(ECDD_REGISTER, count);
    setSelectedIds(picked.map((r) => r.id));
    setEcddReviews({});
    setActiveId(null);
  }, [formData.numberOfRecords]);

  const toggleRecord = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const removeRecord = (id) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    setEcddReviews((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (activeId === id) setActiveId(null);
  };

  const selectedRecords = ECDD_REGISTER.filter((r) => selectedIds.includes(r.id));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setSelectedIds([]);
    setEcddReviews({});
    setTestResults({});
    setActiveId(null);
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

  const totalSelectedTurnover = selectedRecords.reduce((sum, r) => sum + r.annualTurnover, 0);

  // =============================================
  // ECDD Detail / Review View
  // =============================================
  if (activeId) {
    const record = ECDD_REGISTER.find((r) => r.id === activeId);
    const review = getReview(activeId);

    return (
      <div className="space-y-6">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setActiveId(null)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Form
        </Button>

        {/* ECDD Detail Card */}
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
                  {record.riskLevel}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${CUSTOMER_TYPE_COLORS[record.customerType] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}
                >
                  {record.customerType}
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label="Customer ID" value={record.customerId} />
              <DetailField label="Review Date" value={record.reviewDate} />
              <DetailField label="Nationality" value={record.nationality} />
              <DetailField label="Occupation" value={record.occupation} />
              <DetailField
                label="Annual Turnover"
                value={`${formatCurrency(record.annualTurnover)}`}
              />
              <DetailField label="Account Relationship" value={record.accountRelationship} />
              <DetailField label="Last CDD Date" value={record.lastCddDate} />
              <DetailField label="ECDD Trigger" value={record.ecddTrigger} />
              <DetailField label="Relationship Manager" value={record.relationshipManager} />
              <DetailField label="Branch" value={record.branch} />
            </div>
            <Separator />
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Source of Funds</p>
              <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed text-foreground">
                {record.sourceOfFunds}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Source of Wealth</p>
              <p className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed text-foreground">
                {record.sourceOfWealth}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Review Focus */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Search className="h-5 w-5 text-primary" />
              ECDD Review for {record.referenceNo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Label>Areas to Review</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {REVIEW_AREAS.map((area) => (
                  <div key={area.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`${activeId}-${area.id}`}
                      checked={review.reviewAreas.includes(area.id)}
                      onCheckedChange={() => toggleReviewArea(activeId, area.id)}
                      disabled={!!testResults[activeId]}
                    />
                    <Label
                      htmlFor={`${activeId}-${area.id}`}
                      className="cursor-pointer font-normal"
                    >
                      {area.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Test */}
            {!testResults[activeId] && (
              <>
                <Separator />
                <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-primary/30 bg-primary/5 p-6">
                  <FlaskConical className="h-8 w-8 text-primary/60" />
                  <p className="text-center text-sm text-muted-foreground">
                    Select the review areas above, then run the ECDD compliance test to generate
                    results.
                  </p>
                  <Button
                    type="button"
                    onClick={() => runTest(activeId)}
                    disabled={review.reviewAreas.length === 0 || testingId === activeId}
                    className="gap-2"
                  >
                    {testingId === activeId ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Running Test...
                      </>
                    ) : (
                      <>
                        <FlaskConical className="h-4 w-4" />
                        Run ECDD Compliance Test
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* Test Results */}
            {testResults[activeId] && (
              <>
                <Separator />
                {(() => {
                  const result = testResults[activeId];
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

                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${scoreBarColor}`}
                          style={{ width: `${result.overallScore}%` }}
                        />
                      </div>

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

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                          {
                            key: "kycCompleteness",
                            label: "KYC Completeness",
                            data: result.kycCompleteness,
                          },
                          {
                            key: "sofVerification",
                            label: "SOF/SOW Verification",
                            data: result.sofVerification,
                          },
                          {
                            key: "beneficialOwnership",
                            label: "Beneficial Ownership",
                            data: result.beneficialOwnership,
                          },
                          {
                            key: "pepScreening",
                            label: "PEP & Sanctions Screening",
                            data: result.pepScreening,
                          },
                          {
                            key: "riskAssessment",
                            label: "Risk Assessment Quality",
                            data: result.riskAssessment,
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

                {/* Review Outcome - only after test */}
                <Separator />
                <div className="space-y-3">
                  <Label>Review Outcome</Label>
                  <p className="text-xs text-muted-foreground">
                    Based on the test results above, select the appropriate outcome for this ECDD
                    case.
                  </p>
                  <RadioGroup
                    value={review.reviewOutcome}
                    onValueChange={(value) => updateReview(activeId, { reviewOutcome: value })}
                    className="flex flex-wrap gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="compliant" id={`${activeId}-outcome-compliant`} />
                      <Label
                        htmlFor={`${activeId}-outcome-compliant`}
                        className="cursor-pointer font-normal"
                      >
                        Compliant
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="deficiencies"
                        id={`${activeId}-outcome-deficiencies`}
                      />
                      <Label
                        htmlFor={`${activeId}-outcome-deficiencies`}
                        className="cursor-pointer font-normal"
                      >
                        Deficiencies Found
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="exit" id={`${activeId}-outcome-exit`} />
                      <Label
                        htmlFor={`${activeId}-outcome-exit`}
                        className="cursor-pointer font-normal"
                      >
                        Recommend Exit
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="escalation" id={`${activeId}-outcome-escalation`} />
                      <Label
                        htmlFor={`${activeId}-outcome-escalation`}
                        className="cursor-pointer font-normal"
                      >
                        Requires Escalation
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor={`${activeId}-notes`}>Review Notes</Label>
                  <Textarea
                    id={`${activeId}-notes`}
                    placeholder="Add any observations, findings, or recommendations for this ECDD case..."
                    rows={3}
                    value={review.reviewNotes}
                    onChange={(e) => updateReview(activeId, { reviewNotes: e.target.value })}
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setActiveId(null)}
            className="gap-2 bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Form
          </Button>
          {(() => {
            const currentIndex = selectedIds.indexOf(activeId);
            const nextId = selectedIds[currentIndex + 1];
            if (nextId) {
              return (
                <Button
                  type="button"
                  onClick={() => {
                    setActiveId(nextId);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="gap-2"
                >
                  Next Record
                  <ChevronRight className="h-4 w-4" />
                </Button>
              );
            }
            return (
              <Button
                type="button"
                onClick={() => {
                  setActiveId(null);
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
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-900">
              ECDD Form Submitted Successfully
            </h2>
            <p className="max-w-md text-sm text-emerald-700">
              Your Enhanced Customer Due Diligence selection form has been recorded. Below is a
              summary for your records.
            </p>
          </CardContent>
        </Card>

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
                ECDD Register Population
              </h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <SummaryField
                  label="Review Period"
                  value={`${formData.periodFrom || "N/A"} to ${formData.periodTo || "N/A"}`}
                />
                <SummaryField label="Total Records in Register" value={formData.totalRecords} />
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
                <SummaryField label="Records Selected" value={String(selectedIds.length)} />
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
                    formData.overallOutcome === "compliant"
                      ? "Compliant"
                      : formData.overallOutcome === "deficiencies"
                        ? "Deficiencies Found"
                        : formData.overallOutcome === "exit"
                          ? "Recommend Exit"
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

        {/* Per-record review results */}
        {selectedRecords.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ClipboardList className="h-5 w-5 text-primary" />
                Individual ECDD Review Results ({selectedRecords.length})
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
                          {record.customerName} &middot; {record.customerType}
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
                            review.reviewOutcome === "compliant"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : review.reviewOutcome === "deficiencies"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : review.reviewOutcome === "exit"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : review.reviewOutcome === "escalation"
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : "bg-zinc-100 text-zinc-700 border-zinc-200"
                          }`}
                        >
                          {review.reviewOutcome === "compliant"
                            ? "Compliant"
                            : review.reviewOutcome === "deficiencies"
                              ? "Deficiencies Found"
                              : review.reviewOutcome === "exit"
                                ? "Recommend Exit"
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
                Total annual turnover:{" "}
                <span className="ml-1 font-medium text-foreground">
                  {formatCurrency(totalSelectedTurnover)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: ECDD Register Population */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            <span>1. ECDD Register Population</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ecdd-periodFrom">Review Period From</Label>
              <Input
                id="ecdd-periodFrom"
                type="date"
                value={formData.periodFrom}
                onChange={(e) => updateField("periodFrom", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecdd-periodTo">Review Period To</Label>
              <Input
                id="ecdd-periodTo"
                type="date"
                value={formData.periodTo}
                onChange={(e) => updateField("periodTo", e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ecdd-totalRecords">Total ECDD Records in Register</Label>
              <Input
                id="ecdd-totalRecords"
                type="number"
                min="0"
                value={formData.totalRecords}
                readOnly
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecdd-registerSource">Source of Register (System / Report Name)</Label>
              <Input
                id="ecdd-registerSource"
                type="text"
                placeholder="e.g. CDD Management System"
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
                  <RadioGroupItem value={option.value} id={`ecdd-method-${option.value}`} />
                  <Label
                    htmlFor={`ecdd-method-${option.value}`}
                    className="cursor-pointer font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="ecdd-methodReason">Reason for Choosing This Method</Label>
            <Textarea
              id="ecdd-methodReason"
              placeholder="Describe the rationale for the chosen selection method..."
              rows={3}
              value={formData.methodReason}
              onChange={(e) => updateField("methodReason", e.target.value)}
              required
            />
          </div>

          {isRandom && (
            <div className="rounded-lg border border-dashed border-primary/30 bg-primary/5 p-4">
              <p className="mb-3 text-sm text-muted-foreground">
                Specify how many ECDD records to randomly select from the register.
              </p>
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end">
                <div className="w-full space-y-2 sm:w-40">
                  <Label htmlFor="ecdd-randomCount">Number to Select</Label>
                  <Input
                    id="ecdd-randomCount"
                    type="number"
                    min="1"
                    max={ECDD_REGISTER.length}
                    placeholder="e.g. 5"
                    value={formData.numberOfRecords}
                    onChange={(e) => updateField("numberOfRecords", e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRandomSelect}
                  disabled={!formData.numberOfRecords}
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

      {/* Section 3: Selection Criteria (Targeted) */}
      {showTargetedCriteria && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Target className="h-5 w-5 text-primary" />
              <span>3. Selection Criteria (Targeted)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ecdd-customerType">Customer Type</Label>
                <Select
                  value={formData.customerType}
                  onValueChange={(value) => updateField("customerType", value)}
                >
                  <SelectTrigger id="ecdd-customerType">
                    <SelectValue placeholder="Select customer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="dnfbp">DNFBP</SelectItem>
                    <SelectItem value="npo">NPO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ecdd-riskLevel">Risk Level</Label>
                <Select
                  value={formData.riskLevel}
                  onValueChange={(value) => updateField("riskLevel", value)}
                >
                  <SelectTrigger id="ecdd-riskLevel">
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="veryhigh">Very High</SelectItem>
                    <SelectItem value="pep">PEP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecdd-ecddTrigger">ECDD Trigger Criteria</Label>
              <Textarea
                id="ecdd-ecddTrigger"
                placeholder="e.g. PEP status, high-risk jurisdiction, complex ownership..."
                rows={2}
                value={formData.ecddTrigger}
                onChange={(e) => updateField("ecddTrigger", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecdd-turnoverThreshold">Annual Turnover Threshold</Label>
              <Input
                id="ecdd-turnoverThreshold"
                type="text"
                placeholder="e.g. > 10,000,000"
                value={formData.turnoverThreshold}
                onChange={(e) => updateField("turnoverThreshold", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section: ECDD Register Table */}
      {formData.selectionMethod && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <ClipboardList className="h-5 w-5 text-primary" />
              <span>
                {showTargetedCriteria ? "4" : "3"}. ECDD Register
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
            {selectedIds.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Selected ({selectedIds.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedRecords.map((r) => (
                    <Badge key={r.id} variant="secondary" className="gap-1.5 pr-1.5">
                      {r.referenceNo}
                      <button
                        type="button"
                        onClick={() => removeRecord(r.id)}
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

            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    {(isTargeted || isMixed) && (
                      <TableHead className="w-10">
                        <span className="sr-only">Select</span>
                      </TableHead>
                    )}
                    <TableHead>Ref No.</TableHead>
                    <TableHead>Review Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>ECDD Trigger</TableHead>
                    <TableHead className="text-right">Turnover</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ECDD_REGISTER.map((record) => {
                    const isSelected = selectedIds.includes(record.id);
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
                              onCheckedChange={() => toggleRecord(record.id)}
                              aria-label={`Select ${record.referenceNo}`}
                            />
                          </TableCell>
                        )}
                        <TableCell className="font-medium">{record.referenceNo}</TableCell>
                        <TableCell className="tabular-nums">{record.reviewDate}</TableCell>
                        <TableCell>{record.customerName}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${CUSTOMER_TYPE_COLORS[record.customerType] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}
                          >
                            {record.customerType}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${RISK_COLORS[record.riskLevel]}`}
                          >
                            {record.riskLevel}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {record.ecddTrigger}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(record.annualTurnover)}
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

            {isRandom && selectedIds.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                Use the &quot;Pick Randomly&quot; button above to auto-select ECDD records.
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
              <Label htmlFor="ecdd-numberOfRecords">Number of Records Selected</Label>
              <Input
                id="ecdd-numberOfRecords"
                type="number"
                min="1"
                value={
                  isTargeted || isMixed ? String(selectedIds.length) : formData.numberOfRecords
                }
                readOnly={isTargeted || isMixed}
                placeholder="e.g. 5"
                onChange={(e) => updateField("numberOfRecords", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecdd-dateOfSelection">Date of Selection</Label>
              <Input
                id="ecdd-dateOfSelection"
                type="date"
                value={formData.dateOfSelection}
                onChange={(e) => updateField("dateOfSelection", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecdd-selectedBy">Selected By</Label>
              <Input
                id="ecdd-selectedBy"
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

      {/* Section: Review Selected Records */}
      {selectedIds.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Search className="h-5 w-5 text-primary" />
              <span>
                {showTargetedCriteria ? "6" : formData.selectionMethod ? "5" : "4"}. Review Selected
                ECDD Records
              </span>
            </CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Click on each record to open its detail view and complete the ECDD review.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width: `${selectedIds.length > 0 ? (reviewedCount / selectedIds.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {reviewedCount}/{selectedIds.length} reviewed
              </span>
            </div>

            {selectedRecords.map((record) => {
              const reviewed = isRecordReviewed(record.id);
              const review = getReview(record.id);
              return (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => {
                    setActiveId(record.id);
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
                            review.reviewOutcome === "compliant"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : review.reviewOutcome === "deficiencies"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {review.reviewOutcome === "compliant"
                            ? "Compliant"
                            : review.reviewOutcome === "deficiencies"
                              ? "Deficiencies Found"
                              : review.reviewOutcome === "exit"
                                ? "Recommend Exit"
                                : "Requires Escalation"}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {record.customerName} &middot; {record.customerType} &middot;{" "}
                      {formatCurrency(record.annualTurnover)}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Section: Overall Review Outcome */}
      {selectedIds.length > 0 && (
        <Card className={!allReviewed ? "opacity-60 pointer-events-none" : ""}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>
                {showTargetedCriteria ? "7" : formData.selectionMethod ? "6" : "5"}. Overall Review
                Outcome
              </span>
            </CardTitle>
            {!allReviewed && (
              <div className="mt-2 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>Please review all selected ECDD records before completing this section.</span>
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
                  <RadioGroupItem value="compliant" id="ecdd-overall-compliant" />
                  <Label htmlFor="ecdd-overall-compliant" className="cursor-pointer font-normal">
                    Compliant
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="deficiencies" id="ecdd-overall-deficiencies" />
                  <Label htmlFor="ecdd-overall-deficiencies" className="cursor-pointer font-normal">
                    Deficiencies Found
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="exit" id="ecdd-overall-exit" />
                  <Label htmlFor="ecdd-overall-exit" className="cursor-pointer font-normal">
                    Recommend Exit
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="escalation" id="ecdd-overall-escalation" />
                  <Label htmlFor="ecdd-overall-escalation" className="cursor-pointer font-normal">
                    Requires Escalation
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ecdd-overallRemarks">Remarks / Summary</Label>
              <Textarea
                id="ecdd-overallRemarks"
                placeholder="Provide an overall summary of the ECDD review findings..."
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
          disabled={selectedIds.length > 0 && !allReviewed}
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
