"use client"

import { Input } from "@/components/ui/input"
import { SectionWrapper } from "./section-wrapper"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const SIGN_OFF_ROLES = [
  "AML/CTF compliance officer",
  "Senior manager",
  "Governing body representative (if applicable)",
]

export function SectionSignOff() {
  return (
    <SectionWrapper
      number={7}
      title="Sign-off"
      description="Submit the report to the senior manager and governing body for review and sign-off."
    >
      <div className="overflow-auto rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="text-secondary-foreground font-semibold min-w-[180px]">Name</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[240px]">Role</TableHead>
              <TableHead className="text-secondary-foreground font-semibold min-w-[140px]">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SIGN_OFF_ROLES.map((role) => (
              <TableRow key={role}>
                <TableCell>
                  <Input placeholder="Full name" className="h-9" />
                </TableCell>
                <TableCell className="font-medium text-foreground text-sm">
                  {role}
                </TableCell>
                <TableCell>
                  <Input type="date" className="h-9" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionWrapper>
  )
}
