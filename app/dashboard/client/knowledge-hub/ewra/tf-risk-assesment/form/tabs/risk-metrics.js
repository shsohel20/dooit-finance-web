import { Card } from '@/components/ui/card'
import { AlertTriangle, TrendingUp, Users, DollarSign } from 'lucide-react'

export function RiskMetrics() {
  const metrics = [
    {
      label: 'Offshore Destination High',
      value: 'Critical',
      icon: AlertTriangle,
      color: 'text-critical',
      bgColor: 'bg-critical/10'
    },
    {
      label: 'Large Amount Medium',
      value: 'High Risk',
      icon: DollarSign,
      color: 'text-critical',
      bgColor: 'bg-critical/10'
    },
    {
      label: 'Unusual Pattern High',
      value: 'Medium',
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Customer History Low',
      value: 'Green',
      icon: Users,
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric, idx) => (
        <Card key={idx} className="bg-card border-border p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">{metric.label}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{metric.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
