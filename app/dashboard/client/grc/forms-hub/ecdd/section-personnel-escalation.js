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


export function SectionPersonnelEscalation() {
  const [rows, setRows] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])

  const addRow = () => setRows((prev) => [...prev, { id: Date.now() }])
  const removeRow = (id) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <SectionWrapper
      number={4}
      title="Personnel Escalation"
      description="Check if personnel are following the escalation process correctly."
    >
      <div className="flex flex-col gap-3">
        <div className="overflow-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="text-secondary-foreground font-semibold min-w-[140px]">Staff Member</TableHead>
                <TableHead className="text-secondary-foreground font-semibold min-w-[180px]">Client File Name / Escalation</TableHead>
                <TableHead className="text-secondary-foreground font-semibold w-[120px]">All Info Provided?</TableHead>
                <TableHead className="text-secondary-foreground font-semibold w-[120px]">Escalated on Time?</TableHead>
                <TableHead className="text-secondary-foreground font-semibold min-w-[200px]">Training or Communication Issues</TableHead>
                <TableHead className="text-secondary-foreground font-semibold w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input placeholder="Staff name" className="h-9" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Client file / escalation" className="h-9" />
                  </TableCell>
                  <TableCell>
                    <YesNoRadio name={`esc-info-${row.id}`} />
                  </TableCell>
                  <TableCell>
                    <YesNoRadio name={`esc-time-${row.id}`} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Issues identified..." className="h-9" />
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
