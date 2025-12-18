import { PageDescription, PageHeader, PageTitle } from '@/components/common'
import RiskAssessmentSection from '@/views/risk-assesment/reporting-section'
import React from 'react'

export default function RiskAssesmentPage() {
  return (
   <>
     

    <div className=' blurry-overlay'>
      {/* <PageHeader>
        <PageTitle>Compliance Reporting</PageTitle>
        <PageDescription>Create and manage regulatory reports for AUSTRAC compliance</PageDescription>
      </PageHeader> */}
         
      <div className=''>
        <RiskAssessmentSection />
      </div>
    </div>
   </>
  )
}
