import { Zap, RotateCw, AlertTriangle, CheckCircle } from 'lucide-react'

export default function QuickActionsSection() {
  const actions = [
    {
      icon: Zap,
      label: 'Model Update',
      description: 'Deploy updated ML model',
      color: 'from-red-500 to-red-600',
      textColor: 'text-white',
      status: 'critical',
    },
    {
      icon: RotateCw,
      label: 'Mitigation Plan',
      description: 'Execute recovery strategy',
      color: 'from-orange-500 to-orange-600',
      textColor: 'text-white',
      status: 'warning',
    },
    {
      icon: AlertTriangle,
      label: 'Escalation',
      description: 'Alert management team',
      color: 'from-blue-500 to-cyan-600',
      textColor: 'text-white',
      status: 'pending',
    },
    {
      icon: CheckCircle,
      label: 'Deploy Changes',
      description: 'Apply mitigation measures',
      color: 'from-green-500 to-emerald-600',
      textColor: 'text-white',
      status: 'ready',
    },
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon
          return (
            <button
              key={idx}
              className="group relative overflow-hidden rounded-lg p-4 text-left transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-90 group-hover:opacity-100 transition-opacity`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <Icon className="w-5 h-5 text-white" />
                  <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">{action.status}</span>
                </div>
                <p className="text-white font-medium text-sm">{action.label}</p>
                <p className="text-white/80 text-xs mt-1">{action.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
