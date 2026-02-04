"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, FileText } from "lucide-react";

export default function AnnualReportForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 12;

  const [formData, setFormData] = useState({
    // Section 1
    dateOfReport: "",
    reportingPeriodCovered: "",
    preparedByName: "",
    preparedByPosition: "",
    reviewedBy: "",
    // Section 2
    recommendations: "",
    mattersToNote: "",
    // Section 3
    keyActivitiesAndEvents: "",
    // Section 4
    personnelTrainingProvided: "",
    capabilityGaps: "",
    // Section 5
    smrCount: "",
    ttrCount: "",
    cbmCount: "",
    internalEscalationsCount: "",
    uarCount: "",
    highRiskClientsCount: "",
    complexClientsCount: "",
    // Section 6
    individualsHighRisk: "",
    individualsComments: "",
    soleTradersHighRisk: "",
    soleTradersComments: "",
    bodiesCorporateHighRisk: "",
    bodiesCorporateComments: "",
    trustsHighRisk: "",
    trustsComments: "",
    governmentBodiesHighRisk: "",
    governmentBodiesComments: "",
    // Section 8 - Client Onboarding
    onboardingIndividualsTested: "",
    onboardingIndividualsCorrect: "",
    onboardingSoleTradersTested: "",
    onboardingSoleTradersCorrect: "",
    onboardingBodiesCorporateTested: "",
    onboardingBodiesCorporateCorrect: "",
    onboardingTrustsTested: "",
    onboardingTrustsCorrect: "",
    onboardingGovernmentTested: "",
    onboardingGovernmentCorrect: "",
    // Section 8 - Client Verification
    verificationIndividualsTested: "",
    verificationIndividualsCorrect: "",
    verificationSoleTradersTested: "",
    verificationSoleTradersCorrect: "",
    verificationBodiesCorporateTested: "",
    verificationBodiesCorporateCorrect: "",
    verificationTrustsTested: "",
    verificationTrustsCorrect: "",
    verificationGovernmentTested: "",
    verificationGovernmentCorrect: "",
    // Section 8 - SMR Quality Review
    smrInfoAccurate: null,
    smrRequiredInfo: null,
    smrTimely: null,
    // Section 8 - CBM Quality Review
    cbmInfoAccurate: null,
    cbmRequiredInfo: null,
    cbmTimely: null,
    // Section 8 - TTR Quality Review
    ttrInfoAccurate: null,
    ttrRequiredInfo: null,
    ttrTimely: null,
    // Section 8 - Assurance Activities
    internalAssuranceReviews: "",
    independentEvaluationOutcomes: "",
    austracEngagementFeedback: "",
    // Section 9
    deficienciesBreaches: "",
    impactOnMLTFRisk: "",
    actionsTakenPlanned: "",
    // Section 10
    conclusionOnEffectiveness: "",
    // Section 12
    preparedBySignName: "",
    preparedBySignDate: "",
    reviewedBySignName: "",
    reviewedBySignDate: "",
    approvedBySignName: "",
    approvedBySignDate: "",
  });

  const [programChanges, setProgramChanges] = useState([
    { id: "1", areaOfChange: "", description: "", reason: "", dateImplemented: "" },
  ]);

  const [smrTests, setSmrTests] = useState([
    { id: "1", austracRef: "", dateGroundsFormed: "", dateSubmission: "" },
  ]);

  const [cbmTests, setCbmTests] = useState([
    {
      id: "1",
      austracRef: "",
      dateCBMOccurred: "",
      dateCBMSubmitted: "",
      qualityReviewOutcome: "",
      austracCommunication: "",
    },
  ]);

  const [ttrTests, setTtrTests] = useState([
    {
      id: "1",
      austracRef: "",
      dateThresholdOccurred: "",
      dateTTRSubmitted: "",
      qualityReviewOutcome: "",
      austracCommunication: "",
    },
  ]);

  const [attachments, setAttachments] = useState([{ id: "1", description: "" }]);

  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addProgramChange = () => {
    setProgramChanges([
      ...programChanges,
      {
        id: Date.now().toString(),
        areaOfChange: "",
        description: "",
        reason: "",
        dateImplemented: "",
      },
    ]);
  };

  const removeProgramChange = (id) => {
    if (programChanges.length > 1) {
      setProgramChanges(programChanges.filter((item) => item.id !== id));
    }
  };

  const updateProgramChange = (id, field, value) => {
    setProgramChanges(
      programChanges.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const addSmrTest = () => {
    setSmrTests([
      ...smrTests,
      { id: Date.now().toString(), austracRef: "", dateGroundsFormed: "", dateSubmission: "" },
    ]);
  };

  const removeSmrTest = (id) => {
    if (smrTests.length > 1) {
      setSmrTests(smrTests.filter((item) => item.id !== id));
    }
  };

  const updateSmrTest = (id, field, value) => {
    setSmrTests(smrTests.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addCbmTest = () => {
    setCbmTests([
      ...cbmTests,
      {
        id: Date.now().toString(),
        austracRef: "",
        dateCBMOccurred: "",
        dateCBMSubmitted: "",
        qualityReviewOutcome: "",
        austracCommunication: "",
      },
    ]);
  };

  const removeCbmTest = (id) => {
    if (cbmTests.length > 1) {
      setCbmTests(cbmTests.filter((item) => item.id !== id));
    }
  };

  const updateCbmTest = (id, field, value) => {
    setCbmTests(cbmTests.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addTtrTest = () => {
    setTtrTests([
      ...ttrTests,
      {
        id: Date.now().toString(),
        austracRef: "",
        dateThresholdOccurred: "",
        dateTTRSubmitted: "",
        qualityReviewOutcome: "",
        austracCommunication: "",
      },
    ]);
  };

  const removeTtrTest = (id) => {
    if (ttrTests.length > 1) {
      setTtrTests(ttrTests.filter((item) => item.id !== id));
    }
  };

  const updateTtrTest = (id, field, value) => {
    setTtrTests(ttrTests.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addAttachment = () => {
    setAttachments([...attachments, { id: Date.now().toString(), description: "" }]);
  };

  const removeAttachment = (id) => {
    if (attachments.length > 1) {
      setAttachments(attachments.filter((item) => item.id !== id));
    }
  };

  const updateAttachment = (id, value) => {
    setAttachments(
      attachments.map((item) => (item.id === id ? { ...item, description: value } : item)),
    );
  };

  const calculatePercentage = (tested, correct) => {
    const testedNum = parseInt(tested) || 0;
    const correctNum = parseInt(correct) || 0;
    if (testedNum === 0) return "0%";
    return `${Math.round((correctNum / testedNum) * 100)}%`;
  };

  const calculateTotalHighRiskClients = () => {
    return (
      (parseInt(formData.individualsHighRisk) || 0) +
      (parseInt(formData.soleTradersHighRisk) || 0) +
      (parseInt(formData.bodiesCorporateHighRisk) || 0) +
      (parseInt(formData.trustsHighRisk) || 0) +
      (parseInt(formData.governmentBodiesHighRisk) || 0)
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("Form submitted:", {
      formData,
      programChanges,
      smrTests,
      cbmTests,
      ttrTests,
      attachments,
      declarationConfirmed,
    });
    alert("Annual Report submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Annual Report to the Governing Body
            </h1>
          </div>
          <p className="text-muted-foreground">AML/CTF Program Annual Compliance Report</p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>
              Section {currentStep} of {totalSteps}
            </span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% complete</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Section 1: Report Details */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 1: Report Details</CardTitle>
              <CardDescription>Basic information about this annual report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dateOfReport">Date of report</Label>
                  <Input
                    id="dateOfReport"
                    type="date"
                    value={formData.dateOfReport}
                    onChange={(e) => handleInputChange("dateOfReport", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportingPeriodCovered">Reporting period covered</Label>
                  <Input
                    id="reportingPeriodCovered"
                    placeholder="e.g., July 2026 to July 2027"
                    value={formData.reportingPeriodCovered}
                    onChange={(e) => handleInputChange("reportingPeriodCovered", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="preparedByName">Prepared by (name)</Label>
                  <Input
                    id="preparedByName"
                    value={formData.preparedByName}
                    onChange={(e) => handleInputChange("preparedByName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preparedByPosition">Prepared by (position)</Label>
                  <Input
                    id="preparedByPosition"
                    value={formData.preparedByPosition}
                    onChange={(e) => handleInputChange("preparedByPosition", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewedBy">Reviewed by (if applicable)</Label>
                <Input
                  id="reviewedBy"
                  value={formData.reviewedBy}
                  onChange={(e) => handleInputChange("reviewedBy", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 2: Recommendations and Matters for Noting */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 2: Recommendations and Matters for Noting</CardTitle>
              <CardDescription>
                Key recommendations and important matters to bring to the attention of the governing
                body
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recommendations">Recommendations</Label>
                <Textarea
                  id="recommendations"
                  rows={6}
                  placeholder="Enter recommendations for the governing body..."
                  value={formData.recommendations}
                  onChange={(e) => handleInputChange("recommendations", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mattersToNote">Matters to note</Label>
                <Textarea
                  id="mattersToNote"
                  rows={6}
                  placeholder="Enter matters for noting..."
                  value={formData.mattersToNote}
                  onChange={(e) => handleInputChange("mattersToNote", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 3: Key Updates */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 3: Key Updates for the Reporting Period</CardTitle>
              <CardDescription>
                Summary of key AML/CTF activities and events during the reporting period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="keyActivitiesAndEvents">Key AML/CTF activities and events</Label>
                <Textarea
                  id="keyActivitiesAndEvents"
                  rows={8}
                  placeholder="Describe key AML/CTF activities and events that occurred during the reporting period..."
                  value={formData.keyActivitiesAndEvents}
                  onChange={(e) => handleInputChange("keyActivitiesAndEvents", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 4: Training Provided and Capability Assessment */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 4: Training Provided and Capability Assessment</CardTitle>
              <CardDescription>
                Details of training provided and capability gaps addressed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="personnelTrainingProvided">Personnel training provided</Label>
                <Textarea
                  id="personnelTrainingProvided"
                  rows={4}
                  placeholder="Describe training provided to personnel..."
                  value={formData.personnelTrainingProvided}
                  onChange={(e) => handleInputChange("personnelTrainingProvided", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capabilityGaps">Capability gaps and how they were addressed</Label>
                <Textarea
                  id="capabilityGaps"
                  rows={4}
                  placeholder="Describe any capability gaps identified and how they were addressed..."
                  value={formData.capabilityGaps}
                  onChange={(e) => handleInputChange("capabilityGaps", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 5: Reporting Summary */}
        {currentStep === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 5: Reporting Summary</CardTitle>
              <CardDescription>
                Number of reports submitted to AUSTRAC or internally during the reporting period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">
                        Matters reported internally or to AUSTRAC
                      </th>
                      <th className="p-3 text-left font-medium">Number of reports submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Suspicious matter reports (SMRs)</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.smrCount}
                          onChange={(e) => handleInputChange("smrCount", e.target.value)}
                          className="w-32"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Threshold transaction reports (TTRs)</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.ttrCount}
                          onChange={(e) => handleInputChange("ttrCount", e.target.value)}
                          className="w-32"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Cross-border movement reports (CBMs)</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.cbmCount}
                          onChange={(e) => handleInputChange("cbmCount", e.target.value)}
                          className="w-32"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">
                        Number of internal escalations to the AML/CTF compliance officer
                      </td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.internalEscalationsCount}
                          onChange={(e) =>
                            handleInputChange("internalEscalationsCount", e.target.value)
                          }
                          className="w-32"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Unusual activity reports (UARs)</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.uarCount}
                          onChange={(e) => handleInputChange("uarCount", e.target.value)}
                          className="w-32"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">High risk clients</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.highRiskClientsCount}
                          onChange={(e) =>
                            handleInputChange("highRiskClientsCount", e.target.value)
                          }
                          className="w-32"
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Complex clients</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.complexClientsCount}
                          onChange={(e) => handleInputChange("complexClientsCount", e.target.value)}
                          className="w-32"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 6: Client Profile Summary */}
        {currentStep === 6 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 6: Client Profile Summary</CardTitle>
              <CardDescription>Summary of high-risk clients by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Kinds of clients</th>
                      <th className="p-3 text-left font-medium">Number of high-risk clients</th>
                      <th className="p-3 text-left font-medium">Comments/trends</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Individuals</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.individualsHighRisk}
                          onChange={(e) => handleInputChange("individualsHighRisk", e.target.value)}
                          className="w-24"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={formData.individualsComments}
                          onChange={(e) => handleInputChange("individualsComments", e.target.value)}
                          placeholder="Comments..."
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Sole traders</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.soleTradersHighRisk}
                          onChange={(e) => handleInputChange("soleTradersHighRisk", e.target.value)}
                          className="w-24"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={formData.soleTradersComments}
                          onChange={(e) => handleInputChange("soleTradersComments", e.target.value)}
                          placeholder="Comments..."
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Bodies corporate</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.bodiesCorporateHighRisk}
                          onChange={(e) =>
                            handleInputChange("bodiesCorporateHighRisk", e.target.value)
                          }
                          className="w-24"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={formData.bodiesCorporateComments}
                          onChange={(e) =>
                            handleInputChange("bodiesCorporateComments", e.target.value)
                          }
                          placeholder="Comments..."
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Trusts</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.trustsHighRisk}
                          onChange={(e) => handleInputChange("trustsHighRisk", e.target.value)}
                          className="w-24"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={formData.trustsComments}
                          onChange={(e) => handleInputChange("trustsComments", e.target.value)}
                          placeholder="Comments..."
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Government bodies</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          value={formData.governmentBodiesHighRisk}
                          onChange={(e) =>
                            handleInputChange("governmentBodiesHighRisk", e.target.value)
                          }
                          className="w-24"
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          value={formData.governmentBodiesComments}
                          onChange={(e) =>
                            handleInputChange("governmentBodiesComments", e.target.value)
                          }
                          placeholder="Comments..."
                        />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/50 font-medium">
                      <td className="p-3">Total high-risk clients:</td>
                      <td className="p-3">{calculateTotalHighRiskClients()}</td>
                      <td className="p-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 7: AML/CTF Program Changes */}
        {currentStep === 7 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 7: AML/CTF Program Changes</CardTitle>
              <CardDescription>
                Changes made to the AML/CTF program during the reporting period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {programChanges.map((change, index) => (
                  <div key={change.id} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-medium">Change {index + 1}</span>
                      {programChanges.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeProgramChange(change.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Area of change</Label>
                        <Input
                          value={change.areaOfChange}
                          onChange={(e) =>
                            updateProgramChange(change.id, "areaOfChange", e.target.value)
                          }
                          placeholder="e.g., Risk assessment"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date implemented</Label>
                        <Input
                          type="date"
                          value={change.dateImplemented}
                          onChange={(e) =>
                            updateProgramChange(change.id, "dateImplemented", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Description of change</Label>
                        <Textarea
                          value={change.description}
                          onChange={(e) =>
                            updateProgramChange(change.id, "description", e.target.value)
                          }
                          placeholder="Describe the change..."
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label>Reason for change</Label>
                        <Textarea
                          value={change.reason}
                          onChange={(e) => updateProgramChange(change.id, "reason", e.target.value)}
                          placeholder="Explain why the change was made..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={addProgramChange}
                  className="w-full bg-transparent"
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Program Change
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 8: Program Effectiveness Testing */}
        {currentStep === 8 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 8: Program Effectiveness Testing and Results</CardTitle>
              <CardDescription>
                Results of testing conducted on client files and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Client Onboarding File Testing */}
              <div>
                <h3 className="mb-4 font-semibold">Client onboarding file testing</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Kinds of clients</th>
                        <th className="p-2 text-left font-medium">Number of files tested</th>
                        <th className="p-2 text-left font-medium">Files completed correctly</th>
                        <th className="p-2 text-left font-medium">Percentage correct</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Individuals</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingIndividualsTested}
                            onChange={(e) =>
                              handleInputChange("onboardingIndividualsTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingIndividualsCorrect}
                            onChange={(e) =>
                              handleInputChange("onboardingIndividualsCorrect", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.onboardingIndividualsTested,
                            formData.onboardingIndividualsCorrect,
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Sole traders</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingSoleTradersTested}
                            onChange={(e) =>
                              handleInputChange("onboardingSoleTradersTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingSoleTradersCorrect}
                            onChange={(e) =>
                              handleInputChange("onboardingSoleTradersCorrect", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.onboardingSoleTradersTested,
                            formData.onboardingSoleTradersCorrect,
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Bodies corporate</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingBodiesCorporateTested}
                            onChange={(e) =>
                              handleInputChange("onboardingBodiesCorporateTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingBodiesCorporateCorrect}
                            onChange={(e) =>
                              handleInputChange("onboardingBodiesCorporateCorrect", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.onboardingBodiesCorporateTested,
                            formData.onboardingBodiesCorporateCorrect,
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Trusts</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingTrustsTested}
                            onChange={(e) =>
                              handleInputChange("onboardingTrustsTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingTrustsCorrect}
                            onChange={(e) =>
                              handleInputChange("onboardingTrustsCorrect", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.onboardingTrustsTested,
                            formData.onboardingTrustsCorrect,
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Government bodies</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingGovernmentTested}
                            onChange={(e) =>
                              handleInputChange("onboardingGovernmentTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.onboardingGovernmentCorrect}
                            onChange={(e) =>
                              handleInputChange("onboardingGovernmentCorrect", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.onboardingGovernmentTested,
                            formData.onboardingGovernmentCorrect,
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Client Verification File Testing */}
              <div>
                <h3 className="mb-4 font-semibold">Client verification file testing</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Kinds of clients</th>
                        <th className="p-2 text-left font-medium">Number of files tested</th>
                        <th className="p-2 text-left font-medium">Files completed correctly</th>
                        <th className="p-2 text-left font-medium">Percentage correct</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2">Individuals</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationIndividualsTested}
                            onChange={(e) =>
                              handleInputChange("verificationIndividualsTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationIndividualsCorrect}
                            onChange={(e) =>
                              handleInputChange("verificationIndividualsCorrect", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.verificationIndividualsTested,
                            formData.verificationIndividualsCorrect,
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Sole traders</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationSoleTradersTested}
                            onChange={(e) =>
                              handleInputChange("verificationSoleTradersTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationSoleTradersCorrect}
                            onChange={(e) =>
                              handleInputChange("verificationSoleTradersCorrect", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.verificationSoleTradersTested,
                            formData.verificationSoleTradersCorrect,
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Bodies corporate</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationBodiesCorporateTested}
                            onChange={(e) =>
                              handleInputChange("verificationBodiesCorporateTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationBodiesCorporateCorrect}
                            onChange={(e) =>
                              handleInputChange(
                                "verificationBodiesCorporateCorrect",
                                e.target.value,
                              )
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.verificationBodiesCorporateTested,
                            formData.verificationBodiesCorporateCorrect,
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Trusts</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationTrustsTested}
                            onChange={(e) =>
                              handleInputChange("verificationTrustsTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationTrustsCorrect}
                            onChange={(e) =>
                              handleInputChange("verificationTrustsCorrect", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.verificationTrustsTested,
                            formData.verificationTrustsCorrect,
                          )}
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Government bodies</td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationGovernmentTested}
                            onChange={(e) =>
                              handleInputChange("verificationGovernmentTested", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min="0"
                            value={formData.verificationGovernmentCorrect}
                            onChange={(e) =>
                              handleInputChange("verificationGovernmentCorrect", e.target.value)
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="p-2">
                          {calculatePercentage(
                            formData.verificationGovernmentTested,
                            formData.verificationGovernmentCorrect,
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SMR Testing */}
              <div>
                <h3 className="mb-4 font-semibold">Suspicious matter report (SMR) testing</h3>
                <div className="space-y-4">
                  {smrTests.map((test, index) => (
                    <div key={test.id} className="flex items-end gap-2">
                      <div className="flex-1 grid gap-2 sm:grid-cols-3">
                        <div className="space-y-1">
                          <Label className="text-xs">AUSTRAC reference number</Label>
                          <Input
                            value={test.austracRef}
                            onChange={(e) => updateSmrTest(test.id, "austracRef", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">
                            Date reasonable grounds for suspicion formed
                          </Label>
                          <Input
                            type="date"
                            value={test.dateGroundsFormed}
                            onChange={(e) =>
                              updateSmrTest(test.id, "dateGroundsFormed", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date of submission</Label>
                          <Input
                            type="date"
                            value={test.dateSubmission}
                            onChange={(e) =>
                              updateSmrTest(test.id, "dateSubmission", e.target.value)
                            }
                          />
                        </div>
                      </div>
                      {smrTests.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeSmrTest(test.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addSmrTest} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add SMR Test
                  </Button>
                </div>

                <div className="mt-4 rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">SMR quality review outcome</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Is the information accurate? Do reports contain factual statements
                        consistent with internal records?
                      </span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="smrInfoAccurate"
                            checked={formData.smrInfoAccurate === true}
                            onChange={() => handleInputChange("smrInfoAccurate", true)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="smrInfoAccurate"
                            checked={formData.smrInfoAccurate === false}
                            onChange={() => handleInputChange("smrInfoAccurate", false)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Do the reports contain all required information? Is the suspicion clearly
                        described?
                      </span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="smrRequiredInfo"
                            checked={formData.smrRequiredInfo === true}
                            onChange={() => handleInputChange("smrRequiredInfo", true)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="smrRequiredInfo"
                            checked={formData.smrRequiredInfo === false}
                            onChange={() => handleInputChange("smrRequiredInfo", false)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Was the information reported in a timely manner?
                      </span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="smrTimely"
                            checked={formData.smrTimely === true}
                            onChange={() => handleInputChange("smrTimely", true)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="smrTimely"
                            checked={formData.smrTimely === false}
                            onChange={() => handleInputChange("smrTimely", false)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 8 continued: CBM and TTR Testing */}
        {currentStep === 9 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 8: Program Effectiveness Testing (continued)</CardTitle>
              <CardDescription>
                Cross border movement and transaction threshold report testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* CBM Testing */}
              <div>
                <h3 className="mb-4 font-semibold">Cross border movement (CBM) report testing</h3>
                <div className="space-y-4">
                  {cbmTests.map((test, index) => (
                    <div key={test.id} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">CBM Test {index + 1}</span>
                        {cbmTests.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeCbmTest(test.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-1">
                          <Label className="text-xs">AUSTRAC reference number</Label>
                          <Input
                            value={test.austracRef}
                            onChange={(e) => updateCbmTest(test.id, "austracRef", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date CBM occurred</Label>
                          <Input
                            type="date"
                            value={test.dateCBMOccurred}
                            onChange={(e) =>
                              updateCbmTest(test.id, "dateCBMOccurred", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date CBM submitted</Label>
                          <Input
                            type="date"
                            value={test.dateCBMSubmitted}
                            onChange={(e) =>
                              updateCbmTest(test.id, "dateCBMSubmitted", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Quality review outcome</Label>
                          <Input
                            value={test.qualityReviewOutcome}
                            onChange={(e) =>
                              updateCbmTest(test.id, "qualityReviewOutcome", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="text-xs">AUSTRAC communication (if any)</Label>
                          <Input
                            value={test.austracCommunication}
                            onChange={(e) =>
                              updateCbmTest(test.id, "austracCommunication", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addCbmTest} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add CBM Test
                  </Button>
                </div>

                <div className="mt-4 rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">CBM report quality review outcome</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Is the information accurate? Do reports contain factual statements
                        consistent with internal records?
                      </span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cbmInfoAccurate"
                            checked={formData.cbmInfoAccurate === true}
                            onChange={() => handleInputChange("cbmInfoAccurate", true)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cbmInfoAccurate"
                            checked={formData.cbmInfoAccurate === false}
                            onChange={() => handleInputChange("cbmInfoAccurate", false)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Do the reports contain all required information?
                      </span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cbmRequiredInfo"
                            checked={formData.cbmRequiredInfo === true}
                            onChange={() => handleInputChange("cbmRequiredInfo", true)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cbmRequiredInfo"
                            checked={formData.cbmRequiredInfo === false}
                            onChange={() => handleInputChange("cbmRequiredInfo", false)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Was the information reported in a timely manner?
                      </span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cbmTimely"
                            checked={formData.cbmTimely === true}
                            onChange={() => handleInputChange("cbmTimely", true)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="cbmTimely"
                            checked={formData.cbmTimely === false}
                            onChange={() => handleInputChange("cbmTimely", false)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* TTR Testing */}
              <div>
                <h3 className="mb-4 font-semibold">Transaction threshold report (TTR) testing</h3>
                <div className="space-y-4">
                  {ttrTests.map((test, index) => (
                    <div key={test.id} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">TTR Test {index + 1}</span>
                        {ttrTests.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeTtrTest(test.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-1">
                          <Label className="text-xs">AUSTRAC reference number</Label>
                          <Input
                            value={test.austracRef}
                            onChange={(e) => updateTtrTest(test.id, "austracRef", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date transaction threshold occurred</Label>
                          <Input
                            type="date"
                            value={test.dateThresholdOccurred}
                            onChange={(e) =>
                              updateTtrTest(test.id, "dateThresholdOccurred", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Date TTR submitted</Label>
                          <Input
                            type="date"
                            value={test.dateTTRSubmitted}
                            onChange={(e) =>
                              updateTtrTest(test.id, "dateTTRSubmitted", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Quality review outcome</Label>
                          <Input
                            value={test.qualityReviewOutcome}
                            onChange={(e) =>
                              updateTtrTest(test.id, "qualityReviewOutcome", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <Label className="text-xs">AUSTRAC communication (if any)</Label>
                          <Input
                            value={test.austracCommunication}
                            onChange={(e) =>
                              updateTtrTest(test.id, "austracCommunication", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addTtrTest} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add TTR Test
                  </Button>
                </div>

                <div className="mt-4 rounded-lg border p-4">
                  <h4 className="mb-3 font-medium">TTR quality review outcome</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Is the information accurate? Do reports contain factual statements
                        consistent with internal records?
                      </span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ttrInfoAccurate"
                            checked={formData.ttrInfoAccurate === true}
                            onChange={() => handleInputChange("ttrInfoAccurate", true)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ttrInfoAccurate"
                            checked={formData.ttrInfoAccurate === false}
                            onChange={() => handleInputChange("ttrInfoAccurate", false)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Do reports contain all required information?</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ttrRequiredInfo"
                            checked={formData.ttrRequiredInfo === true}
                            onChange={() => handleInputChange("ttrRequiredInfo", true)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ttrRequiredInfo"
                            checked={formData.ttrRequiredInfo === false}
                            onChange={() => handleInputChange("ttrRequiredInfo", false)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Was information reported in a timely manner?</span>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ttrTimely"
                            checked={formData.ttrTimely === true}
                            onChange={() => handleInputChange("ttrTimely", true)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">Yes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="ttrTimely"
                            checked={formData.ttrTimely === false}
                            onChange={() => handleInputChange("ttrTimely", false)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assurance Activities */}
              <div>
                <h3 className="mb-4 font-semibold">
                  Assurance activities and independent review findings
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="internalAssuranceReviews">Internal assurance reviews</Label>
                    <Textarea
                      id="internalAssuranceReviews"
                      rows={3}
                      placeholder="Summarise findings from internal assurance reviews..."
                      value={formData.internalAssuranceReviews}
                      onChange={(e) =>
                        handleInputChange("internalAssuranceReviews", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="independentEvaluationOutcomes">
                      Independent evaluation outcomes (if available)
                    </Label>
                    <Textarea
                      id="independentEvaluationOutcomes"
                      rows={3}
                      placeholder="Summarise findings from independent evaluations..."
                      value={formData.independentEvaluationOutcomes}
                      onChange={(e) =>
                        handleInputChange("independentEvaluationOutcomes", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="austracEngagementFeedback">
                      AUSTRAC engagement or feedback (if any)
                    </Label>
                    <Textarea
                      id="austracEngagementFeedback"
                      rows={3}
                      placeholder="Summarise any AUSTRAC engagement or feedback..."
                      value={formData.austracEngagementFeedback}
                      onChange={(e) =>
                        handleInputChange("austracEngagementFeedback", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 9: Record Outcomes */}
        {currentStep === 10 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 9: Record Outcomes</CardTitle>
              <CardDescription>Document deficiencies, breaches, and actions taken</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deficienciesBreaches">
                  Deficiencies, breaches or recurring issues identified
                </Label>
                <Textarea
                  id="deficienciesBreaches"
                  rows={4}
                  placeholder="Describe any deficiencies, breaches or recurring issues identified..."
                  value={formData.deficienciesBreaches}
                  onChange={(e) => handleInputChange("deficienciesBreaches", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="impactOnMLTFRisk">
                  Impact on money laundering/terrorism finance (ML/TF) risk
                </Label>
                <Textarea
                  id="impactOnMLTFRisk"
                  rows={4}
                  placeholder="Describe the impact on ML/TF risk..."
                  value={formData.impactOnMLTFRisk}
                  onChange={(e) => handleInputChange("impactOnMLTFRisk", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="actionsTakenPlanned">Actions taken/planned</Label>
                <Textarea
                  id="actionsTakenPlanned"
                  rows={4}
                  placeholder="Describe actions taken or planned to address issues..."
                  value={formData.actionsTakenPlanned}
                  onChange={(e) => handleInputChange("actionsTakenPlanned", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 10: Conclusion on Program Effectiveness */}
        {currentStep === 11 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 10: Conclusion on Program Effectiveness</CardTitle>
              <CardDescription>
                Overall assessment of the AML/CTF program effectiveness
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="conclusionOnEffectiveness">Record details here</Label>
                <Textarea
                  id="conclusionOnEffectiveness"
                  rows={8}
                  placeholder="Provide an overall conclusion on the effectiveness of the AML/CTF program..."
                  value={formData.conclusionOnEffectiveness}
                  onChange={(e) => handleInputChange("conclusionOnEffectiveness", e.target.value)}
                />
              </div>

              {/* Section 11: Attachments */}
              <div className="pt-6 border-t">
                <h3 className="mb-4 font-semibold">Section 11: Attachments</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Attach all documents referred to in this report
                </p>
                <div className="space-y-3">
                  {attachments.map((attachment, index) => (
                    <div key={attachment.id} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground w-8">{index + 1}.</span>
                      <Input
                        value={attachment.description}
                        onChange={(e) => updateAttachment(attachment.id, e.target.value)}
                        placeholder="Document name or description"
                        className="flex-1"
                      />
                      {attachments.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeAttachment(attachment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addAttachment} size="sm">
                    <Plus className="mr-2 h-4 w-4" /> Add Attachment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 12: Declaration and Sign-off */}
        {currentStep === 12 && (
          <Card>
            <CardHeader>
              <CardTitle>Section 12: Declaration and Sign-off</CardTitle>
              <CardDescription>Confirm accuracy and complete sign-off</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="declarationConfirmed"
                    checked={declarationConfirmed}
                    onCheckedChange={(checked) => setDeclarationConfirmed(checked)}
                  />
                  <label
                    htmlFor="declarationConfirmed"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I confirm that the information provided in this report is accurate and complete.
                    The report reflects the practice&apos;s AML/CTF activities, obligations and
                    program performance for the reporting period.
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-3 text-left font-medium">Role</th>
                      <th className="p-3 text-left font-medium">Name</th>
                      <th className="p-3 text-left font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3">Report prepared by:</td>
                      <td className="p-3">
                        <Input
                          value={formData.preparedBySignName}
                          onChange={(e) => handleInputChange("preparedBySignName", e.target.value)}
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="date"
                          value={formData.preparedBySignDate}
                          onChange={(e) => handleInputChange("preparedBySignDate", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Reviewed by (if applicable):</td>
                      <td className="p-3">
                        <Input
                          value={formData.reviewedBySignName}
                          onChange={(e) => handleInputChange("reviewedBySignName", e.target.value)}
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="date"
                          value={formData.reviewedBySignDate}
                          onChange={(e) => handleInputChange("reviewedBySignDate", e.target.value)}
                        />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3">Approved by (governing body representative):</td>
                      <td className="p-3">
                        <Input
                          value={formData.approvedBySignName}
                          onChange={(e) => handleInputChange("approvedBySignName", e.target.value)}
                        />
                      </td>
                      <td className="p-3">
                        <Input
                          type="date"
                          value={formData.approvedBySignDate}
                          onChange={(e) => handleInputChange("approvedBySignDate", e.target.value)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>
          <div className="flex gap-2">
            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!declarationConfirmed}>
                Submit Report
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
