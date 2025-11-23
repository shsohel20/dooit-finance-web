import { Card } from '@/components/ui/card'
import { AlertCircle, Shield } from 'lucide-react'

export function TransactionHeader() {
  const riskLevel = 'High'
  const riskScore = 78

  return (
    <Card className="bg-card border-border p-6">
      <div className="grid grid-cols-2 gap-8">
        {/* Left side - Transaction Info */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</p>
            <p className="text-lg font-semibold text-foreground">Alice Green</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Account Number</p>
            <p className="text-lg font-mono text-foreground">DV-CLA7-7632</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Transaction Type</p>
            <p className="text-lg font-semibold text-foreground">Offshore Transfer</p>
          </div>
        </div>

        {/* Right side - Risk Score & Amount */}
        <div className="space-y-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Amount</p>
            <p className="text-3xl font-bold text-foreground">$45,200.00</p>
            <p className="text-xs text-muted-foreground mt-1">October 23, 2023 • 10:32 AM</p>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-critical/20 rounded-full blur"></div>
                <div className="relative h-16 w-16 rounded-full bg-critical/10 border-2 border-critical flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-critical" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Risk Score</p>
                <p className="text-3xl font-bold text-critical">{riskScore}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Patterns */}
      <div className="mt-8 pt-8 border-t border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">Patterns Detected</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <span className="text-sm text-foreground font-medium">Offshore Destination</span>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-destructive/20 text-destructive">Critical</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-critical/10 border border-critical/30">
            <span className="text-sm text-foreground font-medium">Unusual Transaction Pattern</span>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-critical/20 text-critical">High Risk</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/30">
            <span className="text-sm text-foreground font-medium">Large Amount</span>
            <span className="px-2 py-1 rounded text-xs font-semibold bg-warning/20 text-warning">Medium</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
