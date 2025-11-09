'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import React from 'react'
import { useRouter } from 'next/navigation'
import { TTRForm } from '@/components/ttr-form'

export default function TTRFormPage() {
  const router = useRouter()
  const handleNewTTR = () => {
    router.push('/dashboard/client/report-compliance/ttr/form')
  }
  return (
    <>
      <TTRForm />
    </>
  )
}
