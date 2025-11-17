'use client'

import { AlertCircle, TrendingUp, Zap } from 'lucide-react'



const riskFactors = [
  {
    title: 'Unusual Transaction Amounts',
    description: 'Transactions significantly higher than customer\'s typical behavior patterns. Detected in 14% of high-risk transactions.',
    icon: TrendingUp,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  {
    title: 'Geographic Anomalies',
    description: 'Transactions originating from locations inconsistent with customer history. Detected in 28% of high-risk transactions.',
    icon: AlertCircle,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  {
    title: 'Rapid Successive Transactions',
    description: 'Multiple transactions in short timeframes indicating potential testing behavior. Detected in 21% of high-risk transactions.',
    icon: Zap,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
]

export function RiskFactorsPanel() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">Top Transaction Risk Factors</h2>
      <div className="space-y-4">
        {riskFactors.map((factor) => {
          const Icon = factor.icon
          return (
            <div key={factor.title} className="flex gap-4 rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div className={`${factor.bgColor} rounded-lg p-3 flex-shrink-0 h-fit`}>
                <Icon className={`${factor.color} h-5 w-5`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">{factor.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{factor.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
