import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Flag, Check, X, FileText } from 'lucide-react'

export function ActionButtons() {
  const actions = [
    {
      label: 'Contact Customer',
      icon: MessageSquare,
      variant: 'secondary',
      className: 'bg-secondary hover:bg-secondary/30 border-secondary/30'
    },
    {
      label: 'Flag Transaction',
      icon: Flag,
      variant: 'secondary',
      className: 'bg-accent hover:bg-accent/30  border-accent/30'
    },
    {
      label: 'Request Information',
      icon: FileText,
      variant: 'outline',
      className: 'bg-primary/20 hover:bg-primary/30 text-primary border-primary/30'
    },
    {
      label: 'Approve',
      icon: Check,
      variant: 'outline',
      className: 'bg-success/20 hover:bg-success/30 text-success border-success/30'
    },
    {
      label: 'Reject',
      icon: X,
      variant: 'outline',
      className: 'bg-destructive/20 hover:bg-destructive/30 text-destructive border-destructive/30'
    }
  ]

  return (
    <Card className="bg-card border-border p-6 sticky top-8">
      <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">Quick Actions</h3>
      <div className="space-y-3">
        {actions.map((action, idx) => (
          <Button
            key={idx}
            variant="outline"
            className={`w-full justify-start gap-2 h-11 border-2 ${action.className}`}
          >
            <action.icon className="h-4 w-4" />
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  )
}
