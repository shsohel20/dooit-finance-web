import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import Rejected from '@/views/onboarding/customer-queue/list/Rejected'
import React from 'react'
export default function RejectedPage() {
  return (
    <div>
      <PageHeader>
        <PageTitle>Rejected Customers</PageTitle>
        <PageDescription>Manage and track all rejected customers</PageDescription>
      </PageHeader>
      <Rejected />
    </div>
  )
}