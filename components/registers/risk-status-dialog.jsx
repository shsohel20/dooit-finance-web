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
import { useState } from "react";
import {
  AlertTriangle,
  User,
  Calendar,
  FileText,
  Shield,
  Ban,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function RiskStatusDialog({ record, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    entityType: "banking",
    listType: "watchlist",
    reasonForListing: "",
    supportingEvidence: "",
    restrictionsApplied: "",
    expiryDate: "",
    reviewDate: "",
  });

  const getListTypeIcon = () => {
    switch (record?.listType) {
      case "internal-blacklist":
      case "termination-list":
        return <Ban className="h-5 w-5 text-red-600" />;
      case "suspension-list":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      default:
        return <Shield className="h-5 w-5 text-blue-600" />;
    }
  };

  const getListTypeBadgeVariant = () => {
    switch (record?.listType) {
      case "internal-blacklist":
      case "termination-list":
        return "destructive";
      case "suspension-list":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (!record) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add to Risk List</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerId">Customer/Client ID</Label>
                  <Input
                    id="customerId"
                    value={formData.customerId}
                    onChange={(e) =>
                      setFormData({ ...formData, customerId: e.target.value })
                    }
                    placeholder="e.g., CUST12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer/Client Name</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    placeholder="Full name or business name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="entityType">Entity Type</Label>
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
                    <SelectItem value="accounting">Accounting Firm</SelectItem>
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

            {/* List Classification */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">List Classification</h3>
              <div className="space-y-2">
                <Label htmlFor="listType">List Type</Label>
                <Select
                  value={formData.listType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, listType: value })
                  }
                >
                  <SelectTrigger id="listType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="watchlist">
                      Watchlist - Enhanced Monitoring
                    </SelectItem>
                    <SelectItem value="suspension-list">
                      Suspension List - Temporary Restriction
                    </SelectItem>
                    <SelectItem value="termination-list">
                      Termination List - Relationship Ended
                    </SelectItem>
                    <SelectItem value="internal-blacklist">
                      Internal Blacklist - Permanent Ban
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Risk Assessment</h3>
              <div className="space-y-2">
                <Label htmlFor="reasonForListing">Reason for Listing</Label>
                <Textarea
                  id="reasonForListing"
                  value={formData.reasonForListing}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      reasonForListing: e.target.value,
                    })
                  }
                  placeholder="Describe the specific concerns, behaviors, or incidents that led to this listing..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportingEvidence">Supporting Evidence</Label>
                <Textarea
                  id="supportingEvidence"
                  value={formData.supportingEvidence}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      supportingEvidence: e.target.value,
                    })
                  }
                  placeholder="Document the evidence supporting this decision (e.g., transaction analysis, reports, investigations)..."
                  rows={3}
                />
              </div>
            </div>

            {/* Restrictions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Restrictions & Controls</h3>
              <div className="space-y-2">
                <Label htmlFor="restrictionsApplied">
                  Restrictions Applied
                </Label>
                <Textarea
                  id="restrictionsApplied"
                  value={formData.restrictionsApplied}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      restrictionsApplied: e.target.value,
                    })
                  }
                  placeholder="Specify the restrictions, controls, or actions to be applied (e.g., transaction limits, approval requirements, account suspension)..."
                  rows={3}
                />
              </div>
            </div>

            {/* Review Dates */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Review Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reviewDate">Review Date</Label>
                  <Input
                    id="reviewDate"
                    type="date"
                    value={formData.reviewDate}
                    onChange={(e) =>
                      setFormData({ ...formData, reviewDate: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    When should this listing be reviewed?
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryDate: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    For temporary suspensions only
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button>Add to Risk List</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getListTypeIcon()}
            Risk Status Record: {record.id}
          </DialogTitle>
          <div className="flex gap-2 pt-2">
            <Badge variant={getListTypeBadgeVariant()} className="capitalize">
              {record.listType.replace("-", " ")}
            </Badge>
            <Badge
              variant={record.status === "active" ? "destructive" : "outline"}
            >
              {record.status.replace("-", " ").toUpperCase()}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {record.entityType}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer/Client Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Customer/Client Name
                  </div>
                  <div className="mt-1 font-medium">{record.customerName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Customer/Client ID
                  </div>
                  <div className="mt-1 font-mono text-sm">
                    {record.customerId}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Listing Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Listing Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Date Added to List
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(record.dateAdded).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    List Type
                  </div>
                  <div className="mt-1">
                    <Badge
                      variant={getListTypeBadgeVariant()}
                      className="capitalize"
                    >
                      {record.listType.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
                {record.expiryDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Expiry Date
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(record.expiryDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
                {record.reviewDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Review Date
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(record.reviewDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Reason for Listing
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {record.reasonForListing}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Supporting Evidence
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {record.supportingEvidence}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Restrictions */}
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2 text-red-900">
                <Ban className="h-4 w-4" />
                Restrictions Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-red-900 bg-white p-3 rounded-md">
                {record.restrictionsApplied}
              </div>
            </CardContent>
          </Card>

          {/* Approval Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Approval Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Approver Name
                  </div>
                  <div className="mt-1">{record.approverName}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Status
                  </div>
                  <div className="mt-1">
                    <Badge
                      variant={
                        record.status === "active" ? "destructive" : "outline"
                      }
                    >
                      {record.status.replace("-", " ").toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {record.status === "active" && (
            <Button variant="destructive">Review Status</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
