import { TrendingUp, TrendingDown } from 'lucide-react'



export function StatCard({
  label,
  value,
  unit,
  trend,
  trendValue,
  color = 'primary',
}) {
  const colorClasses = {
    primary: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800',
    secondary:
      'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800',
    accent:
      'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800',
    destructive:
      'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800',
  }

  const textColorClasses = {
    primary: 'text-blue-900 dark:text-blue-100',
    secondary: 'text-purple-900 dark:text-purple-100',
    accent: 'text-amber-900 dark:text-amber-100',
    destructive: 'text-red-900 dark:text-red-100',
  }

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-3xl font-bold ${textColorClasses[color]}`}>{value}</p>
          {unit && <p className="text-xs text-muted-foreground mt-1">{unit}</p>}
        </div>
        {trend && trendValue && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {trend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trendValue}
          </div>
        )}
      </div>
    </div>
  )
}
