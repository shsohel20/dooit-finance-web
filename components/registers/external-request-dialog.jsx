"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  User,
  Calendar,
  FileText,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function ExternalRequestDialog({ request, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    referenceNumber: "",
    category: "",
    entityType: "banking",
    requestingAgency: "",
    requestingOfficer: "",
    dateReceived: "",
    legalDeadline: "",
    scopeOfRequest: "",
    officerAssigned: "",
    tippingOffRisk: "medium",
    actionsTakenToPreventTippingOff: "",
  });

  if (!request) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log New External Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Request Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Reference Number *
                  </label>
                  <Input
                    placeholder="e.g., AUSTRAC-S49-2024-1234"
                    value={formData.referenceNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenceNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category *</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Section 49 AUSTRAC Request">
                        Section 49 AUSTRAC Request
                      </SelectItem>
                      <SelectItem value="Production Order">
                        Production Order
                      </SelectItem>
                      <SelectItem value="Search Warrant">
                        Search Warrant
                      </SelectItem>
                      <SelectItem value="ATO Production Order">
                        ATO Production Order
                      </SelectItem>
                      <SelectItem value="ASIC Information Request">
                        ASIC Information Request
                      </SelectItem>
                      <SelectItem value="LEA Request">LEA Request</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entity Type *</label>
                  <Select
                    value={formData.entityType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, entityType: value })
                    }
                  >
                    <SelectTrigger>
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
            </div>

            {/* Requesting Agency */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">
                Requesting Agency Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Requesting Agency *
                  </label>
                  <Input
                    placeholder="e.g., AUSTRAC, AFP, ATO"
                    value={formData.requestingAgency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requestingAgency: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Requesting Officer & Contact *
                  </label>
                  <Input
                    placeholder="Name and contact details"
                    value={formData.requestingOfficer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requestingOfficer: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Received *</label>
                  <Input
                    type="date"
                    value={formData.dateReceived}
                    onChange={(e) =>
                      setFormData({ ...formData, dateReceived: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Legal Deadline *
                  </label>
                  <Input
                    type="date"
                    value={formData.legalDeadline}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        legalDeadline: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Request Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Scope of Request *
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Describe what information is being requested..."
                    value={formData.scopeOfRequest}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scopeOfRequest: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Officer Assigned *
                  </label>
                  <Input
                    placeholder="Internal officer handling this request"
                    value={formData.officerAssigned}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        officerAssigned: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Tipping-Off Risk Management */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">
                Tipping-Off Risk Management
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tipping-Off Risk Assessment *
                  </label>
                  <Select
                    value={formData.tippingOffRisk}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tippingOffRisk: value })
                    }
                  >
                    <SelectTrigger>
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
                  <label className="text-sm font-medium">
                    Actions Taken to Prevent Tipping Off *
                  </label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Document all measures taken to prevent tipping off the subject..."
                    value={formData.actionsTakenToPreventTippingOff}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actionsTakenToPreventTippingOff: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log("[v0] Creating new external request:", formData);
                  onOpenChange(false);
                }}
              >
                Log Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const getDaysUntilDeadline = () => {
    const deadline = new Date(request.legalDeadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysUntilDeadline();
  const isUrgent = daysRemaining <= 2;
  const isOverdue = daysRemaining < 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            {request.category}
          </DialogTitle>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline">{request.id}</Badge>
            <Badge variant="outline">{request.referenceNumber}</Badge>
            <Badge
              variant={
                request.status === "completed"
                  ? "default"
                  : request.status === "new"
                  ? "secondary"
                  : "outline"
              }
            >
              {request.status.replace("-", " ").toUpperCase()}
            </Badge>
            <Badge
              variant={
                request.tippingOffRisk === "high"
                  ? "destructive"
                  : request.tippingOffRisk === "medium"
                  ? "secondary"
                  : "outline"
              }
            >
              {request.tippingOffRisk.toUpperCase()} TIPPING OFF RISK
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Deadline Alert */}
          {request.status !== "completed" && (
            <Card
              className={
                isOverdue
                  ? "border-red-500 bg-red-50"
                  : isUrgent
                  ? "border-orange-500 bg-orange-50"
                  : ""
              }
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock
                    className={`h-5 w-5 ${
                      isOverdue
                        ? "text-red-600"
                        : isUrgent
                        ? "text-orange-600"
                        : ""
                    }`}
                  />
                  <div>
                    <div className="font-semibold">
                      {isOverdue
                        ? "OVERDUE"
                        : isUrgent
                        ? "URGENT"
                        : "Deadline Approaching"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isOverdue
                        ? `Overdue by ${Math.abs(daysRemaining)} days`
                        : `${daysRemaining} days remaining until deadline`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Requesting Agency */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Requesting Agency
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Agency
                  </div>
                  <div className="mt-1 font-medium">
                    {request.requestingAgency}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Officer & Contact
                  </div>
                  <div className="mt-1">{request.requestingOfficer}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Date Received
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(request.dateReceived).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Legal Deadline
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(request.legalDeadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Scope of Request
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {request.scopeOfRequest}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Officer Assigned
                </div>
                <div className="mt-1">{request.officerAssigned}</div>
              </div>
            </CardContent>
          </Card>

          {/* Tipping Off Risk Management */}
          <Card
            className={
              request.tippingOffRisk === "high" ? "border-red-200" : ""
            }
          >
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Tipping Off Risk Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Risk Assessment
                </div>
                <div className="mt-1">
                  <Badge
                    variant={
                      request.tippingOffRisk === "high"
                        ? "destructive"
                        : request.tippingOffRisk === "medium"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {request.tippingOffRisk.toUpperCase()} RISK
                  </Badge>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Actions Taken to Prevent Tipping Off
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {request.actionsTakenToPreventTippingOff}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          {request.status === "completed" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Information Delivered
                    </div>
                    <div className="mt-1 text-sm">
                      {request.informationDelivered}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Delivery Method
                    </div>
                    <div className="mt-1">{request.deliveryMethod}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Date Delivered
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {request.dateDelivered &&
                        new Date(request.dateDelivered).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Internal Approver
                    </div>
                    <div className="mt-1">{request.internalApprover}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {request.status !== "completed" && <Button>Update Status</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
