'use client'

import useGetUser from '@/hooks/useGetUser';
import ClientDashboard from '@/views/client-dashboard'
import RealEstateDashboard from '@/views/real-estate/dashboard';
import React from 'react'

export default function DashboardClientPage() {
  const { loggedInUser } = useGetUser();
  const clientType = loggedInUser?.client?.clientType;
  const isRealState = clientType === "Real Estate";
  const isFinancial = clientType === "Financial";

  return (
    <div>
      {isRealState && <RealEstateDashboard />}
      {isFinancial && <ClientDashboard />}
    </div>
  )
}
