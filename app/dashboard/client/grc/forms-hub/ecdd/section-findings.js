"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SectionWrapper } from "./section-wrapper"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function YesNoRadio({ name }) {
  return (
    <RadioGroup name={name} className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        <RadioGroupItem value="yes" id={`${name}-yes`} />
        <Label htmlFor={`${name}-yes`} className="text-sm font-normal cursor-pointer">
          Yes
        </Label>
      </div>
      <div className="flex items-center gap-1.5">
        <RadioGroupItem value="no" id={`${name}-no`} />
        <Label htmlFor={`${name}-no`} className="text-sm font-normal cursor-pointer">
          No
        </Label>
      </div>
    </RadioGroup>
  )
}


export function SectionFindings() {
  const [rows, setRows] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])

  const addRow = () => setRows((prev) => [...prev, { id: Date.now() }])
  const removeRow = (id) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <SectionWrapper
      number={5}
      title="Findings and Corrective Actions"
      description="Follow the Maintain your AML/CTF program form when implementing corrective actions and changes to the AML/CTF program. If a corrective action fails, review and update it as soon as practicable."
    >
      <div className="flex flex-col gap-3">
        <div className="overflow-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="text-secondary-foreground font-semibold min-w-[160px]">Finding</TableHead>
                <TableHead className="text-secondary-foreground font-semibold min-w-[180px]">Corrective Action Required</TableHead>
                <TableHead className="text-secondary-foreground font-semibold min-w-[130px]">Responsible Person</TableHead>
                <TableHead className="text-secondary-foreground font-semibold min-w-[120px]">Target Date</TableHead>
                <TableHead className="text-secondary-foreground font-semibold min-w-[120px]">Date Completed</TableHead>
                <TableHead className="text-secondary-foreground font-semibold w-[130px]">Approved by Senior Manager?</TableHead>
                <TableHead className="text-secondary-foreground font-semibold w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input placeholder="Finding..." className="h-9" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Action required..." className="h-9" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Person" className="h-9" />
                  </TableCell>
                  <TableCell>
                    <Input type="date" className="h-9" />
                  </TableCell>
                  <TableCell>
                    <Input type="date" className="h-9" />
                  </TableCell>
                  <TableCell>
                    <YesNoRadio name={`finding-approval-${row.id}`} />
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
    </SectionWrapper>
  )
}
