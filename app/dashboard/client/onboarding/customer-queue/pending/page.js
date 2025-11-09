import React from 'react'
import PendingCollection from '@/views/onboarding/customer-queue/list/PendingCollection'
import { PageDescription, PageHeader, PageTitle } from '@/components/common'
export default function PendingCollectionPage() {
  return (
    <div>
      <PageHeader>
        <PageTitle>Pending Customers</PageTitle>
        <PageDescription>Manage and track all pending customers</PageDescription>
      </PageHeader>
      <PendingCollection />
    </div>
  )
}