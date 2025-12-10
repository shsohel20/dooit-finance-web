import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from '@/components/ui/badge'
import CustomerQueueList from '@/views/onboarding/customer-queue/list'
import { PageDescription, PageHeader, PageTitle } from '@/components/common';
import CustomerQueueHeader from '@/views/onboarding/customer-queue/header';
import PendingCollection from '@/views/onboarding/customer-queue/list/PendingCollection';
import Rejected from '@/views/onboarding/customer-queue/list/Rejected';
import Verified from '@/views/onboarding/customer-queue/list/Verified';
import { Card } from '@/components/ui/card';
import CustomerDashboard from '@/views/onboarding/customer-queue/list/Dashboard';

export default function Page() {

  return (
    <div>
      <div>
        <CustomerQueueHeader />
        <CustomerDashboard />
        <Tabs defaultValue="pending-collection">
          <TabsList>
            <TabsTrigger value="all-applications">
              All
              <Badge variant="secondary">100</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending-collection">
              Pending
              <Badge variant="secondary">13</Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected-applications">
              Rejected
            </TabsTrigger>
            <TabsTrigger value="in_review">
              In Review
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all-applications">
            <CustomerQueueList kycStatus='' />
          </TabsContent>
          <TabsContent value="pending-collection">
            <PendingCollection kycStatus='pending' />
          </TabsContent>
          <TabsContent value="rejected-applications">
            <Rejected kycStatus='rejected' />
          </TabsContent>
          <TabsContent value="in_review">
            <Verified kycStatus='verified' />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
