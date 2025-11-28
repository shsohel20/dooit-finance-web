'use client'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import { Button } from '@/components/ui/button'
import ResizableTable from '@/components/ui/Resizabletable'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { getSMRList } from './actions'
import { formatDateTime } from '@/lib/utils'
export default function SMRPage() {
  const router = useRouter()
  const [data,setData]=useState([])
  const [loading,setLoading]=useState(false)
  const columns = [
    {
      header: 'Case ID',
      accessorKey: 'uid',
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
      cell: ({row})=>{
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
    },
    {
      header: 'Suspicious Activity',
      accessorKey: 'partB.groundsForSuspicion',
      size: 200
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
const getSmr=async()=>{
  setLoading(true)
  try {
    const response= await getSMRList();
    console.log('smr', response)
    if(response.success){
      setData(response.data)
    }
  } catch (error) {
    console.log('error', error)
  }finally{
    setLoading(false)
  }
}
  useEffect(()=>{
    getSmr()
  },[])
  const handleNewSMR = () => {
    router.push('/dashboard/client/report-compliance/smr-filing/smr/form')
  }
  return (
    <div className='p-4 border rounded-lg space-y-4'>
      <PageHeader>
        <PageTitle>Suspicious Matter Report</PageTitle>
        <PageDescription>Manage and track all Suspicious Matter Reports</PageDescription>
      </PageHeader>
      <ResizableTable loading={loading} columns={columns} data={data} actions={<Button size='sm' onClick={handleNewSMR}>Add New</Button>} />
    </div>
  )
}