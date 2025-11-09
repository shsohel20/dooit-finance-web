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
import { AlertTriangle, User, Calendar, FileText } from "lucide-react";

export function EscalationDialog({ escalation, open, onOpenChange }) {
  const [formData, setFormData] = useState({
    customerName: "",
    customerId: "",
    entityType: "banking",
    issueDescription: "",
    reasonForEscalation: "",
    escalatedTo: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("[v0] New escalation submitted:", formData);
    // Reset form and close
    setFormData({
      customerName: "",
      customerId: "",
      entityType: "banking",
      issueDescription: "",
      reasonForEscalation: "",
      escalatedTo: "",
    });
    onOpenChange(false);
  };

  if (!escalation) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Escalation</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Customer/Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer/Client Name *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customerName: e.target.value,
                        })
                      }
                      placeholder="Enter customer name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerId">Customer/Client ID *</Label>
                    <Input
                      id="customerId"
                      value={formData.customerId}
                      onChange={(e) =>
                        setFormData({ ...formData, customerId: e.target.value })
                      }
                      placeholder="Enter customer ID"
                      required
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

            {/* Issue Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Issue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="issueDescription">Issue Description *</Label>
                  <Textarea
                    id="issueDescription"
                    value={formData.issueDescription}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        issueDescription: e.target.value,
                      })
                    }
                    placeholder="Describe the issue requiring escalation..."
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reasonForEscalation">
                    Reason for Escalation *
                  </Label>
                  <Textarea
                    id="reasonForEscalation"
                    value={formData.reasonForEscalation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        reasonForEscalation: e.target.value,
                      })
                    }
                    placeholder="Why does this require senior review or decision?"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Escalation Target */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Escalation Target</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="escalatedTo">Escalate To *</Label>
                  <Select
                    value={formData.escalatedTo}
                    onValueChange={(value) =>
                      setFormData({ ...formData, escalatedTo: value })
                    }
                  >
                    <SelectTrigger id="escalatedTo">
                      <SelectValue placeholder="Select escalation recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MLRO">
                        MLRO (Money Laundering Reporting Officer)
                      </SelectItem>
                      <SelectItem value="Chief Risk Officer">
                        Chief Risk Officer
                      </SelectItem>
                      <SelectItem value="Chief Compliance Officer">
                        Chief Compliance Officer
                      </SelectItem>
                      <SelectItem value="Managing Partner">
                        Managing Partner
                      </SelectItem>
                      <SelectItem value="Senior Manager">
                        Senior Manager
                      </SelectItem>
                      <SelectItem value="Legal Counsel">
                        Legal Counsel
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="submit">Create Escalation</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Escalation: {escalation.id}
          </DialogTitle>
          <div className="flex gap-2 pt-2">
            <Badge
              variant={
                escalation.status === "resolved" ? "default" : "destructive"
              }
            >
              {escalation.status.replace("-", " ").toUpperCase()}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {escalation.entityType}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Customer Information */}
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
                    {escalation.customerName}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Customer/Client ID
                  </div>
                  <div className="mt-1 font-mono text-sm">
                    {escalation.customerId}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issue Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Issue Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Issue Description
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {escalation.issueDescription}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Reason for Escalation
                </div>
                <div className="mt-1 text-sm bg-muted p-3 rounded-md">
                  {escalation.reasonForEscalation}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Escalation Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Escalation Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Escalated By
                  </div>
                  <div className="mt-1">{escalation.escalatedBy}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Escalated To
                  </div>
                  <div className="mt-1">{escalation.escalatedTo}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Escalation Date
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(escalation.escalationDate).toLocaleDateString()}
                  </div>
                </div>
                {escalation.decisionDate && (
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Decision Date
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(escalation.decisionDate).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Decision/Outcome */}
          {escalation.decision && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Decision / Outcome</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm bg-muted p-3 rounded-md">
                  {escalation.decision}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {escalation.status !== "resolved" && <Button>Update Status</Button>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
