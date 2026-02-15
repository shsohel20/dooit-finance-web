"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SectionWrapper } from "./section-wrapper"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/* -------- Shared yes/no inline radio -------- */
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

/* -------- Verify Completeness -------- */
const COMPLETENESS_CHECKPOINTS = [
  "Source of wealth",
  "Source of funds",
  "Open-source background checks",
  "Ownership structure diagram",
]

function VerifyCompleteness() {
  const [otherCheckpoint, setOtherCheckpoint] = useState("")

  const checkpoints = [...COMPLETENESS_CHECKPOINTS, ...(otherCheckpoint || otherCheckpoint === "" ? [`Other: ${otherCheckpoint}`] : [])]

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Verify Completeness</h3>
        <p className="text-sm text-muted-foreground">
          For each high risk client selected, confirm all required information is recorded.
          List any missing or incomplete details.
        </p>
      </div>
      <div className="overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="text-secondary-foreground font-semibold min-w-[180px]">Checkpoint</TableHead>
              <TableHead className="text-secondary-foreground font-semibold w-[100px]">Completed</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[200px]">Missing / Incorrect Details</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[200px]">Evidence / Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COMPLETENESS_CHECKPOINTS.map((cp) => {
              const key = cp.toLowerCase().replace(/\s+/g, "-")
              return (
                <TableRow key={key}>
                  <TableCell className="font-medium text-foreground">{cp}</TableCell>
                  <TableCell>
                    <YesNoRadio name={`completeness-${key}`} />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Details..." className="h-9" />
                  </TableCell>
                  <TableCell>
                    <Input placeholder="Notes..." className="h-9" />
                  </TableCell>
                </TableRow>
              )
            })}
            {/* Other row */}
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground whitespace-nowrap">Other:</span>
                  <Input
                    value={otherCheckpoint}
                    onChange={(e) => setOtherCheckpoint(e.target.value)}
                    placeholder="Specify..."
                    className="h-9"
                  />
                </div>
              </TableCell>
              <TableCell>
                <YesNoRadio name="completeness-other" />
              </TableCell>
              <TableCell>
                <Input placeholder="Details..." className="h-9" />
              </TableCell>
              <TableCell>
                <Input placeholder="Notes..." className="h-9" />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


function VerifyTimelines() {
  const [rows, setRows] = useState([
    { id: 1, recordId: "", escalationDate: "", submissionDate: "", comments: "" },
    { id: 2, recordId: "", escalationDate: "", submissionDate: "", comments: "" },
    { id: 3, recordId: "", escalationDate: "", submissionDate: "", comments: "" },
  ])

  const addRow = () =>
    setRows((prev) => [...prev, { id: Date.now(), recordId: "", escalationDate: "", submissionDate: "", comments: "" }])

  const removeRow = (id) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Verify Timelines</h3>
        <p className="text-sm text-muted-foreground">
          Check the date the client was escalated to the AML/CTF compliance officer. Identify any late submissions and explanations.
        </p>
      </div>
      <div className="overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="text-secondary-foreground font-semibold min-w-[140px]">Record Identification</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[140px]">Escalation Date</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[140px]">Submission Date</TableHead>
              <TableHead className="text-secondary-foreground font-semibold w-[110px]">Within Timeframe?</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[200px]">Comments / Reasons for Delay</TableHead>
              <TableHead className="text-secondary-foreground font-semibold w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Input placeholder="Record ID" className="h-9" />
                </TableCell>
                <TableCell>
                  <Input type="date" className="h-9" />
                </TableCell>
                <TableCell>
                  <Input type="date" className="h-9" />
                </TableCell>
                <TableCell>
                  <YesNoRadio name={`timeline-${row.id}`} />
                </TableCell>
                <TableCell>
                  <Input placeholder="Comments..." className="h-9" />
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
  )
}



function VerifySubmissionAccuracy() {
  const [rows, setRows] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])

  const addRow = () => setRows((prev) => [...prev, { id: Date.now() }])
  const removeRow = (id) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Verify Submission Accuracy</h3>
        <p className="text-sm text-muted-foreground">
          Compare enhanced customer due diligence (ECDD) file data with internal system records. Record any inconsistencies and required corrections below.
        </p>
      </div>
      <div className="overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="text-secondary-foreground font-semibold min-w-[140px]">Record ID</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[160px]">Data Fields Checked</TableHead>
              <TableHead className="text-secondary-foreground font-semibold w-[100px]">{"Error(s) Found?"}</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[250px]">{"Description of Error(s) and Action Taken"}</TableHead>
              <TableHead className="text-secondary-foreground font-semibold w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Input placeholder="Record ID" className="h-9" />
                </TableCell>
                <TableCell>
                  <Input placeholder="Fields checked" className="h-9" />
                </TableCell>
                <TableCell>
                  <YesNoRadio name={`accuracy-${row.id}`} />
                </TableCell>
                <TableCell>
                  <Input placeholder="Description and action..." className="h-9" />
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
  )
}



function VerifyFollowUpActions() {
  const [rows, setRows] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])

  const addRow = () => setRows((prev) => [...prev, { id: Date.now() }])
  const removeRow = (id) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Verify Follow-up Actions</h3>
        <p className="text-sm text-muted-foreground">
          Check post-ECDD actions are completed. For example, client risk updated or alerts reviewed.
        </p>
      </div>
      <div className="overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="text-secondary-foreground font-semibold min-w-[160px]">Client File Name</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[180px]">Follow-up Action Required</TableHead>
              <TableHead className="text-secondary-foreground font-semibold w-[100px]">Completed?</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[130px]">Date Completed</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[200px]">Comments / Further Actions</TableHead>
              <TableHead className="text-secondary-foreground font-semibold w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Input placeholder="Client file name" className="h-9" />
                </TableCell>
                <TableCell>
                  <Input placeholder="Action required" className="h-9" />
                </TableCell>
                <TableCell>
                  <YesNoRadio name={`followup-${row.id}`} />
                </TableCell>
                <TableCell>
                  <Input type="date" className="h-9" />
                </TableCell>
                <TableCell>
                  <Input placeholder="Comments..." className="h-9" />
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
  )
}


function VerifySeniorManagerApproval() {
  const [rows, setRows] = useState([{ id: 1 }, { id: 2 }, { id: 3 }])

  const addRow = () => setRows((prev) => [...prev, { id: Date.now() }])
  const removeRow = (id) => {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Verify Senior Manager Approval</h3>
        <p className="text-sm text-muted-foreground">
          Confirm senior manager approval is documented for each high risk client.
        </p>
      </div>
      <div className="overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="text-secondary-foreground font-semibold min-w-[160px]">Client File Name</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[130px]">Date Escalated</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[160px]">Date Approved by Senior Manager</TableHead>
              <TableHead className="text-secondary-foreground font-semibold w-[140px]">Approval Before Services?</TableHead>
              <TableHead className="text-secondary-foreground font-semibold w-12">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Input placeholder="Client file name" className="h-9" />
                </TableCell>
                <TableCell>
                  <Input type="date" className="h-9" />
                </TableCell>
                <TableCell>
                  <Input type="date" className="h-9" />
                </TableCell>
                <TableCell>
                  <YesNoRadio name={`approval-${row.id}`} />
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
  )
}

/* -------- Main Section 3 Export -------- */
export function SectionTesting() {
  return (
    <SectionWrapper number={3} title="Testing">
      <div className="flex flex-col gap-8">
        <VerifyCompleteness />
        <VerifyTimelines />
        <VerifySubmissionAccuracy />
        <VerifyFollowUpActions />
        <VerifySeniorManagerApproval />
      </div>
    </SectionWrapper>
  )
}
