import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import CustomerQueueList from '@/views/onboarding/customer-queue/list'
import { PageDescription, PageHeader, PageTitle } from '@/components/common';
import CustomerQueueHeader from '@/views/onboarding/customer-queue/header';
import PendingCollection from '@/views/onboarding/customer-queue/list/PendingCollection';
import Rejected from '@/views/onboarding/customer-queue/list/Rejected';
import Verified from '@/views/onboarding/customer-queue/list/Verified';

export default function Page() {

  return (
    <div>
      <CustomerQueueHeader />

      <Tabs defaultValue="pending-collection">
        <TabsList>
          <TabsTrigger value="all-applications">
            All
            <Badge variant="secondary">100</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending-collection">
            Pending Collection
            <Badge variant="secondary">13</Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected-applications">
            Rejected Applications
          </TabsTrigger>
          <TabsTrigger value="ready-for-verification">
            Ready for Verification
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all-applications">
          <CustomerQueueList />
        </TabsContent>
        <TabsContent value="pending-collection">
          <PendingCollection />
        </TabsContent>
        <TabsContent value="rejected-applications">
          <Rejected />
        </TabsContent>
        <TabsContent value="ready-for-verification">
          <Verified />
        </TabsContent>
      </Tabs>
    </div>
  )
}
