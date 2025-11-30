'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getIFTIList } from './actions'

const columns = [
  {
    header: 'Case ID',
    accessorKey: 'uid',
  },

  {
    header: 'Sender',
    accessorKey: 'orderingCustomer.fullName',
  },
  {
    header: 'Receiver',
    accessorKey: 'beneficiaryCustomer.fullName',
  },
  {
    header: 'Transaction Amount',
    accessorKey: 'transaction.totalAmount',
  },
  {
    header: 'Transfer Type',
    accessorKey: 'transaction.transferType',
  },
  // {
  //   header: 'Transfer Reason',
  //   accessorKey: 'reportCompletion.transferReason',
  // },
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
export default function IFTIPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  console.log("data", data)

  const getData = async () => {
    setLoading(true)
    try {
      const response = await getIFTIList()
      console.log("response", response)
      if (response.success) {
        setData(response.data)
      }
    } catch (error) {
      console.error("error", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getData()
  }, [])
  const router = useRouter()
  const handleNewIFTI = () => {
    router.push('/dashboard/client/report-compliance/ifti/form')
  }
  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <PageHeader>
        <PageTitle>International Funds Transfer Instruction (IFTI)</PageTitle>
        <PageDescription>Manage and track all International Funds Transfer Instructions (IFTI)</PageDescription>
      </PageHeader>
      <ResizableTable
        columns={columns}
        data={data}
        actions={
          <Button
            size='sm'
            onClick={handleNewIFTI}
          >
            Add New
          </Button>}
      />
    </div>
  )
}