'use client'
import { SuspiciousMatterReportForm } from '@/components/smr-form'
import SelectCaseList from '@/components/ui/SelectCaseList'
import { useSearchParams } from 'next/navigation';
import React from 'react'

export default function SMRFormPage() {
  const id = useSearchParams().get('id');
  return (
    <div>

      <SuspiciousMatterReportForm id={id} />
    </div>
  )
}
