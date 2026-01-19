import React from 'react'
import { StatsCards } from './StatCards'
import { RecentMatters } from './RecentMatters'
import { SettlementCalendar } from './SettlementCalender'
import { ComplianceOverview } from './ComplianceOverview'
import { ActivityFeed } from './ActivityFeed'

export default function RealEstateDashboard() {
  return (
    <div>
      <main className="flex-1 space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Jennifer. Here&apos;s what&apos;s happening today.</p>
        </div>

        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentMatters />
          <SettlementCalendar />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <ComplianceOverview />
          <ActivityFeed />
        </div>
      </main>
    </div>
  )
}
