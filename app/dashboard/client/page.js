'use client'

import useGetUser from '@/hooks/useGetUser';
import ClientDashboard from '@/views/client-dashboard'
import PreciousMetalDashboard from '@/views/precious-metal/dashboard';
import RealEstateDashboard from '@/views/real-estate/dashboard';
import React from 'react'

export default function DashboardClientPage() {
  const { loggedInUser } = useGetUser();
  const clientType = loggedInUser?.client?.clientType;
  console.log('clienttype', clientType)
  const isRealState = clientType === "Real Estate";
  const isFinancial = clientType === "Financial";
  const isPreciousMetal=clientType==='Precious Metal'

  return (
    <div>
      {isRealState && <RealEstateDashboard />}
      {isFinancial && <ClientDashboard />}
      {isPreciousMetal && <PreciousMetalDashboard/>}
    </div>
  )
}
