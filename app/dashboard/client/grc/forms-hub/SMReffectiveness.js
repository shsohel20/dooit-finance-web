"use client";

import React from "react";

import { useState } from "react";
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
import { FileText, Filter, Target, ClipboardList, Search, CheckCircle2 } from "lucide-react";

const REVIEW_AREAS = [
  { id: "rationale", label: "Rationale for suspicion" },
  { id: "timeliness", label: "Timeliness of filing" },
  { id: "accuracy", label: "Accuracy of information" },
  { id: "regulatory", label: "Regulatory alignment" },
];

export default function SmrSelectionForm() {
  const [formData, setFormData] = useState({
    periodFrom: "",
    periodTo: "",
    totalSmrs: "",
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
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleReset = () => {
    setFormData({
      periodFrom: "",
      periodTo: "",
      totalSmrs: "",
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
    });
    setSubmitted(false);
  };

  const showTargetedCriteria =
    formData.selectionMethod === "targeted" || formData.selectionMethod === "mixed";

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
              <Label htmlFor="totalSmrs">Total Number of SMRs in Register</Label>
              <Input
                id="totalSmrs"
                type="number"
                min="0"
                placeholder="e.g. 150"
                value={formData.totalSmrs}
                onChange={(e) => updateField("totalSmrs", e.target.value)}
                required
              />
            </div>
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
              onValueChange={(value) => updateField("selectionMethod", value)}
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

      {/* Section 4: Sample Details */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <ClipboardList className="h-5 w-5 text-primary" />
            <span>{showTargetedCriteria ? "4" : "3"}. Sample Details</span>
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
                placeholder="e.g. 15"
                value={formData.numberOfSmrs}
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

      {/* Section 5: Review Focus */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Search className="h-5 w-5 text-primary" />
            <span>{showTargetedCriteria ? "5" : "4"}. Review Focus</span>
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
                  <Label htmlFor={area.id} className="cursor-pointer font-normal">
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
                <RadioGroupItem value="satisfactory" id="outcome-satisfactory" />
                <Label htmlFor="outcome-satisfactory" className="cursor-pointer font-normal">
                  Satisfactory
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="issues" id="outcome-issues" />
                <Label htmlFor="outcome-issues" className="cursor-pointer font-normal">
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
          className="w-full sm:w-auto bg-transparent"
        >
          Reset Form
        </Button>
        <Button type="submit" className="w-full sm:w-auto">
          {submitted ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Submitted
            </span>
          ) : (
            "Submit Form"
          )}
        </Button>
      </div>
    </form>
  );
}
