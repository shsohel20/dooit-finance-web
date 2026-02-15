import { SectionReviewDetails } from "./section-review-details"
import { SectionReviewPlanning } from "./section-review-planning"
import { SectionTesting } from "./section-testing"
import { SectionPersonnelEscalation } from "./section-personnel-escalation"
import { SectionFindings } from "./section-findings"
import { SectionTrainingOutcomes } from "./section-training-outcomes"
import { SectionSignOff } from "./section-sign-off"
import { FormActions } from "./form-actions"

export default function EcddEffectivenessForm() {
  return (
    <main className="min-h-screen  py-8 md:py-12">
      <div className=" max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6">
          <SectionReviewDetails />
          <SectionReviewPlanning />
          <SectionTesting />
          <SectionPersonnelEscalation />
          <SectionFindings />
          <SectionTrainingOutcomes />
          <SectionSignOff />
          <FormActions />
        </div>
      </div>
    </main>
  )
}
