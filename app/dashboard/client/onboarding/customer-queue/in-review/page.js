import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import InReview from '@/views/onboarding/customer-queue/list/InReview'
import React from 'react'
export default function InReviewPage() {
  return (
    <div>
      <PageHeader>
        <PageTitle>In Review Customers</PageTitle>
        <PageDescription>Manage and track all in review customers</PageDescription>
      </PageHeader>
      <InReview />
    </div>
  )
}