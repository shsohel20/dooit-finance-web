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
import {
  Gift,
  User,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function ConflictDeclarationDialog({ declaration, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    fullName: "",
    positionDepartment: "",
    entityType: "banking",
    declarationType: "gift",
    dateOffered: new Date().toISOString().split("T")[0],
    dateDeclared: new Date().toISOString().split("T")[0],
    providerSubject: "",
    descriptionOfInterest: "",
    estimatedValue: "",
    businessContext: "",
    typeOfConflict: "potential",
    conflictRisk: "medium",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("[v0] New declaration form submitted:", formData);
    // Here you would typically save the data
    onOpenChange(false);
  };

  if (!declaration) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              New Declaration
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Employee Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Employee Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="positionDepartment">
                      Position & Department *
                    </Label>
                    <Input
                      id="positionDepartment"
                      value={formData.positionDepartment}
                      onChange={(e) =>
                        handleInputChange("positionDepartment", e.target.value)
                      }
                      placeholder="e.g., Senior Analyst - Compliance"
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
                </div>
              </CardContent>
            </Card>

            {/* Declaration Type & Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Declaration Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="declarationType">Declaration Type *</Label>
                    <Select
                      value={formData.declarationType}
                      onValueChange={(value) =>
                        handleInputChange("declarationType", value)
                      }
                    >
                      <SelectTrigger id="declarationType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gift">Gift</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                        <SelectItem value="donation">Donation</SelectItem>
                        <SelectItem value="conflict-of-interest">
                          Conflict of Interest
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="providerSubject">
                      Provider / Subject *
                    </Label>
                    <Input
                      id="providerSubject"
                      value={formData.providerSubject}
                      onChange={(e) =>
                        handleInputChange("providerSubject", e.target.value)
                      }
                      placeholder="Who provided or what is the subject"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOffered">
                      Date Offered / Identified *
                    </Label>
                    <Input
                      id="dateOffered"
                      type="date"
                      value={formData.dateOffered}
                      onChange={(e) =>
                        handleInputChange("dateOffered", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateDeclared">Date Declared *</Label>
                    <Input
                      id="dateDeclared"
                      type="date"
                      value={formData.dateDeclared}
                      onChange={(e) =>
                        handleInputChange("dateDeclared", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="estimatedValue">Estimated Value ($)</Label>
                    <Input
                      id="estimatedValue"
                      type="number"
                      value={formData.estimatedValue}
                      onChange={(e) =>
                        handleInputChange("estimatedValue", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="descriptionOfInterest">
                      Description of Interest *
                    </Label>
                    <Textarea
                      id="descriptionOfInterest"
                      value={formData.descriptionOfInterest}
                      onChange={(e) =>
                        handleInputChange(
                          "descriptionOfInterest",
                          e.target.value
                        )
                      }
                      placeholder="Provide detailed description of the gift, hospitality, donation, or conflict"
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="businessContext">
                      Business Context / Justification *
                    </Label>
                    <Textarea
                      id="businessContext"
                      value={formData.businessContext}
                      onChange={(e) =>
                        handleInputChange("businessContext", e.target.value)
                      }
                      placeholder="Explain the business context and any justification"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment (for Conflicts of Interest) */}
            {formData.declarationType === "conflict-of-interest" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="typeOfConflict">Type of Conflict</Label>
                      <Select
                        value={formData.typeOfConflict}
                        onValueChange={(value) =>
                          handleInputChange("typeOfConflict", value)
                        }
                      >
                        <SelectTrigger id="typeOfConflict">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="actual">Actual</SelectItem>
                          <SelectItem value="potential">Potential</SelectItem>
                          <SelectItem value="perceived">Perceived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="conflictRisk">Conflict Risk Level</Label>
                      <Select
                        value={formData.conflictRisk}
                        onValueChange={(value) =>
                          handleInputChange("conflictRisk", value)
                        }
                      >
                        <SelectTrigger id="conflictRisk">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Declaration</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getTypeIcon = () => {
    if (
      declaration.declarationType === "gift" ||
      declaration.declarationType === "hospitality"
    ) {
      return <Gift className="h-5 w-5" />;
    }
    return <AlertTriangle className="h-5 w-5" />;
  };

  const getDecisionIcon = () => {
    switch (declaration.managerDecision) {
      case "approve":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "reject":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getTypeIcon()}
            Declaration: {declaration.id}
          </DialogTitle>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline" className="capitalize">
              {declaration.declarationType.replace("-", " ")}
            </Badge>
            {declaration.typeOfConflict && (
              <Badge variant="secondary" className="capitalize">
                {declaration.typeOfConflict} Conflict
              </Badge>
            )}
            {declaration.conflictRisk && (
              <Badge
                variant={
                  declaration.conflictRisk === "high"
                    ? "destructive"
                    : declaration.conflictRisk === "medium"
                    ? "secondary"
                    : "outline"
                }
              >
                {declaration.conflictRisk.toUpperCase()} RISK
              </Badge>
            )}
            <Badge
              variant={
                declaration.status === "approved"
                  ? "default"
                  : declaration.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {declaration.status.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Employee Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Employee Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Full Name
                  </div>
                  <div className="mt-1 font-medium">{declaration.fullName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Position & Department
                  </div>
                  <div className="mt-1">{declaration.positionDepartment}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Entity Type
                  </div>
                  <div className="mt-1 capitalize">
                    {declaration.entityType}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Declaration Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Declaration Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Date Offered / Identified
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(declaration.dateOffered).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Date Declared
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(declaration.dateDeclared).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Provider / Subject
                  </div>
                  <div className="mt-1 font-medium">
                    {declaration.providerSubject}
                  </div>
                </div>
                {declaration.estimatedValue && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Estimated Value
                    </div>
                    <div className="mt-1 font-semibold">
                      ${declaration.estimatedValue.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Description of Interest
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {declaration.descriptionOfInterest}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Business Context / Justification
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {declaration.businessContext}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Management Decision */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                {getDecisionIcon()}
                Management Decision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Decision
                  </div>
                  <div className="mt-1">
                    <Badge
                      variant={
                        declaration.managerDecision === "approve"
                          ? "default"
                          : declaration.managerDecision === "reject"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {declaration.managerDecision}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Approver / Manager
                  </div>
                  <div className="mt-1">{declaration.approverManager}</div>
                </div>
                {declaration.dateReviewedByBoard && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Date Reviewed by Board
                    </div>
                    <div className="mt-1">
                      {new Date(
                        declaration.dateReviewedByBoard
                      ).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Action Taken
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {declaration.actionTaken}
                </div>
              </div>
              {declaration.finalOutcome && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Final Outcome & Notes
                  </div>
                  <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                    {declaration.finalOutcome}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {declaration.status === "pending" && (
            <Button>Review Declaration</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
