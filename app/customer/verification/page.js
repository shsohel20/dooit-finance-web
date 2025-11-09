import React from 'react'
import Header from '../registration/(layout)/Header'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IconFile, IconMoneybag, IconUserCheck } from '@tabler/icons-react'
import CustomDatatable from '@/components/CustomDatatable'
import DataVerification from '@/views/customer-verification/DataVerification'

export default function CustomerVerificationPage() {
  const tabs = [
    {
      label: 'Data Verification',
      value: 'data-verification',
    },
    {
      label: 'Document & Liveness',
      value: 'document-liveness',
    },
    {
      label: 'PEP/Sanction/Adverse',
      value: 'pep-sanction-adverse',
    }
  ]

  return (
    <div>
      <Header />
      <div className='container pt-8 '>
        <h1 className='text-xl font-semibold tracking-tight'>Customer Verification</h1>
        <p>Check the status of this customer&apos;s verification</p>

        <div className='mt-8 mb-4'>
          <Tabs defaultValue="data-verification" >
            <TabsList>
              {
                tabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))
              }
            </TabsList>
            <TabsContent value="data-verification">
              <DataVerification />
            </TabsContent>
            <TabsContent value="document-liveness">
              {/* <CustomerQueueList variant='rejected' /> */}
            </TabsContent>
            <TabsContent value="pep-sanction-adverse">
              {/* <CustomerQueueList variant='ready-for-verification' /> */}
            </TabsContent>
          </Tabs>
        </div>

      </div>
    </div>
  )
}
