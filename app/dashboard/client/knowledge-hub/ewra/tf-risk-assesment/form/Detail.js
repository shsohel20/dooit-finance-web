'use client'

import { useState } from 'react'
import { ArrowLeft, AlertCircle, CheckCircle2, XCircle, MessageSquare, Flag } from 'lucide-react'
import { Button } from '@/components/ui/button'

import { TransactionHeader } from './transaction-header'
import { RiskMetrics } from './risk-metrics'
import { ActionButtons } from './action-buttons'

import { RiskAnalysis } from './risk-analysis'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export function TransactionDetail({ openDetail, setOpenDetail }) {
  const [activeTab, setActiveTab] = useState('analysis')

  return (
    <Sheet open={openDetail} onOpenChange={setOpenDetail}>
      <SheetContent className='sm:max-w-5xl w-full overflow-y-auto'>
        <SheetHeader>
          <SheetTitle>Transaction Detail</SheetTitle>
        </SheetHeader>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="hover:text-muted-foreground transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">TX-7534-2023</h1>
                    <p className="text-sm text-muted-foreground">Offshore Transfer Review</p>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90">Verify Overview</Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Left Column - Transaction Details */}
              <div className="lg:col-span-2 space-y-6">
                <TransactionHeader />
                <RiskMetrics />
                <RiskAnalysis activeTab={activeTab} setActiveTab={setActiveTab} />
              </div>

              {/* Right Column - Quick Actions */}
              <div className="lg:col-span-1">
                <ActionButtons />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
