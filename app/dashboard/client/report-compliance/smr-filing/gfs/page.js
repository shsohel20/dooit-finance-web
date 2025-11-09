'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import { useRouter } from 'next/navigation'
import React from 'react'
const columns = [
  {
    header: 'Case ID',
    accessorKey: 'caseId',
  },
  {
    header: 'Customer Name',
    accessorKey: 'customerName',
  },
  {
    header: 'Customer ID',
    accessorKey: 'customerId',
  },
  {
    header: 'Suspicion Date',
    accessorKey: 'suspicionDate',
  },
  {
    header: 'Analyst',
    accessorKey: 'analyst',
  },
  {
    header: 'Decision',
    accessorKey: 'decision',
  },
  {
    header: 'Status',
    accessorKey: 'status',
  },
  {
    header: 'Verified',
    accessorKey: 'verified',
  },
]
const data = [
  {
    caseId: '1234567890',
    customerName: 'John Doe',
    customerId: '1234567890',
    suspicionDate: '2021-01-01',
    analyst: 'John Doe',
    decision: 'Reportable',
    status: 'Pending',
    verified: true,
  },
  {
    caseId: '1234567890',
    customerName: 'Jane Doe',
    customerId: '1234567890',
    suspicionDate: '2021-01-01',
    analyst: 'Jane Doe',
    decision: 'Not Reportable',
    status: 'Pending',
    verified: false,
  },
]
export default function GFSPage() {
  const router = useRouter()
  const handleNewGFS = () => {
    router.push('/dashboard/client/report-compliance/smr-filing/gfs/form')
  }
  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <PageHeader>
        <PageTitle>Grounds for Suspicion (GFS)</PageTitle>
        <PageDescription>Manage and track all Grounds for Suspicion (GFS)</PageDescription>
      </PageHeader>
      <ResizableTable
        columns={columns}
        data={data}
        actions={<Button size='sm'
          onClick={handleNewGFS}>Add New</Button>}
      />
    </div>
  )
}
