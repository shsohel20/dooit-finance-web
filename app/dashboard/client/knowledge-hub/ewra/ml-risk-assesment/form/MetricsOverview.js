import { TrendingDown, Users, Target, Activity } from 'lucide-react'

export default function MetricsOverview() {
  const metrics = [
    {
      label: 'Current Accuracy',
      value: '75%',
      change: '-5.2%',
      status: 'warning',
      icon: Activity,
    },
    {
      label: 'Performance Gap',
      value: '8.3%',
      change: 'increasing',
      status: 'alert',
      icon: TrendingDown,
    },
    {
      label: 'Customers Affected',
      value: '1,243',
      change: '+145',
      status: 'warning',
      icon: Users,
    },
    {
      label: 'Mitigation Progress',
      value: '65%',
      change: '+12%',
      status: 'success',
      icon: Target,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon
        const statusColors = {
          success: 'from-green-50 to-green-50/50 border-green-200',
          warning: 'from-amber-50 to-amber-50/50 border-amber-200',
          alert: 'from-red-50 to-red-50/50 border-red-200',
        }

        return (
          <div
            key={idx}
            className={`relative bg-gradient-to-br ${statusColors[metric.status]} border rounded-lg p-5 overflow-hidden group hover:shadow-md transition-all`}
          >
            {/* Background accent */}
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br opacity-5 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-border">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${metric.status === 'success'
                  ? 'bg-green-100 text-green-700'
                  : metric.status === 'warning'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-foreground">{metric.value}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
