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
import {
  Building2,
  Calendar,
  DollarSign,
  Shield,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

export function ThirdPartyVendorDialog({ vendor, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    vendorName: "",
    servicesProvided: "",
    entityType: "banking",
    riskCategory: "medium",
    dueDiligenceStatus: "pending",
    dueDiligenceDate: new Date().toISOString().split("T")[0],
    ddFindings: "",
    contractStart: "",
    contractEnd: "",
    contractValue: "",
    serviceLocation: "onshore",
    dataAccessLevel: "limited",
    criticality: "important",
    contractManager: "",
    nextReviewDate: "",
    exitStrategy: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log("[v0] New vendor form submitted:", formData);
    // Here you would typically save the data
    onOpenChange(false);
  };

  if (!vendor) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Add New Vendor
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="vendorName">Vendor/Supplier Name *</Label>
                    <Input
                      id="vendorName"
                      value={formData.vendorName}
                      onChange={(e) =>
                        handleInputChange("vendorName", e.target.value)
                      }
                      placeholder="Enter vendor name"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="servicesProvided">
                      Services Provided *
                    </Label>
                    <Textarea
                      id="servicesProvided"
                      value={formData.servicesProvided}
                      onChange={(e) =>
                        handleInputChange("servicesProvided", e.target.value)
                      }
                      placeholder="Describe the services provided by this vendor"
                      rows={3}
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
                    <Label htmlFor="contractManager">Contract Manager *</Label>
                    <Input
                      id="contractManager"
                      value={formData.contractManager}
                      onChange={(e) =>
                        handleInputChange("contractManager", e.target.value)
                      }
                      placeholder="Name of contract manager"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="riskCategory">Risk Category *</Label>
                    <Select
                      value={formData.riskCategory}
                      onValueChange={(value) =>
                        handleInputChange("riskCategory", value)
                      }
                    >
                      <SelectTrigger id="riskCategory">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="criticality">Criticality *</Label>
                    <Select
                      value={formData.criticality}
                      onValueChange={(value) =>
                        handleInputChange("criticality", value)
                      }
                    >
                      <SelectTrigger id="criticality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non-critical">
                          Non-Critical
                        </SelectItem>
                        <SelectItem value="important">Important</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="serviceLocation">Service Location *</Label>
                    <Select
                      value={formData.serviceLocation}
                      onValueChange={(value) =>
                        handleInputChange("serviceLocation", value)
                      }
                    >
                      <SelectTrigger id="serviceLocation">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onshore">Onshore</SelectItem>
                        <SelectItem value="nearshore">Nearshore</SelectItem>
                        <SelectItem value="offshore">Offshore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dataAccessLevel">Data Access Level *</Label>
                    <Select
                      value={formData.dataAccessLevel}
                      onValueChange={(value) =>
                        handleInputChange("dataAccessLevel", value)
                      }
                    >
                      <SelectTrigger id="dataAccessLevel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-access">No Access</SelectItem>
                        <SelectItem value="limited">Limited</SelectItem>
                        <SelectItem value="full">Full</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Due Diligence */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Due Diligence</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDiligenceStatus">DD Status *</Label>
                    <Select
                      value={formData.dueDiligenceStatus}
                      onValueChange={(value) =>
                        handleInputChange("dueDiligenceStatus", value)
                      }
                    >
                      <SelectTrigger id="dueDiligenceStatus">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dueDiligenceDate">DD Date *</Label>
                    <Input
                      id="dueDiligenceDate"
                      type="date"
                      value={formData.dueDiligenceDate}
                      onChange={(e) =>
                        handleInputChange("dueDiligenceDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="ddFindings">
                      DD Findings & Risk Assessment
                    </Label>
                    <Textarea
                      id="ddFindings"
                      value={formData.ddFindings}
                      onChange={(e) =>
                        handleInputChange("ddFindings", e.target.value)
                      }
                      placeholder="Document key findings from due diligence process"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contractStart">Contract Start Date *</Label>
                    <Input
                      id="contractStart"
                      type="date"
                      value={formData.contractStart}
                      onChange={(e) =>
                        handleInputChange("contractStart", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractEnd">Contract End Date *</Label>
                    <Input
                      id="contractEnd"
                      type="date"
                      value={formData.contractEnd}
                      onChange={(e) =>
                        handleInputChange("contractEnd", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractValue">
                      Contract Value (Annual) *
                    </Label>
                    <Input
                      id="contractValue"
                      type="number"
                      value={formData.contractValue}
                      onChange={(e) =>
                        handleInputChange("contractValue", e.target.value)
                      }
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextReviewDate">Next Review Date *</Label>
                    <Input
                      id="nextReviewDate"
                      type="date"
                      value={formData.nextReviewDate}
                      onChange={(e) =>
                        handleInputChange("nextReviewDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="exitStrategy">Exit Strategy *</Label>
                    <Textarea
                      id="exitStrategy"
                      value={formData.exitStrategy}
                      onChange={(e) =>
                        handleInputChange("exitStrategy", e.target.value)
                      }
                      placeholder="Describe the exit strategy and transition plan"
                      rows={2}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create Vendor</Button>
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
            <Building2 className="h-5 w-5" />
            {vendor.vendorName}
          </DialogTitle>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline">{vendor.id}</Badge>
            <Badge
              variant={
                vendor.riskCategory === "critical" ||
                vendor.riskCategory === "high"
                  ? "destructive"
                  : "default"
              }
            >
              {vendor.riskCategory.toUpperCase()} RISK
            </Badge>
            <Badge
              variant={vendor.status === "active" ? "default" : "secondary"}
            >
              {vendor.status.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="contract">Contract</TabsTrigger>
            <TabsTrigger value="risk">Risk & DD</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vendor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Vendor ID
                    </div>
                    <div className="mt-1">{vendor.id}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Entity Type
                    </div>
                    <div className="mt-1 capitalize">
                      {vendor.entityType.replace("-", " ")}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Services Provided
                    </div>
                    <div className="mt-1">{vendor.servicesProvided}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Service Location
                    </div>
                    <div className="mt-1 capitalize">
                      {vendor.serviceLocation}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Data Access Level
                    </div>
                    <div className="mt-1 capitalize">
                      {vendor.dataAccessLevel.replace("-", " ")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Criticality
                    </div>
                    <div className="mt-1 capitalize">
                      {vendor.criticality.replace("-", " ")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Contract Manager
                    </div>
                    <div className="mt-1">{vendor.contractManager}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contract" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Contract Start Date
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(vendor.contractStart).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Contract End Date
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(vendor.contractEnd).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Contract Value (Annual)
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      ${vendor.contractValue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Next Review Date
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(vendor.nextReviewDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Exit Strategy
                    </div>
                    <div className="mt-1 text-sm">{vendor.exitStrategy}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Risk Assessment & Due Diligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Risk Category
                    </div>
                    <div className="mt-1">
                      <Badge
                        variant={
                          vendor.riskCategory === "critical" ||
                          vendor.riskCategory === "high"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {vendor.riskCategory.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      DD Status
                    </div>
                    <div className="mt-1">
                      <Badge
                        variant={
                          vendor.dueDiligenceStatus === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {vendor.dueDiligenceStatus.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      DD Date
                    </div>
                    <div className="mt-1">
                      {new Date(vendor.dueDiligenceDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Incident History
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      {vendor.incidentHistory > 0 ? (
                        <>
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <span>{vendor.incidentHistory} incidents</span>
                        </>
                      ) : (
                        <span className="text-green-600">No incidents</span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      DD Findings
                    </div>
                    <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                      {vendor.ddFindings}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance & Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Performance Rating
                    </div>
                    <div className="mt-1">
                      {vendor.performanceRating ? (
                        <Badge
                          variant={
                            vendor.performanceRating === "excellent" ||
                            vendor.performanceRating === "good"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {vendor.performanceRating.toUpperCase()}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">
                          Not yet rated
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Incident Count
                    </div>
                    <div className="mt-1 text-lg font-semibold">
                      {vendor.incidentHistory}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-sm font-medium mb-2">
                    Performance Notes
                  </div>
                  <div className="text-sm text-muted-foreground">
                    No performance notes recorded yet.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>Edit Vendor</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
