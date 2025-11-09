"use client"

import { ECDDForm } from '@/components/ecdd-form'
import { GFSForm } from '@/components/gfs-form'
import { IFTIForm } from '@/components/ifti-form'
import { ReportNavigation } from '@/components/report-navigation'
import { SuspiciousMatterReportForm } from '@/components/smr-form'
import { TTRForm } from '@/components/ttr-form'
import React, { useState } from 'react'

export default function ReportAndCompliance() {
  const [activeReport, setActiveReport] = useState("smr")
  return (
    <div>
      <ReportNavigation activeReport={activeReport} onReportChange={setActiveReport} />
      {activeReport === "smr" && <SuspiciousMatterReportForm />}
      {activeReport === "ecdd" && <ECDDForm />}
      {activeReport === "ifti" && <IFTIForm />}
      {activeReport === "ttr" && <TTRForm />}
      {activeReport === "gfs" && <GFSForm />}
    </div>
  )
}
