"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import StaffDetails from "./details";

/**
 * Slide-out drawer that renders the full Staff details view for a single staff
 * member. Reuses the same StaffDetails component as the dedicated details page,
 * driven by an explicit `staffId` prop instead of the URL search params.
 */
export default function StaffDetailDrawer({ staffId, open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-3xl lg:max-w-4xl overflow-y-auto p-6"
      >
        <SheetHeader className="p-0">
          <SheetTitle>Staff Details</SheetTitle>
          <SheetDescription>Onboarding profile, KYC and AML screening.</SheetDescription>
        </SheetHeader>
        {staffId ? <StaffDetails key={staffId} staffId={staffId} /> : null}
      </SheetContent>
    </Sheet>
  );
}
