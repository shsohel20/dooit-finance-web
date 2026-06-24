import { Button } from "@/components/ui/button";
import TemplatesList from "@/views/knowledge-hub/policy-hub/list/TemplatesList";
import React from "react";

export default function PolicyStep({ setCurrentStep }) {
  return (
    <div>
      <TemplatesList hideHeader={true} />
      <div className="flex items-center justify-between">
        <Button size="sm" variant="outline" onClick={() => setCurrentStep((prev) => prev - 1)}>
          Previous
        </Button>
        <Button size="sm" onClick={() => setCurrentStep((prev) => prev + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
