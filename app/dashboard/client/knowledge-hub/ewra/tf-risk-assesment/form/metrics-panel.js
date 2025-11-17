'use client'

import { CheckCircle2, AlertTriangle, Clock, Target } from 'lucide-react'



const metrics = [
  {
    label: 'Detection Rate',
    value: '94.7%',
    icon: CheckCircle2,
    color: 'text-chart-3',
  },
  {
    label: 'False Positive Rate',
    value: '2.3%',
    icon: AlertTriangle,
    color: 'text-accent',
  },
  {
    label: 'Avg. Response Time',
    value: '18 min',
    icon: Clock,
    color: 'text-primary',
  },
  {
    label: 'Model Accuracy',
    value: '98.2%',
    icon: Target,
    color: 'text-chart-1',
  },
]

export function MetricsPanel() {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <h2 className="mb-6 text-lg font-semibold text-foreground">Prevention & Detection</h2>
      <div className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <div key={metric.label} className="rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
                  <p className="mt-2 text-xl font-bold text-foreground">{metric.value}</p>
                </div>
                <Icon className={`${metric.color} h-5 w-5 flex-shrink-0 mt-1`} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
