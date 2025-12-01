'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTTRList } from './actions'
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
export default function TTRPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const getData = async () => {
    setLoading(true)
    try {
      const response = await getTTRList();
      console.log('response', response)
      setData(response.data)
    } catch (error) {
      console.error('error', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  const router = useRouter()
  const handleNewTTR = () => {
    router.push('/dashboard/client/report-compliance/ttr/form')
  }
  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <PageHeader>
        <PageTitle>Threshold Transaction Report (TTR)</PageTitle>
        <PageDescription>Manage and track all Threshold Transaction Reports (TTR)</PageDescription>
      </PageHeader>
      <ResizableTable
        columns={columns}
        data={data}
        loading={loading}
        actions={
          <Button
            size='sm'
            onClick={handleNewTTR}
          >
            Add New
          </Button>}
      />
    </div>
  )
}
