import React, { Suspense } from 'react'
import AddCompany from '@/views/companies/add'
export default function AddCompanyPage() {
  return (
    <div>
      <Suspense>
        <AddCompany />
      </Suspense>
    </div>
  )
}
