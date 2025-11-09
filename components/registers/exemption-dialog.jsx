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
import {
  Shield,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function ExemptionDialog({ exemption, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterDepartment: "",
    customerName: "",
    customerId: "",
    entityType: "banking",
    exemptionDetails: "",
    justification: "",
    riskAssessment: "low",
    proposedMitigations: "",
    exemptionDuration: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[v0] New exemption request submitted:", formData);
    // Reset form and close
    setFormData({
      requesterName: "",
      requesterDepartment: "",
      customerName: "",
      customerId: "",
      entityType: "banking",
      exemptionDetails: "",
      justification: "",
      riskAssessment: "low",
      proposedMitigations: "",
      exemptionDuration: "",
    });
    onOpenChange(false);
  };

  if (!exemption) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request Exemption</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Requester Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Requester Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="requesterName">Requester Name *</Label>
                    <Input
                      id="requesterName"
                      value={formData.requesterName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requesterName: e.target.value,
                        })
                      }
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requesterDepartment">Department *</Label>
                    <Input
                      id="requesterDepartment"
                      value={formData.requesterDepartment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requesterDepartment: e.target.value,
                        })
                      }
                      placeholder="Your department"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Customer/Client Information (Optional)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer/Client Name</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      placeholder="If applicable"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerId">Customer/Client ID</Label>
                    <Input
                      id="customerId"
                      value={formData.customerId}
                      onChange={(e) =>
                        setFormData({ ...formData, customerId: e.target.value })
                      }
                      placeholder="If applicable"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entityType">Entity Type *</Label>
                  <Select
                    value={formData.entityType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, entityType: value })
                    }
                  >
                    <SelectTrigger id="entityType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banking">
                        Banking & Financial Institution
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
              </CardContent>
            </Card>

            {/* Exemption Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Exemption Request Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exemptionDetails">
                    Exemption Requested *
                  </Label>
                  <Textarea
                    id="exemptionDetails"
                    value={formData.exemptionDetails}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        exemptionDetails: e.target.value,
                      })
                    }
                    placeholder="Describe what exemption you are requesting..."
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="justification">Justification *</Label>
                  <Textarea
                    id="justification"
                    value={formData.justification}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        justification: e.target.value,
                      })
                    }
                    placeholder="Why is this exemption necessary?"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="riskAssessment">Risk Assessment *</Label>
                    <Select
                      value={formData.riskAssessment}
                      onValueChange={(value) =>
                        setFormData({ ...formData, riskAssessment: value })
                      }
                    >
                      <SelectTrigger id="riskAssessment">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low Risk</SelectItem>
                        <SelectItem value="medium">Medium Risk</SelectItem>
                        <SelectItem value="high">High Risk</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exemptionDuration">Duration *</Label>
                    <Input
                      id="exemptionDuration"
                      value={formData.exemptionDuration}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          exemptionDuration: e.target.value,
                        })
                      }
                      placeholder="e.g., 30 days, One-time"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="proposedMitigations">
                    Proposed Mitigations *
                  </Label>
                  <Textarea
                    id="proposedMitigations"
                    value={formData.proposedMitigations}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        proposedMitigations: e.target.value,
                      })
                    }
                    placeholder="What controls or mitigations will be in place?"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  const getStatusIcon = () => {
    switch (exemption.status) {
      case "approved":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Exemption: {exemption.id}
          </DialogTitle>
          <div className="flex gap-2 pt-2">
            <Badge
              variant={
                exemption.status === "approved"
                  ? "default"
                  : exemption.status === "rejected"
                  ? "destructive"
                  : "secondary"
              }
            >
              {exemption.status.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {exemption.entityType}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Requester Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Requester Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Requester Name
                  </div>
                  <div className="mt-1 font-medium">
                    {exemption.requesterName}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Department
                  </div>
                  <div className="mt-1">{exemption.requesterDepartment}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information (if applicable) */}
          {exemption.customerName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Customer/Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Customer/Client Name
                    </div>
                    <div className="mt-1 font-medium">
                      {exemption.customerName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Customer/Client ID
                    </div>
                    <div className="mt-1 font-mono text-sm">
                      {exemption.customerId}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exemption Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exemption Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Exemption Requested
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {exemption.exemptionDetails}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Justification
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {exemption.justification}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Risk Assessment
                  </div>
                  <div className="mt-1">
                    <Badge variant="outline">{exemption.riskAssessment}</Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Duration
                  </div>
                  <div className="mt-1">{exemption.exemptionDuration}</div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Proposed Mitigations
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {exemption.proposedMitigations}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Approval Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Approver
                  </div>
                  <div className="mt-1">{exemption.approver || "Pending"}</div>
                </div>
                {exemption.approvalDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Approval Date
                    </div>
                    <div className="mt-1">
                      {new Date(exemption.approvalDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {exemption.expiryDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Expiry Date
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(exemption.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rejection Reason (if rejected) */}
          {exemption.status === "rejected" && exemption.rejectionReason && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-900">
                  <AlertTriangle className="h-4 w-4" />
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-red-900">
                  {exemption.rejectionReason}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {exemption.status === "requested" && (
            <Button>Review Exemption</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
