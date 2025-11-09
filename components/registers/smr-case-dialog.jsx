"use client";
import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FileText,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flag,
  Plus,
  X,
} from "lucide-react";

export function SMRCaseDialog({ smrCase, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    suspicionDate: new Date().toISOString().split("T")[0],
    analystName: "",
    customerId: "",
    customerName: "",
    entityType: "banking",
    isVerified: false,
    reasonForSuspicion: "",
    redFlags: [],
    sourceOfAlert: "",
    smrDecision: "Reportable",
  });

  const [newRedFlag, setNewRedFlag] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddRedFlag = () => {
    if (newRedFlag.trim()) {
      setFormData((prev) => ({
        ...prev,
        redFlags: [...prev.redFlags, newRedFlag.trim()],
      }));
      setNewRedFlag("");
    }
  };

  const handleRemoveRedFlag = (index) => {
    setFormData((prev) => ({
      ...prev,
      redFlags: prev.redFlags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    console.log("[v0] New SMR case form submitted:", formData);
    // Here you would typically save the data
    onOpenChange(false);
  };

  if (!smrCase) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              New SMR Case
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Case Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Case Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="suspicionDate">
                      Suspicion Identification Date *
                    </Label>
                    <Input
                      id="suspicionDate"
                      type="date"
                      value={formData.suspicionDate}
                      onChange={(e) =>
                        handleInputChange("suspicionDate", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="analystName">Analyst Name *</Label>
                    <Input
                      id="analystName"
                      value={formData.analystName}
                      onChange={(e) =>
                        handleInputChange("analystName", e.target.value)
                      }
                      placeholder="Enter analyst name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="entityType">Entity Type *</Label>
                    <Select
                      value={formData.entityType}
                      onValueChange={(value) =>
                        handleInputChange("entityType", value)
                      }
                    >
                      <SelectTrigger id="entityType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banking">
                          Banking & Financial
                        </SelectItem>
                        <SelectItem value="accounting">
                          Accounting Firm
                        </SelectItem>
                        <SelectItem value="legal">Legal Firm</SelectItem>
                        <SelectItem value="real-estate">
                          Real Estate Agency
                        </SelectItem>
                        <SelectItem value="precious-metals">
                          Precious Metal Dealer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sourceOfAlert">Source of Alert *</Label>
                    <Input
                      id="sourceOfAlert"
                      value={formData.sourceOfAlert}
                      onChange={(e) =>
                        handleInputChange("sourceOfAlert", e.target.value)
                      }
                      placeholder="e.g., Transaction Monitoring, Staff Detection"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerId">Customer ID *</Label>
                    <Input
                      id="customerId"
                      value={formData.customerId}
                      onChange={(e) =>
                        handleInputChange("customerId", e.target.value)
                      }
                      placeholder="Enter customer ID"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerName">Customer Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        handleInputChange("customerName", e.target.value)
                      }
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isVerified"
                        checked={formData.isVerified}
                        onCheckedChange={(checked) =>
                          handleInputChange("isVerified", checked)
                        }
                      />
                      <Label
                        htmlFor="isVerified"
                        className="text-sm font-normal cursor-pointer"
                      >
                        Customer identity has been verified
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suspicion Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Suspicion Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="reasonForSuspicion">
                    Reason for Suspicion *
                  </Label>
                  <Textarea
                    id="reasonForSuspicion"
                    value={formData.reasonForSuspicion}
                    onChange={(e) =>
                      handleInputChange("reasonForSuspicion", e.target.value)
                    }
                    placeholder="Provide detailed explanation of why this matter is suspicious"
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Red Flags Identified *</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex gap-2">
                      <Input
                        value={newRedFlag}
                        onChange={(e) => setNewRedFlag(e.target.value)}
                        placeholder="Enter a red flag indicator"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddRedFlag();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddRedFlag}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {formData.redFlags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.redFlags.map((flag, index) => (
                          <Badge
                            key={index}
                            variant="destructive"
                            className="gap-1"
                          >
                            <Flag className="h-3 w-3" />
                            {flag}
                            <button
                              type="button"
                              onClick={() => handleRemoveRedFlag(index)}
                              className="ml-1 hover:bg-red-700 rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="smrDecision">Initial SMR Decision *</Label>
                  <Select
                    value={formData.smrDecision}
                    onValueChange={(value) =>
                      handleInputChange("smrDecision", value)
                    }
                  >
                    <SelectTrigger id="smrDecision">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reportable">Reportable</SelectItem>
                      <SelectItem value="Not Reportable">
                        Not Reportable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create SMR Case</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            SMR Case: {smrCase.caseId}
          </DialogTitle>
          <div className="flex gap-2 pt-2">
            <Badge
              variant={
                smrCase.smrDecision === "Reportable"
                  ? "destructive"
                  : "secondary"
              }
            >
              {smrCase.smrDecision}
            </Badge>
            <Badge
              variant={
                smrCase.status === "Submitted"
                  ? "default"
                  : smrCase.status === "Under Review"
                  ? "secondary"
                  : "outline"
              }
            >
              {smrCase.status}
            </Badge>
            {smrCase.isVerified ? (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-600" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1">
                <XCircle className="h-3 w-3 text-muted-foreground" />
                Not Verified
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="suspicion">Suspicion</TabsTrigger>
            <TabsTrigger value="decision">Decision</TabsTrigger>
            <TabsTrigger value="submission">Submission</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Customer Name
                    </div>
                    <div className="mt-1 font-medium">
                      {smrCase.customerName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Customer ID
                    </div>
                    <div className="mt-1 font-mono text-sm">
                      {smrCase.customerId}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Verified Status
                    </div>
                    <div className="mt-1">
                      {smrCase.isVerified ? (
                        <Badge variant="outline" className="gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1">
                          <XCircle className="h-3 w-3 text-muted-foreground" />
                          Not Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Case Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Suspicion Identification Date
                    </div>
                    <div className="mt-1">
                      {new Date(smrCase.suspicionDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Analyst Name
                    </div>
                    <div className="mt-1">{smrCase.analystName}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Source of Alert
                    </div>
                    <div className="mt-1">{smrCase.sourceOfAlert}</div>
                  </div>
                  {smrCase.approverName && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Approver Name
                      </div>
                      <div className="mt-1">{smrCase.approverName}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suspicion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Reason for Suspicion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm bg-muted p-4 rounded-md">
                  {smrCase.reasonForSuspicion}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Flag className="h-4 w-4" />
                  Red Flags Identified
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {smrCase.redFlags.map((flag, index) => (
                    <Badge key={index} variant="destructive">
                      {flag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="decision" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">SMR Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Decision
                  </div>
                  <div className="mt-1">
                    <Badge
                      variant={
                        smrCase.smrDecision === "Reportable"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-base"
                    >
                      {smrCase.smrDecision}
                    </Badge>
                  </div>
                </div>

                {smrCase.smrDecision === "Not Reportable" &&
                  smrCase.reasonForNotReportable && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Reason for "Not Reportable" Decision
                      </div>
                      <div className="mt-1 text-sm bg-muted p-4 rounded-md">
                        {smrCase.reasonForNotReportable}
                      </div>
                    </div>
                  )}

                {smrCase.caseClosureDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Case Closure Date
                    </div>
                    <div className="mt-1">
                      {new Date(smrCase.caseClosureDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submission" className="space-y-4">
            {smrCase.smrDecision === "Reportable" &&
            smrCase.status === "Submitted" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    Submission Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        SMR Reference Number
                      </div>
                      <div className="mt-1 font-mono font-semibold">
                        {smrCase.smrReferenceNumber}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Submission Date
                      </div>
                      <div className="mt-1">
                        {smrCase.smrSubmissionDate &&
                          new Date(
                            smrCase.smrSubmissionDate
                          ).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">
                        Approver
                      </div>
                      <div className="mt-1">{smrCase.approverName}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : smrCase.smrDecision === "Reportable" &&
              smrCase.status === "Under Review" ? (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="font-semibold text-orange-900">
                        Pending Submission
                      </div>
                      <div className="text-sm text-orange-700">
                        This SMR case is under review and pending submission to
                        AUSTRAC.
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center text-muted-foreground">
                    <XCircle className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p>
                      This case was determined to be not reportable and was not
                      submitted to AUSTRAC.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {smrCase.status === "Under Review" && <Button>Submit SMR</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
