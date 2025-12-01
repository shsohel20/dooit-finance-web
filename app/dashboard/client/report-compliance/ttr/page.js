'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getTTRList } from './actions'
import { Badge } from '@/components/ui/badge'
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
      header: 'UID',
      accessorKey: 'uid',
    },
    {
      header: 'Customer Name',
      accessorKey: 'partB.details.fullName',
      cell: ({ row }) => {
        return (
          <div>
            <p className='font-semibold'>{row.original.partB.details.fullName}</p>
            <p className='text-muted-foreground text-xs'>{row.original.partB.details.occupation}</p>
          </div>
        )
      }
    },
    {
      header: 'Type',
      accessorKey: 'partC.transaction.designatedService',
    },
    {
      header: 'Received($)',
      accessorKey: 'partC.transaction.moneyReceived.australianDollars.amount',
      cell: ({ row }) => {
        return (
          <div>
            <p className='font-semibold text-right'>{row.original.partC.transaction.moneyReceived.australianDollars.amount}</p>
          </div>
        )
      }
    },
    {
      header: 'Provided($)',
      accessorKey: 'partC.transaction.moneyProvided.australianDollars.amount',
      cell: ({ row }) => {
        return (
          <div>
            <p className='font-semibold text-right'>{row.original.partC.transaction.moneyProvided.australianDollars.amount}</p>
          </div>
        )
      }
    },
    {
      header: 'Ref',
      accessorKey: 'metadata.austracReference',
    },

    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }) => {
        return (
          <div>
            <Badge variant='outline'>{row.original.status}</Badge>
          </div>
        )
      }
    },

  ]
}

export default function TTRPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const getData = async () => {
    setLoading(true)
    try {
      const response = await getTTRList();
      console.log('ttr list response', response)
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

  const handleNewTTR = () => {
    router.push('/dashboard/client/report-compliance/ttr/form')
  }
  const handleView = (id) => {
    router.push(`/dashboard/client/report-compliance/ttr/form/detail?id=${id}`)
  }
  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <PageHeader>
        <PageTitle>Threshold Transaction Report (TTR)</PageTitle>
        <PageDescription>Manage and track all Threshold Transaction Reports (TTR)</PageDescription>
      </PageHeader>
      <ResizableTable
        columns={columns(handleView)}
        data={data}
        loading={loading}
        actions={
          <Button
            size='sm'
            // variant='outline'
            onClick={handleNewTTR}
          >
            Add New
          </Button>}
      />
    </div>
  )
}
