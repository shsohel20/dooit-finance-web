"use client";

import React from "react"

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
} from "lucide-react";


const SMR_REGISTER = [
  {
    id: "smr-001",
    referenceNo: "SMR-2025-0012",
    filingDate: "2025-01-15",
    customerName: "Al Farooq Trading LLC",
    riskLevel: "High",
    suspicionType: "Structuring",
    transactionValue: 245000,
    status: "Open",
  },
  {
    id: "smr-002",
    referenceNo: "SMR-2025-0034",
    filingDate: "2025-02-03",
    customerName: "Noor Holdings Ltd",
    riskLevel: "Medium",
    suspicionType: "Unusual cash activity",
    transactionValue: 87500,
    status: "Closed",
  },
  {
    id: "smr-003",
    referenceNo: "SMR-2025-0051",
    filingDate: "2025-02-18",
    customerName: "Rashid & Sons Exports",
    riskLevel: "High",
    suspicionType: "Trade-based laundering",
    transactionValue: 520000,
    status: "Under Review",
  },
  {
    id: "smr-004",
    referenceNo: "SMR-2025-0067",
    filingDate: "2025-03-05",
    customerName: "Yasmin Al Qasim",
    riskLevel: "Low",
    suspicionType: "Unusual wire transfer",
    transactionValue: 32000,
    status: "Open",
  },
  {
    id: "smr-005",
    referenceNo: "SMR-2025-0089",
    filingDate: "2025-03-22",
    customerName: "Golden Crescent Finance",
    riskLevel: "High",
    suspicionType: "Shell company activity",
    transactionValue: 1200000,
    status: "Open",
  },
  {
    id: "smr-006",
    referenceNo: "SMR-2025-0102",
    filingDate: "2025-04-01",
    customerName: "Zayed Construction Co",
    riskLevel: "Medium",
    suspicionType: "Layering",
    transactionValue: 175000,
    status: "Closed",
  },
  {
    id: "smr-007",
    referenceNo: "SMR-2025-0118",
    filingDate: "2025-04-14",
    customerName: "Khalil Mahmoud Ibrahim",
    riskLevel: "Low",
    suspicionType: "Rapid fund movement",
    transactionValue: 48000,
    status: "Under Review",
  },
  {
    id: "smr-008",
    referenceNo: "SMR-2025-0134",
    filingDate: "2025-05-02",
    customerName: "Emirates Star General Trading",
    riskLevel: "High",
    suspicionType: "Structuring",
    transactionValue: 310000,
    status: "Open",
  },
  {
    id: "smr-009",
    referenceNo: "SMR-2025-0156",
    filingDate: "2025-05-19",
    customerName: "Fatima Bint Saleh",
    riskLevel: "Medium",
    suspicionType: "Smurfing",
    transactionValue: 95000,
    status: "Closed",
  },
  {
    id: "smr-010",
    referenceNo: "SMR-2025-0171",
    filingDate: "2025-06-08",
    customerName: "Al Jazeera Metals Corp",
    riskLevel: "High",
    suspicionType: "Trade-based laundering",
    transactionValue: 780000,
    status: "Open",
  },
  {
    id: "smr-011",
    referenceNo: "SMR-2025-0189",
    filingDate: "2025-06-25",
    customerName: "Hamdan Real Estate Group",
    riskLevel: "Medium",
    suspicionType: "Unusual cash activity",
    transactionValue: 62000,
    status: "Under Review",
  },
  {
    id: "smr-012",
    referenceNo: "SMR-2025-0203",
    filingDate: "2025-07-11",
    customerName: "Sharjah Pearl Imports",
    riskLevel: "Low",
    suspicionType: "Unusual wire transfer",
    transactionValue: 28000,
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



const REVIEW_AREAS = [
  { id: "rationale", label: "Rationale for suspicion" },
  { id: "timeliness", label: "Timeliness of filing" },
  { id: "accuracy", label: "Accuracy of information" },
  { id: "regulatory", label: "Regulatory alignment" },
];

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
  reviewAreas: [],
  reviewOutcome: "",
};

// --- Component ---

export default function SmrSelectionForm() {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [selectedSmrIds, setSelectedSmrIds] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleReviewArea = (area) => {
    setFormData((prev) => ({
      ...prev,
      reviewAreas: prev.reviewAreas.includes(area)
        ? prev.reviewAreas.filter((a) => a !== area)
        : [...prev.reviewAreas, area],
    }));
  };

  // When selection method changes, reset selected SMRs
  const handleMethodChange = (value) => {
    updateField("selectionMethod", value);
    setSelectedSmrIds([]);
  };

  // Random selection handler
  const handleRandomSelect = useCallback(() => {
    const count = Number(formData.numberOfSmrs) || 5;
    const picked = shuffleAndPick(SMR_REGISTER, count);
    setSelectedSmrIds(picked.map((r) => r.id));
  }, [formData.numberOfSmrs]);

  // Toggle a single SMR for targeted/mixed selection
  const toggleSmr = (id) => {
    setSelectedSmrIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const removeSmr = (id) => {
    setSelectedSmrIds((prev) => prev.filter((x) => x !== id));
  };

  const selectedRecords = SMR_REGISTER.filter((r) =>
    selectedSmrIds.includes(r.id)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setSelectedSmrIds([]);
    setSubmitted(false);
  };

  const showTargetedCriteria =
    formData.selectionMethod === "targeted" ||
    formData.selectionMethod === "mixed";

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

  const reviewAreaLabels = REVIEW_AREAS.filter((a) =>
    formData.reviewAreas.includes(a.id)
  ).map((a) => a.label);

  const totalSelectedValue = selectedRecords.reduce(
    (sum, r) => sum + r.transactionValue,
    0
  );

  // --- Submitted Confirmation View ---
  if (submitted) {
    return (
      <div className="space-y-6">
        {/* Success banner */}
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-emerald-900">
              Form Submitted Successfully
            </h2>
            <p className="max-w-md text-sm text-emerald-700">
              Your SMR selection compliance form has been recorded. Below is a
              summary of the submitted information for your records.
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
            {/* Register Population */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                SMR Register Population
              </h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between sm:flex-col">
                  <dt className="text-muted-foreground">Reporting Period</dt>
                  <dd className="font-medium text-foreground">
                    {formData.periodFrom || "N/A"} to{" "}
                    {formData.periodTo || "N/A"}
                  </dd>
                </div>
                <div className="flex justify-between sm:flex-col">
                  <dt className="text-muted-foreground">
                    Total SMRs in Register
                  </dt>
                  <dd className="font-medium text-foreground">
                    {formData.totalSmrs}
                  </dd>
                </div>
                <div className="flex justify-between sm:flex-col">
                  <dt className="text-muted-foreground">Register Source</dt>
                  <dd className="font-medium text-foreground">
                    {formData.registerSource || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
            <Separator />

            {/* Selection Method */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Selection Method
              </h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between sm:flex-col">
                  <dt className="text-muted-foreground">Method</dt>
                  <dd className="font-medium text-foreground">{methodLabel}</dd>
                </div>
                <div className="flex justify-between sm:flex-col sm:col-span-2">
                  <dt className="text-muted-foreground">Reason</dt>
                  <dd className="font-medium text-foreground">
                    {formData.methodReason || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Targeted criteria (if applicable) */}
            {(formData.selectionMethod === "targeted" ||
              formData.selectionMethod === "mixed") && (
              <>
                <Separator />
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    Targeted Criteria
                  </h3>
                  <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                    {formData.suspicionReason && (
                      <div className="flex justify-between sm:flex-col sm:col-span-2">
                        <dt className="text-muted-foreground">
                          Suspicion Reason
                        </dt>
                        <dd className="font-medium text-foreground">
                          {formData.suspicionReason}
                        </dd>
                      </div>
                    )}
                    {(formData.timePeriodFrom || formData.timePeriodTo) && (
                      <div className="flex justify-between sm:flex-col">
                        <dt className="text-muted-foreground">
                          Filing Period Filter
                        </dt>
                        <dd className="font-medium text-foreground">
                          {formData.timePeriodFrom || "Any"} to{" "}
                          {formData.timePeriodTo || "Any"}
                        </dd>
                      </div>
                    )}
                    {formData.customerRiskLevel && (
                      <div className="flex justify-between sm:flex-col">
                        <dt className="text-muted-foreground">
                          Risk Level Filter
                        </dt>
                        <dd className="font-medium capitalize text-foreground">
                          {formData.customerRiskLevel}
                        </dd>
                      </div>
                    )}
                    {formData.transactionThreshold && (
                      <div className="flex justify-between sm:flex-col">
                        <dt className="text-muted-foreground">
                          Transaction Threshold
                        </dt>
                        <dd className="font-medium text-foreground">
                          {formData.transactionThreshold}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </>
            )}
            <Separator />

            {/* Sample Details */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Sample Details
              </h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                <div className="flex justify-between sm:flex-col">
                  <dt className="text-muted-foreground">SMRs Selected</dt>
                  <dd className="font-medium text-foreground">
                    {selectedSmrIds.length}
                  </dd>
                </div>
                <div className="flex justify-between sm:flex-col">
                  <dt className="text-muted-foreground">Date of Selection</dt>
                  <dd className="font-medium text-foreground">
                    {formData.dateOfSelection || "N/A"}
                  </dd>
                </div>
                <div className="flex justify-between sm:flex-col">
                  <dt className="text-muted-foreground">Selected By</dt>
                  <dd className="font-medium text-foreground">
                    {formData.selectedBy || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
            <Separator />

            {/* Review Focus */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                Review Focus
              </h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                <div className="flex justify-between sm:flex-col">
                  <dt className="text-muted-foreground">Areas Reviewed</dt>
                  <dd className="font-medium text-foreground">
                    {reviewAreaLabels.length > 0
                      ? reviewAreaLabels.join(", ")
                      : "None selected"}
                  </dd>
                </div>
                <div className="flex justify-between sm:flex-col">
                  <dt className="text-muted-foreground">Outcome</dt>
                  <dd className="font-medium capitalize text-foreground">
                    {formData.reviewOutcome === "satisfactory"
                      ? "Satisfactory"
                      : formData.reviewOutcome === "issues"
                        ? "Issues Identified"
                        : "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>

        {/* Selected SMRs table */}
        {selectedRecords.length > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
                <ClipboardList className="h-5 w-5 text-primary" />
                Selected SMRs ({selectedRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
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
                    {selectedRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.referenceNo}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {record.filingDate}
                        </TableCell>
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
                    ))}
                  </TableBody>
                </Table>
              </div>
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
          <Button
            onClick={() => window.print()}
            className="w-full sm:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            Print / Save as PDF
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section 1: SMR Register Population */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            <span>1. SMR Register Population</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="totalSmrs">
                Total Number of SMRs in Register
              </Label>
              <Input
                id="totalSmrs"
                type="number"
                min="0"
                value={formData.totalSmrs}
                onChange={(e) => updateField("totalSmrs", e.target.value)}
                required
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="registerSource">
                Source of Register (System / Report Name)
              </Label>
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
                  <RadioGroupItem
                    value={option.value}
                    id={`method-${option.value}`}
                  />
                  <Label
                    htmlFor={`method-${option.value}`}
                    className="cursor-pointer font-normal"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="methodReason">
              Reason for Choosing This Method
            </Label>
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
                Specify how many SMRs to randomly select from the register, then
                click the button below.
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
                    onChange={(e) =>
                      updateField("numberOfSmrs", e.target.value)
                    }
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
              <Label htmlFor="suspicionReason">
                Suspicion Reason / Typology
              </Label>
              <Textarea
                id="suspicionReason"
                placeholder="e.g. Structuring, Unusual cash activity, Trade-based laundering..."
                rows={2}
                value={formData.suspicionReason}
                onChange={(e) =>
                  updateField("suspicionReason", e.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="timePeriodFrom">
                  Time Period From (Filing Dates)
                </Label>
                <Input
                  id="timePeriodFrom"
                  type="date"
                  value={formData.timePeriodFrom}
                  onChange={(e) =>
                    updateField("timePeriodFrom", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timePeriodTo">
                  Time Period To (Filing Dates)
                </Label>
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
                  onValueChange={(value) =>
                    updateField("customerRiskLevel", value)
                  }
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
                <Label htmlFor="transactionThreshold">
                  Transaction Value Threshold
                </Label>
                <Input
                  id="transactionThreshold"
                  type="text"
                  placeholder="e.g. > 50,000"
                  value={formData.transactionThreshold}
                  onChange={(e) =>
                    updateField("transactionThreshold", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section: SMR Register — shown once a method is chosen */}
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
                    <Badge
                      key={r.id}
                      variant="secondary"
                      className="gap-1.5 pr-1.5"
                    >
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
                        className={
                          isSelected ? "bg-primary/5" : ""
                        }
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
                        <TableCell className="font-medium">
                          {record.referenceNo}
                        </TableCell>
                        <TableCell className="tabular-nums">
                          {record.filingDate}
                        </TableCell>
                        <TableCell>{record.customerName}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                              RISK_COLORS[record.riskLevel]
                            }`}
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
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${
                              STATUS_COLORS[record.status]
                            }`}
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
                Use the &quot;Pick Randomly&quot; button above to auto-select
                SMRs.
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
              {showTargetedCriteria ? "5" : formData.selectionMethod ? "4" : "3"}
              . Sample Details
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
                  isTargeted || isMixed
                    ? String(selectedSmrIds.length)
                    : formData.numberOfSmrs
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
                onChange={(e) =>
                  updateField("dateOfSelection", e.target.value)
                }
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

      {/* Section: Review Focus */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Search className="h-5 w-5 text-primary" />
            <span>
              {showTargetedCriteria ? "6" : formData.selectionMethod ? "5" : "4"}
              . Review Focus
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3">
            <Label>Areas Reviewed</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {REVIEW_AREAS.map((area) => (
                <div key={area.id} className="flex items-center gap-2">
                  <Checkbox
                    id={area.id}
                    checked={formData.reviewAreas.includes(area.id)}
                    onCheckedChange={() => toggleReviewArea(area.id)}
                  />
                  <Label
                    htmlFor={area.id}
                    className="cursor-pointer font-normal"
                  >
                    {area.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label>Review Outcome</Label>
            <RadioGroup
              value={formData.reviewOutcome}
              onValueChange={(value) => updateField("reviewOutcome", value)}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  value="satisfactory"
                  id="outcome-satisfactory"
                />
                <Label
                  htmlFor="outcome-satisfactory"
                  className="cursor-pointer font-normal"
                >
                  Satisfactory
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="issues" id="outcome-issues" />
                <Label
                  htmlFor="outcome-issues"
                  className="cursor-pointer font-normal"
                >
                  Issues Identified
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

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
        <Button type="submit" className="w-full sm:w-auto">
          Submit Form
        </Button>
      </div>
    </form>
  );
}
