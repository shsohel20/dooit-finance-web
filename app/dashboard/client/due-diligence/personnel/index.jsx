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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [personBeingAssessed, setPersonBeingAssessed] = useState("");
  const [position, setPosition] = useState("");
  const [dateOfPDD, setDateOfPDD] = useState("");
  const [purposeOfPDD, setPurposeOfPDD] = useState([]);
  const [professionalBody, setProfessionalBody] = useState("");

  // Step 2 state
  const [membershipVerification, setMembershipVerification] = useState({
    id: "membership",
    attached: false,
    verifiedBy: "",
    dateVerified: "",
  });

  // Step 3 state
  const [statutoryDeclaration, setStatutoryDeclaration] = useState({
    id: "statutory",
    attached: false,
    verifiedBy: "",
    dateVerified: "",
    designation: "",
  });
  const [identification, setIdentification] = useState({
    id: "identification",
    attached: false,
    verifiedBy: "",
    dateVerified: "",
    designation: "",
  });
  const [adverseMedia, setAdverseMedia] = useState({
    id: "adverseMedia",
    attached: false,
    verifiedBy: "",
    dateVerified: "",
    designation: "",
  });
  const [referenceCheck, setReferenceCheck] = useState({
    id: "reference",
    attached: false,
    verifiedBy: "",
    dateVerified: "",
    designation: "",
  });
  const [otherCheck, setOtherCheck] = useState({
    id: "other",
    attached: false,
    verifiedBy: "",
    dateVerified: "",
    designation: "",
  });
  const [otherCheckDescription, setOtherCheckDescription] = useState("");

  // Photo identification details
  const [legalName, setLegalName] = useState("");
  const [otherKnownNames, setOtherKnownNames] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [residentialAddress, setResidentialAddress] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [uniqueIdentifier, setUniqueIdentifier] = useState("");
  const [otherDocuments, setOtherDocuments] = useState("");

  // Step 4 state
  const [governingBodyAnswer, setGoverningBodyAnswer] = useState("");
  const [governingBodyInfo, setGoverningBodyInfo] = useState("");
  const [seniorManagerAnswer, setSeniorManagerAnswer] = useState("");
  const [seniorManagerInfo, setSeniorManagerInfo] = useState("");

  // Step 5 state
  const [integritySuitable, setIntegritySuitable] = useState("");
  const [integrityInfo, setIntegrityInfo] = useState("");
  const [competenceSuitable, setCompetenceSuitable] = useState("");
  const [competenceInfo, setCompetenceInfo] = useState("");
  const [adverseFindingsSuitable, setAdverseFindingsSuitable] = useState("");
  const [adverseFindingsInfo, setAdverseFindingsInfo] = useState("");
  const [adverseFindingsRationale, setAdverseFindingsRationale] = useState("");

  // Step 6 state
  const [decision, setDecision] = useState("");
  const [rationale, setRationale] = useState("");
  const [assessedByName, setAssessedByName] = useState("");
  const [assessmentDate, setAssessmentDate] = useState("");

  // Step 7 state
  const [ongoingReviews, setOngoingReviews] = useState([
    { id: "1", reviewDate: "", reason: "", keyFindings: "", actionTaken: "", reviewedBy: "" },
  ]);

  // Step 8 state
  const [evidenceAttached, setEvidenceAttached] = useState(false);
  const [recordsSaved, setRecordsSaved] = useState(false);

  const handlePurposeChange = (purpose, checked) => {
    if (checked) {
      setPurposeOfPDD([...purposeOfPDD, purpose]);
    } else {
      setPurposeOfPDD(purposeOfPDD.filter((p) => p !== purpose));
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

  return (
    <main className="min-h-screen  py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Personnel Due Diligence Form</h1>
          {/* <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            This form records all checks, assessment and approval for personnel due diligence (PDD).
            Follow the instructions in each section carefully and complete all required fields.
          </p>
          <p className="text-xs text-muted-foreground">
            AUSTRAC version 29/01/2026 - Internal version 1.0
          </p> */}
        </div>

        {/* Step 1: Personnel Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 1: Personnel Information</CardTitle>
            <CardDescription>
              Complete the following fields and select the reason(s) you&apos;re conducting PDD.
              This helps determine which checks are needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="personBeingAssessed">Person being assessed</Label>
                <Input
                  id="personBeingAssessed"
                  value={personBeingAssessed}
                  onChange={(e) => setPersonBeingAssessed(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="Enter position title"
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

            <div className="space-y-3">
              <Label>Purpose of PDD</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newPersonnel"
                    checked={purposeOfPDD.includes("newPersonnel")}
                    onCheckedChange={(checked) => handlePurposeChange("newPersonnel", checked)}
                  />
                  <Label htmlFor="newPersonnel" className="font-normal cursor-pointer">
                    New personnel in AML/CTF-related role
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internalPromotion"
                    checked={purposeOfPDD.includes("internalPromotion")}
                    onCheckedChange={(checked) => handlePurposeChange("internalPromotion", checked)}
                  />
                  <Label htmlFor="internalPromotion" className="font-normal cursor-pointer">
                    Internal promotion or transfer to AML/CTF-related role
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="changeCircumstances"
                    checked={purposeOfPDD.includes("changeCircumstances")}
                    onCheckedChange={(checked) =>
                      handlePurposeChange("changeCircumstances", checked)
                    }
                  />
                  <Label htmlFor="changeCircumstances" className="font-normal cursor-pointer">
                    Change in circumstances affecting suitability
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="concernConduct"
                    checked={purposeOfPDD.includes("concernConduct")}
                    onCheckedChange={(checked) => handlePurposeChange("concernConduct", checked)}
                  />
                  <Label htmlFor="concernConduct" className="font-normal cursor-pointer">
                    Concern about a person&apos;s conduct, suitability or competence in the role
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Check Accounting Professional Association Membership */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Step 2: Professional Association Membership/Licenses
            </CardTitle>
            <CardDescription>
              Select the professional body that the candidate is a member of.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="overflow-x-auto">
                <Label>Professional Body Membership/Licenses</Label>
                <Select
                  value={professionalBody}
                  onValueChange={(value) => setProfessionalBody(value)}
                >
                  <SelectTrigger className={"w-52"}>
                    <SelectValue placeholder="Select Professional Body" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cpa">CPA Australia</SelectItem>
                    <SelectItem value="chartered">
                      Chartered Accountants Australia & New Zealand
                    </SelectItem>
                    <SelectItem value="public">Institute of Public Accountants</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                {professionalBody === "other" && (
                  <div className="max-w-52">
                    <Label htmlFor="otherProfessionalBody">Other Professional Body</Label>
                    <Input
                      id="otherProfessionalBody"
                      // value={otherProfessionalBody}
                      // onChange={(e) => setOtherProfessionalBody(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Collect and Verify Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Step 3: Collect and Verify Additional Information (as required)
            </CardTitle>
            <CardDescription>
              Skip this step if you have completed Step 2 and you have no reasonable doubts about
              their integrity, identity, competence and independence to perform the role.
              <br />
              <br />
              Otherwise, you must complete any processes below that you require to be reasonably
              satisfied of the person&apos;s integrity, competence and independence to perform the
              role.
              <br />
              <br />
              Attach all evidence to this form (except the photo identification, which you can
              include key details of) before moving onto the next section.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Required information</TableHead>
                    <TableHead>Description/process notes</TableHead>
                    <TableHead className="w-[80px] text-center">Attached</TableHead>
                    <TableHead className="w-[100px]">Verified by</TableHead>
                    <TableHead className="w-[100px]">Designation</TableHead>
                    <TableHead className="w-[130px]">Date verified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium align-top">Statutory declaration</TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top">
                      Follow the Statutory declaration process.
                    </TableCell>
                    <TableCell className="text-center align-top">
                      <Checkbox
                        checked={statutoryDeclaration.attached}
                        onCheckedChange={(checked) =>
                          setStatutoryDeclaration({
                            ...statutoryDeclaration,
                            attached: checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={statutoryDeclaration.verifiedBy}
                        onChange={(e) =>
                          setStatutoryDeclaration({
                            ...statutoryDeclaration,
                            verifiedBy: e.target.value,
                          })
                        }
                        placeholder="Actual Officer"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={statutoryDeclaration.designation}
                        onChange={(e) =>
                          setStatutoryDeclaration({
                            ...statutoryDeclaration,
                            designation: e.target.value,
                          })
                        }
                        placeholder="Designation"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="date"
                        value={statutoryDeclaration.dateVerified}
                        onChange={(e) =>
                          setStatutoryDeclaration({
                            ...statutoryDeclaration,
                            dateVerified: e.target.value,
                          })
                        }
                        className="h-8"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium align-top">Identification</TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top">
                      Follow the Identify personnel process. Record in Photo identification details
                      table below.
                    </TableCell>
                    <TableCell className="text-center align-top">
                      <Checkbox
                        checked={identification.attached}
                        onCheckedChange={(checked) =>
                          setIdentification({
                            ...identification,
                            attached: checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={identification.verifiedBy}
                        onChange={(e) =>
                          setIdentification({
                            ...identification,
                            verifiedBy: e.target.value,
                          })
                        }
                        placeholder="Actual Officer"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={statutoryDeclaration.designation}
                        onChange={(e) =>
                          setStatutoryDeclaration({
                            ...statutoryDeclaration,
                            designation: e.target.value,
                          })
                        }
                        placeholder="Designation"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="date"
                        value={identification.dateVerified}
                        onChange={(e) =>
                          setIdentification({
                            ...identification,
                            dateVerified: e.target.value,
                          })
                        }
                        className="h-8"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium align-top">
                      Adverse media search results
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top">
                      Follow the Adverse media check process.
                    </TableCell>
                    <TableCell className="text-center align-top">
                      <Checkbox
                        checked={adverseMedia.attached}
                        onCheckedChange={(checked) =>
                          setAdverseMedia({
                            ...adverseMedia,
                            attached: checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={adverseMedia.verifiedBy}
                        onChange={(e) =>
                          setAdverseMedia({
                            ...adverseMedia,
                            verifiedBy: e.target.value,
                          })
                        }
                        placeholder="Actual Officer"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={adverseMedia.designation}
                        onChange={(e) =>
                          setAdverseMedia({
                            ...adverseMedia,
                            designation: e.target.value,
                          })
                        }
                        placeholder="Designation"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="date"
                        value={adverseMedia.dateVerified}
                        onChange={(e) =>
                          setAdverseMedia({
                            ...adverseMedia,
                            dateVerified: e.target.value,
                          })
                        }
                        className="h-8"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium align-top">
                      Reference of employment check
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top">
                      Contact previous employers or references as required.
                    </TableCell>
                    <TableCell className="text-center align-top">
                      <Checkbox
                        checked={referenceCheck.attached}
                        onCheckedChange={(checked) =>
                          setReferenceCheck({
                            ...referenceCheck,
                            attached: checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={referenceCheck.verifiedBy}
                        onChange={(e) =>
                          setReferenceCheck({
                            ...referenceCheck,
                            verifiedBy: e.target.value,
                          })
                        }
                        placeholder="Actual Officer"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={referenceCheck.designation}
                        onChange={(e) =>
                          setReferenceCheck({
                            ...referenceCheck,
                            designation: e.target.value,
                          })
                        }
                        placeholder="Designation"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="date"
                        value={referenceCheck.dateVerified}
                        onChange={(e) =>
                          setReferenceCheck({
                            ...referenceCheck,
                            dateVerified: e.target.value,
                          })
                        }
                        className="h-8"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium align-top">
                      <div className="space-y-2">
                        <span>Other (specify):</span>
                        <Input
                          value={otherCheckDescription}
                          onChange={(e) => setOtherCheckDescription(e.target.value)}
                          placeholder="Describe..."
                          className="h-8"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground align-top">
                      Any additional checks required.
                    </TableCell>
                    <TableCell className="text-center align-top">
                      <Checkbox
                        checked={otherCheck.attached}
                        onCheckedChange={(checked) =>
                          setOtherCheck({
                            ...otherCheck,
                            attached: checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={otherCheck.verifiedBy}
                        onChange={(e) =>
                          setOtherCheck({
                            ...otherCheck,
                            verifiedBy: e.target.value,
                          })
                        }
                        placeholder="Actual Officer"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        value={otherCheck.designation}
                        onChange={(e) =>
                          setOtherCheck({
                            ...otherCheck,
                            designation: e.target.value,
                          })
                        }
                        placeholder="Designation"
                        className="h-8"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="date"
                        value={otherCheck.dateVerified}
                        onChange={(e) =>
                          setOtherCheck({
                            ...otherCheck,
                            dateVerified: e.target.value,
                          })
                        }
                        className="h-8"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <Separator />

            {/* Photo Identification Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Photo Identification Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="legalName">Legal name</Label>
                  <Input
                    id="legalName"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    placeholder="Enter legal name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherKnownNames">Any other known names</Label>
                  <Input
                    id="otherKnownNames"
                    value={otherKnownNames}
                    onChange={(e) => setOtherKnownNames(e.target.value)}
                    placeholder="Enter other names"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residentialAddress">Residential address</Label>
                  <Input
                    id="residentialAddress"
                    value={residentialAddress}
                    onChange={(e) => setResidentialAddress(e.target.value)}
                    placeholder="Enter address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="documentType">Type of document</Label>
                  <Input
                    id="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    placeholder="e.g., Driver's licence, Passport"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry date</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="uniqueIdentifier">Unique identifier</Label>
                  <Input
                    id="uniqueIdentifier"
                    value={uniqueIdentifier}
                    onChange={(e) => setUniqueIdentifier(e.target.value)}
                    placeholder="e.g., Licence number, Passport number"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherDocuments">List any other documents you reviewed below</Label>
                <Textarea
                  id="otherDocuments"
                  value={otherDocuments}
                  onChange={(e) => setOtherDocuments(e.target.value)}
                  placeholder="Record details here..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 4: Assess Eligibility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Step 4: Assess Eligibility (Governing Body or Senior Manager)
            </CardTitle>
            <CardDescription>
              The person must also meet all below criteria to be eligible for appointment as a
              governing body or senior manager. Record your findings and any notes for each
              question.
              <br />
              <br />
              If the person is not taking a governing body or senior manager role, you can skip this
              step.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Governing Body */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">
                  Governing body - Do they have primary responsibility for governance and executive
                  level decisions?
                </Label>
                <p className="text-xs text-muted-foreground">
                  For example, the person is your practice owner.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Supporting information</Label>
                <Textarea
                  value={governingBodyInfo}
                  onChange={(e) => setGoverningBodyInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Outcome</Label>
                <RadioGroup value={governingBodyAnswer} onValueChange={setGoverningBodyAnswer}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="governing-yes" />
                    <Label htmlFor="governing-yes" className="font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="governing-no" />
                    <Label htmlFor="governing-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Senior Manager */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">
                  Senior manager - Can they make or influence decisions affecting the whole or a
                  substantial part of your practice?
                </Label>
                <p className="text-xs text-muted-foreground">
                  For example, the person is your practice manager.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Supporting information</Label>
                <Textarea
                  value={seniorManagerInfo}
                  onChange={(e) => setSeniorManagerInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Outcome</Label>
                <RadioGroup value={seniorManagerAnswer} onValueChange={setSeniorManagerAnswer}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="senior-yes" />
                    <Label htmlFor="senior-yes" className="font-normal cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="senior-no" />
                    <Label htmlFor="senior-no" className="font-normal cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 5: Assess Suitability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 5: Assess Suitability</CardTitle>
            <CardDescription>
              Review all documents and information. Record findings for each area. If any issues are
              identified, explain them clearly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Integrity */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <Label className="font-medium">
                Integrity (honesty, character, conflicts of interest)
              </Label>
              <div className="space-y-2">
                <Label className="text-sm">Supporting information</Label>
                <Textarea
                  value={integrityInfo}
                  onChange={(e) => setIntegrityInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Outcome</Label>
                <RadioGroup value={integritySuitable} onValueChange={setIntegritySuitable}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="suitable" id="integrity-suitable" />
                    <Label htmlFor="integrity-suitable" className="font-normal cursor-pointer">
                      Suitable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-suitable" id="integrity-not-suitable" />
                    <Label htmlFor="integrity-not-suitable" className="font-normal cursor-pointer">
                      Not suitable
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Competence */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <Label className="font-medium">Competence (skills, experience, knowledge)</Label>
              <div className="space-y-2">
                <Label className="text-sm">Supporting information</Label>
                <Textarea
                  value={competenceInfo}
                  onChange={(e) => setCompetenceInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Outcome</Label>
                <RadioGroup value={competenceSuitable} onValueChange={setCompetenceSuitable}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="suitable" id="competence-suitable" />
                    <Label htmlFor="competence-suitable" className="font-normal cursor-pointer">
                      Suitable
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="not-suitable" id="competence-not-suitable" />
                    <Label htmlFor="competence-not-suitable" className="font-normal cursor-pointer">
                      Not suitable
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Adverse Findings */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <Label className="font-medium">Adverse findings (if any)</Label>
              <div className="space-y-2">
                <Label className="text-sm">Supporting information</Label>
                <Textarea
                  value={adverseFindingsInfo}
                  onChange={(e) => setAdverseFindingsInfo(e.target.value)}
                  placeholder="Provide supporting information..."
                  className="min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Outcome</Label>
                <RadioGroup
                  value={adverseFindingsSuitable}
                  onValueChange={setAdverseFindingsSuitable}
                >
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
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adverseFindingsRationale">
                If there are adverse findings and you still consider the person suitable, explain
                the rationale for your decision.
              </Label>
              <Textarea
                id="adverseFindingsRationale"
                value={adverseFindingsRationale}
                onChange={(e) => setAdverseFindingsRationale(e.target.value)}
                placeholder="Record details here..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Step 6: Record the Decision */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 6: Record the Decision</CardTitle>
            <CardDescription>Record the final decision, including rationale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <Label className="font-medium">Decision</Label>
                <p className="text-xs text-muted-foreground">
                  If you are not suitable to fill this role, take appropriate steps as outlined
                  under your personnel due diligence policy.
                </p>
              </div>
              <RadioGroup value={decision} onValueChange={setDecision}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="suitable" id="decision-suitable" />
                  <Label htmlFor="decision-suitable" className="font-normal cursor-pointer">
                    Suitable
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="not-suitable" id="decision-not-suitable" />
                  <Label htmlFor="decision-not-suitable" className="font-normal cursor-pointer">
                    Not suitable
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rationale">Rationale for decision</Label>
              <Textarea
                id="rationale"
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                placeholder="Provide rationale for your decision..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="assessedByName">Assessed by (name and position)</Label>
                <Input
                  id="assessedByName"
                  value={assessedByName}
                  onChange={(e) => setAssessedByName(e.target.value)}
                  placeholder="Enter name and position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assessmentDate">Date of assessment</Label>
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

        {/* Step 7: Ongoing Due Diligence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 7: Ongoing Due Diligence</CardTitle>
            <CardDescription>
              Record outcomes of triggered reviews and any action taken.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[130px]">Review date</TableHead>
                    <TableHead>Reason for review</TableHead>
                    <TableHead>Key findings</TableHead>
                    <TableHead>Action taken</TableHead>
                    <TableHead className="w-[120px]">Reviewed by</TableHead>
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
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={review.reason}
                          onChange={(e) => updateOngoingReview(review.id, "reason", e.target.value)}
                          placeholder="Reason"
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={review.keyFindings}
                          onChange={(e) =>
                            updateOngoingReview(review.id, "keyFindings", e.target.value)
                          }
                          placeholder="Findings"
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={review.actionTaken}
                          onChange={(e) =>
                            updateOngoingReview(review.id, "actionTaken", e.target.value)
                          }
                          placeholder="Action"
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={review.reviewedBy}
                          onChange={(e) =>
                            updateOngoingReview(review.id, "reviewedBy", e.target.value)
                          }
                          placeholder="Name"
                          className="h-8"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOngoingReview(review.id)}
                          disabled={ongoingReviews.length === 1}
                          className="h-8 w-8"
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
              size="sm"
              onClick={addOngoingReview}
              className="mt-4 bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Review
            </Button>
          </CardContent>
        </Card>

        {/* Step 8: Record Keeping */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Step 8: Record Keeping</CardTitle>
            <CardDescription>
              Save this completed form and all supporting evidence in your compliance records
              folder. Keep all records for at least 7 years from the date created.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label className="font-medium">Checklist</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="evidenceAttached"
                    checked={evidenceAttached}
                    onCheckedChange={(checked) => setEvidenceAttached(checked)}
                  />
                  <Label htmlFor="evidenceAttached" className="font-normal cursor-pointer">
                    All supporting evidence attached
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
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pb-8">
          <p>
            The program starter kits are intended to be used as a complete package and have been
            designed for use by reporting entities who satisfy certain suitability criteria. Before
            using these kits, reporting entities need to consider the suitability criteria and the
            information on the Getting Started webpage.
          </p>
        </div>
      </div>
    </main>
  );
}
