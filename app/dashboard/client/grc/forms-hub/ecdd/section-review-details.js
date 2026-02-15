"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SectionWrapper } from "./section-wrapper"

export function SectionReviewDetails() {
  return (
    <SectionWrapper number={1} title="Review Details">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review-period">Review period (quarter/date range)</Label>
          <Input id="review-period" placeholder="e.g. Q1 2026 or 01/01/2026 - 31/03/2026" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="reviewed-by">Reviewed by</Label>
          <Input id="reviewed-by" placeholder="Full name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="review-date">Date</Label>
          <Input id="review-date" type="date" />
        </div>
      </div>
    </SectionWrapper>
  )
}
