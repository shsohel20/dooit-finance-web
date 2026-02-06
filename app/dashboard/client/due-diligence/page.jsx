'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import PersonnelDueDiligenceForm from './personnel/page'
import ComplianceDueDiligenceForm from './compliance-officer/page'
import ComplianceOfficerAndGoverningBodyDueDiligenceForm from './compliance-officer-and-governing-body/page'
function DueDiligencePage() {
    const [dueDiligenceType, setDueDiligenceType] = useState('personnel')
  return (
    <div>
        <div>
        <h1 className='text-center'>Due Diligence</h1>
        <p className='text-center text-sm text-muted-foreground'>Select the due diligence type to continue</p>
        </div>
       <div className='mt-4'>
       <div className='w-sm mx-auto'>
            {/* due diligence type */}
           <Label>Type</Label>
           <Select value={dueDiligenceType} onValueChange={setDueDiligenceType}>
            <SelectTrigger>
                <SelectValue placeholder="Select Due Diligence Type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="personnel">Personnel</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="compliance-officer-and-governing-body">Compliance Officer and Governing Body</SelectItem>
            </SelectContent>
           </Select>
        </div>
        <div>
            {dueDiligenceType === 'personnel' && <PersonnelDueDiligenceForm />}
            {dueDiligenceType === 'compliance' && <ComplianceDueDiligenceForm />}
            {dueDiligenceType === 'compliance-officer-and-governing-body' && <ComplianceOfficerAndGoverningBodyDueDiligenceForm />}
        </div>
       </div>
    </div>
  )
}

export default DueDiligencePage