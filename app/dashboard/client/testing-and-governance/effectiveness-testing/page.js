"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, FileText, AlertTriangle } from "lucide-react";

const testTypes = [
  { id: "client-facing", label: "Client-facing personnel performance" },
  { id: "compliance-officer", label: "AML/CTF compliance officer and senior manager performance" },
  { id: "client-onboarding", label: "Client onboarding" },
  { id: "smrs", label: "Suspicious matter reports (SMRs)" },
  { id: "ttrs", label: "Threshold transaction reports (TTRs)" },
  { id: "cbm", label: "Cross border movement (CBM) reports" },
  { id: "monitoring", label: "Monitoring/alerts" },
  { id: "enhanced-cdd", label: "Enhanced customer due diligence (CDD)" },
  { id: "pre-commencement", label: "Pre-commencement customers" },
];

export default function EffectivenessTestingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // Form 1: Periodic effectiveness testing summary
  const [reportingPeriod, setReportingPeriod] = useState("");
  const [reportingFrequency, setReportingFrequency] = useState("");
  const [complianceOfficerName, setComplianceOfficerName] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [summaryFindings, setSummaryFindings] = useState("");
  const [significantIssues, setSignificantIssues] = useState("");
  const [issueDetails, setIssueDetails] = useState("");
  const [correctiveActions, setCorrectiveActions] = useState("");
  const [escalations, setEscalations] = useState("");
  const [overallAssessment, setOverallAssessment] = useState("");
  const [dateCompleted, setDateCompleted] = useState("");

  // Form 2: Review of failed assessments
  const [failedAssessments, setFailedAssessments] = useState([
    {
      id: 1,
      dateIdentified: "",
      failedTests: [],
      summaryFindings: "",
      dateReview: "",
      significantIssues: "",
      issueDetails: "",
      correctiveActions: "",
      escalated: "",
      overallEffectiveness: "",
      dateCompleted: "",
    },
  ]);

  const handleTestChange = (testId, checked) => {
    if (checked) {
      setSelectedTests([...selectedTests, testId]);
    } else {
      setSelectedTests(selectedTests.filter((id) => id !== testId));
    }
  };

  const addFailedAssessment = () => {
    setFailedAssessments([
      ...failedAssessments,
      {
        id: Date.now(),
        dateIdentified: "",
        failedTests: [],
        summaryFindings: "",
        dateReview: "",
        significantIssues: "",
        issueDetails: "",
        correctiveActions: "",
        escalated: "",
        overallEffectiveness: "",
        dateCompleted: "",
      },
    ]);
  };

  const removeFailedAssessment = (id) => {
    if (failedAssessments.length > 1) {
      setFailedAssessments(failedAssessments.filter((a) => a.id !== id));
    }
  };

  const updateFailedAssessment = (id, field, value) => {
    setFailedAssessments(
      failedAssessments.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
    );
  };

  const handleFailedTestChange = (assessmentId, testId, checked) => {
    const assessment = failedAssessments.find((a) => a.id === assessmentId);
    if (assessment) {
      const newTests = checked
        ? [...assessment.failedTests, testId]
        : assessment.failedTests.filter((id) => id !== testId);
      updateFailedAssessment(assessmentId, "failedTests", newTests);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting form data:", {
      periodicTesting: {
        reportingPeriod,
        reportingFrequency,
        complianceOfficerName,
        selectedTests,
        summaryFindings,
        significantIssues,
        issueDetails,
        correctiveActions,
        escalations,
        overallAssessment,
        dateCompleted,
      },
      failedAssessments,
    });
    alert("Form submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Periodic Effectiveness Testing Summary
          </h1>
          <p className="mt-2 text-muted-foreground">
            Use this form to consolidate results from periodic testing and review failed
            assessments.
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2].map((step) => (
              <div key={step} className="flex flex-1 items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
                    currentStep >= step
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${currentStep > step ? "bg-primary" : "bg-muted-foreground/30"}`}
                  />
                )}
              </div>
            ))}
          </div>
          {/* <div className="mt-2 flex justify-between text-sm">
            <span
              className={currentStep >= 1 ? "text-primary font-medium" : "text-muted-foreground"}
            >
              Testing Summary
            </span>
            <span
              className={currentStep >= 2 ? "text-primary font-medium" : "text-muted-foreground"}
            >
              Failed Assessments Review
            </span>
          </div> */}
        </div>

        {/* Step 1: Periodic Effectiveness Testing Summary */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Periodic Effectiveness Testing Summary</CardTitle>
                  <CardDescription>Consolidate results from periodic testing</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Reporting Period */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reportingPeriod">Reporting period (quarter/date range)</Label>
                  <Input
                    id="reportingPeriod"
                    value={reportingPeriod}
                    onChange={(e) => setReportingPeriod(e.target.value)}
                    placeholder="e.g., Q1 2026 or Jan-Mar 2026"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportingFrequency">Reporting frequency</Label>
                  <Input
                    id="reportingFrequency"
                    value={reportingFrequency}
                    onChange={(e) => setReportingFrequency(e.target.value)}
                    placeholder="e.g., Quarterly, Monthly"
                  />
                </div>
              </div>

              {/* Compliance Officer Name */}
              <div className="space-y-2">
                <Label htmlFor="complianceOfficerName">
                  Name of AML/CTF compliance officer completing report
                </Label>
                <Input
                  id="complianceOfficerName"
                  value={complianceOfficerName}
                  onChange={(e) => setComplianceOfficerName(e.target.value)}
                  placeholder="Enter compliance officer name"
                />
              </div>

              <Separator />

              {/* Tests Done */}
              <div className="space-y-3">
                <Label>Tests done (select all that apply)</Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {testTypes.map((test) => (
                    <div key={test.id} className="flex items-start space-x-3">
                      <Checkbox
                        id={`test-${test.id}`}
                        checked={selectedTests.includes(test.id)}
                        onCheckedChange={(checked) => handleTestChange(test.id, checked)}
                      />
                      <Label
                        htmlFor={`test-${test.id}`}
                        className="text-sm font-normal leading-tight cursor-pointer"
                      >
                        {test.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Summary of Key Findings */}
              <div className="space-y-2">
                <Label htmlFor="summaryFindings">Summary of key findings</Label>
                <Textarea
                  id="summaryFindings"
                  value={summaryFindings}
                  onChange={(e) => setSummaryFindings(e.target.value)}
                  placeholder="Provide a summary of the key findings from the testing..."
                  rows={4}
                />
              </div>

              {/* Significant Issues */}
              <div className="space-y-3">
                <Label>Significant issues identified</Label>
                <RadioGroup
                  value={significantIssues}
                  onValueChange={setSignificantIssues}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="issues-yes" />
                    <Label htmlFor="issues-yes" className="font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="issues-no" />
                    <Label htmlFor="issues-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>

                {significantIssues === "yes" && (
                  <div className="space-y-2 pl-0 mt-3">
                    <Label htmlFor="issueDetails">Details of significant issues</Label>
                    <Textarea
                      id="issueDetails"
                      value={issueDetails}
                      onChange={(e) => setIssueDetails(e.target.value)}
                      placeholder="Provide details of the significant issues identified..."
                      rows={3}
                    />
                  </div>
                )}
              </div>

              {/* Corrective Actions */}
              <div className="space-y-2">
                <Label htmlFor="correctiveActions">
                  Corrective actions (list with owners and due dates)
                </Label>
                <Textarea
                  id="correctiveActions"
                  value={correctiveActions}
                  onChange={(e) => setCorrectiveActions(e.target.value)}
                  placeholder="List corrective actions with responsible owners and due dates..."
                  rows={4}
                />
              </div>

              {/* Escalations */}
              <div className="space-y-2">
                <Label htmlFor="escalations">Escalations made to senior manager</Label>
                <Textarea
                  id="escalations"
                  value={escalations}
                  onChange={(e) => setEscalations(e.target.value)}
                  placeholder="Detail any escalations made to senior management..."
                  rows={3}
                />
              </div>

              <Separator />

              {/* Overall Assessment */}
              <div className="space-y-3">
                <Label>Overall assessment of effectiveness</Label>
                <RadioGroup
                  value={overallAssessment}
                  onValueChange={setOverallAssessment}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="effective" id="assessment-effective" />
                    <Label htmlFor="assessment-effective" className="font-normal cursor-pointer">
                      Effective (pass)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-effective" id="assessment-not-effective" />
                    <Label
                      htmlFor="assessment-not-effective"
                      className="font-normal cursor-pointer"
                    >
                      Not effective (fail)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Date Completed */}
              <div className="space-y-2">
                <Label htmlFor="dateCompleted">Date completed</Label>
                <Input
                  id="dateCompleted"
                  type="date"
                  value={dateCompleted}
                  onChange={(e) => setDateCompleted(e.target.value)}
                  className="max-w-xs"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Review of Failed Assessments */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle>Review of Failed Assessments</CardTitle>
                  <CardDescription>
                    Document and track failed assessments and corrective actions. Repeat the process
                    with new corrective actions if the effectiveness test fails.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {failedAssessments.map((assessment, index) => (
                <div key={assessment.id} className="space-y-6">
                  {index > 0 && <Separator className="my-8" />}

                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Failed Assessment Review {index + 1}</h3>
                    {failedAssessments.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFailedAssessment(assessment.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>

                  {/* Date Failure Identified */}
                  <div className="space-y-2">
                    <Label htmlFor={`dateIdentified-${assessment.id}`}>
                      Date failure identified
                    </Label>
                    <Input
                      id={`dateIdentified-${assessment.id}`}
                      type="date"
                      value={assessment.dateIdentified}
                      onChange={(e) =>
                        updateFailedAssessment(assessment.id, "dateIdentified", e.target.value)
                      }
                      className="max-w-xs"
                    />
                  </div>

                  {/* Which Assessment Failed */}
                  <div className="space-y-3">
                    <Label>Which assessment failed? (Select all that apply)</Label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {testTypes.map((test) => (
                        <div key={test.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={`failed-${assessment.id}-${test.id}`}
                            checked={assessment.failedTests.includes(test.id)}
                            onCheckedChange={(checked) =>
                              handleFailedTestChange(assessment.id, test.id, checked)
                            }
                          />
                          <Label
                            htmlFor={`failed-${assessment.id}-${test.id}`}
                            className="text-sm font-normal leading-tight cursor-pointer"
                          >
                            {test.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary of Findings */}
                  <div className="space-y-2">
                    <Label htmlFor={`summaryFindings-${assessment.id}`}>Summary of findings</Label>
                    <Textarea
                      id={`summaryFindings-${assessment.id}`}
                      value={assessment.summaryFindings}
                      onChange={(e) =>
                        updateFailedAssessment(assessment.id, "summaryFindings", e.target.value)
                      }
                      placeholder="Provide a summary of the findings from the failed assessment..."
                      rows={4}
                    />
                  </div>

                  {/* Date of Review */}
                  <div className="space-y-2">
                    <Label htmlFor={`dateReview-${assessment.id}`}>Date of review</Label>
                    <Input
                      id={`dateReview-${assessment.id}`}
                      type="date"
                      value={assessment.dateReview}
                      onChange={(e) =>
                        updateFailedAssessment(assessment.id, "dateReview", e.target.value)
                      }
                      className="max-w-xs"
                    />
                  </div>

                  {/* Significant Issues Identified */}
                  <div className="space-y-3">
                    <Label>Significant issues identified</Label>
                    <RadioGroup
                      value={assessment.significantIssues}
                      onValueChange={(value) =>
                        updateFailedAssessment(assessment.id, "significantIssues", value)
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`sig-issues-yes-${assessment.id}`} />
                        <Label
                          htmlFor={`sig-issues-yes-${assessment.id}`}
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`sig-issues-no-${assessment.id}`} />
                        <Label
                          htmlFor={`sig-issues-no-${assessment.id}`}
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>

                    {assessment.significantIssues === "yes" && (
                      <div className="space-y-2 mt-3">
                        <Label htmlFor={`issueDetails-${assessment.id}`}>Details</Label>
                        <Textarea
                          id={`issueDetails-${assessment.id}`}
                          value={assessment.issueDetails}
                          onChange={(e) =>
                            updateFailedAssessment(assessment.id, "issueDetails", e.target.value)
                          }
                          placeholder="Provide details of the significant issues..."
                          rows={3}
                        />
                      </div>
                    )}
                  </div>

                  {/* Corrective Actions */}
                  <div className="space-y-2">
                    <Label htmlFor={`correctiveActions-${assessment.id}`}>
                      Corrective actions (list with owners and due dates)
                    </Label>
                    <Textarea
                      id={`correctiveActions-${assessment.id}`}
                      value={assessment.correctiveActions}
                      onChange={(e) =>
                        updateFailedAssessment(assessment.id, "correctiveActions", e.target.value)
                      }
                      placeholder="List corrective actions with responsible owners and due dates..."
                      rows={4}
                    />
                  </div>

                  {/* Escalations Made to Senior Manager */}
                  <div className="space-y-3">
                    <Label>Escalations made to senior manager</Label>
                    <RadioGroup
                      value={assessment.escalated}
                      onValueChange={(value) =>
                        updateFailedAssessment(assessment.id, "escalated", value)
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`escalated-yes-${assessment.id}`} />
                        <Label
                          htmlFor={`escalated-yes-${assessment.id}`}
                          className="font-normal cursor-pointer"
                        >
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`escalated-no-${assessment.id}`} />
                        <Label
                          htmlFor={`escalated-no-${assessment.id}`}
                          className="font-normal cursor-pointer"
                        >
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Overall Effectiveness of Reassessment */}
                  <div className="space-y-3">
                    <Label>Overall effectiveness of reassessment</Label>
                    <RadioGroup
                      value={assessment.overallEffectiveness}
                      onValueChange={(value) =>
                        updateFailedAssessment(assessment.id, "overallEffectiveness", value)
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="effective"
                          id={`effectiveness-pass-${assessment.id}`}
                        />
                        <Label
                          htmlFor={`effectiveness-pass-${assessment.id}`}
                          className="font-normal cursor-pointer"
                        >
                          Effective (pass)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="not-effective"
                          id={`effectiveness-fail-${assessment.id}`}
                        />
                        <Label
                          htmlFor={`effectiveness-fail-${assessment.id}`}
                          className="font-normal cursor-pointer"
                        >
                          Not effective (fail)
                        </Label>
                      </div>
                    </RadioGroup>
                    {assessment.overallEffectiveness === "not-effective" && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Repeat the process with new corrective actions if the effectiveness test
                        fails.
                      </p>
                    )}
                  </div>

                  {/* Date Completed */}
                  <div className="space-y-2">
                    <Label htmlFor={`dateCompleted-${assessment.id}`}>Date completed</Label>
                    <Input
                      id={`dateCompleted-${assessment.id}`}
                      type="date"
                      value={assessment.dateCompleted}
                      onChange={(e) =>
                        updateFailedAssessment(assessment.id, "dateCompleted", e.target.value)
                      }
                      className="max-w-xs"
                    />
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addFailedAssessment}
                className="w-full bg-transparent"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Another Failed Assessment Review
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>Next</Button>
          ) : (
            <Button onClick={handleSubmit}>Submit Form</Button>
          )}
        </div>

        {/* Version info */}
        <p className="mt-8 text-center text-xs text-muted-foreground">
          AUSTRAC version 29/01/2026 | Internal version 1.0
        </p>
      </div>
    </div>
  );
}
