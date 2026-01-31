"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";

export default function PersonnelDueDiligenceForm() {
  // Step 1 state
  const [name, setName] = useState("");
  const [dateOfCheck, setDateOfCheck] = useState("");
  const [assessmentTypes, setAssessmentTypes] = useState([]);

  // Step 2 eligibility state
  const [isResident, setIsResident] = useState("");
  const [residentInfo, setResidentInfo] = useState("");
  const [hasManagementPosition, setHasManagementPosition] = useState("");
  const [managementInfo, setManagementInfo] = useState("");
  const [hasSufficientAuthority, setHasSufficientAuthority] = useState("");
  const [authorityInfo, setAuthorityInfo] = useState("");
  const [eligibilityReasoning, setEligibilityReasoning] = useState("");

  // Step 2 governing body/senior manager state
  const [governingBodySuitable, setGoverningBodySuitable] = useState("");
  const [governingBodyInfo, setGoverningBodyInfo] = useState("");
  const [seniorManagerSuitable, setSeniorManagerSuitable] = useState("");
  const [seniorManagerInfo, setSeniorManagerInfo] = useState("");

  // Step 3 suitability state
  const [capabilitySuitable, setCapabilitySuitable] = useState("");
  const [capabilityInfo, setCapabilityInfo] = useState("");
  const [honestySuitable, setHonestySuitable] = useState("");
  const [honestyInfo, setHonestyInfo] = useState("");
  const [conflictsSuitable, setConflictsSuitable] = useState("");
  const [conflictsInfo, setConflictsInfo] = useState("");
  const [criminalSuitable, setCriminalSuitable] = useState("");
  const [criminalInfo, setCriminalInfo] = useState("");
  const [adverseSuitable, setAdverseSuitable] = useState("");
  const [adverseInfo, setAdverseInfo] = useState("");
  const [financialSuitable, setFinancialSuitable] = useState("");
  const [financialInfo, setFinancialInfo] = useState("");
  const [notSuitableExplanation, setNotSuitableExplanation] = useState("");

  // Step 4 state
  const [overallSuitable, setOverallSuitable] = useState("");
  const [rationale, setRationale] = useState("");
  const [assessedByName, setAssessedByName] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");

  // Step 5 state
  const [austracNotifications, setAustracNotifications] = useState([
    { id: "1", name: "", dateAppointed: "", dateNotified: "", notes: "" },
  ]);

  // Step 6 state
  const [ongoingReviews, setOngoingReviews] = useState([
    { id: "1", reviewDate: "", reason: "", keyFindings: "", actionTaken: "", reviewedBy: "" },
  ]);

  // Step 7 state
  const [evidenceAttached, setEvidenceAttached] = useState(false);
  const [recordsSaved, setRecordsSaved] = useState(false);

  const handleAssessmentTypeChange = (type, checked) => {
    if (checked) {
      setAssessmentTypes([...assessmentTypes, type]);
    } else {
      setAssessmentTypes(assessmentTypes.filter((t) => t !== type));
    }
  };

  const addOngoingReview = () => {
    setOngoingReviews([
      ...ongoingReviews,
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
    if (ongoingReviews.length > 1) {
      setOngoingReviews(ongoingReviews.filter((r) => r.id !== id));
    }
  };

  const updateOngoingReview = (id, field, value) => {
    setOngoingReviews(ongoingReviews.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addAustracNotification = () => {
    setAustracNotifications([
      ...austracNotifications,
      { id: Date.now().toString(), name: "", dateAppointed: "", dateNotified: "", notes: "" },
    ]);
  };

  const removeAustracNotification = (id) => {
    if (austracNotifications.length > 1) {
      setAustracNotifications(austracNotifications.filter((n) => n.id !== id));
    }
  };

  const updateAustracNotification = (id, field, value) => {
    setAustracNotifications(
      austracNotifications.map((n) => (n.id === id ? { ...n, [field]: value } : n)),
    );
  };

  return (
    <main className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Personnel Due Diligence Form</h1>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Where the compliance officer and governing body are the same person
          </p>
          <p className="text-xs text-muted-foreground">
            AUSTRAC version 29/01/2026 • Internal version 1.0
          </p>
        </div>

        {/* Introduction */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              This form applies when an anti-money laundering and counter-terrorism financing
              (AML/CTF) compliance officer also serves as the practice&apos;s governing body. It
              outlines the due diligence requirements and how to record the appointment.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              AUSTRAC considers it sufficient for the individual to attest to their own suitability,
              supported by relevant information, as they serve both as the practice&apos;s governing
              body (and would therefore be liable if an unsuitable person held these roles) and are
              fully aware of their own circumstances.
            </p>
          </CardContent>
        </Card>

        {/* Step 1: Your Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 1: Your Information</CardTitle>
            <CardDescription>
              Complete the following fields and select the reason(s) you&apos;re conducting
              personnel due diligence (PDD).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
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
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfCheck">Date of check</Label>
              <Input
                id="dateOfCheck"
                type="date"
                value={dateOfCheck}
                onChange={(e) => setDateOfCheck(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label>Type of assessment</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newAppointment"
                    checked={assessmentTypes.includes("new")}
                    onCheckedChange={(checked) => handleAssessmentTypeChange("new", checked)}
                  />
                  <Label htmlFor="newAppointment" className="font-normal cursor-pointer">
                    New appointment
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="triggeredReview"
                    checked={assessmentTypes.includes("triggered")}
                    onCheckedChange={(checked) => handleAssessmentTypeChange("triggered", checked)}
                  />
                  <Label htmlFor="triggeredReview" className="font-normal cursor-pointer">
                    Triggered review
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Eligibility Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 2: Eligibility Assessment</CardTitle>
            <CardDescription>
              You must meet all below criteria to be eligible for appointment as an AML/CTF
              compliance officer.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question 1: Resident */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">Are you a resident of Australia?</Label>
                <p className="text-xs text-muted-foreground">
                  You will be an ordinary resident of Australia if there is a degree of permanence
                  to your residence in Australia. For example, an address included in a
                  driver&apos;s licence.
                </p>
              </div>
              <RadioGroup value={isResident} onValueChange={setIsResident}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="resident-yes" />
                  <Label htmlFor="resident-yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="resident-no" />
                  <Label htmlFor="resident-no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="residentInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="residentInfo"
                  value={residentInfo}
                  onChange={(e) => setResidentInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Question 2: Management Position */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">Do you hold a management-level position?</Label>
                <p className="text-xs text-muted-foreground">
                  This is usually a senior personnel member (practice manager or equivalent). One
                  individual may hold one or more governance role.
                </p>
              </div>
              <RadioGroup value={hasManagementPosition} onValueChange={setHasManagementPosition}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="management-yes" />
                  <Label htmlFor="management-yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="management-no" />
                  <Label htmlFor="management-no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="managementInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="managementInfo"
                  value={managementInfo}
                  onChange={(e) => setManagementInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Question 3: Authority */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">
                  Do you have sufficient authority, independence and access to the necessary
                  resources and information?
                </Label>
                <p className="text-xs text-muted-foreground">
                  One individual may hold one or more governance role and should have sufficient
                  authority and independence.
                </p>
              </div>
              <RadioGroup value={hasSufficientAuthority} onValueChange={setHasSufficientAuthority}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="authority-yes" />
                  <Label htmlFor="authority-yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="authority-no" />
                  <Label htmlFor="authority-no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="authorityInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="authorityInfo"
                  value={authorityInfo}
                  onChange={(e) => setAuthorityInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Eligibility Reasoning */}
            <div className="space-y-2">
              <Label htmlFor="eligibilityReasoning">
                Describe the reasoning for any eligibility finding:
              </Label>
              <Textarea
                id="eligibilityReasoning"
                value={eligibilityReasoning}
                onChange={(e) => setEligibilityReasoning(e.target.value)}
                placeholder="Record details here..."
                className="min-h-[100px]"
              />
            </div>

            <Separator />

            {/* Governing Body & Senior Manager */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                To be eligible for the governing body role, you must also meet the criteria below.
                In many cases, you may also appoint yourself a senior manager and must meet the
                following eligibility criteria.
              </p>
            </div>

            {/* Governing Body */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">
                  Governing body – Do you have primary responsibility for governance and
                  executive-level decisions?
                </Label>
                <p className="text-xs text-muted-foreground">
                  For example, you are the practice owner.
                </p>
              </div>
              <RadioGroup value={governingBodySuitable} onValueChange={setGoverningBodySuitable}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suitable" id="governing-suitable" />
                  <Label htmlFor="governing-suitable" className="font-normal cursor-pointer">
                    Suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-suitable" id="governing-not-suitable" />
                  <Label htmlFor="governing-not-suitable" className="font-normal cursor-pointer">
                    Not suitable
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="governingBodyInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="governingBodyInfo"
                  value={governingBodyInfo}
                  onChange={(e) => setGoverningBodyInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Senior Manager */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">
                  Senior manager – Can you make or influence decisions affecting the whole or a
                  substantial part of your practice?
                </Label>
                <p className="text-xs text-muted-foreground">
                  For example, you are the practice owner or the practice manager.
                </p>
              </div>
              <RadioGroup value={seniorManagerSuitable} onValueChange={setSeniorManagerSuitable}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suitable" id="senior-suitable" />
                  <Label htmlFor="senior-suitable" className="font-normal cursor-pointer">
                    Suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-suitable" id="senior-not-suitable" />
                  <Label htmlFor="senior-not-suitable" className="font-normal cursor-pointer">
                    Not suitable
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="seniorManagerInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="seniorManagerInfo"
                  value={seniorManagerInfo}
                  onChange={(e) => setSeniorManagerInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Suitability Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 3: Suitability Assessment</CardTitle>
            <CardDescription>
              Assess your suitability against the following fields and provide relevant information
              to support each consideration.
              <br />
              <br />
              <span className="text-xs">
                If you are currently a member of one of the accounting professional associations
                (CPA Australia, Chartered Accountants Australia & New Zealand, or the Institute of
                Public Accountants), you can use this as evidence that you meet all relevant fields
                except for capability and conflicts of interest.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Capability */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">Capability</Label>
                <p className="text-xs text-muted-foreground">
                  You don&apos;t need to be an AML/CTF expert, but must have the ability to:
                </p>
                <ul className="text-xs text-muted-foreground list-disc list-inside ml-2 space-y-1">
                  <li>understand the practice&apos;s ML/TF risks</li>
                  <li>apply AML/CTF policies and procedures</li>
                  <li>use training and support material effectively</li>
                  <li>consider your past performance, references and training capacity</li>
                </ul>
              </div>
              <RadioGroup value={capabilitySuitable} onValueChange={setCapabilitySuitable}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suitable" id="capability-suitable" />
                  <Label htmlFor="capability-suitable" className="font-normal cursor-pointer">
                    Suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-suitable" id="capability-not-suitable" />
                  <Label htmlFor="capability-not-suitable" className="font-normal cursor-pointer">
                    Not suitable
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="capabilityInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="capabilityInfo"
                  value={capabilityInfo}
                  onChange={(e) => setCapabilityInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Honesty, Integrity and Character */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">Honesty, integrity and character</Label>
                <p className="text-xs text-muted-foreground">
                  You should be honest, reliable and act ethically.
                </p>
              </div>
              <RadioGroup value={honestySuitable} onValueChange={setHonestySuitable}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suitable" id="honesty-suitable" />
                  <Label htmlFor="honesty-suitable" className="font-normal cursor-pointer">
                    Suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-suitable" id="honesty-not-suitable" />
                  <Label htmlFor="honesty-not-suitable" className="font-normal cursor-pointer">
                    Not suitable
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="honestyInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="honestyInfo"
                  value={honestyInfo}
                  onChange={(e) => setHonestyInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Conflicts of Interest */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">Conflicts of interest</Label>
                <p className="text-xs text-muted-foreground">
                  You should not have a conflict of interest that will materially affect your
                  ability to act in the role. If you do, you should have sufficient controls in
                  place to help you manage any conflict of interest.
                </p>
              </div>
              <RadioGroup value={conflictsSuitable} onValueChange={setConflictsSuitable}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suitable" id="conflicts-suitable" />
                  <Label htmlFor="conflicts-suitable" className="font-normal cursor-pointer">
                    Suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-suitable" id="conflicts-not-suitable" />
                  <Label htmlFor="conflicts-not-suitable" className="font-normal cursor-pointer">
                    Not suitable
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="conflictsInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="conflictsInfo"
                  value={conflictsInfo}
                  onChange={(e) => setConflictsInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Criminal History */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">Criminal history</Label>
                <p className="text-xs text-muted-foreground">
                  Determine if any previous convictions you have may affect your ability to perform
                  AML/CTF duties, including any conviction for a serious offence.
                </p>
              </div>
              <RadioGroup value={criminalSuitable} onValueChange={setCriminalSuitable}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suitable" id="criminal-suitable" />
                  <Label htmlFor="criminal-suitable" className="font-normal cursor-pointer">
                    Suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-suitable" id="criminal-not-suitable" />
                  <Label htmlFor="criminal-not-suitable" className="font-normal cursor-pointer">
                    Not suitable
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="criminalInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="criminalInfo"
                  value={criminalInfo}
                  onChange={(e) => setCriminalInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Adverse Findings */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">Adverse findings</Label>
                <p className="text-xs text-muted-foreground">
                  Document any adverse findings that may affect your suitability for the role.
                  Consider if you have been the subject of civil, criminal, regulatory or
                  disciplinary action that resulted in findings against your capacity to manage a
                  practice or complete other professional activity.
                </p>
              </div>
              <RadioGroup value={adverseSuitable} onValueChange={setAdverseSuitable}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suitable" id="adverse-suitable" />
                  <Label htmlFor="adverse-suitable" className="font-normal cursor-pointer">
                    Suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-suitable" id="adverse-not-suitable" />
                  <Label htmlFor="adverse-not-suitable" className="font-normal cursor-pointer">
                    Not suitable
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="adverseInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="adverseInfo"
                  value={adverseInfo}
                  onChange={(e) => setAdverseInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Financial Soundness */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">Financial soundness</Label>
                <p className="text-xs text-muted-foreground">
                  If you are an undischarged bankrupt or under a personal insolvency agreement,
                  assess whether this affects your ability to perform your duties.
                </p>
              </div>
              <RadioGroup value={financialSuitable} onValueChange={setFinancialSuitable}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suitable" id="financial-suitable" />
                  <Label htmlFor="financial-suitable" className="font-normal cursor-pointer">
                    Suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-suitable" id="financial-not-suitable" />
                  <Label htmlFor="financial-not-suitable" className="font-normal cursor-pointer">
                    Not suitable
                  </Label>
                </div>
              </RadioGroup>
              <div className="space-y-2">
                <Label htmlFor="financialInfo" className="text-sm">
                  Supporting information
                </Label>
                <Textarea
                  id="financialInfo"
                  value={financialInfo}
                  onChange={(e) => setFinancialInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
            </div>

            {/* Not Suitable Explanation */}
            <div className="space-y-2">
              <Label htmlFor="notSuitableExplanation">
                If any outcome is NOT SUITABLE, explain the findings and reasoning below:
              </Label>
              <Textarea
                id="notSuitableExplanation"
                value={notSuitableExplanation}
                onChange={(e) => setNotSuitableExplanation(e.target.value)}
                placeholder="Record details here..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Overall Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Step 4: Record the Overall Assessment and Decision
            </CardTitle>
            <CardDescription>
              Review all findings. Record your decision and reasoning.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <Label className="font-medium">Are you suitable to be appointed in the role?</Label>
              <RadioGroup value={overallSuitable} onValueChange={setOverallSuitable}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="overall-yes" />
                  <Label htmlFor="overall-yes" className="font-normal cursor-pointer">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="overall-no" />
                  <Label htmlFor="overall-no" className="font-normal cursor-pointer">
                    No
                  </Label>
                </div>
              </RadioGroup>
              {overallSuitable === "no" && (
                <p className="text-xs text-destructive">
                  If you are not suitable to fill this role, take appropriate steps as outlined
                  under section 6 of your Personnel due diligence policy.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rationale">Rationale for decision:</Label>
              <Textarea
                id="rationale"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Enter your rationale..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assessedByName">Assessed by (name and position):</Label>
                <Input
                  id="assessedByName"
                  value={assessedByName}
                  onChange={(e) => setAssessedByName(e.target.value)}
                  placeholder="Enter name and position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessmentDate">Date of assessment:</Label>
                <Input
                  id="assessmentDate"
                  type="date"
                  value={assessmentDate}
                  onChange={(e) => setAssessmentDate(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: Notify AUSTRAC */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 5: Notify AUSTRAC</CardTitle>
            <CardDescription>
              You must notify AUSTRAC via AUSTRAC Online within 14 days of appointing an AML/CTF
              compliance officer. Record your submission information below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name of designated AML/CTF compliance officer</TableHead>
                    <TableHead>Date appointed</TableHead>
                    <TableHead>Date AUSTRAC notified</TableHead>
                    <TableHead>Notes (optional)</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {austracNotifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <Input
                          value={notification.name}
                          onChange={(e) =>
                            updateAustracNotification(notification.id, "name", e.target.value)
                          }
                          placeholder="Name"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={notification.dateAppointed}
                          onChange={(e) =>
                            updateAustracNotification(
                              notification.id,
                              "dateAppointed",
                              e.target.value,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={notification.dateNotified}
                          onChange={(e) =>
                            updateAustracNotification(
                              notification.id,
                              "dateNotified",
                              e.target.value,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={notification.notes}
                          onChange={(e) =>
                            updateAustracNotification(notification.id, "notes", e.target.value)
                          }
                          placeholder="Notes"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAustracNotification(notification.id)}
                          disabled={austracNotifications.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove row</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button
              variant="outline"
              onClick={addAustracNotification}
              className="w-full sm:w-auto bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </CardContent>
        </Card>

        {/* Step 6: Ongoing Due Diligence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 6: Ongoing Due Diligence</CardTitle>
            <CardDescription>
              Record any ongoing checks or reviews conducted after appointment, such as triggered
              reassessments. If an issue occurs, note the escalation details in the action taken
              column.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Review date</TableHead>
                    <TableHead>Reason for review</TableHead>
                    <TableHead>Key findings</TableHead>
                    <TableHead>Action taken</TableHead>
                    <TableHead>Reviewed by</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ongoingReviews.map((review) => (
                    <TableRow key={review.id}>
                      <TableCell>
                        <Input
                          type="date"
                          value={review.reviewDate}
                          onChange={(e) =>
                            updateOngoingReview(review.id, "reviewDate", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={review.reason}
                          onChange={(e) => updateOngoingReview(review.id, "reason", e.target.value)}
                          placeholder="Reason"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={review.keyFindings}
                          onChange={(e) =>
                            updateOngoingReview(review.id, "keyFindings", e.target.value)
                          }
                          placeholder="Key findings"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={review.actionTaken}
                          onChange={(e) =>
                            updateOngoingReview(review.id, "actionTaken", e.target.value)
                          }
                          placeholder="Action taken"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={review.reviewedBy}
                          onChange={(e) =>
                            updateOngoingReview(review.id, "reviewedBy", e.target.value)
                          }
                          placeholder="Reviewed by"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOngoingReview(review.id)}
                          disabled={ongoingReviews.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove row</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Button
              variant="outline"
              onClick={addOngoingReview}
              className="w-full sm:w-auto bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Row
            </Button>
          </CardContent>
        </Card>

        {/* Step 7: Record Keeping */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 7: Record Keeping</CardTitle>
            <CardDescription>
              Save this completed form and all supporting evidence in your compliance records
              folder. Keep all records for at least 7 years from the date created.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Label className="font-medium">Checklist:</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="evidenceAttached"
                  checked={evidenceAttached}
                  onCheckedChange={(checked) => setEvidenceAttached(checked)}
                />
                <Label htmlFor="evidenceAttached" className="font-normal cursor-pointer">
                  All supporting evidence attached (if any)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="recordsSaved"
                  checked={recordsSaved}
                  onCheckedChange={(checked) => setRecordsSaved(checked)}
                />
                <Label htmlFor="recordsSaved" className="font-normal cursor-pointer">
                  Records saved to compliance folder
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button size="lg" className="w-full sm:w-auto">
            Save Form
          </Button>
        </div>
      </div>
    </main>
  );
}
