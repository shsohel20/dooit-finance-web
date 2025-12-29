'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import { ChevronDownIcon, EyeIcon, PencilIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getGFSList } from './actions'
import { SuspicionDashboard } from './dashboard'
import { StatusPill } from '@/components/ui/StatusPill'
import { riskLevelVariants } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'


const handleColumns = (handleView, handleEdit) => {
  return [
    {
      header: 'Action',
      accessorKey: 'action',
      size: 100,
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleEdit(row.original?._id)}>
              <PencilIcon />
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => handleView(row.original?._id)}>
              <EyeIcon />
            </Button>
          </div>
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
      cell: ({ row }) => {
        return (
          <div>
            <h5 className="text-heading font-semibold capitalize flex justify-between" >
              <span className='text-md'>
                {row.original.customerName}
              </span>

            </h5>
            <p className="font-mono text-neutral-500">#{row.original.customerUID}</p>
          </div>
        )
      }
    },
    // {
    //   header: 'Customer ID',
    //   accessorKey: 'customerUID',
    // },
    {
      header: 'Suspicion Date',
      accessorKey: 'suspicionDates',
    },
    {
      header: 'Suspicion Type',
      accessorKey: 'suspicionType',
      cell: ({ row }) => {
        return (
          <div>
            <p className='max-w-[200px] text-wrap break-words line-clamp-2 text-ellipsis overflow-hidden'>{row.original.suspicionType}</p>
          </div>
        )
      }
    },
    {
      header: 'Suspicion Reason',
      accessorKey: 'suspicionReason',
      size: 300,
      cell: ({ row }) => {
        return (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <p className='max-w-[200px] text-wrap break-words   overflow-hidden line-clamp-2 text-ellipsis'>{row.original.suspicionReason}</p>

                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div>
                  <p className='max-w-[300px] text-wrap break-words   overflow-hidden '>{row.original.suspicionReason}</p>

                </div>
              </TooltipContent>
            </Tooltip>



          </>

        )
      }
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

  useEffect(() => {
    getData()
  }, [])
  const handleNewGFS = () => {
    router.push('/dashboard/client/report-compliance/smr-filing/gfs/form')
  }
  const handleView = (id) => {
    router.push(`/dashboard/client/report-compliance/smr-filing/gfs/form/detail?id=${id}`)
  }
  const handleEdit = (id) => {
    router.push(`/dashboard/client/report-compliance/smr-filing/gfs/form?id=${id}`)
  }
  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <PageHeader>
        <PageTitle>Grounds for Suspicion (GFS)</PageTitle>
        <PageDescription>Manage and track all Grounds for Suspicion (GFS)</PageDescription>
      </PageHeader>
      <SuspicionDashboard data={data} />
      <ResizableTable
        columns={handleColumns(handleView, handleEdit)}
        data={data}
        actions={<Button size='sm'
          onClick={handleNewGFS}>Add New</Button>}
        loading={loading}
      />
    </div>
  )
}
