import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import Verified from '@/views/onboarding/customer-queue/list/Verified'
import React from 'react'

export default function VerifiedPage() {
  return (
    <div>
      <PageHeader>
        <PageTitle>Verified Customers</PageTitle>
        <PageDescription>Manage and track all verified customers</PageDescription>
      </PageHeader>
      <Verified />
    </div>
  )
}