"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SectionWrapper } from "./section-wrapper"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const RISK_FACTORS = [
  { id: "ml-tf", label: "High risk of money laundering or terrorism finance (ML/TF)" },
  { id: "fatf-country", label: "Link to high risk or Financial Action Task Force (FATF)-monitored country" },
  { id: "domestic-pep", label: "High risk domestic or international organisation politically exposed person (PEP)" },
  { id: "foreign-pep", label: "Foreign PEP" },
  { id: "unusual-activity", label: "Unusual or inconsistent activity" },
  { id: "smr-submitted", label: "Suspicious matter report (SMR) previously submitted" },
]

const FILE_TYPES = [
  "High ML/TF risk",
  "Link to high risk country",
  "High risk domestic or international organisation PEP",
  "Foreign PEP",
  "Unusual or inconsistent activity",
  "SMR previously submitted",
]



export function SectionReviewPlanning() {
  const [fileRows, setFileRows] = useState(
    FILE_TYPES.map((type, i) => ({ id: i, type, clientName: "", reason: "" }))
  )

  const addRow = () => {
    setFileRows((prev) => [
      ...prev,
      { id: Date.now(), type: "", clientName: "", reason: "" },
    ])
  }

  const removeRow = (id) => {
    if (fileRows.length <= 1) return
    setFileRows((prev) => prev.filter((row) => row.id !== id))
  }

  const updateRow = (id, field, value) => {
    setFileRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    )
  }

  return (
    <SectionWrapper number={2} title="Review Planning">
      <div className="flex flex-col gap-6">
        {/* Define scope */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-foreground">Define Scope</h3>
          <p className="text-sm text-muted-foreground">
            Select which high risk factors you will review this period:
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {RISK_FACTORS.map((factor) => (
              <div key={factor.id} className="flex items-start gap-2.5">
                <Checkbox id={factor.id} className="mt-0.5" />
                <Label htmlFor={factor.id} className="text-sm font-normal leading-snug cursor-pointer">
                  {factor.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Sampling method */}
        <div className="flex flex-col gap-1.5">
          <h3 className="text-sm font-semibold text-foreground">Sampling Method</h3>
          <p className="text-sm text-muted-foreground">
            Describe how you selected the files. For example, random, risk-based or specific timeframe.
          </p>
          <Textarea
            placeholder="Record details here..."
            className="min-h-[80px]"
          />
        </div>

        {/* File selection */}
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">File Selection</h3>
            <p className="text-sm text-muted-foreground">
              Select at least 3 high risk client files in each category for testing.
            </p>
          </div>
          <div className="overflow-auto rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary hover:bg-secondary">
                  <TableHead className="text-secondary-foreground font-semibold min-w-[200px]">Type</TableHead>
                  <TableHead className="text-secondary-foreground font-semibold min-w-[180px]">Client / File Name</TableHead>
                  <TableHead className="text-secondary-foreground font-semibold min-w-[200px]">Reason for Selection</TableHead>
                  <TableHead className="text-secondary-foreground font-semibold w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fileRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Input
                        value={row.type}
                        onChange={(e) => updateRow(row.id, "type", e.target.value)}
                        placeholder="Risk type"
                        className="h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.clientName}
                        onChange={(e) => updateRow(row.id, "clientName", e.target.value)}
                        placeholder="Client or file name"
                        className="h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={row.reason}
                        onChange={(e) => updateRow(row.id, "reason", e.target.value)}
                        placeholder="If applicable"
                        className="h-9"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeRow(row.id)}
                        aria-label="Remove row"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button variant="outline" size="sm" onClick={addRow} className="self-start bg-transparent">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Row
          </Button>
        </div>
      </div>
    </SectionWrapper>
  )
}
