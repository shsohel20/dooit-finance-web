'use client'

import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { TransactionTable } from './transaction-table'
import { RiskFactorsPanel } from './risk-factors-panel'
import { MetricsPanel } from './metrics-panel'


export function TransactionDashboard() {
  return (
    <div className="flex flex-col gap-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance Review</h1>
          <p className="mt-2 text-sm text-muted-foreground">High-Risk Transactions Requiring Review</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            className="rounded-lg border border-border bg-secondary px-10 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-8">
        {/* Transactions Table */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Flagged Transactions</h2>
          <TransactionTable />
        </div>

        {/* Bottom Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Risk Factors - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <RiskFactorsPanel />
          </div>

          {/* Metrics Panel - Takes 1 column */}
          <div>
            <MetricsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}
