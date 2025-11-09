"use client";
import React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User,
  AlertTriangle,
  FileText,
  CheckCircle,
} from "lucide-react";

export function ECDDCaseDialog({ case_, open, onOpenChange }) {
  const [formData, setFormData] = useState(case_ || {});
  const isNewCase = !case_;

  const handleSave = () => {
    console.log("[v0] Saving ECDD case:", formData);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNewCase ? "New ECDD Case" : `ECDD Case: ${case_.caseId}`}
          </DialogTitle>
          <DialogDescription>
            {isNewCase
              ? "Create a new Enhanced Customer Due Diligence case"
              : "View and manage ECDD case details"}
          </DialogDescription>
        </DialogHeader>

        {!isNewCase && case_ ? (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Case Details</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Customer Name
                    </Label>
                    <p className="font-medium">{case_.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Customer ID</Label>
                    <p className="font-medium">{case_.customerId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Entity Type</Label>
                    <Badge variant="outline">{case_.entityType}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Industry</Label>
                    <Badge variant="outline">{case_.industry}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Case Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Case Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Trigger for ECDD
                    </Label>
                    <p className="font-medium">{case_.trigger}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Initial Risk Rating
                    </Label>
                    <Badge
                      className={
                        case_.initialRiskRating === "High" ||
                        case_.initialRiskRating === "Unacceptable"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : case_.initialRiskRating === "Medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }
                    >
                      {case_.initialRiskRating}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      ECDD Initiation Date
                    </Label>
                    <p className="font-medium">
                      {new Date(case_.ecddInitiationDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Due Date</Label>
                    <p className="font-medium">
                      {new Date(case_.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Information Requested
                  </Label>
                  <p className="mt-1">{case_.informationRequested}</p>
                </div>
                {case_.informationReceivedDate && (
                  <div>
                    <Label className="text-muted-foreground">
                      Information Received Date
                    </Label>
                    <p className="font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {new Date(
                        case_.informationReceivedDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Current Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Case Status</Label>
                    <Badge
                      variant={
                        case_.caseStatus === "Closed" ? "outline" : "default"
                      }
                    >
                      {case_.caseStatus}
                    </Badge>
                  </div>
                  {case_.caseOutcome && (
                    <div>
                      <Label className="text-muted-foreground">
                        Case Outcome
                      </Label>
                      <p className="font-medium">{case_.caseOutcome}</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-6 mt-6">
              {case_.analystAssessment ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Analyst Assessment
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {case_.analystAssessment}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    {case_.finalRiskRating && (
                      <div>
                        <Label className="text-muted-foreground">
                          Final Risk Rating
                        </Label>
                        <Badge
                          className={
                            case_.finalRiskRating === "High" ||
                            case_.finalRiskRating === "Unacceptable"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : case_.finalRiskRating === "Medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }
                        >
                          {case_.finalRiskRating}
                        </Badge>
                      </div>
                    )}
                    {case_.recommendation && (
                      <div>
                        <Label className="text-muted-foreground">
                          Recommendation
                        </Label>
                        <Badge variant="outline">{case_.recommendation}</Badge>
                      </div>
                    )}
                  </div>

                  {case_.l2ComplianceReviewDate && (
                    <div>
                      <Label className="text-muted-foreground">
                        L2 Compliance Review Date
                      </Label>
                      <p className="font-medium">
                        {new Date(
                          case_.l2ComplianceReviewDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Assessment pending - awaiting information from customer</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="w-px h-full bg-border mt-2" />
                  </div>
                  <div className="flex-1 pb-8">
                    <p className="font-medium">Case Initiated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(case_.ecddInitiationDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {case_.informationReceivedDate && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="w-px h-full bg-border mt-2" />
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-medium">Information Received</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          case_.informationReceivedDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {case_.l2ComplianceReviewDate && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="w-px h-full bg-border mt-2" />
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-medium">L2 Compliance Review</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          case_.l2ComplianceReviewDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {case_.caseStatus === "Closed" && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Case Closed</p>
                      <p className="text-sm text-muted-foreground">
                        {case_.caseOutcome}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4 mt-6">
            {/* New Case Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerId">Customer ID *</Label>
                <Input
                  id="customerId"
                  value={formData.customerId || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, customerId: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="entityType">Entity Type *</Label>
                <Select
                  value={formData.entityType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, entityType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select entity type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individual">Individual</SelectItem>
                    <SelectItem value="Company">Company</SelectItem>
                    <SelectItem value="Trust">Trust</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="initialRiskRating">Initial Risk Rating *</Label>
                <Select
                  value={formData.initialRiskRating}
                  onValueChange={(value) =>
                    setFormData({ ...formData, initialRiskRating: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Unacceptable">Unacceptable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trigger">Trigger for ECDD *</Label>
              <Input
                id="trigger"
                value={formData.trigger || ""}
                onChange={(e) =>
                  setFormData({ ...formData, trigger: e.target.value })
                }
                placeholder="e.g., TM Alert, HRJ, PEP, High Value Transaction"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="informationRequested">
                Information Requested *
              </Label>
              <Textarea
                id="informationRequested"
                value={formData.informationRequested || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    informationRequested: e.target.value,
                  })
                }
                placeholder="Describe the information requested from the customer..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ecddInitiationDate">
                  ECDD Initiation Date *
                </Label>
                <Input
                  id="ecddInitiationDate"
                  type="date"
                  value={formData.ecddInitiationDate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ecddInitiationDate: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Create Case</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
