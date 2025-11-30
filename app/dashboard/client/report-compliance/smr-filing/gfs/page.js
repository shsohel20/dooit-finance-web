'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import { EyeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getGFSList } from './actions'
import { SuspicionDashboard } from './dashboard'


const handleColumns = (handleView) => {
  return [
    {
      header: 'Action',
      accessorKey: 'action',
      size: 100,
      cell: ({ row }) => {
        return (
          <Button
            size='sm'
            variant='outline'
            onClick={() => handleView(row.original?._id)}>
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
      header: 'Customer Name',
      accessorKey: 'customerName',
    },
    {
      header: 'Customer ID',
      accessorKey: 'customerUID',
    },
    {
      header: 'Suspicion Date',
      accessorKey: 'suspicionDates',
    },
    {
      header: 'Suspicion Type',
      accessorKey: 'suspicionType',
    },
    {
      header: 'Suspicion Reason',
      accessorKey: 'suspicionReason',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },

  ]
}

export default function GFSPage() {
  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)


  const getData = async () => {
    setLoading(true)
    try {
      const response = await getGFSList()
      setData(response?.data)
    } catch (error) {

    } finally {
      setLoading(false)
    }
    // setData(response.data)
  }
  console.log('data', data)

  useEffect(() => {
    getData()
  }, [])
  const handleNewGFS = () => {
    router.push('/dashboard/client/report-compliance/smr-filing/gfs/form')
  }
  const handleView = (id) => {
    router.push(`/dashboard/client/report-compliance/smr-filing/gfs/form/detail?id=${id}`)
  }
  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <PageHeader>
        <PageTitle>Grounds for Suspicion (GFS)</PageTitle>
        <PageDescription>Manage and track all Grounds for Suspicion (GFS)</PageDescription>
      </PageHeader>
      <SuspicionDashboard data={data} />
      <ResizableTable
        columns={handleColumns(handleView)}
        data={data}
        actions={<Button size='sm'
          onClick={handleNewGFS}>Add New</Button>}
        loading={loading}
      />
    </div>
  )
}
