import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import BranchList from '@/views/branch/list'
import React from 'react'

export default function BranchPage() {
  return (
    <div>
      <PageHeader>
        <PageTitle>Branch Management</PageTitle>
        <PageDescription>Manage and track all branches</PageDescription>
      </PageHeader>
      <BranchList />
    </div>
  )
}
