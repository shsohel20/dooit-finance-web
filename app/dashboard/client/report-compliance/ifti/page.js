'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getIFTIList } from './actions'
import { EyeIcon } from 'lucide-react'

const columns = (handleView) => {
  return [
    {
      header: 'Action',
      accessorKey: 'action',
      size: 100,
      cell: ({ row }) => {
        return (
          <Button variant='outline' size='sm' onClick={() => handleView(row.original._id)}>
            <EyeIcon />
          </Button>
        )
      }
    },
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
}

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
  const handleView = (id) => {
    router.push(`/dashboard/client/report-compliance/ifti/form/detail?id=${id}`)
  }
  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <PageHeader>
        <PageTitle>International Funds Transfer Instruction (IFTI)</PageTitle>
        <PageDescription>Manage and track all International Funds Transfer Instructions (IFTI)</PageDescription>
      </PageHeader>
      <ResizableTable
        columns={columns(handleView)}
        data={data}
        loading={loading}
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