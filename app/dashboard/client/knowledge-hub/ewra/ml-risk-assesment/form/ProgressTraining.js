import { BarChart3 } from 'lucide-react'

export default function ProgressTraining() {
  const trainingItems = [
    { label: 'Model Training', percent: 85, color: 'bg-blue-500' },
    { label: 'Data Processing', percent: 72, color: 'bg-cyan-500' },
    { label: 'Validation', percent: 60, color: 'bg-purple-500' },
    { label: 'Deployment', percent: 45, color: 'bg-violet-500' },
  ]

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold text-foreground">Progress Training</h2>
      </div>
      <div className="space-y-4">
        {trainingItems.map((item, idx) => (
          <div key={idx}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <span className="text-sm font-semibold text-foreground">{item.percent}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-500`}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
