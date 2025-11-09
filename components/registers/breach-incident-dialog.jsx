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
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, FileText, Shield, Lightbulb } from "lucide-react";

export function BreachIncidentDialog({ incident, open, onOpenChange }) {
  const [formData, setFormData] = useState(incident || {});
  const isNewIncident = !incident;

  const handleSave = () => {
    console.log("[v0] Saving breach incident:", formData);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isNewIncident
              ? "Report New Incident"
              : `Incident: ${incident.incidentId}`}
          </DialogTitle>
          <DialogDescription>
            {isNewIncident
              ? "Report a new compliance breach or security incident"
              : "View and manage incident details"}
          </DialogDescription>
        </DialogHeader>

        {!isNewIncident && incident ? (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="investigation">Investigation</TabsTrigger>
              <TabsTrigger value="remediation">Remediation</TabsTrigger>
              <TabsTrigger value="lessons">Lessons Learned</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Incident Overview */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Incident Overview
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">
                      Incident Title
                    </Label>
                    <p className="font-medium">{incident.incidentTitle}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Incident ID</Label>
                    <p className="font-medium">{incident.incidentId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Category</Label>
                    <Badge variant="outline">{incident.incidentCategory}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Severity Level
                    </Label>
                    <Badge
                      className={
                        incident.severityLevel === "Critical" ||
                        incident.severityLevel === "High"
                          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          : incident.severityLevel === "Medium"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }
                    >
                      {incident.severityLevel}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Reported By</Label>
                    <p className="font-medium">{incident.reportedBy}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Reported Date
                    </Label>
                    <p className="font-medium">
                      {new Date(incident.reportedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Responsible Person
                    </Label>
                    <p className="font-medium">{incident.responsiblePerson}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge
                      variant={
                        incident.status === "Resolved" ||
                        incident.status === "Closed"
                          ? "outline"
                          : "default"
                      }
                    >
                      {incident.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">
                    Incident Description
                  </Label>
                  <p className="mt-1 text-sm leading-relaxed">
                    {incident.incidentDescription}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Impact Assessment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Impact Assessment
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {incident.affectedCustomers && (
                    <div>
                      <Label className="text-muted-foreground">
                        Affected Customers
                      </Label>
                      <p className="font-medium">
                        {incident.affectedCustomers}
                      </p>
                    </div>
                  )}
                  {incident.regulatoryImpact && (
                    <div>
                      <Label className="text-muted-foreground">
                        Regulatory Impact
                      </Label>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 dark:bg-blue-950"
                      >
                        {incident.regulatoryImpact}
                      </Badge>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">
                      Regulatory Reporting Required
                    </Label>
                    <p className="font-medium">
                      {incident.regulatoryReportingRequired ? "Yes" : "No"}
                    </p>
                  </div>
                  {incident.regulatoryReportDate && (
                    <div>
                      <Label className="text-muted-foreground">
                        Regulatory Report Date
                      </Label>
                      <p className="font-medium">
                        {new Date(
                          incident.regulatoryReportDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="investigation" className="space-y-6 mt-6">
              {incident.rootCause ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Root Cause Analysis
                    </h3>
                    <p className="text-sm leading-relaxed">
                      {incident.rootCause}
                    </p>
                  </div>

                  <Separator />

                  {incident.containmentActions && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        Containment Actions
                      </h3>
                      <p className="text-sm leading-relaxed">
                        {incident.containmentActions}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Investigation in progress - root cause analysis pending</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="remediation" className="space-y-6 mt-6">
              {incident.remediationPlan ? (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Remediation Plan</h3>
                    <p className="text-sm leading-relaxed">
                      {incident.remediationPlan}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Due Date</Label>
                      <p className="font-medium">
                        {new Date(incident.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    {incident.actualResolutionDate && (
                      <div>
                        <Label className="text-muted-foreground">
                          Actual Resolution Date
                        </Label>
                        <p className="font-medium">
                          {new Date(
                            incident.actualResolutionDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Remediation plan pending - awaiting investigation completion
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="lessons" className="space-y-6 mt-6">
              {incident.lessonsLearned ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Lessons Learned
                  </h3>
                  <p className="text-sm leading-relaxed">
                    {incident.lessonsLearned}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Lessons learned will be documented upon incident closure
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4 mt-6">
            {/* New Incident Form */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="incidentTitle">Incident Title *</Label>
                <Input
                  id="incidentTitle"
                  value={formData.incidentTitle || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, incidentTitle: e.target.value })
                  }
                  placeholder="Brief description of the incident"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="incidentCategory">Category *</Label>
                <Select
                  value={formData.incidentCategory}
                  onValueChange={(value) =>
                    setFormData({ ...formData, incidentCategory: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Privacy Breach">
                      Privacy Breach
                    </SelectItem>
                    <SelectItem value="AML Compliance">
                      AML Compliance
                    </SelectItem>
                    <SelectItem value="Security Incident">
                      Security Incident
                    </SelectItem>
                    <SelectItem value="Operational Failure">
                      Operational Failure
                    </SelectItem>
                    <SelectItem value="Regulatory Breach">
                      Regulatory Breach
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severityLevel">Severity Level *</Label>
                <Select
                  value={formData.severityLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, severityLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="incidentDescription">
                Incident Description *
              </Label>
              <Textarea
                id="incidentDescription"
                value={formData.incidentDescription || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    incidentDescription: e.target.value,
                  })
                }
                placeholder="Detailed description of what happened..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportedBy">Reported By *</Label>
                <Input
                  id="reportedBy"
                  value={formData.reportedBy || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, reportedBy: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsiblePerson">Responsible Person *</Label>
                <Input
                  id="responsiblePerson"
                  value={formData.responsiblePerson || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      responsiblePerson: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportedDate">Reported Date *</Label>
                <Input
                  id="reportedDate"
                  type="date"
                  value={formData.reportedDate || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, reportedDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date for Resolution *</Label>
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

            <div className="space-y-2">
              <Label htmlFor="affectedCustomers">
                Affected Customers/Clients
              </Label>
              <Input
                id="affectedCustomers"
                value={formData.affectedCustomers || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    affectedCustomers: e.target.value,
                  })
                }
                placeholder="Customer IDs or count"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="regulatoryImpact">Regulatory Impact</Label>
              <Input
                id="regulatoryImpact"
                value={formData.regulatoryImpact || ""}
                onChange={(e) =>
                  setFormData({ ...formData, regulatoryImpact: e.target.value })
                }
                placeholder="e.g., AUSTRAC, OAIC, ASIC, APRA"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="regulatoryReportingRequired"
                checked={formData.regulatoryReportingRequired || false}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    regulatoryReportingRequired: checked,
                  })
                }
              />
              <Label
                htmlFor="regulatoryReportingRequired"
                className="cursor-pointer"
              >
                Regulatory reporting required
              </Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Report Incident</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
