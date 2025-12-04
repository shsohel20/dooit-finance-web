'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getSMRList } from './actions'
import { formatDateTime } from '@/lib/utils'
import { EyeIcon } from 'lucide-react'
import { SMRDashboard } from './Dashboard'
import SMRHeatmap from './HeatMap'

export default function SMRPage() {
  const router = useRouter()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false);

  const handleView = (id) => {
    router.push(`/dashboard/client/report-compliance/smr-filing/smr/form/detail?id=${id}`)
  }

  const columns = [
    {
      header: 'Action',
      accessorKey: 'action',
      size: 100,
      cell: ({ row }) => {
        return (
          <div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleView(row.original._id)}>
              <EyeIcon />
            </Button>
          </div>
        )
      }
    },
    {
      header: 'Case ID',
      accessorKey: 'uid',
      size: 100,
    },
    {
      header: 'Customer Name',
      accessorKey: 'partC.personOrganisation.name',
    },
    // {
    //   header: 'Customer ID',
    //   accessorKey: 'partC.personOrganisation.id',
    // },
    {
      header: 'Suspicion Date',
      accessorKey: 'updatedAt',
      cell: ({ row }) => {
        return (
          <div>
            <p>{formatDateTime(row?.updatedAt)?.date}</p>
            <span className='text-muted-foreground'>{formatDateTime(row.updatedAt)?.time}</span>
          </div>
        )
      }
    },
    {
      header: 'Analyst',
      accessorKey: 'analyst',
      size: 100,
    },
    {
      header: 'Suspicious Activity',
      accessorKey: 'partB.groundsForSuspicion',
      // size: 200
      cell: ({ row }) => {
        return (
          <div className=' '>
            <p className='max-w-[200px] text-wrap break-words'>{row.original.partB.groundsForSuspicion}</p>
          </div>
        )
      }
    },
    {
      header: 'Status',
      accessorKey: 'status',
      size: 100,
    },
    {
      header: 'Verified',
      accessorKey: 'verified',
      size: 100,
    },
  ]
  const getSmr = async () => {
    setLoading(true)
    try {
      const response = await getSMRList();
      console.log('smr', response)
      if (response.success) {
        setData(response.data)
      }
    } catch (error) {
      console.log('error', error)
    } finally {
      setLoading(false)
    }
  }
  console.log('data', JSON.stringify(data, null, 2))
  useEffect(() => {
    getSmr()
  }, [])

  const handleNewSMR = () => {
    router.push('/dashboard/client/report-compliance/smr-filing/smr/form')
  }

  return (
    <div className='p-4 border rounded-lg space-y-4 bg-white'>
      <PageHeader>
        <PageTitle>Suspicious Matter Report</PageTitle>
        <PageDescription>Manage and track all Suspicious Matter Reports</PageDescription>
      </PageHeader>
      <SMRHeatmap />
      <SMRDashboard />
      <ResizableTable
        loading={loading}
        columns={columns}
        data={data}
        actions={<Button size='sm' onClick={handleNewSMR}>Add New</Button>}
      />
    </div>
  )
}