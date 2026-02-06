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
import { Plus, Trash2 } from "lucide-react";

export default function ComplianceOfficerDueDiligenceForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  // Step 1: Candidate Information
  const [candidateName, setCandidateName] = useState("");
  const [dateOfPDD, setDateOfPDD] = useState("");

  // Step 2: Accounting Professional Association Check
  const [step2Verification, setStep2Verification] = useState({
    membership: { id: "membership", attached: false, verifiedBy: "", dateVerified: "" },
    criminalHistory: { id: "criminalHistory", attached: false, verifiedBy: "", dateVerified: "" },
  });

  // Step 3: Additional Information
  const [step3Verification, setStep3Verification] = useState({
    identification: { id: "identification", attached: false, verifiedBy: "", dateVerified: "" },
    criminalHistory: { id: "criminalHistory", attached: false, verifiedBy: "", dateVerified: "" },
    adverseMedia: { id: "adverseMedia", attached: false, verifiedBy: "", dateVerified: "" },
    referenceCheck: { id: "referenceCheck", attached: false, verifiedBy: "", dateVerified: "" },
    other: { id: "other", attached: false, verifiedBy: "", dateVerified: "" },
    writtenCommitment: {
      id: "writtenCommitment",
      attached: false,
      verifiedBy: "",
      dateVerified: "",
    },
    statutoryDeclaration: {
      id: "statutoryDeclaration",
      attached: false,
      verifiedBy: "",
      dateVerified: "",
    },
    bankruptcySearch: { id: "bankruptcySearch", attached: false, verifiedBy: "", dateVerified: "" },
  });

  // Photo ID details
  const [photoIdDetails, setPhotoIdDetails] = useState({
    legalName: "",
    otherNames: "",
    dateOfBirth: "",
    residentialAddress: "",
    documentType: "",
    expiryDate: "",
    uniqueIdentifier: "",
  });

  const [otherDocuments, setOtherDocuments] = useState("");

  // Step 4: Eligibility Assessment
  const [eligibility, setEligibility] = useState({
    australianResident: "",
    managementPosition: "",
    sufficientAuthority: "",
  });
  const [eligibilitySupporting, setEligibilitySupporting] = useState({
    australianResident: "",
    managementPosition: "",
    sufficientAuthority: "",
  });
  const [eligibilityReasoning, setEligibilityReasoning] = useState("");

  // Step 5: Fit and Proper Assessment
  const [fitAndProper, setFitAndProper] = useState({
    capability: "",
    honesty: "",
    conflictsOfInterest: "",
    criminalHistory: "",
    adverseFindings: "",
    financialSoundness: "",
  });
  const [fitAndProperSupporting, setFitAndProperSupporting] = useState({
    capability: "",
    honesty: "",
    conflictsOfInterest: "",
    criminalHistory: "",
    adverseFindings: "",
    financialSoundness: "",
  });
  const [fitAndProperExplanation, setFitAndProperExplanation] = useState("");

  // Step 6: Governing Body / Senior Manager
  const [governingBodyRole, setGoverningBodyRole] = useState({
    governingBody: "",
    seniorManager: "",
  });
  const [governingBodySupporting, setGoverningBodySupporting] = useState({
    governingBody: "",
    seniorManager: "",
  });

  // Step 7: Overall Decision
  const [overallDecision, setOverallDecision] = useState("");
  const [decisionRationale, setDecisionRationale] = useState("");
  const [assessedBy, setAssessedBy] = useState("");
  const [dateOfAssessment, setDateOfAssessment] = useState("");
  const [approvedBy, setApprovedBy] = useState("");

  // Step 8: AUSTRAC Notification
  const [austracNotifications, setAustracNotifications] = useState([
    { id: "1", name: "", dateAppointed: "", dateNotified: "", submittedBy: "", notes: "" },
  ]);

  // Step 9: Ongoing Due Diligence
  const [ongoingReviews, setOngoingReviews] = useState([
    { id: "1", reviewDate: "", reason: "", keyFindings: "", actionTaken: "", reviewedBy: "" },
  ]);

  // Step 10: Record Keeping
  const [recordKeeping, setRecordKeeping] = useState({
    evidenceAttached: false,
    recordsSaved: false,
  });

  const updateStep2Verification = (key, field, value) => {
    setStep2Verification((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const updateStep3Verification = (key, field, value) => {
    setStep3Verification((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const addAustracNotification = () => {
    setAustracNotifications((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: "",
        dateAppointed: "",
        dateNotified: "",
        submittedBy: "",
        notes: "",
      },
    ]);
  };

  const removeAustracNotification = (id) => {
    setAustracNotifications((prev) => prev.filter((row) => row.id !== id));
  };

  const updateAustracNotification = (id, field, value) => {
    setAustracNotifications((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const addOngoingReview = () => {
    setOngoingReviews((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        reviewDate: "",
        reason: "",
        keyFindings: "",
        actionTaken: "",
        reviewedBy: "",
      },
    ]);
  };

  const removeOngoingReview = (id) => {
    setOngoingReviews((prev) => prev.filter((row) => row.id !== id));
  };

  const updateOngoingReview = (id, field, value) => {
    setOngoingReviews((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="container  px-4">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary text-primary-foreground rounded-t-lg py-4">
            <CardTitle className="text-2xl">
              Personnel Due Diligence for AML/CTF Compliance Officer
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Use this form to conduct personnel due diligence on and appoint an AML/CTF compliance
              officer
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-sm font-medium text-muted-foreground">
                  {Math.round((currentStep / totalSteps) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Candidate Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Step 1: Candidate Information
                </h3>
                <p className="text-sm text-muted-foreground">Complete the following fields.</p>

                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="candidateName">Candidate name</Label>
                    <Input
                      id="candidateName"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="Enter candidate's full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input
                      id="position"
                      value="AML/CTF compliance officer"
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfPDD">Date of PDD</Label>
                    <Input
                      id="dateOfPDD"
                      type="date"
                      value={dateOfPDD}
                      onChange={(e) => setDateOfPDD(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Accounting Professional Association Check */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Step 2: Check if the candidate is a member of an accounting professional
                  association
                </h3>
                <p className="text-sm text-muted-foreground">
                  Check if the candidate is currently a member of one of the accounting professional
                  associations, specifically CPA Australia, Chartered Accountants Australia & New
                  Zealand or the Institute of Public Accountants. If you know the candidate is not a
                  member, you can skip this step.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-3 text-left text-sm font-medium">
                          Required information
                        </th>
                        <th className="border p-3 text-left text-sm font-medium">
                          Description/process notes
                        </th>
                        <th className="border p-3 text-center text-sm font-medium w-20">
                          Attached
                        </th>
                        <th className="border p-3 text-center text-sm font-medium w-28">
                          Verified by
                        </th>
                        <th className="border p-3 text-center text-sm font-medium w-32">
                          Date verified
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-3 text-sm font-medium">
                          Membership of accounting professional association
                        </td>
                        <td className="border p-3 text-sm text-muted-foreground">
                          Verify they are a member by searching the register of members on the
                          relevant professional association&apos;s website.
                        </td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step2Verification.membership.attached}
                            onCheckedChange={(checked) =>
                              updateStep2Verification("membership", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step2Verification.membership.verifiedBy}
                            onChange={(e) =>
                              updateStep2Verification("membership", "verifiedBy", e.target.value)
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step2Verification.membership.dateVerified}
                            onChange={(e) =>
                              updateStep2Verification("membership", "dateVerified", e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 text-sm font-medium">
                          National criminal history check
                        </td>
                        <td className="border p-3 text-sm text-muted-foreground">
                          Complete a national criminal history check through an approved provider.
                          Ensure the results are from within the last 6 months.
                        </td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step2Verification.criminalHistory.attached}
                            onCheckedChange={(checked) =>
                              updateStep2Verification("criminalHistory", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step2Verification.criminalHistory.verifiedBy}
                            onChange={(e) =>
                              updateStep2Verification(
                                "criminalHistory",
                                "verifiedBy",
                                e.target.value,
                              )
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step2Verification.criminalHistory.dateVerified}
                            onChange={(e) =>
                              updateStep2Verification(
                                "criminalHistory",
                                "dateVerified",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Step 3: Collect and verify additional information */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Step 3: Collect and verify additional information
                </h3>
                <p className="text-sm text-muted-foreground">
                  Skip this step if you have completed step 2 and you have no reasonable doubts
                  about their integrity, identity, competence and independence to perform the role.
                  Otherwise, complete any processes below that you require.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-3 text-left text-sm font-medium">
                          Required information
                        </th>
                        <th className="border p-3 text-left text-sm font-medium">
                          Description/process notes
                        </th>
                        <th className="border p-3 text-center text-sm font-medium w-20">
                          Attached
                        </th>
                        <th className="border p-3 text-center text-sm font-medium w-28">
                          Verified by
                        </th>
                        <th className="border p-3 text-center text-sm font-medium w-32">
                          Date verified
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-3 text-sm font-medium">Identification</td>
                        <td className="border p-3 text-sm text-muted-foreground">
                          Follow the Identify personnel process. Record in Photo identification
                          details table below.
                        </td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step3Verification.identification.attached}
                            onCheckedChange={(checked) =>
                              updateStep3Verification("identification", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step3Verification.identification.verifiedBy}
                            onChange={(e) =>
                              updateStep3Verification(
                                "identification",
                                "verifiedBy",
                                e.target.value,
                              )
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step3Verification.identification.dateVerified}
                            onChange={(e) =>
                              updateStep3Verification(
                                "identification",
                                "dateVerified",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 text-sm font-medium">
                          National criminal history check
                        </td>
                        <td className="border p-3 text-sm text-muted-foreground">
                          Complete a national criminal history check through an approved provider.
                          Ensure the results are from within the last 6 months.
                        </td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step3Verification.criminalHistory.attached}
                            onCheckedChange={(checked) =>
                              updateStep3Verification("criminalHistory", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step3Verification.criminalHistory.verifiedBy}
                            onChange={(e) =>
                              updateStep3Verification(
                                "criminalHistory",
                                "verifiedBy",
                                e.target.value,
                              )
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step3Verification.criminalHistory.dateVerified}
                            onChange={(e) =>
                              updateStep3Verification(
                                "criminalHistory",
                                "dateVerified",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 text-sm font-medium">
                          Adverse media search results
                        </td>
                        <td className="border p-3 text-sm text-muted-foreground">
                          Follow the Adverse media check process.
                        </td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step3Verification.adverseMedia.attached}
                            onCheckedChange={(checked) =>
                              updateStep3Verification("adverseMedia", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step3Verification.adverseMedia.verifiedBy}
                            onChange={(e) =>
                              updateStep3Verification("adverseMedia", "verifiedBy", e.target.value)
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step3Verification.adverseMedia.dateVerified}
                            onChange={(e) =>
                              updateStep3Verification(
                                "adverseMedia",
                                "dateVerified",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 text-sm font-medium">
                          Reference of employment check
                        </td>
                        <td className="border p-3 text-sm text-muted-foreground"></td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step3Verification.referenceCheck.attached}
                            onCheckedChange={(checked) =>
                              updateStep3Verification("referenceCheck", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step3Verification.referenceCheck.verifiedBy}
                            onChange={(e) =>
                              updateStep3Verification(
                                "referenceCheck",
                                "verifiedBy",
                                e.target.value,
                              )
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step3Verification.referenceCheck.dateVerified}
                            onChange={(e) =>
                              updateStep3Verification(
                                "referenceCheck",
                                "dateVerified",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 text-sm font-medium">Other (specify)</td>
                        <td className="border p-3 text-sm text-muted-foreground"></td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step3Verification.other.attached}
                            onCheckedChange={(checked) =>
                              updateStep3Verification("other", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step3Verification.other.verifiedBy}
                            onChange={(e) =>
                              updateStep3Verification("other", "verifiedBy", e.target.value)
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step3Verification.other.dateVerified}
                            onChange={(e) =>
                              updateStep3Verification("other", "dateVerified", e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 text-sm font-medium">
                          Written commitment from governing body
                        </td>
                        <td className="border p-3 text-sm text-muted-foreground">
                          Confirm the governing body has provided a signed statement that: the
                          AML/CTF compliance officer has sufficient independence and authority; they
                          can report compliance issues without interference; they have access to
                          necessary resources; they&apos;re empowered to address non-compliance.
                        </td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step3Verification.writtenCommitment.attached}
                            onCheckedChange={(checked) =>
                              updateStep3Verification("writtenCommitment", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step3Verification.writtenCommitment.verifiedBy}
                            onChange={(e) =>
                              updateStep3Verification(
                                "writtenCommitment",
                                "verifiedBy",
                                e.target.value,
                              )
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step3Verification.writtenCommitment.dateVerified}
                            onChange={(e) =>
                              updateStep3Verification(
                                "writtenCommitment",
                                "dateVerified",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 text-sm font-medium">Statutory declaration</td>
                        <td className="border p-3 text-sm text-muted-foreground">
                          Follow the Statutory declaration process.
                        </td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step3Verification.statutoryDeclaration.attached}
                            onCheckedChange={(checked) =>
                              updateStep3Verification("statutoryDeclaration", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step3Verification.statutoryDeclaration.verifiedBy}
                            onChange={(e) =>
                              updateStep3Verification(
                                "statutoryDeclaration",
                                "verifiedBy",
                                e.target.value,
                              )
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step3Verification.statutoryDeclaration.dateVerified}
                            onChange={(e) =>
                              updateStep3Verification(
                                "statutoryDeclaration",
                                "dateVerified",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border p-3 text-sm font-medium">
                          Bankruptcy register search
                        </td>
                        <td className="border p-3 text-sm text-muted-foreground">
                          Conduct a bankruptcy register search using the Australian Financial
                          Security Authority register.
                        </td>
                        <td className="border p-3 text-center">
                          <Checkbox
                            checked={step3Verification.bankruptcySearch.attached}
                            onCheckedChange={(checked) =>
                              updateStep3Verification("bankruptcySearch", "attached", checked)
                            }
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            value={step3Verification.bankruptcySearch.verifiedBy}
                            onChange={(e) =>
                              updateStep3Verification(
                                "bankruptcySearch",
                                "verifiedBy",
                                e.target.value,
                              )
                            }
                            placeholder="Initials"
                            className="h-8 text-sm"
                          />
                        </td>
                        <td className="border p-3">
                          <Input
                            type="date"
                            value={step3Verification.bankruptcySearch.dateVerified}
                            onChange={(e) =>
                              updateStep3Verification(
                                "bankruptcySearch",
                                "dateVerified",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h4 className="font-medium">Photo identification details</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="legalName">Legal name</Label>
                      <Input
                        id="legalName"
                        value={photoIdDetails.legalName}
                        onChange={(e) =>
                          setPhotoIdDetails((prev) => ({ ...prev, legalName: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherNames">Any other known names</Label>
                      <Input
                        id="otherNames"
                        value={photoIdDetails.otherNames}
                        onChange={(e) =>
                          setPhotoIdDetails((prev) => ({ ...prev, otherNames: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={photoIdDetails.dateOfBirth}
                        onChange={(e) =>
                          setPhotoIdDetails((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="residentialAddress">Residential address</Label>
                      <Input
                        id="residentialAddress"
                        value={photoIdDetails.residentialAddress}
                        onChange={(e) =>
                          setPhotoIdDetails((prev) => ({
                            ...prev,
                            residentialAddress: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="documentType">Type of document</Label>
                      <Input
                        id="documentType"
                        value={photoIdDetails.documentType}
                        onChange={(e) =>
                          setPhotoIdDetails((prev) => ({ ...prev, documentType: e.target.value }))
                        }
                        placeholder="e.g., Driver's licence, Passport"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={photoIdDetails.expiryDate}
                        onChange={(e) =>
                          setPhotoIdDetails((prev) => ({ ...prev, expiryDate: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="uniqueIdentifier">Unique identifier</Label>
                      <Input
                        id="uniqueIdentifier"
                        value={photoIdDetails.uniqueIdentifier}
                        onChange={(e) =>
                          setPhotoIdDetails((prev) => ({
                            ...prev,
                            uniqueIdentifier: e.target.value,
                          }))
                        }
                        placeholder="e.g., Licence number, Passport number"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherDocuments">
                    List any other documents you reviewed below
                  </Label>
                  <Textarea
                    id="otherDocuments"
                    value={otherDocuments}
                    onChange={(e) => setOtherDocuments(e.target.value)}
                    placeholder="Record details here..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Assess Eligibility */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Step 4: Assess eligibility</h3>
                <p className="text-sm text-muted-foreground">
                  The candidate must meet all below criteria to be eligible for appointment as an
                  AML/CTF compliance officer. Record your findings and any supporting information
                  for each question.
                </p>

                <div className="space-y-6">
                  {/* Australian Resident */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Are they a resident of Australia?</Label>
                      <p className="text-sm text-muted-foreground">
                        The person will be an ordinary resident of Australia if there is a degree of
                        permanence to their residence in Australia. For example, if an address is
                        included in a driver&apos;s licence.
                      </p>
                    </div>
                    <RadioGroup
                      value={eligibility.australianResident}
                      onValueChange={(value) =>
                        setEligibility((prev) => ({ ...prev, australianResident: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="resident-yes" />
                        <Label htmlFor="resident-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="resident-no" />
                        <Label htmlFor="resident-no">No</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label htmlFor="residentSupporting">Supporting information</Label>
                      <Textarea
                        id="residentSupporting"
                        value={eligibilitySupporting.australianResident}
                        onChange={(e) =>
                          setEligibilitySupporting((prev) => ({
                            ...prev,
                            australianResident: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Management Position */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">
                        Do they hold a management-level position?
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        This is usually a senior personnel member (office manager).
                      </p>
                    </div>
                    <RadioGroup
                      value={eligibility.managementPosition}
                      onValueChange={(value) =>
                        setEligibility((prev) => ({ ...prev, managementPosition: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="management-yes" />
                        <Label htmlFor="management-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="management-no" />
                        <Label htmlFor="management-no">No</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label htmlFor="managementSupporting">Supporting information</Label>
                      <Textarea
                        id="managementSupporting"
                        value={eligibilitySupporting.managementPosition}
                        onChange={(e) =>
                          setEligibilitySupporting((prev) => ({
                            ...prev,
                            managementPosition: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Sufficient Authority */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">
                        Do they have sufficient authority, independence and access to the necessary
                        resources and information?
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Check the written commitment from the governing body (if any).
                      </p>
                    </div>
                    <RadioGroup
                      value={eligibility.sufficientAuthority}
                      onValueChange={(value) =>
                        setEligibility((prev) => ({ ...prev, sufficientAuthority: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="authority-yes" />
                        <Label htmlFor="authority-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="authority-no" />
                        <Label htmlFor="authority-no">No</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label htmlFor="authoritySupporting">Supporting information</Label>
                      <Textarea
                        id="authoritySupporting"
                        value={eligibilitySupporting.sufficientAuthority}
                        onChange={(e) =>
                          setEligibilitySupporting((prev) => ({
                            ...prev,
                            sufficientAuthority: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eligibilityReasoning">
                    Describe reasoning for any eligibility finding below
                  </Label>
                  <Textarea
                    id="eligibilityReasoning"
                    value={eligibilityReasoning}
                    onChange={(e) => setEligibilityReasoning(e.target.value)}
                    placeholder="Record details here..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Fit and Proper Assessment */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Step 5: Fit and proper assessment
                </h3>
                <p className="text-sm text-muted-foreground">
                  Assess the candidate&apos;s suitability under the &apos;fit and proper&apos;
                  criteria. If the person is a member of an accounting professional association, you
                  have carried out a national criminal history check and you have no reasonable
                  doubts about their integrity or identity, you can assess the person&apos;s
                  suitability based on their capability, criminal history and any conflicts of
                  interest, and mark all other factors as suitable.
                </p>

                <div className="space-y-6">
                  {/* Capability */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Capability</Label>
                      <p className="text-sm text-muted-foreground">
                        An AML/CTF compliance officer doesn&apos;t need to be an AML/CTF expert, but
                        they must have the ability to: understand the practice&apos;s ML/TF risks;
                        apply AML/CTF policies and procedures; use training and support material
                        effectively. Consider the candidate&apos;s past performance, references and
                        training capacity.
                      </p>
                    </div>
                    <RadioGroup
                      value={fitAndProper.capability}
                      onValueChange={(value) =>
                        setFitAndProper((prev) => ({ ...prev, capability: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suitable" id="capability-suitable" />
                        <Label htmlFor="capability-suitable">Suitable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-suitable" id="capability-not-suitable" />
                        <Label htmlFor="capability-not-suitable">Not suitable</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label htmlFor="capabilitySupporting">Supporting information</Label>
                      <Textarea
                        id="capabilitySupporting"
                        value={fitAndProperSupporting.capability}
                        onChange={(e) =>
                          setFitAndProperSupporting((prev) => ({
                            ...prev,
                            capability: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Honesty, integrity and character */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Honesty, integrity and character</Label>
                      <p className="text-sm text-muted-foreground">
                        Assess based on any statutory declaration, references and your professional
                        experience with the candidate. The person should be honest, reliable and act
                        ethically.
                      </p>
                    </div>
                    <RadioGroup
                      value={fitAndProper.honesty}
                      onValueChange={(value) =>
                        setFitAndProper((prev) => ({ ...prev, honesty: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suitable" id="honesty-suitable" />
                        <Label htmlFor="honesty-suitable">Suitable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-suitable" id="honesty-not-suitable" />
                        <Label htmlFor="honesty-not-suitable">Not suitable</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label htmlFor="honestySupporting">Supporting information</Label>
                      <Textarea
                        id="honestySupporting"
                        value={fitAndProperSupporting.honesty}
                        onChange={(e) =>
                          setFitAndProperSupporting((prev) => ({
                            ...prev,
                            honesty: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Conflicts of interest */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Conflicts of interest</Label>
                      <p className="text-sm text-muted-foreground">
                        Assess based on any statutory declaration, references and your professional
                        experience with the candidate. The person should not have a conflict of
                        interest that will materially affect their ability in the role or should
                        have sufficient controls in place to help them manage any conflict of
                        interest.
                      </p>
                    </div>
                    <RadioGroup
                      value={fitAndProper.conflictsOfInterest}
                      onValueChange={(value) =>
                        setFitAndProper((prev) => ({ ...prev, conflictsOfInterest: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suitable" id="conflicts-suitable" />
                        <Label htmlFor="conflicts-suitable">Suitable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-suitable" id="conflicts-not-suitable" />
                        <Label htmlFor="conflicts-not-suitable">Not suitable</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label htmlFor="conflictsSupporting">Supporting information</Label>
                      <Textarea
                        id="conflictsSupporting"
                        value={fitAndProperSupporting.conflictsOfInterest}
                        onChange={(e) =>
                          setFitAndProperSupporting((prev) => ({
                            ...prev,
                            conflictsOfInterest: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Criminal history */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Criminal history</Label>
                      <p className="text-sm text-muted-foreground">
                        Review the national criminal history check and whether the person was
                        convicted of a serious offence. Determine if any convictions affect their
                        ability to perform AML/CTF duties.
                      </p>
                    </div>
                    <RadioGroup
                      value={fitAndProper.criminalHistory}
                      onValueChange={(value) =>
                        setFitAndProper((prev) => ({ ...prev, criminalHistory: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suitable" id="criminal-suitable" />
                        <Label htmlFor="criminal-suitable">Suitable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-suitable" id="criminal-not-suitable" />
                        <Label htmlFor="criminal-not-suitable">Not suitable</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label htmlFor="criminalSupporting">Supporting information</Label>
                      <Textarea
                        id="criminalSupporting"
                        value={fitAndProperSupporting.criminalHistory}
                        onChange={(e) =>
                          setFitAndProperSupporting((prev) => ({
                            ...prev,
                            criminalHistory: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Adverse findings */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Adverse findings</Label>
                      <p className="text-sm text-muted-foreground">
                        Assess based on any statutory declaration, references and open source
                        searches. Consider if they have been the subject of civil, criminal,
                        regulatory or disciplinary action that resulted in findings against their
                        capability to manage a practice or complete other professional activity.
                        Determine whether adverse findings affect their ability to perform duties.
                      </p>
                    </div>
                    <RadioGroup
                      value={fitAndProper.adverseFindings}
                      onValueChange={(value) =>
                        setFitAndProper((prev) => ({ ...prev, adverseFindings: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suitable" id="adverse-suitable" />
                        <Label htmlFor="adverse-suitable">Suitable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-suitable" id="adverse-not-suitable" />
                        <Label htmlFor="adverse-not-suitable">Not suitable</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label htmlFor="adverseSupporting">Supporting information</Label>
                      <Textarea
                        id="adverseSupporting"
                        value={fitAndProperSupporting.adverseFindings}
                        onChange={(e) =>
                          setFitAndProperSupporting((prev) => ({
                            ...prev,
                            adverseFindings: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Financial soundness */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">Financial soundness</Label>
                      <p className="text-sm text-muted-foreground">
                        Review the bankruptcy register search. If the person is an undischarged
                        bankrupt or under a personal insolvency agreement, assess whether this
                        affects their ability to perform duties.
                      </p>
                    </div>
                    <RadioGroup
                      value={fitAndProper.financialSoundness}
                      onValueChange={(value) =>
                        setFitAndProper((prev) => ({ ...prev, financialSoundness: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suitable" id="financial-suitable" />
                        <Label htmlFor="financial-suitable">Suitable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-suitable" id="financial-not-suitable" />
                        <Label htmlFor="financial-not-suitable">Not suitable</Label>
                      </div>
                    </RadioGroup>
                    <div className="space-y-2">
                      <Label htmlFor="financialSupporting">Supporting information</Label>
                      <Textarea
                        id="financialSupporting"
                        value={fitAndProperSupporting.financialSoundness}
                        onChange={(e) =>
                          setFitAndProperSupporting((prev) => ({
                            ...prev,
                            financialSoundness: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fitAndProperExplanation">
                    If any outcome is NOT SUITABLE, explain the findings and reasoning below
                  </Label>
                  <Textarea
                    id="fitAndProperExplanation"
                    value={fitAndProperExplanation}
                    onChange={(e) => setFitAndProperExplanation(e.target.value)}
                    placeholder="Record details here..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Step 6: Governing Body / Senior Manager Assessment */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Step 6: If also appointed as governing body or senior manager, assess eligibility
                </h3>
                <p className="text-sm text-muted-foreground">
                  The candidate must also meet all below criteria to be eligible for appointment as
                  a governing body or senior manager. Record your findings and any supporting
                  information for each question.
                </p>

                <div className="space-y-6">
                  {/* Governing Body */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">
                        Governing body - Do they have primary responsibility for governance and
                        executive level decisions?
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        For example, the person is your practice owner.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="governingBodySupporting">Supporting information</Label>
                      <Textarea
                        id="governingBodySupporting"
                        value={governingBodySupporting.governingBody}
                        onChange={(e) =>
                          setGoverningBodySupporting((prev) => ({
                            ...prev,
                            governingBody: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                    <RadioGroup
                      value={governingBodyRole.governingBody}
                      onValueChange={(value) =>
                        setGoverningBodyRole((prev) => ({ ...prev, governingBody: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="governing-yes" />
                        <Label htmlFor="governing-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="governing-no" />
                        <Label htmlFor="governing-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Senior Manager */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <div className="space-y-2">
                      <Label className="font-medium">
                        Senior manager - Can they make or influence decisions affecting the whole or
                        a substantial part of your practice?
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        For example, the person is your practice manager.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seniorManagerSupporting">Supporting information</Label>
                      <Textarea
                        id="seniorManagerSupporting"
                        value={governingBodySupporting.seniorManager}
                        onChange={(e) =>
                          setGoverningBodySupporting((prev) => ({
                            ...prev,
                            seniorManager: e.target.value,
                          }))
                        }
                        rows={2}
                      />
                    </div>
                    <RadioGroup
                      value={governingBodyRole.seniorManager}
                      onValueChange={(value) =>
                        setGoverningBodyRole((prev) => ({ ...prev, seniorManager: value }))
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="senior-yes" />
                        <Label htmlFor="senior-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="senior-no" />
                        <Label htmlFor="senior-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Overall Decision */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Step 7: Record the overall assessment and decision
                </h3>
                <p className="text-sm text-muted-foreground">
                  Record the final decision, including rationale.
                </p>

                <div className="space-y-6">
                  <div className="p-4 border rounded-lg space-y-4">
                    <Label className="font-medium">Decision</Label>
                    <RadioGroup
                      value={overallDecision}
                      onValueChange={setOverallDecision}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="suitable" id="decision-suitable" />
                        <Label htmlFor="decision-suitable">Suitable</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not-suitable" id="decision-not-suitable" />
                        <Label htmlFor="decision-not-suitable">Not suitable</Label>
                      </div>
                    </RadioGroup>
                    <p className="text-sm text-muted-foreground">
                      If not suitable to fill this role, take appropriate steps as outlined under
                      your personnel due diligence policy.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="decisionRationale">Rationale for decision</Label>
                    <Textarea
                      id="decisionRationale"
                      value={decisionRationale}
                      onChange={(e) => setDecisionRationale(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="assessedBy">Assessed by (name and position)</Label>
                      <Input
                        id="assessedBy"
                        value={assessedBy}
                        onChange={(e) => setAssessedBy(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfAssessment">Date of assessment</Label>
                      <Input
                        id="dateOfAssessment"
                        type="date"
                        value={dateOfAssessment}
                        onChange={(e) => setDateOfAssessment(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="approvedBy">
                        Approved by (governing body representative)
                      </Label>
                      <Input
                        id="approvedBy"
                        value={approvedBy}
                        onChange={(e) => setApprovedBy(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 8: Notify AUSTRAC */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Step 8: Notify AUSTRAC</h3>
                <p className="text-sm text-muted-foreground">
                  You must notify AUSTRAC via AUSTRAC Online within 14 days of appointing an AML/CTF
                  compliance officer. Record your submission information below.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-3 text-left text-sm font-medium">
                          Name of designated AML/CTF compliance officer
                        </th>
                        <th className="border p-3 text-left text-sm font-medium">Date appointed</th>
                        <th className="border p-3 text-left text-sm font-medium">
                          Date AUSTRAC notified
                        </th>
                        <th className="border p-3 text-left text-sm font-medium">
                          Name of person submitting notification
                        </th>
                        <th className="border p-3 text-left text-sm font-medium">
                          Notes (optional)
                        </th>
                        <th className="border p-3 text-center text-sm font-medium w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {austracNotifications.map((row) => (
                        <tr key={row.id}>
                          <td className="border p-2">
                            <Input
                              value={row.name}
                              onChange={(e) =>
                                updateAustracNotification(row.id, "name", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              type="date"
                              value={row.dateAppointed}
                              onChange={(e) =>
                                updateAustracNotification(row.id, "dateAppointed", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              type="date"
                              value={row.dateNotified}
                              onChange={(e) =>
                                updateAustracNotification(row.id, "dateNotified", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              value={row.submittedBy}
                              onChange={(e) =>
                                updateAustracNotification(row.id, "submittedBy", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              value={row.notes}
                              onChange={(e) =>
                                updateAustracNotification(row.id, "notes", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAustracNotification(row.id)}
                              disabled={austracNotifications.length === 1}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove row</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button
                  variant="outline"
                  onClick={addAustracNotification}
                  className="gap-2 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </Button>
              </div>
            )}

            {/* Step 9: Ongoing Due Diligence */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  Step 9: Ongoing due diligence
                </h3>
                <p className="text-sm text-muted-foreground">
                  Record any ongoing checks or reviews conducted after appointment, such as annual
                  reviews or triggered reassessments. If an issue occurs, note escalation details in
                  the action taken column.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border p-3 text-left text-sm font-medium">Review date</th>
                        <th className="border p-3 text-left text-sm font-medium">
                          Reason for review
                        </th>
                        <th className="border p-3 text-left text-sm font-medium">Key findings</th>
                        <th className="border p-3 text-left text-sm font-medium">Action taken</th>
                        <th className="border p-3 text-left text-sm font-medium">Reviewed by</th>
                        <th className="border p-3 text-center text-sm font-medium w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ongoingReviews.map((row) => (
                        <tr key={row.id}>
                          <td className="border p-2">
                            <Input
                              type="date"
                              value={row.reviewDate}
                              onChange={(e) =>
                                updateOngoingReview(row.id, "reviewDate", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              value={row.reason}
                              onChange={(e) =>
                                updateOngoingReview(row.id, "reason", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              value={row.keyFindings}
                              onChange={(e) =>
                                updateOngoingReview(row.id, "keyFindings", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              value={row.actionTaken}
                              onChange={(e) =>
                                updateOngoingReview(row.id, "actionTaken", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2">
                            <Input
                              value={row.reviewedBy}
                              onChange={(e) =>
                                updateOngoingReview(row.id, "reviewedBy", e.target.value)
                              }
                              className="h-8 text-sm"
                            />
                          </td>
                          <td className="border p-2 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOngoingReview(row.id)}
                              disabled={ongoingReviews.length === 1}
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove row</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Button
                  variant="outline"
                  onClick={addOngoingReview}
                  className="gap-2 bg-transparent"
                >
                  <Plus className="h-4 w-4" />
                  Add Row
                </Button>
              </div>
            )}

            {/* Step 10: Record Keeping */}
            {currentStep === 10 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Step 10: Record keeping</h3>
                <p className="text-sm text-muted-foreground">
                  Save this completed form and all supporting evidence in your compliance records
                  folder. Keep all records for at least 7 years from the date created.
                </p>

                <div className="space-y-4">
                  <h4 className="font-medium">Checklist:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="evidenceAttached"
                        checked={recordKeeping.evidenceAttached}
                        onCheckedChange={(checked) =>
                          setRecordKeeping((prev) => ({ ...prev, evidenceAttached: checked }))
                        }
                      />
                      <Label htmlFor="evidenceAttached" className="font-normal">
                        All supporting evidence attached
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="recordsSaved"
                        checked={recordKeeping.recordsSaved}
                        onCheckedChange={(checked) =>
                          setRecordKeeping((prev) => ({ ...prev, recordsSaved: checked }))
                        }
                      />
                      <Label htmlFor="recordsSaved" className="font-normal">
                        Records saved to compliance folder
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground">
                    Form complete. Please ensure all sections have been filled out accurately before
                    saving.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Previous
              </Button>
              <div className="flex gap-2">
                {currentStep === totalSteps ? (
                  <Button className="bg-primary">Submit Form</Button>
                ) : (
                  <Button onClick={nextStep}>Next</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          AUSTRAC version 29/01/2026 | Internal version 1.0
        </p>
      </div>
    </div>
  );
}
