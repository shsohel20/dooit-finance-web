import { Database, Clock, Settings, Zap } from 'lucide-react'

export default function SystemDetails() {
  const sections = [
    {
      title: 'Configuration Details',
      icon: Settings,
      items: [
        { label: 'Mode', value: 'Production' },
        { label: 'Version', value: '2.3.1' },
        { label: 'Last Updated', value: 'Mar 15, 2024 10:32' },
      ],
    },
    {
      title: 'Detection Settings',
      icon: Database,
      items: [
        { label: 'Detection Type', value: 'Real-time Analysis' },
        { label: 'Threshold', value: '0.85' },
        { label: 'Response Time', value: '< 100ms' },
      ],
    },
    {
      title: 'Impact Assessment',
      icon: Zap,
      items: [
        { label: 'Fraud Prevented', value: '$2.4M' },
        { label: 'False Positives', value: '2.1%' },
        { label: 'Detection Rate', value: '94.7%' },
      ],
    },
  ]

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-foreground mb-4">System Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, sectionIdx) => {
          const Icon = section.icon
          return (
            <div
              key={sectionIdx}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-md hover:border-border/80 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground">{section.title}</h3>
              </div>
              <div className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="border-t border-border pt-3 first:border-t-0 first:pt-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-medium text-foreground mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
