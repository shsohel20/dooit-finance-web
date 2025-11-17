import React from 'react'
import { Card } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function RiskPanel() {
  return (
    <div> <div className="grid grid-cols-2 gap-6">
      {/* Risk Factors */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Risk Factors</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/30">
            <span className="text-sm text-foreground">Offshore Destination High</span>
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-critical/20">
              <span className="text-xs font-bold text-critical">C</span>
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/30">
            <span className="text-sm text-foreground">Large Amount Medium</span>
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-warning/20">
              <span className="text-xs font-bold text-warning">M</span>
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/30">
            <span className="text-sm text-foreground">Unusual Pattern High</span>
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-critical/20">
              <span className="text-xs font-bold text-critical">H</span>
            </span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/30">
            <span className="text-sm text-foreground">Customer History Low</span>
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-success/20">
              <span className="text-xs font-bold text-success">L</span>
            </span>
          </div>
        </div>
      </Card>

      {/* Risk Breakdown */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">Risk Breakdown</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-foreground">Transaction Patterns</span>
              <span className="text-sm font-semibold text-foreground">45%</span>
            </div>
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
              <div className="h-full w-[45%] bg-critical rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-foreground">Amount Risk</span>
              <span className="text-sm font-semibold text-foreground">30%</span>
            </div>
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
              <div className="h-full w-[30%] bg-warning rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-foreground">Customer Profile</span>
              <span className="text-sm font-semibold text-foreground">15%</span>
            </div>
            <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
              <div className="h-full w-[15%] bg-success rounded-full"></div>
            </div>
          </div>
        </div>
      </Card>
    </div></div>
  )
}
