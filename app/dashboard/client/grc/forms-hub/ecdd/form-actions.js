"use client"

import { Button } from "@/components/ui/button"
import { Printer, Save } from "lucide-react"

export function FormActions() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <Button
        variant="outline"
        onClick={() => window.print()}
        className="gap-2"
      >
        <Printer className="h-4 w-4" />
        Print Form
      </Button>
      <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
        <Save className="h-4 w-4" />
        Save Form
      </Button>
    </div>
  )
}
