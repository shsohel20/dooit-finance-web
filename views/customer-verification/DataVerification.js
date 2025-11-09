import CustomDatatable from '@/components/CustomDatatable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconFile, IconMoneybag, IconUserCheck } from '@tabler/icons-react'
import React from 'react'

export default function DataVerification() {
  const sourceVerificationColumns = [
    {
      header: 'Source',
      accessorKey: 'source',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Actions',
      accessorKey: 'actions',
    },
  ]
  const sourceVerificationData = [
    {
      source: 'Bank Statement',
      status: 'Passed',
      actions: 'View',
    },
    {
      source: 'Bank Statement',
      status: 'Passed',
      actions: 'View',
    },
    {
      source: 'Bank Statement',
      status: 'Passed',
      actions: 'View',
    },
  ]
  const consistenceCheckColumns = [
    {
      header: 'Check',
      accessorKey: 'check',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Details',
      accessorKey: 'details',
    },
  ]
  const consistenceCheckData = [
    {
      check: 'Check 1',
      status: 'Passed',
      details: 'View',
    },
  ]
  return (
    <div className='grid grid-cols-3 gap-4 bg-secondary rounded-lg p-2'>
      <div className='col-span-2  rounded-lg p-2  space-y-4'>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 gap-4'>
              <div className=''>
                <h4 className='font-semibold'>Name</h4>
                <p>John Doe</p>
              </div>
              <div className=''>
                <h4 className='font-semibold'>Email</h4>
                <p>john.doe@example.com</p>
              </div>
              <div className=''>
                <h4 className='font-semibold'>Phone</h4>
                <p>+1234567890</p>
              </div>
              <div className=''>
                <h4 className='font-semibold'>Address</h4>
                <p>123 Main St, Anytown, USA</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Source Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomDatatable columns={sourceVerificationColumns} data={sourceVerificationData} />
          </CardContent>

        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Consistence Check</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomDatatable columns={consistenceCheckColumns} data={consistenceCheckData} />
          </CardContent>

        </Card>
      </div>
      <div>
        {/* add the status of the verification */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex items-center gap-2'>
                <span className='size-10 bg-secondary rounded-lg flex items-center justify-center p-1 [&>svg]:size-5 [&>svg]:text-secondary-foreground'>
                  <IconUserCheck />
                </span>
                <div>
                  <p className='font-semibold'>Identity Status</p>
                  <p>Passed</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <span className='size-10 bg-secondary rounded-lg flex items-center justify-center p-1 [&>svg]:size-5 [&>svg]:text-secondary-foreground'>
                  <IconFile />
                </span>
                <div>
                  <p className='font-semibold'>Document Status</p>
                  <p>Passed</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <span className='size-10 bg-secondary rounded-lg flex items-center justify-center p-1 [&>svg]:size-5 [&>svg]:text-secondary-foreground'>
                  <IconMoneybag />
                </span>
                <div>
                  <p className='font-semibold'>Financial Status</p>
                  <p>Not submitted</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
