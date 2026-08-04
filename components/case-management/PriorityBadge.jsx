import { Badge } from '@/components/ui/badge';

const PRIORITY_CONFIG = {
  low: { variant: 'success', label: 'Low' },
  medium: { variant: 'warning', label: 'Medium' },
  high: { variant: 'danger', label: 'High' },
  critical: { variant: 'dark', label: 'Critical' },
};

export default function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] ?? { variant: 'outline', label: priority };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
