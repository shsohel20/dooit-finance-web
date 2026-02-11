"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
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


export function SectionTrainingOutcomes() {
  const [rows, setRows] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])

  const addRow = () => setRows((prev) => [...prev, { id: Date.now() }])
  const removeRow = (id) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <SectionWrapper
      number={6}
      title="Communication and Training Outcomes"
      description="List any process or training updates required following this review."
    >
      <div className="flex flex-col gap-3">
        <div className="overflow-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="text-secondary-foreground font-semibold min-w-[200px]">Update / Training Need</TableHead>
                <TableHead className="text-secondary-foreground font-semibold min-w-[150px]">Responsible Person</TableHead>
                <TableHead className="text-secondary-foreground font-semibold min-w-[120px]">Due Date</TableHead>
                <TableHead className="text-secondary-foreground font-semibold min-w-[200px]">Status / Notes</TableHead>
                <TableHead className="text-secondary-foreground font-semibold w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input placeholder="Training need..." className="h-9" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Person" className="h-9" />
                  </TableCell>
                  <TableCell>
                    <Input type="date" className="h-9" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Status / notes..." className="h-9" />
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
