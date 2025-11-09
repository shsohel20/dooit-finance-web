"use client";

import React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function AssignTrainingDialog({ open, onOpenChange }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Training</DialogTitle>
          <DialogDescription>
            Assign training to an employee or upload completion record
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input id="employeeId" placeholder="e.g., FI4588" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="participantName">Participant Name *</Label>
              <Input id="participantName" placeholder="Full name" required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input id="department" placeholder="e.g., Compliance" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Input
                id="role"
                placeholder="e.g., Compliance Officer"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trainingTopic">Training Topic *</Label>
            <Input
              id="trainingTopic"
              placeholder="e.g., AML Fundamentals"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="trainingType">Training Type *</Label>
              <Select required>
                <SelectTrigger id="trainingType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="induction">Induction</SelectItem>
                  <SelectItem value="annual">Annual Refresh</SelectItem>
                  <SelectItem value="specific">Specific Topic</SelectItem>
                  <SelectItem value="remedial">Remedial</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryMethod">Delivery Method *</Label>
              <Select required>
                <SelectTrigger id="deliveryMethod">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-person</SelectItem>
                  <SelectItem value="online">Live Online</SelectItem>
                  <SelectItem value="elearning">E-learning</SelectItem>
                  <SelectItem value="self-paced">Self-paced</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="trainerName">Trainer Name</Label>
              <Input id="trainerName" placeholder="Trainer's full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="materialVersion">Material Version *</Label>
              <Input id="materialVersion" placeholder="e.g., v2.3" required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateCompleted">Date Completed</Label>
              <Input id="dateCompleted" type="date" />
              <p className="text-xs text-muted-foreground">
                Leave blank if assigning future training
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="refreshFrequency">
                Refresh Frequency (months) *
              </Label>
              <Input
                id="refreshFrequency"
                type="number"
                placeholder="e.g., 12"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes or comments"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Assigning..." : "Assign Training"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
